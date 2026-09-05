package com.odoo.DealFlow360.negotiation;

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
 * Repository for NegotiationRequest persistence operations using Spring JDBC.
 */
@Repository
public class NegotiationRequestRepository {

    private final JdbcTemplate jdbcTemplate;
    private final RowMapper<NegotiationRequest> rowMapper = new NegotiationRequestRowMapper();

    public NegotiationRequestRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     * Persists a NegotiationRequest (inserts if id is null, updates if id is present).
     *
     * @param request NegotiationRequest domain object
     * @return Saved NegotiationRequest object with generated ID populated
     */
    public NegotiationRequest save(NegotiationRequest request) {
        Instant now = Instant.now();
        if (request.getCreatedAt() == null) {
            request.setCreatedAt(now);
        }
        request.setUpdatedAt(now);

        if (request.getId() == null) {
            String sql = "INSERT INTO negotiation_requests (customer_id, quotation_id, request_type, description, status, counter_discount_percent, line_comments, proposed_unit_price, created_at, updated_at) " +
                         "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
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
                ps.setBigDecimal(6, request.getCounterDiscountPercent());
                ps.setString(7, request.getLineComments());
                ps.setBigDecimal(8, request.getProposedUnitPrice());
                ps.setTimestamp(9, Timestamp.from(request.getCreatedAt()));
                ps.setTimestamp(10, Timestamp.from(request.getUpdatedAt()));
                return ps;
            }, keyHolder);

            Number key = keyHolder.getKey();
            if (key != null) {
                request.setId(key.longValue());
            }
            return request;
        } else {
            return update(request);
        }
    }

    /**
     * Updates an existing NegotiationRequest record.
     *
     * @param request NegotiationRequest domain object
     * @return Updated NegotiationRequest object
     */
    public NegotiationRequest update(NegotiationRequest request) {
        if (request.getUpdatedAt() == null) {
            request.setUpdatedAt(Instant.now());
        }
        String sql = "UPDATE negotiation_requests SET customer_id = ?, quotation_id = ?, request_type = ?, description = ?, status = ?, counter_discount_percent = ?, line_comments = ?, proposed_unit_price = ?, updated_at = ? WHERE id = ?";
        jdbcTemplate.update(sql,
                request.getCustomerId(),
                request.getQuotationId(),
                request.getRequestType(),
                request.getDescription(),
                request.getStatus(),
                request.getCounterDiscountPercent(),
                request.getLineComments(),
                request.getProposedUnitPrice(),
                Timestamp.from(request.getUpdatedAt()),
                request.getId());
        return request;
    }

    private static final String SELECT_COLS = "SELECT id, customer_id, quotation_id, request_type, description, status, counter_discount_percent, line_comments, proposed_unit_price, created_at, updated_at FROM negotiation_requests ";

    /**
     * Finds a NegotiationRequest by ID.
     */
    public Optional<NegotiationRequest> findById(Long id) {
        String sql = SELECT_COLS + "WHERE id = ?";
        List<NegotiationRequest> results = jdbcTemplate.query(sql, rowMapper, id);
        return results.stream().findFirst();
    }

    /**
     * Finds all NegotiationRequests for a customer ID.
     */
    public List<NegotiationRequest> findByCustomerId(Long customerId) {
        String sql = SELECT_COLS + "WHERE customer_id = ? ORDER BY id";
        return jdbcTemplate.query(sql, rowMapper, customerId);
    }

    /**
     * Finds all NegotiationRequests for a quotation ID.
     */
    public List<NegotiationRequest> findByQuotationId(Long quotationId) {
        String sql = SELECT_COLS + "WHERE quotation_id = ? ORDER BY id";
        return jdbcTemplate.query(sql, rowMapper, quotationId);
    }

    /**
     * Finds all NegotiationRequests by status.
     */
    public List<NegotiationRequest> findByStatus(String status) {
        String sql = SELECT_COLS + "WHERE status = ? ORDER BY id";
        return jdbcTemplate.query(sql, rowMapper, status);
    }

    /**
     * Retrieves all NegotiationRequests.
     */
    public List<NegotiationRequest> findAll() {
        String sql = SELECT_COLS + "ORDER BY id";
        return jdbcTemplate.query(sql, rowMapper);
    }

    /**
     * Checks if a NegotiationRequest exists by ID.
     */
    public boolean existsById(Long id) {
        String sql = "SELECT COUNT(*) FROM negotiation_requests WHERE id = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, id);
        return count != null && count > 0;
    }

    /**
     * Deletes a NegotiationRequest by ID.
     */
    public void deleteById(Long id) {
        String sql = "DELETE FROM negotiation_requests WHERE id = ?";
        jdbcTemplate.update(sql, id);
    }

    /**
     * RowMapper implementation for NegotiationRequest entities.
     */
    public static class NegotiationRequestRowMapper implements RowMapper<NegotiationRequest> {
        @Override
        public NegotiationRequest mapRow(ResultSet rs, int rowNum) throws SQLException {
            NegotiationRequest request = new NegotiationRequest();
            request.setId(rs.getLong("id"));
            request.setCustomerId(rs.getLong("customer_id"));
            long qId = rs.getLong("quotation_id");
            request.setQuotationId(rs.wasNull() ? null : qId);
            request.setRequestType(rs.getString("request_type"));
            request.setDescription(rs.getString("description"));
            request.setStatus(rs.getString("status"));
            request.setCounterDiscountPercent(rs.getBigDecimal("counter_discount_percent"));
            request.setLineComments(rs.getString("line_comments"));
            request.setProposedUnitPrice(rs.getBigDecimal("proposed_unit_price"));
            Timestamp cat = rs.getTimestamp("created_at");
            request.setCreatedAt(cat != null ? cat.toInstant() : null);
            Timestamp uat = rs.getTimestamp("updated_at");
            request.setUpdatedAt(uat != null ? uat.toInstant() : null);
            return request;
        }
    }
}
