package com.odoo.DealFlow360.discount;

import java.math.BigDecimal;
import java.util.Objects;

/**
 * Result object capturing line-level discount evaluation, policy limits, and violation status.
 */
public class DiscountLineRiskResult {

    private Long productId;
    private Long productVariantId;
    private BigDecimal actualDiscountPercent;
    private BigDecimal effectiveAllowedDiscountPercent;
    private BigDecimal violationPercent;
    private boolean approvalRequired;
    private String policySource;

    public DiscountLineRiskResult() {
    }

    public DiscountLineRiskResult(Long productId, Long productVariantId, BigDecimal actualDiscountPercent,
                                  BigDecimal effectiveAllowedDiscountPercent, BigDecimal violationPercent,
                                  boolean approvalRequired, String policySource) {
        this.productId = productId;
        this.productVariantId = productVariantId;
        this.actualDiscountPercent = actualDiscountPercent;
        this.effectiveAllowedDiscountPercent = effectiveAllowedDiscountPercent;
        this.violationPercent = violationPercent;
        this.approvalRequired = approvalRequired;
        this.policySource = policySource;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public Long getProductVariantId() {
        return productVariantId;
    }

    public void setProductVariantId(Long productVariantId) {
        this.productVariantId = productVariantId;
    }

    public BigDecimal getActualDiscountPercent() {
        return actualDiscountPercent;
    }

    public void setActualDiscountPercent(BigDecimal actualDiscountPercent) {
        this.actualDiscountPercent = actualDiscountPercent;
    }

    public BigDecimal getEffectiveAllowedDiscountPercent() {
        return effectiveAllowedDiscountPercent;
    }

    public void setEffectiveAllowedDiscountPercent(BigDecimal effectiveAllowedDiscountPercent) {
        this.effectiveAllowedDiscountPercent = effectiveAllowedDiscountPercent;
    }

    public BigDecimal getViolationPercent() {
        return violationPercent;
    }

    public void setViolationPercent(BigDecimal violationPercent) {
        this.violationPercent = violationPercent;
    }

    public boolean isApprovalRequired() {
        return approvalRequired;
    }

    public void setApprovalRequired(boolean approvalRequired) {
        this.approvalRequired = approvalRequired;
    }

    public String getPolicySource() {
        return policySource;
    }

    public void setPolicySource(String policySource) {
        this.policySource = policySource;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        DiscountLineRiskResult that = (DiscountLineRiskResult) o;
        return approvalRequired == that.approvalRequired &&
               Objects.equals(productId, that.productId) &&
               Objects.equals(productVariantId, that.productVariantId) &&
               Objects.equals(actualDiscountPercent, that.actualDiscountPercent) &&
               Objects.equals(effectiveAllowedDiscountPercent, that.effectiveAllowedDiscountPercent) &&
               Objects.equals(violationPercent, that.violationPercent) &&
               Objects.equals(policySource, that.policySource);
    }

    @Override
    public int hashCode() {
        return Objects.hash(productId, productVariantId, actualDiscountPercent,
                            effectiveAllowedDiscountPercent, violationPercent, approvalRequired, policySource);
    }

    @Override
    public String toString() {
        return "DiscountLineRiskResult{" +
               "productId=" + productId +
               ", productVariantId=" + productVariantId +
               ", actualDiscountPercent=" + actualDiscountPercent +
               ", effectiveAllowedDiscountPercent=" + effectiveAllowedDiscountPercent +
               ", violationPercent=" + violationPercent +
               ", approvalRequired=" + approvalRequired +
               ", policySource='" + policySource + '\'' +
               '}';
    }
}
