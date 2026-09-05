package com.odoo.DealFlow360.subscription;

import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

/**
 * Pure database-independent business engine for recurring subscription billing schedule generation,
 * proration rules, and cancellation refund calculations.
 */
@Component
public class SubscriptionEngine {

    /**
     * Calculates period end instant based on billing cycle.
     */
    public Instant calculatePeriodEnd(Instant start, String billingCycle) {
        if (start == null) {
            throw new IllegalArgumentException("Start instant cannot be null");
        }
        String cycle = billingCycle != null ? billingCycle.trim().toUpperCase() : "MONTHLY";
        ZonedDateTime zdt = start.atZone(ZoneId.of("UTC"));
        switch (cycle) {
            case "QUARTERLY":
                return zdt.plusMonths(3).toInstant();
            case "YEARLY":
                return zdt.plusYears(1).toInstant();
            case "MONTHLY":
            default:
                return zdt.plusMonths(1).toInstant();
        }
    }

    /**
     * Generates recurring billing schedule dates across a period.
     */
    public List<Instant> generateBillingDates(Instant start, Instant end, String billingCycle) {
        List<Instant> dates = new ArrayList<>();
        if (start == null || end == null || start.isAfter(end)) {
            return dates;
        }

        String cycle = billingCycle != null ? billingCycle.trim().toUpperCase() : "MONTHLY";
        ZonedDateTime current = start.atZone(ZoneId.of("UTC"));
        ZonedDateTime cutoff = end.atZone(ZoneId.of("UTC"));

        while (!current.isAfter(cutoff)) {
            dates.add(current.toInstant());
            switch (cycle) {
                case "QUARTERLY":
                    current = current.plusMonths(3);
                    break;
                case "YEARLY":
                    current = current.plusYears(1);
                    break;
                case "MONTHLY":
                default:
                    current = current.plusMonths(1);
                    break;
            }
        }
        return dates;
    }

    /**
     * Calculates pro-rata refund amount for early subscription cancellation.
     * Formula: remainingDays / totalDays * recurringAmount
     */
    public BigDecimal calculateProRataRefund(BigDecimal recurringAmount, Instant periodStart, Instant periodEnd, Instant cancelInstant) {
        if (recurringAmount == null || recurringAmount.compareTo(BigDecimal.ZERO) <= 0) {
            return BigDecimal.ZERO;
        }
        if (periodStart == null || periodEnd == null || cancelInstant == null) {
            return BigDecimal.ZERO;
        }
        if (cancelInstant.isBefore(periodStart) || cancelInstant.isAfter(periodEnd)) {
            return BigDecimal.ZERO;
        }

        long totalDays = ChronoUnit.DAYS.between(periodStart, periodEnd);
        if (totalDays <= 0) {
            return BigDecimal.ZERO;
        }

        long remainingDays = ChronoUnit.DAYS.between(cancelInstant, periodEnd);
        if (remainingDays <= 0) {
            return BigDecimal.ZERO;
        }

        BigDecimal fraction = BigDecimal.valueOf(remainingDays).divide(BigDecimal.valueOf(totalDays), 6, RoundingMode.HALF_UP);
        return recurringAmount.multiply(fraction).setScale(2, RoundingMode.HALF_UP);
    }
}
