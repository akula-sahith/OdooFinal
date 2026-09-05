package com.odoo.DealFlow360.customer;

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

class CustomerRequestRepositoryTest {

    private JdbcTemplate jdbcTemplate;
    private CustomerRequestRepository requestRepository;

    @BeforeEach
    void setUp() {
        jdbcTemplate = mock(JdbcTemplate.class);
        requestRepository = new CustomerRequestRepository(jdbcTemplate);
    }

    @Test
    @DisplayName("Should find request by id")
    void testFindById() {
        Instant now = Instant.now();
        CustomerRequest request = new CustomerRequest(1L, 10L, 100L, "REVISION", "Please lower price", "PENDING", now, now);

        String expectedSql = "SELECT id, customer_id, quotation_id, request_type, description, status, created_at, updated_at FROM customer_requests WHERE id = ?";
        when(jdbcTemplate.query(eq(expectedSql), any(CustomerRequestRepository.CustomerRequestRowMapper.class), eq(1L)))
                .thenReturn(Collections.singletonList(request));

        Optional<CustomerRequest> result = requestRepository.findById(1L);

        assertThat(result).isPresent();
        assertThat(result.get().getCustomerId()).isEqualTo(10L);
        assertThat(result.get().getRequestType()).isEqualTo("REVISION");
    }

    @Test
    @DisplayName("Should find requests by customer id")
    void testFindByCustomerId() {
        Instant now = Instant.now();
        CustomerRequest request = new CustomerRequest(1L, 10L, null, "INQUIRY", "Delivery details", "PENDING", now, now);

        String expectedSql = "SELECT id, customer_id, quotation_id, request_type, description, status, created_at, updated_at FROM customer_requests WHERE customer_id = ? ORDER BY id";
        when(jdbcTemplate.query(eq(expectedSql), any(CustomerRequestRepository.CustomerRequestRowMapper.class), eq(10L)))
                .thenReturn(List.of(request));

        List<CustomerRequest> results = requestRepository.findByCustomerId(10L);

        assertThat(results).hasSize(1);
        assertThat(results.get(0).getCustomerId()).isEqualTo(10L);
    }

    @Test
    @DisplayName("Should update request status")
    void testUpdateRequest() {
        Instant now = Instant.now();
        CustomerRequest request = new CustomerRequest(1L, 10L, 100L, "REVISION", "Please lower price", "FULFILLED", now, now);

        requestRepository.save(request);

        String expectedSql = "UPDATE customer_requests SET customer_id = ?, quotation_id = ?, request_type = ?, description = ?, status = ?, updated_at = ? WHERE id = ?";
        verify(jdbcTemplate).update(
                eq(expectedSql),
                eq(10L),
                eq(100L),
                eq("REVISION"),
                eq("Please lower price"),
                eq("FULFILLED"),
                any(),
                eq(1L)
        );
    }

    @Test
    @DisplayName("Should delete request by id")
    void testDeleteById() {
        requestRepository.deleteById(1L);
        verify(jdbcTemplate).update(eq("DELETE FROM customer_requests WHERE id = ?"), eq(1L));
    }
}
