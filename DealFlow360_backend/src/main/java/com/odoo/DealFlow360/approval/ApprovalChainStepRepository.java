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
import java.sql.Types;
import java.util.List;
import java.util.Optional;

/**
 * Repository for ApprovalChainStep persistence operations using Spring JDBC.
 */
@Repository
public class ApprovalChainStepRepository {

    private final JdbcTemplate jdbcTemplate;
    private final RowMapper<ApprovalChainStep> rowMapper = new ApprovalChainStepRowMapper();

    public ApprovalChainStepRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     * Persists an ApprovalChainStep (inserts if id is null, updates if id is present).
     *
     * @param step ApprovalChainStep domain object
     * @return Saved ApprovalChainStep object with generated ID populated
     */
    public ApprovalChainStep save(ApprovalChainStep step) {
        if (step.getId() == null) {
            String sql = "INSERT INTO approval_chain_steps (rule_id, step_number, role, user_id) VALUES (?, ?, ?, ?)";
            KeyHolder keyHolder = new GeneratedKeyHolder();
            jdbcTemplate.update(connection -> {
                PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
                ps.setLong(1, step.getRuleId());
                ps.setInt(2, step.getStepNumber());
                ps.setString(3, step.getRole());
                if (step.getUserId() != null) {
                    ps.setLong(4, step.getUserId());
                } else {
                    ps.setNull(4, Types.BIGINT);
                }
                return ps;
            }, keyHolder);

            Number key = keyHolder.getKey();
            if (key != null) {
                step.setId(key.longValue());
            }
            return step;
        } else {
            return update(step);
        }
    }

    /**
     * Updates an existing ApprovalChainStep record.
     *
     * @param step ApprovalChainStep domain object
     * @return Updated ApprovalChainStep object
     */
    public ApprovalChainStep update(ApprovalChainStep step) {
        String sql = "UPDATE approval_chain_steps SET rule_id = ?, step_number = ?, role = ?, user_id = ? WHERE id = ?";
        jdbcTemplate.update(sql,
                step.getRuleId(),
                step.getStepNumber(),
                step.getRole(),
                step.getUserId(),
                step.getId());
        return step;
    }

    /**
     * Finds an ApprovalChainStep by ID.
     */
    public Optional<ApprovalChainStep> findById(Long id) {
        String sql = "SELECT id, rule_id, step_number, role, user_id FROM approval_chain_steps WHERE id = ?";
        List<ApprovalChainStep> results = jdbcTemplate.query(sql, rowMapper, id);
        return results.stream().findFirst();
    }

    /**
     * Finds all ApprovalChainSteps for a rule ID, strictly ordered by step_number ASC.
     */
    public List<ApprovalChainStep> findByRuleId(Long ruleId) {
        String sql = "SELECT id, rule_id, step_number, role, user_id FROM approval_chain_steps WHERE rule_id = ? ORDER BY step_number ASC";
        return jdbcTemplate.query(sql, rowMapper, ruleId);
    }

    /**
     * Retrieves all ApprovalChainSteps ordered by rule_id and step_number.
     */
    public List<ApprovalChainStep> findAll() {
        String sql = "SELECT id, rule_id, step_number, role, user_id FROM approval_chain_steps ORDER BY rule_id, step_number ASC";
        return jdbcTemplate.query(sql, rowMapper);
    }

    /**
     * Checks if an ApprovalChainStep exists by ID.
     */
    public boolean existsById(Long id) {
        String sql = "SELECT COUNT(*) FROM approval_chain_steps WHERE id = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, id);
        return count != null && count > 0;
    }

    /**
     * Deletes an ApprovalChainStep by ID.
     */
    public void deleteById(Long id) {
        String sql = "DELETE FROM approval_chain_steps WHERE id = ?";
        jdbcTemplate.update(sql, id);
    }

    /**
     * RowMapper implementation for ApprovalChainStep entities.
     */
    public static class ApprovalChainStepRowMapper implements RowMapper<ApprovalChainStep> {
        @Override
        public ApprovalChainStep mapRow(ResultSet rs, int rowNum) throws SQLException {
            ApprovalChainStep step = new ApprovalChainStep();
            step.setId(rs.getLong("id"));
            step.setRuleId(rs.getLong("rule_id"));
            step.setStepNumber(rs.getInt("step_number"));
            step.setRole(rs.getString("role"));
            
            long userId = rs.getLong("user_id");
            step.setUserId(rs.wasNull() ? null : userId);
            return step;
        }
    }
}
