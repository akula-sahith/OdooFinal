package com.odoo.DealFlow360.inventory;

import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Pure database-independent business engine for inventory evaluation, reservation, and stock availability checks.
 */
@Component
public class InventoryEngine {

    /**
     * Evaluates total available stock across a list of stock entries.
     */
    public int calculateTotalAvailableStock(List<Stock> stockEntries) {
        if (stockEntries == null || stockEntries.isEmpty()) {
            return 0;
        }
        int total = 0;
        for (Stock stock : stockEntries) {
            if (stock != null) {
                total += stock.getAvailableAmount();
            }
        }
        return total;
    }

    /**
     * Validates if a stock entry can fulfill a requested reservation quantity.
     */
    public void validateStockReservation(Stock stock, int requestedQuantity) {
        if (stock == null) {
            throw new IllegalArgumentException("Stock record cannot be null");
        }
        if (requestedQuantity <= 0) {
            throw new IllegalArgumentException("Requested reservation quantity must be positive (> 0)");
        }
        int available = stock.getAvailableAmount();
        if (available < requestedQuantity) {
            throw new IllegalStateException("Insufficient available stock in warehouse " + stock.getWarehouseId() +
                    " for product " + stock.getProductId() + ". Requested: " + requestedQuantity + ", Available: " + available);
        }
    }

    /**
     * Reserves stock on a Stock domain object.
     */
    public void reserveStock(Stock stock, int quantity) {
        validateStockReservation(stock, quantity);
        int currentReserved = stock.getReservedAmount() != null ? stock.getReservedAmount() : 0;
        stock.setReservedAmount(currentReserved + quantity);
    }

    /**
     * Releases reserved stock on a Stock domain object.
     */
    public void releaseStock(Stock stock, int quantity) {
        if (stock == null) {
            throw new IllegalArgumentException("Stock record cannot be null");
        }
        if (quantity <= 0) {
            throw new IllegalArgumentException("Release quantity must be positive (> 0)");
        }
        int currentReserved = stock.getReservedAmount() != null ? stock.getReservedAmount() : 0;
        if (quantity > currentReserved) {
            throw new IllegalStateException("Cannot release " + quantity + " units; only " + currentReserved + " units are reserved");
        }
        stock.setReservedAmount(currentReserved - quantity);
    }

    /**
     * Fulfills (deducts) reserved stock upon shipment.
     */
    public void fulfillReservedStock(Stock stock, int quantity) {
        if (stock == null) {
            throw new IllegalArgumentException("Stock record cannot be null");
        }
        if (quantity <= 0) {
            throw new IllegalArgumentException("Fulfillment quantity must be positive (> 0)");
        }
        int currentReserved = stock.getReservedAmount() != null ? stock.getReservedAmount() : 0;
        int currentOnHand = stock.getOnHandAmount() != null ? stock.getOnHandAmount() : 0;

        if (quantity > currentOnHand) {
            throw new IllegalStateException("Cannot fulfill " + quantity + " units; on-hand balance is " + currentOnHand);
        }

        stock.setOnHandAmount(currentOnHand - quantity);
        stock.setReservedAmount(Math.max(0, currentReserved - quantity));
    }
}
