package com.odoo.DealFlow360.common;

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

/**
 * Spring JDBC repository for AuditLog entities.
 */
@Repository
public class AuditLogRepository {

    private final JdbcTemplate jdbcTemplate;
    private final RowMapper<AuditLog> rowMapper = new AuditLogRowMapper();

    public AuditLogRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public AuditLog save(AuditLog auditLog) {
        Instant now = Instant.now();
        if (auditLog.getCreatedAt() == null) {
            auditLog.setCreatedAt(now);
        }

        String sql = "INSERT INTO audit_log (entity_type, entity_id, action, user_id, changes_json, created_at) " +
                     "VALUES (?, ?, ?, ?, ?, ?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, new String[]{"id"});
            ps.setString(1, auditLog.getEntityType());
            ps.setLong(2, auditLog.getEntityId());
            ps.setString(3, auditLog.getAction());
            if (auditLog.getUserId() != null) {
                ps.setLong(4, auditLog.getUserId());
            } else {
                ps.setNull(4, java.sql.Types.BIGINT);
            }
            ps.setString(5, auditLog.getChangesJson());
            ps.setTimestamp(6, Timestamp.from(auditLog.getCreatedAt()));
            return ps;
        }, keyHolder);

        Number key = keyHolder.getKey();
        if (key != null) {
            auditLog.setId(key.longValue());
        }
        return auditLog;
    }

    public Optional<AuditLog> findById(Long id) {
        String sql = "SELECT id, entity_type, entity_id, action, user_id, changes_json, created_at FROM audit_log WHERE id = ?";
        List<AuditLog> results = jdbcTemplate.query(sql, rowMapper, id);
        return results.stream().findFirst();
    }

    public List<AuditLog> findByEntity(String entityType, Long entityId) {
        String sql = "SELECT id, entity_type, entity_id, action, user_id, changes_json, created_at FROM audit_log " +
                     "WHERE entity_type = ? AND entity_id = ? ORDER BY id DESC";
        return jdbcTemplate.query(sql, rowMapper, entityType, entityId);
    }

    public List<AuditLog> findByUserId(Long userId) {
        String sql = "SELECT id, entity_type, entity_id, action, user_id, changes_json, created_at FROM audit_log " +
                     "WHERE user_id = ? ORDER BY id DESC";
        return jdbcTemplate.query(sql, rowMapper, userId);
    }

    public List<AuditLog> findAll() {
        String sql = "SELECT id, entity_type, entity_id, action, user_id, changes_json, created_at FROM audit_log ORDER BY id DESC";
        return jdbcTemplate.query(sql, rowMapper);
    }

    public static class AuditLogRowMapper implements RowMapper<AuditLog> {
        @Override
        public AuditLog mapRow(ResultSet rs, int rowNum) throws SQLException {
            AuditLog log = new AuditLog();
            log.setId(rs.getLong("id"));
            log.setEntityType(rs.getString("entity_type"));
            log.setEntityId(rs.getLong("entity_id"));
            log.setAction(rs.getString("action"));
            long uId = rs.getLong("user_id");
            log.setUserId(rs.wasNull() ? null : uId);
            log.setChangesJson(rs.getString("changes_json"));
            Timestamp cat = rs.getTimestamp("created_at");
            log.setCreatedAt(cat != null ? cat.toInstant() : null);
            return log;
        }
    }
}
