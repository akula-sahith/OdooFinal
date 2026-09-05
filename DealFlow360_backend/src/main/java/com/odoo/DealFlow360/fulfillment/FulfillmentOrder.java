package com.odoo.DealFlow360.fulfillment;

import java.time.Instant;
import java.util.Objects;

/**
 * Domain model representing a Fulfillment Order (FULFILLMENT_ORDERS table).
 */
public class FulfillmentOrder {

    private Long id;
    private Long orderId;
    private String status;
    private Instant createdAt;
    private Instant shippedAt;

    public FulfillmentOrder() {
    }

    public FulfillmentOrder(Long id, Long orderId, String status, Instant createdAt, Instant shippedAt) {
        this.id = id;
        this.orderId = orderId;
        this.status = status;
        this.createdAt = createdAt;
        this.shippedAt = shippedAt;
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getShippedAt() {
        return shippedAt;
    }

    public void setShippedAt(Instant shippedAt) {
        this.shippedAt = shippedAt;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        FulfillmentOrder that = (FulfillmentOrder) o;
        return Objects.equals(id, that.id) &&
               Objects.equals(orderId, that.orderId) &&
               Objects.equals(status, that.status) &&
               Objects.equals(createdAt, that.createdAt) &&
               Objects.equals(shippedAt, that.shippedAt);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, orderId, status, createdAt, shippedAt);
    }

    @Override
    public String toString() {
        return "FulfillmentOrder{" +
               "id=" + id +
               ", orderId=" + orderId +
               ", status='" + status + '\'' +
               ", createdAt=" + createdAt +
               ", shippedAt=" + shippedAt +
               '}';
    }
}
