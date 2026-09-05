package com.odoo.DealFlow360.pricing;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.Instant;

import static org.assertj.core.api.Assertions.assertThat;

class PricingModelTest {

    @Test
    @DisplayName("Should create and verify PriceList model with nullable timestamps and discount tier reference")
    void testPriceList() {
        Instant now = Instant.now();
        PriceList priceList = new PriceList(100L, 2L, "USD", now, now.plusSeconds(86400));

        assertThat(priceList.getId()).isEqualTo(100L);
        assertThat(priceList.getDiscountTierId()).isEqualTo(2L);
        assertThat(priceList.getCurrency()).isEqualTo("USD");
        assertThat(priceList.getValidFrom()).isEqualTo(now);
        assertThat(priceList.getValidTo()).isNotNull();

        PriceList nullsAllowed = new PriceList();
        assertThat(nullsAllowed.getDiscountTierId()).isNull();
        assertThat(nullsAllowed.getValidFrom()).isNull();
    }

    @Test
    @DisplayName("Should create and verify PriceListItem model")
    void testPriceListItem() {
        PriceListItem item = new PriceListItem(1L, 100L, 10L, 5L, new BigDecimal("150.00"), 5);

        assertThat(item.getId()).isEqualTo(1L);
        assertThat(item.getPriceListId()).isEqualTo(100L);
        assertThat(item.getProductId()).isEqualTo(10L);
        assertThat(item.getProductVariantId()).isEqualTo(5L);
        assertThat(item.getUnitPrice()).isEqualTo(new BigDecimal("150.00"));
        assertThat(item.getMinQuantity()).isEqualTo(5);
    }
}
