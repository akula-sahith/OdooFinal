package com.odoo.DealFlow360.subscription;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

/**
 * Service managing Subscription Plans, Subscriptions, and Recurring Billing Schedules.
 */
@Service
public class SubscriptionService {

    private final SubscriptionEngine subscriptionEngine;
    private final SubscriptionPlanRepository subscriptionPlanRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final SubscriptionBillingScheduleRepository scheduleRepository;

    public SubscriptionService() {
        this(new SubscriptionEngine(), null, null, null);
    }

    @Autowired
    public SubscriptionService(SubscriptionEngine subscriptionEngine,
                               SubscriptionPlanRepository subscriptionPlanRepository,
                               SubscriptionRepository subscriptionRepository,
                               SubscriptionBillingScheduleRepository scheduleRepository) {
        this.subscriptionEngine = subscriptionEngine != null ? subscriptionEngine : new SubscriptionEngine();
        this.subscriptionPlanRepository = subscriptionPlanRepository;
        this.subscriptionRepository = subscriptionRepository;
        this.scheduleRepository = scheduleRepository;
    }

    @Transactional
    public SubscriptionPlan saveSubscriptionPlan(SubscriptionPlan plan) {
        if (plan == null || plan.getProductId() == null || plan.getName() == null || plan.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Subscription plan name and product ID cannot be null");
        }
        if (subscriptionPlanRepository != null) {
            return subscriptionPlanRepository.save(plan);
        }
        return plan;
    }

    public Optional<SubscriptionPlan> findPlanById(Long id) {
        if (subscriptionPlanRepository != null && id != null) {
            return subscriptionPlanRepository.findById(id);
        }
        return Optional.empty();
    }

    public List<SubscriptionPlan> findPlansByProductId(Long productId) {
        if (subscriptionPlanRepository != null && productId != null) {
            return subscriptionPlanRepository.findByProductId(productId);
        }
        return Collections.emptyList();
    }

    public List<SubscriptionPlan> findAllPlans() {
        if (subscriptionPlanRepository != null) {
            return subscriptionPlanRepository.findAll();
        }
        return Collections.emptyList();
    }

    @Transactional
    public Subscription createSubscription(Long orderId, Long customerId, Long planId, BigDecimal recurringAmount, Instant startInstant) {
        if (customerId == null || customerId <= 0) {
            throw new IllegalArgumentException("Customer ID must be positive");
        }
        if (planId == null || planId <= 0) {
            throw new IllegalArgumentException("Plan ID must be positive");
        }

        SubscriptionPlan plan = findPlanById(planId).orElse(new SubscriptionPlan(planId, 1L, "Default Plan", "MONTHLY", "EXACT_DAY", "PRO_RATA"));

        Instant start = startInstant != null ? startInstant : Instant.now();
        Instant end = subscriptionEngine.calculatePeriodEnd(start, plan.getBillingCycle());

        Subscription sub = new Subscription(null, orderId, customerId, planId, "ACTIVE", start, end, false, Instant.now());
        if (subscriptionRepository != null) {
            sub = subscriptionRepository.save(sub);
        } else {
            sub.setId(1L);
        }

        // Generate billing schedule entries
        List<Instant> billingDates = subscriptionEngine.generateBillingDates(start, end, plan.getBillingCycle());
        if (scheduleRepository != null && recurringAmount != null && recurringAmount.compareTo(BigDecimal.ZERO) > 0) {
            for (Instant bDate : billingDates) {
                SubscriptionBillingSchedule sched = new SubscriptionBillingSchedule(null, sub.getId(), bDate, recurringAmount, "PENDING");
                scheduleRepository.save(sched);
            }
        }

        return sub;
    }

    public Optional<Subscription> findSubscriptionById(Long id) {
        if (subscriptionRepository != null && id != null) {
            return subscriptionRepository.findById(id);
        }
        return Optional.empty();
    }

    public List<Subscription> findSubscriptionsByCustomerId(Long customerId) {
        if (subscriptionRepository != null && customerId != null) {
            return subscriptionRepository.findByCustomerId(customerId);
        }
        return Collections.emptyList();
    }

    public List<Subscription> findAllSubscriptions() {
        if (subscriptionRepository != null) {
            return subscriptionRepository.findAll();
        }
        return Collections.emptyList();
    }

    public List<SubscriptionBillingSchedule> findSchedulesBySubscriptionId(Long subscriptionId) {
        if (scheduleRepository != null && subscriptionId != null) {
            return scheduleRepository.findBySubscriptionId(subscriptionId);
        }
        return Collections.emptyList();
    }

    @Transactional
    public BigDecimal cancelSubscription(Long subscriptionId, Instant cancelInstant) {
        Subscription sub = findSubscriptionById(subscriptionId)
                .orElseThrow(() -> new IllegalArgumentException("Subscription not found with ID: " + subscriptionId));

        sub.setStatus("CANCELLED");
        sub.setCancelAtPeriodEnd(true);

        if (subscriptionRepository != null) {
            subscriptionRepository.save(sub);
        }

        SubscriptionPlan plan = findPlanById(sub.getPlanId()).orElse(new SubscriptionPlan(sub.getPlanId(), 1L, "Default Plan", "MONTHLY", "EXACT_DAY", "PRO_RATA"));
        if ("PRO_RATA".equalsIgnoreCase(plan.getCancellationRefundRule())) {
            List<SubscriptionBillingSchedule> schedules = findSchedulesBySubscriptionId(subscriptionId);
            BigDecimal recurringAmount = schedules.stream()
                    .map(SubscriptionBillingSchedule::getAmount)
                    .filter(a -> a != null)
                    .findFirst()
                    .orElse(BigDecimal.ZERO);
            return subscriptionEngine.calculateProRataRefund(recurringAmount, sub.getCurrentPeriodStart(), sub.getCurrentPeriodEnd(), cancelInstant != null ? cancelInstant : Instant.now());
        }
        return BigDecimal.ZERO;
    }
}
