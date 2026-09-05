package com.odoo.DealFlow360.customer;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.Instant;

import static org.assertj.core.api.Assertions.assertThat;

class CustomerRequestModelTest {

    @Test
    @DisplayName("Should create and verify CustomerRequest domain model")
    void testCustomerRequestModel() {
        Instant now = Instant.now();
        CustomerRequest req1 = new CustomerRequest(1L, 10L, 100L, "REVISION_REQUEST",
                "Please lower unit price on item #1", "PENDING", now, now);

        assertThat(req1.getId()).isEqualTo(1L);
        assertThat(req1.getCustomerId()).isEqualTo(10L);
        assertThat(req1.getQuotationId()).isEqualTo(100L);
        assertThat(req1.getRequestType()).isEqualTo("REVISION_REQUEST");
        assertThat(req1.getDescription()).isEqualTo("Please lower unit price on item #1");
        assertThat(req1.getStatus()).isEqualTo("PENDING");
        assertThat(req1.getCreatedAt()).isEqualTo(now);
        assertThat(req1.getUpdatedAt()).isEqualTo(now);

        CustomerRequest req2 = new CustomerRequest(1L, 10L, 100L, "REVISION_REQUEST",
                "Please lower unit price on item #1", "PENDING", now, now);

        assertThat(req1).isEqualTo(req2);
        assertThat(req1.hashCode()).isEqualTo(req2.hashCode());
        assertThat(req1.toString()).contains("CustomerRequest");
    }

    @Test
    @DisplayName("Should support null quotationId in CustomerRequest model")
    void testCustomerRequestNullability() {
        CustomerRequest request = new CustomerRequest();
        request.setId(2L);
        request.setCustomerId(10L);
        request.setQuotationId(null);
        request.setRequestType("GENERAL_INQUIRY");

        assertThat(request.getId()).isEqualTo(2L);
        assertThat(request.getCustomerId()).isEqualTo(10L);
        assertThat(request.getQuotationId()).isNull();
        assertThat(request.getRequestType()).isEqualTo("GENERAL_INQUIRY");
    }
}
