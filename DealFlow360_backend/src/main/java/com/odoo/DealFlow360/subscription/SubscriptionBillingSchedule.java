package com.odoo.DealFlow360.subscription;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Objects;

/**
 * Domain model representing a recurring billing schedule entry (SUBSCRIPTION_BILLING_SCHEDULE table).
 */
public class SubscriptionBillingSchedule {

    private Long id;
    private Long subscriptionId;
    private Instant billingDate;
    private BigDecimal amount;
    private String status; // PENDING, INVOICED, PAID, CANCELLED

    public SubscriptionBillingSchedule() {
    }

    public SubscriptionBillingSchedule(Long id, Long subscriptionId, Instant billingDate, BigDecimal amount, String status) {
        this.id = id;
        this.subscriptionId = subscriptionId;
        this.billingDate = billingDate;
        this.amount = amount;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getSubscriptionId() {
        return subscriptionId;
    }

    public void setSubscriptionId(Long subscriptionId) {
        this.subscriptionId = subscriptionId;
    }

    public Instant getBillingDate() {
        return billingDate;
    }

    public void setBillingDate(Instant billingDate) {
        this.billingDate = billingDate;
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

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        SubscriptionBillingSchedule that = (SubscriptionBillingSchedule) o;
        return Objects.equals(id, that.id) &&
               Objects.equals(subscriptionId, that.subscriptionId) &&
               Objects.equals(billingDate, that.billingDate) &&
               Objects.equals(amount, that.amount) &&
               Objects.equals(status, that.status);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, subscriptionId, billingDate, amount, status);
    }

    @Override
    public String toString() {
        return "SubscriptionBillingSchedule{" +
               "id=" + id +
               ", subscriptionId=" + subscriptionId +
               ", billingDate=" + billingDate +
               ", amount=" + amount +
               ", status='" + status + '\'' +
               '}';
    }
}
