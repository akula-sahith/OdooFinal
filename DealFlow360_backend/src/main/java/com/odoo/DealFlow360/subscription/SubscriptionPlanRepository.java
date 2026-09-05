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
import java.util.List;
import java.util.Optional;

@Repository
public class SubscriptionPlanRepository {

    private final JdbcTemplate jdbcTemplate;
    private final RowMapper<SubscriptionPlan> rowMapper = new SubscriptionPlanRowMapper();

    public SubscriptionPlanRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public SubscriptionPlan save(SubscriptionPlan plan) {
        if (plan.getId() == null) {
            String sql = "INSERT INTO subscription_plans (product_id, name, billing_cycle, proration_rule, cancellation_refund_rule) " +
                         "VALUES (?, ?, ?, ?, ?)";
            KeyHolder keyHolder = new GeneratedKeyHolder();
            jdbcTemplate.update(connection -> {
                PreparedStatement ps = connection.prepareStatement(sql, new String[]{"id"});
                ps.setLong(1, plan.getProductId());
                ps.setString(2, plan.getName());
                ps.setString(3, plan.getBillingCycle() != null ? plan.getBillingCycle() : "MONTHLY");
                ps.setString(4, plan.getProrationRule() != null ? plan.getProrationRule() : "EXACT_DAY");
                ps.setString(5, plan.getCancellationRefundRule() != null ? plan.getCancellationRefundRule() : "PRO_RATA");
                return ps;
            }, keyHolder);

            Number key = keyHolder.getKey();
            if (key != null) {
                plan.setId(key.longValue());
            }
            return plan;
        } else {
            String sql = "UPDATE subscription_plans SET product_id = ?, name = ?, billing_cycle = ?, proration_rule = ?, cancellation_refund_rule = ? WHERE id = ?";
            jdbcTemplate.update(sql,
                    plan.getProductId(),
                    plan.getName(),
                    plan.getBillingCycle(),
                    plan.getProrationRule(),
                    plan.getCancellationRefundRule(),
                    plan.getId());
            return plan;
        }
    }

    public Optional<SubscriptionPlan> findById(Long id) {
        String sql = "SELECT id, product_id, name, billing_cycle, proration_rule, cancellation_refund_rule FROM subscription_plans WHERE id = ?";
        List<SubscriptionPlan> results = jdbcTemplate.query(sql, rowMapper, id);
        return results.stream().findFirst();
    }

    public List<SubscriptionPlan> findByProductId(Long productId) {
        String sql = "SELECT id, product_id, name, billing_cycle, proration_rule, cancellation_refund_rule FROM subscription_plans WHERE product_id = ? ORDER BY id";
        return jdbcTemplate.query(sql, rowMapper, productId);
    }

    public List<SubscriptionPlan> findAll() {
        String sql = "SELECT id, product_id, name, billing_cycle, proration_rule, cancellation_refund_rule FROM subscription_plans ORDER BY id";
        return jdbcTemplate.query(sql, rowMapper);
    }

    public void deleteById(Long id) {
        String sql = "DELETE FROM subscription_plans WHERE id = ?";
        jdbcTemplate.update(sql, id);
    }

    public static class SubscriptionPlanRowMapper implements RowMapper<SubscriptionPlan> {
        @Override
        public SubscriptionPlan mapRow(ResultSet rs, int rowNum) throws SQLException {
            return new SubscriptionPlan(
                    rs.getLong("id"),
                    rs.getLong("product_id"),
                    rs.getString("name"),
                    rs.getString("billing_cycle"),
                    rs.getString("proration_rule"),
                    rs.getString("cancellation_refund_rule")
            );
        }
    }
}
