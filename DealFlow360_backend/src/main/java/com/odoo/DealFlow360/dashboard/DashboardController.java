package com.odoo.DealFlow360.dashboard;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public DashboardController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();

        // Pending Approvals Count
        Integer pendingApprovals = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM approvals WHERE UPPER(status) = 'PENDING'", Integer.class);
        stats.put("pendingApprovalsCount", pendingApprovals != null ? pendingApprovals : 0);

        // Open Quotations Count
        Integer openQuotations = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM quotations WHERE UPPER(status) IN ('DRAFT', 'SUBMITTED', 'PENDING_APPROVAL', 'APPROVED', 'SENT')", Integer.class);
        stats.put("openQuotationsCount", openQuotations != null ? openQuotations : 0);

        // At Risk Deals Count
        Integer atRiskDeals = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM deal_health_alerts WHERE UPPER(status) = 'ACTIVE'", Integer.class);
        stats.put("atRiskDealsCount", atRiskDeals != null ? atRiskDeals : 0);

        // Total Confirmed Orders Count & Total Order Value
        Integer totalOrders = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM orders", Integer.class);
        stats.put("totalOrdersCount", totalOrders != null ? totalOrders : 0);

        BigDecimal totalRevenue = jdbcTemplate.queryForObject(
                "SELECT COALESCE(SUM(total_amount), 0) FROM orders", BigDecimal.class);
        stats.put("totalOrderRevenue", totalRevenue != null ? totalRevenue : BigDecimal.ZERO);

        // Recent Audit Activity Log (top 10)
        List<Map<String, Object>> recentActivity = jdbcTemplate.queryForList(
                "SELECT id, entity_type, entity_id, action, user_id, created_at FROM audit_log ORDER BY id DESC LIMIT 10");
        stats.put("recentActivity", recentActivity);

        return ResponseEntity.ok(stats);
    }
}
