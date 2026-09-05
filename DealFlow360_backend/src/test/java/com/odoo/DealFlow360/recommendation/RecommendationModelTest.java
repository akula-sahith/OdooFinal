package com.odoo.DealFlow360.recommendation;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;

class RecommendationModelTest {

    @Test
    @DisplayName("Should create and verify UpsellRule model")
    void testUpsellRule() {
        UpsellRule rule = new UpsellRule(1L, 10L, 20L, true, new BigDecimal("15.50"));

        assertThat(rule.getId()).isEqualTo(1L);
        assertThat(rule.getBaseProductId()).isEqualTo(10L);
        assertThat(rule.getSuggestedProductId()).isEqualTo(20L);
        assertThat(rule.getIsPromoted()).isTrue();
        assertThat(rule.getMinMarginThreshold()).isEqualTo(new BigDecimal("15.50"));
    }
}
