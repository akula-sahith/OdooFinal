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
 * Repository for ProductVariant persistence operations using Spring JDBC.
 */
@Repository
public class ProductVariantRepository {

    private final JdbcTemplate jdbcTemplate;
    private final RowMapper<ProductVariant> rowMapper = new ProductVariantRowMapper();

    public ProductVariantRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     * Persists a ProductVariant (inserts if id is null, updates if id is present).
     *
     * @param variant ProductVariant domain object
     * @return Saved ProductVariant object with generated ID populated
     */
    public ProductVariant save(ProductVariant variant) {
        if (variant.getId() == null) {
            String sql = "INSERT INTO product_variants (product_id, attribute_name, value, extra_price) VALUES (?, ?, ?, ?)";
            KeyHolder keyHolder = new GeneratedKeyHolder();
            jdbcTemplate.update(connection -> {
                PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
                ps.setLong(1, variant.getProductId());
                ps.setString(2, variant.getAttributeName());
                ps.setString(3, variant.getValue());
                ps.setBigDecimal(4, variant.getExtraPrice() != null ? variant.getExtraPrice() : BigDecimal.ZERO);
                return ps;
            }, keyHolder);

            Number key = keyHolder.getKey();
            if (key != null) {
                variant.setId(key.longValue());
            }
            return variant;
        } else {
            String sql = "UPDATE product_variants SET product_id = ?, attribute_name = ?, value = ?, extra_price = ? WHERE id = ?";
            jdbcTemplate.update(sql,
                    variant.getProductId(),
                    variant.getAttributeName(),
                    variant.getValue(),
                    variant.getExtraPrice() != null ? variant.getExtraPrice() : BigDecimal.ZERO,
                    variant.getId());
            return variant;
        }
    }

    /**
     * Finds a ProductVariant by ID.
     */
    public Optional<ProductVariant> findById(Long id) {
        String sql = "SELECT id, product_id, attribute_name, value, extra_price FROM product_variants WHERE id = ?";
        List<ProductVariant> results = jdbcTemplate.query(sql, rowMapper, id);
        return results.stream().findFirst();
    }

    /**
     * Finds all ProductVariants for a specific Product ID.
     */
    public List<ProductVariant> findByProductId(Long productId) {
        String sql = "SELECT id, product_id, attribute_name, value, extra_price FROM product_variants WHERE product_id = ? ORDER BY id";
        return jdbcTemplate.query(sql, rowMapper, productId);
    }

    /**
     * Checks if a ProductVariant exists by ID.
     */
    public boolean existsById(Long id) {
        String sql = "SELECT COUNT(*) FROM product_variants WHERE id = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, id);
        return count != null && count > 0;
    }

    /**
     * Retrieves all ProductVariants.
     */
    public List<ProductVariant> findAll() {
        String sql = "SELECT id, product_id, attribute_name, value, extra_price FROM product_variants ORDER BY id";
        return jdbcTemplate.query(sql, rowMapper);
    }

    /**
     * Deletes a ProductVariant by ID.
     */
    public void deleteById(Long id) {
        String sql = "DELETE FROM product_variants WHERE id = ?";
        jdbcTemplate.update(sql, id);
    }

    /**
     * RowMapper implementation for ProductVariant entities.
     */
    public static class ProductVariantRowMapper implements RowMapper<ProductVariant> {
        @Override
        public ProductVariant mapRow(ResultSet rs, int rowNum) throws SQLException {
            ProductVariant variant = new ProductVariant();
            variant.setId(rs.getLong("id"));
            variant.setProductId(rs.getLong("product_id"));
            variant.setAttributeName(rs.getString("attribute_name"));
            variant.setValue(rs.getString("value"));
            variant.setExtraPrice(rs.getBigDecimal("extra_price"));
            return variant;
        }
    }
}
