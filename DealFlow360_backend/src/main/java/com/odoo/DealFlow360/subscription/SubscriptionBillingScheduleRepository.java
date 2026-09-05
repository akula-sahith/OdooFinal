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
import java.util.List;
import java.util.Optional;

@Repository
public class SubscriptionBillingScheduleRepository {

    private final JdbcTemplate jdbcTemplate;
    private final RowMapper<SubscriptionBillingSchedule> rowMapper = new SubscriptionBillingScheduleRowMapper();

    public SubscriptionBillingScheduleRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public SubscriptionBillingSchedule save(SubscriptionBillingSchedule schedule) {
        if (schedule.getId() == null) {
            String sql = "INSERT INTO subscription_billing_schedule (subscription_id, billing_date, amount, status) " +
                         "VALUES (?, ?, ?, ?)";
            KeyHolder keyHolder = new GeneratedKeyHolder();
            jdbcTemplate.update(connection -> {
                PreparedStatement ps = connection.prepareStatement(sql, new String[]{"id"});
                ps.setLong(1, schedule.getSubscriptionId());
                ps.setTimestamp(2, Timestamp.from(schedule.getBillingDate()));
                ps.setBigDecimal(3, schedule.getAmount());
                ps.setString(4, schedule.getStatus() != null ? schedule.getStatus() : "PENDING");
                return ps;
            }, keyHolder);

            Number key = keyHolder.getKey();
            if (key != null) {
                schedule.setId(key.longValue());
            }
            return schedule;
        } else {
            String sql = "UPDATE subscription_billing_schedule SET subscription_id = ?, billing_date = ?, amount = ?, status = ? WHERE id = ?";
            jdbcTemplate.update(sql,
                    schedule.getSubscriptionId(),
                    Timestamp.from(schedule.getBillingDate()),
                    schedule.getAmount(),
                    schedule.getStatus(),
                    schedule.getId());
            return schedule;
        }
    }

    public Optional<SubscriptionBillingSchedule> findById(Long id) {
        String sql = "SELECT id, subscription_id, billing_date, amount, status FROM subscription_billing_schedule WHERE id = ?";
        List<SubscriptionBillingSchedule> results = jdbcTemplate.query(sql, rowMapper, id);
        return results.stream().findFirst();
    }

    public List<SubscriptionBillingSchedule> findBySubscriptionId(Long subscriptionId) {
        String sql = "SELECT id, subscription_id, billing_date, amount, status FROM subscription_billing_schedule WHERE subscription_id = ? ORDER BY billing_date";
        return jdbcTemplate.query(sql, rowMapper, subscriptionId);
    }

    public void deleteById(Long id) {
        String sql = "DELETE FROM subscription_billing_schedule WHERE id = ?";
        jdbcTemplate.update(sql, id);
    }

    public static class SubscriptionBillingScheduleRowMapper implements RowMapper<SubscriptionBillingSchedule> {
        @Override
        public SubscriptionBillingSchedule mapRow(ResultSet rs, int rowNum) throws SQLException {
            SubscriptionBillingSchedule sched = new SubscriptionBillingSchedule();
            sched.setId(rs.getLong("id"));
            sched.setSubscriptionId(rs.getLong("subscription_id"));
            Timestamp bd = rs.getTimestamp("billing_date");
            sched.setBillingDate(bd != null ? bd.toInstant() : null);
            sched.setAmount(rs.getBigDecimal("amount"));
            sched.setStatus(rs.getString("status"));
            return sched;
        }
    }
}
