package com.odoo.DealFlow360.fulfillment;

import com.odoo.DealFlow360.inventory.InventoryEngine;
import com.odoo.DealFlow360.inventory.Stock;
import com.odoo.DealFlow360.inventory.Warehouse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class InventoryAndFulfillmentTest {

    private InventoryEngine inventoryEngine;
    private FulfillmentEngine fulfillmentEngine;

    @BeforeEach
    void setUp() {
        inventoryEngine = new InventoryEngine();
        fulfillmentEngine = new FulfillmentEngine();
    }

    @Test
    @DisplayName("Should evaluate total available stock correctly")
    void testAvailableStockCalculation() {
        Stock s1 = new Stock(1L, 1L, 10L, 50, 10); // 40 available
        Stock s2 = new Stock(2L, 2L, 10L, 30, 5);  // 25 available

        int total = inventoryEngine.calculateTotalAvailableStock(Arrays.asList(s1, s2));
        assertThat(total).isEqualTo(65);
    }

    @Test
    @DisplayName("Should reserve stock and prevent over-reservation")
    void testStockReservation() {
        Stock stock = new Stock(1L, 1L, 10L, 50, 10); // 40 available
        inventoryEngine.reserveStock(stock, 30);
        assertThat(stock.getReservedAmount()).isEqualTo(40);

        assertThatThrownBy(() -> inventoryEngine.reserveStock(stock, 20))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("Insufficient available stock");
    }

    @Test
    @DisplayName("Should prioritize single warehouse fulfillment over multi-split when stock is sufficient")
    void testSingleWarehouseFulfillmentSplit() {
        Warehouse w1 = new Warehouse(1L, "Main Warehouse", "East", new BigDecimal("1.50"));
        Warehouse w2 = new Warehouse(2L, "West Depot", "West", new BigDecimal("1.00")); // Lower weight factor

        Stock s1 = new Stock(1L, 1L, 10L, 100, 0); // 100 available
        Stock s2 = new Stock(2L, 2L, 10L, 100, 0); // 100 available

        OrderLine line = new OrderLine(1L, 10L, 10L, null, 50, new BigDecimal("100.00"), BigDecimal.ZERO, new BigDecimal("5000.00"), BigDecimal.ZERO, new BigDecimal("5000.00"), false);

        List<FulfillmentEngine.SplitRecommendation> splits = fulfillmentEngine.calculateLineSplit(line, Arrays.asList(w1, w2), Arrays.asList(s1, s2));

        assertThat(splits).hasSize(1);
        assertThat(splits.get(0).getWarehouseId()).isEqualTo(2L); // Chose lower weight factor warehouse
        assertThat(splits.get(0).getQuantityAllocated()).isEqualTo(50);
        assertThat(splits.get(0).isBackorder()).isFalse();
    }

    @Test
    @DisplayName("Should perform multi-warehouse split when no single warehouse has sufficient stock")
    void testMultiWarehouseFulfillmentSplit() {
        Warehouse w1 = new Warehouse(1L, "Main Warehouse", "East", new BigDecimal("1.00"));
        Warehouse w2 = new Warehouse(2L, "East Depot", "East", new BigDecimal("1.20"));

        Stock s1 = new Stock(1L, 1L, 10L, 30, 0); // 30 available
        Stock s2 = new Stock(2L, 2L, 10L, 30, 0); // 30 available

        OrderLine line = new OrderLine(1L, 10L, 10L, null, 50, new BigDecimal("100.00"), BigDecimal.ZERO, new BigDecimal("5000.00"), BigDecimal.ZERO, new BigDecimal("5000.00"), false);

        List<FulfillmentEngine.SplitRecommendation> splits = fulfillmentEngine.calculateLineSplit(line, Arrays.asList(w1, w2), Arrays.asList(s1, s2));

        assertThat(splits).hasSize(2);
        int totalAllocated = splits.stream().mapToInt(FulfillmentEngine.SplitRecommendation::getQuantityAllocated).sum();
        assertThat(totalAllocated).isEqualTo(50);
    }
}
