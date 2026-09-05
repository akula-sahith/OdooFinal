package com.odoo.DealFlow360.dealhealth;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;

import static org.assertj.core.api.Assertions.assertThat;

class DealHealthTest {

    private DealHealthEngine engine;

    @BeforeEach
    void setUp() {
        engine = new DealHealthEngine();
    }

    @Test
    @DisplayName("Should detect stalled deal when inactive beyond threshold days")
    void testStalledDealDetection() {
        Instant now = Instant.now();
        Instant activeUpdate = now.minus(2, ChronoUnit.DAYS);
        Instant stalledUpdate = now.minus(10, ChronoUnit.DAYS);

        assertThat(engine.isStalledDeal(activeUpdate, 7, now)).isFalse();
        assertThat(engine.isStalledDeal(stalledUpdate, 7, now)).isTrue();
    }

    @Test
    @DisplayName("Should detect discount anomaly when applied discount exceeds rep historical average by threshold")
    void testDiscountAnomalyDetection() {
        BigDecimal repHistoricalAvg = new BigDecimal("5.00"); // 5% rep avg
        BigDecimal normalDiscount = new BigDecimal("12.00");  // 12% applied (+7% delta -> fine)
        BigDecimal anomalyDiscount = new BigDecimal("25.00"); // 25% applied (+20% delta -> anomaly)

        assertThat(engine.isDiscountAnomaly(normalDiscount, repHistoricalAvg, new BigDecimal("10.00"))).isFalse();
        assertThat(engine.isDiscountAnomaly(anomalyDiscount, repHistoricalAvg, new BigDecimal("10.00"))).isTrue();
    }
}
