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
 * Repository for CustomerRequest persistence operations using Spring JDBC.
 */
@Repository
public class CustomerRequestRepository {

    private final JdbcTemplate jdbcTemplate;
    private final RowMapper<CustomerRequest> rowMapper = new CustomerRequestRowMapper();

    public CustomerRequestRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     * Persists a CustomerRequest (inserts if id is null, updates if id is present).
     *
     * @param request CustomerRequest domain object
     * @return Saved CustomerRequest object with generated ID populated
     */
    public CustomerRequest save(CustomerRequest request) {
        Instant now = Instant.now();
        if (request.getCreatedAt() == null) {
            request.setCreatedAt(now);
        }
        request.setUpdatedAt(now);

        if (request.getId() == null) {
            String sql = "INSERT INTO customer_requests (customer_id, quotation_id, request_type, description, status, created_at, updated_at) " +
                         "VALUES (?, ?, ?, ?, ?, ?, ?)";
            KeyHolder keyHolder = new GeneratedKeyHolder();
            jdbcTemplate.update(connection -> {
                PreparedStatement ps = connection.prepareStatement(sql, new String[]{"id"});
                ps.setLong(1, request.getCustomerId());
                if (request.getQuotationId() != null) {
                    ps.setLong(2, request.getQuotationId());
                } else {
                    ps.setNull(2, java.sql.Types.BIGINT);
                }
                ps.setString(3, request.getRequestType());
                ps.setString(4, request.getDescription());
                ps.setString(5, request.getStatus());
                ps.setTimestamp(6, Timestamp.from(request.getCreatedAt()));
                ps.setTimestamp(7, Timestamp.from(request.getUpdatedAt()));
                return ps;
            }, keyHolder);

            Number key = keyHolder.getKey();
            if (key != null) {
                request.setId(key.longValue());
            }
            return request;
        } else {
            String sql = "UPDATE customer_requests SET customer_id = ?, quotation_id = ?, request_type = ?, description = ?, status = ?, updated_at = ? WHERE id = ?";
            jdbcTemplate.update(sql,
                    request.getCustomerId(),
                    request.getQuotationId(),
                    request.getRequestType(),
                    request.getDescription(),
                    request.getStatus(),
                    Timestamp.from(request.getUpdatedAt()),
                    request.getId());
            return request;
        }
    }

    /**
     * Finds a CustomerRequest by ID.
     */
    public Optional<CustomerRequest> findById(Long id) {
        String sql = "SELECT id, customer_id, quotation_id, request_type, description, status, created_at, updated_at " +
                     "FROM customer_requests WHERE id = ?";
        List<CustomerRequest> results = jdbcTemplate.query(sql, rowMapper, id);
        return results.stream().findFirst();
    }

    /**
     * Finds all CustomerRequests for a customer ID.
     */
    public List<CustomerRequest> findByCustomerId(Long customerId) {
        String sql = "SELECT id, customer_id, quotation_id, request_type, description, status, created_at, updated_at " +
                     "FROM customer_requests WHERE customer_id = ? ORDER BY id";
        return jdbcTemplate.query(sql, rowMapper, customerId);
    }

    /**
     * Finds all CustomerRequests for a quotation ID.
     */
    public List<CustomerRequest> findByQuotationId(Long quotationId) {
        String sql = "SELECT id, customer_id, quotation_id, request_type, description, status, created_at, updated_at " +
                     "FROM customer_requests WHERE quotation_id = ? ORDER BY id";
        return jdbcTemplate.query(sql, rowMapper, quotationId);
    }

    /**
     * Finds all CustomerRequests by status.
     */
    public List<CustomerRequest> findByStatus(String status) {
        String sql = "SELECT id, customer_id, quotation_id, request_type, description, status, created_at, updated_at " +
                     "FROM customer_requests WHERE status = ? ORDER BY id";
        return jdbcTemplate.query(sql, rowMapper, status);
    }

    /**
     * Retrieves all CustomerRequests.
     */
    public List<CustomerRequest> findAll() {
        String sql = "SELECT id, customer_id, quotation_id, request_type, description, status, created_at, updated_at " +
                     "FROM customer_requests ORDER BY id";
        return jdbcTemplate.query(sql, rowMapper);
    }

    /**
     * Checks if a CustomerRequest exists by ID.
     */
    public boolean existsById(Long id) {
        String sql = "SELECT COUNT(*) FROM customer_requests WHERE id = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, id);
        return count != null && count > 0;
    }

    /**
     * Deletes a CustomerRequest by ID.
     */
    public void deleteById(Long id) {
        String sql = "DELETE FROM customer_requests WHERE id = ?";
        jdbcTemplate.update(sql, id);
    }

    /**
     * RowMapper implementation for CustomerRequest entities.
     */
    public static class CustomerRequestRowMapper implements RowMapper<CustomerRequest> {
        @Override
        public CustomerRequest mapRow(ResultSet rs, int rowNum) throws SQLException {
            CustomerRequest request = new CustomerRequest();
            request.setId(rs.getLong("id"));
            request.setCustomerId(rs.getLong("customer_id"));
            long qId = rs.getLong("quotation_id");
            request.setQuotationId(rs.wasNull() ? null : qId);
            request.setRequestType(rs.getString("request_type"));
            request.setDescription(rs.getString("description"));
            request.setStatus(rs.getString("status"));
            Timestamp cat = rs.getTimestamp("created_at");
            request.setCreatedAt(cat != null ? cat.toInstant() : null);
            Timestamp uat = rs.getTimestamp("updated_at");
            request.setUpdatedAt(uat != null ? uat.toInstant() : null);
            return request;
        }
    }
}
