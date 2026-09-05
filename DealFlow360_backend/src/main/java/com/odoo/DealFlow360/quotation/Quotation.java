package com.odoo.DealFlow360.quotation;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Objects;

/**
 * Domain model representing a Quotation in the system (QUOTATIONS table).
 */
public class Quotation {

    private Long id;
    private Long customerId;
    private Long priceListId;
    private String status;
    private String currency;
    private BigDecimal subtotalAmount;
    private BigDecimal taxAmount;
    private BigDecimal totalAmount;
    private Instant validUntil;
    private Instant createdAt;
    private Instant updatedAt;

    public Quotation() {
    }

    public Quotation(Long id, Long customerId, Long priceListId, String status, String currency,
                     BigDecimal subtotalAmount, BigDecimal taxAmount, BigDecimal totalAmount,
                     Instant validUntil, Instant createdAt, Instant updatedAt) {
        this.id = id;
        this.customerId = customerId;
        this.priceListId = priceListId;
        this.status = status;
        this.currency = currency;
        this.subtotalAmount = subtotalAmount;
        this.taxAmount = taxAmount;
        this.totalAmount = totalAmount;
        this.validUntil = validUntil;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public Long getPriceListId() {
        return priceListId;
    }

    public void setPriceListId(Long priceListId) {
        this.priceListId = priceListId;
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

    public Instant getValidUntil() {
        return validUntil;
    }

    public void setValidUntil(Instant validUntil) {
        this.validUntil = validUntil;
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
        Quotation quotation = (Quotation) o;
        return Objects.equals(id, quotation.id) &&
               Objects.equals(customerId, quotation.customerId) &&
               Objects.equals(priceListId, quotation.priceListId) &&
               Objects.equals(status, quotation.status) &&
               Objects.equals(currency, quotation.currency) &&
               Objects.equals(subtotalAmount, quotation.subtotalAmount) &&
               Objects.equals(taxAmount, quotation.taxAmount) &&
               Objects.equals(totalAmount, quotation.totalAmount) &&
               Objects.equals(validUntil, quotation.validUntil) &&
               Objects.equals(createdAt, quotation.createdAt) &&
               Objects.equals(updatedAt, quotation.updatedAt);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, customerId, priceListId, status, currency, subtotalAmount, taxAmount, totalAmount, validUntil, createdAt, updatedAt);
    }

    @Override
    public String toString() {
        return "Quotation{" +
               "id=" + id +
               ", customerId=" + customerId +
               ", priceListId=" + priceListId +
               ", status='" + status + '\'' +
               ", currency='" + currency + '\'' +
               ", subtotalAmount=" + subtotalAmount +
               ", taxAmount=" + taxAmount +
               ", totalAmount=" + totalAmount +
               ", validUntil=" + validUntil +
               ", createdAt=" + createdAt +
               ", updatedAt=" + updatedAt +
               '}';
    }
}
