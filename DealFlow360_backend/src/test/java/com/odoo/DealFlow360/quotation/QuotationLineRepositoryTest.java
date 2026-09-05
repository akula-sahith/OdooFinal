package com.odoo.DealFlow360.quotation;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.jdbc.core.JdbcTemplate;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class QuotationLineRepositoryTest {

    private JdbcTemplate jdbcTemplate;
    private QuotationLineRepository quotationLineRepository;

    @BeforeEach
    void setUp() {
        jdbcTemplate = mock(JdbcTemplate.class);
        quotationLineRepository = new QuotationLineRepository(jdbcTemplate);
    }

    @Test
    @DisplayName("Should find line by id")
    void testFindById() {
        QuotationLine line = new QuotationLine(100L, 1L, 50L, 5L, 2,
                new BigDecimal("100.00"), new BigDecimal("10.00"),
                new BigDecimal("200.00"), new BigDecimal("20.00"), new BigDecimal("220.00"));

        String expectedSql = "SELECT id, quotation_id, product_id, product_variant_id, quantity, unit_price, tax_percent, subtotal_amount, tax_amount, total_amount FROM quotation_lines WHERE id = ?";
        when(jdbcTemplate.query(eq(expectedSql), any(QuotationLineRepository.QuotationLineRowMapper.class), eq(100L)))
                .thenReturn(Collections.singletonList(line));

        Optional<QuotationLine> result = quotationLineRepository.findById(100L);

        assertThat(result).isPresent();
        assertThat(result.get().getProductId()).isEqualTo(50L);
        assertThat(result.get().getQuantity()).isEqualTo(2);
    }

    @Test
    @DisplayName("Should find lines by quotation id")
    void testFindByQuotationId() {
        QuotationLine line = new QuotationLine(100L, 1L, 50L, null, 1,
                new BigDecimal("50.00"), BigDecimal.ZERO,
                new BigDecimal("50.00"), BigDecimal.ZERO, new BigDecimal("50.00"));

        String expectedSql = "SELECT id, quotation_id, product_id, product_variant_id, quantity, unit_price, tax_percent, subtotal_amount, tax_amount, total_amount FROM quotation_lines WHERE quotation_id = ? ORDER BY id";
        when(jdbcTemplate.query(eq(expectedSql), any(QuotationLineRepository.QuotationLineRowMapper.class), eq(1L)))
                .thenReturn(List.of(line));

        List<QuotationLine> results = quotationLineRepository.findByQuotationId(1L);

        assertThat(results).hasSize(1);
        assertThat(results.get(0).getQuotationId()).isEqualTo(1L);
    }

    @Test
    @DisplayName("Should update existing quotation line")
    void testUpdateQuotationLine() {
        QuotationLine line = new QuotationLine(100L, 1L, 50L, 5L, 3,
                new BigDecimal("100.00"), new BigDecimal("10.00"),
                new BigDecimal("300.00"), new BigDecimal("30.00"), new BigDecimal("330.00"));

        quotationLineRepository.save(line);

        String expectedSql = "UPDATE quotation_lines SET quotation_id = ?, product_id = ?, product_variant_id = ?, quantity = ?, unit_price = ?, tax_percent = ?, subtotal_amount = ?, tax_amount = ?, total_amount = ? WHERE id = ?";
        verify(jdbcTemplate).update(
                eq(expectedSql),
                eq(1L),
                eq(50L),
                eq(5L),
                eq(3),
                eq(new BigDecimal("100.00")),
                eq(new BigDecimal("10.00")),
                eq(new BigDecimal("300.00")),
                eq(new BigDecimal("30.00")),
                eq(new BigDecimal("330.00")),
                eq(100L)
        );
    }

    @Test
    @DisplayName("Should delete lines by quotation id")
    void testDeleteByQuotationId() {
        quotationLineRepository.deleteByQuotationId(1L);
        verify(jdbcTemplate).update(eq("DELETE FROM quotation_lines WHERE quotation_id = ?"), eq(1L));
    }
}
