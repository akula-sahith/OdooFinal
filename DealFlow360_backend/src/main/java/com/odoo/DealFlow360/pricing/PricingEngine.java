package com.odoo.DealFlow360.pricing;

import com.odoo.DealFlow360.product.Product;
import com.odoo.DealFlow360.product.ProductVariant;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Dedicated business engine responsible for resolving applicable unit prices
 * and calculating line amounts based on price lists, quantity tiers, variants,
 * and products.
 */
@Service
public class PricingEngine {

    private final PriceListService priceListService;
    private final PriceListItemService priceListItemService;

    public PricingEngine() {
        this.priceListService = new PriceListService();
        this.priceListItemService = new PriceListItemService();
    }

    @Autowired
    public PricingEngine(PriceListService priceListService, PriceListItemService priceListItemService) {
        this.priceListService = priceListService != null ? priceListService : new PriceListService();
        this.priceListItemService = priceListItemService != null ? priceListItemService : new PriceListItemService();
    }

    /**
     * Resolves the applicable selling price and calculates net, tax, and gross
     * amounts.
     *
     * Implementation Policies & Precedence Rules:
     * 1. Price List Validity: The price list must be active at pricingInstant
     * according to PriceListService.isActive bounds.
     * 2. Currency Matching: Price list currency and product currency must match.
     * Currency conversion is unavailable in this iteration.
     * 3. Quantity Tiers: Resolves the applicable item having the HIGHEST
     * minQuantity that is <= requested quantity.
     * 4. Variant Precedence:
     * - If a variant is requested, the engine first searches for variant-specific
     * price list items matching variant ID.
     * - If no variant-specific items apply, it falls back to product-level price
     * list items (where productVariantId is null).
     *
     * @param priceList      PriceList entity
     * @param items          List of candidate PriceListItem entries
     * @param product        Product entity
     * @param variant        Optional ProductVariant entity (may be null)
     * @param quantity       Requested quantity (> 0)
     * @param pricingInstant Requested point in time for validity check
     * @return Calculated PriceCalculationResult
     */
    public PriceCalculationResult calculatePrice(PriceList priceList, List<PriceListItem> items, Product product,
            ProductVariant variant, int quantity, Instant pricingInstant) {
        if (product == null) {
            throw new IllegalArgumentException("Product cannot be null");
        }
        if (priceList == null) {
            throw new IllegalArgumentException("Price list cannot be null");
        }
        if (quantity <= 0) {
            throw new IllegalArgumentException("Requested quantity must be positive (> 0)");
        }
        if (pricingInstant == null) {
            throw new IllegalArgumentException("Pricing instant cannot be null");
        }

        // 1. Verify Price List Activity
        if (!priceListService.isActive(priceList, pricingInstant)) {
            throw new IllegalArgumentException(
                    "Price list is not active for the requested pricing instant: " + pricingInstant);
        }

        // 2. Verify Currency Incompatibility
        if (priceList.getCurrency() != null && product.getCurrency() != null) {
            if (!priceList.getCurrency().trim().equalsIgnoreCase(product.getCurrency().trim())) {
                throw new IllegalArgumentException("Currency mismatch: Price list currency (" + priceList.getCurrency()
                        + ") does not match product currency (" + product.getCurrency() + ")");
            }
        }

        // 3. Filter candidates matching priceListId and productId and minQuantity <=
        // quantity
        if (items == null || items.isEmpty()) {
            throw new IllegalArgumentException("No price list items supplied");
        }

        List<PriceListItem> validCandidates = items.stream()
                .filter(item -> item != null)
                .filter(item -> priceList.getId() == null || priceList.getId().equals(item.getPriceListId()))
                .filter(item -> product.getId() != null && product.getId().equals(item.getProductId()))
                .filter(item -> item.getMinQuantity() != null && item.getMinQuantity() <= quantity)
                .collect(Collectors.toList());

        PriceListItem selectedItem = null;

        // 4. Variant-Specific Resolution with Fallback
        if (variant != null && variant.getId() != null) {
            // First attempt: match variant-specific price list items
            Optional<PriceListItem> variantMatch = validCandidates.stream()
                    .filter(item -> variant.getId().equals(item.getProductVariantId()))
                    .max(Comparator.comparingInt(PriceListItem::getMinQuantity));

            if (variantMatch.isPresent()) {
                selectedItem = variantMatch.get();
            } else {
                // Fallback: match product-level price list items (where variantId is null)
                selectedItem = validCandidates.stream()
                        .filter(item -> item.getProductVariantId() == null)
                        .max(Comparator.comparingInt(PriceListItem::getMinQuantity))
                        .orElse(null);
            }
        } else {
            // Product-level resolution only (variantId is null)
            selectedItem = validCandidates.stream()
                    .filter(item -> item.getProductVariantId() == null)
                    .max(Comparator.comparingInt(PriceListItem::getMinQuantity))
                    .orElse(null);
        }

        if (selectedItem == null) {
            throw new IllegalArgumentException(
                    "No applicable price list item found for product/variant and requested quantity: " + quantity);
        }

        // Validate resolved item
        priceListItemService.validatePriceListItem(selectedItem);

        // 5. Line Amount Calculations (BigDecimal)
        BigDecimal unitPrice = selectedItem.getUnitPrice();
        BigDecimal netAmount = unitPrice.multiply(BigDecimal.valueOf(quantity));

        BigDecimal taxPercent = product.getTaxPercent() != null ? product.getTaxPercent() : BigDecimal.ZERO;
        BigDecimal taxAmount = netAmount.multiply(taxPercent).divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP);
        BigDecimal grossAmount = netAmount.add(taxAmount);

        String currency = priceList.getCurrency() != null ? priceList.getCurrency() : product.getCurrency();

        return new PriceCalculationResult(
                product.getId(),
                variant != null ? variant.getId() : null,
                priceList.getId(),
                quantity,
                unitPrice,
                netAmount,
                taxAmount,
                grossAmount,
                currency);
    }
}
