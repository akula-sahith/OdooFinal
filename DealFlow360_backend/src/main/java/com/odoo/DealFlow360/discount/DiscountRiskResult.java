package com.odoo.DealFlow360.discount;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

/**
 * Result object capturing aggregated quotation discount risk evaluation.
 */
public class DiscountRiskResult {

    private BigDecimal overallViolationPercent;
    private boolean overallApprovalRequired;
    private List<DiscountLineRiskResult> lineRiskResults;

    public DiscountRiskResult() {
        this.overallViolationPercent = BigDecimal.ZERO;
        this.overallApprovalRequired = false;
        this.lineRiskResults = new ArrayList<>();
    }

    public DiscountRiskResult(BigDecimal overallViolationPercent, boolean overallApprovalRequired,
                              List<DiscountLineRiskResult> lineRiskResults) {
        this.overallViolationPercent = overallViolationPercent != null ? overallViolationPercent : BigDecimal.ZERO;
        this.overallApprovalRequired = overallApprovalRequired;
        this.lineRiskResults = lineRiskResults != null ? lineRiskResults : new ArrayList<>();
    }

    public BigDecimal getOverallViolationPercent() {
        return overallViolationPercent;
    }

    public void setOverallViolationPercent(BigDecimal overallViolationPercent) {
        this.overallViolationPercent = overallViolationPercent;
    }

    public boolean isOverallApprovalRequired() {
        return overallApprovalRequired;
    }

    public void setOverallApprovalRequired(boolean overallApprovalRequired) {
        this.overallApprovalRequired = overallApprovalRequired;
    }

    public List<DiscountLineRiskResult> getLineRiskResults() {
        return lineRiskResults;
    }

    public void setLineRiskResults(List<DiscountLineRiskResult> lineRiskResults) {
        this.lineRiskResults = lineRiskResults;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        DiscountRiskResult that = (DiscountRiskResult) o;
        return overallApprovalRequired == that.overallApprovalRequired &&
               Objects.equals(overallViolationPercent, that.overallViolationPercent) &&
               Objects.equals(lineRiskResults, that.lineRiskResults);
    }

    @Override
    public int hashCode() {
        return Objects.hash(overallViolationPercent, overallApprovalRequired, lineRiskResults);
    }

    @Override
    public String toString() {
        return "DiscountRiskResult{" +
               "overallViolationPercent=" + overallViolationPercent +
               ", overallApprovalRequired=" + overallApprovalRequired +
               ", lineRiskResults=" + lineRiskResults +
               '}';
    }
}
