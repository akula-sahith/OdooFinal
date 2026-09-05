package com.odoo.DealFlow360.fulfillment;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Objects;

/**
 * Domain model representing an Order (ORDERS table).
 */
public class Order {

    private Long id;
    private Long quotationId;
    private Long customerId;
    private String status;
    private String currency;
    private BigDecimal subtotalAmount;
    private BigDecimal taxAmount;
    private BigDecimal totalAmount;
    private BigDecimal discountAmount;
    private Instant createdAt;
    private Instant updatedAt;

    public Order() {
    }

    public Order(Long id, Long quotationId, Long customerId, String status, String currency,
                 BigDecimal subtotalAmount, BigDecimal taxAmount, BigDecimal totalAmount,
                 BigDecimal discountAmount, Instant createdAt, Instant updatedAt) {
        this.id = id;
        this.quotationId = quotationId;
        this.customerId = customerId;
        this.status = status;
        this.currency = currency;
        this.subtotalAmount = subtotalAmount;
        this.taxAmount = taxAmount;
        this.totalAmount = totalAmount;
        this.discountAmount = discountAmount;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
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

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
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

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Order order = (Order) o;
        return Objects.equals(id, order.id) &&
               Objects.equals(quotationId, order.quotationId) &&
               Objects.equals(customerId, order.customerId) &&
               Objects.equals(status, order.status) &&
               Objects.equals(currency, order.currency) &&
               Objects.equals(subtotalAmount, order.subtotalAmount) &&
               Objects.equals(taxAmount, order.taxAmount) &&
               Objects.equals(totalAmount, order.totalAmount) &&
               Objects.equals(discountAmount, order.discountAmount) &&
               Objects.equals(createdAt, order.createdAt) &&
               Objects.equals(updatedAt, order.updatedAt);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, quotationId, customerId, status, currency, subtotalAmount, taxAmount, totalAmount, discountAmount, createdAt, updatedAt);
    }

    @Override
    public String toString() {
        return "Order{" +
               "id=" + id +
               ", quotationId=" + quotationId +
               ", customerId=" + customerId +
               ", status='" + status + '\'' +
               ", currency='" + currency + '\'' +
               ", subtotalAmount=" + subtotalAmount +
               ", taxAmount=" + taxAmount +
               ", totalAmount=" + totalAmount +
               ", discountAmount=" + discountAmount +
               ", createdAt=" + createdAt +
               ", updatedAt=" + updatedAt +
               '}';
    }
}
