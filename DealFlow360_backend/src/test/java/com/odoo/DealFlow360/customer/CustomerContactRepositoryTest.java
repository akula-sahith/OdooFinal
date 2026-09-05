package com.odoo.DealFlow360.customer;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.Collections;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class CustomerContactRepositoryTest {

    private JdbcTemplate jdbcTemplate;
    private CustomerContactRepository contactRepository;

    @BeforeEach
    void setUp() {
        jdbcTemplate = mock(JdbcTemplate.class);
        contactRepository = new CustomerContactRepository(jdbcTemplate);
    }

    @Test
    @DisplayName("Should find contact by id")
    void testFindById() {
        CustomerContact contact = new CustomerContact(1L, 100L, "Sarah Connor", "sarah@cyberdyne.com", "555-0199", "ACTIVE");
        when(jdbcTemplate.query(eq("SELECT id, customer_id, name, email, phone, status FROM customer_contacts WHERE id = ?"), any(CustomerContactRepository.CustomerContactRowMapper.class), eq(1L)))
                .thenReturn(Collections.singletonList(contact));

        Optional<CustomerContact> result = contactRepository.findById(1L);

        assertThat(result).isPresent();
        assertThat(result.get().getName()).isEqualTo("Sarah Connor");
    }

    @Test
    @DisplayName("Should update existing contact")
    void testUpdateContact() {
        CustomerContact contact = new CustomerContact(1L, 100L, "Sarah Connor Updated", "sarah@cyberdyne.com", "555-9999", "ACTIVE");
        contactRepository.save(contact);

        verify(jdbcTemplate).update(
                eq("UPDATE customer_contacts SET customer_id = ?, name = ?, email = ?, phone = ?, status = ? WHERE id = ?"),
                eq(100L),
                eq("Sarah Connor Updated"),
                eq("sarah@cyberdyne.com"),
                eq("555-9999"),
                eq("ACTIVE"),
                eq(1L)
        );
    }

    @Test
    @DisplayName("Should check contact existence by id")
    void testExistsById() {
        when(jdbcTemplate.queryForObject(eq("SELECT COUNT(*) FROM customer_contacts WHERE id = ?"), eq(Integer.class), eq(10L)))
                .thenReturn(1);

        assertThat(contactRepository.existsById(10L)).isTrue();
    }
}
