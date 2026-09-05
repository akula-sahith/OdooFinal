package com.odoo.DealFlow360.billing;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Objects;

/**
 * Domain model representing an Invoice (INVOICES table).
 */
public class Invoice {

    private Long id;
    private Long orderId;
    private Long customerId;
    private String status; // DRAFT, ISSUED, PAID, PARTIALLY_PAID, OVERDUE, VOID
    private BigDecimal subtotalAmount;
    private BigDecimal taxAmount;
    private BigDecimal totalAmount;
    private Instant dueDate;
    private Instant createdAt;

    public Invoice() {
    }

    public Invoice(Long id, Long orderId, Long customerId, String status, BigDecimal subtotalAmount,
                   BigDecimal taxAmount, BigDecimal totalAmount, Instant dueDate, Instant createdAt) {
        this.id = id;
        this.orderId = orderId;
        this.customerId = customerId;
        this.status = status;
        this.subtotalAmount = subtotalAmount;
        this.taxAmount = taxAmount;
        this.totalAmount = totalAmount;
        this.dueDate = dueDate;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public BigDecimal getSubtotalAmount() {
        return subtotalAmount;
    }

    public void setSubtotalAmount(BigDecimal subtotalAmount) {
        this.subtotalAmount = subtotalAmount;
    }

    public BigDecimal getTaxAmount() {
        return taxAmount;
    }

    public void setTaxAmount(BigDecimal taxAmount) {
        this.taxAmount = taxAmount;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public Instant getDueDate() {
        return dueDate;
    }

    public void setDueDate(Instant dueDate) {
        this.dueDate = dueDate;
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
        Invoice invoice = (Invoice) o;
        return Objects.equals(id, invoice.id) &&
               Objects.equals(orderId, invoice.orderId) &&
               Objects.equals(customerId, invoice.customerId) &&
               Objects.equals(status, invoice.status) &&
               Objects.equals(subtotalAmount, invoice.subtotalAmount) &&
               Objects.equals(taxAmount, invoice.taxAmount) &&
               Objects.equals(totalAmount, invoice.totalAmount) &&
               Objects.equals(dueDate, invoice.dueDate) &&
               Objects.equals(createdAt, invoice.createdAt);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, orderId, customerId, status, subtotalAmount, taxAmount, totalAmount, dueDate, createdAt);
    }

    @Override
    public String toString() {
        return "Invoice{" +
               "id=" + id +
               ", orderId=" + orderId +
               ", customerId=" + customerId +
               ", status='" + status + '\'' +
               ", subtotalAmount=" + subtotalAmount +
               ", taxAmount=" + taxAmount +
               ", totalAmount=" + totalAmount +
               ", dueDate=" + dueDate +
               ", createdAt=" + createdAt +
               '}';
    }
}
