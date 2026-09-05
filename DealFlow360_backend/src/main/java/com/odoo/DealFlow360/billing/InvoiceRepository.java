package com.odoo.DealFlow360.billing;

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
public class InvoiceRepository {

    private final JdbcTemplate jdbcTemplate;
    private final RowMapper<Invoice> rowMapper = new InvoiceRowMapper();

    public InvoiceRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public Invoice save(Invoice invoice) {
        Instant now = Instant.now();
        if (invoice.getCreatedAt() == null) {
            invoice.setCreatedAt(now);
        }

        if (invoice.getId() == null) {
            String sql = "INSERT INTO invoices (order_id, customer_id, status, subtotal_amount, tax_amount, total_amount, due_date, created_at) " +
                         "VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
            KeyHolder keyHolder = new GeneratedKeyHolder();
            jdbcTemplate.update(connection -> {
                PreparedStatement ps = connection.prepareStatement(sql, new String[]{"id"});
                if (invoice.getOrderId() != null) {
                    ps.setLong(1, invoice.getOrderId());
                } else {
                    ps.setNull(1, java.sql.Types.BIGINT);
                }
                ps.setLong(2, invoice.getCustomerId());
                ps.setString(3, invoice.getStatus() != null ? invoice.getStatus() : "DRAFT");
                ps.setBigDecimal(4, invoice.getSubtotalAmount() != null ? invoice.getSubtotalAmount() : BigDecimal.ZERO);
                ps.setBigDecimal(5, invoice.getTaxAmount() != null ? invoice.getTaxAmount() : BigDecimal.ZERO);
                ps.setBigDecimal(6, invoice.getTotalAmount() != null ? invoice.getTotalAmount() : BigDecimal.ZERO);
                if (invoice.getDueDate() != null) {
                    ps.setTimestamp(7, Timestamp.from(invoice.getDueDate()));
                } else {
                    ps.setNull(7, java.sql.Types.TIMESTAMP);
                }
                ps.setTimestamp(8, Timestamp.from(invoice.getCreatedAt()));
                return ps;
            }, keyHolder);

            Number key = keyHolder.getKey();
            if (key != null) {
                invoice.setId(key.longValue());
            }
            return invoice;
        } else {
            String sql = "UPDATE invoices SET order_id = ?, customer_id = ?, status = ?, subtotal_amount = ?, tax_amount = ?, total_amount = ?, due_date = ? WHERE id = ?";
            jdbcTemplate.update(sql,
                    invoice.getOrderId(),
                    invoice.getCustomerId(),
                    invoice.getStatus(),
                    invoice.getSubtotalAmount(),
                    invoice.getTaxAmount(),
                    invoice.getTotalAmount(),
                    invoice.getDueDate() != null ? Timestamp.from(invoice.getDueDate()) : null,
                    invoice.getId());
            return invoice;
        }
    }

    public Optional<Invoice> findById(Long id) {
        String sql = "SELECT id, order_id, customer_id, status, subtotal_amount, tax_amount, total_amount, due_date, created_at FROM invoices WHERE id = ?";
        List<Invoice> results = jdbcTemplate.query(sql, rowMapper, id);
        return results.stream().findFirst();
    }

    public List<Invoice> findByCustomerId(Long customerId) {
        String sql = "SELECT id, order_id, customer_id, status, subtotal_amount, tax_amount, total_amount, due_date, created_at FROM invoices WHERE customer_id = ? ORDER BY id DESC";
        return jdbcTemplate.query(sql, rowMapper, customerId);
    }

    public List<Invoice> findByOrderId(Long orderId) {
        String sql = "SELECT id, order_id, customer_id, status, subtotal_amount, tax_amount, total_amount, due_date, created_at FROM invoices WHERE order_id = ? ORDER BY id";
        return jdbcTemplate.query(sql, rowMapper, orderId);
    }

    public List<Invoice> findAll() {
        String sql = "SELECT id, order_id, customer_id, status, subtotal_amount, tax_amount, total_amount, due_date, created_at FROM invoices ORDER BY id DESC";
        return jdbcTemplate.query(sql, rowMapper);
    }

    public void deleteById(Long id) {
        String sql = "DELETE FROM invoices WHERE id = ?";
        jdbcTemplate.update(sql, id);
    }

    public static class InvoiceRowMapper implements RowMapper<Invoice> {
        @Override
        public Invoice mapRow(ResultSet rs, int rowNum) throws SQLException {
            Invoice inv = new Invoice();
            inv.setId(rs.getLong("id"));
            long oId = rs.getLong("order_id");
            inv.setOrderId(rs.wasNull() ? null : oId);
            inv.setCustomerId(rs.getLong("customer_id"));
            inv.setStatus(rs.getString("status"));
            inv.setSubtotalAmount(rs.getBigDecimal("subtotal_amount"));
            inv.setTaxAmount(rs.getBigDecimal("tax_amount"));
            inv.setTotalAmount(rs.getBigDecimal("total_amount"));
            Timestamp dd = rs.getTimestamp("due_date");
            inv.setDueDate(dd != null ? dd.toInstant() : null);
            Timestamp ca = rs.getTimestamp("created_at");
            inv.setCreatedAt(ca != null ? ca.toInstant() : null);
            return inv;
        }
    }
}
