package com.odoo.DealFlow360.discount;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class DiscountRiskEngineTest {

    private DiscountRiskEngine engine;

    @BeforeEach
    void setUp() {
        engine = new DiscountRiskEngine();
    }

    @Test
    @DisplayName("1. Should evaluate discount within customer limit")
    void testDiscountWithinCustomerLimit() {
        DiscountLineRiskResult result = engine.evaluateLineRisk(
                10L, null,
                new BigDecimal("10.00"), // actual
                new BigDecimal("15.00"), // customer tier max
                null                     // category ceiling
        );

        assertThat(result.getActualDiscountPercent()).isEqualTo(new BigDecimal("10.00"));
        assertThat(result.getEffectiveAllowedDiscountPercent()).isEqualTo(new BigDecimal("15.00"));
        assertThat(result.getViolationPercent()).isEqualTo(BigDecimal.ZERO);
        assertThat(result.isApprovalRequired()).isFalse();
        assertThat(result.getPolicySource()).isEqualTo("CUSTOMER_TIER");
    }

    @Test
    @DisplayName("2. Should evaluate discount above customer limit")
    void testDiscountAboveCustomerLimit() {
        DiscountLineRiskResult result = engine.evaluateLineRisk(
                10L, null,
                new BigDecimal("20.00"), // actual
                new BigDecimal("15.00"), // customer tier max
                null
        );

        assertThat(result.getViolationPercent()).isEqualTo(new BigDecimal("5.00"));
        assertThat(result.isApprovalRequired()).isTrue();
    }

    @Test
    @DisplayName("3. Should evaluate discount within category ceiling")
    void testDiscountWithinCategoryCeiling() {
        DiscountLineRiskResult result = engine.evaluateLineRisk(
                10L, null,
                new BigDecimal("8.00"),
                null,
                new BigDecimal("10.00") // category ceiling max
        );

        assertThat(result.getEffectiveAllowedDiscountPercent()).isEqualTo(new BigDecimal("10.00"));
        assertThat(result.getViolationPercent()).isEqualTo(BigDecimal.ZERO);
        assertThat(result.isApprovalRequired()).isFalse();
        assertThat(result.getPolicySource()).isEqualTo("CATEGORY_CEILING");
    }

    @Test
    @DisplayName("4. Should evaluate discount above category ceiling")
    void testDiscountAboveCategoryCeiling() {
        DiscountLineRiskResult result = engine.evaluateLineRisk(
                10L, null,
                new BigDecimal("12.00"),
                null,
                new BigDecimal("10.00")
        );

        assertThat(result.getViolationPercent()).isEqualTo(new BigDecimal("2.00"));
        assertThat(result.isApprovalRequired()).isTrue();
    }

    @Test
    @DisplayName("5. Should choose customer limit when customer limit is stricter than category limit")
    void testCustomerLimitStricterThanCategory() {
        BigDecimal effective = engine.calculateEffectiveAllowedDiscount(
                new BigDecimal("10.00"), // customer tier (stricter)
                new BigDecimal("15.00")  // category ceiling
        );

        assertThat(effective).isEqualTo(new BigDecimal("10.00"));
    }

    @Test
    @DisplayName("6. Should choose category limit when category limit is stricter than customer limit")
    void testCategoryLimitStricterThanCustomer() {
        BigDecimal effective = engine.calculateEffectiveAllowedDiscount(
                new BigDecimal("20.00"), // customer tier
                new BigDecimal("12.00")  // category ceiling (stricter)
        );

        assertThat(effective).isEqualTo(new BigDecimal("12.00"));
    }

    @Test
    @DisplayName("7. Should handle exact boundary without violation")
    void testExactBoundary() {
        DiscountLineRiskResult result = engine.evaluateLineRisk(
                10L, null,
                new BigDecimal("15.00"), // actual
                new BigDecimal("15.00"), // customer tier max
                new BigDecimal("20.00")
        );

        assertThat(result.getViolationPercent()).isEqualTo(BigDecimal.ZERO);
        assertThat(result.isApprovalRequired()).isFalse();
    }

    @Test
    @DisplayName("8. Should return zero violation when actual discount is below limit")
    void testZeroViolation() {
        DiscountLineRiskResult result = engine.evaluateLineRisk(
                10L, null,
                new BigDecimal("5.00"),
                new BigDecimal("15.00"),
                null
        );

        assertThat(result.getViolationPercent()).isEqualTo(BigDecimal.ZERO);
        assertThat(result.isApprovalRequired()).isFalse();
    }

    @Test
    @DisplayName("9 & 10. Should aggregate multiple quotation lines using highest-line violation")
    void testMultipleQuotationLinesAggregation() {
        DiscountLineRiskResult line1 = new DiscountLineRiskResult(10L, null, new BigDecimal("10.00"), new BigDecimal("15.00"), BigDecimal.ZERO, false, "CUSTOMER_TIER");
        DiscountLineRiskResult line2 = new DiscountLineRiskResult(11L, null, new BigDecimal("25.00"), new BigDecimal("15.00"), new BigDecimal("10.00"), true, "CUSTOMER_TIER");
        DiscountLineRiskResult line3 = new DiscountLineRiskResult(12L, null, new BigDecimal("18.00"), new BigDecimal("15.00"), new BigDecimal("3.00"), true, "CUSTOMER_TIER");

        DiscountRiskResult result = engine.aggregateQuotationRisk(List.of(line1, line2, line3));

        assertThat(result.getOverallViolationPercent()).isEqualTo(new BigDecimal("10.00")); // highest of 0, 10, 3
        assertThat(result.isOverallApprovalRequired()).isTrue();
        assertThat(result.getLineRiskResults()).hasSize(3);
    }

    @Test
    @DisplayName("11. Should handle missing customer policy cleanly")
    void testMissingCustomerPolicy() {
        DiscountLineRiskResult result = engine.evaluateLineRisk(
                10L, null,
                new BigDecimal("10.00"),
                null, // missing customer tier policy
                new BigDecimal("12.00")
        );

        assertThat(result.getEffectiveAllowedDiscountPercent()).isEqualTo(new BigDecimal("12.00"));
        assertThat(result.getPolicySource()).isEqualTo("CATEGORY_CEILING");
    }

    @Test
    @DisplayName("12. Should handle missing category policy cleanly")
    void testMissingCategoryPolicy() {
        DiscountLineRiskResult result = engine.evaluateLineRisk(
                10L, null,
                new BigDecimal("10.00"),
                new BigDecimal("8.00"),
                null // missing category policy
        );

        assertThat(result.getEffectiveAllowedDiscountPercent()).isEqualTo(new BigDecimal("8.00"));
        assertThat(result.getPolicySource()).isEqualTo("CUSTOMER_TIER");
    }

    @Test
    @DisplayName("Should handle missing overall policy (neither customer nor category policy)")
    void testNoPolicyAvailable() {
        DiscountLineRiskResult result = engine.evaluateLineRisk(
                10L, null,
                new BigDecimal("5.00"),
                null,
                null
        );

        assertThat(result.getEffectiveAllowedDiscountPercent()).isEqualTo(BigDecimal.ZERO);
        assertThat(result.getViolationPercent()).isEqualTo(new BigDecimal("5.00"));
        assertThat(result.isApprovalRequired()).isTrue();
        assertThat(result.getPolicySource()).isEqualTo("NO_POLICY");
    }

    @Test
    @DisplayName("13. Should handle BigDecimal scale differences accurately")
    void testBigDecimalScaleDifferences() {
        BigDecimal actual = new BigDecimal("15.0000");
        BigDecimal allowed = new BigDecimal("15.00");

        DiscountLineRiskResult result = engine.evaluateLineRisk(10L, null, actual, allowed, null);

        assertThat(result.getViolationPercent()).isEqualTo(BigDecimal.ZERO);
        assertThat(result.isApprovalRequired()).isFalse();
    }

    @Test
    @DisplayName("14. Should protect against zero/missing base price in actual discount calculation")
    void testZeroBasePriceProtection() {
        BigDecimal discountZeroBase = engine.calculateActualDiscountPercent(BigDecimal.ZERO, new BigDecimal("10.00"));
        BigDecimal discountNullBase = engine.calculateActualDiscountPercent(null, new BigDecimal("10.00"));

        assertThat(discountZeroBase).isEqualTo(BigDecimal.ZERO);
        assertThat(discountNullBase).isEqualTo(BigDecimal.ZERO);
    }

    @Test
    @DisplayName("Should calculate actual discount percentage correctly")
    void testActualDiscountCalculation() {
        // Base = 100, Unit = 80 => 20% discount
        BigDecimal actual = engine.calculateActualDiscountPercent(new BigDecimal("100.00"), new BigDecimal("80.00"));
        assertThat(actual).isEqualTo(new BigDecimal("20.0000"));
    }

    @Test
    @DisplayName("15. Should sanitize negative/invalid actual discount input")
    void testNegativeActualDiscountInput() {
        DiscountLineRiskResult result = engine.evaluateLineRisk(
                10L, null,
                new BigDecimal("-5.00"), // negative input
                new BigDecimal("10.00"),
                null
        );

        assertThat(result.getActualDiscountPercent()).isEqualTo(BigDecimal.ZERO);
        assertThat(result.getViolationPercent()).isEqualTo(BigDecimal.ZERO);
        assertThat(result.isApprovalRequired()).isFalse();
    }
}
