package com.odoo.DealFlow360.approval;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class ApprovalServiceTest {

    private ApprovalService service;

    @BeforeEach
    void setUp() {
        service = new ApprovalService(new ApprovalEngine());
    }

    @Test
    @DisplayName("1. Should create valid pending approval record")
    void testCreatePendingApproval() {
        Approval approval = service.createPendingApproval(1L, 100L, 10L, 1);

        assertThat(approval).isNotNull();
        assertThat(approval.getId()).isEqualTo(1L);
        assertThat(approval.getQuotationId()).isEqualTo(100L);
        assertThat(approval.getApproverId()).isEqualTo(10L);
        assertThat(approval.getStepNumber()).isEqualTo(1);
        assertThat(approval.getStatus()).isEqualTo("PENDING");
        assertThat(approval.getCreatedAt()).isNotNull();
        assertThat(approval.getDecidedAt()).isNull();
    }

    @Test
    @DisplayName("2. Should approve pending approval record successfully")
    void testApprovePendingApproval() {
        Approval approval = service.createPendingApproval(1L, 100L, null, 1);

        service.approveRecord(approval, 10L, "Discount is justified", Collections.emptyList());

        assertThat(approval.getStatus()).isEqualTo("APPROVED");
        assertThat(approval.getApproverId()).isEqualTo(10L);
        assertThat(approval.getDecisionReason()).isEqualTo("Discount is justified");
        assertThat(approval.getDecidedAt()).isNotNull();
    }

    @Test
    @DisplayName("3. Should reject pending approval record successfully")
    void testRejectPendingApproval() {
        Approval approval = service.createPendingApproval(1L, 100L, null, 1);

        service.rejectRecord(approval, 10L, "Margin too low", Collections.emptyList());

        assertThat(approval.getStatus()).isEqualTo("REJECTED");
        assertThat(approval.getApproverId()).isEqualTo(10L);
        assertThat(approval.getDecisionReason()).isEqualTo("Margin too low");
        assertThat(approval.getDecidedAt()).isNotNull();
    }

    @Test
    @DisplayName("4. Should reject invalid state transitions")
    void testInvalidStatusTransition() {
        Approval approval = service.createPendingApproval(1L, 100L, 10L, 1);
        service.approveRecord(approval, 10L, "Approved", Collections.emptyList());

        // APPROVED -> REJECTED is forbidden
        assertThatThrownBy(() -> service.rejectRecord(approval, 10L, "Changed mind", Collections.emptyList()))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("Cannot transition out of terminal approval status: APPROVED");
    }

    @Test
    @DisplayName("5. Should reject transition on already-approved approval")
    void testAlreadyApprovedRejected() {
        Approval approval = service.createPendingApproval(1L, 100L, 10L, 1);
        approval.setStatus("APPROVED");
        approval.setDecidedAt(Instant.now());

        assertThatThrownBy(() -> service.approveRecord(approval, 10L, "Approve again", Collections.emptyList()))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("Cannot transition out of terminal approval status: APPROVED");
    }

    @Test
    @DisplayName("6. Should validate sequential approval execution order")
    void testSequentialApprovalValidation() {
        Approval step1 = service.createPendingApproval(1L, 100L, 10L, 1);
        Approval step2 = service.createPendingApproval(2L, 100L, 15L, 2);

        // Attempting to approve step 2 while step 1 is PENDING should be rejected
        assertThatThrownBy(() -> service.approveRecord(step2, 15L, "Approve Step 2", List.of(step1, step2)))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("prior step 1 is not APPROVED");

        // Approve step 1 first
        service.approveRecord(step1, 10L, "Approve Step 1", List.of(step1, step2));
        assertThat(step1.getStatus()).isEqualTo("APPROVED");

        // Now approving step 2 succeeds
        service.approveRecord(step2, 15L, "Approve Step 2", List.of(step1, step2));
        assertThat(step2.getStatus()).isEqualTo("APPROVED");
    }

    @Test
    @DisplayName("Should reject step 2 approval if step 1 is REJECTED")
    void testStep2RejectedIfStep1IsRejected() {
        Approval step1 = service.createPendingApproval(1L, 100L, 10L, 1);
        Approval step2 = service.createPendingApproval(2L, 100L, 15L, 2);

        service.rejectRecord(step1, 10L, "Step 1 Rejected", List.of(step1, step2));

        assertThatThrownBy(() -> service.approveRecord(step2, 15L, "Approve Step 2", List.of(step1, step2)))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("prior step 1 is not APPROVED");
    }
}
