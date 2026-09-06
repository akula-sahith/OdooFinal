package com.odoo.DealFlow360.billing;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Repository
public class PaymentRepository {

    private final JdbcTemplate jdbcTemplate;
    private final RowMapper<Payment> rowMapper = new PaymentRowMapper();

    public PaymentRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public Payment save(Payment payment) {
        Instant now = Instant.now();
        if (payment.getProcessedAt() == null) {
            payment.setProcessedAt(now);
        }

        if (payment.getId() == null) {
            String sql = "INSERT INTO payments (invoice_id, payment_method, amount, status, transaction_reference, processed_at) "
                    +
                    "VALUES (?, ?, ?, ?, ?, ?)";
            KeyHolder keyHolder = new GeneratedKeyHolder();
            jdbcTemplate.update(connection -> {
                PreparedStatement ps = connection.prepareStatement(sql, new String[] { "id" });
                ps.setLong(1, payment.getInvoiceId());
                ps.setString(2, payment.getPaymentMethod() != null ? payment.getPaymentMethod() : "CREDIT_CARD");
                ps.setBigDecimal(3, payment.getAmount());
                ps.setString(4, payment.getStatus() != null ? payment.getStatus() : "SUCCESS");
                ps.setString(5, payment.getTransactionReference());
                ps.setTimestamp(6, Timestamp.from(payment.getProcessedAt()));
                return ps;
            }, keyHolder);

            Number key = keyHolder.getKey();
            if (key != null) {
                payment.setId(key.longValue());
            }
            return payment;
        } else {
            String sql = "UPDATE payments SET invoice_id = ?, payment_method = ?, amount = ?, status = ?, transaction_reference = ? WHERE id = ?";
            jdbcTemplate.update(sql,
                    payment.getInvoiceId(),
                    payment.getPaymentMethod(),
                    payment.getAmount(),
                    payment.getStatus(),
                    payment.getTransactionReference(),
                    payment.getId());
            return payment;
        }
    }

    public Optional<Payment> findById(Long id) {
        String sql = "SELECT id, invoice_id, payment_method, amount, status, transaction_reference, processed_at FROM payments WHERE id = ?";
        List<Payment> results = jdbcTemplate.query(sql, rowMapper, id);
        return results.stream().findFirst();
    }

    public List<Payment> findByInvoiceId(Long invoiceId) {
        String sql = "SELECT id, invoice_id, payment_method, amount, status, transaction_reference, processed_at FROM payments WHERE invoice_id = ? ORDER BY id";
        return jdbcTemplate.query(sql, rowMapper, invoiceId);
    }

    public List<Payment> findAll() {
        String sql = "SELECT id, invoice_id, payment_method, amount, status, transaction_reference, processed_at FROM payments ORDER BY id DESC";
        return jdbcTemplate.query(sql, rowMapper);
    }

    public void deleteById(Long id) {
        String sql = "DELETE FROM payments WHERE id = ?";
        jdbcTemplate.update(sql, id);
    }

    public static class PaymentRowMapper implements RowMapper<Payment> {
        @Override
        public Payment mapRow(ResultSet rs, int rowNum) throws SQLException {
            Payment p = new Payment();
            p.setId(rs.getLong("id"));
            p.setInvoiceId(rs.getLong("invoice_id"));
            p.setPaymentMethod(rs.getString("payment_method"));
            p.setAmount(rs.getBigDecimal("amount"));
            p.setStatus(rs.getString("status"));
            p.setTransactionReference(rs.getString("transaction_reference"));
            Timestamp pa = rs.getTimestamp("processed_at");
            p.setProcessedAt(pa != null ? pa.toInstant() : null);
            return p;
        }
    }
}
