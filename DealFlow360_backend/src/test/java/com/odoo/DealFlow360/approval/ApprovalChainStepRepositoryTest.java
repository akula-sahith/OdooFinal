package com.odoo.DealFlow360.approval;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class ApprovalChainStepRepositoryTest {

    private JdbcTemplate jdbcTemplate;
    private ApprovalChainStepRepository stepRepository;

    @BeforeEach
    void setUp() {
        jdbcTemplate = mock(JdbcTemplate.class);
        stepRepository = new ApprovalChainStepRepository(jdbcTemplate);
    }

    @Test
    @DisplayName("Should find approval chain step by id")
    void testFindById() {
        ApprovalChainStep step = new ApprovalChainStep(1L, 10L, 1, "Sales Manager", 5L);
        String expectedSql = "SELECT id, rule_id, step_number, role, user_id FROM approval_chain_steps WHERE id = ?";
        when(jdbcTemplate.query(eq(expectedSql), any(ApprovalChainStepRepository.ApprovalChainStepRowMapper.class), eq(1L)))
                .thenReturn(Collections.singletonList(step));

        Optional<ApprovalChainStep> result = stepRepository.findById(1L);

        assertThat(result).isPresent();
        assertThat(result.get().getRuleId()).isEqualTo(10L);
        assertThat(result.get().getStepNumber()).isEqualTo(1);
        assertThat(result.get().getRole()).isEqualTo("Sales Manager");
    }

    @Test
    @DisplayName("Should find approval chain steps by rule id ordered by step_number ASC")
    void testFindByRuleId() {
        ApprovalChainStep s1 = new ApprovalChainStep(1L, 10L, 1, "Sales Manager", 5L);
        ApprovalChainStep s2 = new ApprovalChainStep(2L, 10L, 2, "VP Sales", 8L);
        String expectedSql = "SELECT id, rule_id, step_number, role, user_id FROM approval_chain_steps WHERE rule_id = ? ORDER BY step_number ASC";
        when(jdbcTemplate.query(eq(expectedSql), any(ApprovalChainStepRepository.ApprovalChainStepRowMapper.class), eq(10L)))
                .thenReturn(List.of(s1, s2));

        List<ApprovalChainStep> results = stepRepository.findByRuleId(10L);

        assertThat(results).hasSize(2);
        assertThat(results.get(0).getStepNumber()).isEqualTo(1);
        assertThat(results.get(1).getStepNumber()).isEqualTo(2);
    }

    @Test
    @DisplayName("Should update existing approval chain step")
    void testUpdateApprovalChainStep() {
        ApprovalChainStep step = new ApprovalChainStep(1L, 10L, 1, "Senior Sales Manager", 6L);

        stepRepository.save(step);

        String expectedSql = "UPDATE approval_chain_steps SET rule_id = ?, step_number = ?, role = ?, user_id = ? WHERE id = ?";
        verify(jdbcTemplate).update(
                eq(expectedSql),
                eq(10L),
                eq(1),
                eq("Senior Sales Manager"),
                eq(6L),
                eq(1L)
        );
    }

    @Test
    @DisplayName("Should delete approval chain step by id")
    void testDeleteById() {
        stepRepository.deleteById(4L);
        verify(jdbcTemplate).update(eq("DELETE FROM approval_chain_steps WHERE id = ?"), eq(4L));
    }
}
