package com.odoo.DealFlow360.recommendation;

import java.math.BigDecimal;
import java.util.Objects;

/**
 * Result value object representing an evaluated recommendation candidate.
 */
public class RecommendationResult {

    private final UpsellRule rule;
    private final Long baseProductId;
    private final Long suggestedProductId;
    private final Boolean isPromoted;
    private final BigDecimal minMarginThreshold;

    public RecommendationResult(UpsellRule rule, Long baseProductId, Long suggestedProductId, Boolean isPromoted, BigDecimal minMarginThreshold) {
        this.rule = rule;
        this.baseProductId = baseProductId;
        this.suggestedProductId = suggestedProductId;
        this.isPromoted = isPromoted != null ? isPromoted : Boolean.FALSE;
        this.minMarginThreshold = minMarginThreshold;
    }

    public UpsellRule getRule() {
        return rule;
    }

    public Long getBaseProductId() {
        return baseProductId;
    }

    public Long getSuggestedProductId() {
        return suggestedProductId;
    }

    public Boolean getIsPromoted() {
        return isPromoted;
    }

    public BigDecimal getMinMarginThreshold() {
        return minMarginThreshold;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        RecommendationResult that = (RecommendationResult) o;
        return Objects.equals(rule, that.rule) &&
               Objects.equals(baseProductId, that.baseProductId) &&
               Objects.equals(suggestedProductId, that.suggestedProductId) &&
               Objects.equals(isPromoted, that.isPromoted) &&
               Objects.equals(minMarginThreshold, that.minMarginThreshold);
    }

    @Override
    public int hashCode() {
        return Objects.hash(rule, baseProductId, suggestedProductId, isPromoted, minMarginThreshold);
    }

    @Override
    public String toString() {
        return "RecommendationResult{" +
               "baseProductId=" + baseProductId +
               ", suggestedProductId=" + suggestedProductId +
               ", isPromoted=" + isPromoted +
               ", minMarginThreshold=" + minMarginThreshold +
               '}';
    }
}
