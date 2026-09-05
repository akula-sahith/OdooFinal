package com.odoo.DealFlow360.approval;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.jdbc.core.JdbcTemplate;

import java.time.Instant;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class ApprovalRepositoryTest {

    private JdbcTemplate jdbcTemplate;
    private ApprovalRepository approvalRepository;

    @BeforeEach
    void setUp() {
        jdbcTemplate = mock(JdbcTemplate.class);
        approvalRepository = new ApprovalRepository(jdbcTemplate);
    }

    @Test
    @DisplayName("Should find approval record by id")
    void testFindById() {
        Instant now = Instant.now();
        Approval approval = new Approval(1L, 100L, 10L, 1, "PENDING", null, now, null);
        String expectedSql = "SELECT id, quotation_id, approver_id, step_number, status, decision_reason, created_at, decided_at FROM approvals WHERE id = ?";
        when(jdbcTemplate.query(eq(expectedSql), any(ApprovalRepository.ApprovalRowMapper.class), eq(1L)))
                .thenReturn(Collections.singletonList(approval));

        Optional<Approval> result = approvalRepository.findById(1L);

        assertThat(result).isPresent();
        assertThat(result.get().getQuotationId()).isEqualTo(100L);
        assertThat(result.get().getStatus()).isEqualTo("PENDING");
    }

    @Test
    @DisplayName("Should find approval records by quotation id ordered by step_number ASC")
    void testFindByQuotationId() {
        Instant now = Instant.now();
        Approval a1 = new Approval(1L, 100L, 10L, 1, "APPROVED", "OK", now, now);
        Approval a2 = new Approval(2L, 100L, 12L, 2, "PENDING", null, now, null);
        String expectedSql = "SELECT id, quotation_id, approver_id, step_number, status, decision_reason, created_at, decided_at FROM approvals WHERE quotation_id = ? ORDER BY step_number ASC";
        when(jdbcTemplate.query(eq(expectedSql), any(ApprovalRepository.ApprovalRowMapper.class), eq(100L)))
                .thenReturn(List.of(a1, a2));

        List<Approval> results = approvalRepository.findByQuotationId(100L);

        assertThat(results).hasSize(2);
        assertThat(results.get(0).getStepNumber()).isEqualTo(1);
        assertThat(results.get(1).getStepNumber()).isEqualTo(2);
    }

    @Test
    @DisplayName("Should find approval records by status")
    void testFindByStatus() {
        Instant now = Instant.now();
        Approval a1 = new Approval(1L, 100L, 10L, 1, "PENDING", null, now, null);
        String expectedSql = "SELECT id, quotation_id, approver_id, step_number, status, decision_reason, created_at, decided_at FROM approvals WHERE status = ? ORDER BY id";
        when(jdbcTemplate.query(eq(expectedSql), any(ApprovalRepository.ApprovalRowMapper.class), eq("PENDING")))
                .thenReturn(List.of(a1));

        List<Approval> results = approvalRepository.findByStatus("PENDING");

        assertThat(results).hasSize(1);
    }

    @Test
    @DisplayName("Should update existing approval record")
    void testUpdateApproval() {
        Instant now = Instant.now();
        Approval approval = new Approval(1L, 100L, 10L, 1, "APPROVED", "Approved by manager", now, now);

        approvalRepository.save(approval);

        String expectedSql = "UPDATE approvals SET quotation_id = ?, approver_id = ?, step_number = ?, status = ?, decision_reason = ?, created_at = ?, decided_at = ? WHERE id = ?";
        verify(jdbcTemplate).update(
                eq(expectedSql),
                eq(100L),
                eq(10L),
                eq(1),
                eq("APPROVED"),
                eq("Approved by manager"),
                any(),
                any(),
                eq(1L)
        );
    }

    @Test
    @DisplayName("Should delete approval record by id")
    void testDeleteById() {
        approvalRepository.deleteById(7L);
        verify(jdbcTemplate).update(eq("DELETE FROM approvals WHERE id = ?"), eq(7L));
    }
}
