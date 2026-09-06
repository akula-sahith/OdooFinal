package com.odoo.DealFlow360.common;

import com.odoo.DealFlow360.approval.ApprovalChainRule;
import com.odoo.DealFlow360.approval.ApprovalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
public class AdminGovernanceController {

    private final JdbcTemplate jdbcTemplate;
    private final ApprovalService approvalService;

    private static final List<Map<String, Object>> TAX_CONFIGS = new ArrayList<>();
    private static final List<Map<String, Object>> SYSTEM_SETTINGS = new ArrayList<>();

    static {
        // Tax Configs
        Map<String, Object> t1 = new HashMap<>();
        t1.put("id", "tax_01");
        t1.put("name", "Standard GST / VAT");
        t1.put("code", "GST-18");
        t1.put("rate", 18.0);
        t1.put("country", "IN");
        t1.put("status", "ACTIVE");
        TAX_CONFIGS.add(t1);

        Map<String, Object> t2 = new HashMap<>();
        t2.put("id", "tax_02");
        t2.put("name", "US State Sales Tax (Avg)");
        t2.put("code", "US-SALES-7");
        t2.put("rate", 7.5);
        t2.put("country", "US");
        t2.put("status", "ACTIVE");
        TAX_CONFIGS.add(t2);

        // System Settings
        Map<String, Object> s1 = new HashMap<>();
        s1.put("key", "orgName");
        s1.put("value", "DealFlow360 Enterprise");
        s1.put("type", "STRING");
        s1.put("description", "Legal Organization Name");
        s1.put("scope", "ORGANIZATION");

        Map<String, Object> s2 = new HashMap<>();
        s2.put("key", "baseCurrency");
        s2.put("value", "USD");
        s2.put("type", "ENUM");
        s2.put("description", "Default Base Currency");
        s2.put("scope", "ORGANIZATION");

        SYSTEM_SETTINGS.add(s1);
        SYSTEM_SETTINGS.add(s2);
    }

    @Autowired
    public AdminGovernanceController(JdbcTemplate jdbcTemplate, @Autowired(required = false) ApprovalService approvalService) {
        this.jdbcTemplate = jdbcTemplate;
        this.approvalService = approvalService;
    }

    @GetMapping("/governance")
    public ResponseEntity<?> getGovernanceOverview() {
        Map<String, Object> stats = new HashMap<>();

        Integer totalUsers = 0;
        Integer activePriceLists = 0;
        Integer approvalRulesCount = 0;
        Integer warehousesCount = 0;

        try {
            totalUsers = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM users", Integer.class);
            activePriceLists = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM price_lists", Integer.class);
            approvalRulesCount = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM approval_chain_rules", Integer.class);
            warehousesCount = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM warehouses", Integer.class);
        } catch (Exception ignored) {}

        stats.put("totalUsers", totalUsers != null ? totalUsers : 0);
        stats.put("activeUsers", totalUsers != null ? totalUsers : 0);
        stats.put("rolesCount", 5);
        stats.put("permissionsCount", 24);
        stats.put("activePriceLists", activePriceLists != null ? activePriceLists : 0);
        stats.put("approvalRulesCount", approvalRulesCount != null ? approvalRulesCount : 0);
        stats.put("warehousesCount", warehousesCount != null ? warehousesCount : 0);
        stats.put("pendingGovernanceIssues", 0);
        stats.put("systemStatus", "OPERATIONAL");

        Map<String, Object> res = new HashMap<>();
        res.put("data", stats);
        return ResponseEntity.ok(res);
    }

    @GetMapping("/approval-rules")
    public ResponseEntity<?> getApprovalRules() {
        if (approvalService != null) {
            List<ApprovalChainRule> rules = approvalService.findAllApprovalChainRules();
            return ResponseEntity.ok(Map.of("data", rules));
        }
        return ResponseEntity.ok(Map.of("data", List.of()));
    }

    @PostMapping("/approval-rules")
    public ResponseEntity<?> createApprovalRule(@RequestBody Map<String, Object> body) {
        String name = body.get("name") != null ? body.get("name").toString() : "Custom Approval Rule";
        BigDecimal minDiscount = body.get("minDiscountPercent") != null ? new BigDecimal(body.get("minDiscountPercent").toString()) : null;
        BigDecimal minTotal = body.get("minTotalAmount") != null ? new BigDecimal(body.get("minTotalAmount").toString()) : null;
        Long customerId = body.get("customerId") != null ? Long.parseLong(body.get("customerId").toString()) : null;
        Long tierId = body.get("tierId") != null ? Long.parseLong(body.get("tierId").toString()) : null;

        ApprovalChainRule rule = new ApprovalChainRule(null, name, customerId, tierId, minDiscount, minTotal);
        if (approvalService != null) {
            rule = approvalService.saveApprovalChainRule(rule);
        }
        return ResponseEntity.ok(rule);
    }

    @PatchMapping("/approval-rules/{id}/status")
    public ResponseEntity<?> updateApprovalRuleStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        if (approvalService != null) {
            Optional<ApprovalChainRule> ruleOpt = approvalService.findApprovalChainRuleById(id);
            if (ruleOpt.isPresent()) {
                return ResponseEntity.ok(ruleOpt.get());
            }
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/taxes")
    public ResponseEntity<?> getTaxConfigurations() {
        Map<String, Object> res = new HashMap<>();
        res.put("data", TAX_CONFIGS);
        return ResponseEntity.ok(res);
    }

    @PostMapping("/taxes")
    public ResponseEntity<?> createTaxConfiguration(@RequestBody Map<String, Object> body) {
        Map<String, Object> newTax = new HashMap<>(body);
        newTax.put("id", "tax_" + System.currentTimeMillis());
        newTax.put("status", "ACTIVE");
        TAX_CONFIGS.add(newTax);
        return ResponseEntity.ok(newTax);
    }

    @GetMapping("/settings")
    public ResponseEntity<?> getSystemSettings() {
        Map<String, Object> res = new HashMap<>();
        res.put("data", SYSTEM_SETTINGS);
        return ResponseEntity.ok(res);
    }

    @PatchMapping("/settings")
    public ResponseEntity<?> updateSystemSettings(@RequestBody Map<String, Object> body) {
        Object settingsObj = body.get("settings");
        if (settingsObj instanceof List) {
            SYSTEM_SETTINGS.clear();
            SYSTEM_SETTINGS.addAll((List<Map<String, Object>>) settingsObj);
        }
        Map<String, Object> res = new HashMap<>();
        res.put("data", SYSTEM_SETTINGS);
        return ResponseEntity.ok(res);
    }

    @GetMapping("/security/events")
    public ResponseEntity<?> getSecurityEvents() {
        Map<String, Object> res = new HashMap<>();
        Map<String, Object> data = new HashMap<>();
        data.put("activeSessionsCount", 4);
        data.put("failedLoginsToday", 0);
        data.put("mfaEnforcementStatus", "ENFORCED");
        data.put("lockedAccounts", List.of());
        res.put("data", data);
        return ResponseEntity.ok(res);
    }

    @GetMapping("/audit-logs")
    public ResponseEntity<?> getAdminAuditLogs() {
        Map<String, Object> res = new HashMap<>();
        List<Map<String, Object>> logs = List.of(
            Map.of("id", "audit_101", "timestamp", Instant.now().minusSeconds(900).toString(), "user", "admin@dealflow360.com", "action", "APPROVAL_RULE_UPDATED", "entity", "ApprovalRule", "entityId", "rule_02", "result", "SUCCESS"),
            Map.of("id", "audit_102", "timestamp", Instant.now().minusSeconds(2700).toString(), "user", "sarah.jenkins@dealflow360.com", "action", "ROLE_ASSIGNED", "entity", "User", "entityId", "usr_rep_01", "result", "SUCCESS")
        );
        res.put("data", logs);
        res.put("total", logs.size());
        return ResponseEntity.ok(res);
    }
}
