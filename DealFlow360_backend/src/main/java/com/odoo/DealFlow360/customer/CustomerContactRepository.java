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
import java.util.List;
import java.util.Optional;

/**
 * Repository for CustomerContact persistence operations using Spring JDBC.
 */
@Repository
public class CustomerContactRepository {

    private final JdbcTemplate jdbcTemplate;
    private final RowMapper<CustomerContact> rowMapper = new CustomerContactRowMapper();

    public CustomerContactRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     * Persists a CustomerContact (inserts if id is null, updates if id is present).
     *
     * @param contact CustomerContact domain object
     * @return Saved CustomerContact object with generated ID populated
     */
    public CustomerContact save(CustomerContact contact) {
        if (contact.getStatus() == null || contact.getStatus().trim().isEmpty()) {
            contact.setStatus("ACTIVE");
        }
        if (contact.getId() == null) {
            String sql = "INSERT INTO customer_contacts (customer_id, name, email, phone, status) VALUES (?, ?, ?, ?, ?)";
            KeyHolder keyHolder = new GeneratedKeyHolder();
            jdbcTemplate.update(connection -> {
                PreparedStatement ps = connection.prepareStatement(sql, new String[]{"id"});
                ps.setLong(1, contact.getCustomerId());
                ps.setString(2, contact.getName());
                ps.setString(3, contact.getEmail());
                ps.setString(4, contact.getPhone());
                ps.setString(5, contact.getStatus());
                return ps;
            }, keyHolder);

            Number key = keyHolder.getKey();
            if (key != null) {
                contact.setId(key.longValue());
            }
            return contact;
        } else {
            String sql = "UPDATE customer_contacts SET customer_id = ?, name = ?, email = ?, phone = ?, status = ? WHERE id = ?";
            jdbcTemplate.update(sql,
                    contact.getCustomerId(),
                    contact.getName(),
                    contact.getEmail(),
                    contact.getPhone(),
                    contact.getStatus(),
                    contact.getId());
            return contact;
        }
    }

    /**
     * Finds a CustomerContact by ID.
     */
    public Optional<CustomerContact> findById(Long id) {
        String sql = "SELECT id, customer_id, name, email, phone, status FROM customer_contacts WHERE id = ?";
        List<CustomerContact> results = jdbcTemplate.query(sql, rowMapper, id);
        return results.stream().findFirst();
    }

    /**
     * Finds all CustomerContacts belonging to a specific Customer.
     */
    public List<CustomerContact> findByCustomerId(Long customerId) {
        String sql = "SELECT id, customer_id, name, email, phone, status FROM customer_contacts WHERE customer_id = ? ORDER BY id";
        return jdbcTemplate.query(sql, rowMapper, customerId);
    }

    /**
     * Checks if a CustomerContact exists by ID.
     */
    public boolean existsById(Long id) {
        String sql = "SELECT COUNT(*) FROM customer_contacts WHERE id = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, id);
        return count != null && count > 0;
    }

    /**
     * Retrieves all CustomerContacts.
     */
    public List<CustomerContact> findAll() {
        String sql = "SELECT id, customer_id, name, email, phone, status FROM customer_contacts ORDER BY id";
        return jdbcTemplate.query(sql, rowMapper);
    }

    /**
     * Deletes a CustomerContact by ID.
     */
    public void deleteById(Long id) {
        String sql = "DELETE FROM customer_contacts WHERE id = ?";
        jdbcTemplate.update(sql, id);
    }

    /**
     * RowMapper implementation for CustomerContact entities.
     */
    public static class CustomerContactRowMapper implements RowMapper<CustomerContact> {
        @Override
        public CustomerContact mapRow(ResultSet rs, int rowNum) throws SQLException {
            CustomerContact contact = new CustomerContact();
            contact.setId(rs.getLong("id"));
            contact.setCustomerId(rs.getLong("customer_id"));
            contact.setName(rs.getString("name"));
            contact.setEmail(rs.getString("email"));
            contact.setPhone(rs.getString("phone"));
            contact.setStatus(rs.getString("status"));
            return contact;
        }
    }
}
