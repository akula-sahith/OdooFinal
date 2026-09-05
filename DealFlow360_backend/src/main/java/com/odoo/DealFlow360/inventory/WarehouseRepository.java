package com.odoo.DealFlow360.inventory;

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
public class WarehouseRepository {

    private final JdbcTemplate jdbcTemplate;
    private final RowMapper<Warehouse> rowMapper = new WarehouseRowMapper();

    public WarehouseRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public Warehouse save(Warehouse warehouse) {
        if (warehouse.getId() == null) {
            String sql = "INSERT INTO warehouses (name, location, shipping_weight_factor) VALUES (?, ?, ?)";
            KeyHolder keyHolder = new GeneratedKeyHolder();
            jdbcTemplate.update(connection -> {
                PreparedStatement ps = connection.prepareStatement(sql, new String[]{"id"});
                ps.setString(1, warehouse.getName());
                ps.setString(2, warehouse.getLocation());
                ps.setBigDecimal(3, warehouse.getShippingWeightFactor() != null ? warehouse.getShippingWeightFactor() : BigDecimal.ONE);
                return ps;
            }, keyHolder);

            Number key = keyHolder.getKey();
            if (key != null) {
                warehouse.setId(key.longValue());
            }
            return warehouse;
        } else {
            String sql = "UPDATE warehouses SET name = ?, location = ?, shipping_weight_factor = ? WHERE id = ?";
            jdbcTemplate.update(sql, warehouse.getName(), warehouse.getLocation(),
                    warehouse.getShippingWeightFactor() != null ? warehouse.getShippingWeightFactor() : BigDecimal.ONE,
                    warehouse.getId());
            return warehouse;
        }
    }

    public Optional<Warehouse> findById(Long id) {
        String sql = "SELECT id, name, location, shipping_weight_factor FROM warehouses WHERE id = ?";
        List<Warehouse> results = jdbcTemplate.query(sql, rowMapper, id);
        return results.stream().findFirst();
    }

    public List<Warehouse> findAll() {
        String sql = "SELECT id, name, location, shipping_weight_factor FROM warehouses ORDER BY id";
        return jdbcTemplate.query(sql, rowMapper);
    }

    public void deleteById(Long id) {
        String sql = "DELETE FROM warehouses WHERE id = ?";
        jdbcTemplate.update(sql, id);
    }

    public static class WarehouseRowMapper implements RowMapper<Warehouse> {
        @Override
        public Warehouse mapRow(ResultSet rs, int rowNum) throws SQLException {
            return new Warehouse(
                    rs.getLong("id"),
                    rs.getString("name"),
                    rs.getString("location"),
                    rs.getBigDecimal("shipping_weight_factor")
            );
        }
    }
}
