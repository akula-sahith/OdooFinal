package com.odoo.DealFlow360.dealhealth;

import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;

/**
 * Pure database-independent business engine for identifying stalled deals, discount anomalies, and delivery slippage alerts.
 */
@Component
public class DealHealthEngine {

    /**
     * Evaluates if a quotation is stalled due to inactivity.
     */
    public boolean isStalledDeal(Instant updatedAt, int maxInactiveDays, Instant now) {
        if (updatedAt == null || now == null) {
            return false;
        }
        if (maxInactiveDays <= 0) {
            maxInactiveDays = 7; // Default 7 days threshold
        }
        long daysInactive = ChronoUnit.DAYS.between(updatedAt, now);
        return daysInactive >= maxInactiveDays;
    }

    /**
     * Evaluates if a discount applied on a quotation is an anomaly relative to a sales rep's historical average.
     */
    public boolean isDiscountAnomaly(BigDecimal appliedDiscountPercent, BigDecimal repHistoricalAverageDiscount, BigDecimal anomalyThreshold) {
        if (appliedDiscountPercent == null || appliedDiscountPercent.compareTo(BigDecimal.ZERO) <= 0) {
            return false;
        }
        BigDecimal historicalAvg = repHistoricalAverageDiscount != null ? repHistoricalAverageDiscount : BigDecimal.ZERO;
        BigDecimal threshold = anomalyThreshold != null ? anomalyThreshold : new BigDecimal("10.00"); // Default 10% delta anomaly

        BigDecimal delta = appliedDiscountPercent.subtract(historicalAvg);
        return delta.compareTo(threshold) > 0;
    }

    /**
     * Evaluates if a delivery promise has slipped past its estimated date.
     */
    public boolean isDeliverySlippage(Instant promisedDeliveryDate, Instant currentEstimateDate, Instant now) {
        if (promisedDeliveryDate == null) {
            return false;
        }
        Instant reference = currentEstimateDate != null ? currentEstimateDate : now;
        return reference != null && reference.isAfter(promisedDeliveryDate);
    }
}
