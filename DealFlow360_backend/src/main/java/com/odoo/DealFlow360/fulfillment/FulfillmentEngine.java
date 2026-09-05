package com.odoo.DealFlow360.fulfillment;

import com.odoo.DealFlow360.inventory.Stock;
import com.odoo.DealFlow360.inventory.Warehouse;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Pure database-independent business engine for calculating optimal multi-warehouse fulfillment splits,
 * minimizing shipments, and managing backorders.
 */
@Component
public class FulfillmentEngine {

    public static class SplitRecommendation {
        private final Long orderLineId;
        private final Long warehouseId;
        private final int quantityAllocated;
        private final boolean isBackorder;

        public SplitRecommendation(Long orderLineId, Long warehouseId, int quantityAllocated, boolean isBackorder) {
            this.orderLineId = orderLineId;
            this.warehouseId = warehouseId;
            this.quantityAllocated = quantityAllocated;
            this.isBackorder = isBackorder;
        }

        public Long getOrderLineId() { return orderLineId; }
        public Long getWarehouseId() { return warehouseId; }
        public int getQuantityAllocated() { return quantityAllocated; }
        public boolean isBackorder() { return isBackorder; }
    }

    /**
     * Calculates optimal warehouse split for a single order line given available stock entries across warehouses.
     * Algorithm Precedence:
     * 1. Check if a single warehouse can fulfill the entire quantity (minimizing total shipments = 1). If multiple single warehouses can, pick the one with lowest shipping weight factor.
     * 2. If no single warehouse has full stock, sort warehouses by highest available stock, then lowest shipping weight factor, and allocate iteratively until quantity is fulfilled.
     * 3. Any remaining unallocated quantity is flagged as BACKORDER.
     */
    public List<SplitRecommendation> calculateLineSplit(OrderLine line, List<Warehouse> warehouses, List<Stock> availableStockList) {
        List<SplitRecommendation> recommendations = new ArrayList<>();
        if (line == null || line.getQuantity() == null || line.getQuantity() <= 0) {
            return recommendations;
        }

        int requiredQty = line.getQuantity();
        Long productId = line.getProductId();

        Map<Long, Warehouse> warehouseMap = warehouses.stream()
                .filter(w -> w != null && w.getId() != null)
                .collect(Collectors.toMap(Warehouse::getId, w -> w, (w1, w2) -> w1));

        List<Stock> validStock = availableStockList.stream()
                .filter(s -> s != null && s.getProductId() != null && s.getProductId().equals(productId))
                .filter(s -> s.getAvailableAmount() > 0)
                .collect(Collectors.toList());

        // 1. Single warehouse complete fulfillment check
        List<Stock> singleFulfillers = validStock.stream()
                .filter(s -> s.getAvailableAmount() >= requiredQty)
                .sorted(Comparator.comparing((Stock s) -> {
                    Warehouse w = warehouseMap.get(s.getWarehouseId());
                    return w != null && w.getShippingWeightFactor() != null ? w.getShippingWeightFactor() : BigDecimal.ONE;
                }))
                .collect(Collectors.toList());

        if (!singleFulfillers.isEmpty()) {
            Stock chosen = singleFulfillers.get(0);
            recommendations.add(new SplitRecommendation(line.getId(), chosen.getWarehouseId(), requiredQty, false));
            return recommendations;
        }

        // 2. Multi-warehouse partial split (sort by available DESC, then weight factor ASC)
        List<Stock> sortedStock = validStock.stream()
                .sorted(Comparator.comparingInt(Stock::getAvailableAmount).reversed()
                        .thenComparing(s -> {
                            Warehouse w = warehouseMap.get(s.getWarehouseId());
                            return w != null && w.getShippingWeightFactor() != null ? w.getShippingWeightFactor() : BigDecimal.ONE;
                        }))
                .collect(Collectors.toList());

        int remaining = requiredQty;
        for (Stock stock : sortedStock) {
            if (remaining <= 0) break;
            int take = Math.min(stock.getAvailableAmount(), remaining);
            if (take > 0) {
                recommendations.add(new SplitRecommendation(line.getId(), stock.getWarehouseId(), take, false));
                remaining -= take;
            }
        }

        // 3. Backorder remainder
        if (remaining > 0) {
            Long defaultWarehouseId = warehouses != null && !warehouses.isEmpty() ? warehouses.get(0).getId() : 1L;
            recommendations.add(new SplitRecommendation(line.getId(), defaultWarehouseId, remaining, true));
        }

        return recommendations;
    }
}
