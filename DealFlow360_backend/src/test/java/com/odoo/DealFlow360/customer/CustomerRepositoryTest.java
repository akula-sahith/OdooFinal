package com.odoo.DealFlow360.customer;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.jdbc.core.JdbcTemplate;

import java.time.Instant;
import java.util.Collections;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class CustomerRepositoryTest {

    private JdbcTemplate jdbcTemplate;
    private CustomerRepository customerRepository;

    @BeforeEach
    void setUp() {
        jdbcTemplate = mock(JdbcTemplate.class);
        customerRepository = new CustomerRepository(jdbcTemplate);
    }

    @Test
    @DisplayName("Should find customer by id")
    void testFindById() {
        Customer customer = new Customer(1L, "Acme Corp", 10L, 2L, "portal@acme.com", "hash", Instant.now());
        when(jdbcTemplate.query(eq("SELECT id, company_name, sales_team_id, discount_tier_id, portal_email, portal_password_hash, created_at FROM customers WHERE id = ?"), any(CustomerRepository.CustomerRowMapper.class), eq(1L)))
                .thenReturn(Collections.singletonList(customer));

        Optional<Customer> result = customerRepository.findById(1L);

        assertThat(result).isPresent();
        assertThat(result.get().getCompanyName()).isEqualTo("Acme Corp");
    }

    @Test
    @DisplayName("Should update existing customer")
    void testUpdateCustomer() {
        Customer customer = new Customer(1L, "Acme Inc", 10L, 2L, "portal@acme.com", "hash", Instant.now());
        customerRepository.save(customer);

        verify(jdbcTemplate).update(
                eq("UPDATE customers SET company_name = ?, sales_team_id = ?, discount_tier_id = ?, portal_email = ?, portal_password_hash = ? WHERE id = ?"),
                eq("Acme Inc"),
                eq(10L),
                eq(2L),
                eq("portal@acme.com"),
                eq("hash"),
                eq(1L)
        );
    }

    @Test
    @DisplayName("Should check customer existence by id")
    void testExistsById() {
        when(jdbcTemplate.queryForObject(eq("SELECT COUNT(*) FROM customers WHERE id = ?"), eq(Integer.class), eq(5L)))
                .thenReturn(1);

        assertThat(customerRepository.existsById(5L)).isTrue();
    }
}
