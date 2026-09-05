package com.odoo.DealFlow360.negotiation;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.jdbc.core.JdbcTemplate;

import java.time.Instant;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class NegotiationRequestRepositoryTest {

    private JdbcTemplate jdbcTemplate;
    private NegotiationRequestRepository repository;

    @BeforeEach
    void setUp() {
        jdbcTemplate = mock(JdbcTemplate.class);
        repository = new NegotiationRequestRepository(jdbcTemplate);
    }

    @Test
    @DisplayName("1 & 14. Should find negotiation request by id")
    void testFindById() {
        Instant now = Instant.now();
        NegotiationRequest request = new NegotiationRequest(1L, 100L, 50L, "DISCOUNT", "10% requested", "PENDING", now, now);
        String expectedSql = "SELECT id, customer_id, quotation_id, request_type, description, status, counter_discount_percent, line_comments, proposed_unit_price, created_at, updated_at FROM negotiation_requests WHERE id = ?";

        when(jdbcTemplate.query(eq(expectedSql), any(NegotiationRequestRepository.NegotiationRequestRowMapper.class), eq(1L)))
                .thenReturn(Collections.singletonList(request));

        Optional<NegotiationRequest> result = repository.findById(1L);

        assertThat(result).isPresent();
        assertThat(result.get().getCustomerId()).isEqualTo(100L);
        assertThat(result.get().getQuotationId()).isEqualTo(50L);
        assertThat(result.get().getRequestType()).isEqualTo("DISCOUNT");
        assertThat(result.get().getStatus()).isEqualTo("PENDING");
    }

    @Test
    @DisplayName("4. Should find negotiation requests by customer id")
    void testFindByCustomerId() {
        Instant now = Instant.now();
        NegotiationRequest r1 = new NegotiationRequest(1L, 100L, 50L, "DISCOUNT", "Desc", "PENDING", now, now);
        String expectedSql = "SELECT id, customer_id, quotation_id, request_type, description, status, counter_discount_percent, line_comments, proposed_unit_price, created_at, updated_at FROM negotiation_requests WHERE customer_id = ? ORDER BY id";

        when(jdbcTemplate.query(eq(expectedSql), any(NegotiationRequestRepository.NegotiationRequestRowMapper.class), eq(100L)))
                .thenReturn(List.of(r1));

        List<NegotiationRequest> results = repository.findByCustomerId(100L);

        assertThat(results).hasSize(1);
        assertThat(results.get(0).getCustomerId()).isEqualTo(100L);
    }

    @Test
    @DisplayName("5 & 10. Should find negotiation requests by quotation id supporting nullable quotationId")
    void testFindByQuotationId() {
        Instant now = Instant.now();
        NegotiationRequest r1 = new NegotiationRequest(1L, 100L, 50L, "TERMS", "Net 30", "PENDING", now, now);
        String expectedSql = "SELECT id, customer_id, quotation_id, request_type, description, status, counter_discount_percent, line_comments, proposed_unit_price, created_at, updated_at FROM negotiation_requests WHERE quotation_id = ? ORDER BY id";

        when(jdbcTemplate.query(eq(expectedSql), any(NegotiationRequestRepository.NegotiationRequestRowMapper.class), eq(50L)))
                .thenReturn(List.of(r1));

        List<NegotiationRequest> results = repository.findByQuotationId(50L);

        assertThat(results).hasSize(1);
        assertThat(results.get(0).getQuotationId()).isEqualTo(50L);
    }

    @Test
    @DisplayName("6 & 12. Should find negotiation requests by status")
    void testFindByStatus() {
        Instant now = Instant.now();
        NegotiationRequest r1 = new NegotiationRequest(1L, 100L, 50L, "DISCOUNT", "Desc", "PENDING", now, now);
        String expectedSql = "SELECT id, customer_id, quotation_id, request_type, description, status, counter_discount_percent, line_comments, proposed_unit_price, created_at, updated_at FROM negotiation_requests WHERE status = ? ORDER BY id";

        when(jdbcTemplate.query(eq(expectedSql), any(NegotiationRequestRepository.NegotiationRequestRowMapper.class), eq("PENDING")))
                .thenReturn(List.of(r1));

        List<NegotiationRequest> results = repository.findByStatus("PENDING");

        assertThat(results).hasSize(1);
        assertThat(results.get(0).getStatus()).isEqualTo("PENDING");
    }

    @Test
    @DisplayName("7. Should retrieve all negotiation requests")
    void testFindAll() {
        Instant now = Instant.now();
        NegotiationRequest r1 = new NegotiationRequest(1L, 100L, 50L, "DISCOUNT", "Desc1", "PENDING", now, now);
        NegotiationRequest r2 = new NegotiationRequest(2L, 200L, 60L, "TERMS", "Desc2", "APPROVED", now, now);
        String expectedSql = "SELECT id, customer_id, quotation_id, request_type, description, status, counter_discount_percent, line_comments, proposed_unit_price, created_at, updated_at FROM negotiation_requests ORDER BY id";

        when(jdbcTemplate.query(eq(expectedSql), any(NegotiationRequestRepository.NegotiationRequestRowMapper.class)))
                .thenReturn(List.of(r1, r2));

        List<NegotiationRequest> results = repository.findAll();

        assertThat(results).hasSize(2);
    }

    @Test
    @DisplayName("3. Should insert new negotiation request and populate timestamps")
    void testSaveNewNegotiationRequest() {
        NegotiationRequest request = new NegotiationRequest(null, 100L, 50L, "DISCOUNT", "Desc", "PENDING", null, null);

        when(jdbcTemplate.update(any(org.springframework.jdbc.core.PreparedStatementCreator.class), any(org.springframework.jdbc.support.KeyHolder.class)))
                .thenReturn(1);

        NegotiationRequest saved = repository.save(request);

        assertThat(saved.getCreatedAt()).isNotNull();
        assertThat(saved.getUpdatedAt()).isNotNull();
    }

    @Test
    @DisplayName("2. Should update existing negotiation request")
    void testUpdateNegotiationRequest() {
        Instant now = Instant.now();
        NegotiationRequest request = new NegotiationRequest(1L, 100L, 50L, "DISCOUNT", "Updated desc", "APPROVED", now, now);

        repository.save(request);

        String expectedSql = "UPDATE negotiation_requests SET customer_id = ?, quotation_id = ?, request_type = ?, description = ?, status = ?, counter_discount_percent = ?, line_comments = ?, proposed_unit_price = ?, updated_at = ? WHERE id = ?";
        verify(jdbcTemplate).update(
                eq(expectedSql),
                eq(100L),
                eq(50L),
                eq("DISCOUNT"),
                eq("Updated desc"),
                eq("APPROVED"),
                eq(null),
                eq(null),
                eq(null),
                any(),
                eq(1L)
        );
    }

    @Test
    @DisplayName("8. Should check existence by id")
    void testExistsById() {
        when(jdbcTemplate.queryForObject(eq("SELECT COUNT(*) FROM negotiation_requests WHERE id = ?"), eq(Integer.class), eq(10L)))
                .thenReturn(1);

        assertThat(repository.existsById(10L)).isTrue();
    }

    @Test
    @DisplayName("9. Should delete negotiation request by id")
    void testDeleteById() {
        repository.deleteById(15L);
        verify(jdbcTemplate).update(eq("DELETE FROM negotiation_requests WHERE id = ?"), eq(15L));
    }
}
