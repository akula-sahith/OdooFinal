package com.odoo.DealFlow360.discount;

import java.math.BigDecimal;
import java.util.Objects;

/**
 * Domain model representing maximum allowed discount for a product category (CATEGORY_DISCOUNT_CEILINGS table).
 */
public class CategoryDiscountCeiling {

    private Long id;
    private Long categoryId;
    private Long tierId;
    private BigDecimal maxDiscountPercent;

    public CategoryDiscountCeiling() {
    }

    public CategoryDiscountCeiling(Long id, Long categoryId, Long tierId, BigDecimal maxDiscountPercent) {
        this.id = id;
        this.categoryId = categoryId;
        this.tierId = tierId;
        this.maxDiscountPercent = maxDiscountPercent;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public Long getTierId() {
        return tierId;
    }

    public void setTierId(Long tierId) {
        this.tierId = tierId;
    }

    public BigDecimal getMaxDiscountPercent() {
        return maxDiscountPercent;
    }

    public void setMaxDiscountPercent(BigDecimal maxDiscountPercent) {
        this.maxDiscountPercent = maxDiscountPercent;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        CategoryDiscountCeiling that = (CategoryDiscountCeiling) o;
        return Objects.equals(id, that.id) &&
               Objects.equals(categoryId, that.categoryId) &&
               Objects.equals(tierId, that.tierId) &&
               Objects.equals(maxDiscountPercent, that.maxDiscountPercent);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, categoryId, tierId, maxDiscountPercent);
    }

    @Override
    public String toString() {
        return "CategoryDiscountCeiling{" +
               "id=" + id +
               ", categoryId=" + categoryId +
               ", tierId=" + tierId +
               ", maxDiscountPercent=" + maxDiscountPercent +
               '}';
    }
}
