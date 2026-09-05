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
 * Repository for QuotationVersion persistence operations using Spring JDBC.
 */
@Repository
public class QuotationVersionRepository {

    private final JdbcTemplate jdbcTemplate;
    private final RowMapper<QuotationVersion> rowMapper = new QuotationVersionRowMapper();

    public QuotationVersionRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     * Persists a QuotationVersion domain object.
     *
     * @param version QuotationVersion domain object
     * @return Saved QuotationVersion object with generated ID populated
     */
    public QuotationVersion save(QuotationVersion version) {
        if (version.getCreatedAt() == null) {
            version.setCreatedAt(Instant.now());
        }
        if (version.getId() == null) {
            String sql = "INSERT INTO quotation_versions (quotation_id, version_number, status, total_amount, change_summary, created_at) VALUES (?, ?, ?, ?, ?, ?)";
            KeyHolder keyHolder = new GeneratedKeyHolder();
            jdbcTemplate.update(connection -> {
                PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
                ps.setLong(1, version.getQuotationId());
                ps.setInt(2, version.getVersionNumber());
                ps.setString(3, version.getStatus());
                ps.setBigDecimal(4, version.getTotalAmount() != null ? version.getTotalAmount() : BigDecimal.ZERO);
                ps.setString(5, version.getChangeSummary());
                ps.setTimestamp(6, Timestamp.from(version.getCreatedAt()));
                return ps;
            }, keyHolder);

            Number key = keyHolder.getKey();
            if (key != null) {
                version.setId(key.longValue());
            }
            return version;
        } else {
            String sql = "UPDATE quotation_versions SET quotation_id = ?, version_number = ?, status = ?, total_amount = ?, change_summary = ?, created_at = ? WHERE id = ?";
            jdbcTemplate.update(sql,
                    version.getQuotationId(),
                    version.getVersionNumber(),
                    version.getStatus(),
                    version.getTotalAmount() != null ? version.getTotalAmount() : BigDecimal.ZERO,
                    version.getChangeSummary(),
                    Timestamp.from(version.getCreatedAt()),
                    version.getId());
            return version;
        }
    }

    /**
     * Finds a QuotationVersion by ID.
     */
    public Optional<QuotationVersion> findById(Long id) {
        String sql = "SELECT id, quotation_id, version_number, status, total_amount, change_summary, created_at FROM quotation_versions WHERE id = ?";
        List<QuotationVersion> results = jdbcTemplate.query(sql, rowMapper, id);
        return results.stream().findFirst();
    }

    /**
     * Finds all QuotationVersions for a specific Quotation ID ordered by version number ascending.
     */
    public List<QuotationVersion> findByQuotationId(Long quotationId) {
        String sql = "SELECT id, quotation_id, version_number, status, total_amount, change_summary, created_at FROM quotation_versions WHERE quotation_id = ? ORDER BY version_number ASC";
        return jdbcTemplate.query(sql, rowMapper, quotationId);
    }

    /**
     * Finds the latest QuotationVersion for a Quotation ID.
     */
    public Optional<QuotationVersion> findLatestByQuotationId(Long quotationId) {
        String sql = "SELECT id, quotation_id, version_number, status, total_amount, change_summary, created_at FROM quotation_versions WHERE quotation_id = ? ORDER BY version_number DESC LIMIT 1";
        List<QuotationVersion> results = jdbcTemplate.query(sql, rowMapper, quotationId);
        return results.stream().findFirst();
    }

    /**
     * Checks if a version exists for a Quotation ID and version number.
     */
    public boolean existsByQuotationIdAndVersionNumber(Long quotationId, Integer versionNumber) {
        String sql = "SELECT COUNT(*) FROM quotation_versions WHERE quotation_id = ? AND version_number = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, quotationId, versionNumber);
        return count != null && count > 0;
    }

    /**
     * Retrieves all QuotationVersions.
     */
    public List<QuotationVersion> findAll() {
        String sql = "SELECT id, quotation_id, version_number, status, total_amount, change_summary, created_at FROM quotation_versions ORDER BY id";
        return jdbcTemplate.query(sql, rowMapper);
    }

    /**
     * RowMapper implementation for QuotationVersion entities.
     */
    public static class QuotationVersionRowMapper implements RowMapper<QuotationVersion> {
        @Override
        public QuotationVersion mapRow(ResultSet rs, int rowNum) throws SQLException {
            QuotationVersion version = new QuotationVersion();
            version.setId(rs.getLong("id"));
            version.setQuotationId(rs.getLong("quotation_id"));
            version.setVersionNumber(rs.getInt("version_number"));
            version.setStatus(rs.getString("status"));
            version.setTotalAmount(rs.getBigDecimal("total_amount"));
            version.setChangeSummary(rs.getString("change_summary"));
            Timestamp ca = rs.getTimestamp("created_at");
            version.setCreatedAt(ca != null ? ca.toInstant() : null);
            return version;
        }
    }
}
