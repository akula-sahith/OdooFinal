package com.odoo.DealFlow360.negotiation;

import com.odoo.DealFlow360.approval.ApprovalRouteResult;
import com.odoo.DealFlow360.approval.ApprovalService;
import com.odoo.DealFlow360.discount.DiscountRiskResult;
import com.odoo.DealFlow360.discount.DiscountService;
import com.odoo.DealFlow360.quotation.Quotation;
import com.odoo.DealFlow360.quotation.QuotationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Collections;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;

class NegotiationServiceTest {

    private NegotiationEngine engine;
    private QuotationService quotationService;
    private DiscountService discountService;
    private ApprovalService approvalService;
    private NegotiationService service;

    @BeforeEach
    void setUp() {
        engine = new NegotiationEngine();
        quotationService = Mockito.mock(QuotationService.class);
        discountService = Mockito.mock(DiscountService.class);
        approvalService = Mockito.mock(ApprovalService.class);

        service = new NegotiationService(engine, quotationService, discountService, approvalService);
    }

    @Test
    @DisplayName("Should create valid negotiation request in PENDING status")
    void testCreateNegotiationRequest() {
        NegotiationRequest request = service.createNegotiationRequest(1L, 100L, 50L, "PRICE_REVISION", "Client requested volume rebate");

        assertThat(request).isNotNull();
        assertThat(request.getId()).isEqualTo(1L);
        assertThat(request.getCustomerId()).isEqualTo(100L);
        assertThat(request.getQuotationId()).isEqualTo(50L);
        assertThat(request.getRequestType()).isEqualTo("PRICE_REVISION");
        assertThat(request.getDescription()).isEqualTo("Client requested volume rebate");
        assertThat(request.getStatus()).isEqualTo("PENDING");
        assertThat(request.getCreatedAt()).isNotNull();
        assertThat(request.getUpdatedAt()).isNotNull();
    }

    @Test
    @DisplayName("Should execute status transitions via service")
    void testStatusTransitions() {
        NegotiationRequest request = service.createNegotiationRequest(1L, 100L, 50L, "PRICE_REVISION", "Desc");

        service.submitForReview(request);
        assertThat(request.getStatus()).isEqualTo("IN_REVIEW");

        service.approveNegotiation(request);
        assertThat(request.getStatus()).isEqualTo("APPROVED");

        // Attempting transition after terminal APPROVED status should fail
        assertThatThrownBy(() -> service.rejectNegotiation(request))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("Cannot transition out of terminal negotiation status: APPROVED");
    }

    @Test
    @DisplayName("Should reject negotiation for quotation in invalid/locked status")
    void testNegotiationAgainstLockedQuotation() {
        Instant now = Instant.now();
        Quotation lockedQuotation = new Quotation(50L, 100L, 1L, "CONFIRMED", "USD", BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO, null, now, now);
        NegotiationRequest request = service.createNegotiationRequest(1L, 100L, 50L, "TERMS", "Notes");

        DiscountRiskResult riskResult = new DiscountRiskResult(BigDecimal.ZERO, false, Collections.emptyList());
        ApprovalRouteResult routeResult = new ApprovalRouteResult(null, Collections.emptyList(), false);

        assertThatThrownBy(() -> service.processNegotiationWorkflow(request, lockedQuotation, riskResult, routeResult))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("cannot be negotiated");
    }

    @Test
    @DisplayName("Should process negotiation workflow requiring approval and update quotation status")
    void testWorkflowRequiringApproval() {
        Instant now = Instant.now();
        Quotation quotation = new Quotation(50L, 100L, 1L, "SENT", "USD", BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO, null, now, now);
        NegotiationRequest request = service.createNegotiationRequest(1L, 100L, 50L, "DISCOUNT", "Higher discount requested");

        DiscountRiskResult riskResult = new DiscountRiskResult(new BigDecimal("10.00"), true, Collections.emptyList());
        ApprovalRouteResult routeResult = new ApprovalRouteResult(null, Collections.emptyList(), false);

        String targetState = service.processNegotiationWorkflow(request, quotation, riskResult, routeResult);

        assertThat(targetState).isEqualTo("PENDING_APPROVAL");
        verify(quotationService).changeQuotationStatus(quotation, "PENDING_APPROVAL");
        verify(quotationService).createQuotationVersion(eq(quotation), org.mockito.ArgumentMatchers.isNull(), any(String.class));
    }

    @Test
    @DisplayName("Should process negotiation workflow not requiring approval and update quotation status to UNDER_NEGOTIATION")
    void testWorkflowNotRequiringApproval() {
        Instant now = Instant.now();
        Quotation quotation = new Quotation(50L, 100L, 1L, "SENT", "USD", BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO, null, now, now);
        NegotiationRequest request = service.createNegotiationRequest(1L, 100L, 50L, "TERMS", "Net 30 terms requested");

        DiscountRiskResult riskResult = new DiscountRiskResult(BigDecimal.ZERO, false, Collections.emptyList());
        ApprovalRouteResult routeResult = new ApprovalRouteResult(null, Collections.emptyList(), false);

        String targetState = service.processNegotiationWorkflow(request, quotation, riskResult, routeResult);

        assertThat(targetState).isEqualTo("UNDER_NEGOTIATION");
        verify(quotationService).changeQuotationStatus(quotation, "UNDER_NEGOTIATION");
        verify(quotationService).createQuotationVersion(eq(quotation), org.mockito.ArgumentMatchers.isNull(), any(String.class));
    }

    @Test
    @DisplayName("Should delegate persistence operations to NegotiationRequestRepository")
    void testRepositoryDelegation() {
        NegotiationRequestRepository repo = Mockito.mock(NegotiationRequestRepository.class);
        NegotiationService serviceWithRepo = new NegotiationService(engine, quotationService, discountService, approvalService, repo);

        Instant now = Instant.now();
        NegotiationRequest request = new NegotiationRequest(null, 100L, 50L, "DISCOUNT", "Desc", "PENDING", now, now);
        NegotiationRequest savedRequest = new NegotiationRequest(1L, 100L, 50L, "DISCOUNT", "Desc", "PENDING", now, now);

        Mockito.when(repo.save(request)).thenReturn(savedRequest);
        Mockito.when(repo.findById(1L)).thenReturn(java.util.Optional.of(savedRequest));

        NegotiationRequest result = serviceWithRepo.saveNegotiationRequest(request);
        assertThat(result.getId()).isEqualTo(1L);

        java.util.Optional<NegotiationRequest> found = serviceWithRepo.findNegotiationRequestById(1L);
        assertThat(found).isPresent();
        assertThat(found.get().getCustomerId()).isEqualTo(100L);
    }
}
