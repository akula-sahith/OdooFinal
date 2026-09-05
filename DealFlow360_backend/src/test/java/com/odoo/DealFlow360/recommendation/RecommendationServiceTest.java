package com.odoo.DealFlow360.recommendation;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class RecommendationServiceTest {

    private RecommendationService recommendationService;

    @BeforeEach
    void setUp() {
        recommendationService = new RecommendationService();
    }

    @Test
    @DisplayName("Should validate valid upsell rule successfully")
    void testValidUpsellRule() {
        UpsellRule rule = recommendationService.createUpsellRule(1L, 10L, 20L, true, new BigDecimal("15.00"));
        assertThat(rule).isNotNull();
        assertThat(rule.getBaseProductId()).isEqualTo(10L);
        assertThat(rule.getSuggestedProductId()).isEqualTo(20L);
    }

    @Test
    @DisplayName("Should reject self-recommendation where baseProductId equals suggestedProductId")
    void testSelfRecommendationRejection() {
        assertThatThrownBy(() -> recommendationService.createUpsellRule(1L, 10L, 10L, false, null))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Self-recommendation is invalid: base product cannot recommend itself");
    }

    @Test
    @DisplayName("Should evaluate eligibility when minimum margin threshold is satisfied vs violated")
    void testMinimumMarginThresholdEligibility() {
        UpsellRule ruleWithMargin = new UpsellRule(1L, 10L, 20L, false, new BigDecimal("20.00"));

        // Margin satisfied (25.00% >= 20.00%)
        assertThat(recommendationService.isEligible(ruleWithMargin, new BigDecimal("25.00"))).isTrue();

        // Margin violated (15.00% < 20.00%)
        assertThat(recommendationService.isEligible(ruleWithMargin, new BigDecimal("15.00"))).isFalse();

        // Margin missing when threshold is required -> ineligible
        assertThat(recommendationService.isEligible(ruleWithMargin, null)).isFalse();
    }

    @Test
    @DisplayName("Should rank promoted candidates ahead of non-promoted candidates deterministically")
    void testPromotedCandidateRanking() {
        UpsellRule regularRule = new UpsellRule(1L, 10L, 20L, false, new BigDecimal("10.00"));
        UpsellRule promotedRule = new UpsellRule(2L, 10L, 30L, true, new BigDecimal("5.00"));

        List<UpsellRule> rules = Arrays.asList(regularRule, promotedRule);

        List<RecommendationResult> results = recommendationService.evaluateRecommendations(10L, rules, new BigDecimal("30.00"));

        assertThat(results).hasSize(2);
        assertThat(results.get(0).getSuggestedProductId()).isEqualTo(30L); // Promoted candidate first
        assertThat(results.get(0).getIsPromoted()).isTrue();
        assertThat(results.get(1).getSuggestedProductId()).isEqualTo(20L); // Non-promoted candidate second
    }

    @Test
    @DisplayName("Should handle duplicate rules for same suggested product and retain promoted version")
    void testDuplicateRuleBehavior() {
        UpsellRule rule1 = new UpsellRule(1L, 10L, 20L, false, new BigDecimal("10.00"));
        UpsellRule rule2 = new UpsellRule(2L, 10L, 20L, true, new BigDecimal("10.00")); // Duplicate suggested product 20, but promoted

        List<UpsellRule> rules = Arrays.asList(rule1, rule2);

        List<RecommendationResult> results = recommendationService.evaluateRecommendations(10L, rules, new BigDecimal("30.00"));

        assertThat(results).hasSize(1);
        assertThat(results.get(0).getSuggestedProductId()).isEqualTo(20L);
        assertThat(results.get(0).getIsPromoted()).isTrue();
    }

    @Test
    @DisplayName("Should return empty recommendation list when candidate list is empty")
    void testEmptyCandidateList() {
        List<RecommendationResult> results = recommendationService.evaluateRecommendations(10L, Collections.emptyList(), new BigDecimal("30.00"));
        assertThat(results).isEmpty();
    }
}
