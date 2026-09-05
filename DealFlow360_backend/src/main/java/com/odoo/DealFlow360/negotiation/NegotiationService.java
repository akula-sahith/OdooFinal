package com.odoo.DealFlow360.negotiation;

import com.odoo.DealFlow360.approval.ApprovalRouteResult;
import com.odoo.DealFlow360.approval.ApprovalService;
import com.odoo.DealFlow360.discount.DiscountRiskResult;
import com.odoo.DealFlow360.discount.DiscountService;
import com.odoo.DealFlow360.quotation.Quotation;
import com.odoo.DealFlow360.quotation.QuotationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

/**
 * Business service handling domain validation, status transitions, state machine enforcement,
 * and orchestration for NegotiationRequest entities. Integrates with Spring JDBC repository for persistence.
 */
@Service
public class NegotiationService {

    private final NegotiationEngine negotiationEngine;
    private final QuotationService quotationService;
    private final DiscountService discountService;
    private final ApprovalService approvalService;
    private final NegotiationRequestRepository negotiationRequestRepository;

    public NegotiationService() {
        this(new NegotiationEngine(), null, null, null, null);
    }

    public NegotiationService(NegotiationEngine negotiationEngine) {
        this(negotiationEngine, null, null, null, null);
    }

    public NegotiationService(NegotiationEngine negotiationEngine,
                              QuotationService quotationService,
                              DiscountService discountService,
                              ApprovalService approvalService) {
        this(negotiationEngine, quotationService, discountService, approvalService, null);
    }

    @Autowired
    public NegotiationService(NegotiationEngine negotiationEngine,
                              QuotationService quotationService,
                              DiscountService discountService,
                              ApprovalService approvalService,
                              NegotiationRequestRepository negotiationRequestRepository) {
        this.negotiationEngine = negotiationEngine != null ? negotiationEngine : new NegotiationEngine();
        this.quotationService = quotationService;
        this.discountService = discountService;
        this.approvalService = approvalService;
        this.negotiationRequestRepository = negotiationRequestRepository;
    }

    /**
     * Validates domain constraints on a NegotiationRequest object.
     */
    public void validateNegotiationRequest(NegotiationRequest request) {
        negotiationEngine.validateNegotiationRequest(request);
    }

    /**
     * Creates and validates a new NegotiationRequest instance in PENDING status.
     */
    public NegotiationRequest createNegotiationRequest(Long id, Long customerId, Long quotationId,
                                                         String requestType, String description) {
        Instant now = Instant.now();
        NegotiationRequest request = new NegotiationRequest(
                id,
                customerId,
                quotationId,
                requestType != null ? requestType.trim() : null,
                description != null ? description.trim() : null,
                "PENDING",
                now,
                now
        );
        validateNegotiationRequest(request);
        return request;
    }

    /**
     * Transitions a NegotiationRequest status after state machine validation.
     */
    public void transitionStatus(NegotiationRequest request, String newStatus) {
        if (request == null) {
            throw new IllegalArgumentException("Negotiation request cannot be null");
        }
        negotiationEngine.validateStatusTransition(request.getStatus(), newStatus);
        request.setStatus(newStatus.trim().toUpperCase());
        request.setUpdatedAt(Instant.now());

        if (negotiationRequestRepository != null && request.getId() != null) {
            negotiationRequestRepository.save(request);
        }
    }

    /**
     * Moves a negotiation request from PENDING to IN_REVIEW status.
     */
    public void submitForReview(NegotiationRequest request) {
        transitionStatus(request, "IN_REVIEW");
    }

    /**
     * Approves a negotiation request.
     */
    public void approveNegotiation(NegotiationRequest request) {
        transitionStatus(request, "APPROVED");
    }

    /**
     * Rejects a negotiation request.
     */
    public void rejectNegotiation(NegotiationRequest request) {
        transitionStatus(request, "REJECTED");
    }

    /**
     * Cancels a negotiation request.
     */
    public void cancelNegotiation(NegotiationRequest request) {
        transitionStatus(request, "CANCELLED");
    }

    /**
     * Orchestrates negotiation evaluation against a Quotation using discount risk and approval routing results.
     */
    @Transactional
    public String processNegotiationWorkflow(NegotiationRequest request, Quotation quotation,
                                            DiscountRiskResult riskResult, ApprovalRouteResult routeResult) {
        validateNegotiationRequest(request);

        if (quotation != null) {
            if (!negotiationEngine.canNegotiateQuotation(quotation)) {
                throw new IllegalStateException("Quotation in status '" + quotation.getStatus() + "' cannot be negotiated");
            }

            String targetState = negotiationEngine.resolveQuotationTargetState(riskResult, routeResult);
            
            if (quotationService != null) {
                quotationService.changeQuotationStatus(quotation, targetState);
                String versionSummary = negotiationEngine.generateNegotiationVersionSummary(request);
                quotationService.createQuotationVersion(quotation, null, versionSummary);
            } else {
                quotation.setStatus(targetState);
            }

            if (negotiationRequestRepository != null) {
                saveNegotiationRequest(request);
            }

            return targetState;
        }

        return "UNDER_NEGOTIATION";
    }

    // ==========================================
    // PERSISTENCE & TRANSACTIONAL WORKFLOW METHODS
    // ==========================================

    /**
     * Persists a NegotiationRequest after domain validation.
     */
    @Transactional
    public NegotiationRequest saveNegotiationRequest(NegotiationRequest request) {
        validateNegotiationRequest(request);
        if (negotiationRequestRepository != null) {
            return negotiationRequestRepository.save(request);
        }
        return request;
    }

    /**
     * Finds a NegotiationRequest by ID.
     */
    public Optional<NegotiationRequest> findNegotiationRequestById(Long id) {
        if (negotiationRequestRepository != null && id != null) {
            return negotiationRequestRepository.findById(id);
        }
        return Optional.empty();
    }

    /**
     * Finds all NegotiationRequests for a customer ID.
     */
    public List<NegotiationRequest> findNegotiationRequestsByCustomerId(Long customerId) {
        if (negotiationRequestRepository != null && customerId != null) {
            return negotiationRequestRepository.findByCustomerId(customerId);
        }
        return Collections.emptyList();
    }

    /**
     * Finds all NegotiationRequests for a quotation ID.
     */
    public List<NegotiationRequest> findNegotiationRequestsByQuotationId(Long quotationId) {
        if (negotiationRequestRepository != null && quotationId != null) {
            return negotiationRequestRepository.findByQuotationId(quotationId);
        }
        return Collections.emptyList();
    }

    /**
     * Finds all NegotiationRequests matching a status string.
     */
    public List<NegotiationRequest> findNegotiationRequestsByStatus(String status) {
        if (negotiationRequestRepository != null && status != null) {
            return negotiationRequestRepository.findByStatus(status);
        }
        return Collections.emptyList();
    }

    /**
     * Retrieves all NegotiationRequests.
     */
    public List<NegotiationRequest> findAllNegotiationRequests() {
        if (negotiationRequestRepository != null) {
            return negotiationRequestRepository.findAll();
        }
        return Collections.emptyList();
    }

    /**
     * Checks if a NegotiationRequest exists by ID.
     */
    public boolean existsNegotiationRequestById(Long id) {
        return negotiationRequestRepository != null && id != null && negotiationRequestRepository.existsById(id);
    }

    /**
     * Updates status of a stored request and saves it.
     */
    @Transactional
    public NegotiationRequest updateRequestStatusAndSave(Long requestId, String newStatus) {
        NegotiationRequest request = findNegotiationRequestById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Negotiation request not found with ID: " + requestId));
        transitionStatus(request, newStatus);
        return saveNegotiationRequest(request);
    }

    /**
     * Deletes a NegotiationRequest by ID.
     */
    @Transactional
    public void deleteNegotiationRequestById(Long id) {
        if (negotiationRequestRepository != null && id != null) {
            negotiationRequestRepository.deleteById(id);
        }
    }
}
