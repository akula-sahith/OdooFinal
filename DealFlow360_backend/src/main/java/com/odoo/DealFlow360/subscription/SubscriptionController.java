package com.odoo.DealFlow360.subscription;

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
import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/subscriptions")
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    @Autowired
    public SubscriptionController(SubscriptionService subscriptionService) {
        this.subscriptionService = subscriptionService;
    }

    public static class CreateSubscriptionRequest {
        public Long orderId;
        public Long customerId;
        public Long planId;
        public BigDecimal recurringAmount;
    }

    @PostMapping("/plans")
    public ResponseEntity<?> createPlan(@RequestBody SubscriptionPlan plan) {
        try {
            SubscriptionPlan saved = subscriptionService.saveSubscriptionPlan(plan);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/plans")
    public ResponseEntity<List<SubscriptionPlan>> getAllPlans() {
        return ResponseEntity.ok(subscriptionService.findAllPlans());
    }

    @GetMapping
    public ResponseEntity<List<Subscription>> getAllSubscriptions() {
        return ResponseEntity.ok(subscriptionService.findAllSubscriptions());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getSubscriptionById(@PathVariable Long id) {
        return subscriptionService.findSubscriptionById(id)
                .map(sub -> {
                    List<SubscriptionBillingSchedule> schedules = subscriptionService.findSchedulesBySubscriptionId(id);
                    Map<String, Object> response = new HashMap<>();
                    response.put("subscription", sub);
                    response.put("billingSchedules", schedules);
                    return ResponseEntity.ok((Object) response);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createSubscription(@RequestBody CreateSubscriptionRequest request) {
        if (request == null || request.customerId == null || request.planId == null) {
            return ResponseEntity.badRequest().body("Customer ID and Plan ID are required");
        }
        try {
            Subscription sub = subscriptionService.createSubscription(request.orderId, request.customerId, request.planId, request.recurringAmount, Instant.now());
            List<SubscriptionBillingSchedule> schedules = subscriptionService.findSchedulesBySubscriptionId(sub.getId());

            Map<String, Object> response = new HashMap<>();
            response.put("subscription", sub);
            response.put("billingSchedules", schedules);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<?> cancelSubscription(@PathVariable Long id) {
        try {
            BigDecimal refund = subscriptionService.cancelSubscription(id, Instant.now());
            Map<String, Object> response = new HashMap<>();
            response.put("status", "CANCELLED");
            response.put("proRataRefund", refund);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
