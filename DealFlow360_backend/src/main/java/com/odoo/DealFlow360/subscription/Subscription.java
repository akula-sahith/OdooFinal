package com.odoo.DealFlow360.subscription;

import java.time.Instant;
import java.util.Objects;

/**
 * Domain model representing a Subscription (SUBSCRIPTIONS table).
 */
public class Subscription {

    private Long id;
    private Long orderId;
    private Long customerId;
    private Long planId;
    private String status; // ACTIVE, PAUSED, CANCELLED, EXPIRED
    private Instant currentPeriodStart;
    private Instant currentPeriodEnd;
    private Boolean cancelAtPeriodEnd;
    private Instant createdAt;

    public Subscription() {
    }

    public Subscription(Long id, Long orderId, Long customerId, Long planId, String status,
                        Instant currentPeriodStart, Instant currentPeriodEnd, Boolean cancelAtPeriodEnd, Instant createdAt) {
        this.id = id;
        this.orderId = orderId;
        this.customerId = customerId;
        this.planId = planId;
        this.status = status;
        this.currentPeriodStart = currentPeriodStart;
        this.currentPeriodEnd = currentPeriodEnd;
        this.cancelAtPeriodEnd = cancelAtPeriodEnd;
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

    public Long getPlanId() {
        return planId;
    }

    public void setPlanId(Long planId) {
        this.planId = planId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Instant getCurrentPeriodStart() {
        return currentPeriodStart;
    }

    public void setCurrentPeriodStart(Instant currentPeriodStart) {
        this.currentPeriodStart = currentPeriodStart;
    }

    public Instant getCurrentPeriodEnd() {
        return currentPeriodEnd;
    }

    public void setCurrentPeriodEnd(Instant currentPeriodEnd) {
        this.currentPeriodEnd = currentPeriodEnd;
    }

    public Boolean getCancelAtPeriodEnd() {
        return cancelAtPeriodEnd;
    }

    public void setCancelAtPeriodEnd(Boolean cancelAtPeriodEnd) {
        this.cancelAtPeriodEnd = cancelAtPeriodEnd;
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
        Subscription that = (Subscription) o;
        return Objects.equals(id, that.id) &&
               Objects.equals(orderId, that.orderId) &&
               Objects.equals(customerId, that.customerId) &&
               Objects.equals(planId, that.planId) &&
               Objects.equals(status, that.status) &&
               Objects.equals(currentPeriodStart, that.currentPeriodStart) &&
               Objects.equals(currentPeriodEnd, that.currentPeriodEnd) &&
               Objects.equals(cancelAtPeriodEnd, that.cancelAtPeriodEnd) &&
               Objects.equals(createdAt, that.createdAt);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, orderId, customerId, planId, status, currentPeriodStart, currentPeriodEnd, cancelAtPeriodEnd, createdAt);
    }

    @Override
    public String toString() {
        return "Subscription{" +
               "id=" + id +
               ", orderId=" + orderId +
               ", customerId=" + customerId +
               ", planId=" + planId +
               ", status='" + status + '\'' +
               ", currentPeriodStart=" + currentPeriodStart +
               ", currentPeriodEnd=" + currentPeriodEnd +
               ", cancelAtPeriodEnd=" + cancelAtPeriodEnd +
               ", createdAt=" + createdAt +
               '}';
    }
}
