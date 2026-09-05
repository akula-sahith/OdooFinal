package com.odoo.DealFlow360.pricing;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;

/**
 * Business service handling PriceListItem validation and domain operations.
 */
@Service
public class PriceListItemService {

    /**
     * Validates domain constraints on a PriceListItem entity.
     *
     * @param item PriceListItem entity to validate
     */
    public void validatePriceListItem(PriceListItem item) {
        if (item == null) {
            throw new IllegalArgumentException("Price list item cannot be null");
        }
        if (item.getPriceListId() == null || item.getPriceListId() <= 0) {
            throw new IllegalArgumentException("Price list item must be associated with a valid positive Price List ID");
        }
        if (item.getProductId() == null || item.getProductId() <= 0) {
            throw new IllegalArgumentException("Price list item must be associated with a valid positive Product ID");
        }
        if (item.getProductVariantId() != null && item.getProductVariantId() <= 0) {
            throw new IllegalArgumentException("Product Variant ID must be a positive number if specified");
        }
        if (item.getUnitPrice() == null || item.getUnitPrice().compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Unit price cannot be null or negative");
        }
        if (item.getMinQuantity() == null || item.getMinQuantity() <= 0) {
            throw new IllegalArgumentException("Minimum quantity must be a positive integer (> 0)");
        }
    }

    /**
     * Creates and validates a PriceListItem instance.
     */
    public PriceListItem createPriceListItem(Long id, Long priceListId, Long productId, Long productVariantId, BigDecimal unitPrice, Integer minQuantity) {
        PriceListItem item = new PriceListItem(
                id,
                priceListId,
                productId,
                productVariantId,
                unitPrice,
                minQuantity != null ? minQuantity : 1
        );
        validatePriceListItem(item);
        return item;
    }
}
