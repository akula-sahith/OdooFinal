package com.odoo.DealFlow360.negotiation;

import com.odoo.DealFlow360.customer.Customer;
import com.odoo.DealFlow360.fulfillment.FulfillmentService;
import com.odoo.DealFlow360.fulfillment.Order;
import com.odoo.DealFlow360.quotation.Quotation;
import com.odoo.DealFlow360.quotation.QuotationService;
import com.odoo.DealFlow360.security.SecurityUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;

class CustomerSecurityAndConfirmationTest {

    private QuotationService quotationService;
    private NegotiationService negotiationService;
    private FulfillmentService fulfillmentService;
    private SecurityUtils securityUtils;
    private CustomerPortalController portalController;

    @BeforeEach
    void setUp() {
        quotationService = Mockito.mock(QuotationService.class);
        negotiationService = Mockito.mock(NegotiationService.class);
        fulfillmentService = Mockito.mock(FulfillmentService.class);
        securityUtils = Mockito.mock(SecurityUtils.class);

        portalController = new CustomerPortalController(
                quotationService,
                negotiationService,
                fulfillmentService,
                null, null, null, null, null,
                securityUtils
        );
    }

    @Test
    @DisplayName("1. Customer A accessing Customer B quotation returns HTTP 403 FORBIDDEN")
    void testCustomerA_AccessCustomerB_Quotation_Forbidden() {
        // Customer A has ID 1
        when(securityUtils.isCustomer()).thenReturn(true);
        when(securityUtils.getCurrentCustomerId()).thenReturn(1L);

        // Quotation #99 belongs to Customer B (ID 2)
        Quotation quoteB = new Quotation(99L, 2L, 1L, "SENT", "USD", BigDecimal.valueOf(1000), BigDecimal.ZERO, BigDecimal.valueOf(1000), null, Instant.now(), Instant.now());
        when(quotationService.findQuotationById(99L)).thenReturn(Optional.of(quoteB));

        ResponseEntity<?> response = portalController.getPortalQuotationView(99L);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
    }

    @Test
    @DisplayName("2. Customer A accessing own quotation succeeds with HTTP 200 OK")
    void testCustomerA_AccessOwnQuotation_Success() {
        when(securityUtils.isCustomer()).thenReturn(true);
        when(securityUtils.getCurrentCustomerId()).thenReturn(1L);

        Quotation quoteA = new Quotation(10L, 1L, 1L, "SENT", "USD", BigDecimal.valueOf(500), BigDecimal.ZERO, BigDecimal.valueOf(500), null, Instant.now(), Instant.now());
        when(quotationService.findQuotationById(10L)).thenReturn(Optional.of(quoteA));
        when(quotationService.findLinesByQuotationId(10L)).thenReturn(List.of());

        ResponseEntity<?> response = portalController.getPortalQuotationView(10L);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    @DisplayName("3. Confirmation of PENDING_APPROVAL quotation fails with HTTP 400 Bad Request")
    void testConfirm_PendingApproval_Fails() {
        when(securityUtils.isCustomer()).thenReturn(true);
        when(securityUtils.getCurrentCustomerId()).thenReturn(1L);

        Quotation pendingQuote = new Quotation(15L, 1L, 1L, "PENDING_APPROVAL", "USD", BigDecimal.valueOf(2000), BigDecimal.ZERO, BigDecimal.valueOf(2000), null, Instant.now(), Instant.now());
        when(quotationService.findQuotationById(15L)).thenReturn(Optional.of(pendingQuote));

        var req = new CustomerPortalController.PortalConfirmQuotationRequest();
        req.quotationId = 15L;

        ResponseEntity<?> response = portalController.confirmQuotationFromPortal(req);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody().toString()).contains("pending manager approval");
    }

    @Test
    @DisplayName("4. Confirmation of UNDER_NEGOTIATION quotation fails with HTTP 400 Bad Request")
    void testConfirm_UnderNegotiation_Fails() {
        when(securityUtils.isCustomer()).thenReturn(true);
        when(securityUtils.getCurrentCustomerId()).thenReturn(1L);

        Quotation negQuote = new Quotation(20L, 1L, 1L, "UNDER_NEGOTIATION", "USD", BigDecimal.valueOf(1500), BigDecimal.ZERO, BigDecimal.valueOf(1500), null, Instant.now(), Instant.now());
        when(quotationService.findQuotationById(20L)).thenReturn(Optional.of(negQuote));

        var req = new CustomerPortalController.PortalConfirmQuotationRequest();
        req.quotationId = 20L;

        ResponseEntity<?> response = portalController.confirmQuotationFromPortal(req);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody().toString()).contains("under negotiation");
    }

    @Test
    @DisplayName("5. Confirmation of DRAFT quotation fails with HTTP 400 Bad Request")
    void testConfirm_Draft_Fails() {
        when(securityUtils.isCustomer()).thenReturn(true);
        when(securityUtils.getCurrentCustomerId()).thenReturn(1L);

        Quotation draftQuote = new Quotation(25L, 1L, 1L, "DRAFT", "USD", BigDecimal.valueOf(500), BigDecimal.ZERO, BigDecimal.valueOf(500), null, Instant.now(), Instant.now());
        when(quotationService.findQuotationById(25L)).thenReturn(Optional.of(draftQuote));

        var req = new CustomerPortalController.PortalConfirmQuotationRequest();
        req.quotationId = 25L;

        ResponseEntity<?> response = portalController.confirmQuotationFromPortal(req);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody().toString()).contains("is not ready for confirmation");
    }

    @Test
    @DisplayName("6. Confirmation of already CONFIRMED quotation fails and prevents duplicate order creation")
    void testConfirm_AlreadyConfirmed_Fails() {
        when(securityUtils.isCustomer()).thenReturn(true);
        when(securityUtils.getCurrentCustomerId()).thenReturn(1L);

        Quotation confirmedQuote = new Quotation(30L, 1L, 1L, "CONFIRMED", "USD", BigDecimal.valueOf(1200), BigDecimal.ZERO, BigDecimal.valueOf(1200), null, Instant.now(), Instant.now());
        when(quotationService.findQuotationById(30L)).thenReturn(Optional.of(confirmedQuote));

        var req = new CustomerPortalController.PortalConfirmQuotationRequest();
        req.quotationId = 30L;

        ResponseEntity<?> response = portalController.confirmQuotationFromPortal(req);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody().toString()).contains("already confirmed");
    }

    @Test
    @DisplayName("7. Confirmation of APPROVED quotation succeeds and creates order")
    void testConfirm_Approved_Succeeds() {
        when(securityUtils.isCustomer()).thenReturn(true);
        when(securityUtils.getCurrentCustomerId()).thenReturn(1L);

        Quotation appQuote = new Quotation(35L, 1L, 1L, "APPROVED", "USD", BigDecimal.valueOf(3000), BigDecimal.ZERO, BigDecimal.valueOf(3000), null, Instant.now(), Instant.now());
        when(quotationService.findQuotationById(35L)).thenReturn(Optional.of(appQuote));
        when(quotationService.findLinesByQuotationId(35L)).thenReturn(List.of());

        Order createdOrder = new Order(500L, 35L, 1L, "CONFIRMED", "USD", BigDecimal.valueOf(3000), BigDecimal.ZERO, BigDecimal.valueOf(3000), BigDecimal.ZERO, Instant.now(), Instant.now());
        when(fulfillmentService.convertQuotationToOrder(Mockito.any(), Mockito.any())).thenReturn(createdOrder);

        var req = new CustomerPortalController.PortalConfirmQuotationRequest();
        req.quotationId = 35L;

        ResponseEntity<?> response = portalController.confirmQuotationFromPortal(req);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        Map<?, ?> body = (Map<?, ?>) response.getBody();
        assertThat(body.get("status")).isEqualTo("CONFIRMED");
    }

    @Test
    @DisplayName("8. Customer Portal quotation listing returns ONLY SENT and CONFIRMED quotations for authenticated customer")
    void testCustomerPortal_GetQuotations_ReturnsOnlySentAndConfirmed() {
        when(securityUtils.isCustomer()).thenReturn(true);
        when(securityUtils.getCurrentCustomerId()).thenReturn(1L);

        Quotation qSent = new Quotation(125L, 1L, 1L, "SENT", "USD", BigDecimal.valueOf(500), BigDecimal.ZERO, BigDecimal.valueOf(500), null, Instant.now(), Instant.now());
        Quotation qConfirmed = new Quotation(130L, 1L, 1L, "CONFIRMED", "USD", BigDecimal.valueOf(1200), BigDecimal.ZERO, BigDecimal.valueOf(1200), null, Instant.now(), Instant.now());

        when(quotationService.findCustomerVisibleQuotations(1L)).thenReturn(List.of(qSent, qConfirmed));

        ResponseEntity<?> response = portalController.getCustomerPortalQuotations();
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);

        @SuppressWarnings("unchecked")
        List<Quotation> result = (List<Quotation>) response.getBody();
        assertThat(result).hasSize(2);
        assertThat(result).extracting(Quotation::getStatus).containsExactly("SENT", "CONFIRMED");
    }
}
