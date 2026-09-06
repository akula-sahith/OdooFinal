package com.odoo.DealFlow360.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/roles")
public class RoleController {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public RoleController(@Autowired(required = false) JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private static final List<Map<String, Object>> ROLES = new ArrayList<>();

    static {
        Map<String, Object> admin = new HashMap<>();
        admin.put("id", "role_admin");
        admin.put("name", "System Administrator");
        admin.put("code", "ADMIN");
        admin.put("description", "Full system access and governance administration.");
        admin.put("userCount", 0);
        admin.put("status", "ACTIVE");
        admin.put("permissions", List.of("ALL"));

        Map<String, Object> manager = new HashMap<>();
        manager.put("id", "role_sales_manager");
        manager.put("name", "Sales Manager");
        manager.put("code", "SALES_MANAGER");
        manager.put("description", "Team management, quote approvals, and discount overrides.");
        manager.put("userCount", 0);
        manager.put("status", "ACTIVE");
        manager.put("permissions", List.of("quotations.view", "quotations.manage", "approvals.view", "approvals.manage", "orders.view"));

        Map<String, Object> rep = new HashMap<>();
        rep.put("id", "role_sales_rep");
        rep.put("name", "Sales Representative");
        rep.put("code", "SALES_REP");
        rep.put("description", "Quotation creation, customer engagement, and order tracking.");
        rep.put("userCount", 0);
        rep.put("status", "ACTIVE");
        rep.put("permissions", List.of("quotations.view", "quotations.create", "quotations.update", "quotations.manage", "quotations.send", "customers.view", "products.view"));

        Map<String, Object> finance = new HashMap<>();
        finance.put("id", "role_finance");
        finance.put("name", "Finance Controller");
        finance.put("code", "FINANCE");
        finance.put("description", "Billing, payment validation, invoice generation, and credit terms.");
        finance.put("userCount", 0);
        finance.put("status", "ACTIVE");
        finance.put("permissions", List.of("invoices.view", "payments.view", "billing.manage"));

        Map<String, Object> customer = new HashMap<>();
        customer.put("id", "role_customer");
        customer.put("name", "Commercial Customer Account");
        customer.put("code", "CUSTOMER");
        customer.put("description", "Self-service B2B portal for quotations and purchase orders.");
        customer.put("userCount", 0);
        customer.put("status", "ACTIVE");
        customer.put("permissions", List.of("customer.dashboard", "customer.orders", "customer.quotes"));

        ROLES.add(admin);
        ROLES.add(manager);
        ROLES.add(rep);
        ROLES.add(finance);
        ROLES.add(customer);
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllRoles() {
        if (jdbcTemplate != null) {
            for (Map<String, Object> r : ROLES) {
                String code = r.get("code") != null ? r.get("code").toString() : "";
                try {
                    Integer count = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM users WHERE UPPER(role) = ?", Integer.class, code.toUpperCase());
                    r.put("userCount", count != null ? count : 0);
                } catch (Exception ignored) {}
            }
        }
        return ResponseEntity.ok(ROLES);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getRoleById(@PathVariable String id) {
        return ROLES.stream()
                .filter(r -> r.get("id").equals(id) || r.get("code").toString().equalsIgnoreCase(id))
                .findFirst()
                .map(r -> ResponseEntity.ok((Object) r))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createRole(@RequestBody Map<String, Object> body) {
        String code = body.getOrDefault("code", "CUSTOM_ROLE").toString().toUpperCase();
        Map<String, Object> newRole = new HashMap<>(body);
        newRole.put("id", "role_" + System.currentTimeMillis());
        newRole.put("code", code);
        newRole.put("status", "ACTIVE");
        ROLES.add(newRole);
        return ResponseEntity.ok(newRole);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateRole(@PathVariable String id, @RequestBody Map<String, Object> body) {
        for (Map<String, Object> r : ROLES) {
            if (r.get("id").equals(id) || r.get("code").toString().equalsIgnoreCase(id)) {
                r.putAll(body);
                return ResponseEntity.ok(r);
            }
        }
        return ResponseEntity.notFound().build();
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateRoleStatus(@PathVariable String id, @RequestBody Map<String, String> body) {
        String status = body.getOrDefault("status", "ACTIVE");
        for (Map<String, Object> r : ROLES) {
            if (r.get("id").equals(id) || r.get("code").toString().equalsIgnoreCase(id)) {
                r.put("status", status);
                return ResponseEntity.ok(r);
            }
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}/permissions")
    public ResponseEntity<?> updateRolePermissions(@PathVariable String id, @RequestBody Map<String, Object> body) {
        Object permissions = body.get("permissions");
        for (Map<String, Object> r : ROLES) {
            if (r.get("id").equals(id) || r.get("code").toString().equalsIgnoreCase(id)) {
                r.put("permissions", permissions);
                return ResponseEntity.ok(r);
            }
        }
        return ResponseEntity.notFound().build();
    }
}
