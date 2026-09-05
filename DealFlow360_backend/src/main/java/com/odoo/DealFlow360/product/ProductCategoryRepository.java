package com.odoo.DealFlow360.product;

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
 * Repository for ProductCategory persistence operations using Spring JDBC.
 */
@Repository
public class ProductCategoryRepository {

    private final JdbcTemplate jdbcTemplate;
    private final RowMapper<ProductCategory> rowMapper = new ProductCategoryRowMapper();

    public ProductCategoryRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     * Persists a ProductCategory (inserts if id is null, updates if id is present).
     *
     * @param category ProductCategory domain object
     * @return Saved ProductCategory object with generated ID populated
     */
    public ProductCategory save(ProductCategory category) {
        if (category.getId() == null) {
            String sql = "INSERT INTO product_categories (name) VALUES (?)";
            KeyHolder keyHolder = new GeneratedKeyHolder();
            jdbcTemplate.update(connection -> {
                PreparedStatement ps = connection.prepareStatement(sql, new String[]{"id"});
                ps.setString(1, category.getName());
                return ps;
            }, keyHolder);

            Number key = keyHolder.getKey();
            if (key != null) {
                category.setId(key.longValue());
            }
            return category;
        } else {
            String sql = "UPDATE product_categories SET name = ? WHERE id = ?";
            jdbcTemplate.update(sql, category.getName(), category.getId());
            return category;
        }
    }

    /**
     * Finds a ProductCategory by ID.
     */
    public Optional<ProductCategory> findById(Long id) {
        String sql = "SELECT id, name FROM product_categories WHERE id = ?";
        List<ProductCategory> results = jdbcTemplate.query(sql, rowMapper, id);
        return results.stream().findFirst();
    }

    /**
     * Finds a ProductCategory by name.
     */
    public Optional<ProductCategory> findByName(String name) {
        String sql = "SELECT id, name FROM product_categories WHERE name = ?";
        List<ProductCategory> results = jdbcTemplate.query(sql, rowMapper, name);
        return results.stream().findFirst();
    }

    /**
     * Checks if a ProductCategory exists by ID.
     */
    public boolean existsById(Long id) {
        String sql = "SELECT COUNT(*) FROM product_categories WHERE id = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, id);
        return count != null && count > 0;
    }

    /**
     * Retrieves all ProductCategories.
     */
    public List<ProductCategory> findAll() {
        String sql = "SELECT id, name FROM product_categories ORDER BY id";
        return jdbcTemplate.query(sql, rowMapper);
    }

    /**
     * Deletes a ProductCategory by ID.
     */
    public void deleteById(Long id) {
        String sql = "DELETE FROM product_categories WHERE id = ?";
        jdbcTemplate.update(sql, id);
    }

    /**
     * RowMapper implementation for ProductCategory entities.
     */
    public static class ProductCategoryRowMapper implements RowMapper<ProductCategory> {
        @Override
        public ProductCategory mapRow(ResultSet rs, int rowNum) throws SQLException {
            ProductCategory category = new ProductCategory();
            category.setId(rs.getLong("id"));
            category.setName(rs.getString("name"));
            return category;
        }
    }
}
