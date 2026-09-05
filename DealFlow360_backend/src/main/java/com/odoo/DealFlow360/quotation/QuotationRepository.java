package com.odoo.DealFlow360.quotation;

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

/**
 * Repository for Quotation persistence operations using Spring JDBC.
 */
@Repository
public class QuotationRepository {

    private final JdbcTemplate jdbcTemplate;
    private final RowMapper<Quotation> rowMapper = new QuotationRowMapper();

    public QuotationRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     * Persists a Quotation (inserts if id is null, updates if id is present).
     *
     * @param quotation Quotation domain object
     * @return Saved Quotation object with generated ID populated
     */
    public Quotation save(Quotation quotation) {
        Instant now = Instant.now();
        if (quotation.getCreatedAt() == null) {
            quotation.setCreatedAt(now);
        }
        quotation.setUpdatedAt(now);

        if (quotation.getId() == null) {
            String sql = "INSERT INTO quotations (customer_id, price_list_id, status, currency, subtotal_amount, tax_amount, total_amount, valid_until, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            KeyHolder keyHolder = new GeneratedKeyHolder();
            jdbcTemplate.update(connection -> {
                PreparedStatement ps = connection.prepareStatement(sql, new String[]{"id"});
                ps.setLong(1, quotation.getCustomerId());
                if (quotation.getPriceListId() != null) {
                    ps.setLong(2, quotation.getPriceListId());
                } else {
                    ps.setNull(2, java.sql.Types.BIGINT);
                }
                ps.setString(3, quotation.getStatus());
                ps.setString(4, quotation.getCurrency() != null ? quotation.getCurrency() : "USD");
                ps.setBigDecimal(5, quotation.getSubtotalAmount() != null ? quotation.getSubtotalAmount() : BigDecimal.ZERO);
                ps.setBigDecimal(6, quotation.getTaxAmount() != null ? quotation.getTaxAmount() : BigDecimal.ZERO);
                ps.setBigDecimal(7, quotation.getTotalAmount() != null ? quotation.getTotalAmount() : BigDecimal.ZERO);
                if (quotation.getValidUntil() != null) {
                    ps.setTimestamp(8, Timestamp.from(quotation.getValidUntil()));
                } else {
                    ps.setNull(8, java.sql.Types.TIMESTAMP);
                }
                ps.setTimestamp(9, Timestamp.from(quotation.getCreatedAt()));
                ps.setTimestamp(10, Timestamp.from(quotation.getUpdatedAt()));
                return ps;
            }, keyHolder);

            Number key = keyHolder.getKey();
            if (key != null) {
                quotation.setId(key.longValue());
            }
            return quotation;
        } else {
            String sql = "UPDATE quotations SET customer_id = ?, price_list_id = ?, status = ?, currency = ?, subtotal_amount = ?, tax_amount = ?, total_amount = ?, valid_until = ?, created_at = ?, updated_at = ? WHERE id = ?";
            jdbcTemplate.update(sql,
                    quotation.getCustomerId(),
                    quotation.getPriceListId(),
                    quotation.getStatus(),
                    quotation.getCurrency() != null ? quotation.getCurrency() : "USD",
                    quotation.getSubtotalAmount() != null ? quotation.getSubtotalAmount() : BigDecimal.ZERO,
                    quotation.getTaxAmount() != null ? quotation.getTaxAmount() : BigDecimal.ZERO,
                    quotation.getTotalAmount() != null ? quotation.getTotalAmount() : BigDecimal.ZERO,
                    quotation.getValidUntil() != null ? Timestamp.from(quotation.getValidUntil()) : null,
                    Timestamp.from(quotation.getCreatedAt()),
                    Timestamp.from(quotation.getUpdatedAt()),
                    quotation.getId());
            return quotation;
        }
    }

    /**
     * Finds a Quotation by ID.
     */
    public Optional<Quotation> findById(Long id) {
        String sql = "SELECT id, customer_id, price_list_id, status, currency, subtotal_amount, tax_amount, total_amount, valid_until, created_at, updated_at FROM quotations WHERE id = ?";
        List<Quotation> results = jdbcTemplate.query(sql, rowMapper, id);
        return results.stream().findFirst();
    }

    /**
     * Finds all Quotations belonging to a Customer ID.
     */
    public List<Quotation> findByCustomerId(Long customerId) {
        String sql = "SELECT id, customer_id, price_list_id, status, currency, subtotal_amount, tax_amount, total_amount, valid_until, created_at, updated_at FROM quotations WHERE customer_id = ? ORDER BY id";
        return jdbcTemplate.query(sql, rowMapper, customerId);
    }

    /**
     * Finds all Quotations matching a specific status string.
     */
    public List<Quotation> findByStatus(String status) {
        String sql = "SELECT id, customer_id, price_list_id, status, currency, subtotal_amount, tax_amount, total_amount, valid_until, created_at, updated_at FROM quotations WHERE status = ? ORDER BY id";
        return jdbcTemplate.query(sql, rowMapper, status);
    }

    /**
     * Checks if a Quotation exists by ID.
     */
    public boolean existsById(Long id) {
        String sql = "SELECT COUNT(*) FROM quotations WHERE id = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, id);
        return count != null && count > 0;
    }

    /**
     * Retrieves all Quotations.
     */
    public List<Quotation> findAll() {
        String sql = "SELECT id, customer_id, price_list_id, status, currency, subtotal_amount, tax_amount, total_amount, valid_until, created_at, updated_at FROM quotations ORDER BY id";
        return jdbcTemplate.query(sql, rowMapper);
    }

    /**
     * Deletes a Quotation by ID.
     */
    public void deleteById(Long id) {
        String sql = "DELETE FROM quotations WHERE id = ?";
        jdbcTemplate.update(sql, id);
    }

    /**
     * RowMapper implementation for Quotation entities.
     */
    public static class QuotationRowMapper implements RowMapper<Quotation> {
        @Override
        public Quotation mapRow(ResultSet rs, int rowNum) throws SQLException {
            Quotation quotation = new Quotation();
            quotation.setId(rs.getLong("id"));
            quotation.setCustomerId(rs.getLong("customer_id"));
            long plId = rs.getLong("price_list_id");
            quotation.setPriceListId(rs.wasNull() ? null : plId);
            quotation.setStatus(rs.getString("status"));
            quotation.setCurrency(rs.getString("currency"));
            quotation.setSubtotalAmount(rs.getBigDecimal("subtotal_amount"));
            quotation.setTaxAmount(rs.getBigDecimal("tax_amount"));
            quotation.setTotalAmount(rs.getBigDecimal("total_amount"));
            Timestamp vu = rs.getTimestamp("valid_until");
            quotation.setValidUntil(vu != null ? vu.toInstant() : null);
            Timestamp ca = rs.getTimestamp("created_at");
            quotation.setCreatedAt(ca != null ? ca.toInstant() : null);
            Timestamp ua = rs.getTimestamp("updated_at");
            quotation.setUpdatedAt(ua != null ? ua.toInstant() : null);
            return quotation;
        }
    }
}
