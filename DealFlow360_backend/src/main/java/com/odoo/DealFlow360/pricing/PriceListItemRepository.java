package com.odoo.DealFlow360.pricing;

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
 * Repository for PriceListItem persistence operations using Spring JDBC.
 */
@Repository
public class PriceListItemRepository {

    private final JdbcTemplate jdbcTemplate;
    private final RowMapper<PriceListItem> rowMapper = new PriceListItemRowMapper();

    public PriceListItemRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     * Persists a PriceListItem (inserts if id is null, updates if id is present).
     *
     * @param item PriceListItem domain object
     * @return Saved PriceListItem object with generated ID populated
     */
    public PriceListItem save(PriceListItem item) {
        if (item.getId() == null) {
            String sql = "INSERT INTO price_list_items (price_list_id, product_id, product_variant_id, unit_price, min_quantity) VALUES (?, ?, ?, ?, ?)";
            KeyHolder keyHolder = new GeneratedKeyHolder();
            jdbcTemplate.update(connection -> {
                PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
                ps.setLong(1, item.getPriceListId());
                ps.setLong(2, item.getProductId());
                if (item.getProductVariantId() != null) {
                    ps.setLong(3, item.getProductVariantId());
                } else {
                    ps.setNull(3, java.sql.Types.BIGINT);
                }
                ps.setBigDecimal(4, item.getUnitPrice());
                ps.setInt(5, item.getMinQuantity() != null ? item.getMinQuantity() : 1);
                return ps;
            }, keyHolder);

            Number key = keyHolder.getKey();
            if (key != null) {
                item.setId(key.longValue());
            }
            return item;
        } else {
            String sql = "UPDATE price_list_items SET price_list_id = ?, product_id = ?, product_variant_id = ?, unit_price = ?, min_quantity = ? WHERE id = ?";
            jdbcTemplate.update(sql,
                    item.getPriceListId(),
                    item.getProductId(),
                    item.getProductVariantId(),
                    item.getUnitPrice(),
                    item.getMinQuantity() != null ? item.getMinQuantity() : 1,
                    item.getId());
            return item;
        }
    }

    /**
     * Finds a PriceListItem by ID.
     */
    public Optional<PriceListItem> findById(Long id) {
        String sql = "SELECT id, price_list_id, product_id, product_variant_id, unit_price, min_quantity FROM price_list_items WHERE id = ?";
        List<PriceListItem> results = jdbcTemplate.query(sql, rowMapper, id);
        return results.stream().findFirst();
    }

    /**
     * Finds all PriceListItems belonging to a specific Price List ID.
     */
    public List<PriceListItem> findByPriceListId(Long priceListId) {
        String sql = "SELECT id, price_list_id, product_id, product_variant_id, unit_price, min_quantity FROM price_list_items WHERE price_list_id = ? ORDER BY id";
        return jdbcTemplate.query(sql, rowMapper, priceListId);
    }

    /**
     * Finds all PriceListItems matching a specific Product ID.
     */
    public List<PriceListItem> findByProductId(Long productId) {
        String sql = "SELECT id, price_list_id, product_id, product_variant_id, unit_price, min_quantity FROM price_list_items WHERE product_id = ? ORDER BY id";
        return jdbcTemplate.query(sql, rowMapper, productId);
    }

    /**
     * Finds candidate PriceListItems matching both Price List ID and Product ID.
     */
    public List<PriceListItem> findByPriceListIdAndProductId(Long priceListId, Long productId) {
        String sql = "SELECT id, price_list_id, product_id, product_variant_id, unit_price, min_quantity FROM price_list_items WHERE price_list_id = ? AND product_id = ? ORDER BY id";
        return jdbcTemplate.query(sql, rowMapper, priceListId, productId);
    }

    /**
     * Checks if a PriceListItem exists by ID.
     */
    public boolean existsById(Long id) {
        String sql = "SELECT COUNT(*) FROM price_list_items WHERE id = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, id);
        return count != null && count > 0;
    }

    /**
     * Retrieves all PriceListItems.
     */
    public List<PriceListItem> findAll() {
        String sql = "SELECT id, price_list_id, product_id, product_variant_id, unit_price, min_quantity FROM price_list_items ORDER BY id";
        return jdbcTemplate.query(sql, rowMapper);
    }

    /**
     * Deletes a PriceListItem by ID.
     */
    public void deleteById(Long id) {
        String sql = "DELETE FROM price_list_items WHERE id = ?";
        jdbcTemplate.update(sql, id);
    }

    /**
     * RowMapper implementation for PriceListItem entities.
     */
    public static class PriceListItemRowMapper implements RowMapper<PriceListItem> {
        @Override
        public PriceListItem mapRow(ResultSet rs, int rowNum) throws SQLException {
            PriceListItem item = new PriceListItem();
            item.setId(rs.getLong("id"));
            item.setPriceListId(rs.getLong("price_list_id"));
            item.setProductId(rs.getLong("product_id"));
            long pvId = rs.getLong("product_variant_id");
            item.setProductVariantId(rs.wasNull() ? null : pvId);
            item.setUnitPrice(rs.getBigDecimal("unit_price"));
            item.setMinQuantity(rs.getInt("min_quantity"));
            return item;
        }
    }
}
