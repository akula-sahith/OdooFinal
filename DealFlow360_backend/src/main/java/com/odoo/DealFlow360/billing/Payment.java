package com.odoo.DealFlow360.billing;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Objects;

/**
 * Domain model representing a Payment (PAYMENTS table).
 */
public class Payment {

    private Long id;
    private Long invoiceId;
    private String paymentMethod;
    private BigDecimal amount;
    private String status; // SUCCESS, FAILED, PENDING
    private String transactionReference;
    private Instant processedAt;

    public Payment() {
    }

    public Payment(Long id, Long invoiceId, String paymentMethod, BigDecimal amount, String status,
                   String transactionReference, Instant processedAt) {
        this.id = id;
        this.invoiceId = invoiceId;
        this.paymentMethod = paymentMethod;
        this.amount = amount;
        this.status = status;
        this.transactionReference = transactionReference;
        this.processedAt = processedAt;
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

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getTransactionReference() {
        return transactionReference;
    }

    public void setTransactionReference(String transactionReference) {
        this.transactionReference = transactionReference;
    }

    public Instant getProcessedAt() {
        return processedAt;
    }

    public void setProcessedAt(Instant processedAt) {
        this.processedAt = processedAt;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Payment payment = (Payment) o;
        return Objects.equals(id, payment.id) &&
               Objects.equals(invoiceId, payment.invoiceId) &&
               Objects.equals(paymentMethod, payment.paymentMethod) &&
               Objects.equals(amount, payment.amount) &&
               Objects.equals(status, payment.status) &&
               Objects.equals(transactionReference, payment.transactionReference) &&
               Objects.equals(processedAt, payment.processedAt);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, invoiceId, paymentMethod, amount, status, transactionReference, processedAt);
    }

    @Override
    public String toString() {
        return "Payment{" +
               "id=" + id +
               ", invoiceId=" + invoiceId +
               ", paymentMethod='" + paymentMethod + '\'' +
               ", amount=" + amount +
               ", status='" + status + '\'' +
               ", transactionReference='" + transactionReference + '\'' +
               ", processedAt=" + processedAt +
               '}';
    }
}
