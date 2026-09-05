package com.odoo.DealFlow360.negotiation;

import com.odoo.DealFlow360.approval.ApprovalRouteResult;
import com.odoo.DealFlow360.discount.DiscountRiskResult;
import com.odoo.DealFlow360.quotation.Quotation;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

/**
 * Pure database-independent business engine that evaluates negotiation request validity,
 * state machine transitions, quotation negotiation eligibility, and workflow outcome routing.
 */
@Component
public class NegotiationEngine {

    private static final Set<String> ALLOWED_STATUSES = new HashSet<>(Arrays.asList(
            "PENDING", "IN_REVIEW", "APPROVED", "REJECTED", "CANCELLED"
    ));

    private static final Set<String> NEGOTIABLE_QUOTATION_STATUSES = new HashSet<>(Arrays.asList(
            "DRAFT", "SENT", "UNDER_NEGOTIATION", "RETURNED_FOR_REVISION"
    ));

    /**
     * Validates domain constraints on a NegotiationRequest entity.
     */
    public void validateNegotiationRequest(NegotiationRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Negotiation request cannot be null");
        }
        if (request.getCustomerId() == null || request.getCustomerId() <= 0) {
            throw new IllegalArgumentException("Negotiation request must be associated with a valid positive Customer ID");
        }
        if (request.getQuotationId() != null && request.getQuotationId() <= 0) {
            throw new IllegalArgumentException("Quotation ID must be a positive number if specified");
        }
        if (request.getRequestType() == null || request.getRequestType().trim().isEmpty()) {
            throw new IllegalArgumentException("Request type cannot be null or blank");
        }
        if (request.getDescription() == null || request.getDescription().trim().isEmpty()) {
            throw new IllegalArgumentException("Request description cannot be null or blank");
        }
        if (request.getStatus() == null || request.getStatus().trim().isEmpty()) {
            throw new IllegalArgumentException("Request status cannot be null or blank");
        }
        if (!ALLOWED_STATUSES.contains(request.getStatus().trim().toUpperCase())) {
            throw new IllegalArgumentException("Invalid negotiation request status: " + request.getStatus());
        }
    }

    /**
     * Validates status transitions for the NegotiationRequest state machine.
     * State Machine Rules:
     * PENDING -> IN_REVIEW, APPROVED, REJECTED, CANCELLED
     * IN_REVIEW -> APPROVED, REJECTED, CANCELLED
     * APPROVED, REJECTED, CANCELLED are terminal states and cannot transition out.
     */
    public void validateStatusTransition(String currentStatus, String newStatus) {
        if (newStatus == null || newStatus.trim().isEmpty()) {
            throw new IllegalArgumentException("New status cannot be null or blank");
        }
        String current = currentStatus != null ? currentStatus.trim().toUpperCase() : "PENDING";
        String target = newStatus.trim().toUpperCase();

        if (!ALLOWED_STATUSES.contains(target)) {
            throw new IllegalArgumentException("Invalid negotiation request status: " + newStatus);
        }

        if (current.equals(target)) {
            return; // No-op transition
        }

        if ("APPROVED".equals(current) || "REJECTED".equals(current) || "CANCELLED".equals(current)) {
            throw new IllegalStateException("Cannot transition out of terminal negotiation status: " + current);
        }

        boolean valid = false;
        if ("PENDING".equals(current)) {
            valid = "IN_REVIEW".equals(target) || "APPROVED".equals(target) || "REJECTED".equals(target) || "CANCELLED".equals(target);
        } else if ("IN_REVIEW".equals(current)) {
            valid = "APPROVED".equals(target) || "REJECTED".equals(target) || "CANCELLED".equals(target);
        }

        if (!valid) {
            throw new IllegalStateException("Illegal negotiation status transition from " + current + " to " + target);
        }
    }

    /**
     * Evaluates whether a Quotation is in a negotiable state.
     */
    public boolean canNegotiateQuotation(Quotation quotation) {
        if (quotation == null || quotation.getStatus() == null) {
            return false;
        }
        String status = quotation.getStatus().trim().toUpperCase();
        return NEGOTIABLE_QUOTATION_STATUSES.contains(status);
    }

    /**
     * Evaluates the target quotation status based on discount risk and approval routing results.
     */
    public String resolveQuotationTargetState(DiscountRiskResult riskResult, ApprovalRouteResult approvalRouteResult) {
        boolean riskApprovalRequired = riskResult != null && riskResult.isOverallApprovalRequired();
        boolean routeApprovalRequired = approvalRouteResult != null && approvalRouteResult.isApprovalRequired();

        if (riskApprovalRequired || routeApprovalRequired) {
            return "PENDING_APPROVAL";
        } else {
            return "UNDER_NEGOTIATION";
        }
    }

    /**
     * Generates a version change summary string for quotation versioning.
     */
    public String generateNegotiationVersionSummary(NegotiationRequest request) {
        if (request == null) {
            return "Negotiation update";
        }
        String type = request.getRequestType() != null ? request.getRequestType().trim() : "GENERAL";
        return "Negotiation [" + type + "]: " + (request.getDescription() != null ? request.getDescription().trim() : "");
    }
}
