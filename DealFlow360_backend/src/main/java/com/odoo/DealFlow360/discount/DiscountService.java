package com.odoo.DealFlow360.discount;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

/**
 * Business service handling validation for DiscountTier and CategoryDiscountCeiling entities,
 * as well as delegating risk calculations to DiscountRiskEngine.
 */
@Service
public class DiscountService {

    private final DiscountRiskEngine discountRiskEngine;

    public DiscountService() {
        this.discountRiskEngine = new DiscountRiskEngine();
    }

    @Autowired
    public DiscountService(DiscountRiskEngine discountRiskEngine) {
        this.discountRiskEngine = discountRiskEngine != null ? discountRiskEngine : new DiscountRiskEngine();
    }

    /**
     * Validates domain constraints on a DiscountTier object.
     */
    public void validateDiscountTier(DiscountTier tier) {
        if (tier == null) {
            throw new IllegalArgumentException("Discount tier cannot be null");
        }
        if (tier.getName() == null || tier.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Discount tier name cannot be null or blank");
        }
        if (tier.getMaxDiscountPercent() != null) {
            if (tier.getMaxDiscountPercent().compareTo(BigDecimal.ZERO) < 0) {
                throw new IllegalArgumentException("Max discount percent cannot be negative");
            }
            if (tier.getMaxDiscountPercent().compareTo(new BigDecimal("100.00")) > 0) {
                throw new IllegalArgumentException("Max discount percent cannot exceed 100%");
            }
        }
    }

    /**
     * Creates and validates a new DiscountTier instance.
     */
    public DiscountTier createDiscountTier(Long id, String name, BigDecimal maxDiscountPercent) {
        DiscountTier tier = new DiscountTier(
                id,
                name != null ? name.trim() : null,
                maxDiscountPercent
        );
        validateDiscountTier(tier);
        return tier;
    }

    /**
     * Validates domain constraints on a CategoryDiscountCeiling object.
     */
    public void validateCategoryDiscountCeiling(CategoryDiscountCeiling ceiling) {
        if (ceiling == null) {
            throw new IllegalArgumentException("Category discount ceiling cannot be null");
        }
        if (ceiling.getCategoryId() == null || ceiling.getCategoryId() <= 0) {
            throw new IllegalArgumentException("Category ID must be a positive number");
        }
        if (ceiling.getTierId() == null || ceiling.getTierId() <= 0) {
            throw new IllegalArgumentException("Tier ID must be a positive number");
        }
        if (ceiling.getMaxDiscountPercent() == null) {
            throw new IllegalArgumentException("Max discount percent cannot be null");
        }
        if (ceiling.getMaxDiscountPercent().compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Max discount percent cannot be negative");
        }
        if (ceiling.getMaxDiscountPercent().compareTo(new BigDecimal("100.00")) > 0) {
            throw new IllegalArgumentException("Max discount percent cannot exceed 100%");
        }
    }

    /**
     * Creates and validates a new CategoryDiscountCeiling instance.
     */
    public CategoryDiscountCeiling createCategoryDiscountCeiling(Long id, Long categoryId, Long tierId, BigDecimal maxDiscountPercent) {
        CategoryDiscountCeiling ceiling = new CategoryDiscountCeiling(id, categoryId, tierId, maxDiscountPercent);
        validateCategoryDiscountCeiling(ceiling);
        return ceiling;
    }

    /**
     * Delegates line discount risk evaluation to DiscountRiskEngine.
     */
    public DiscountLineRiskResult evaluateLineRisk(Long productId, Long productVariantId,
                                                  BigDecimal actualDiscountPercent,
                                                  DiscountTier discountTier,
                                                  CategoryDiscountCeiling categoryCeiling) {
        BigDecimal tierLimit = discountTier != null ? discountTier.getMaxDiscountPercent() : null;
        BigDecimal categoryLimit = categoryCeiling != null ? categoryCeiling.getMaxDiscountPercent() : null;
        return discountRiskEngine.evaluateLineRisk(productId, productVariantId, actualDiscountPercent, tierLimit, categoryLimit);
    }

    /**
     * Delegates quotation aggregated discount risk evaluation to DiscountRiskEngine.
     */
    public DiscountRiskResult aggregateQuotationRisk(List<DiscountLineRiskResult> lineRisks) {
        return discountRiskEngine.aggregateQuotationRisk(lineRisks);
    }
}
