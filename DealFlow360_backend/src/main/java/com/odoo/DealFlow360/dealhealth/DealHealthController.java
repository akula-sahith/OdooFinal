package com.odoo.DealFlow360.dealhealth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/deal-health")
public class DealHealthController {

    private final DealHealthService dealHealthService;

    @Autowired
    public DealHealthController(DealHealthService dealHealthService) {
        this.dealHealthService = dealHealthService;
    }

    @GetMapping("/alerts")
    public ResponseEntity<List<DealHealthAlert>> getAllAlerts() {
        return ResponseEntity.ok(dealHealthService.findAllAlerts());
    }

    @PostMapping("/alerts/{id}/resolve")
    public ResponseEntity<?> resolveAlert(@PathVariable Long id) {
        try {
            DealHealthAlert resolved = dealHealthService.resolveAlert(id);
            return ResponseEntity.ok(resolved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
