package com.odoo.DealFlow360.subscription;

import com.odoo.DealFlow360.billing.BillingEngine;
import com.odoo.DealFlow360.fulfillment.OrderLine;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Arrays;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class SubscriptionAndBillingTest {

    private SubscriptionEngine subscriptionEngine;
    private BillingEngine billingEngine;

    @BeforeEach
    void setUp() {
        subscriptionEngine = new SubscriptionEngine();
        billingEngine = new BillingEngine();
    }

    @Test
    @DisplayName("Should generate monthly recurring billing dates correctly")
    void testMonthlyBillingDatesGeneration() {
        Instant start = Instant.parse("2026-01-01T00:00:00Z");
        Instant end = subscriptionEngine.calculatePeriodEnd(start, "MONTHLY");

        List<Instant> dates = subscriptionEngine.generateBillingDates(start, end, "MONTHLY");
        assertThat(dates).isNotEmpty();
    }

    @Test
    @DisplayName("Should calculate pro-rata cancellation refund correctly")
    void testProRataRefundCalculation() {
        Instant start = Instant.parse("2026-01-01T00:00:00Z");
        Instant end = Instant.parse("2026-01-31T00:00:00Z"); // 30 days
        Instant cancel = Instant.parse("2026-01-16T00:00:00Z"); // 15 days remaining

        BigDecimal recurringAmount = new BigDecimal("100.00");
        BigDecimal refund = subscriptionEngine.calculateProRataRefund(recurringAmount, start, end, cancel);

        assertThat(refund).isEqualTo(new BigDecimal("50.00"));
    }

    @Test
    @DisplayName("Should categorize hybrid order lines into one-time upfront vs recurring subscription lines")
    void testHybridBillingCategorization() {
        OrderLine oneTime = new OrderLine(1L, 10L, 100L, null, 1, new BigDecimal("500.00"), BigDecimal.ZERO, new BigDecimal("500.00"), BigDecimal.ZERO, new BigDecimal("500.00"), false);
        OrderLine recurring = new OrderLine(2L, 10L, 200L, null, 1, new BigDecimal("100.00"), BigDecimal.ZERO, new BigDecimal("100.00"), BigDecimal.ZERO, new BigDecimal("100.00"), true);

        BillingEngine.HybridBillingBreakdown breakdown = billingEngine.categorizeOrderLines(Arrays.asList(oneTime, recurring));

        assertThat(breakdown.getOneTimeLines()).hasSize(1);
        assertThat(breakdown.getSubscriptionLines()).hasSize(1);
        assertThat(breakdown.getOneTimeTotal()).isEqualTo(new BigDecimal("500.00"));
        assertThat(breakdown.getSubscriptionTotal()).isEqualTo(new BigDecimal("100.00"));
    }
}
