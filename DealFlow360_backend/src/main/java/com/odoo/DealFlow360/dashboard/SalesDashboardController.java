package com.odoo.DealFlow360.dashboard;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

/**
 * Salesperson dashboard metrics controller.
 * Mapped to /api/sales/dashboard so the frontend can call /api/sales/dashboard/metrics.
 */
@RestController
@RequestMapping("/api/sales/dashboard")
public class SalesDashboardController {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public SalesDashboardController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping("/metrics")
    public ResponseEntity<Map<String, Object>> getSalespersonMetrics() {
        Map<String, Object> metrics = new HashMap<>();

        try {
            Integer activeQuotes = jdbcTemplate.queryForObject(
                    "SELECT COUNT(*) FROM quotations WHERE UPPER(status) IN ('DRAFT', 'SUBMITTED', 'PENDING_APPROVAL', 'APPROVED', 'SENT')", Integer.class);
            metrics.put("activeQuotesCount", activeQuotes != null ? activeQuotes : 0);
        } catch (Exception e) {
            metrics.put("activeQuotesCount", 0);
        }

        try {
            Integer pendingApprovals = jdbcTemplate.queryForObject(
                    "SELECT COUNT(*) FROM approvals WHERE UPPER(status) = 'PENDING'", Integer.class);
            metrics.put("pendingApprovalsCount", pendingApprovals != null ? pendingApprovals : 0);
        } catch (Exception e) {
            metrics.put("pendingApprovalsCount", 0);
        }

        try {
            Integer convertedOrders = jdbcTemplate.queryForObject(
                    "SELECT COUNT(*) FROM orders", Integer.class);
            metrics.put("convertedOrdersCount", convertedOrders != null ? convertedOrders : 0);
        } catch (Exception e) {
            metrics.put("convertedOrdersCount", 0);
        }

        try {
            BigDecimal pipelineValue = jdbcTemplate.queryForObject(
                    "SELECT COALESCE(SUM(total_amount), 0) FROM quotations WHERE UPPER(status) IN ('DRAFT', 'SUBMITTED', 'PENDING_APPROVAL', 'APPROVED', 'SENT')", BigDecimal.class);
            metrics.put("totalPipelineValue", pipelineValue != null ? pipelineValue : BigDecimal.ZERO);
        } catch (Exception e) {
            metrics.put("totalPipelineValue", 0);
        }

        try {
            Integer totalQuotes = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM quotations", Integer.class);
            Integer convertedOrders = (Integer) metrics.getOrDefault("convertedOrdersCount", 0);
            if (totalQuotes != null && totalQuotes > 0 && convertedOrders != null && convertedOrders > 0) {
                double rate = (convertedOrders.doubleValue() / totalQuotes.doubleValue()) * 100.0;
                metrics.put("winRate", Math.round(rate * 10.0) / 10.0);
            } else {
                metrics.put("winRate", 0.0);
            }
        } catch (Exception e) {
            metrics.put("winRate", 0.0);
        }

        Map<String, Object> res = new HashMap<>();
        res.put("data", metrics);
        return ResponseEntity.ok(res);
    }
}
