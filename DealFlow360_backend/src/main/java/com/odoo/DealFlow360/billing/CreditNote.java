package com.odoo.DealFlow360.billing;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Objects;

/**
 * Domain model representing a Credit Note (CREDIT_NOTES table).
 */
public class CreditNote {

    private Long id;
    private Long invoiceId;
    private BigDecimal amount;
    private String reason;
    private BigDecimal discountAmount;
    private Instant createdAt;

    public CreditNote() {
    }

    public CreditNote(Long id, Long invoiceId, BigDecimal amount, String reason, BigDecimal discountAmount, Instant createdAt) {
        this.id = id;
        this.invoiceId = invoiceId;
        this.amount = amount;
        this.reason = reason;
        this.discountAmount = discountAmount;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getInvoiceId() {
        return invoiceId;
    }

    public void setInvoiceId(Long invoiceId) {
        this.invoiceId = invoiceId;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public BigDecimal getDiscountAmount() {
        return discountAmount;
    }

    public void setDiscountAmount(BigDecimal discountAmount) {
        this.discountAmount = discountAmount;
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
        CreditNote creditNote = (CreditNote) o;
        return Objects.equals(id, creditNote.id) &&
               Objects.equals(invoiceId, creditNote.invoiceId) &&
               Objects.equals(amount, creditNote.amount) &&
               Objects.equals(reason, creditNote.reason) &&
               Objects.equals(discountAmount, creditNote.discountAmount) &&
               Objects.equals(createdAt, creditNote.createdAt);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, invoiceId, amount, reason, discountAmount, createdAt);
    }

    @Override
    public String toString() {
        return "CreditNote{" +
               "id=" + id +
               ", invoiceId=" + invoiceId +
               ", amount=" + amount +
               ", reason='" + reason + '\'' +
               ", discountAmount=" + discountAmount +
               ", createdAt=" + createdAt +
               '}';
    }
}
