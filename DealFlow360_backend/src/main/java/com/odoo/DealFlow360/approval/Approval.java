package com.odoo.DealFlow360.approval;

import java.time.Instant;
import java.util.Objects;

/**
 * Domain model representing an actual quotation approval record (APPROVALS table).
 */
public class Approval {

    private Long id;
    private Long quotationId;
    private Long approverId;
    private Integer stepNumber;
    private String status;
    private String decisionReason;
    private Instant createdAt;
    private Instant decidedAt;

    public Approval() {
    }

    public Approval(Long id, Long quotationId, Long approverId, Integer stepNumber,
                    String status, String decisionReason, Instant createdAt, Instant decidedAt) {
        this.id = id;
        this.quotationId = quotationId;
        this.approverId = approverId;
        this.stepNumber = stepNumber;
        this.status = status;
        this.decisionReason = decisionReason;
        this.createdAt = createdAt;
        this.decidedAt = decidedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getQuotationId() {
        return quotationId;
    }

    public void setQuotationId(Long quotationId) {
        this.quotationId = quotationId;
    }

    public Long getApproverId() {
        return approverId;
    }

    public void setApproverId(Long approverId) {
        this.approverId = approverId;
    }

    public Integer getStepNumber() {
        return stepNumber;
    }

    public void setStepNumber(Integer stepNumber) {
        this.stepNumber = stepNumber;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getDecisionReason() {
        return decisionReason;
    }

    public void setDecisionReason(String decisionReason) {
        this.decisionReason = decisionReason;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getDecidedAt() {
        return decidedAt;
    }

    public void setDecidedAt(Instant decidedAt) {
        this.decidedAt = decidedAt;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Approval approval = (Approval) o;
        return Objects.equals(id, approval.id) &&
               Objects.equals(quotationId, approval.quotationId) &&
               Objects.equals(approverId, approval.approverId) &&
               Objects.equals(stepNumber, approval.stepNumber) &&
               Objects.equals(status, approval.status) &&
               Objects.equals(decisionReason, approval.decisionReason) &&
               Objects.equals(createdAt, approval.createdAt) &&
               Objects.equals(decidedAt, approval.decidedAt);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, quotationId, approverId, stepNumber, status, decisionReason, createdAt, decidedAt);
    }

    @Override
    public String toString() {
        return "Approval{" +
               "id=" + id +
               ", quotationId=" + quotationId +
               ", approverId=" + approverId +
               ", stepNumber=" + stepNumber +
               ", status='" + status + '\'' +
               ", decisionReason='" + decisionReason + '\'' +
               ", createdAt=" + createdAt +
               ", decidedAt=" + decidedAt +
               '}';
    }
}
