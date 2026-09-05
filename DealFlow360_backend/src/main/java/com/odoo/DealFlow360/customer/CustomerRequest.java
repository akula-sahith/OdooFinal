package com.odoo.DealFlow360.customer;

import java.time.Instant;
import java.util.Objects;

/**
 * Domain model representing a Customer Request in the system (CUSTOMER_REQUESTS table).
 */
public class CustomerRequest {

    private Long id;
    private Long customerId;
    private Long quotationId;
    private String requestType;
    private String description;
    private String status;
    private Instant createdAt;
    private Instant updatedAt;

    public CustomerRequest() {
    }

    public CustomerRequest(Long id, Long customerId, Long quotationId, String requestType,
                           String description, String status, Instant createdAt, Instant updatedAt) {
        this.id = id;
        this.customerId = customerId;
        this.quotationId = quotationId;
        this.requestType = requestType;
        this.description = description;
        this.status = status;
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

    public Long getQuotationId() {
        return quotationId;
    }

    public void setQuotationId(Long quotationId) {
        this.quotationId = quotationId;
    }

    public String getRequestType() {
        return requestType;
    }

    public void setRequestType(String requestType) {
        this.requestType = requestType;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
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
        CustomerRequest that = (CustomerRequest) o;
        return Objects.equals(id, that.id) &&
               Objects.equals(customerId, that.customerId) &&
               Objects.equals(quotationId, that.quotationId) &&
               Objects.equals(requestType, that.requestType) &&
               Objects.equals(description, that.description) &&
               Objects.equals(status, that.status) &&
               Objects.equals(createdAt, that.createdAt) &&
               Objects.equals(updatedAt, that.updatedAt);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, customerId, quotationId, requestType, description, status, createdAt, updatedAt);
    }

    @Override
    public String toString() {
        return "CustomerRequest{" +
               "id=" + id +
               ", customerId=" + customerId +
               ", quotationId=" + quotationId +
               ", requestType='" + requestType + '\'' +
               ", description='" + description + '\'' +
               ", status='" + status + '\'' +
               ", createdAt=" + createdAt +
               ", updatedAt=" + updatedAt +
               '}';
    }
}
