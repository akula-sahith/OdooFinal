package com.odoo.DealFlow360.approval;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

/**
 * Result object capturing the matched approval rule and its ordered approval steps.
 */
public class ApprovalRouteResult {

    private ApprovalChainRule matchedRule;
    private List<ApprovalChainStep> orderedSteps;
    private boolean approvalRequired;

    public ApprovalRouteResult() {
        this.matchedRule = null;
        this.orderedSteps = new ArrayList<>();
        this.approvalRequired = false;
    }

    public ApprovalRouteResult(ApprovalChainRule matchedRule, List<ApprovalChainStep> orderedSteps, boolean approvalRequired) {
        this.matchedRule = matchedRule;
        this.orderedSteps = orderedSteps != null ? orderedSteps : new ArrayList<>();
        this.approvalRequired = approvalRequired;
    }

    public ApprovalChainRule getMatchedRule() {
        return matchedRule;
    }

    public void setMatchedRule(ApprovalChainRule matchedRule) {
        this.matchedRule = matchedRule;
    }

    public List<ApprovalChainStep> getOrderedSteps() {
        return orderedSteps;
    }

    public void setOrderedSteps(List<ApprovalChainStep> orderedSteps) {
        this.orderedSteps = orderedSteps;
    }

    public boolean isApprovalRequired() {
        return approvalRequired;
    }

    public void setApprovalRequired(boolean approvalRequired) {
        this.approvalRequired = approvalRequired;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ApprovalRouteResult that = (ApprovalRouteResult) o;
        return approvalRequired == that.approvalRequired &&
               Objects.equals(matchedRule, that.matchedRule) &&
               Objects.equals(orderedSteps, that.orderedSteps);
    }

    @Override
    public int hashCode() {
        return Objects.hash(matchedRule, orderedSteps, approvalRequired);
    }

    @Override
    public String toString() {
        return "ApprovalRouteResult{" +
               "matchedRule=" + matchedRule +
               ", orderedSteps=" + orderedSteps +
               ", approvalRequired=" + approvalRequired +
               '}';
    }
}
