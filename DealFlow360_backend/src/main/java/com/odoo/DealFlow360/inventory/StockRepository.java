package com.odoo.DealFlow360.inventory;

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

@Repository
public class StockRepository {

    private final JdbcTemplate jdbcTemplate;
    private final RowMapper<Stock> rowMapper = new StockRowMapper();

    public StockRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public Stock save(Stock stock) {
        if (stock.getId() == null) {
            String sql = "INSERT INTO stock (warehouse_id, product_id, on_hand_amount, reserved_amount) VALUES (?, ?, ?, ?)";
            KeyHolder keyHolder = new GeneratedKeyHolder();
            jdbcTemplate.update(connection -> {
                PreparedStatement ps = connection.prepareStatement(sql, new String[]{"id"});
                ps.setLong(1, stock.getWarehouseId());
                ps.setLong(2, stock.getProductId());
                ps.setInt(3, stock.getOnHandAmount() != null ? stock.getOnHandAmount() : 0);
                ps.setInt(4, stock.getReservedAmount() != null ? stock.getReservedAmount() : 0);
                return ps;
            }, keyHolder);

            Number key = keyHolder.getKey();
            if (key != null) {
                stock.setId(key.longValue());
            }
            return stock;
        } else {
            String sql = "UPDATE stock SET warehouse_id = ?, product_id = ?, on_hand_amount = ?, reserved_amount = ? WHERE id = ?";
            jdbcTemplate.update(sql, stock.getWarehouseId(), stock.getProductId(), stock.getOnHandAmount(), stock.getReservedAmount(), stock.getId());
            return stock;
        }
    }

    public Optional<Stock> findById(Long id) {
        String sql = "SELECT id, warehouse_id, product_id, on_hand_amount, reserved_amount FROM stock WHERE id = ?";
        List<Stock> results = jdbcTemplate.query(sql, rowMapper, id);
        return results.stream().findFirst();
    }

    public Optional<Stock> findByWarehouseIdAndProductId(Long warehouseId, Long productId) {
        String sql = "SELECT id, warehouse_id, product_id, on_hand_amount, reserved_amount FROM stock WHERE warehouse_id = ? AND product_id = ?";
        List<Stock> results = jdbcTemplate.query(sql, rowMapper, warehouseId, productId);
        return results.stream().findFirst();
    }

    /**
     * Finds stock record with row-level lock (PESSIMISTIC WRITE / FOR UPDATE) for concurrency safety during reservation.
     */
    public Optional<Stock> findByWarehouseIdAndProductIdForUpdate(Long warehouseId, Long productId) {
        String sql = "SELECT id, warehouse_id, product_id, on_hand_amount, reserved_amount FROM stock WHERE warehouse_id = ? AND product_id = ? FOR UPDATE";
        List<Stock> results = jdbcTemplate.query(sql, rowMapper, warehouseId, productId);
        return results.stream().findFirst();
    }

    public List<Stock> findByProductId(Long productId) {
        String sql = "SELECT id, warehouse_id, product_id, on_hand_amount, reserved_amount FROM stock WHERE product_id = ? ORDER BY warehouse_id";
        return jdbcTemplate.query(sql, rowMapper, productId);
    }

    public List<Stock> findByWarehouseId(Long warehouseId) {
        String sql = "SELECT id, warehouse_id, product_id, on_hand_amount, reserved_amount FROM stock WHERE warehouse_id = ? ORDER BY product_id";
        return jdbcTemplate.query(sql, rowMapper, warehouseId);
    }

    public List<Stock> findAll() {
        String sql = "SELECT id, warehouse_id, product_id, on_hand_amount, reserved_amount FROM stock ORDER BY id";
        return jdbcTemplate.query(sql, rowMapper);
    }

    public void deleteById(Long id) {
        String sql = "DELETE FROM stock WHERE id = ?";
        jdbcTemplate.update(sql, id);
    }

    public static class StockRowMapper implements RowMapper<Stock> {
        @Override
        public Stock mapRow(ResultSet rs, int rowNum) throws SQLException {
            return new Stock(
                    rs.getLong("id"),
                    rs.getLong("warehouse_id"),
                    rs.getLong("product_id"),
                    rs.getInt("on_hand_amount"),
                    rs.getInt("reserved_amount")
            );
        }
    }
}
