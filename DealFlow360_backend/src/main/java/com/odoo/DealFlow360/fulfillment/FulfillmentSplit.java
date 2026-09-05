package com.odoo.DealFlow360.fulfillment;

import java.util.Objects;

/**
 * Domain model representing a warehouse fulfillment split (FULFILLMENT_SPLITS table).
 */
public class FulfillmentSplit {

    private Long id;
    private Long fulfillmentOrderId;
    private Long orderLineId;
    private Long warehouseId;
    private Integer quantityAllocated;
    private Integer quantityShipped;
    private String backorderSource;

    public FulfillmentSplit() {
    }

    public FulfillmentSplit(Long id, Long fulfillmentOrderId, Long orderLineId, Long warehouseId,
                            Integer quantityAllocated, Integer quantityShipped, String backorderSource) {
        this.id = id;
        this.fulfillmentOrderId = fulfillmentOrderId;
        this.orderLineId = orderLineId;
        this.warehouseId = warehouseId;
        this.quantityAllocated = quantityAllocated;
        this.quantityShipped = quantityShipped;
        this.backorderSource = backorderSource;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getFulfillmentOrderId() {
        return fulfillmentOrderId;
    }

    public void setFulfillmentOrderId(Long fulfillmentOrderId) {
        this.fulfillmentOrderId = fulfillmentOrderId;
    }

    public Long getOrderLineId() {
        return orderLineId;
    }

    public void setOrderLineId(Long orderLineId) {
        this.orderLineId = orderLineId;
    }

    public Long getWarehouseId() {
        return warehouseId;
    }

    public void setWarehouseId(Long warehouseId) {
        this.warehouseId = warehouseId;
    }

    public Integer getQuantityAllocated() {
        return quantityAllocated;
    }

    public void setQuantityAllocated(Integer quantityAllocated) {
        this.quantityAllocated = quantityAllocated;
    }

    public Integer getQuantityShipped() {
        return quantityShipped;
    }

    public void setQuantityShipped(Integer quantityShipped) {
        this.quantityShipped = quantityShipped;
    }

    public String getBackorderSource() {
        return backorderSource;
    }

    public void setBackorderSource(String backorderSource) {
        this.backorderSource = backorderSource;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        FulfillmentSplit that = (FulfillmentSplit) o;
        return Objects.equals(id, that.id) &&
               Objects.equals(fulfillmentOrderId, that.fulfillmentOrderId) &&
               Objects.equals(orderLineId, that.orderLineId) &&
               Objects.equals(warehouseId, that.warehouseId) &&
               Objects.equals(quantityAllocated, that.quantityAllocated) &&
               Objects.equals(quantityShipped, that.quantityShipped) &&
               Objects.equals(backorderSource, that.backorderSource);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, fulfillmentOrderId, orderLineId, warehouseId, quantityAllocated, quantityShipped, backorderSource);
    }

    @Override
    public String toString() {
        return "FulfillmentSplit{" +
               "id=" + id +
               ", fulfillmentOrderId=" + fulfillmentOrderId +
               ", orderLineId=" + orderLineId +
               ", warehouseId=" + warehouseId +
               ", quantityAllocated=" + quantityAllocated +
               ", quantityShipped=" + quantityShipped +
               ", backorderSource='" + backorderSource + '\'' +
               '}';
    }
}
