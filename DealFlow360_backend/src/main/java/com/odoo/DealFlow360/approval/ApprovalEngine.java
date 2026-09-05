package com.odoo.DealFlow360.approval;

import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Pure database-independent business engine that evaluates approval chain applicability rules
 * and resolves ordered approval steps based on deterministic rule precedence.
 */
@Component
public class ApprovalEngine {

    /**
     * Determines whether a given ApprovalChainRule matches quotation/customer/discount inputs.
     * Nullable rule criteria act as wildcards (match any value).
     */
    public boolean isRuleMatching(ApprovalChainRule rule, Long customerId, Long tierId,
                                  BigDecimal actualDiscountPercent, BigDecimal quotationTotal) {
        if (rule == null) {
            return false;
        }

        if (rule.getCustomerId() != null && !rule.getCustomerId().equals(customerId)) {
            return false;
        }
        if (rule.getTierId() != null && !rule.getTierId().equals(tierId)) {
            return false;
        }
        if (rule.getMinDiscountPercent() != null) {
            if (actualDiscountPercent == null || actualDiscountPercent.compareTo(rule.getMinDiscountPercent()) < 0) {
                return false;
            }
        }
        if (rule.getMinTotalAmount() != null) {
            if (quotationTotal == null || quotationTotal.compareTo(rule.getMinTotalAmount()) < 0) {
                return false;
            }
        }

        return true;
    }

    /**
     * Selects the single most specific/deterministic rule among multiple matching candidate rules.
     * Precedence Order:
     * 1. Customer-specific rule (non-null customerId > null customerId)
     * 2. Tier-specific rule (non-null tierId > null tierId)
     * 3. Higher minDiscountPercent threshold
     * 4. Higher minTotalAmount threshold
     * 5. Lowest Rule ID (deterministic tie-breaker)
     */
    public ApprovalChainRule selectBestMatchingRule(List<ApprovalChainRule> candidateRules, Long customerId, Long tierId,
                                                    BigDecimal actualDiscountPercent, BigDecimal quotationTotal) {
        if (candidateRules == null || candidateRules.isEmpty()) {
            return null;
        }

        List<ApprovalChainRule> matchingRules = candidateRules.stream()
                .filter(rule -> isRuleMatching(rule, customerId, tierId, actualDiscountPercent, quotationTotal))
                .collect(Collectors.toList());

        if (matchingRules.isEmpty()) {
            return null;
        }

        Comparator<ApprovalChainRule> precedenceComparator = Comparator
                .<ApprovalChainRule, Integer>comparing(rule -> rule.getCustomerId() != null ? 0 : 1)
                .thenComparing(rule -> rule.getTierId() != null ? 0 : 1)
                .thenComparing(rule -> rule.getMinDiscountPercent() != null ? rule.getMinDiscountPercent() : BigDecimal.ZERO, Comparator.reverseOrder())
                .thenComparing(rule -> rule.getMinTotalAmount() != null ? rule.getMinTotalAmount() : BigDecimal.ZERO, Comparator.reverseOrder())
                .thenComparing(rule -> rule.getId() != null ? rule.getId() : Long.MAX_VALUE);

        matchingRules.sort(precedenceComparator);
        return matchingRules.get(0);
    }

    /**
     * Orders and validates approval chain steps for a matched rule.
     * Step numbers must be positive and unique within the rule.
     */
    public List<ApprovalChainStep> resolveAndOrderSteps(Long ruleId, List<ApprovalChainStep> candidateSteps) {
        if (ruleId == null || candidateSteps == null || candidateSteps.isEmpty()) {
            return new ArrayList<>();
        }

        List<ApprovalChainStep> stepsForRule = candidateSteps.stream()
                .filter(step -> step != null && Objects.equals(step.getRuleId(), ruleId))
                .collect(Collectors.toList());

        if (stepsForRule.isEmpty()) {
            return new ArrayList<>();
        }

        Set<Integer> seenStepNumbers = new HashSet<>();
        for (ApprovalChainStep step : stepsForRule) {
            if (step.getStepNumber() == null || step.getStepNumber() <= 0) {
                throw new IllegalArgumentException("Approval chain step number must be a positive integer");
            }
            if (!seenStepNumbers.add(step.getStepNumber())) {
                throw new IllegalStateException("Duplicate step number " + step.getStepNumber() + " found for approval chain rule " + ruleId);
            }
        }

        stepsForRule.sort(Comparator.comparingInt(ApprovalChainStep::getStepNumber));
        return stepsForRule;
    }

    /**
     * Evaluates quotation inputs against candidate rules and steps to produce the complete ApprovalRouteResult.
     */
    public ApprovalRouteResult determineApprovalRoute(List<ApprovalChainRule> candidateRules,
                                                       List<ApprovalChainStep> candidateSteps,
                                                       Long customerId, Long tierId,
                                                       BigDecimal actualDiscountPercent, BigDecimal quotationTotal) {
        ApprovalChainRule bestRule = selectBestMatchingRule(candidateRules, customerId, tierId, actualDiscountPercent, quotationTotal);
        if (bestRule == null) {
            return new ApprovalRouteResult(null, new ArrayList<>(), false);
        }

        List<ApprovalChainStep> orderedSteps = resolveAndOrderSteps(bestRule.getId(), candidateSteps);
        return new ApprovalRouteResult(bestRule, orderedSteps, !orderedSteps.isEmpty());
    }
}
