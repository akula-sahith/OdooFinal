package com.odoo.DealFlow360.quotation;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.Instant;

import static org.assertj.core.api.Assertions.assertThat;

class QuotationModelTest {

    @Test
    @DisplayName("Should create and verify Quotation domain model")
    void testQuotationModel() {
        Instant now = Instant.now();
        Instant future = now.plusSeconds(86400);

        Quotation q1 = new Quotation(1L, 10L, 2L, "DRAFT", "USD",
                new BigDecimal("1000.00"), new BigDecimal("100.00"), new BigDecimal("1100.00"),
                future, now, now);

        assertThat(q1.getId()).isEqualTo(1L);
        assertThat(q1.getCustomerId()).isEqualTo(10L);
        assertThat(q1.getPriceListId()).isEqualTo(2L);
        assertThat(q1.getStatus()).isEqualTo("DRAFT");
        assertThat(q1.getCurrency()).isEqualTo("USD");
        assertThat(q1.getSubtotalAmount()).isEqualTo(new BigDecimal("1000.00"));
        assertThat(q1.getTaxAmount()).isEqualTo(new BigDecimal("100.00"));
        assertThat(q1.getTotalAmount()).isEqualTo(new BigDecimal("1100.00"));
        assertThat(q1.getValidUntil()).isEqualTo(future);
        assertThat(q1.getCreatedAt()).isEqualTo(now);
        assertThat(q1.getUpdatedAt()).isEqualTo(now);

        Quotation q2 = new Quotation(1L, 10L, 2L, "DRAFT", "USD",
                new BigDecimal("1000.00"), new BigDecimal("100.00"), new BigDecimal("1100.00"),
                future, now, now);

        assertThat(q1).isEqualTo(q2);
        assertThat(q1.hashCode()).isEqualTo(q2.hashCode());
        assertThat(q1.toString()).contains("DRAFT");
    }

    @Test
    @DisplayName("Should support null fields in Quotation model")
    void testQuotationNullability() {
        Quotation quotation = new Quotation();
        quotation.setId(2L);
        quotation.setCustomerId(15L);
        quotation.setPriceListId(null);
        quotation.setValidUntil(null);

        assertThat(quotation.getId()).isEqualTo(2L);
        assertThat(quotation.getCustomerId()).isEqualTo(15L);
        assertThat(quotation.getPriceListId()).isNull();
        assertThat(quotation.getValidUntil()).isNull();
    }

    @Test
    @DisplayName("Should create and verify QuotationLine domain model")
    void testQuotationLineModel() {
        QuotationLine line1 = new QuotationLine(1L, 100L, 5L, 12L, 3,
                new BigDecimal("250.00"), new BigDecimal("10.00"),
                new BigDecimal("750.00"), new BigDecimal("75.00"), new BigDecimal("825.00"));

        assertThat(line1.getId()).isEqualTo(1L);
        assertThat(line1.getQuotationId()).isEqualTo(100L);
        assertThat(line1.getProductId()).isEqualTo(5L);
        assertThat(line1.getProductVariantId()).isEqualTo(12L);
        assertThat(line1.getQuantity()).isEqualTo(3);
        assertThat(line1.getUnitPrice()).isEqualTo(new BigDecimal("250.00"));
        assertThat(line1.getTaxPercent()).isEqualTo(new BigDecimal("10.00"));
        assertThat(line1.getSubtotalAmount()).isEqualTo(new BigDecimal("750.00"));
        assertThat(line1.getTaxAmount()).isEqualTo(new BigDecimal("75.00"));
        assertThat(line1.getTotalAmount()).isEqualTo(new BigDecimal("825.00"));

        QuotationLine line2 = new QuotationLine(1L, 100L, 5L, 12L, 3,
                new BigDecimal("250.00"), new BigDecimal("10.00"),
                new BigDecimal("750.00"), new BigDecimal("75.00"), new BigDecimal("825.00"));

        assertThat(line1).isEqualTo(line2);
        assertThat(line1.hashCode()).isEqualTo(line2.hashCode());
        assertThat(line1.toString()).contains("QuotationLine");
    }

    @Test
    @DisplayName("Should create and verify QuotationVersion domain model")
    void testQuotationVersionModel() {
        Instant now = Instant.now();
        QuotationVersion v1 = new QuotationVersion(1L, 100L, 1, "SENT",
                new BigDecimal("1100.00"), "Initial Version", now);

        assertThat(v1.getId()).isEqualTo(1L);
        assertThat(v1.getQuotationId()).isEqualTo(100L);
        assertThat(v1.getVersionNumber()).isEqualTo(1);
        assertThat(v1.getStatus()).isEqualTo("SENT");
        assertThat(v1.getTotalAmount()).isEqualTo(new BigDecimal("1100.00"));
        assertThat(v1.getChangeSummary()).isEqualTo("Initial Version");
        assertThat(v1.getCreatedAt()).isEqualTo(now);

        QuotationVersion v2 = new QuotationVersion(1L, 100L, 1, "SENT",
                new BigDecimal("1100.00"), "Initial Version", now);

        assertThat(v1).isEqualTo(v2);
        assertThat(v1.hashCode()).isEqualTo(v2.hashCode());
        assertThat(v1.toString()).contains("QuotationVersion");
    }
}
