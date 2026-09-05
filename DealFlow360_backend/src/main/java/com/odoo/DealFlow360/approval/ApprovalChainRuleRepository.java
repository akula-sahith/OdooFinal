package com.odoo.DealFlow360.approval;

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
import java.sql.Types;
import java.util.List;
import java.util.Optional;

/**
 * Repository for ApprovalChainRule persistence operations using Spring JDBC.
 */
@Repository
public class ApprovalChainRuleRepository {

    private final JdbcTemplate jdbcTemplate;
    private final RowMapper<ApprovalChainRule> rowMapper = new ApprovalChainRuleRowMapper();

    public ApprovalChainRuleRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     * Persists an ApprovalChainRule (inserts if id is null, updates if id is present).
     *
     * @param rule ApprovalChainRule domain object
     * @return Saved ApprovalChainRule object with generated ID populated
     */
    public ApprovalChainRule save(ApprovalChainRule rule) {
        if (rule.getId() == null) {
            String sql = "INSERT INTO approval_chain_rules (name, customer_id, tier_id, min_discount_percent, min_total_amount) VALUES (?, ?, ?, ?, ?)";
            KeyHolder keyHolder = new GeneratedKeyHolder();
            jdbcTemplate.update(connection -> {
                PreparedStatement ps = connection.prepareStatement(sql, new String[]{"id"});
                ps.setString(1, rule.getName());
                if (rule.getCustomerId() != null) {
                    ps.setLong(2, rule.getCustomerId());
                } else {
                    ps.setNull(2, Types.BIGINT);
                }
                if (rule.getTierId() != null) {
                    ps.setLong(3, rule.getTierId());
                } else {
                    ps.setNull(3, Types.BIGINT);
                }
                if (rule.getMinDiscountPercent() != null) {
                    ps.setBigDecimal(4, rule.getMinDiscountPercent());
                } else {
                    ps.setNull(4, Types.NUMERIC);
                }
                if (rule.getMinTotalAmount() != null) {
                    ps.setBigDecimal(5, rule.getMinTotalAmount());
                } else {
                    ps.setNull(5, Types.NUMERIC);
                }
                return ps;
            }, keyHolder);

            Number key = keyHolder.getKey();
            if (key != null) {
                rule.setId(key.longValue());
            }
            return rule;
        } else {
            return update(rule);
        }
    }

    /**
     * Updates an existing ApprovalChainRule record.
     *
     * @param rule ApprovalChainRule domain object
     * @return Updated ApprovalChainRule object
     */
    public ApprovalChainRule update(ApprovalChainRule rule) {
        String sql = "UPDATE approval_chain_rules SET name = ?, customer_id = ?, tier_id = ?, min_discount_percent = ?, min_total_amount = ? WHERE id = ?";
        jdbcTemplate.update(sql,
                rule.getName(),
                rule.getCustomerId(),
                rule.getTierId(),
                rule.getMinDiscountPercent(),
                rule.getMinTotalAmount(),
                rule.getId());
        return rule;
    }

    /**
     * Finds an ApprovalChainRule by ID.
     */
    public Optional<ApprovalChainRule> findById(Long id) {
        String sql = "SELECT id, name, customer_id, tier_id, min_discount_percent, min_total_amount FROM approval_chain_rules WHERE id = ?";
        List<ApprovalChainRule> results = jdbcTemplate.query(sql, rowMapper, id);
        return results.stream().findFirst();
    }

    /**
     * Finds all ApprovalChainRules for a specific Customer ID.
     */
    public List<ApprovalChainRule> findByCustomerId(Long customerId) {
        String sql = "SELECT id, name, customer_id, tier_id, min_discount_percent, min_total_amount FROM approval_chain_rules WHERE customer_id = ? ORDER BY id";
        return jdbcTemplate.query(sql, rowMapper, customerId);
    }

    /**
     * Finds all ApprovalChainRules for a specific Tier ID.
     */
    public List<ApprovalChainRule> findByTierId(Long tierId) {
        String sql = "SELECT id, name, customer_id, tier_id, min_discount_percent, min_total_amount FROM approval_chain_rules WHERE tier_id = ? ORDER BY id";
        return jdbcTemplate.query(sql, rowMapper, tierId);
    }

    /**
     * Retrieves all ApprovalChainRules.
     */
    public List<ApprovalChainRule> findAll() {
        String sql = "SELECT id, name, customer_id, tier_id, min_discount_percent, min_total_amount FROM approval_chain_rules ORDER BY id";
        return jdbcTemplate.query(sql, rowMapper);
    }

    /**
     * Checks if an ApprovalChainRule exists by ID.
     */
    public boolean existsById(Long id) {
        String sql = "SELECT COUNT(*) FROM approval_chain_rules WHERE id = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, id);
        return count != null && count > 0;
    }

    /**
     * Deletes an ApprovalChainRule by ID.
     */
    public void deleteById(Long id) {
        String sql = "DELETE FROM approval_chain_rules WHERE id = ?";
        jdbcTemplate.update(sql, id);
    }

    /**
     * RowMapper implementation for ApprovalChainRule entities.
     */
    public static class ApprovalChainRuleRowMapper implements RowMapper<ApprovalChainRule> {
        @Override
        public ApprovalChainRule mapRow(ResultSet rs, int rowNum) throws SQLException {
            ApprovalChainRule rule = new ApprovalChainRule();
            rule.setId(rs.getLong("id"));
            rule.setName(rs.getString("name"));
            
            long custId = rs.getLong("customer_id");
            rule.setCustomerId(rs.wasNull() ? null : custId);

            long tierId = rs.getLong("tier_id");
            rule.setTierId(rs.wasNull() ? null : tierId);

            rule.setMinDiscountPercent(rs.getBigDecimal("min_discount_percent"));
            rule.setMinTotalAmount(rs.getBigDecimal("min_total_amount"));
            return rule;
        }
    }
}
