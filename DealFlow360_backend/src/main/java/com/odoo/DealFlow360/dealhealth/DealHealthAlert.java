package com.odoo.DealFlow360.dealhealth;

import java.time.Instant;
import java.util.Objects;

/**
 * Domain model representing a Deal Health Alert (DEAL_HEALTH_ALERTS table).
 */
public class DealHealthAlert {

    private Long id;
    private Long quotationId;
    private String alertType; // STALLED_DEAL, DISCOUNT_ANOMALY, DELIVERY_SLIPPAGE
    private String severity;  // LOW, MEDIUM, HIGH, CRITICAL
    private String status;    // ACTIVE, ACKNOWLEDGED, RESOLVED
    private Instant triggeredAt;
    private Instant resolvedAt;

    public DealHealthAlert() {
    }

    public DealHealthAlert(Long id, Long quotationId, String alertType, String severity, String status, Instant triggeredAt, Instant resolvedAt) {
        this.id = id;
        this.quotationId = quotationId;
        this.alertType = alertType;
        this.severity = severity;
        this.status = status;
        this.triggeredAt = triggeredAt;
        this.resolvedAt = resolvedAt;
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

    public String getAlertType() {
        return alertType;
    }

    public void setAlertType(String alertType) {
        this.alertType = alertType;
    }

    public String getSeverity() {
        return severity;
    }

    public void setSeverity(String severity) {
        this.severity = severity;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Instant getTriggeredAt() {
        return triggeredAt;
    }

    public void setTriggeredAt(Instant triggeredAt) {
        this.triggeredAt = triggeredAt;
    }

    public Instant getResolvedAt() {
        return resolvedAt;
    }

    public void setResolvedAt(Instant resolvedAt) {
        this.resolvedAt = resolvedAt;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        DealHealthAlert alert = (DealHealthAlert) o;
        return Objects.equals(id, alert.id) &&
               Objects.equals(quotationId, alert.quotationId) &&
               Objects.equals(alertType, alert.alertType) &&
               Objects.equals(severity, alert.severity) &&
               Objects.equals(status, alert.status) &&
               Objects.equals(triggeredAt, alert.triggeredAt) &&
               Objects.equals(resolvedAt, alert.resolvedAt);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, quotationId, alertType, severity, status, triggeredAt, resolvedAt);
    }

    @Override
    public String toString() {
        return "DealHealthAlert{" +
               "id=" + id +
               ", quotationId=" + quotationId +
               ", alertType='" + alertType + '\'' +
               ", severity='" + severity + '\'' +
               ", status='" + status + '\'' +
               ", triggeredAt=" + triggeredAt +
               ", resolvedAt=" + resolvedAt +
               '}';
    }
}
