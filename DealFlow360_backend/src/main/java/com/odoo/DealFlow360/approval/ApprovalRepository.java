package com.odoo.DealFlow360.approval;

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
import java.sql.Types;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

/**
 * Repository for Approval persistence operations using Spring JDBC.
 */
@Repository
public class ApprovalRepository {

    private final JdbcTemplate jdbcTemplate;
    private final RowMapper<Approval> rowMapper = new ApprovalRowMapper();

    public ApprovalRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     * Persists an Approval record (inserts if id is null, updates if id is present).
     *
     * @param approval Approval domain object
     * @return Saved Approval object with generated ID populated
     */
    public Approval save(Approval approval) {
        if (approval.getCreatedAt() == null) {
            approval.setCreatedAt(Instant.now());
        }

        if (approval.getId() == null) {
            String sql = "INSERT INTO approvals (quotation_id, approver_id, step_number, status, decision_reason, created_at, decided_at) VALUES (?, ?, ?, ?, ?, ?, ?)";
            KeyHolder keyHolder = new GeneratedKeyHolder();
            jdbcTemplate.update(connection -> {
                PreparedStatement ps = connection.prepareStatement(sql, new String[]{"id"});
                ps.setLong(1, approval.getQuotationId());
                if (approval.getApproverId() != null) {
                    ps.setLong(2, approval.getApproverId());
                } else {
                    ps.setNull(2, Types.BIGINT);
                }
                ps.setInt(3, approval.getStepNumber() != null ? approval.getStepNumber() : 1);
                ps.setString(4, approval.getStatus() != null ? approval.getStatus() : "PENDING");
                if (approval.getDecisionReason() != null) {
                    ps.setString(5, approval.getDecisionReason());
                } else {
                    ps.setNull(5, Types.VARCHAR);
                }
                ps.setTimestamp(6, Timestamp.from(approval.getCreatedAt()));
                if (approval.getDecidedAt() != null) {
                    ps.setTimestamp(7, Timestamp.from(approval.getDecidedAt()));
                } else {
                    ps.setNull(7, Types.TIMESTAMP);
                }
                return ps;
            }, keyHolder);

            Number key = keyHolder.getKey();
            if (key != null) {
                approval.setId(key.longValue());
            }
            return approval;
        } else {
            return update(approval);
        }
    }

    /**
     * Updates an existing Approval record.
     *
     * @param approval Approval domain object
     * @return Updated Approval object
     */
    public Approval update(Approval approval) {
        String sql = "UPDATE approvals SET quotation_id = ?, approver_id = ?, step_number = ?, status = ?, decision_reason = ?, created_at = ?, decided_at = ? WHERE id = ?";
        jdbcTemplate.update(sql,
                approval.getQuotationId(),
                approval.getApproverId(),
                approval.getStepNumber(),
                approval.getStatus(),
                approval.getDecisionReason(),
                approval.getCreatedAt() != null ? Timestamp.from(approval.getCreatedAt()) : null,
                approval.getDecidedAt() != null ? Timestamp.from(approval.getDecidedAt()) : null,
                approval.getId());
        return approval;
    }

    /**
     * Finds an Approval by ID.
     */
    public Optional<Approval> findById(Long id) {
        String sql = "SELECT id, quotation_id, approver_id, step_number, status, decision_reason, created_at, decided_at FROM approvals WHERE id = ?";
        List<Approval> results = jdbcTemplate.query(sql, rowMapper, id);
        return results.stream().findFirst();
    }

    /**
     * Finds all Approvals for a Quotation ID, ordered by step_number ASC.
     */
    public List<Approval> findByQuotationId(Long quotationId) {
        String sql = "SELECT id, quotation_id, approver_id, step_number, status, decision_reason, created_at, decided_at FROM approvals WHERE quotation_id = ? ORDER BY step_number ASC";
        return jdbcTemplate.query(sql, rowMapper, quotationId);
    }

    /**
     * Finds all Approvals matching a specific status string.
     */
    public List<Approval> findByStatus(String status) {
        String sql = "SELECT id, quotation_id, approver_id, step_number, status, decision_reason, created_at, decided_at FROM approvals WHERE status = ? ORDER BY id";
        return jdbcTemplate.query(sql, rowMapper, status);
    }

    /**
     * Retrieves all Approvals.
     */
    public List<Approval> findAll() {
        String sql = "SELECT id, quotation_id, approver_id, step_number, status, decision_reason, created_at, decided_at FROM approvals ORDER BY id";
        return jdbcTemplate.query(sql, rowMapper);
    }

    /**
     * Checks if an Approval exists by ID.
     */
    public boolean existsById(Long id) {
        String sql = "SELECT COUNT(*) FROM approvals WHERE id = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, id);
        return count != null && count > 0;
    }

    /**
     * Deletes an Approval by ID.
     */
    public void deleteById(Long id) {
        String sql = "DELETE FROM approvals WHERE id = ?";
        jdbcTemplate.update(sql, id);
    }

    /**
     * RowMapper implementation for Approval entities.
     */
    public static class ApprovalRowMapper implements RowMapper<Approval> {
        @Override
        public Approval mapRow(ResultSet rs, int rowNum) throws SQLException {
            Approval approval = new Approval();
            approval.setId(rs.getLong("id"));
            approval.setQuotationId(rs.getLong("quotation_id"));
            
            long approverId = rs.getLong("approver_id");
            approval.setApproverId(rs.wasNull() ? null : approverId);

            approval.setStepNumber(rs.getInt("step_number"));
            approval.setStatus(rs.getString("status"));
            approval.setDecisionReason(rs.getString("decision_reason"));

            Timestamp ca = rs.getTimestamp("created_at");
            approval.setCreatedAt(ca != null ? ca.toInstant() : null);

            Timestamp da = rs.getTimestamp("decided_at");
            approval.setDecidedAt(da != null ? da.toInstant() : null);

            return approval;
        }
    }
}
