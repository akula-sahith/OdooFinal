package com.odoo.DealFlow360.recommendation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Business service handling UpsellRule domain validation, recommendation eligibility evaluation,
 * self-recommendation rejection, duplicate rule handling, and deterministic candidate ranking.
 */
@Service
public class RecommendationService {

    private final UpsellRuleRepository ruleRepository;

    public RecommendationService() {
        this.ruleRepository = null;
    }

    @Autowired
    public RecommendationService(UpsellRuleRepository ruleRepository) {
        this.ruleRepository = ruleRepository;
    }

    /**
     * Validates domain constraints on an UpsellRule.
     *
     * Implementation Policy:
     * - Rejects self-recommendation (baseProductId == suggestedProductId).
     *
     * @param rule UpsellRule entity to validate
     */
    public void validateUpsellRule(UpsellRule rule) {
        if (rule == null) {
            throw new IllegalArgumentException("Upsell rule cannot be null");
        }
        if (rule.getBaseProductId() == null || rule.getBaseProductId() <= 0) {
            throw new IllegalArgumentException("Base product ID must be a positive number");
        }
        if (rule.getSuggestedProductId() == null || rule.getSuggestedProductId() <= 0) {
            throw new IllegalArgumentException("Suggested product ID must be a positive number");
        }
        if (rule.getBaseProductId().equals(rule.getSuggestedProductId())) {
            throw new IllegalArgumentException("Self-recommendation is invalid: base product cannot recommend itself");
        }
        if (rule.getMinMarginThreshold() != null && rule.getMinMarginThreshold().compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Minimum margin threshold cannot be negative if specified");
        }
    }

    /**
     * Creates and validates an UpsellRule instance.
     */
    public UpsellRule createUpsellRule(Long id, Long baseProductId, Long suggestedProductId, Boolean isPromoted, BigDecimal minMarginThreshold) {
        UpsellRule rule = new UpsellRule(
                id,
                baseProductId,
                suggestedProductId,
                isPromoted != null ? isPromoted : Boolean.FALSE,
                minMarginThreshold
        );
        validateUpsellRule(rule);
        return rule;
    }

    /**
     * Persists an UpsellRule entity after validation.
     */
    public UpsellRule saveUpsellRule(UpsellRule rule) {
        validateUpsellRule(rule);
        if (ruleRepository != null) {
            return ruleRepository.save(rule);
        }
        return rule;
    }

    /**
     * Finds an UpsellRule by ID.
     */
    public Optional<UpsellRule> findUpsellRuleById(Long id) {
        if (ruleRepository != null && id != null) {
            return ruleRepository.findById(id);
        }
        return Optional.empty();
    }

    /**
     * Finds all UpsellRules associated with a Base Product ID.
     */
    public List<UpsellRule> findUpsellRulesByBaseProductId(Long baseProductId) {
        if (ruleRepository != null && baseProductId != null) {
            return ruleRepository.findByBaseProductId(baseProductId);
        }
        return Collections.emptyList();
    }

    /**
     * Retrieves all UpsellRules.
     */
    public List<UpsellRule> findAllUpsellRules() {
        if (ruleRepository != null) {
            return ruleRepository.findAll();
        }
        return Collections.emptyList();
    }

    /**
     * Deletes an UpsellRule by ID.
     */
    public void deleteUpsellRule(Long id) {
        if (ruleRepository != null && id != null) {
            ruleRepository.deleteById(id);
        }
    }

    /**
     * Evaluates whether an UpsellRule candidate is eligible given the current actual margin percentage.
     *
     * @param rule                Candidate UpsellRule
     * @param actualMarginPercent Current calculated margin percentage (may be null if margin check skipped)
     * @return true if candidate passes all eligibility checks, false otherwise
     */
    public boolean isEligible(UpsellRule rule, BigDecimal actualMarginPercent) {
        if (rule == null) {
            return false;
        }

        // Validate basic state including self-recommendation rejection
        try {
            validateUpsellRule(rule);
        } catch (IllegalArgumentException e) {
            return false;
        }

        // Minimum margin threshold evaluation
        if (rule.getMinMarginThreshold() != null) {
            if (actualMarginPercent == null || actualMarginPercent.compareTo(rule.getMinMarginThreshold()) < 0) {
                return false;
            }
        }

        return true;
    }

    /**
     * Evaluates and ranks recommendation candidates for a given base product.
     *
     * Deterministic Ranking Policy & Duplicate Handling:
     * 1. Filtering: Considers only eligible rules matching baseProductId.
     * 2. Duplicate Resolution: If multiple rules suggest the same suggestedProductId, the rule with
     *    isPromoted = true (or highest minMarginThreshold) is retained.
     * 3. Deterministic Ranking Order:
     *    - Primary sort: Promoted candidates (isPromoted == true) rank ahead of non-promoted candidates.
     *    - Secondary sort: Higher minMarginThreshold (if present).
     *
     * @param baseProductId        Base product ID for recommendations
     * @param candidateRules       List of candidate UpsellRule entries
     * @param actualMarginPercent  Current actual margin percentage
     * @return Ranked list of RecommendationResult entries
     */
    public List<RecommendationResult> evaluateRecommendations(Long baseProductId, List<UpsellRule> candidateRules, BigDecimal actualMarginPercent) {
        if (baseProductId == null || baseProductId <= 0) {
            throw new IllegalArgumentException("Base product ID must be a positive number");
        }
        if (candidateRules == null || candidateRules.isEmpty()) {
            return Collections.emptyList();
        }

        // Filter eligible rules matching baseProductId
        List<UpsellRule> eligibleRules = candidateRules.stream()
                .filter(rule -> rule != null && baseProductId.equals(rule.getBaseProductId()))
                .filter(rule -> isEligible(rule, actualMarginPercent))
                .collect(Collectors.toList());

        // Deduplicate suggested products deterministically
        Map<Long, UpsellRule> deduplicatedMap = new LinkedHashMap<>();
        for (UpsellRule rule : eligibleRules) {
            Long suggestedId = rule.getSuggestedProductId();
            if (!deduplicatedMap.containsKey(suggestedId)) {
                deduplicatedMap.put(suggestedId, rule);
            } else {
                UpsellRule existing = deduplicatedMap.get(suggestedId);
                // Prefer promoted rule over non-promoted rule
                if (!Boolean.TRUE.equals(existing.getIsPromoted()) && Boolean.TRUE.equals(rule.getIsPromoted())) {
                    deduplicatedMap.put(suggestedId, rule);
                }
            }
        }

        // Rank candidates
        List<UpsellRule> rankedRules = new ArrayList<>(deduplicatedMap.values());
        rankedRules.sort(Comparator
                .comparing((UpsellRule r) -> Boolean.TRUE.equals(r.getIsPromoted())).reversed()
                .thenComparing(r -> r.getMinMarginThreshold() != null ? r.getMinMarginThreshold() : BigDecimal.ZERO, Comparator.reverseOrder())
        );

        return rankedRules.stream()
                .map(rule -> new RecommendationResult(
                        rule,
                        rule.getBaseProductId(),
                        rule.getSuggestedProductId(),
                        rule.getIsPromoted(),
                        rule.getMinMarginThreshold()
                ))
                .collect(Collectors.toList());
    }
}

