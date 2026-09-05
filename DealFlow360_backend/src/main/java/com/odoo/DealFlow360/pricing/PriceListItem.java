package com.odoo.DealFlow360.pricing;

import java.math.BigDecimal;
import java.util.Objects;

/**
 * Domain model representing a Price List Item in the system (PRICE_LIST_ITEMS table).
 */
public class PriceListItem {

    private Long id;
    private Long priceListId;
    private Long productId;
    private Long productVariantId;
    private BigDecimal unitPrice;
    private Integer minQuantity;

    public PriceListItem() {
    }

    public PriceListItem(Long id, Long priceListId, Long productId, Long productVariantId, BigDecimal unitPrice, Integer minQuantity) {
        this.id = id;
        this.priceListId = priceListId;
        this.productId = productId;
        this.productVariantId = productVariantId;
        this.unitPrice = unitPrice;
        this.minQuantity = minQuantity;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getPriceListId() {
        return priceListId;
    }

    public void setPriceListId(Long priceListId) {
        this.priceListId = priceListId;
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

    public BigDecimal getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(BigDecimal unitPrice) {
        this.unitPrice = unitPrice;
    }

    public Integer getMinQuantity() {
        return minQuantity;
    }

    public void setMinQuantity(Integer minQuantity) {
        this.minQuantity = minQuantity;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        PriceListItem that = (PriceListItem) o;
        return Objects.equals(id, that.id) &&
               Objects.equals(priceListId, that.priceListId) &&
               Objects.equals(productId, that.productId) &&
               Objects.equals(productVariantId, that.productVariantId) &&
               Objects.equals(unitPrice, that.unitPrice) &&
               Objects.equals(minQuantity, that.minQuantity);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, priceListId, productId, productVariantId, unitPrice, minQuantity);
    }

    @Override
    public String toString() {
        return "PriceListItem{" +
               "id=" + id +
               ", priceListId=" + priceListId +
               ", productId=" + productId +
               ", productVariantId=" + productVariantId +
               ", unitPrice=" + unitPrice +
               ", minQuantity=" + minQuantity +
               '}';
    }
}
