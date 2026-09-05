package com.odoo.DealFlow360.common;

import java.time.Instant;
import java.util.Objects;

/**
 * Domain model representing an Audit Log record in the AUDIT_LOG table.
 */
public class AuditLog {

    private Long id;
    private String entityType;
    private Long entityId;
    private String action;
    private Long userId;
    private String changesJson;
    private Instant createdAt;

    public AuditLog() {
    }

    public AuditLog(Long id, String entityType, Long entityId, String action, Long userId, String changesJson, Instant createdAt) {
        this.id = id;
        this.entityType = entityType;
        this.entityId = entityId;
        this.action = action;
        this.userId = userId;
        this.changesJson = changesJson;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEntityType() {
        return entityType;
    }

    public void setEntityType(String entityType) {
        this.entityType = entityType;
    }

    public Long getEntityId() {
        return entityId;
    }

    public void setEntityId(Long entityId) {
        this.entityId = entityId;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getChangesJson() {
        return changesJson;
    }

    public void setChangesJson(String changesJson) {
        this.changesJson = changesJson;
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
        AuditLog auditLog = (AuditLog) o;
        return Objects.equals(id, auditLog.id) &&
               Objects.equals(entityType, auditLog.entityType) &&
               Objects.equals(entityId, auditLog.entityId) &&
               Objects.equals(action, auditLog.action) &&
               Objects.equals(userId, auditLog.userId) &&
               Objects.equals(changesJson, auditLog.changesJson) &&
               Objects.equals(createdAt, auditLog.createdAt);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, entityType, entityId, action, userId, changesJson, createdAt);
    }

    @Override
    public String toString() {
        return "AuditLog{" +
               "id=" + id +
               ", entityType='" + entityType + '\'' +
               ", entityId=" + entityId +
               ", action='" + action + '\'' +
               ", userId=" + userId +
               ", changesJson='" + changesJson + '\'' +
               ", createdAt=" + createdAt +
               '}';
    }
}
