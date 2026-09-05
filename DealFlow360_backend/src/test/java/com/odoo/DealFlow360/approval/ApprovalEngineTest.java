package com.odoo.DealFlow360.approval;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class ApprovalEngineTest {

    private ApprovalEngine engine;

    @BeforeEach
    void setUp() {
        engine = new ApprovalEngine();
    }

    @Test
    @DisplayName("1. Should return no approval route when no rules match")
    void testNoMatchingRule() {
        ApprovalChainRule rule = new ApprovalChainRule(1L, "Strict Rule", 999L, 99L, new BigDecimal("50.00"), new BigDecimal("100000.00"));

        ApprovalRouteResult result = engine.determineApprovalRoute(
                List.of(rule), Collections.emptyList(),
                10L, 1L, new BigDecimal("10.00"), new BigDecimal("5000.00")
        );

        assertThat(result.getMatchedRule()).isNull();
        assertThat(result.getOrderedSteps()).isEmpty();
        assertThat(result.isApprovalRequired()).isFalse();
    }

    @Test
    @DisplayName("2. Should match customer-specific rule")
    void testCustomerSpecificRule() {
        ApprovalChainRule customerRule = new ApprovalChainRule(1L, "Acme Rule", 100L, null, null, null);
        ApprovalChainRule otherRule = new ApprovalChainRule(2L, "Beta Rule", 200L, null, null, null);

        ApprovalChainRule best = engine.selectBestMatchingRule(List.of(customerRule, otherRule), 100L, 1L, new BigDecimal("5.00"), new BigDecimal("1000.00"));

        assertThat(best).isEqualTo(customerRule);
    }

    @Test
    @DisplayName("3. Should match tier-specific rule")
    void testTierSpecificRule() {
        ApprovalChainRule tierRule = new ApprovalChainRule(1L, "Gold Tier Rule", null, 2L, null, null);

        boolean matches = engine.isRuleMatching(tierRule, 100L, 2L, BigDecimal.ZERO, BigDecimal.ZERO);

        assertThat(matches).isTrue();
    }

    @Test
    @DisplayName("4. Should evaluate minimum discount threshold")
    void testMinDiscountThreshold() {
        ApprovalChainRule rule = new ApprovalChainRule(1L, "High Discount Rule", null, null, new BigDecimal("20.00"), null);

        boolean matchBelow = engine.isRuleMatching(rule, 100L, 1L, new BigDecimal("15.00"), BigDecimal.ZERO);
        boolean matchEqual = engine.isRuleMatching(rule, 100L, 1L, new BigDecimal("20.00"), BigDecimal.ZERO);
        boolean matchAbove = engine.isRuleMatching(rule, 100L, 1L, new BigDecimal("25.00"), BigDecimal.ZERO);

        assertThat(matchBelow).isFalse();
        assertThat(matchEqual).isTrue();
        assertThat(matchAbove).isTrue();
    }

    @Test
    @DisplayName("5. Should evaluate minimum quotation total threshold")
    void testMinTotalAmountThreshold() {
        ApprovalChainRule rule = new ApprovalChainRule(1L, "Large Deal Rule", null, null, null, new BigDecimal("100000.00"));

        boolean matchBelow = engine.isRuleMatching(rule, 100L, 1L, BigDecimal.ZERO, new BigDecimal("50000.00"));
        boolean matchAbove = engine.isRuleMatching(rule, 100L, 1L, BigDecimal.ZERO, new BigDecimal("150000.00"));

        assertThat(matchBelow).isFalse();
        assertThat(matchAbove).isTrue();
    }

    @Test
    @DisplayName("6. Should treat nullable rule criteria as wildcards")
    void testNullableRuleCriteria() {
        ApprovalChainRule wildRule = new ApprovalChainRule(1L, "Catch-All Rule", null, null, null, null);

        boolean matches = engine.isRuleMatching(wildRule, 50L, 3L, new BigDecimal("12.50"), new BigDecimal("9999.00"));

        assertThat(matches).isTrue();
    }

    @Test
    @DisplayName("7 & 8. Should select best rule following deterministic precedence rules")
    void testDeterministicRulePrecedence() {
        // General rule
        ApprovalChainRule r1 = new ApprovalChainRule(1L, "General Rule", null, null, new BigDecimal("10.00"), null);
        // Tier rule
        ApprovalChainRule r2 = new ApprovalChainRule(2L, "Tier Rule", null, 2L, new BigDecimal("10.00"), null);
        // Customer rule
        ApprovalChainRule r3 = new ApprovalChainRule(3L, "Customer Rule", 100L, 2L, new BigDecimal("10.00"), null);

        ApprovalChainRule best = engine.selectBestMatchingRule(List.of(r1, r2, r3), 100L, 2L, new BigDecimal("15.00"), new BigDecimal("1000.00"));

        // Customer-specific rule takes highest priority
        assertThat(best).isEqualTo(r3);
    }

    @Test
    @DisplayName("9. Should return ordered approval steps by stepNumber")
    void testOrderedApprovalSteps() {
        ApprovalChainStep step2 = new ApprovalChainStep(102L, 1L, 2, "VP_SALES", 20L);
        ApprovalChainStep step1 = new ApprovalChainStep(101L, 1L, 1, "SALES_MANAGER", 10L);
        ApprovalChainStep step3 = new ApprovalChainStep(103L, 1L, 3, "CFO", 30L);

        List<ApprovalChainStep> ordered = engine.resolveAndOrderSteps(1L, List.of(step2, step1, step3));

        assertThat(ordered).extracting(ApprovalChainStep::getStepNumber).containsExactly(1, 2, 3);
        assertThat(ordered).extracting(ApprovalChainStep::getRole).containsExactly("SALES_MANAGER", "VP_SALES", "CFO");
    }

    @Test
    @DisplayName("10. Should reject invalid or duplicate step ordering within a rule")
    void testDuplicateStepOrderingRejected() {
        ApprovalChainStep step1a = new ApprovalChainStep(101L, 1L, 1, "SALES_MANAGER", 10L);
        ApprovalChainStep step1b = new ApprovalChainStep(102L, 1L, 1, "OTHER_MANAGER", 11L);

        assertThatThrownBy(() -> engine.resolveAndOrderSteps(1L, List.of(step1a, step1b)))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("Duplicate step number 1");
    }

    @Test
    @DisplayName("Should reject non-positive step number")
    void testNonPositiveStepNumberRejected() {
        ApprovalChainStep invalidStep = new ApprovalChainStep(101L, 1L, 0, "ROLE", 10L);

        assertThatThrownBy(() -> engine.resolveAndOrderSteps(1L, List.of(invalidStep)))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("must be a positive integer");
    }

    @Test
    @DisplayName("11. Should generate complete approval requirement route result")
    void testApprovalRequirementGeneration() {
        ApprovalChainRule rule = new ApprovalChainRule(1L, "Default Approval Chain", null, null, new BigDecimal("10.00"), null);
        ApprovalChainStep step1 = new ApprovalChainStep(101L, 1L, 1, "SALES_MANAGER", 10L);
        ApprovalChainStep step2 = new ApprovalChainStep(102L, 1L, 2, "FINANCE_DIRECTOR", 15L);

        ApprovalRouteResult route = engine.determineApprovalRoute(
                List.of(rule), List.of(step1, step2),
                100L, 1L, new BigDecimal("15.00"), new BigDecimal("10000.00")
        );

        assertThat(route.isApprovalRequired()).isTrue();
        assertThat(route.getMatchedRule()).isEqualTo(rule);
        assertThat(route.getOrderedSteps()).hasSize(2);
        assertThat(route.getOrderedSteps().get(0).getStepNumber()).isEqualTo(1);
        assertThat(route.getOrderedSteps().get(1).getStepNumber()).isEqualTo(2);
    }
}
