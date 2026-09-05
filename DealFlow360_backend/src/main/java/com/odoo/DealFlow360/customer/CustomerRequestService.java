package com.odoo.DealFlow360.customer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

/**
 * Business service handling CustomerRequest validation, domain operations, status management,
 * and persistence using Spring JDBC.
 */
@Service
public class CustomerRequestService {

    private final CustomerRequestRepository customerRequestRepository;

    public CustomerRequestService() {
        this.customerRequestRepository = null;
    }

    @Autowired
    public CustomerRequestService(CustomerRequestRepository customerRequestRepository) {
        this.customerRequestRepository = customerRequestRepository;
    }

    /**
     * Validates domain constraints on a CustomerRequest object.
     *
     * @param request CustomerRequest entity to validate
     */
    public void validateCustomerRequest(CustomerRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Customer request cannot be null");
        }
        if (request.getCustomerId() == null || request.getCustomerId() <= 0) {
            throw new IllegalArgumentException("Customer request must be associated with a valid positive Customer ID");
        }
        if (request.getQuotationId() != null && request.getQuotationId() <= 0) {
            throw new IllegalArgumentException("Quotation ID must be a positive number if specified");
        }
        if (request.getRequestType() == null || request.getRequestType().trim().isEmpty()) {
            throw new IllegalArgumentException("Request type cannot be null or blank");
        }
        if (request.getDescription() == null || request.getDescription().trim().isEmpty()) {
            throw new IllegalArgumentException("Request description cannot be null or blank");
        }
        if (request.getStatus() == null || request.getStatus().trim().isEmpty()) {
            throw new IllegalArgumentException("Request status cannot be null or blank");
        }
    }

    /**
     * Creates and validates a new CustomerRequest instance.
     *
     * @param id          Request ID
     * @param customerId  Customer ID (required)
     * @param quotationId Quotation ID (optional)
     * @param requestType Request type string (required)
     * @param description Request description string (required)
     * @return Validated CustomerRequest instance in PENDING status
     */
    public CustomerRequest createCustomerRequest(Long id, Long customerId, Long quotationId, String requestType, String description) {
        Instant now = Instant.now();
        CustomerRequest request = new CustomerRequest(
                id,
                customerId,
                quotationId,
                requestType != null ? requestType.trim() : null,
                description != null ? description.trim() : null,
                "PENDING",
                now,
                now
        );
        validateCustomerRequest(request);
        return request;
    }

    /**
     * Updates the status of a CustomerRequest after validation.
     *
     * @param request   CustomerRequest entity
     * @param newStatus New status string
     */
    public void updateRequestStatus(CustomerRequest request, String newStatus) {
        if (request == null) {
            throw new IllegalArgumentException("Customer request cannot be null");
        }
        if (newStatus == null || newStatus.trim().isEmpty()) {
            throw new IllegalArgumentException("New status cannot be null or blank");
        }
        request.setStatus(newStatus.trim().toUpperCase());
        request.setUpdatedAt(Instant.now());
        validateCustomerRequest(request);
    }

    // ==========================================
    // PERSISTENCE & TRANSACTIONAL WORKFLOW METHODS
    // ==========================================

    @Transactional
    public CustomerRequest saveCustomerRequest(CustomerRequest request) {
        validateCustomerRequest(request);
        if (customerRequestRepository == null) {
            throw new IllegalStateException("CustomerRequestRepository is not initialized");
        }
        return customerRequestRepository.save(request);
    }

    public Optional<CustomerRequest> findCustomerRequestById(Long id) {
        if (customerRequestRepository == null) {
            throw new IllegalStateException("CustomerRequestRepository is not initialized");
        }
        return customerRequestRepository.findById(id);
    }

    public List<CustomerRequest> findCustomerRequestsByCustomerId(Long customerId) {
        if (customerRequestRepository == null) {
            throw new IllegalStateException("CustomerRequestRepository is not initialized");
        }
        return customerRequestRepository.findByCustomerId(customerId);
    }

    public List<CustomerRequest> findCustomerRequestsByQuotationId(Long quotationId) {
        if (customerRequestRepository == null) {
            throw new IllegalStateException("CustomerRequestRepository is not initialized");
        }
        return customerRequestRepository.findByQuotationId(quotationId);
    }

    public List<CustomerRequest> findCustomerRequestsByStatus(String status) {
        if (customerRequestRepository == null) {
            throw new IllegalStateException("CustomerRequestRepository is not initialized");
        }
        return customerRequestRepository.findByStatus(status);
    }

    public List<CustomerRequest> findAllCustomerRequests() {
        if (customerRequestRepository == null) {
            throw new IllegalStateException("CustomerRequestRepository is not initialized");
        }
        return customerRequestRepository.findAll();
    }

    @Transactional
    public CustomerRequest updateCustomerRequestStatusAndSave(Long requestId, String newStatus) {
        CustomerRequest request = findCustomerRequestById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Customer request not found with ID: " + requestId));
        updateRequestStatus(request, newStatus);
        return saveCustomerRequest(request);
    }

    @Transactional
    public void deleteCustomerRequestById(Long id) {
        if (customerRequestRepository == null) {
            throw new IllegalStateException("CustomerRequestRepository is not initialized");
        }
        customerRequestRepository.deleteById(id);
    }
}
