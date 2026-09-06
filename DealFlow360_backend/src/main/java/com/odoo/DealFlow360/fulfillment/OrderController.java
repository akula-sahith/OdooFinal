package com.odoo.DealFlow360.fulfillment;

import com.odoo.DealFlow360.billing.BillingService;
import com.odoo.DealFlow360.billing.Invoice;
import com.odoo.DealFlow360.billing.Payment;
import com.odoo.DealFlow360.inventory.InventoryService;
import com.odoo.DealFlow360.inventory.Warehouse;
import com.odoo.DealFlow360.quotation.Quotation;
import com.odoo.DealFlow360.quotation.QuotationLine;
import com.odoo.DealFlow360.quotation.QuotationService;
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

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final FulfillmentService fulfillmentService;
    private final QuotationService quotationService;
    private final BillingService billingService;
    private final SubscriptionService subscriptionService;
    private final InventoryService inventoryService;

    @Autowired
    public OrderController(FulfillmentService fulfillmentService,
                           QuotationService quotationService,
                           @Autowired(required = false) BillingService billingService,
                           @Autowired(required = false) SubscriptionService subscriptionService,
                           @Autowired(required = false) InventoryService inventoryService) {
        this.fulfillmentService = fulfillmentService;
        this.quotationService = quotationService;
        this.billingService = billingService;
        this.subscriptionService = subscriptionService;
        this.inventoryService = inventoryService;
    }

    public static class ConfirmQuotationRequest {
        public Long quotationId;
    }

    @PostMapping("/confirm-quotation")
    public ResponseEntity<?> confirmQuotationAndCreateOrder(@RequestBody ConfirmQuotationRequest request) {
        if (request == null || request.quotationId == null || request.quotationId <= 0) {
            return ResponseEntity.badRequest().body("Positive quotation ID is required");
        }

        return quotationService.findQuotationById(request.quotationId)
                .map(quotation -> {
                    List<QuotationLine> qLines = quotationService.findLinesByQuotationId(request.quotationId);
                    Order order = fulfillmentService.convertQuotationToOrder(quotation, qLines);
                    FulfillmentOrder fo = fulfillmentService.processOrderFulfillmentSplit(order.getId());

                    Invoice invoice = null;
                    if (billingService != null) {
                        try {
                            List<OrderLine> oLines = fulfillmentService.findOrderLinesByOrderId(order.getId());
                            invoice = billingService.createInvoiceForOrder(order, oLines);
                        } catch (Exception ignored) {}
                    }

                    Map<String, Object> response = new HashMap<>();
                    response.put("order", order);
                    response.put("fulfillmentOrder", fo);
                    response.put("invoice", invoice);
                    return ResponseEntity.status(HttpStatus.CREATED).body((Object) response);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(fulfillmentService.findAllOrders());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getOrderById(@PathVariable Long id) {
        Optional<Order> orderOpt = fulfillmentService.findOrderById(id);
        if (orderOpt.isEmpty()) {
            orderOpt = fulfillmentService.findOrderByQuotationId(id);
        }

        return orderOpt.map(order -> {
                    Long orderId = order.getId();
                    List<OrderLine> lines = fulfillmentService.findOrderLinesByOrderId(orderId);
                    List<FulfillmentOrder> fos = fulfillmentService.findFulfillmentOrdersByOrderId(orderId);
                    
                    List<FulfillmentSplit> splits = new ArrayList<>();
                    for (FulfillmentOrder fo : fos) {
                        if (fo != null && fo.getId() != null) {
                            splits.addAll(fulfillmentService.findFulfillmentSplitsByFulfillmentOrderId(fo.getId()));
                        }
                    }

                    List<Warehouse> warehouses = inventoryService != null ? inventoryService.findAllWarehouses() : new ArrayList<>();

                    List<Invoice> invoices = new ArrayList<>();
                    List<Payment> payments = new ArrayList<>();
                    if (billingService != null) {
                        List<Invoice> allInvoices = billingService.findAllInvoices();
                        for (Invoice inv : allInvoices) {
                            if (inv != null && orderId.equals(inv.getOrderId())) {
                                invoices.add(inv);
                                payments.addAll(billingService.findPaymentsByInvoiceId(inv.getId()));
                            }
                        }
                    }

                    List<Subscription> subscriptions = new ArrayList<>();
                    if (subscriptionService != null) {
                        List<Subscription> allSubs = subscriptionService.findAllSubscriptions();
                        for (Subscription sub : allSubs) {
                            if (sub != null && orderId.equals(sub.getOrderId())) {
                                subscriptions.add(sub);
                            }
                        }
                    }

                    Quotation quotation = (order.getQuotationId() != null && quotationService != null)
                            ? quotationService.findQuotationById(order.getQuotationId()).orElse(null)
                            : null;

                    Map<String, Object> response = new HashMap<>();
                    response.put("order", order);
                    response.put("lines", lines);
                    response.put("fulfillmentOrders", fos);
                    response.put("fulfillmentSplits", splits);
                    response.put("warehouses", warehouses);
                    response.put("invoices", invoices);
                    response.put("payments", payments);
                    response.put("subscriptions", subscriptions);
                    response.put("quotation", quotation);
                    return ResponseEntity.ok((Object) response);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}

