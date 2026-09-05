package com.odoo.DealFlow360.product;

import java.math.BigDecimal;
import java.util.Objects;

/**
 * Domain model representing a Product Variant in the system (PRODUCT_VARIANTS table).
 */
public class ProductVariant {

    private Long id;
    private Long productId;
    private String attributeName;
    private String value;
    private BigDecimal extraPrice;

    public ProductVariant() {
    }

    public ProductVariant(Long id, Long productId, String attributeName, String value, BigDecimal extraPrice) {
        this.id = id;
        this.productId = productId;
        this.attributeName = attributeName;
        this.value = value;
        this.extraPrice = extraPrice;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getAttributeName() {
        return attributeName;
    }

    public void setAttributeName(String attributeName) {
        this.attributeName = attributeName;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public BigDecimal getExtraPrice() {
        return extraPrice;
    }

    public void setExtraPrice(BigDecimal extraPrice) {
        this.extraPrice = extraPrice;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ProductVariant that = (ProductVariant) o;
        return Objects.equals(id, that.id) &&
               Objects.equals(productId, that.productId) &&
               Objects.equals(attributeName, that.attributeName) &&
               Objects.equals(value, that.value) &&
               Objects.equals(extraPrice, that.extraPrice);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, productId, attributeName, value, extraPrice);
    }

    @Override
    public String toString() {
        return "ProductVariant{" +
               "id=" + id +
               ", productId=" + productId +
               ", attributeName='" + attributeName + '\'' +
               ", value='" + value + '\'' +
               ", extraPrice=" + extraPrice +
               '}';
    }
}
