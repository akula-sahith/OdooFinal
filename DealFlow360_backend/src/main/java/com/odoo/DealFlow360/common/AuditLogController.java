package com.odoo.DealFlow360.common;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/audit-logs")
public class AuditLogController {

    private final AuditService auditService;

    @Autowired
    public AuditLogController(AuditService auditService) {
        this.auditService = auditService;
    }

    @GetMapping
    public ResponseEntity<List<AuditLog>> getAllAuditLogs(@RequestParam(required = false) Long userId) {
        if (userId != null) {
            return ResponseEntity.ok(auditService.findByUserId(userId));
        }
        return ResponseEntity.ok(auditService.findAll());
    }

    @GetMapping("/entity/{entityType}/{entityId}")
    public ResponseEntity<List<AuditLog>> getAuditLogsByEntity(@PathVariable String entityType, @PathVariable Long entityId) {
        return ResponseEntity.ok(auditService.findByEntity(entityType, entityId));
    }
}
