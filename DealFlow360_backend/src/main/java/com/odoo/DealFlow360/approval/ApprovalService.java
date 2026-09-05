package com.odoo.DealFlow360.approval;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Business service handling domain validation, state machine transitions, sequential approval ordering,
 * and rule routing for Approval entities.
 */
@Service
public class ApprovalService {

    private static final Set<String> ALLOWED_STATUSES = new HashSet<>(Arrays.asList(
            "PENDING", "APPROVED", "REJECTED"
    ));

    private final ApprovalEngine approvalEngine;

    public ApprovalService() {
        this.approvalEngine = new ApprovalEngine();
    }

    @Autowired
    public ApprovalService(ApprovalEngine approvalEngine) {
        this.approvalEngine = approvalEngine != null ? approvalEngine : new ApprovalEngine();
    }

    /**
     * Validates domain constraints on an ApprovalChainRule object.
     */
    public void validateApprovalChainRule(ApprovalChainRule rule) {
        if (rule == null) {
            throw new IllegalArgumentException("Approval chain rule cannot be null");
        }
        if (rule.getName() == null || rule.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Rule name cannot be null or blank");
        }
        if (rule.getCustomerId() != null && rule.getCustomerId() <= 0) {
            throw new IllegalArgumentException("Customer ID must be positive if specified");
        }
        if (rule.getTierId() != null && rule.getTierId() <= 0) {
            throw new IllegalArgumentException("Tier ID must be positive if specified");
        }
        if (rule.getMinDiscountPercent() != null) {
            if (rule.getMinDiscountPercent().compareTo(BigDecimal.ZERO) < 0 || rule.getMinDiscountPercent().compareTo(new BigDecimal("100.00")) > 0) {
                throw new IllegalArgumentException("Min discount percent must be between 0 and 100%");
            }
        }
        if (rule.getMinTotalAmount() != null && rule.getMinTotalAmount().compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Min total amount cannot be negative");
        }
    }

    /**
     * Validates domain constraints on an ApprovalChainStep object.
     */
    public void validateApprovalChainStep(ApprovalChainStep step) {
        if (step == null) {
            throw new IllegalArgumentException("Approval chain step cannot be null");
        }
        if (step.getRuleId() == null || step.getRuleId() <= 0) {
            throw new IllegalArgumentException("Rule ID must be a positive number");
        }
        if (step.getStepNumber() == null || step.getStepNumber() <= 0) {
            throw new IllegalArgumentException("Step number must be a positive number");
        }
        if (step.getRole() == null || step.getRole().trim().isEmpty()) {
            throw new IllegalArgumentException("Step role cannot be null or blank");
        }
        if (step.getUserId() != null && step.getUserId() <= 0) {
            throw new IllegalArgumentException("User ID must be positive if specified");
        }
    }

    /**
     * Validates domain constraints on an Approval record.
     */
    public void validateApprovalRecord(Approval approval) {
        if (approval == null) {
            throw new IllegalArgumentException("Approval record cannot be null");
        }
        if (approval.getQuotationId() == null || approval.getQuotationId() <= 0) {
            throw new IllegalArgumentException("Quotation ID must be a positive number");
        }
        if (approval.getStepNumber() == null || approval.getStepNumber() <= 0) {
            throw new IllegalArgumentException("Step number must be a positive number");
        }
        if (approval.getStatus() == null || approval.getStatus().trim().isEmpty()) {
            throw new IllegalArgumentException("Approval status cannot be null or blank");
        }
        if (!ALLOWED_STATUSES.contains(approval.getStatus().trim().toUpperCase())) {
            throw new IllegalArgumentException("Invalid approval status: " + approval.getStatus());
        }
        if (approval.getApproverId() != null && approval.getApproverId() <= 0) {
            throw new IllegalArgumentException("Approver ID must be positive if specified");
        }
    }

    /**
     * Creates and validates a new pending Approval record instance.
     */
    public Approval createPendingApproval(Long id, Long quotationId, Long approverId, Integer stepNumber) {
        Instant now = Instant.now();
        Approval approval = new Approval(
                id,
                quotationId,
                approverId,
                stepNumber != null ? stepNumber : 1,
                "PENDING",
                null,
                now,
                null
        );
        validateApprovalRecord(approval);
        return approval;
    }

    /**
     * Validates approval state machine status transitions.
     */
    public void validateStatusTransition(String currentStatus, String newStatus) {
        if (newStatus == null || newStatus.trim().isEmpty()) {
            throw new IllegalArgumentException("New status cannot be null or blank");
        }
        String current = currentStatus != null ? currentStatus.trim().toUpperCase() : "PENDING";
        String target = newStatus.trim().toUpperCase();

        if (!ALLOWED_STATUSES.contains(target)) {
            throw new IllegalArgumentException("Invalid approval status: " + newStatus);
        }

        if ("APPROVED".equals(current) || "REJECTED".equals(current)) {
            throw new IllegalStateException("Cannot transition out of terminal approval status: " + current);
        }

        if (current.equals(target)) {
            return; // No-op for non-terminal statuses
        }

        if ("PENDING".equals(current)) {
            if ("APPROVED".equals(target) || "REJECTED".equals(target)) {
                return;
            }
        }

        throw new IllegalStateException("Illegal approval status transition from " + current + " to " + target);
    }

    /**
     * Validates sequential execution order: Step N can only be decided if all steps < N are already APPROVED.
     */
    public void validateSequentialApproval(List<Approval> existingApprovals, int targetStepNumber) {
        if (targetStepNumber <= 1) {
            return; // Step 1 requires no prior step approval
        }

        if (existingApprovals == null || existingApprovals.isEmpty()) {
            throw new IllegalStateException("Cannot execute approval step " + targetStepNumber + " because prior steps are missing");
        }

        Map<Integer, Approval> stepMap = existingApprovals.stream()
                .filter(a -> a != null && a.getStepNumber() != null)
                .collect(Collectors.toMap(Approval::getStepNumber, a -> a, (a1, a2) -> a1));

        for (int step = 1; step < targetStepNumber; step++) {
            Approval priorApproval = stepMap.get(step);
            if (priorApproval == null || !"APPROVED".equalsIgnoreCase(priorApproval.getStatus())) {
                throw new IllegalStateException("Cannot execute approval step " + targetStepNumber + " because prior step " + step + " is not APPROVED");
            }
        }
    }

    /**
     * Approves an Approval record after state transition and sequential order checks.
     */
    public void approveRecord(Approval approval, Long approverId, String decisionReason, List<Approval> existingApprovals) {
        if (approval == null) {
            throw new IllegalArgumentException("Approval record cannot be null");
        }
        validateStatusTransition(approval.getStatus(), "APPROVED");
        if (approval.getStepNumber() != null) {
            validateSequentialApproval(existingApprovals, approval.getStepNumber());
        }
        if (approverId != null && approverId <= 0) {
            throw new IllegalArgumentException("Approver ID must be positive if specified");
        }

        approval.setStatus("APPROVED");
        approval.setApproverId(approverId);
        approval.setDecisionReason(decisionReason != null ? decisionReason.trim() : "Approved");
        approval.setDecidedAt(Instant.now());
    }

    /**
     * Rejects an Approval record after state transition and sequential order checks.
     */
    public void rejectRecord(Approval approval, Long approverId, String decisionReason, List<Approval> existingApprovals) {
        if (approval == null) {
            throw new IllegalArgumentException("Approval record cannot be null");
        }
        validateStatusTransition(approval.getStatus(), "REJECTED");
        if (approval.getStepNumber() != null) {
            validateSequentialApproval(existingApprovals, approval.getStepNumber());
        }
        if (approverId != null && approverId <= 0) {
            throw new IllegalArgumentException("Approver ID must be positive if specified");
        }

        approval.setStatus("REJECTED");
        approval.setApproverId(approverId);
        approval.setDecisionReason(decisionReason != null ? decisionReason.trim() : "Rejected");
        approval.setDecidedAt(Instant.now());
    }

    /**
     * Delegates approval routing evaluation to ApprovalEngine.
     */
    public ApprovalRouteResult determineApprovalRoute(List<ApprovalChainRule> candidateRules,
                                                       List<ApprovalChainStep> candidateSteps,
                                                       Long customerId, Long tierId,
                                                       BigDecimal actualDiscountPercent, BigDecimal quotationTotal) {
        return approvalEngine.determineApprovalRoute(candidateRules, candidateSteps, customerId, tierId, actualDiscountPercent, quotationTotal);
    }
}
