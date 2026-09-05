package com.odoo.DealFlow360.dealhealth;

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
public class DealHealthAlertRepository {

    private final JdbcTemplate jdbcTemplate;
    private final RowMapper<DealHealthAlert> rowMapper = new DealHealthAlertRowMapper();

    public DealHealthAlertRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public DealHealthAlert save(DealHealthAlert alert) {
        Instant now = Instant.now();
        if (alert.getTriggeredAt() == null) {
            alert.setTriggeredAt(now);
        }

        if (alert.getId() == null) {
            String sql = "INSERT INTO deal_health_alerts (quotation_id, alert_type, severity, status, triggered_at, resolved_at) " +
                         "VALUES (?, ?, ?, ?, ?, ?)";
            KeyHolder keyHolder = new GeneratedKeyHolder();
            jdbcTemplate.update(connection -> {
                PreparedStatement ps = connection.prepareStatement(sql, new String[]{"id"});
                ps.setLong(1, alert.getQuotationId());
                ps.setString(2, alert.getAlertType());
                ps.setString(3, alert.getSeverity() != null ? alert.getSeverity() : "MEDIUM");
                ps.setString(4, alert.getStatus() != null ? alert.getStatus() : "ACTIVE");
                ps.setTimestamp(5, Timestamp.from(alert.getTriggeredAt()));
                if (alert.getResolvedAt() != null) {
                    ps.setTimestamp(6, Timestamp.from(alert.getResolvedAt()));
                } else {
                    ps.setNull(6, java.sql.Types.TIMESTAMP);
                }
                return ps;
            }, keyHolder);

            Number key = keyHolder.getKey();
            if (key != null) {
                alert.setId(key.longValue());
            }
            return alert;
        } else {
            String sql = "UPDATE deal_health_alerts SET quotation_id = ?, alert_type = ?, severity = ?, status = ?, resolved_at = ? WHERE id = ?";
            jdbcTemplate.update(sql,
                    alert.getQuotationId(),
                    alert.getAlertType(),
                    alert.getSeverity(),
                    alert.getStatus(),
                    alert.getResolvedAt() != null ? Timestamp.from(alert.getResolvedAt()) : null,
                    alert.getId());
            return alert;
        }
    }

    public Optional<DealHealthAlert> findById(Long id) {
        String sql = "SELECT id, quotation_id, alert_type, severity, status, triggered_at, resolved_at FROM deal_health_alerts WHERE id = ?";
        List<DealHealthAlert> results = jdbcTemplate.query(sql, rowMapper, id);
        return results.stream().findFirst();
    }

    public List<DealHealthAlert> findByQuotationId(Long quotationId) {
        String sql = "SELECT id, quotation_id, alert_type, severity, status, triggered_at, resolved_at FROM deal_health_alerts WHERE quotation_id = ? ORDER BY id DESC";
        return jdbcTemplate.query(sql, rowMapper, quotationId);
    }

    public List<DealHealthAlert> findByStatus(String status) {
        String sql = "SELECT id, quotation_id, alert_type, severity, status, triggered_at, resolved_at FROM deal_health_alerts WHERE status = ? ORDER BY id DESC";
        return jdbcTemplate.query(sql, rowMapper, status);
    }

    public List<DealHealthAlert> findAll() {
        String sql = "SELECT id, quotation_id, alert_type, severity, status, triggered_at, resolved_at FROM deal_health_alerts ORDER BY id DESC";
        return jdbcTemplate.query(sql, rowMapper);
    }

    public void deleteById(Long id) {
        String sql = "DELETE FROM deal_health_alerts WHERE id = ?";
        jdbcTemplate.update(sql, id);
    }

    public static class DealHealthAlertRowMapper implements RowMapper<DealHealthAlert> {
        @Override
        public DealHealthAlert mapRow(ResultSet rs, int rowNum) throws SQLException {
            DealHealthAlert alert = new DealHealthAlert();
            alert.setId(rs.getLong("id"));
            alert.setQuotationId(rs.getLong("quotation_id"));
            alert.setAlertType(rs.getString("alert_type"));
            alert.setSeverity(rs.getString("severity"));
            alert.setStatus(rs.getString("status"));
            Timestamp ta = rs.getTimestamp("triggered_at");
            alert.setTriggeredAt(ta != null ? ta.toInstant() : null);
            Timestamp ra = rs.getTimestamp("resolved_at");
            alert.setResolvedAt(ra != null ? ra.toInstant() : null);
            return alert;
        }
    }
}
