package com.odoo.DealFlow360.approval;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Business service handling domain validation, state machine transitions, sequential approval ordering,
 * rule routing, and Spring JDBC repository persistence for Approval entities.
 */
@Service
public class ApprovalService {

    private static final Set<String> ALLOWED_STATUSES = new HashSet<>(Arrays.asList(
            "PENDING", "APPROVED", "REJECTED"
    ));

    private final ApprovalEngine approvalEngine;
    private final ApprovalChainRuleRepository approvalChainRuleRepository;
    private final ApprovalChainStepRepository approvalChainStepRepository;
    private final ApprovalRepository approvalRepository;

    public ApprovalService() {
        this(new ApprovalEngine(), null, null, null);
    }

    public ApprovalService(ApprovalEngine approvalEngine) {
        this(approvalEngine, null, null, null);
    }

    @Autowired
    public ApprovalService(ApprovalEngine approvalEngine,
                           ApprovalChainRuleRepository approvalChainRuleRepository,
                           ApprovalChainStepRepository approvalChainStepRepository,
                           ApprovalRepository approvalRepository) {
        this.approvalEngine = approvalEngine != null ? approvalEngine : new ApprovalEngine();
        this.approvalChainRuleRepository = approvalChainRuleRepository;
        this.approvalChainStepRepository = approvalChainStepRepository;
        this.approvalRepository = approvalRepository;
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
     * Persists an ApprovalChainRule after domain validation.
     */
    @Transactional
    public ApprovalChainRule saveApprovalChainRule(ApprovalChainRule rule) {
        validateApprovalChainRule(rule);
        if (approvalChainRuleRepository != null) {
            return approvalChainRuleRepository.save(rule);
        }
        return rule;
    }

    /**
     * Finds an ApprovalChainRule by ID.
     */
    public Optional<ApprovalChainRule> findApprovalChainRuleById(Long id) {
        if (approvalChainRuleRepository != null && id != null) {
            return approvalChainRuleRepository.findById(id);
        }
        return Optional.empty();
    }

    /**
     * Finds all ApprovalChainRules for a specific Customer ID.
     */
    public List<ApprovalChainRule> findApprovalChainRulesByCustomerId(Long customerId) {
        if (approvalChainRuleRepository != null && customerId != null) {
            return approvalChainRuleRepository.findByCustomerId(customerId);
        }
        return Collections.emptyList();
    }

    /**
     * Finds all ApprovalChainRules for a specific Tier ID.
     */
    public List<ApprovalChainRule> findApprovalChainRulesByTierId(Long tierId) {
        if (approvalChainRuleRepository != null && tierId != null) {
            return approvalChainRuleRepository.findByTierId(tierId);
        }
        return Collections.emptyList();
    }

    /**
     * Retrieves all ApprovalChainRules.
     */
    public List<ApprovalChainRule> findAllApprovalChainRules() {
        if (approvalChainRuleRepository != null) {
            return approvalChainRuleRepository.findAll();
        }
        return Collections.emptyList();
    }

    /**
     * Checks if an ApprovalChainRule exists by ID.
     */
    public boolean existsApprovalChainRuleById(Long id) {
        return approvalChainRuleRepository != null && id != null && approvalChainRuleRepository.existsById(id);
    }

    /**
     * Deletes an ApprovalChainRule by ID.
     */
    @Transactional
    public void deleteApprovalChainRuleById(Long id) {
        if (approvalChainRuleRepository != null && id != null) {
            approvalChainRuleRepository.deleteById(id);
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
     * Persists an ApprovalChainStep after domain validation.
     */
    @Transactional
    public ApprovalChainStep saveApprovalChainStep(ApprovalChainStep step) {
        validateApprovalChainStep(step);
        if (approvalChainStepRepository != null) {
            return approvalChainStepRepository.save(step);
        }
        return step;
    }

    /**
     * Finds an ApprovalChainStep by ID.
     */
    public Optional<ApprovalChainStep> findApprovalChainStepById(Long id) {
        if (approvalChainStepRepository != null && id != null) {
            return approvalChainStepRepository.findById(id);
        }
        return Optional.empty();
    }

    /**
     * Finds all ApprovalChainSteps for a rule ID (ordered by step_number ASC).
     */
    public List<ApprovalChainStep> findApprovalChainStepsByRuleId(Long ruleId) {
        if (approvalChainStepRepository != null && ruleId != null) {
            return approvalChainStepRepository.findByRuleId(ruleId);
        }
        return Collections.emptyList();
    }

    /**
     * Retrieves all ApprovalChainSteps.
     */
    public List<ApprovalChainStep> findAllApprovalChainSteps() {
        if (approvalChainStepRepository != null) {
            return approvalChainStepRepository.findAll();
        }
        return Collections.emptyList();
    }

    /**
     * Checks if an ApprovalChainStep exists by ID.
     */
    public boolean existsApprovalChainStepById(Long id) {
        return approvalChainStepRepository != null && id != null && approvalChainStepRepository.existsById(id);
    }

    /**
     * Deletes an ApprovalChainStep by ID.
     */
    @Transactional
    public void deleteApprovalChainStepById(Long id) {
        if (approvalChainStepRepository != null && id != null) {
            approvalChainStepRepository.deleteById(id);
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
     * Persists an Approval record after domain validation.
     */
    @Transactional
    public Approval saveApproval(Approval approval) {
        validateApprovalRecord(approval);
        if (approvalRepository != null) {
            return approvalRepository.save(approval);
        }
        return approval;
    }

    /**
     * Finds an Approval by ID.
     */
    public Optional<Approval> findApprovalById(Long id) {
        if (approvalRepository != null && id != null) {
            return approvalRepository.findById(id);
        }
        return Optional.empty();
    }

    /**
     * Finds all Approvals for a Quotation ID.
     */
    public List<Approval> findApprovalsByQuotationId(Long quotationId) {
        if (approvalRepository != null && quotationId != null) {
            return approvalRepository.findByQuotationId(quotationId);
        }
        return Collections.emptyList();
    }

    /**
     * Finds all Approvals matching a specific status.
     */
    public List<Approval> findApprovalsByStatus(String status) {
        if (approvalRepository != null && status != null) {
            return approvalRepository.findByStatus(status);
        }
        return Collections.emptyList();
    }

    /**
     * Retrieves all Approvals.
     */
    public List<Approval> findAllApprovals() {
        if (approvalRepository != null) {
            return approvalRepository.findAll();
        }
        return Collections.emptyList();
    }

    /**
     * Checks if an Approval exists by ID.
     */
    public boolean existsApprovalById(Long id) {
        return approvalRepository != null && id != null && approvalRepository.existsById(id);
    }

    /**
     * Deletes an Approval by ID.
     */
    @Transactional
    public void deleteApprovalById(Long id) {
        if (approvalRepository != null && id != null) {
            approvalRepository.deleteById(id);
        }
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
     * Approves an Approval record after state transition and sequential order checks, saving to repository if available.
     */
    @Transactional
    public void approveRecord(Approval approval, Long approverId, String decisionReason, List<Approval> existingApprovals) {
        if (approval == null) {
            throw new IllegalArgumentException("Approval record cannot be null");
        }

        List<Approval> contextApprovals = existingApprovals;
        if ((contextApprovals == null || contextApprovals.isEmpty()) && approvalRepository != null && approval.getQuotationId() != null) {
            contextApprovals = approvalRepository.findByQuotationId(approval.getQuotationId());
        }

        validateStatusTransition(approval.getStatus(), "APPROVED");
        if (approval.getStepNumber() != null) {
            validateSequentialApproval(contextApprovals, approval.getStepNumber());
        }
        if (approverId != null && approverId <= 0) {
            throw new IllegalArgumentException("Approver ID must be positive if specified");
        }

        approval.setStatus("APPROVED");
        approval.setApproverId(approverId);
        approval.setDecisionReason(decisionReason != null ? decisionReason.trim() : "Approved");
        approval.setDecidedAt(Instant.now());

        if (approvalRepository != null) {
            approvalRepository.save(approval);
        }
    }

    /**
     * Overloaded approveRecord without explicit existingApprovals list.
     */
    @Transactional
    public void approveRecord(Approval approval, Long approverId, String decisionReason) {
        approveRecord(approval, approverId, decisionReason, null);
    }

    /**
     * Rejects an Approval record after state transition and sequential order checks, saving to repository if available.
     */
    @Transactional
    public void rejectRecord(Approval approval, Long approverId, String decisionReason, List<Approval> existingApprovals) {
        if (approval == null) {
            throw new IllegalArgumentException("Approval record cannot be null");
        }

        List<Approval> contextApprovals = existingApprovals;
        if ((contextApprovals == null || contextApprovals.isEmpty()) && approvalRepository != null && approval.getQuotationId() != null) {
            contextApprovals = approvalRepository.findByQuotationId(approval.getQuotationId());
        }

        validateStatusTransition(approval.getStatus(), "REJECTED");
        if (approval.getStepNumber() != null) {
            validateSequentialApproval(contextApprovals, approval.getStepNumber());
        }
        if (approverId != null && approverId <= 0) {
            throw new IllegalArgumentException("Approver ID must be positive if specified");
        }

        approval.setStatus("REJECTED");
        approval.setApproverId(approverId);
        approval.setDecisionReason(decisionReason != null ? decisionReason.trim() : "Rejected");
        approval.setDecidedAt(Instant.now());

        if (approvalRepository != null) {
            approvalRepository.save(approval);
        }
    }

    /**
     * Overloaded rejectRecord without explicit existingApprovals list.
     */
    @Transactional
    public void rejectRecord(Approval approval, Long approverId, String decisionReason) {
        rejectRecord(approval, approverId, decisionReason, null);
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

    /**
     * Evaluates approval route by querying rule and step data from database repositories.
     */
    public ApprovalRouteResult determineApprovalRouteFromDb(Long customerId, Long tierId,
                                                            BigDecimal actualDiscountPercent, BigDecimal quotationTotal) {
        List<ApprovalChainRule> candidateRules = findAllApprovalChainRules();
        List<ApprovalChainStep> candidateSteps = findAllApprovalChainSteps();
        return determineApprovalRoute(candidateRules, candidateSteps, customerId, tierId, actualDiscountPercent, quotationTotal);
    }
}
