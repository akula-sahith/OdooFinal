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
import java.sql.Timestamp;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Repository
public class FulfillmentOrderRepository {

    private final JdbcTemplate jdbcTemplate;
    private final RowMapper<FulfillmentOrder> rowMapper = new FulfillmentOrderRowMapper();

    public FulfillmentOrderRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public FulfillmentOrder save(FulfillmentOrder fo) {
        Instant now = Instant.now();
        if (fo.getCreatedAt() == null) {
            fo.setCreatedAt(now);
        }

        if (fo.getId() == null) {
            String sql = "INSERT INTO fulfillment_orders (order_id, status, created_at, shipped_at) VALUES (?, ?, ?, ?)";
            KeyHolder keyHolder = new GeneratedKeyHolder();
            jdbcTemplate.update(connection -> {
                PreparedStatement ps = connection.prepareStatement(sql, new String[]{"id"});
                ps.setLong(1, fo.getOrderId());
                ps.setString(2, fo.getStatus());
                ps.setTimestamp(3, Timestamp.from(fo.getCreatedAt()));
                if (fo.getShippedAt() != null) {
                    ps.setTimestamp(4, Timestamp.from(fo.getShippedAt()));
                } else {
                    ps.setNull(4, java.sql.Types.TIMESTAMP);
                }
                return ps;
            }, keyHolder);

            Number key = keyHolder.getKey();
            if (key != null) {
                fo.setId(key.longValue());
            }
            return fo;
        } else {
            String sql = "UPDATE fulfillment_orders SET order_id = ?, status = ?, shipped_at = ? WHERE id = ?";
            jdbcTemplate.update(sql,
                    fo.getOrderId(),
                    fo.getStatus(),
                    fo.getShippedAt() != null ? Timestamp.from(fo.getShippedAt()) : null,
                    fo.getId());
            return fo;
        }
    }

    public Optional<FulfillmentOrder> findById(Long id) {
        String sql = "SELECT id, order_id, status, created_at, shipped_at FROM fulfillment_orders WHERE id = ?";
        List<FulfillmentOrder> results = jdbcTemplate.query(sql, rowMapper, id);
        return results.stream().findFirst();
    }

    public List<FulfillmentOrder> findByOrderId(Long orderId) {
        String sql = "SELECT id, order_id, status, created_at, shipped_at FROM fulfillment_orders WHERE order_id = ? ORDER BY id";
        return jdbcTemplate.query(sql, rowMapper, orderId);
    }

    public List<FulfillmentOrder> findAll() {
        String sql = "SELECT id, order_id, status, created_at, shipped_at FROM fulfillment_orders ORDER BY id DESC";
        return jdbcTemplate.query(sql, rowMapper);
    }

    public void deleteById(Long id) {
        String sql = "DELETE FROM fulfillment_orders WHERE id = ?";
        jdbcTemplate.update(sql, id);
    }

    public static class FulfillmentOrderRowMapper implements RowMapper<FulfillmentOrder> {
        @Override
        public FulfillmentOrder mapRow(ResultSet rs, int rowNum) throws SQLException {
            FulfillmentOrder fo = new FulfillmentOrder();
            fo.setId(rs.getLong("id"));
            fo.setOrderId(rs.getLong("order_id"));
            fo.setStatus(rs.getString("status"));
            Timestamp ca = rs.getTimestamp("created_at");
            fo.setCreatedAt(ca != null ? ca.toInstant() : null);
            Timestamp sa = rs.getTimestamp("shipped_at");
            fo.setShippedAt(sa != null ? sa.toInstant() : null);
            return fo;
        }
    }
}
