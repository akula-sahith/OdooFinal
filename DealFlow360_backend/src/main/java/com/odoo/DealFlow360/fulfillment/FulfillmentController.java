package com.odoo.DealFlow360.fulfillment;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@RestController
@RequestMapping("/api/fulfillment")
public class FulfillmentController {

    private final FulfillmentService fulfillmentService;

    @Autowired
    public FulfillmentController(FulfillmentService fulfillmentService) {
        this.fulfillmentService = fulfillmentService;
    }

    public static class OverrideSplitRequest {
        public Long orderId;
        public List<FulfillmentService.ManualSplitItem> splits;
    }

    @GetMapping("/orders/{orderId}")
    public ResponseEntity<List<FulfillmentOrder>> getFulfillmentOrdersByOrderId(@PathVariable Long orderId) {
        return ResponseEntity.ok(fulfillmentService.findFulfillmentOrdersByOrderId(orderId));
    }

    @GetMapping("/splits/{fulfillmentOrderId}")
    public ResponseEntity<List<FulfillmentSplit>> getSplitsByFulfillmentOrderId(@PathVariable Long fulfillmentOrderId) {
        return ResponseEntity.ok(fulfillmentService.findFulfillmentSplitsByFulfillmentOrderId(fulfillmentOrderId));
    }

    @PostMapping("/process/{orderId}")
    public ResponseEntity<?> processFulfillment(@PathVariable Long orderId) {
        try {
            FulfillmentOrder fo = fulfillmentService.processOrderFulfillmentSplit(orderId);
            return ResponseEntity.ok(fo);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/splits/override")
    public ResponseEntity<?> overrideFulfillmentSplit(@RequestBody OverrideSplitRequest request) {
        if (request == null || request.orderId == null) {
            return ResponseEntity.badRequest().body("Order ID is required");
        }
        try {
            FulfillmentOrder fo = fulfillmentService.overrideFulfillmentSplit(request.orderId, request.splits);
            return ResponseEntity.ok(fo);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
