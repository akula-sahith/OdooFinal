package com.odoo.DealFlow360.quotation;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.jdbc.core.JdbcTemplate;

import java.math.BigDecimal;
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

class QuotationRepositoryTest {

    private JdbcTemplate jdbcTemplate;
    private QuotationRepository quotationRepository;

    @BeforeEach
    void setUp() {
        jdbcTemplate = mock(JdbcTemplate.class);
        quotationRepository = new QuotationRepository(jdbcTemplate);
    }

    @Test
    @DisplayName("Should find quotation by id")
    void testFindById() {
        Instant now = Instant.now();
        Quotation quotation = new Quotation(1L, 10L, 5L, "DRAFT", "USD",
                new BigDecimal("100.00"), new BigDecimal("10.00"), new BigDecimal("110.00"), null, now, now);

        String expectedSql = "SELECT id, customer_id, price_list_id, status, currency, subtotal_amount, tax_amount, total_amount, valid_until, created_at, updated_at FROM quotations WHERE id = ?";
        when(jdbcTemplate.query(eq(expectedSql), any(QuotationRepository.QuotationRowMapper.class), eq(1L)))
                .thenReturn(Collections.singletonList(quotation));

        Optional<Quotation> result = quotationRepository.findById(1L);

        assertThat(result).isPresent();
        assertThat(result.get().getCustomerId()).isEqualTo(10L);
        assertThat(result.get().getStatus()).isEqualTo("DRAFT");
    }

    @Test
    @DisplayName("Should find quotations by customer id")
    void testFindByCustomerId() {
        Instant now = Instant.now();
        Quotation q1 = new Quotation(1L, 10L, 5L, "DRAFT", "USD", BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO, null, now, now);
        String expectedSql = "SELECT id, customer_id, price_list_id, status, currency, subtotal_amount, tax_amount, total_amount, valid_until, created_at, updated_at FROM quotations WHERE customer_id = ? ORDER BY id";
        when(jdbcTemplate.query(eq(expectedSql), any(QuotationRepository.QuotationRowMapper.class), eq(10L)))
                .thenReturn(List.of(q1));

        List<Quotation> results = quotationRepository.findByCustomerId(10L);

        assertThat(results).hasSize(1);
        assertThat(results.get(0).getId()).isEqualTo(1L);
    }

    @Test
    @DisplayName("Should update existing quotation")
    void testUpdateQuotation() {
        Instant now = Instant.now();
        Quotation quotation = new Quotation(1L, 10L, 5L, "SENT", "USD",
                new BigDecimal("200.00"), new BigDecimal("20.00"), new BigDecimal("220.00"), null, now, now);

        quotationRepository.save(quotation);

        String expectedSql = "UPDATE quotations SET customer_id = ?, price_list_id = ?, status = ?, currency = ?, subtotal_amount = ?, tax_amount = ?, total_amount = ?, valid_until = ?, created_at = ?, updated_at = ? WHERE id = ?";
        verify(jdbcTemplate).update(
                eq(expectedSql),
                eq(10L),
                eq(5L),
                eq("SENT"),
                eq("USD"),
                eq(new BigDecimal("200.00")),
                eq(new BigDecimal("20.00")),
                eq(new BigDecimal("220.00")),
                eq((Object) null),
                any(),
                any(),
                eq(1L)
        );
    }

    @Test
    @DisplayName("Should delete quotation by id")
    void testDeleteById() {
        quotationRepository.deleteById(10L);
        verify(jdbcTemplate).update(eq("DELETE FROM quotations WHERE id = ?"), eq(10L));
    }
}
