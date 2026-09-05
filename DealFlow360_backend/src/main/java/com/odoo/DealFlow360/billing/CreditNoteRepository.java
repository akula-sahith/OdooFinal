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
public class CreditNoteRepository {

    private final JdbcTemplate jdbcTemplate;
    private final RowMapper<CreditNote> rowMapper = new CreditNoteRowMapper();

    public CreditNoteRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public CreditNote save(CreditNote cn) {
        Instant now = Instant.now();
        if (cn.getCreatedAt() == null) {
            cn.setCreatedAt(now);
        }

        if (cn.getId() == null) {
            String sql = "INSERT INTO credit_notes (invoice_id, amount, reason, discount_amount, created_at) VALUES (?, ?, ?, ?, ?)";
            KeyHolder keyHolder = new GeneratedKeyHolder();
            jdbcTemplate.update(connection -> {
                PreparedStatement ps = connection.prepareStatement(sql, new String[]{"id"});
                ps.setLong(1, cn.getInvoiceId());
                ps.setBigDecimal(2, cn.getAmount());
                ps.setString(3, cn.getReason());
                ps.setBigDecimal(4, cn.getDiscountAmount() != null ? cn.getDiscountAmount() : BigDecimal.ZERO);
                ps.setTimestamp(5, Timestamp.from(cn.getCreatedAt()));
                return ps;
            }, keyHolder);

            Number key = keyHolder.getKey();
            if (key != null) {
                cn.setId(key.longValue());
            }
            return cn;
        } else {
            String sql = "UPDATE credit_notes SET invoice_id = ?, amount = ?, reason = ?, discount_amount = ? WHERE id = ?";
            jdbcTemplate.update(sql,
                    cn.getInvoiceId(),
                    cn.getAmount(),
                    cn.getReason(),
                    cn.getDiscountAmount(),
                    cn.getId());
            return cn;
        }
    }

    public Optional<CreditNote> findById(Long id) {
        String sql = "SELECT id, invoice_id, amount, reason, discount_amount, created_at FROM credit_notes WHERE id = ?";
        List<CreditNote> results = jdbcTemplate.query(sql, rowMapper, id);
        return results.stream().findFirst();
    }

    public List<CreditNote> findByInvoiceId(Long invoiceId) {
        String sql = "SELECT id, invoice_id, amount, reason, discount_amount, created_at FROM credit_notes WHERE invoice_id = ? ORDER BY id";
        return jdbcTemplate.query(sql, rowMapper, invoiceId);
    }

    public void deleteById(Long id) {
        String sql = "DELETE FROM credit_notes WHERE id = ?";
        jdbcTemplate.update(sql, id);
    }

    public static class CreditNoteRowMapper implements RowMapper<CreditNote> {
        @Override
        public CreditNote mapRow(ResultSet rs, int rowNum) throws SQLException {
            CreditNote cn = new CreditNote();
            cn.setId(rs.getLong("id"));
            cn.setInvoiceId(rs.getLong("invoice_id"));
            cn.setAmount(rs.getBigDecimal("amount"));
            cn.setReason(rs.getString("reason"));
            cn.setDiscountAmount(rs.getBigDecimal("discount_amount"));
            Timestamp ca = rs.getTimestamp("created_at");
            cn.setCreatedAt(ca != null ? ca.toInstant() : null);
            return cn;
        }
    }
}
