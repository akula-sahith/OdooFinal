package com.odoo.DealFlow360.common;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

/**
 * Business service responsible for auditing entity modifications, user actions, and security operations.
 */
@Service
public class AuditService {

    private final AuditLogRepository auditLogRepository;

    @Autowired
    public AuditService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    @Transactional
    public AuditLog logAction(String entityType, Long entityId, String action, Long userId, String changesJson) {
        if (entityType == null || entityType.trim().isEmpty()) {
            throw new IllegalArgumentException("Entity type cannot be null or blank");
        }
        if (entityId == null || entityId <= 0) {
            throw new IllegalArgumentException("Entity ID must be positive");
        }
        if (action == null || action.trim().isEmpty()) {
            throw new IllegalArgumentException("Action cannot be null or blank");
        }

        AuditLog log = new AuditLog(null, entityType.trim(), entityId, action.trim(), userId, changesJson, Instant.now());
        if (auditLogRepository != null) {
            return auditLogRepository.save(log);
        }
        return log;
    }

    public Optional<AuditLog> findById(Long id) {
        if (auditLogRepository != null && id != null) {
            return auditLogRepository.findById(id);
        }
        return Optional.empty();
    }

    public List<AuditLog> findByEntity(String entityType, Long entityId) {
        if (auditLogRepository != null && entityType != null && entityId != null) {
            return auditLogRepository.findByEntity(entityType, entityId);
        }
        return java.util.Collections.emptyList();
    }

    public List<AuditLog> findByUserId(Long userId) {
        if (auditLogRepository != null && userId != null) {
            return auditLogRepository.findByUserId(userId);
        }
        return java.util.Collections.emptyList();
    }

    public List<AuditLog> findAll() {
        if (auditLogRepository != null) {
            return auditLogRepository.findAll();
        }
        return java.util.Collections.emptyList();
    }
}
