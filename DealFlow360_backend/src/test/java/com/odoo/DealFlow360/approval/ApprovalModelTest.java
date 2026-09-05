package com.odoo.DealFlow360.approval;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.Instant;

import static org.assertj.core.api.Assertions.assertThat;

class ApprovalModelTest {

    @Test
    @DisplayName("Should create and verify ApprovalChainRule domain model")
    void testApprovalChainRuleModel() {
        ApprovalChainRule rule1 = new ApprovalChainRule(
                1L, "High Discount Rule", 100L, 2L,
                new BigDecimal("20.00"), new BigDecimal("50000.00")
        );

        assertThat(rule1.getId()).isEqualTo(1L);
        assertThat(rule1.getName()).isEqualTo("High Discount Rule");
        assertThat(rule1.getCustomerId()).isEqualTo(100L);
        assertThat(rule1.getTierId()).isEqualTo(2L);
        assertThat(rule1.getMinDiscountPercent()).isEqualTo(new BigDecimal("20.00"));
        assertThat(rule1.getMinTotalAmount()).isEqualTo(new BigDecimal("50000.00"));

        ApprovalChainRule rule2 = new ApprovalChainRule(
                1L, "High Discount Rule", 100L, 2L,
                new BigDecimal("20.00"), new BigDecimal("50000.00")
        );

        assertThat(rule1).isEqualTo(rule2);
        assertThat(rule1.hashCode()).isEqualTo(rule2.hashCode());
        assertThat(rule1.toString()).contains("High Discount Rule");
    }

    @Test
    @DisplayName("Should support null fields in ApprovalChainRule model")
    void testApprovalChainRuleNullability() {
        ApprovalChainRule rule = new ApprovalChainRule();
        rule.setId(2L);
        rule.setName("Global Rule");
        rule.setCustomerId(null);
        rule.setTierId(null);

        assertThat(rule.getId()).isEqualTo(2L);
        assertThat(rule.getName()).isEqualTo("Global Rule");
        assertThat(rule.getCustomerId()).isNull();
        assertThat(rule.getTierId()).isNull();
    }

    @Test
    @DisplayName("Should create and verify ApprovalChainStep domain model")
    void testApprovalChainStepModel() {
        ApprovalChainStep step1 = new ApprovalChainStep(10L, 1L, 1, "SALES_MANAGER", 5L);

        assertThat(step1.getId()).isEqualTo(10L);
        assertThat(step1.getRuleId()).isEqualTo(1L);
        assertThat(step1.getStepNumber()).isEqualTo(1);
        assertThat(step1.getRole()).isEqualTo("SALES_MANAGER");
        assertThat(step1.getUserId()).isEqualTo(5L);

        ApprovalChainStep step2 = new ApprovalChainStep(10L, 1L, 1, "SALES_MANAGER", 5L);

        assertThat(step1).isEqualTo(step2);
        assertThat(step1.hashCode()).isEqualTo(step2.hashCode());
        assertThat(step1.toString()).contains("ApprovalChainStep");
    }

    @Test
    @DisplayName("Should support nullable userId in ApprovalChainStep model")
    void testApprovalChainStepNullUser() {
        ApprovalChainStep step = new ApprovalChainStep();
        step.setId(11L);
        step.setRuleId(1L);
        step.setStepNumber(2);
        step.setRole("VP_SALES");
        step.setUserId(null);

        assertThat(step.getUserId()).isNull();
        assertThat(step.getRole()).isEqualTo("VP_SALES");
    }

    @Test
    @DisplayName("Should create and verify Approval domain model")
    void testApprovalModel() {
        Instant now = Instant.now();
        Instant decided = now.plusSeconds(3600);

        Approval a1 = new Approval(100L, 50L, 5L, 1, "APPROVED", "Within threshold", now, decided);

        assertThat(a1.getId()).isEqualTo(100L);
        assertThat(a1.getQuotationId()).isEqualTo(50L);
        assertThat(a1.getApproverId()).isEqualTo(5L);
        assertThat(a1.getStepNumber()).isEqualTo(1);
        assertThat(a1.getStatus()).isEqualTo("APPROVED");
        assertThat(a1.getDecisionReason()).isEqualTo("Within threshold");
        assertThat(a1.getCreatedAt()).isEqualTo(now);
        assertThat(a1.getDecidedAt()).isEqualTo(decided);

        Approval a2 = new Approval(100L, 50L, 5L, 1, "APPROVED", "Within threshold", now, decided);

        assertThat(a1).isEqualTo(a2);
        assertThat(a1.hashCode()).isEqualTo(a2.hashCode());
        assertThat(a1.toString()).contains("APPROVED");
    }

    @Test
    @DisplayName("Should support null decidedAt in Approval model")
    void testApprovalPendingNullDecidedAt() {
        Instant now = Instant.now();
        Approval approval = new Approval(101L, 50L, null, 1, "PENDING", null, now, null);

        assertThat(approval.getApproverId()).isNull();
        assertThat(approval.getStatus()).isEqualTo("PENDING");
        assertThat(approval.getDecisionReason()).isNull();
        assertThat(approval.getDecidedAt()).isNull();
    }
}
