package com.odoo.DealFlow360.fulfillment;

import com.odoo.DealFlow360.quotation.Quotation;
import com.odoo.DealFlow360.quotation.QuotationLine;
import com.odoo.DealFlow360.quotation.QuotationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final FulfillmentService fulfillmentService;
    private final QuotationService quotationService;

    @Autowired
    public OrderController(FulfillmentService fulfillmentService, QuotationService quotationService) {
        this.fulfillmentService = fulfillmentService;
        this.quotationService = quotationService;
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

                    Map<String, Object> response = new HashMap<>();
                    response.put("order", order);
                    response.put("fulfillmentOrder", fo);
                    return ResponseEntity.status(HttpStatus.CREATED).body((Object) response);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getOrderById(@PathVariable Long id) {
        return fulfillmentService.findOrderById(id)
                .map(order -> {
                    List<OrderLine> lines = fulfillmentService.findOrderLinesByOrderId(id);
                    List<FulfillmentOrder> fos = fulfillmentService.findFulfillmentOrdersByOrderId(id);
                    Map<String, Object> response = new HashMap<>();
                    response.put("order", order);
                    response.put("lines", lines);
                    response.put("fulfillmentOrders", fos);
                    return ResponseEntity.ok((Object) response);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
