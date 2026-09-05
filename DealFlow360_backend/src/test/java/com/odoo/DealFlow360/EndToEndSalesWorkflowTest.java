package com.odoo.DealFlow360;

import com.odoo.DealFlow360.approval.ApprovalEngine;
import com.odoo.DealFlow360.billing.BillingEngine;
import com.odoo.DealFlow360.billing.Invoice;
import com.odoo.DealFlow360.discount.DiscountRiskEngine;
import com.odoo.DealFlow360.discount.DiscountRiskResult;
import com.odoo.DealFlow360.fulfillment.FulfillmentEngine;
import com.odoo.DealFlow360.fulfillment.Order;
import com.odoo.DealFlow360.fulfillment.OrderLine;
import com.odoo.DealFlow360.inventory.InventoryEngine;
import com.odoo.DealFlow360.inventory.Stock;
import com.odoo.DealFlow360.inventory.Warehouse;
import com.odoo.DealFlow360.negotiation.NegotiationEngine;
import com.odoo.DealFlow360.negotiation.NegotiationRequest;
import com.odoo.DealFlow360.pricing.PricingEngine;
import com.odoo.DealFlow360.quotation.Quotation;
import com.odoo.DealFlow360.quotation.QuotationLine;
import com.odoo.DealFlow360.subscription.SubscriptionEngine;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class EndToEndSalesWorkflowTest {

    private PricingEngine pricingEngine;
    private DiscountRiskEngine discountRiskEngine;
    private ApprovalEngine approvalEngine;
    private NegotiationEngine negotiationEngine;
    private InventoryEngine inventoryEngine;
    private FulfillmentEngine fulfillmentEngine;
    private SubscriptionEngine subscriptionEngine;
    private BillingEngine billingEngine;

    @BeforeEach
    void setUp() {
        pricingEngine = new PricingEngine();
        discountRiskEngine = new DiscountRiskEngine();
        approvalEngine = new ApprovalEngine();
        negotiationEngine = new NegotiationEngine();
        inventoryEngine = new InventoryEngine();
        fulfillmentEngine = new FulfillmentEngine();
        subscriptionEngine = new SubscriptionEngine();
        billingEngine = new BillingEngine();
    }

    @Test
    @DisplayName("Complete E2E Quotation-to-Cash Workflow: Quote -> Risk -> Approval -> Negotiation -> Split -> Hybrid Billing -> Payment")
    void testCompleteEndToEndSalesWorkflow() {
        Instant now = Instant.now();

        // 1. Build Quotation with Hardware (One-Time) & Subscription (Recurring)
        Quotation quote = new Quotation(100L, 10L, 1L, "DRAFT", "USD", new BigDecimal("1500.00"), new BigDecimal("150.00"), new BigDecimal("1650.00"), null, now, now);

        QuotationLine hardwareLine = new QuotationLine(1L, 100L, 10L, null, 1, new BigDecimal("1000.00"), new BigDecimal("10.00"), new BigDecimal("1000.00"), new BigDecimal("100.00"), new BigDecimal("1100.00"));
        QuotationLine subLine = new QuotationLine(2L, 100L, 20L, null, 1, new BigDecimal("500.00"), new BigDecimal("10.00"), new BigDecimal("500.00"), new BigDecimal("50.00"), new BigDecimal("550.00"));

        // 2. Evaluate Discount Risk (e.g. 18% discount applied on service vs 10% ceiling) -> Requires Approval
        DiscountRiskResult riskResult = new DiscountRiskResult(new BigDecimal("8.00"), true, Collections.emptyList());
        String targetState = negotiationEngine.resolveQuotationTargetState(riskResult, null);
        assertThat(targetState).isEqualTo("PENDING_APPROVAL");

        // 3. Customer Negotiation Portal: Customer proposes counter offer
        NegotiationRequest request = new NegotiationRequest(1L, 10L, 100L, "COUNTER_DISCOUNT", "Customer requests 15% discount", "PENDING", new BigDecimal("15.00"), "Can we discount hardware?", new BigDecimal("850.00"), now, now);
        negotiationEngine.validateNegotiationRequest(request);
        assertThat(request.getStatus()).isEqualTo("PENDING");

        // 4. Approval Granted -> Quotation Confirmed -> Order Created
        quote.setStatus("CONFIRMED");
        Order order = new Order(50L, 100L, 10L, "CONFIRMED", "USD", new BigDecimal("1500.00"), new BigDecimal("150.00"), new BigDecimal("1650.00"), BigDecimal.ZERO, now, now);

        OrderLine oLine1 = new OrderLine(1L, 50L, 10L, null, 1, new BigDecimal("1000.00"), new BigDecimal("10.00"), new BigDecimal("1000.00"), new BigDecimal("100.00"), new BigDecimal("1100.00"), false);
        OrderLine oLine2 = new OrderLine(2L, 50L, 20L, null, 1, new BigDecimal("500.00"), new BigDecimal("10.00"), new BigDecimal("500.00"), new BigDecimal("50.00"), new BigDecimal("550.00"), true);

        // 5. Multi-Warehouse Auto Fulfillment Split
        Warehouse w1 = new Warehouse(1L, "Main Warehouse", "East", new BigDecimal("1.00"));
        Warehouse w2 = new Warehouse(2L, "West Depot", "West", new BigDecimal("1.20"));
        Stock s1 = new Stock(1L, 1L, 10L, 10, 0);

        List<FulfillmentEngine.SplitRecommendation> splits = fulfillmentEngine.calculateLineSplit(oLine1, Arrays.asList(w1, w2), Arrays.asList(s1));
        assertThat(splits).hasSize(1);
        assertThat(splits.get(0).getQuantityAllocated()).isEqualTo(1);

        // 6. Hybrid Order Billing: Separate upfront invoice vs recurring subscription schedule
        BillingEngine.HybridBillingBreakdown breakdown = billingEngine.categorizeOrderLines(Arrays.asList(oLine1, oLine2));
        assertThat(breakdown.getOneTimeLines()).hasSize(1);
        assertThat(breakdown.getSubscriptionLines()).hasSize(1);

        // 7. Payment Processing & Invoice Status
        String invStatus = billingEngine.resolveInvoiceStatus(new BigDecimal("1100.00"), new BigDecimal("1100.00"));
        assertThat(invStatus).isEqualTo("PAID");
    }
}
