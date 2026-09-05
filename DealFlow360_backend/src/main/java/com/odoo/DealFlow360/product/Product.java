package com.odoo.DealFlow360.product;

import java.math.BigDecimal;
import java.util.Objects;

/**
 * Domain model representing a Product in the system (PRODUCTS table).
 */
public class Product {

    private Long id;
    private String name;
    private Long categoryId;
    private BigDecimal basePrice;
    private BigDecimal taxPercent;
    private String currency;
    private Boolean isSubscription;

    public Product() {
    }

    public Product(Long id, String name, Long categoryId, BigDecimal basePrice, BigDecimal taxPercent, String currency, Boolean isSubscription) {
        this.id = id;
        this.name = name;
        this.categoryId = categoryId;
        this.basePrice = basePrice;
        this.taxPercent = taxPercent;
        this.currency = currency;
        this.isSubscription = isSubscription;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public BigDecimal getBasePrice() {
        return basePrice;
    }

    public void setBasePrice(BigDecimal basePrice) {
        this.basePrice = basePrice;
    }

    public BigDecimal getTaxPercent() {
        return taxPercent;
    }

    public void setTaxPercent(BigDecimal taxPercent) {
        this.taxPercent = taxPercent;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
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
        Product product = (Product) o;
        return Objects.equals(id, product.id) &&
               Objects.equals(name, product.name) &&
               Objects.equals(categoryId, product.categoryId) &&
               Objects.equals(basePrice, product.basePrice) &&
               Objects.equals(taxPercent, product.taxPercent) &&
               Objects.equals(currency, product.currency) &&
               Objects.equals(isSubscription, product.isSubscription);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, categoryId, basePrice, taxPercent, currency, isSubscription);
    }

    @Override
    public String toString() {
        return "Product{" +
               "id=" + id +
               ", name='" + name + '\'' +
               ", categoryId=" + categoryId +
               ", basePrice=" + basePrice +
               ", taxPercent=" + taxPercent +
               ", currency='" + currency + '\'' +
               ", isSubscription=" + isSubscription +
               '}';
    }
}
