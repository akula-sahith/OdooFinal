package com.odoo.DealFlow360.pricing;

import com.odoo.DealFlow360.product.Product;
import com.odoo.DealFlow360.product.ProductVariant;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class PricingEngineTest {

    private PricingEngine pricingEngine;
    private PriceList activePriceList;
    private Product baseProduct;
    private Instant now;

    @BeforeEach
    void setUp() {
        pricingEngine = new PricingEngine();
        now = Instant.now();
        activePriceList = new PriceList(100L, null, "USD", now.minusSeconds(3600), now.plusSeconds(3600));
        baseProduct = new Product(10L, "Enterprise Software", 1L, new BigDecimal("100.00"), new BigDecimal("10.00"), "USD", true);
    }

    @Test
    @DisplayName("Should resolve single applicable price list item and calculate net, tax, gross correctly")
    void testSingleApplicablePrice() {
        PriceListItem item = new PriceListItem(1L, 100L, 10L, null, new BigDecimal("80.00"), 1);
        List<PriceListItem> items = Collections.singletonList(item);

        PriceCalculationResult result = pricingEngine.calculatePrice(activePriceList, items, baseProduct, null, 2, now);

        assertThat(result).isNotNull();
        assertThat(result.getUnitPrice()).isEqualTo(new BigDecimal("80.00"));
        assertThat(result.getNetAmount()).isEqualTo(new BigDecimal("160.00")); // 80 * 2
        assertThat(result.getTaxAmount()).isEqualTo(new BigDecimal("16.00")); // 160 * 10%
        assertThat(result.getGrossAmount()).isEqualTo(new BigDecimal("176.00")); // 160 + 16
        assertThat(result.getCurrency()).isEqualTo("USD");
    }

    @Test
    @DisplayName("Should select highest applicable minQuantity tier for quantity tier resolution")
    void testQuantityTierSelection() {
        // Tiers: 1-9 -> 100.00, 10-49 -> 95.00, 50+ -> 90.00
        PriceListItem tier1 = new PriceListItem(1L, 100L, 10L, null, new BigDecimal("100.00"), 1);
        PriceListItem tier10 = new PriceListItem(2L, 100L, 10L, null, new BigDecimal("95.00"), 10);
        PriceListItem tier50 = new PriceListItem(3L, 100L, 10L, null, new BigDecimal("90.00"), 50);

        List<PriceListItem> items = Arrays.asList(tier1, tier10, tier50);

        // Requested Qty: 25 -> Should select tier 10 (95.00)
        PriceCalculationResult result = pricingEngine.calculatePrice(activePriceList, items, baseProduct, null, 25, now);

        assertThat(result.getUnitPrice()).isEqualTo(new BigDecimal("95.00"));
        assertThat(result.getNetAmount()).isEqualTo(new BigDecimal("2375.00")); // 95 * 25
    }

    @Test
    @DisplayName("Should throw exception when requested quantity is below all applicable tiers")
    void testQuantityBelowAllTiers() {
        PriceListItem tier10 = new PriceListItem(1L, 100L, 10L, null, new BigDecimal("95.00"), 10);
        List<PriceListItem> items = Collections.singletonList(tier10);

        assertThatThrownBy(() -> pricingEngine.calculatePrice(activePriceList, items, baseProduct, null, 5, now))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("No applicable price list item found");
    }

    @Test
    @DisplayName("Should prefer variant-specific pricing over product-level pricing")
    void testVariantSpecificPricingPrecedence() {
        ProductVariant variant = new ProductVariant(5L, 10L, "Users", "50 Users", new BigDecimal("20.00"));

        PriceListItem productLevelItem = new PriceListItem(1L, 100L, 10L, null, new BigDecimal("100.00"), 1);
        PriceListItem variantSpecificItem = new PriceListItem(2L, 100L, 10L, 5L, new BigDecimal("120.00"), 1);

        List<PriceListItem> items = Arrays.asList(productLevelItem, variantSpecificItem);

        PriceCalculationResult result = pricingEngine.calculatePrice(activePriceList, items, baseProduct, variant, 1, now);

        assertThat(result.getUnitPrice()).isEqualTo(new BigDecimal("120.00"));
        assertThat(result.getProductVariantId()).isEqualTo(5L);
    }

    @Test
    @DisplayName("Should fall back to product-level pricing when no variant-specific price exists")
    void testVariantFallbackToProductLevelPricing() {
        ProductVariant variantWithoutItem = new ProductVariant(99L, 10L, "Color", "Red", new BigDecimal("0.00"));

        PriceListItem productLevelItem = new PriceListItem(1L, 100L, 10L, null, new BigDecimal("100.00"), 1);
        List<PriceListItem> items = Collections.singletonList(productLevelItem);

        PriceCalculationResult result = pricingEngine.calculatePrice(activePriceList, items, baseProduct, variantWithoutItem, 1, now);

        assertThat(result.getUnitPrice()).isEqualTo(new BigDecimal("100.00"));
    }

    @Test
    @DisplayName("Should throw exception when price list is inactive at the pricing instant")
    void testInactivePriceListIgnored() {
        PriceList inactivePriceList = new PriceList(100L, null, "USD", now.minusSeconds(7200), now.minusSeconds(3600));
        PriceListItem item = new PriceListItem(1L, 100L, 10L, null, new BigDecimal("100.00"), 1);

        assertThatThrownBy(() -> pricingEngine.calculatePrice(inactivePriceList, Collections.singletonList(item), baseProduct, null, 1, now))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Price list is not active");
    }

    @Test
    @DisplayName("Should throw exception when currencies between price list and product do not match")
    void testCurrencyMismatch() {
        PriceList eurPriceList = new PriceList(200L, null, "EUR", now.minusSeconds(3600), now.plusSeconds(3600));
        PriceListItem item = new PriceListItem(1L, 200L, 10L, null, new BigDecimal("100.00"), 1);

        assertThatThrownBy(() -> pricingEngine.calculatePrice(eurPriceList, Collections.singletonList(item), baseProduct, null, 1, now))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Currency mismatch");
    }

    @Test
    @DisplayName("Should verify exact BigDecimal calculation precision without double/float rounding errors")
    void testBigDecimalCalculationPrecision() {
        Product highPrecisionProduct = new Product(20L, "SaaS Tier", 1L, new BigDecimal("199.99"), new BigDecimal("7.50"), "USD", true);
        PriceListItem item = new PriceListItem(1L, 100L, 20L, null, new BigDecimal("199.99"), 1);

        PriceCalculationResult result = pricingEngine.calculatePrice(activePriceList, Collections.singletonList(item), highPrecisionProduct, null, 3, now);

        // 199.99 * 3 = 599.97
        assertThat(result.getNetAmount()).isEqualTo(new BigDecimal("599.97"));
        // 599.97 * 7.50% = 44.99775 -> rounded HALF_UP to 45.00
        assertThat(result.getTaxAmount()).isEqualTo(new BigDecimal("45.00"));
        // 599.97 + 45.00 = 644.97
        assertThat(result.getGrossAmount()).isEqualTo(new BigDecimal("644.97"));
    }

    @Test
    @DisplayName("Should select tier when requested quantity equals minQuantity exactly")
    void testQuantityExactMinQuantityMatch() {
        PriceListItem tier10 = new PriceListItem(1L, 100L, 10L, null, new BigDecimal("95.00"), 10);
        PriceCalculationResult result = pricingEngine.calculatePrice(activePriceList, Collections.singletonList(tier10), baseProduct, null, 10, now);

        assertThat(result.getUnitPrice()).isEqualTo(new BigDecimal("95.00"));
    }

    @Test
    @DisplayName("Should throw exception when requested quantity is zero or negative")
    void testInvalidQuantityInput() {
        PriceListItem item = new PriceListItem(1L, 100L, 10L, null, new BigDecimal("100.00"), 1);

        assertThatThrownBy(() -> pricingEngine.calculatePrice(activePriceList, Collections.singletonList(item), baseProduct, null, 0, now))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Requested quantity must be positive");

        assertThatThrownBy(() -> pricingEngine.calculatePrice(activePriceList, Collections.singletonList(item), baseProduct, null, -5, now))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Requested quantity must be positive");
    }
}
