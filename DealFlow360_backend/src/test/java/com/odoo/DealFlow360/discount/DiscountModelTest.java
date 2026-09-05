package com.odoo.DealFlow360.discount;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;

class DiscountModelTest {

    @Test
    @DisplayName("Should create and verify DiscountTier domain model")
    void testDiscountTierModel() {
        DiscountTier tier1 = new DiscountTier(1L, "VIP Gold", new BigDecimal("25.00"));

        assertThat(tier1.getId()).isEqualTo(1L);
        assertThat(tier1.getName()).isEqualTo("VIP Gold");
        assertThat(tier1.getMaxDiscountPercent()).isEqualTo(new BigDecimal("25.00"));

        DiscountTier tier2 = new DiscountTier(1L, "VIP Gold", new BigDecimal("25.00"));

        assertThat(tier1).isEqualTo(tier2);
        assertThat(tier1.hashCode()).isEqualTo(tier2.hashCode());
        assertThat(tier1.toString()).contains("VIP Gold");
    }

    @Test
    @DisplayName("Should support null fields in DiscountTier model")
    void testDiscountTierNullability() {
        DiscountTier tier = new DiscountTier();
        tier.setId(2L);
        tier.setName("Standard");
        tier.setMaxDiscountPercent(null);

        assertThat(tier.getId()).isEqualTo(2L);
        assertThat(tier.getName()).isEqualTo("Standard");
        assertThat(tier.getMaxDiscountPercent()).isNull();
    }

    @Test
    @DisplayName("Should create and verify CategoryDiscountCeiling domain model")
    void testCategoryDiscountCeilingModel() {
        CategoryDiscountCeiling ceiling1 = new CategoryDiscountCeiling(10L, 5L, 1L, new BigDecimal("15.00"));

        assertThat(ceiling1.getId()).isEqualTo(10L);
        assertThat(ceiling1.getCategoryId()).isEqualTo(5L);
        assertThat(ceiling1.getTierId()).isEqualTo(1L);
        assertThat(ceiling1.getMaxDiscountPercent()).isEqualTo(new BigDecimal("15.00"));

        CategoryDiscountCeiling ceiling2 = new CategoryDiscountCeiling(10L, 5L, 1L, new BigDecimal("15.00"));

        assertThat(ceiling1).isEqualTo(ceiling2);
        assertThat(ceiling1.hashCode()).isEqualTo(ceiling2.hashCode());
        assertThat(ceiling1.toString()).contains("CategoryDiscountCeiling");
    }
}
