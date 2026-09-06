package com.odoo.DealFlow360.negotiation;

import com.odoo.DealFlow360.approval.ApprovalRouteResult;
import com.odoo.DealFlow360.approval.ApprovalService;
import com.odoo.DealFlow360.billing.BillingService;
import com.odoo.DealFlow360.billing.Invoice;
import com.odoo.DealFlow360.billing.Payment;
import com.odoo.DealFlow360.discount.DiscountLineRiskResult;
import com.odoo.DealFlow360.discount.DiscountRiskResult;
import com.odoo.DealFlow360.discount.DiscountService;
import com.odoo.DealFlow360.fulfillment.FulfillmentService;
import com.odoo.DealFlow360.fulfillment.Order;
import com.odoo.DealFlow360.fulfillment.OrderLine;
import com.odoo.DealFlow360.product.ProductService;
import com.odoo.DealFlow360.quotation.Quotation;
import com.odoo.DealFlow360.quotation.QuotationLine;
import com.odoo.DealFlow360.quotation.QuotationService;
import com.odoo.DealFlow360.security.SecurityUtils;
import com.odoo.DealFlow360.subscription.Subscription;
import com.odoo.DealFlow360.subscription.SubscriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("/api/portal")
public class CustomerPortalController {

    private final QuotationService quotationService;
    private final NegotiationService negotiationService;
    private final FulfillmentService fulfillmentService;
    private final DiscountService discountService;
    private final ApprovalService approvalService;
    private final ProductService productService;
    private final BillingService billingService;
    private final SubscriptionService subscriptionService;
    private final SecurityUtils securityUtils;

    @Autowired
    public CustomerPortalController(QuotationService quotationService,
                                  NegotiationService negotiationService,
                                  FulfillmentService fulfillmentService,
                                  @Autowired(required = false) DiscountService discountService,
                                  @Autowired(required = false) ApprovalService approvalService,
                                  @Autowired(required = false) ProductService productService,
                                  @Autowired(required = false) BillingService billingService,
                                  @Autowired(required = false) SubscriptionService subscriptionService,
                                  @Autowired(required = false) SecurityUtils securityUtils) {
        this.quotationService = quotationService;
        this.negotiationService = negotiationService;
        this.fulfillmentService = fulfillmentService;
        this.discountService = discountService;
        this.approvalService = approvalService;
        this.productService = productService;
        this.billingService = billingService;
        this.subscriptionService = subscriptionService;
        this.securityUtils = securityUtils;
    }

    public static class PortalNegotiationSubmission {
        public Long customerId;
        public Long quotationId;
        public String requestType;
        public String description;
        public BigDecimal counterDiscountPercent;
        public String lineComments;
        public BigDecimal proposedUnitPrice;
    }

    public static class PortalConfirmQuotationRequest {
        public Long quotationId;
        public String pin;
        public String paymentMethod;
    }

    @GetMapping("/quotations")
    public ResponseEntity<?> getCustomerPortalQuotations() {
        if (securityUtils != null && securityUtils.isCustomer()) {
            Long callerCustId = securityUtils.getCurrentCustomerId();
            if (callerCustId != null) {
                List<Quotation> quotes = quotationService.findCustomerVisibleQuotations(callerCustId);
                return ResponseEntity.ok(quotes);
            }
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", "Access denied: Unrecognized customer identity."));
        }
        Long callerCustId = securityUtils != null ? securityUtils.getCurrentCustomerId() : null;
        if (callerCustId != null) {
            return ResponseEntity.ok(quotationService.findCustomerVisibleQuotations(callerCustId));
        }
        return ResponseEntity.ok(List.of());
    }

    @GetMapping("/quotations/{id}")
    public ResponseEntity<?> getPortalQuotationView(@PathVariable Long id) {
        return quotationService.findQuotationById(id)
                .map(quotation -> {
                    if (securityUtils != null && securityUtils.isCustomer()) {
                        Long callerCustId = securityUtils.getCurrentCustomerId();
                        if (callerCustId == null || !callerCustId.equals(quotation.getCustomerId())) {
                            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                                    .body((Object) Map.of("message", "Access denied: You are not authorized to view this quotation."));
                        }
                        String st = quotation.getStatus() != null ? quotation.getStatus().toUpperCase() : "";
                        if ("DRAFT".equals(st) || "PENDING_APPROVAL".equals(st) || "RETURNED_FOR_REVISION".equals(st) || "REJECTED".equals(st)) {
                            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                                    .body((Object) Map.of("message", "Access denied: This quotation is currently in internal status " + st + " and is not accessible to customers."));
                        }
                    }

                    List<QuotationLine> lines = quotationService.findLinesByQuotationId(id);
                    Map<String, Object> response = new HashMap<>();
                    response.put("quotation", quotation);
                    response.put("lines", lines);
                    return ResponseEntity.ok((Object) response);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/negotiate")
    public ResponseEntity<?> submitPortalNegotiation(@RequestBody PortalNegotiationSubmission submission) {
        if (submission == null || submission.quotationId == null) {
            return ResponseEntity.badRequest().body("Quotation ID is required");
        }

        Quotation quotation = quotationService.findQuotationById(submission.quotationId).orElse(null);
        if (quotation == null) {
            return ResponseEntity.notFound().build();
        }

        if (securityUtils != null && securityUtils.isCustomer()) {
            Long callerCustId = securityUtils.getCurrentCustomerId();
            if (callerCustId == null || !callerCustId.equals(quotation.getCustomerId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("Access denied: You are not authorized to negotiate this quotation.");
            }
            submission.customerId = callerCustId;
        } else if (submission.customerId == null) {
            submission.customerId = quotation.getCustomerId();
        }

        try {
            String desc = submission.description != null && !submission.description.isBlank() ? submission.description : "Customer counter offer";
            if (submission.counterDiscountPercent != null) {
                desc = "Counter Discount Proposal: " + submission.counterDiscountPercent + "%" +
                        (submission.description != null && !submission.description.isBlank() ? " | Notes: " + submission.description : "");
            }

            NegotiationRequest req = negotiationService.createNegotiationRequest(
                    null,
                    submission.customerId,
                    submission.quotationId,
                    submission.requestType != null ? submission.requestType : "COUNTER_DISCOUNT",
                    desc
            );
            req.setCounterDiscountPercent(submission.counterDiscountPercent);
            req.setLineComments(submission.lineComments);
            req.setProposedUnitPrice(submission.proposedUnitPrice);

            req = negotiationService.saveNegotiationRequest(req);

            quotationService.changeQuotationStatus(quotation, "UNDER_NEGOTIATION");
            quotationService.saveQuotation(quotation);

            return ResponseEntity.status(HttpStatus.CREATED).body(req);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/confirm-quotation")
    public ResponseEntity<?> confirmQuotationFromPortal(@RequestBody PortalConfirmQuotationRequest request) {
        if (request == null || request.quotationId == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Quotation ID is required"));
        }

        Quotation quotation = quotationService.findQuotationById(request.quotationId).orElse(null);
        if (quotation == null) {
            return ResponseEntity.notFound().build();
        }

        // 1. Backend Customer Ownership Authorization
        if (securityUtils != null && securityUtils.isCustomer()) {
            Long callerCustId = securityUtils.getCurrentCustomerId();
            if (callerCustId == null || !callerCustId.equals(quotation.getCustomerId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("message", "Access denied: You are not authorized to confirm this quotation."));
            }
        }

        // 2. Strict Quotation State Machine Transition & Validation
        String currentStatus = quotation.getStatus() != null ? quotation.getStatus().toUpperCase() : "";

        if ("CONFIRMED".equals(currentStatus)) {
            return ResponseEntity.badRequest().body(Map.of(
                    "status", "ERROR",
                    "message", "Quotation is already confirmed and an order has been created."
            ));
        }

        if ("PENDING_APPROVAL".equals(currentStatus)) {
            return ResponseEntity.badRequest().body(Map.of(
                    "status", "ERROR",
                    "message", "Quotation is pending manager approval and cannot be confirmed."
            ));
        }

        if ("UNDER_NEGOTIATION".equals(currentStatus)) {
            return ResponseEntity.badRequest().body(Map.of(
                    "status", "ERROR",
                    "message", "Quotation is under negotiation and cannot be confirmed until negotiation is resolved."
            ));
        }

        if ("DRAFT".equals(currentStatus) || "RETURNED_FOR_REVISION".equals(currentStatus)) {
            return ResponseEntity.badRequest().body(Map.of(
                    "status", "ERROR",
                    "message", "Quotation is in " + currentStatus + " status and is not ready for confirmation."
            ));
        }

        if ("REJECTED".equals(currentStatus)) {
            return ResponseEntity.badRequest().body(Map.of(
                    "status", "ERROR",
                    "message", "Cannot confirm a rejected quotation."
            ));
        }

        if (!"SENT".equals(currentStatus) && !"APPROVED".equals(currentStatus)) {
            return ResponseEntity.badRequest().body(Map.of(
                    "status", "ERROR",
                    "message", "Quotation status " + currentStatus + " is invalid for confirmation."
            ));
        }

        List<QuotationLine> lines = quotationService.findLinesByQuotationId(request.quotationId);

        // 3. Discount Risk & Approval Threshold Check for SENT status
        boolean approvalRequired = false;
        DiscountRiskResult riskResult = null;
        ApprovalRouteResult routeResult = null;

        if (!"APPROVED".equals(currentStatus) && discountService != null && productService != null) {
            List<DiscountLineRiskResult> lineRisks = lines.stream()
                    .map(l -> {
                        var product = productService.findProductById(l.getProductId()).orElse(null);
                        BigDecimal base = product != null && product.getBasePrice() != null ? product.getBasePrice() : l.getUnitPrice();
                        BigDecimal discPercent = BigDecimal.ZERO;
                        if (base != null && base.compareTo(BigDecimal.ZERO) > 0 && l.getUnitPrice() != null) {
                            BigDecimal diff = base.subtract(l.getUnitPrice());
                            if (diff.compareTo(BigDecimal.ZERO) > 0) {
                                discPercent = diff.multiply(BigDecimal.valueOf(100)).divide(base, 2, java.math.RoundingMode.HALF_UP);
                            }
                        }
                        return discountService.evaluateLineRisk(l.getProductId(), l.getProductVariantId(), discPercent, null, null);
                    })
                    .filter(Objects::nonNull)
                    .toList();
            riskResult = discountService.aggregateQuotationRisk(lineRisks);
            BigDecimal overallRisk = riskResult != null ? riskResult.getOverallViolationPercent() : BigDecimal.ZERO;
            routeResult = approvalService != null ? approvalService.determineApprovalRouteFromDb(quotation.getCustomerId(), null, overallRisk, quotation.getTotalAmount() != null ? quotation.getTotalAmount() : BigDecimal.ZERO) : null;

            approvalRequired = (riskResult != null && riskResult.isOverallApprovalRequired()) || (routeResult != null && routeResult.isApprovalRequired());
        }

        if (approvalRequired) {
            quotationService.changeQuotationStatus(quotation, "PENDING_APPROVAL");
            quotationService.saveQuotation(quotation);
            if (approvalService != null) {
                try {
                    var pendingApproval = approvalService.createPendingApproval(null, quotation.getId(), null, 1);
                    approvalService.saveApproval(pendingApproval);
                } catch (Exception ignored) {}
            }
            Map<String, Object> response = new HashMap<>();
            response.put("status", "PENDING_APPROVAL");
            response.put("message", "Negotiated quotation terms exceed discount approval thresholds and require manager approval.");
            response.put("quotation", quotation);
            return ResponseEntity.badRequest().body((Object) response);
        }

        // 4. State Machine Execution to CONFIRMED + Atomic Order & Fulfillment Creation
        quotationService.changeQuotationStatus(quotation, "CONFIRMED");
        quotationService.saveQuotation(quotation);

        Order order = fulfillmentService.convertQuotationToOrder(quotation, lines);

        // Execute automated multi-warehouse fulfillment split & stock reservation
        var fulfillmentOrder = fulfillmentService.processOrderFulfillmentSplit(order.getId());

        Invoice invoice = null;
        Payment payment = null;
        if (billingService != null && order != null) {
            try {
                List<OrderLine> orderLines = fulfillmentService.findOrderLinesByOrderId(order.getId());
                invoice = billingService.createInvoiceForOrder(order, orderLines);
                // Record payment only if PIN/payment parameters are explicitly provided
                if (invoice != null && request.pin != null && !request.pin.isBlank()) {
                    String pMethod = (request.paymentMethod != null && !request.paymentMethod.isBlank()) ? request.paymentMethod : "DEMO_PIN_PAYMENT";
                    String ref = "PIN-AUTH-" + request.pin;
                    payment = billingService.recordPayment(invoice.getId(), pMethod, invoice.getTotalAmount(), ref);
                }
            } catch (Exception e) {
                System.err.println("Invoice/Payment generation error: " + e.getMessage());
            }
        }

        List<Subscription> createdSubscriptions = new ArrayList<>();
        BigDecimal monthlySubscriptionTotal = BigDecimal.ZERO;
        BigDecimal oneTimeTotal = BigDecimal.ZERO;

        for (QuotationLine l : lines) {
            var prod = productService != null ? productService.findProductById(l.getProductId()).orElse(null) : null;
            BigDecimal lineAmount = l.getTotalAmount() != null ? l.getTotalAmount() : (l.getUnitPrice() != null ? l.getUnitPrice().multiply(BigDecimal.valueOf(l.getQuantity())) : BigDecimal.ZERO);

            if (prod != null && Boolean.TRUE.equals(prod.getIsSubscription())) {
                monthlySubscriptionTotal = monthlySubscriptionTotal.add(lineAmount);
                if (subscriptionService != null && order != null) {
                    try {
                        Subscription sub = subscriptionService.createSubscription(order.getId(), quotation.getCustomerId(), 1L, lineAmount, null);
                        if (sub != null) {
                            createdSubscriptions.add(sub);
                        }
                    } catch (Exception subErr) {
                        System.err.println("Subscription creation error: " + subErr.getMessage());
                    }
                }
            } else {
                oneTimeTotal = oneTimeTotal.add(lineAmount);
            }
        }

        Map<String, Object> billingBreakdown = new HashMap<>();
        billingBreakdown.put("monthlySubscriptionTotal", monthlySubscriptionTotal);
        billingBreakdown.put("oneTimeTotal", oneTimeTotal);
        billingBreakdown.put("initialTotalPayable", oneTimeTotal.add(monthlySubscriptionTotal));

        Map<String, Object> response = new HashMap<>();
        response.put("status", "CONFIRMED");
        response.put("quotation", quotation);
        response.put("order", order);
        response.put("fulfillmentOrder", fulfillmentOrder);
        response.put("invoice", invoice);
        response.put("payment", payment);
        response.put("subscriptions", createdSubscriptions);
        response.put("billingBreakdown", billingBreakdown);
        return ResponseEntity.ok((Object) response);
    }
}


