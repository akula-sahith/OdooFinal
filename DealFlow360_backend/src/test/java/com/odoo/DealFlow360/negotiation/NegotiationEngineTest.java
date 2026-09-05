package com.odoo.DealFlow360.negotiation;

import com.odoo.DealFlow360.approval.ApprovalChainRule;
import com.odoo.DealFlow360.approval.ApprovalRouteResult;
import com.odoo.DealFlow360.discount.DiscountRiskResult;
import com.odoo.DealFlow360.quotation.Quotation;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class NegotiationEngineTest {

    private NegotiationEngine engine;

    @BeforeEach
    void setUp() {
        engine = new NegotiationEngine();
    }

    @Test
    @DisplayName("1. Should validate valid negotiation request")
    void testValidRequestValidation() {
        NegotiationRequest request = new NegotiationRequest(
                1L, 100L, 50L, "DISCOUNT_REQUEST", "Customer requests 10% discount", "PENDING", Instant.now(), Instant.now()
        );

        engine.validateNegotiationRequest(request);
        assertThat(request.getStatus()).isEqualTo("PENDING");
    }

    @Test
    @DisplayName("2 & 3. Should reject missing or invalid customer ID")
    void testInvalidCustomerId() {
        NegotiationRequest missingCust = new NegotiationRequest(1L, null, 50L, "TYPE", "Desc", "PENDING", Instant.now(), Instant.now());
        assertThatThrownBy(() -> engine.validateNegotiationRequest(missingCust))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Customer ID");

        NegotiationRequest invalidCust = new NegotiationRequest(1L, -5L, 50L, "TYPE", "Desc", "PENDING", Instant.now(), Instant.now());
        assertThatThrownBy(() -> engine.validateNegotiationRequest(invalidCust))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Customer ID");
    }

    @Test
    @DisplayName("4 & 5. Should reject missing or blank request type")
    void testInvalidRequestType() {
        NegotiationRequest blankType = new NegotiationRequest(1L, 100L, 50L, "   ", "Desc", "PENDING", Instant.now(), Instant.now());
        assertThatThrownBy(() -> engine.validateNegotiationRequest(blankType))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Request type cannot be null or blank");
    }

    @Test
    @DisplayName("6 & 7. Should reject missing or blank description")
    void testInvalidDescription() {
        NegotiationRequest blankDesc = new NegotiationRequest(1L, 100L, 50L, "TYPE", "  ", "PENDING", Instant.now(), Instant.now());
        assertThatThrownBy(() -> engine.validateNegotiationRequest(blankDesc))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("description cannot be null or blank");
    }

    @Test
    @DisplayName("8 & 9. Should support valid nullable quotationId and reject non-positive quotationId")
    void testQuotationIdValidation() {
        NegotiationRequest nullQuotation = new NegotiationRequest(1L, 100L, null, "TYPE", "Desc", "PENDING", Instant.now(), Instant.now());
        engine.validateNegotiationRequest(nullQuotation);
        assertThat(nullQuotation.getQuotationId()).isNull();

        NegotiationRequest invalidQuotation = new NegotiationRequest(1L, 100L, 0L, "TYPE", "Desc", "PENDING", Instant.now(), Instant.now());
        assertThatThrownBy(() -> engine.validateNegotiationRequest(invalidQuotation))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Quotation ID must be a positive number");
    }

    @Test
    @DisplayName("10-13. Should evaluate valid status transitions for negotiation state machine")
    void testValidStatusTransitions() {
        // PENDING -> IN_REVIEW
        engine.validateStatusTransition("PENDING", "IN_REVIEW");
        // PENDING -> APPROVED
        engine.validateStatusTransition("PENDING", "APPROVED");
        // PENDING -> REJECTED
        engine.validateStatusTransition("PENDING", "REJECTED");
        // PENDING -> CANCELLED
        engine.validateStatusTransition("PENDING", "CANCELLED");
        // IN_REVIEW -> APPROVED
        engine.validateStatusTransition("IN_REVIEW", "APPROVED");
    }

    @Test
    @DisplayName("14. Should protect terminal states (APPROVED, REJECTED, CANCELLED) from transition")
    void testTerminalStateProtection() {
        assertThatThrownBy(() -> engine.validateStatusTransition("APPROVED", "PENDING"))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("Cannot transition out of terminal negotiation status: APPROVED");

        assertThatThrownBy(() -> engine.validateStatusTransition("REJECTED", "APPROVED"))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("Cannot transition out of terminal negotiation status: REJECTED");

        assertThatThrownBy(() -> engine.validateStatusTransition("CANCELLED", "IN_REVIEW"))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("Cannot transition out of terminal negotiation status: CANCELLED");
    }

    @Test
    @DisplayName("15 & 16. Should check whether quotation can be negotiated")
    void testCanNegotiateQuotation() {
        Instant now = Instant.now();
        Quotation draftQuotation = new Quotation(1L, 100L, 1L, "DRAFT", "USD", BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO, null, now, now);
        Quotation sentQuotation = new Quotation(2L, 100L, 1L, "SENT", "USD", BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO, null, now, now);
        Quotation underNegQuotation = new Quotation(3L, 100L, 1L, "UNDER_NEGOTIATION", "USD", BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO, null, now, now);
        Quotation confirmedQuotation = new Quotation(4L, 100L, 1L, "CONFIRMED", "USD", BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO, null, now, now);
        Quotation rejectedQuotation = new Quotation(5L, 100L, 1L, "REJECTED", "USD", BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO, null, now, now);

        assertThat(engine.canNegotiateQuotation(draftQuotation)).isTrue();
        assertThat(engine.canNegotiateQuotation(sentQuotation)).isTrue();
        assertThat(engine.canNegotiateQuotation(underNegQuotation)).isTrue();

        assertThat(engine.canNegotiateQuotation(confirmedQuotation)).isFalse();
        assertThat(engine.canNegotiateQuotation(rejectedQuotation)).isFalse();
        assertThat(engine.canNegotiateQuotation(null)).isFalse();
    }

    @Test
    @DisplayName("17-19. Should integrate DiscountRiskResult and ApprovalRouteResult to resolve quotation target state")
    void testResolveQuotationTargetState() {
        // No risk approval, no route approval -> UNDER_NEGOTIATION
        DiscountRiskResult safeRisk = new DiscountRiskResult(BigDecimal.ZERO, false, Collections.emptyList());
        ApprovalRouteResult safeRoute = new ApprovalRouteResult(null, Collections.emptyList(), false);
        assertThat(engine.resolveQuotationTargetState(safeRisk, safeRoute)).isEqualTo("UNDER_NEGOTIATION");

        // Risk approval required -> PENDING_APPROVAL
        DiscountRiskResult riskyRisk = new DiscountRiskResult(new BigDecimal("5.00"), true, Collections.emptyList());
        assertThat(engine.resolveQuotationTargetState(riskyRisk, safeRoute)).isEqualTo("PENDING_APPROVAL");

        // Route approval required -> PENDING_APPROVAL
        ApprovalRouteResult routeRequired = new ApprovalRouteResult(new ApprovalChainRule(1L, "Rule", 100L, null, null, null), new ArrayList<>(), true);
        assertThat(engine.resolveQuotationTargetState(safeRisk, routeRequired)).isEqualTo("PENDING_APPROVAL");
    }

    @Test
    @DisplayName("23. Should generate version change summary without inventing structured pricing values")
    void testGenerateNegotiationVersionSummary() {
        NegotiationRequest request = new NegotiationRequest(1L, 100L, 50L, "CUSTOM_DISCOUNT", "Customer asked for special pricing", "PENDING", Instant.now(), Instant.now());
        String summary = engine.generateNegotiationVersionSummary(request);

        assertThat(summary).isEqualTo("Negotiation [CUSTOM_DISCOUNT]: Customer asked for special pricing");
    }
}
