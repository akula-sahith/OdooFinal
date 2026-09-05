package com.odoo.DealFlow360.fulfillment;

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
public class FulfillmentSplitRepository {

    private final JdbcTemplate jdbcTemplate;
    private final RowMapper<FulfillmentSplit> rowMapper = new FulfillmentSplitRowMapper();

    public FulfillmentSplitRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public FulfillmentSplit save(FulfillmentSplit split) {
        if (split.getId() == null) {
            String sql = "INSERT INTO fulfillment_splits (fulfillment_order_id, order_line_id, warehouse_id, quantity_allocated, quantity_shipped, backorder_source) " +
                         "VALUES (?, ?, ?, ?, ?, ?)";
            KeyHolder keyHolder = new GeneratedKeyHolder();
            jdbcTemplate.update(connection -> {
                PreparedStatement ps = connection.prepareStatement(sql, new String[]{"id"});
                ps.setLong(1, split.getFulfillmentOrderId());
                ps.setLong(2, split.getOrderLineId());
                ps.setLong(3, split.getWarehouseId());
                ps.setInt(4, split.getQuantityAllocated() != null ? split.getQuantityAllocated() : 0);
                ps.setInt(5, split.getQuantityShipped() != null ? split.getQuantityShipped() : 0);
                ps.setString(6, split.getBackorderSource());
                return ps;
            }, keyHolder);

            Number key = keyHolder.getKey();
            if (key != null) {
                split.setId(key.longValue());
            }
            return split;
        } else {
            String sql = "UPDATE fulfillment_splits SET fulfillment_order_id = ?, order_line_id = ?, warehouse_id = ?, quantity_allocated = ?, quantity_shipped = ?, backorder_source = ? WHERE id = ?";
            jdbcTemplate.update(sql,
                    split.getFulfillmentOrderId(),
                    split.getOrderLineId(),
                    split.getWarehouseId(),
                    split.getQuantityAllocated(),
                    split.getQuantityShipped(),
                    split.getBackorderSource(),
                    split.getId());
            return split;
        }
    }

    public Optional<FulfillmentSplit> findById(Long id) {
        String sql = "SELECT id, fulfillment_order_id, order_line_id, warehouse_id, quantity_allocated, quantity_shipped, backorder_source FROM fulfillment_splits WHERE id = ?";
        List<FulfillmentSplit> results = jdbcTemplate.query(sql, rowMapper, id);
        return results.stream().findFirst();
    }

    public List<FulfillmentSplit> findByFulfillmentOrderId(Long fulfillmentOrderId) {
        String sql = "SELECT id, fulfillment_order_id, order_line_id, warehouse_id, quantity_allocated, quantity_shipped, backorder_source FROM fulfillment_splits WHERE fulfillment_order_id = ? ORDER BY id";
        return jdbcTemplate.query(sql, rowMapper, fulfillmentOrderId);
    }

    public List<FulfillmentSplit> findByWarehouseId(Long warehouseId) {
        String sql = "SELECT id, fulfillment_order_id, order_line_id, warehouse_id, quantity_allocated, quantity_shipped, backorder_source FROM fulfillment_splits WHERE warehouse_id = ? ORDER BY id";
        return jdbcTemplate.query(sql, rowMapper, warehouseId);
    }

    public void deleteById(Long id) {
        String sql = "DELETE FROM fulfillment_splits WHERE id = ?";
        jdbcTemplate.update(sql, id);
    }

    public static class FulfillmentSplitRowMapper implements RowMapper<FulfillmentSplit> {
        @Override
        public FulfillmentSplit mapRow(ResultSet rs, int rowNum) throws SQLException {
            FulfillmentSplit split = new FulfillmentSplit();
            split.setId(rs.getLong("id"));
            split.setFulfillmentOrderId(rs.getLong("fulfillment_order_id"));
            split.setOrderLineId(rs.getLong("order_line_id"));
            split.setWarehouseId(rs.getLong("warehouse_id"));
            split.setQuantityAllocated(rs.getInt("quantity_allocated"));
            split.setQuantityShipped(rs.getInt("quantity_shipped"));
            split.setBackorderSource(rs.getString("backorder_source"));
            return split;
        }
    }
}
