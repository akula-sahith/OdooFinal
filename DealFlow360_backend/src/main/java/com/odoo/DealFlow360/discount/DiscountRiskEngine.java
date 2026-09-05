package com.odoo.DealFlow360.discount;

import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

/**
 * Pure database-independent business engine that evaluates quotation line discount risks against
 * configured customer discount tier limits and category discount ceilings.
 */
@Component
public class DiscountRiskEngine {

    /**
     * Evaluates effective allowed discount limit for a given line based on customer tier policy and category ceiling.
     * Formula: MIN(customerTierMaxDiscount, categoryMaxDiscount)
     */
    public BigDecimal calculateEffectiveAllowedDiscount(BigDecimal customerTierMaxDiscount, BigDecimal categoryMaxDiscount) {
        if (customerTierMaxDiscount != null && categoryMaxDiscount != null) {
            return customerTierMaxDiscount.compareTo(categoryMaxDiscount) <= 0 ? customerTierMaxDiscount : categoryMaxDiscount;
        } else if (customerTierMaxDiscount != null) {
            return customerTierMaxDiscount;
        } else if (categoryMaxDiscount != null) {
            return categoryMaxDiscount;
        } else {
            // Explicit safe default: If no applicable policy exists, allowed discount is 0.00%
            return BigDecimal.ZERO;
        }
    }

    /**
     * Resolves the policy source descriptor for tracking policy precedence.
     */
    public String resolvePolicySource(BigDecimal customerTierMaxDiscount, BigDecimal categoryMaxDiscount) {
        if (customerTierMaxDiscount != null && categoryMaxDiscount != null) {
            return "COMBINED";
        } else if (customerTierMaxDiscount != null) {
            return "CUSTOMER_TIER";
        } else if (categoryMaxDiscount != null) {
            return "CATEGORY_CEILING";
        } else {
            return "NO_POLICY";
        }
    }

    /**
     * Calculates the actual discount percentage represented by a unit price relative to a base unit price.
     * Formula: ((baseUnitPrice - unitPrice) / baseUnitPrice) * 100
     */
    public BigDecimal calculateActualDiscountPercent(BigDecimal baseUnitPrice, BigDecimal unitPrice) {
        if (baseUnitPrice == null || baseUnitPrice.compareTo(BigDecimal.ZERO) <= 0 || unitPrice == null) {
            return BigDecimal.ZERO;
        }
        if (unitPrice.compareTo(baseUnitPrice) >= 0) {
            return BigDecimal.ZERO;
        }
        BigDecimal difference = baseUnitPrice.subtract(unitPrice);
        return difference.divide(baseUnitPrice, 4, RoundingMode.HALF_UP).multiply(new BigDecimal("100"));
    }

    /**
     * Evaluates discount risk for a single quotation line given actual discount percentage and policy thresholds.
     */
    public DiscountLineRiskResult evaluateLineRisk(Long productId, Long productVariantId,
                                                  BigDecimal actualDiscountPercent,
                                                  BigDecimal customerTierMaxDiscount,
                                                  BigDecimal categoryMaxDiscount) {
        BigDecimal actualDiscount = actualDiscountPercent != null && actualDiscountPercent.compareTo(BigDecimal.ZERO) >= 0
                ? actualDiscountPercent : BigDecimal.ZERO;

        BigDecimal effectiveAllowed = calculateEffectiveAllowedDiscount(customerTierMaxDiscount, categoryMaxDiscount);
        String policySource = resolvePolicySource(customerTierMaxDiscount, categoryMaxDiscount);

        BigDecimal rawViolation = actualDiscount.subtract(effectiveAllowed);
        BigDecimal violation = rawViolation.compareTo(BigDecimal.ZERO) > 0 ? rawViolation : BigDecimal.ZERO;
        boolean approvalRequired = violation.compareTo(BigDecimal.ZERO) > 0;

        return new DiscountLineRiskResult(
                productId,
                productVariantId,
                actualDiscount,
                effectiveAllowed,
                violation,
                approvalRequired,
                policySource
        );
    }

    /**
     * Aggregates line-level discount risks into an overall quotation risk result.
     * Formula: Overall violation is defined as the HIGHEST line-level discount violation (MAX(lineViolation)).
     */
    public DiscountRiskResult aggregateQuotationRisk(List<DiscountLineRiskResult> lineRisks) {
        if (lineRisks == null || lineRisks.isEmpty()) {
            return new DiscountRiskResult(BigDecimal.ZERO, false, new ArrayList<>());
        }

        BigDecimal highestViolation = BigDecimal.ZERO;
        boolean anyApprovalRequired = false;

        for (DiscountLineRiskResult lineRisk : lineRisks) {
            if (lineRisk != null) {
                if (lineRisk.getViolationPercent() != null && lineRisk.getViolationPercent().compareTo(highestViolation) > 0) {
                    highestViolation = lineRisk.getViolationPercent();
                }
                if (lineRisk.isApprovalRequired()) {
                    anyApprovalRequired = true;
                }
            }
        }

        return new DiscountRiskResult(highestViolation, anyApprovalRequired, lineRisks);
    }
}
