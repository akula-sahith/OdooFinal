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
import java.util.List;
import java.util.Optional;

/**
 * Repository for QuotationLine persistence operations using Spring JDBC.
 */
@Repository
public class QuotationLineRepository {

    private final JdbcTemplate jdbcTemplate;
    private final RowMapper<QuotationLine> rowMapper = new QuotationLineRowMapper();

    public QuotationLineRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     * Persists a QuotationLine (inserts if id is null, updates if id is present).
     *
     * @param line QuotationLine domain object
     * @return Saved QuotationLine object with generated ID populated
     */
    public QuotationLine save(QuotationLine line) {
        if (line.getId() == null) {
            String sql = "INSERT INTO quotation_lines (quotation_id, product_id, product_variant_id, quantity, unit_price, tax_percent, subtotal_amount, tax_amount, total_amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
            KeyHolder keyHolder = new GeneratedKeyHolder();
            jdbcTemplate.update(connection -> {
                PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
                ps.setLong(1, line.getQuotationId());
                ps.setLong(2, line.getProductId());
                if (line.getProductVariantId() != null) {
                    ps.setLong(3, line.getProductVariantId());
                } else {
                    ps.setNull(3, java.sql.Types.BIGINT);
                }
                ps.setInt(4, line.getQuantity() != null ? line.getQuantity() : 1);
                ps.setBigDecimal(5, line.getUnitPrice());
                ps.setBigDecimal(6, line.getTaxPercent() != null ? line.getTaxPercent() : BigDecimal.ZERO);
                ps.setBigDecimal(7, line.getSubtotalAmount() != null ? line.getSubtotalAmount() : BigDecimal.ZERO);
                ps.setBigDecimal(8, line.getTaxAmount() != null ? line.getTaxAmount() : BigDecimal.ZERO);
                ps.setBigDecimal(9, line.getTotalAmount() != null ? line.getTotalAmount() : BigDecimal.ZERO);
                return ps;
            }, keyHolder);

            Number key = keyHolder.getKey();
            if (key != null) {
                line.setId(key.longValue());
            }
            return line;
        } else {
            String sql = "UPDATE quotation_lines SET quotation_id = ?, product_id = ?, product_variant_id = ?, quantity = ?, unit_price = ?, tax_percent = ?, subtotal_amount = ?, tax_amount = ?, total_amount = ? WHERE id = ?";
            jdbcTemplate.update(sql,
                    line.getQuotationId(),
                    line.getProductId(),
                    line.getProductVariantId(),
                    line.getQuantity() != null ? line.getQuantity() : 1,
                    line.getUnitPrice(),
                    line.getTaxPercent() != null ? line.getTaxPercent() : BigDecimal.ZERO,
                    line.getSubtotalAmount() != null ? line.getSubtotalAmount() : BigDecimal.ZERO,
                    line.getTaxAmount() != null ? line.getTaxAmount() : BigDecimal.ZERO,
                    line.getTotalAmount() != null ? line.getTotalAmount() : BigDecimal.ZERO,
                    line.getId());
            return line;
        }
    }

    /**
     * Finds a QuotationLine by ID.
     */
    public Optional<QuotationLine> findById(Long id) {
        String sql = "SELECT id, quotation_id, product_id, product_variant_id, quantity, unit_price, tax_percent, subtotal_amount, tax_amount, total_amount FROM quotation_lines WHERE id = ?";
        List<QuotationLine> results = jdbcTemplate.query(sql, rowMapper, id);
        return results.stream().findFirst();
    }

    /**
     * Finds all QuotationLines for a specific Quotation ID.
     */
    public List<QuotationLine> findByQuotationId(Long quotationId) {
        String sql = "SELECT id, quotation_id, product_id, product_variant_id, quantity, unit_price, tax_percent, subtotal_amount, tax_amount, total_amount FROM quotation_lines WHERE quotation_id = ? ORDER BY id";
        return jdbcTemplate.query(sql, rowMapper, quotationId);
    }

    /**
     * Checks if a QuotationLine exists by ID.
     */
    public boolean existsById(Long id) {
        String sql = "SELECT COUNT(*) FROM quotation_lines WHERE id = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, id);
        return count != null && count > 0;
    }

    /**
     * Deletes a QuotationLine by ID.
     */
    public void deleteById(Long id) {
        String sql = "DELETE FROM quotation_lines WHERE id = ?";
        jdbcTemplate.update(sql, id);
    }

    /**
     * Deletes all QuotationLines belonging to a Quotation ID.
     */
    public void deleteByQuotationId(Long quotationId) {
        String sql = "DELETE FROM quotation_lines WHERE quotation_id = ?";
        jdbcTemplate.update(sql, quotationId);
    }

    /**
     * RowMapper implementation for QuotationLine entities.
     */
    public static class QuotationLineRowMapper implements RowMapper<QuotationLine> {
        @Override
        public QuotationLine mapRow(ResultSet rs, int rowNum) throws SQLException {
            QuotationLine line = new QuotationLine();
            line.setId(rs.getLong("id"));
            line.setQuotationId(rs.getLong("quotation_id"));
            line.setProductId(rs.getLong("product_id"));
            long pvId = rs.getLong("product_variant_id");
            line.setProductVariantId(rs.wasNull() ? null : pvId);
            line.setQuantity(rs.getInt("quantity"));
            line.setUnitPrice(rs.getBigDecimal("unit_price"));
            line.setTaxPercent(rs.getBigDecimal("tax_percent"));
            line.setSubtotalAmount(rs.getBigDecimal("subtotal_amount"));
            line.setTaxAmount(rs.getBigDecimal("tax_amount"));
            line.setTotalAmount(rs.getBigDecimal("total_amount"));
            return line;
        }
    }
}
