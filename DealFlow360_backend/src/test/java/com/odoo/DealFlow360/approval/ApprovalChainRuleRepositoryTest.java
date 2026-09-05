package com.odoo.DealFlow360.approval;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.jdbc.core.JdbcTemplate;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class ApprovalChainRuleRepositoryTest {

    private JdbcTemplate jdbcTemplate;
    private ApprovalChainRuleRepository ruleRepository;

    @BeforeEach
    void setUp() {
        jdbcTemplate = mock(JdbcTemplate.class);
        ruleRepository = new ApprovalChainRuleRepository(jdbcTemplate);
    }

    @Test
    @DisplayName("Should find approval chain rule by id")
    void testFindById() {
        ApprovalChainRule rule = new ApprovalChainRule(1L, "VIP Rule", 100L, 2L, new BigDecimal("10.00"), new BigDecimal("50000.00"));
        String expectedSql = "SELECT id, name, customer_id, tier_id, min_discount_percent, min_total_amount FROM approval_chain_rules WHERE id = ?";
        when(jdbcTemplate.query(eq(expectedSql), any(ApprovalChainRuleRepository.ApprovalChainRuleRowMapper.class), eq(1L)))
                .thenReturn(Collections.singletonList(rule));

        Optional<ApprovalChainRule> result = ruleRepository.findById(1L);

        assertThat(result).isPresent();
        assertThat(result.get().getName()).isEqualTo("VIP Rule");
        assertThat(result.get().getCustomerId()).isEqualTo(100L);
    }

    @Test
    @DisplayName("Should find approval chain rules by customer id")
    void testFindByCustomerId() {
        ApprovalChainRule rule = new ApprovalChainRule(1L, "VIP Rule", 100L, 2L, new BigDecimal("10.00"), new BigDecimal("50000.00"));
        String expectedSql = "SELECT id, name, customer_id, tier_id, min_discount_percent, min_total_amount FROM approval_chain_rules WHERE customer_id = ? ORDER BY id";
        when(jdbcTemplate.query(eq(expectedSql), any(ApprovalChainRuleRepository.ApprovalChainRuleRowMapper.class), eq(100L)))
                .thenReturn(List.of(rule));

        List<ApprovalChainRule> results = ruleRepository.findByCustomerId(100L);

        assertThat(results).hasSize(1);
    }

    @Test
    @DisplayName("Should update existing approval chain rule")
    void testUpdateApprovalChainRule() {
        ApprovalChainRule rule = new ApprovalChainRule(1L, "VIP Rule Updated", 100L, 2L, new BigDecimal("15.00"), new BigDecimal("60000.00"));

        ruleRepository.save(rule);

        String expectedSql = "UPDATE approval_chain_rules SET name = ?, customer_id = ?, tier_id = ?, min_discount_percent = ?, min_total_amount = ? WHERE id = ?";
        verify(jdbcTemplate).update(
                eq(expectedSql),
                eq("VIP Rule Updated"),
                eq(100L),
                eq(2L),
                eq(new BigDecimal("15.00")),
                eq(new BigDecimal("60000.00")),
                eq(1L)
        );
    }

    @Test
    @DisplayName("Should delete approval chain rule by id")
    void testDeleteById() {
        ruleRepository.deleteById(3L);
        verify(jdbcTemplate).update(eq("DELETE FROM approval_chain_rules WHERE id = ?"), eq(3L));
    }
}
