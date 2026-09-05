package com.odoo.DealFlow360.fulfillment;

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

@Repository
public class OrderLineRepository {

    private final JdbcTemplate jdbcTemplate;
    private final RowMapper<OrderLine> rowMapper = new OrderLineRowMapper();

    public OrderLineRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public OrderLine save(OrderLine line) {
        if (line.getId() == null) {
            String sql = "INSERT INTO order_lines (order_id, product_id, product_variant_id, quantity, unit_price, tax_percent, subtotal_amount, tax_amount, total_amount, is_subscription) " +
                         "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            KeyHolder keyHolder = new GeneratedKeyHolder();
            jdbcTemplate.update(connection -> {
                PreparedStatement ps = connection.prepareStatement(sql, new String[]{"id"});
                ps.setLong(1, line.getOrderId());
                ps.setLong(2, line.getProductId());
                if (line.getProductVariantId() != null) {
                    ps.setLong(3, line.getProductVariantId());
                } else {
                    ps.setNull(3, java.sql.Types.BIGINT);
                }
                ps.setInt(4, line.getQuantity() != null ? line.getQuantity() : 1);
                ps.setBigDecimal(5, line.getUnitPrice());
                ps.setBigDecimal(6, line.getTaxPercent() != null ? line.getTaxPercent() : BigDecimal.ZERO);
                ps.setBigDecimal(7, line.getSubtotalAmount() != null ? line.getSubtotalAmount() : BigDecimal.ZERO);
                ps.setBigDecimal(8, line.getTaxAmount() != null ? line.getTaxAmount() : BigDecimal.ZERO);
                ps.setBigDecimal(9, line.getTotalAmount() != null ? line.getTotalAmount() : BigDecimal.ZERO);
                ps.setBoolean(10, line.getIsSubscription() != null ? line.getIsSubscription() : false);
                return ps;
            }, keyHolder);

            Number key = keyHolder.getKey();
            if (key != null) {
                line.setId(key.longValue());
            }
            return line;
        } else {
            String sql = "UPDATE order_lines SET order_id = ?, product_id = ?, product_variant_id = ?, quantity = ?, unit_price = ?, tax_percent = ?, subtotal_amount = ?, tax_amount = ?, total_amount = ?, is_subscription = ? WHERE id = ?";
            jdbcTemplate.update(sql,
                    line.getOrderId(),
                    line.getProductId(),
                    line.getProductVariantId(),
                    line.getQuantity(),
                    line.getUnitPrice(),
                    line.getTaxPercent(),
                    line.getSubtotalAmount(),
                    line.getTaxAmount(),
                    line.getTotalAmount(),
                    line.getIsSubscription(),
                    line.getId());
            return line;
        }
    }

    public Optional<OrderLine> findById(Long id) {
        String sql = "SELECT id, order_id, product_id, product_variant_id, quantity, unit_price, tax_percent, subtotal_amount, tax_amount, total_amount, is_subscription FROM order_lines WHERE id = ?";
        List<OrderLine> results = jdbcTemplate.query(sql, rowMapper, id);
        return results.stream().findFirst();
    }

    public List<OrderLine> findByOrderId(Long orderId) {
        String sql = "SELECT id, order_id, product_id, product_variant_id, quantity, unit_price, tax_percent, subtotal_amount, tax_amount, total_amount, is_subscription FROM order_lines WHERE order_id = ? ORDER BY id";
        return jdbcTemplate.query(sql, rowMapper, orderId);
    }

    public void deleteById(Long id) {
        String sql = "DELETE FROM order_lines WHERE id = ?";
        jdbcTemplate.update(sql, id);
    }

    public static class OrderLineRowMapper implements RowMapper<OrderLine> {
        @Override
        public OrderLine mapRow(ResultSet rs, int rowNum) throws SQLException {
            OrderLine line = new OrderLine();
            line.setId(rs.getLong("id"));
            line.setOrderId(rs.getLong("order_id"));
            line.setProductId(rs.getLong("product_id"));
            long pvId = rs.getLong("product_variant_id");
            line.setProductVariantId(rs.wasNull() ? null : pvId);
            line.setQuantity(rs.getInt("quantity"));
            line.setUnitPrice(rs.getBigDecimal("unit_price"));
            line.setTaxPercent(rs.getBigDecimal("tax_percent"));
            line.setSubtotalAmount(rs.getBigDecimal("subtotal_amount"));
            line.setTaxAmount(rs.getBigDecimal("tax_amount"));
            line.setTotalAmount(rs.getBigDecimal("total_amount"));
            line.setIsSubscription(rs.getBoolean("is_subscription"));
            return line;
        }
    }
}
