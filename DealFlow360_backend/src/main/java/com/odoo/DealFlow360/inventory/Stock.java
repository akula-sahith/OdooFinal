package com.odoo.DealFlow360.inventory;

import java.util.Objects;

/**
 * Domain model representing Stock levels in a specific Warehouse (STOCK table).
 */
public class Stock {

    private Long id;
    private Long warehouseId;
    private Long productId;
    private Integer onHandAmount;
    private Integer reservedAmount;

    public Stock() {
    }

    public Stock(Long id, Long warehouseId, Long productId, Integer onHandAmount, Integer reservedAmount) {
        this.id = id;
        this.warehouseId = warehouseId;
        this.productId = productId;
        this.onHandAmount = onHandAmount;
        this.reservedAmount = reservedAmount;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getWarehouseId() {
        return warehouseId;
    }

    public void setWarehouseId(Long warehouseId) {
        this.warehouseId = warehouseId;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public Integer getOnHandAmount() {
        return onHandAmount;
    }

    public void setOnHandAmount(Integer onHandAmount) {
        this.onHandAmount = onHandAmount;
    }

    public Integer getReservedAmount() {
        return reservedAmount;
    }

    public void setReservedAmount(Integer reservedAmount) {
        this.reservedAmount = reservedAmount;
    }

    public int getAvailableAmount() {
        int onHand = onHandAmount != null ? onHandAmount : 0;
        int reserved = reservedAmount != null ? reservedAmount : 0;
        return Math.max(0, onHand - reserved);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Stock stock = (Stock) o;
        return Objects.equals(id, stock.id) &&
               Objects.equals(warehouseId, stock.warehouseId) &&
               Objects.equals(productId, stock.productId) &&
               Objects.equals(onHandAmount, stock.onHandAmount) &&
               Objects.equals(reservedAmount, stock.reservedAmount);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, warehouseId, productId, onHandAmount, reservedAmount);
    }

    @Override
    public String toString() {
        return "Stock{" +
               "id=" + id +
               ", warehouseId=" + warehouseId +
               ", productId=" + productId +
               ", onHandAmount=" + onHandAmount +
               ", reservedAmount=" + reservedAmount +
               '}';
    }
}
