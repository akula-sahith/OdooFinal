package com.odoo.DealFlow360.recommendation;

import java.math.BigDecimal;
import java.util.Objects;

/**
 * Domain model representing an Upsell Rule in the system (UPSELL_RULES table).
 */
public class UpsellRule {

    private Long id;
    private Long baseProductId;
    private Long suggestedProductId;
    private Boolean isPromoted;
    private BigDecimal minMarginThreshold;

    public UpsellRule() {
    }

    public UpsellRule(Long id, Long baseProductId, Long suggestedProductId, Boolean isPromoted, BigDecimal minMarginThreshold) {
        this.id = id;
        this.baseProductId = baseProductId;
        this.suggestedProductId = suggestedProductId;
        this.isPromoted = isPromoted;
        this.minMarginThreshold = minMarginThreshold;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getBaseProductId() {
        return baseProductId;
    }

    public void setBaseProductId(Long baseProductId) {
        this.baseProductId = baseProductId;
    }

    public Long getSuggestedProductId() {
        return suggestedProductId;
    }

    public void setSuggestedProductId(Long suggestedProductId) {
        this.suggestedProductId = suggestedProductId;
    }

    public Boolean getIsPromoted() {
        return isPromoted;
    }

    public void setIsPromoted(Boolean isPromoted) {
        this.isPromoted = isPromoted;
    }

    public BigDecimal getMinMarginThreshold() {
        return minMarginThreshold;
    }

    public void setMinMarginThreshold(BigDecimal minMarginThreshold) {
        this.minMarginThreshold = minMarginThreshold;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UpsellRule that = (UpsellRule) o;
        return Objects.equals(id, that.id) &&
               Objects.equals(baseProductId, that.baseProductId) &&
               Objects.equals(suggestedProductId, that.suggestedProductId) &&
               Objects.equals(isPromoted, that.isPromoted) &&
               Objects.equals(minMarginThreshold, that.minMarginThreshold);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, baseProductId, suggestedProductId, isPromoted, minMarginThreshold);
    }

    @Override
    public String toString() {
        return "UpsellRule{" +
               "id=" + id +
               ", baseProductId=" + baseProductId +
               ", suggestedProductId=" + suggestedProductId +
               ", isPromoted=" + isPromoted +
               ", minMarginThreshold=" + minMarginThreshold +
               '}';
    }
}
