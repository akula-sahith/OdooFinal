package com.odoo.DealFlow360.product;

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
 * Repository for Product persistence operations using Spring JDBC.
 */
@Repository
public class ProductRepository {

    private final JdbcTemplate jdbcTemplate;
    private final RowMapper<Product> rowMapper = new ProductRowMapper();

    public ProductRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     * Persists a Product (inserts if id is null, updates if id is present).
     *
     * @param product Product domain object
     * @return Saved Product object with generated ID populated
     */
    public Product save(Product product) {
        if (product.getId() == null) {
            String sql = "INSERT INTO products (name, category_id, base_price, tax_percent, currency, is_subscription) VALUES (?, ?, ?, ?, ?, ?)";
            KeyHolder keyHolder = new GeneratedKeyHolder();
            jdbcTemplate.update(connection -> {
                PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
                ps.setString(1, product.getName());
                if (product.getCategoryId() != null) {
                    ps.setLong(2, product.getCategoryId());
                } else {
                    ps.setNull(2, java.sql.Types.BIGINT);
                }
                ps.setBigDecimal(3, product.getBasePrice());
                ps.setBigDecimal(4, product.getTaxPercent() != null ? product.getTaxPercent() : BigDecimal.ZERO);
                ps.setString(5, product.getCurrency() != null ? product.getCurrency() : "USD");
                ps.setBoolean(6, product.getIsSubscription() != null ? product.getIsSubscription() : false);
                return ps;
            }, keyHolder);

            Number key = keyHolder.getKey();
            if (key != null) {
                product.setId(key.longValue());
            }
            return product;
        } else {
            String sql = "UPDATE products SET name = ?, category_id = ?, base_price = ?, tax_percent = ?, currency = ?, is_subscription = ? WHERE id = ?";
            jdbcTemplate.update(sql,
                    product.getName(),
                    product.getCategoryId(),
                    product.getBasePrice(),
                    product.getTaxPercent() != null ? product.getTaxPercent() : BigDecimal.ZERO,
                    product.getCurrency() != null ? product.getCurrency() : "USD",
                    product.getIsSubscription() != null ? product.getIsSubscription() : false,
                    product.getId());
            return product;
        }
    }

    /**
     * Finds a Product by ID.
     */
    public Optional<Product> findById(Long id) {
        String sql = "SELECT id, name, category_id, base_price, tax_percent, currency, is_subscription FROM products WHERE id = ?";
        List<Product> results = jdbcTemplate.query(sql, rowMapper, id);
        return results.stream().findFirst();
    }

    /**
     * Finds all Products for a specific Category ID.
     */
    public List<Product> findByCategoryId(Long categoryId) {
        String sql = "SELECT id, name, category_id, base_price, tax_percent, currency, is_subscription FROM products WHERE category_id = ? ORDER BY id";
        return jdbcTemplate.query(sql, rowMapper, categoryId);
    }

    /**
     * Checks if a Product exists by ID.
     */
    public boolean existsById(Long id) {
        String sql = "SELECT COUNT(*) FROM products WHERE id = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, id);
        return count != null && count > 0;
    }

    /**
     * Retrieves all Products.
     */
    public List<Product> findAll() {
        String sql = "SELECT id, name, category_id, base_price, tax_percent, currency, is_subscription FROM products ORDER BY id";
        return jdbcTemplate.query(sql, rowMapper);
    }

    /**
     * Deletes a Product by ID.
     */
    public void deleteById(Long id) {
        String sql = "DELETE FROM products WHERE id = ?";
        jdbcTemplate.update(sql, id);
    }

    /**
     * RowMapper implementation for Product entities.
     */
    public static class ProductRowMapper implements RowMapper<Product> {
        @Override
        public Product mapRow(ResultSet rs, int rowNum) throws SQLException {
            Product product = new Product();
            product.setId(rs.getLong("id"));
            product.setName(rs.getString("name"));
            long categoryId = rs.getLong("category_id");
            product.setCategoryId(rs.wasNull() ? null : categoryId);
            product.setBasePrice(rs.getBigDecimal("base_price"));
            product.setTaxPercent(rs.getBigDecimal("tax_percent"));
            product.setCurrency(rs.getString("currency"));
            boolean isSub = rs.getBoolean("is_subscription");
            product.setIsSubscription(rs.wasNull() ? null : isSub);
            return product;
        }
    }
}
