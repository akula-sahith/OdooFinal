package com.odoo.DealFlow360.quotation;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Objects;

/**
 * Domain model representing a Quotation Version in the system (QUOTATION_VERSIONS table).
 */
public class QuotationVersion {

    private Long id;
    private Long quotationId;
    private Integer versionNumber;
    private String status;
    private BigDecimal totalAmount;
    private String changeSummary;
    private Instant createdAt;

    public QuotationVersion() {
    }

    public QuotationVersion(Long id, Long quotationId, Integer versionNumber, String status,
                            BigDecimal totalAmount, String changeSummary, Instant createdAt) {
        this.id = id;
        this.quotationId = quotationId;
        this.versionNumber = versionNumber;
        this.status = status;
        this.totalAmount = totalAmount;
        this.changeSummary = changeSummary;
        this.createdAt = createdAt;
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

    public Integer getVersionNumber() {
        return versionNumber;
    }

    public void setVersionNumber(Integer versionNumber) {
        this.versionNumber = versionNumber;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public String getChangeSummary() {
        return changeSummary;
    }

    public void setChangeSummary(String changeSummary) {
        this.changeSummary = changeSummary;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        QuotationVersion that = (QuotationVersion) o;
        return Objects.equals(id, that.id) &&
               Objects.equals(quotationId, that.quotationId) &&
               Objects.equals(versionNumber, that.versionNumber) &&
               Objects.equals(status, that.status) &&
               Objects.equals(totalAmount, that.totalAmount) &&
               Objects.equals(changeSummary, that.changeSummary) &&
               Objects.equals(createdAt, that.createdAt);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, quotationId, versionNumber, status, totalAmount, changeSummary, createdAt);
    }

    @Override
    public String toString() {
        return "QuotationVersion{" +
               "id=" + id +
               ", quotationId=" + quotationId +
               ", versionNumber=" + versionNumber +
               ", status='" + status + '\'' +
               ", totalAmount=" + totalAmount +
               ", changeSummary='" + changeSummary + '\'' +
               ", createdAt=" + createdAt +
               '}';
    }
}
