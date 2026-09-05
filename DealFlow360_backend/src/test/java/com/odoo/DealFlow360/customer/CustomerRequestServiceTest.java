package com.odoo.DealFlow360.customer;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class CustomerRequestServiceTest {

    private CustomerRequestRepository requestRepository;
    private CustomerRequestService requestService;

    @BeforeEach
    void setUp() {
        requestRepository = mock(CustomerRequestRepository.class);
        requestService = new CustomerRequestService(requestRepository);
    }

    @Test
    @DisplayName("Should create valid customer request successfully")
    void testValidRequestCreation() {
        CustomerRequest request = requestService.createCustomerRequest(1L, 10L, 100L, "REVISION_REQUEST", "Discount requested");

        assertThat(request).isNotNull();
        assertThat(request.getId()).isEqualTo(1L);
        assertThat(request.getCustomerId()).isEqualTo(10L);
        assertThat(request.getQuotationId()).isEqualTo(100L);
        assertThat(request.getRequestType()).isEqualTo("REVISION_REQUEST");
        assertThat(request.getDescription()).isEqualTo("Discount requested");
        assertThat(request.getStatus()).isEqualTo("PENDING");
    }

    @Test
    @DisplayName("Should reject blank request description")
    void testBlankDescriptionRejected() {
        assertThatThrownBy(() -> requestService.createCustomerRequest(1L, 10L, 100L, "REVISION_REQUEST", "   "))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Request description cannot be null or blank");
    }

    @Test
    @DisplayName("Should reject blank request type")
    void testBlankRequestTypeRejected() {
        assertThatThrownBy(() -> requestService.createCustomerRequest(1L, 10L, 100L, " ", "Description"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Request type cannot be null or blank");
    }

    @Test
    @DisplayName("Should reject invalid or non-positive customer ID")
    void testInvalidCustomerRejected() {
        assertThatThrownBy(() -> requestService.createCustomerRequest(1L, null, 100L, "REVISION_REQUEST", "Description"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Customer request must be associated with a valid positive Customer ID");

        assertThatThrownBy(() -> requestService.createCustomerRequest(1L, -5L, 100L, "REVISION_REQUEST", "Description"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Customer request must be associated with a valid positive Customer ID");
    }

    @Test
    @DisplayName("Should support optional quotation ID")
    void testOptionalQuotationHandling() {
        CustomerRequest request = requestService.createCustomerRequest(2L, 10L, null, "GENERAL_INQUIRY", "Question about catalog");

        assertThat(request).isNotNull();
        assertThat(request.getQuotationId()).isNull();
    }

    @Test
    @DisplayName("Should reject non-positive quotation ID if specified")
    void testInvalidQuotationRejected() {
        assertThatThrownBy(() -> requestService.createCustomerRequest(1L, 10L, -1L, "REVISION_REQUEST", "Description"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Quotation ID must be a positive number if specified");
    }

    @Test
    @DisplayName("Should perform valid status update successfully")
    void testValidStatusUpdate() {
        CustomerRequest request = requestService.createCustomerRequest(1L, 10L, 100L, "REVISION_REQUEST", "Description");
        requestService.updateRequestStatus(request, "FULFILLED");

        assertThat(request.getStatus()).isEqualTo("FULFILLED");
    }

    // ==========================================
    // REPOSITORY & TRANSACTIONAL WORKFLOW TESTS
    // ==========================================

    @Test
    @DisplayName("Should save customer request via repository")
    void testSaveCustomerRequest() {
        CustomerRequest request = requestService.createCustomerRequest(null, 10L, 100L, "REVISION", "Discount");
        when(requestRepository.save(request)).thenReturn(request);

        CustomerRequest saved = requestService.saveCustomerRequest(request);

        assertThat(saved).isEqualTo(request);
        verify(requestRepository).save(request);
    }

    @Test
    @DisplayName("Should find customer request by id via repository")
    void testFindCustomerRequestById() {
        CustomerRequest request = requestService.createCustomerRequest(1L, 10L, 100L, "REVISION", "Discount");
        when(requestRepository.findById(1L)).thenReturn(Optional.of(request));

        Optional<CustomerRequest> result = requestService.findCustomerRequestById(1L);

        assertThat(result).contains(request);
    }

    @Test
    @DisplayName("Should update status and save customer request in workflow")
    void testUpdateCustomerRequestStatusAndSave() {
        CustomerRequest request = requestService.createCustomerRequest(1L, 10L, 100L, "REVISION", "Discount");
        when(requestRepository.findById(1L)).thenReturn(Optional.of(request));
        when(requestRepository.save(any(CustomerRequest.class))).thenAnswer(invocation -> invocation.getArgument(0));

        CustomerRequest updated = requestService.updateCustomerRequestStatusAndSave(1L, "FULFILLED");

        assertThat(updated.getStatus()).isEqualTo("FULFILLED");
        verify(requestRepository).save(request);
    }
}
