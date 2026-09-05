package com.odoo.DealFlow360.recommendation;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.List;
import java.util.Optional;

/**
 * Repository for UpsellRule persistence operations using Spring JDBC.
 */
@Repository
public class UpsellRuleRepository {

    private final JdbcTemplate jdbcTemplate;
    private final RowMapper<UpsellRule> rowMapper = new UpsellRuleRowMapper();

    public UpsellRuleRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     * Persists an UpsellRule (inserts if id is null, updates if id is present).
     *
     * @param rule UpsellRule domain object
     * @return Saved UpsellRule object with generated ID populated
     */
    public UpsellRule save(UpsellRule rule) {
        if (rule.getId() == null) {
            String sql = "INSERT INTO upsell_rules (base_product_id, suggested_product_id, is_promoted, min_margin_threshold) VALUES (?, ?, ?, ?)";
            KeyHolder keyHolder = new GeneratedKeyHolder();
            jdbcTemplate.update(connection -> {
                PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
                ps.setLong(1, rule.getBaseProductId());
                ps.setLong(2, rule.getSuggestedProductId());
                ps.setBoolean(3, rule.getIsPromoted() != null ? rule.getIsPromoted() : false);
                if (rule.getMinMarginThreshold() != null) {
                    ps.setBigDecimal(4, rule.getMinMarginThreshold());
                } else {
                    ps.setNull(4, java.sql.Types.NUMERIC);
                }
                return ps;
            }, keyHolder);

            Number key = keyHolder.getKey();
            if (key != null) {
                rule.setId(key.longValue());
            }
            return rule;
        } else {
            String sql = "UPDATE upsell_rules SET base_product_id = ?, suggested_product_id = ?, is_promoted = ?, min_margin_threshold = ? WHERE id = ?";
            jdbcTemplate.update(sql,
                    rule.getBaseProductId(),
                    rule.getSuggestedProductId(),
                    rule.getIsPromoted() != null ? rule.getIsPromoted() : false,
                    rule.getMinMarginThreshold(),
                    rule.getId());
            return rule;
        }
    }

    /**
     * Finds an UpsellRule by ID.
     */
    public Optional<UpsellRule> findById(Long id) {
        String sql = "SELECT id, base_product_id, suggested_product_id, is_promoted, min_margin_threshold FROM upsell_rules WHERE id = ?";
        List<UpsellRule> results = jdbcTemplate.query(sql, rowMapper, id);
        return results.stream().findFirst();
    }

    /**
     * Finds all UpsellRules associated with a specific Base Product ID.
     */
    public List<UpsellRule> findByBaseProductId(Long baseProductId) {
        String sql = "SELECT id, base_product_id, suggested_product_id, is_promoted, min_margin_threshold FROM upsell_rules WHERE base_product_id = ? ORDER BY id";
        return jdbcTemplate.query(sql, rowMapper, baseProductId);
    }

    /**
     * Checks if an UpsellRule exists by ID.
     */
    public boolean existsById(Long id) {
        String sql = "SELECT COUNT(*) FROM upsell_rules WHERE id = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, id);
        return count != null && count > 0;
    }

    /**
     * Retrieves all UpsellRules.
     */
    public List<UpsellRule> findAll() {
        String sql = "SELECT id, base_product_id, suggested_product_id, is_promoted, min_margin_threshold FROM upsell_rules ORDER BY id";
        return jdbcTemplate.query(sql, rowMapper);
    }

    /**
     * Deletes an UpsellRule by ID.
     */
    public void deleteById(Long id) {
        String sql = "DELETE FROM upsell_rules WHERE id = ?";
        jdbcTemplate.update(sql, id);
    }

    /**
     * RowMapper implementation for UpsellRule entities.
     */
    public static class UpsellRuleRowMapper implements RowMapper<UpsellRule> {
        @Override
        public UpsellRule mapRow(ResultSet rs, int rowNum) throws SQLException {
            UpsellRule rule = new UpsellRule();
            rule.setId(rs.getLong("id"));
            rule.setBaseProductId(rs.getLong("base_product_id"));
            rule.setSuggestedProductId(rs.getLong("suggested_product_id"));
            boolean isProm = rs.getBoolean("is_promoted");
            rule.setIsPromoted(rs.wasNull() ? null : isProm);
            rule.setMinMarginThreshold(rs.getBigDecimal("min_margin_threshold"));
            return rule;
        }
    }
}
