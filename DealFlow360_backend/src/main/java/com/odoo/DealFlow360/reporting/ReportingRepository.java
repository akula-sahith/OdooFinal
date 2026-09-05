package com.odoo.DealFlow360.reporting;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Repository executing reporting and analytics queries against authoritative transactional tables.
 */
@Repository
public class ReportingRepository {

    private final JdbcTemplate jdbcTemplate;

    public ReportingRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public Map<String, Object> getSalesPerformanceSummary(Instant fromDate, Instant toDate, Long teamId, Long repId) {
        StringBuilder sql = new StringBuilder(
                "SELECT COUNT(q.id) as total_quotations, " +
                "COALESCE(SUM(q.total_amount), 0) as total_quoted_value, " +
                "COUNT(CASE WHEN q.status = 'CONFIRMED' THEN 1 END) as confirmed_count, " +
                "COALESCE(SUM(CASE WHEN q.status = 'CONFIRMED' THEN q.total_amount ELSE 0 END), 0) as confirmed_value " +
                "FROM quotations q " +
                "JOIN customers c ON q.customer_id = c.id " +
                "WHERE 1=1 "
        );

        List<Object> params = new ArrayList<>();
        if (fromDate != null) {
            sql.append("AND q.created_at >= ? ");
            params.add(Timestamp.from(fromDate));
        }
        if (toDate != null) {
            sql.append("AND q.created_at <= ? ");
            params.add(Timestamp.from(toDate));
        }
        if (teamId != null) {
            sql.append("AND c.sales_team_id = ? ");
            params.add(teamId);
        }

        return jdbcTemplate.queryForMap(sql.toString(), params.toArray());
    }

    public List<Map<String, Object>> getQuotationsByApprovalStatus(String approvalStatus) {
        String sql = "SELECT q.id, q.customer_id, c.company_name, q.status, q.total_amount, q.created_at " +
                     "FROM quotations q " +
                     "JOIN customers c ON q.customer_id = c.id " +
                     "WHERE q.status = ? ORDER BY q.id DESC";
        return jdbcTemplate.queryForList(sql, approvalStatus);
    }

    public List<Map<String, Object>> getProductPerformanceReport(Long categoryId) {
        StringBuilder sql = new StringBuilder(
                "SELECT p.id as product_id, p.name as product_name, pc.name as category_name, " +
                "COALESCE(SUM(ql.quantity), 0) as total_quantity_quoted, " +
                "COALESCE(SUM(ql.total_amount), 0) as total_revenue " +
                "FROM products p " +
                "LEFT JOIN product_categories pc ON p.category_id = pc.id " +
                "LEFT JOIN quotation_lines ql ON p.id = ql.product_id " +
                "WHERE 1=1 "
        );

        List<Object> params = new ArrayList<>();
        if (categoryId != null) {
            sql.append("AND p.category_id = ? ");
            params.add(categoryId);
        }
        sql.append("GROUP BY p.id, p.name, pc.name ORDER BY total_revenue DESC");

        return jdbcTemplate.queryForList(sql.toString(), params.toArray());
    }
}
