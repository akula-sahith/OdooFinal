package com.odoo.DealFlow360.fulfillment;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Repository
public class OrderRepository {

    private final JdbcTemplate jdbcTemplate;
    private final RowMapper<Order> rowMapper = new OrderRowMapper();

    public OrderRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public Order save(Order order) {
        Instant now = Instant.now();
        if (order.getCreatedAt() == null) {
            order.setCreatedAt(now);
        }
        order.setUpdatedAt(now);

        if (order.getId() == null) {
            String sql = "INSERT INTO orders (quotation_id, customer_id, status, currency, subtotal_amount, tax_amount, total_amount, discount_amount, created_at, updated_at) " +
                         "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            KeyHolder keyHolder = new GeneratedKeyHolder();
            jdbcTemplate.update(connection -> {
                PreparedStatement ps = connection.prepareStatement(sql, new String[]{"id"});
                if (order.getQuotationId() != null) {
                    ps.setLong(1, order.getQuotationId());
                } else {
                    ps.setNull(1, java.sql.Types.BIGINT);
                }
                ps.setLong(2, order.getCustomerId());
                ps.setString(3, order.getStatus());
                ps.setString(4, order.getCurrency() != null ? order.getCurrency() : "USD");
                ps.setBigDecimal(5, order.getSubtotalAmount() != null ? order.getSubtotalAmount() : BigDecimal.ZERO);
                ps.setBigDecimal(6, order.getTaxAmount() != null ? order.getTaxAmount() : BigDecimal.ZERO);
                ps.setBigDecimal(7, order.getTotalAmount() != null ? order.getTotalAmount() : BigDecimal.ZERO);
                ps.setBigDecimal(8, order.getDiscountAmount() != null ? order.getDiscountAmount() : BigDecimal.ZERO);
                ps.setTimestamp(9, Timestamp.from(order.getCreatedAt()));
                ps.setTimestamp(10, Timestamp.from(order.getUpdatedAt()));
                return ps;
            }, keyHolder);

            Number key = keyHolder.getKey();
            if (key != null) {
                order.setId(key.longValue());
            }
            return order;
        } else {
            String sql = "UPDATE orders SET quotation_id = ?, customer_id = ?, status = ?, currency = ?, subtotal_amount = ?, tax_amount = ?, total_amount = ?, discount_amount = ?, updated_at = ? WHERE id = ?";
            jdbcTemplate.update(sql,
                    order.getQuotationId(),
                    order.getCustomerId(),
                    order.getStatus(),
                    order.getCurrency() != null ? order.getCurrency() : "USD",
                    order.getSubtotalAmount() != null ? order.getSubtotalAmount() : BigDecimal.ZERO,
                    order.getTaxAmount() != null ? order.getTaxAmount() : BigDecimal.ZERO,
                    order.getTotalAmount() != null ? order.getTotalAmount() : BigDecimal.ZERO,
                    order.getDiscountAmount() != null ? order.getDiscountAmount() : BigDecimal.ZERO,
                    Timestamp.from(order.getUpdatedAt()),
                    order.getId());
            return order;
        }
    }

    public Optional<Order> findById(Long id) {
        String sql = "SELECT id, quotation_id, customer_id, status, currency, subtotal_amount, tax_amount, total_amount, discount_amount, created_at, updated_at FROM orders WHERE id = ?";
        List<Order> results = jdbcTemplate.query(sql, rowMapper, id);
        return results.stream().findFirst();
    }

    public List<Order> findByCustomerId(Long customerId) {
        String sql = "SELECT id, quotation_id, customer_id, status, currency, subtotal_amount, tax_amount, total_amount, discount_amount, created_at, updated_at FROM orders WHERE customer_id = ? ORDER BY id DESC";
        return jdbcTemplate.query(sql, rowMapper, customerId);
    }

    public Optional<Order> findByQuotationId(Long quotationId) {
        String sql = "SELECT id, quotation_id, customer_id, status, currency, subtotal_amount, tax_amount, total_amount, discount_amount, created_at, updated_at FROM orders WHERE quotation_id = ?";
        List<Order> results = jdbcTemplate.query(sql, rowMapper, quotationId);
        return results.stream().findFirst();
    }

    public List<Order> findByStatus(String status) {
        String sql = "SELECT id, quotation_id, customer_id, status, currency, subtotal_amount, tax_amount, total_amount, discount_amount, created_at, updated_at FROM orders WHERE status = ? ORDER BY id DESC";
        return jdbcTemplate.query(sql, rowMapper, status);
    }

    public List<Order> findAll() {
        String sql = "SELECT id, quotation_id, customer_id, status, currency, subtotal_amount, tax_amount, total_amount, discount_amount, created_at, updated_at FROM orders ORDER BY id DESC";
        return jdbcTemplate.query(sql, rowMapper);
    }

    public void deleteById(Long id) {
        String sql = "DELETE FROM orders WHERE id = ?";
        jdbcTemplate.update(sql, id);
    }

    public static class OrderRowMapper implements RowMapper<Order> {
        @Override
        public Order mapRow(ResultSet rs, int rowNum) throws SQLException {
            Order order = new Order();
            order.setId(rs.getLong("id"));
            long qId = rs.getLong("quotation_id");
            order.setQuotationId(rs.wasNull() ? null : qId);
            order.setCustomerId(rs.getLong("customer_id"));
            order.setStatus(rs.getString("status"));
            order.setCurrency(rs.getString("currency"));
            order.setSubtotalAmount(rs.getBigDecimal("subtotal_amount"));
            order.setTaxAmount(rs.getBigDecimal("tax_amount"));
            order.setTotalAmount(rs.getBigDecimal("total_amount"));
            order.setDiscountAmount(rs.getBigDecimal("discount_amount"));
            Timestamp ca = rs.getTimestamp("created_at");
            order.setCreatedAt(ca != null ? ca.toInstant() : null);
            Timestamp ua = rs.getTimestamp("updated_at");
            order.setUpdatedAt(ua != null ? ua.toInstant() : null);
            return order;
        }
    }
}
