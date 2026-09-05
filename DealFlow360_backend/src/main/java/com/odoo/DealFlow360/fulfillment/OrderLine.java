package com.odoo.DealFlow360.fulfillment;

import java.math.BigDecimal;
import java.util.Objects;

/**
 * Domain model representing an Order Line (ORDER_LINES table).
 */
public class OrderLine {

    private Long id;
    private Long orderId;
    private Long productId;
    private Long productVariantId;
    private Integer quantity;
    private BigDecimal unitPrice;
    private BigDecimal taxPercent;
    private BigDecimal subtotalAmount;
    private BigDecimal taxAmount;
    private BigDecimal totalAmount;
    private Boolean isSubscription;

    public OrderLine() {
    }

    public OrderLine(Long id, Long orderId, Long productId, Long productVariantId, Integer quantity,
                     BigDecimal unitPrice, BigDecimal taxPercent, BigDecimal subtotalAmount,
                     BigDecimal taxAmount, BigDecimal totalAmount, Boolean isSubscription) {
        this.id = id;
        this.orderId = orderId;
        this.productId = productId;
        this.productVariantId = productVariantId;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.taxPercent = taxPercent;
        this.subtotalAmount = subtotalAmount;
        this.taxAmount = taxAmount;
        this.totalAmount = totalAmount;
        this.isSubscription = isSubscription;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public Long getProductVariantId() {
        return productVariantId;
    }

    public void setProductVariantId(Long productVariantId) {
        this.productVariantId = productVariantId;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(BigDecimal unitPrice) {
        this.unitPrice = unitPrice;
    }

    public BigDecimal getTaxPercent() {
        return taxPercent;
    }

    public void setTaxPercent(BigDecimal taxPercent) {
        this.taxPercent = taxPercent;
    }

    public BigDecimal getSubtotalAmount() {
        return subtotalAmount;
    }

    public void setSubtotalAmount(BigDecimal subtotalAmount) {
        this.subtotalAmount = subtotalAmount;
    }

    public BigDecimal getTaxAmount() {
        return taxAmount;
    }

    public void setTaxAmount(BigDecimal taxAmount) {
        this.taxAmount = taxAmount;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public Boolean getIsSubscription() {
        return isSubscription;
    }

    public void setIsSubscription(Boolean isSubscription) {
        this.isSubscription = isSubscription;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        OrderLine orderLine = (OrderLine) o;
        return Objects.equals(id, orderLine.id) &&
               Objects.equals(orderId, orderLine.orderId) &&
               Objects.equals(productId, orderLine.productId) &&
               Objects.equals(productVariantId, orderLine.productVariantId) &&
               Objects.equals(quantity, orderLine.quantity) &&
               Objects.equals(unitPrice, orderLine.unitPrice) &&
               Objects.equals(taxPercent, orderLine.taxPercent) &&
               Objects.equals(subtotalAmount, orderLine.subtotalAmount) &&
               Objects.equals(taxAmount, orderLine.taxAmount) &&
               Objects.equals(totalAmount, orderLine.totalAmount) &&
               Objects.equals(isSubscription, orderLine.isSubscription);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, orderId, productId, productVariantId, quantity, unitPrice, taxPercent, subtotalAmount, taxAmount, totalAmount, isSubscription);
    }

    @Override
    public String toString() {
        return "OrderLine{" +
               "id=" + id +
               ", orderId=" + orderId +
               ", productId=" + productId +
               ", productVariantId=" + productVariantId +
               ", quantity=" + quantity +
               ", unitPrice=" + unitPrice +
               ", taxPercent=" + taxPercent +
               ", subtotalAmount=" + subtotalAmount +
               ", taxAmount=" + taxAmount +
               ", totalAmount=" + totalAmount +
               ", isSubscription=" + isSubscription +
               '}';
    }
}
