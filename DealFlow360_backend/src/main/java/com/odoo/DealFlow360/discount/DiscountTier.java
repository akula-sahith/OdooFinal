package com.odoo.DealFlow360.discount;

import java.math.BigDecimal;
import java.util.Objects;

/**
 * Domain model representing a Discount Tier policy classification (DISCOUNT_TIERS table).
 */
public class DiscountTier {

    private Long id;
    private String name;
    private BigDecimal maxDiscountPercent;

    public DiscountTier() {
    }

    public DiscountTier(Long id, String name, BigDecimal maxDiscountPercent) {
        this.id = id;
        this.name = name;
        this.maxDiscountPercent = maxDiscountPercent;
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
        DiscountTier that = (DiscountTier) o;
        return Objects.equals(id, that.id) &&
               Objects.equals(name, that.name) &&
               Objects.equals(maxDiscountPercent, that.maxDiscountPercent);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, maxDiscountPercent);
    }

    @Override
    public String toString() {
        return "DiscountTier{" +
               "id=" + id +
               ", name='" + name + '\'' +
               ", maxDiscountPercent=" + maxDiscountPercent +
               '}';
    }
}
