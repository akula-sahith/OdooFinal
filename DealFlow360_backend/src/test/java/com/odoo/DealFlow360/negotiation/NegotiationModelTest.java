package com.odoo.DealFlow360.negotiation;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.Instant;

import static org.assertj.core.api.Assertions.assertThat;

class NegotiationModelTest {

    @Test
    @DisplayName("Should create NegotiationRequest with full constructor and getters")
    void testFullConstructorAndGetters() {
        Instant now = Instant.now();
        NegotiationRequest request = new NegotiationRequest(
                1L,
                100L,
                50L,
                "DISCOUNT_REQUEST",
                "Requesting 10% volume discount",
                "PENDING",
                now,
                now
        );

        assertThat(request.getId()).isEqualTo(1L);
        assertThat(request.getCustomerId()).isEqualTo(100L);
        assertThat(request.getQuotationId()).isEqualTo(50L);
        assertThat(request.getRequestType()).isEqualTo("DISCOUNT_REQUEST");
        assertThat(request.getDescription()).isEqualTo("Requesting 10% volume discount");
        assertThat(request.getStatus()).isEqualTo("PENDING");
        assertThat(request.getCreatedAt()).isEqualTo(now);
        assertThat(request.getUpdatedAt()).isEqualTo(now);
    }

    @Test
    @DisplayName("Should support setters and default constructor")
    void testSettersAndDefaultConstructor() {
        NegotiationRequest request = new NegotiationRequest();
        Instant now = Instant.now();

        request.setId(2L);
        request.setCustomerId(200L);
        request.setQuotationId(null); // nullable quotationId
        request.setRequestType("TERMS_REVISION");
        request.setDescription("Requesting Net 60 payment terms");
        request.setStatus("IN_REVIEW");
        request.setCreatedAt(now);
        request.setUpdatedAt(now);

        assertThat(request.getId()).isEqualTo(2L);
        assertThat(request.getCustomerId()).isEqualTo(200L);
        assertThat(request.getQuotationId()).isNull();
        assertThat(request.getRequestType()).isEqualTo("TERMS_REVISION");
        assertThat(request.getDescription()).isEqualTo("Requesting Net 60 payment terms");
        assertThat(request.getStatus()).isEqualTo("IN_REVIEW");
        assertThat(request.getCreatedAt()).isEqualTo(now);
        assertThat(request.getUpdatedAt()).isEqualTo(now);
    }

    @Test
    @DisplayName("Should test equality, hashCode, and toString")
    void testEqualsHashCodeAndToString() {
        Instant now = Instant.now();
        NegotiationRequest req1 = new NegotiationRequest(1L, 100L, 50L, "DISCOUNT_REQUEST", "Desc", "PENDING", now, now);
        NegotiationRequest req2 = new NegotiationRequest(1L, 100L, 50L, "DISCOUNT_REQUEST", "Desc", "PENDING", now, now);

        assertThat(req1).isEqualTo(req2);
        assertThat(req1.hashCode()).isEqualTo(req2.hashCode());
        assertThat(req1.toString()).contains("NegotiationRequest", "id=1", "customerId=100", "quotationId=50", "DISCOUNT_REQUEST");
    }
}
