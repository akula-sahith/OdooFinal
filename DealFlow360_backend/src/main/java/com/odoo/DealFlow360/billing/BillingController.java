package com.odoo.DealFlow360.billing;

import com.odoo.DealFlow360.fulfillment.FulfillmentService;
import com.odoo.DealFlow360.fulfillment.Order;
import com.odoo.DealFlow360.fulfillment.OrderLine;
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
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/billing")
public class BillingController {

    private final BillingService billingService;
    private final FulfillmentService fulfillmentService;

    @Autowired
    public BillingController(BillingService billingService, FulfillmentService fulfillmentService) {
        this.billingService = billingService;
        this.fulfillmentService = fulfillmentService;
    }

    public static class RecordPaymentRequest {
        public Long invoiceId;
        public String paymentMethod;
        public BigDecimal amount;
        public String reference;
    }

    public static class IssueCreditNoteRequest {
        public Long invoiceId;
        public BigDecimal amount;
        public String reason;
    }

    @PostMapping("/invoices/generate/{orderId}")
    public ResponseEntity<?> generateInvoiceForOrder(@PathVariable Long orderId) {
        if (fulfillmentService == null) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("FulfillmentService not initialized");
        }
        Order order = fulfillmentService.findOrderById(orderId).orElse(null);
        if (order == null) {
            return ResponseEntity.notFound().build();
        }
        List<OrderLine> lines = fulfillmentService.findOrderLinesByOrderId(orderId);
        Invoice invoice = billingService.createInvoiceForOrder(order, lines);
        return ResponseEntity.status(HttpStatus.CREATED).body(invoice);
    }

    @PostMapping("/payments")
    public ResponseEntity<?> recordPayment(@RequestBody RecordPaymentRequest request) {
        if (request == null || request.invoiceId == null || request.amount == null) {
            return ResponseEntity.badRequest().body("Invoice ID and amount are required");
        }
        try {
            Payment payment = billingService.recordPayment(request.invoiceId, request.paymentMethod, request.amount, request.reference);
            return ResponseEntity.status(HttpStatus.CREATED).body(payment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/credit-notes")
    public ResponseEntity<?> issueCreditNote(@RequestBody IssueCreditNoteRequest request) {
        if (request == null || request.invoiceId == null || request.amount == null || request.reason == null) {
            return ResponseEntity.badRequest().body("Invoice ID, amount, and reason are required");
        }
        try {
            CreditNote cn = billingService.issueCreditNote(request.invoiceId, request.amount, request.reason);
            return ResponseEntity.status(HttpStatus.CREATED).body(cn);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/invoices")
    public ResponseEntity<List<Invoice>> getAllInvoices() {
        return ResponseEntity.ok(billingService.findAllInvoices());
    }

    @GetMapping("/payments")
    public ResponseEntity<List<Payment>> getAllPayments() {
        return ResponseEntity.ok(billingService.findAllPayments());
    }

    @GetMapping("/invoices/{id}")
    public ResponseEntity<?> getInvoiceById(@PathVariable Long id) {
        return billingService.findInvoiceById(id)
                .map(invoice -> {
                    List<Payment> payments = billingService.findPaymentsByInvoiceId(id);
                    List<CreditNote> creditNotes = billingService.findCreditNotesByInvoiceId(id);

                    Map<String, Object> response = new HashMap<>();
                    response.put("invoice", invoice);
                    response.put("payments", payments);
                    response.put("creditNotes", creditNotes);
                    return ResponseEntity.ok((Object) response);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
