package com.odoo.DealFlow360.customer;

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

/**
 * Repository for Customer persistence operations using Spring JDBC.
 */
@Repository
public class CustomerRepository {

    private final JdbcTemplate jdbcTemplate;
    private final RowMapper<Customer> rowMapper = new CustomerRowMapper();

    public CustomerRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     * Persists a Customer (inserts if id is null, updates if id is present).
     *
     * @param customer Customer domain object
     * @return Saved Customer object with generated ID populated
     */
    public Customer save(Customer customer) {
        if (customer.getCreatedAt() == null) {
            customer.setCreatedAt(Instant.now());
        }
        if (customer.getId() == null) {
            String sql = "INSERT INTO customers (company_name, sales_team_id, discount_tier_id, portal_email, portal_password_hash, created_at) VALUES (?, ?, ?, ?, ?, ?)";
            KeyHolder keyHolder = new GeneratedKeyHolder();
            jdbcTemplate.update(connection -> {
                PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
                ps.setString(1, customer.getCompanyName());
                if (customer.getSalesTeamId() != null) {
                    ps.setLong(2, customer.getSalesTeamId());
                } else {
                    ps.setNull(2, java.sql.Types.BIGINT);
                }
                if (customer.getDiscountTierId() != null) {
                    ps.setLong(3, customer.getDiscountTierId());
                } else {
                    ps.setNull(3, java.sql.Types.BIGINT);
                }
                ps.setString(4, customer.getPortalEmail());
                ps.setString(5, customer.getPortalPasswordHash());
                ps.setTimestamp(6, Timestamp.from(customer.getCreatedAt()));
                return ps;
            }, keyHolder);

            Number key = keyHolder.getKey();
            if (key != null) {
                customer.setId(key.longValue());
            }
            return customer;
        } else {
            String sql = "UPDATE customers SET company_name = ?, sales_team_id = ?, discount_tier_id = ?, portal_email = ?, portal_password_hash = ? WHERE id = ?";
            jdbcTemplate.update(sql,
                    customer.getCompanyName(),
                    customer.getSalesTeamId(),
                    customer.getDiscountTierId(),
                    customer.getPortalEmail(),
                    customer.getPortalPasswordHash(),
                    customer.getId());
            return customer;
        }
    }

    /**
     * Finds a Customer by ID.
     */
    public Optional<Customer> findById(Long id) {
        String sql = "SELECT id, company_name, sales_team_id, discount_tier_id, portal_email, portal_password_hash, created_at FROM customers WHERE id = ?";
        List<Customer> results = jdbcTemplate.query(sql, rowMapper, id);
        return results.stream().findFirst();
    }

    /**
     * Finds all Customers belonging to a specific Sales Team.
     */
    public List<Customer> findBySalesTeamId(Long salesTeamId) {
        String sql = "SELECT id, company_name, sales_team_id, discount_tier_id, portal_email, portal_password_hash, created_at FROM customers WHERE sales_team_id = ? ORDER BY id";
        return jdbcTemplate.query(sql, rowMapper, salesTeamId);
    }

    /**
     * Checks if a Customer exists by ID.
     */
    public boolean existsById(Long id) {
        String sql = "SELECT COUNT(*) FROM customers WHERE id = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, id);
        return count != null && count > 0;
    }

    /**
     * Retrieves all Customers.
     */
    public List<Customer> findAll() {
        String sql = "SELECT id, company_name, sales_team_id, discount_tier_id, portal_email, portal_password_hash, created_at FROM customers ORDER BY id";
        return jdbcTemplate.query(sql, rowMapper);
    }

    /**
     * Deletes a Customer by ID.
     */
    public void deleteById(Long id) {
        String sql = "DELETE FROM customers WHERE id = ?";
        jdbcTemplate.update(sql, id);
    }

    /**
     * RowMapper implementation for Customer entities.
     */
    public static class CustomerRowMapper implements RowMapper<Customer> {
        @Override
        public Customer mapRow(ResultSet rs, int rowNum) throws SQLException {
            Customer customer = new Customer();
            customer.setId(rs.getLong("id"));
            customer.setCompanyName(rs.getString("company_name"));
            long stId = rs.getLong("sales_team_id");
            customer.setSalesTeamId(rs.wasNull() ? null : stId);
            long dtId = rs.getLong("discount_tier_id");
            customer.setDiscountTierId(rs.wasNull() ? null : dtId);
            customer.setPortalEmail(rs.getString("portal_email"));
            customer.setPortalPasswordHash(rs.getString("portal_password_hash"));
            Timestamp ts = rs.getTimestamp("created_at");
            customer.setCreatedAt(ts != null ? ts.toInstant() : null);
            return customer;
        }
    }
}
