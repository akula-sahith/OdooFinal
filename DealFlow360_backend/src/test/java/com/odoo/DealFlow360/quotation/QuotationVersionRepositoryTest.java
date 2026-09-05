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

class QuotationVersionRepositoryTest {

    private JdbcTemplate jdbcTemplate;
    private QuotationVersionRepository quotationVersionRepository;

    @BeforeEach
    void setUp() {
        jdbcTemplate = mock(JdbcTemplate.class);
        quotationVersionRepository = new QuotationVersionRepository(jdbcTemplate);
    }

    @Test
    @DisplayName("Should find quotation version by id")
    void testFindById() {
        Instant now = Instant.now();
        QuotationVersion version = new QuotationVersion(10L, 1L, 1, "SENT", new BigDecimal("500.00"), "Initial quote", now);

        String expectedSql = "SELECT id, quotation_id, version_number, status, total_amount, change_summary, created_at FROM quotation_versions WHERE id = ?";
        when(jdbcTemplate.query(eq(expectedSql), any(QuotationVersionRepository.QuotationVersionRowMapper.class), eq(10L)))
                .thenReturn(Collections.singletonList(version));

        Optional<QuotationVersion> result = quotationVersionRepository.findById(10L);

        assertThat(result).isPresent();
        assertThat(result.get().getVersionNumber()).isEqualTo(1);
        assertThat(result.get().getStatus()).isEqualTo("SENT");
    }

    @Test
    @DisplayName("Should find latest version by quotation id")
    void testFindLatestByQuotationId() {
        Instant now = Instant.now();
        QuotationVersion version = new QuotationVersion(12L, 1L, 2, "APPROVED", new BigDecimal("450.00"), "Revision 2", now);

        String expectedSql = "SELECT id, quotation_id, version_number, status, total_amount, change_summary, created_at FROM quotation_versions WHERE quotation_id = ? ORDER BY version_number DESC LIMIT 1";
        when(jdbcTemplate.query(eq(expectedSql), any(QuotationVersionRepository.QuotationVersionRowMapper.class), eq(1L)))
                .thenReturn(Collections.singletonList(version));

        Optional<QuotationVersion> result = quotationVersionRepository.findLatestByQuotationId(1L);

        assertThat(result).isPresent();
        assertThat(result.get().getVersionNumber()).isEqualTo(2);
    }

    @Test
    @DisplayName("Should check existence by quotation id and version number")
    void testExistsByQuotationIdAndVersionNumber() {
        String expectedSql = "SELECT COUNT(*) FROM quotation_versions WHERE quotation_id = ? AND version_number = ?";
        when(jdbcTemplate.queryForObject(eq(expectedSql), eq(Integer.class), eq(1L), eq(2)))
                .thenReturn(1);

        boolean exists = quotationVersionRepository.existsByQuotationIdAndVersionNumber(1L, 2);
        assertThat(exists).isTrue();
    }
}
