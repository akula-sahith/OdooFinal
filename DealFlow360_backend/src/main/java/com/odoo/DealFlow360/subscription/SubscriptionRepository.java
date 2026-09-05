package com.odoo.DealFlow360.subscription;

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
public class SubscriptionRepository {

    private final JdbcTemplate jdbcTemplate;
    private final RowMapper<Subscription> rowMapper = new SubscriptionRowMapper();

    public SubscriptionRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public Subscription save(Subscription sub) {
        Instant now = Instant.now();
        if (sub.getCreatedAt() == null) {
            sub.setCreatedAt(now);
        }

        if (sub.getId() == null) {
            String sql = "INSERT INTO subscriptions (order_id, customer_id, plan_id, status, current_period_start, current_period_end, cancel_at_period_end, created_at) " +
                         "VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
            KeyHolder keyHolder = new GeneratedKeyHolder();
            jdbcTemplate.update(connection -> {
                PreparedStatement ps = connection.prepareStatement(sql, new String[]{"id"});
                if (sub.getOrderId() != null) {
                    ps.setLong(1, sub.getOrderId());
                } else {
                    ps.setNull(1, java.sql.Types.BIGINT);
                }
                ps.setLong(2, sub.getCustomerId());
                ps.setLong(3, sub.getPlanId());
                ps.setString(4, sub.getStatus() != null ? sub.getStatus() : "ACTIVE");
                ps.setTimestamp(5, Timestamp.from(sub.getCurrentPeriodStart()));
                ps.setTimestamp(6, Timestamp.from(sub.getCurrentPeriodEnd()));
                ps.setBoolean(7, sub.getCancelAtPeriodEnd() != null ? sub.getCancelAtPeriodEnd() : false);
                ps.setTimestamp(8, Timestamp.from(sub.getCreatedAt()));
                return ps;
            }, keyHolder);

            Number key = keyHolder.getKey();
            if (key != null) {
                sub.setId(key.longValue());
            }
            return sub;
        } else {
            String sql = "UPDATE subscriptions SET order_id = ?, customer_id = ?, plan_id = ?, status = ?, current_period_start = ?, current_period_end = ?, cancel_at_period_end = ? WHERE id = ?";
            jdbcTemplate.update(sql,
                    sub.getOrderId(),
                    sub.getCustomerId(),
                    sub.getPlanId(),
                    sub.getStatus(),
                    Timestamp.from(sub.getCurrentPeriodStart()),
                    Timestamp.from(sub.getCurrentPeriodEnd()),
                    sub.getCancelAtPeriodEnd(),
                    sub.getId());
            return sub;
        }
    }

    public Optional<Subscription> findById(Long id) {
        String sql = "SELECT id, order_id, customer_id, plan_id, status, current_period_start, current_period_end, cancel_at_period_end, created_at FROM subscriptions WHERE id = ?";
        List<Subscription> results = jdbcTemplate.query(sql, rowMapper, id);
        return results.stream().findFirst();
    }

    public List<Subscription> findByCustomerId(Long customerId) {
        String sql = "SELECT id, order_id, customer_id, plan_id, status, current_period_start, current_period_end, cancel_at_period_end, created_at FROM subscriptions WHERE customer_id = ? ORDER BY id DESC";
        return jdbcTemplate.query(sql, rowMapper, customerId);
    }

    public List<Subscription> findByOrderId(Long orderId) {
        String sql = "SELECT id, order_id, customer_id, plan_id, status, current_period_start, current_period_end, cancel_at_period_end, created_at FROM subscriptions WHERE order_id = ? ORDER BY id";
        return jdbcTemplate.query(sql, rowMapper, orderId);
    }

    public List<Subscription> findAll() {
        String sql = "SELECT id, order_id, customer_id, plan_id, status, current_period_start, current_period_end, cancel_at_period_end, created_at FROM subscriptions ORDER BY id DESC";
        return jdbcTemplate.query(sql, rowMapper);
    }

    public void deleteById(Long id) {
        String sql = "DELETE FROM subscriptions WHERE id = ?";
        jdbcTemplate.update(sql, id);
    }

    public static class SubscriptionRowMapper implements RowMapper<Subscription> {
        @Override
        public Subscription mapRow(ResultSet rs, int rowNum) throws SQLException {
            Subscription sub = new Subscription();
            sub.setId(rs.getLong("id"));
            long oId = rs.getLong("order_id");
            sub.setOrderId(rs.wasNull() ? null : oId);
            sub.setCustomerId(rs.getLong("customer_id"));
            sub.setPlanId(rs.getLong("plan_id"));
            sub.setStatus(rs.getString("status"));
            Timestamp cps = rs.getTimestamp("current_period_start");
            sub.setCurrentPeriodStart(cps != null ? cps.toInstant() : null);
            Timestamp cpe = rs.getTimestamp("current_period_end");
            sub.setCurrentPeriodEnd(cpe != null ? cpe.toInstant() : null);
            sub.setCancelAtPeriodEnd(rs.getBoolean("cancel_at_period_end"));
            Timestamp ca = rs.getTimestamp("created_at");
            sub.setCreatedAt(ca != null ? ca.toInstant() : null);
            return sub;
        }
    }
}
