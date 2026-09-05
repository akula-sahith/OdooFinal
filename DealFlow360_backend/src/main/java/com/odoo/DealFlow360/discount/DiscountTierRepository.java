package com.odoo.DealFlow360.discount;

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
 * Repository for DiscountTier persistence operations using Spring JDBC.
 */
@Repository
public class DiscountTierRepository {

    private final JdbcTemplate jdbcTemplate;
    private final RowMapper<DiscountTier> rowMapper = new DiscountTierRowMapper();

    public DiscountTierRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     * Persists a DiscountTier (inserts if id is null, updates if id is present).
     *
     * @param tier DiscountTier domain object
     * @return Saved DiscountTier object with generated ID populated
     */
    public DiscountTier save(DiscountTier tier) {
        if (tier.getId() == null) {
            String sql = "INSERT INTO discount_tiers (name, max_discount_percent) VALUES (?, ?)";
            KeyHolder keyHolder = new GeneratedKeyHolder();
            jdbcTemplate.update(connection -> {
                PreparedStatement ps = connection.prepareStatement(sql, new String[]{"id"});
                ps.setString(1, tier.getName());
                ps.setBigDecimal(2, tier.getMaxDiscountPercent() != null ? tier.getMaxDiscountPercent() : BigDecimal.ZERO);
                return ps;
            }, keyHolder);

            Number key = keyHolder.getKey();
            if (key != null) {
                tier.setId(key.longValue());
            }
            return tier;
        } else {
            return update(tier);
        }
    }

    /**
     * Updates an existing DiscountTier record.
     *
     * @param tier DiscountTier domain object
     * @return Updated DiscountTier object
     */
    public DiscountTier update(DiscountTier tier) {
        String sql = "UPDATE discount_tiers SET name = ?, max_discount_percent = ? WHERE id = ?";
        jdbcTemplate.update(sql,
                tier.getName(),
                tier.getMaxDiscountPercent() != null ? tier.getMaxDiscountPercent() : BigDecimal.ZERO,
                tier.getId());
        return tier;
    }

    /**
     * Finds a DiscountTier by ID.
     */
    public Optional<DiscountTier> findById(Long id) {
        String sql = "SELECT id, name, max_discount_percent FROM discount_tiers WHERE id = ?";
        List<DiscountTier> results = jdbcTemplate.query(sql, rowMapper, id);
        return results.stream().findFirst();
    }

    /**
     * Finds a DiscountTier by name.
     */
    public Optional<DiscountTier> findByName(String name) {
        String sql = "SELECT id, name, max_discount_percent FROM discount_tiers WHERE name = ?";
        List<DiscountTier> results = jdbcTemplate.query(sql, rowMapper, name);
        return results.stream().findFirst();
    }

    /**
     * Retrieves all DiscountTiers.
     */
    public List<DiscountTier> findAll() {
        String sql = "SELECT id, name, max_discount_percent FROM discount_tiers ORDER BY id";
        return jdbcTemplate.query(sql, rowMapper);
    }

    /**
     * Checks if a DiscountTier exists by ID.
     */
    public boolean existsById(Long id) {
        String sql = "SELECT COUNT(*) FROM discount_tiers WHERE id = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, id);
        return count != null && count > 0;
    }

    /**
     * Deletes a DiscountTier by ID.
     */
    public void deleteById(Long id) {
        String sql = "DELETE FROM discount_tiers WHERE id = ?";
        jdbcTemplate.update(sql, id);
    }

    /**
     * RowMapper implementation for DiscountTier entities.
     */
    public static class DiscountTierRowMapper implements RowMapper<DiscountTier> {
        @Override
        public DiscountTier mapRow(ResultSet rs, int rowNum) throws SQLException {
            DiscountTier tier = new DiscountTier();
            tier.setId(rs.getLong("id"));
            tier.setName(rs.getString("name"));
            tier.setMaxDiscountPercent(rs.getBigDecimal("max_discount_percent"));
            return tier;
        }
    }
}
