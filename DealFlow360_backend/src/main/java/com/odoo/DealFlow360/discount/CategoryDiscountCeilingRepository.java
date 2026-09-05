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
 * Repository for CategoryDiscountCeiling persistence operations using Spring JDBC.
 */
@Repository
public class CategoryDiscountCeilingRepository {

    private final JdbcTemplate jdbcTemplate;
    private final RowMapper<CategoryDiscountCeiling> rowMapper = new CategoryDiscountCeilingRowMapper();

    public CategoryDiscountCeilingRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     * Persists a CategoryDiscountCeiling (inserts if id is null, updates if id is present).
     *
     * @param ceiling CategoryDiscountCeiling domain object
     * @return Saved CategoryDiscountCeiling object with generated ID populated
     */
    public CategoryDiscountCeiling save(CategoryDiscountCeiling ceiling) {
        if (ceiling.getId() == null) {
            String sql = "INSERT INTO category_discount_ceilings (category_id, tier_id, max_discount_percent) VALUES (?, ?, ?)";
            KeyHolder keyHolder = new GeneratedKeyHolder();
            jdbcTemplate.update(connection -> {
                PreparedStatement ps = connection.prepareStatement(sql, new String[]{"id"});
                ps.setLong(1, ceiling.getCategoryId());
                ps.setLong(2, ceiling.getTierId());
                ps.setBigDecimal(3, ceiling.getMaxDiscountPercent() != null ? ceiling.getMaxDiscountPercent() : BigDecimal.ZERO);
                return ps;
            }, keyHolder);

            Number key = keyHolder.getKey();
            if (key != null) {
                ceiling.setId(key.longValue());
            }
            return ceiling;
        } else {
            return update(ceiling);
        }
    }

    /**
     * Updates an existing CategoryDiscountCeiling record.
     *
     * @param ceiling CategoryDiscountCeiling domain object
     * @return Updated CategoryDiscountCeiling object
     */
    public CategoryDiscountCeiling update(CategoryDiscountCeiling ceiling) {
        String sql = "UPDATE category_discount_ceilings SET category_id = ?, tier_id = ?, max_discount_percent = ? WHERE id = ?";
        jdbcTemplate.update(sql,
                ceiling.getCategoryId(),
                ceiling.getTierId(),
                ceiling.getMaxDiscountPercent() != null ? ceiling.getMaxDiscountPercent() : BigDecimal.ZERO,
                ceiling.getId());
        return ceiling;
    }

    /**
     * Finds a CategoryDiscountCeiling by ID.
     */
    public Optional<CategoryDiscountCeiling> findById(Long id) {
        String sql = "SELECT id, category_id, tier_id, max_discount_percent FROM category_discount_ceilings WHERE id = ?";
        List<CategoryDiscountCeiling> results = jdbcTemplate.query(sql, rowMapper, id);
        return results.stream().findFirst();
    }

    /**
     * Finds a CategoryDiscountCeiling by Category ID and Tier ID.
     */
    public Optional<CategoryDiscountCeiling> findByCategoryIdAndTierId(Long categoryId, Long tierId) {
        String sql = "SELECT id, category_id, tier_id, max_discount_percent FROM category_discount_ceilings WHERE category_id = ? AND tier_id = ?";
        List<CategoryDiscountCeiling> results = jdbcTemplate.query(sql, rowMapper, categoryId, tierId);
        return results.stream().findFirst();
    }

    /**
     * Finds all CategoryDiscountCeilings for a Category ID.
     */
    public List<CategoryDiscountCeiling> findByCategoryId(Long categoryId) {
        String sql = "SELECT id, category_id, tier_id, max_discount_percent FROM category_discount_ceilings WHERE category_id = ? ORDER BY id";
        return jdbcTemplate.query(sql, rowMapper, categoryId);
    }

    /**
     * Finds all CategoryDiscountCeilings for a Tier ID.
     */
    public List<CategoryDiscountCeiling> findByTierId(Long tierId) {
        String sql = "SELECT id, category_id, tier_id, max_discount_percent FROM category_discount_ceilings WHERE tier_id = ? ORDER BY id";
        return jdbcTemplate.query(sql, rowMapper, tierId);
    }

    /**
     * Retrieves all CategoryDiscountCeilings.
     */
    public List<CategoryDiscountCeiling> findAll() {
        String sql = "SELECT id, category_id, tier_id, max_discount_percent FROM category_discount_ceilings ORDER BY id";
        return jdbcTemplate.query(sql, rowMapper);
    }

    /**
     * Checks if a CategoryDiscountCeiling exists by ID.
     */
    public boolean existsById(Long id) {
        String sql = "SELECT COUNT(*) FROM category_discount_ceilings WHERE id = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, id);
        return count != null && count > 0;
    }

    /**
     * Deletes a CategoryDiscountCeiling by ID.
     */
    public void deleteById(Long id) {
        String sql = "DELETE FROM category_discount_ceilings WHERE id = ?";
        jdbcTemplate.update(sql, id);
    }

    /**
     * RowMapper implementation for CategoryDiscountCeiling entities.
     */
    public static class CategoryDiscountCeilingRowMapper implements RowMapper<CategoryDiscountCeiling> {
        @Override
        public CategoryDiscountCeiling mapRow(ResultSet rs, int rowNum) throws SQLException {
            CategoryDiscountCeiling ceiling = new CategoryDiscountCeiling();
            ceiling.setId(rs.getLong("id"));
            ceiling.setCategoryId(rs.getLong("category_id"));
            ceiling.setTierId(rs.getLong("tier_id"));
            ceiling.setMaxDiscountPercent(rs.getBigDecimal("max_discount_percent"));
            return ceiling;
        }
    }
}
