package com.odoo.DealFlow360.discount;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

/**
 * Business service handling validation for DiscountTier and CategoryDiscountCeiling entities,
 * delegating risk calculations to DiscountRiskEngine, and orchestrating Spring JDBC persistence.
 */
@Service
public class DiscountService {

    private final DiscountRiskEngine discountRiskEngine;
    private final DiscountTierRepository discountTierRepository;
    private final CategoryDiscountCeilingRepository categoryDiscountCeilingRepository;

    public DiscountService() {
        this(new DiscountRiskEngine(), null, null);
    }

    public DiscountService(DiscountRiskEngine discountRiskEngine) {
        this(discountRiskEngine, null, null);
    }

    @Autowired
    public DiscountService(DiscountRiskEngine discountRiskEngine,
                           DiscountTierRepository discountTierRepository,
                           CategoryDiscountCeilingRepository categoryDiscountCeilingRepository) {
        this.discountRiskEngine = discountRiskEngine != null ? discountRiskEngine : new DiscountRiskEngine();
        this.discountTierRepository = discountTierRepository;
        this.categoryDiscountCeilingRepository = categoryDiscountCeilingRepository;
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
     * Persists a DiscountTier record after domain validation.
     */
    @Transactional
    public DiscountTier saveDiscountTier(DiscountTier tier) {
        validateDiscountTier(tier);
        if (discountTierRepository != null) {
            return discountTierRepository.save(tier);
        }
        return tier;
    }

    /**
     * Creates, validates, and persists a new DiscountTier.
     */
    @Transactional
    public DiscountTier saveDiscountTier(Long id, String name, BigDecimal maxDiscountPercent) {
        DiscountTier tier = createDiscountTier(id, name, maxDiscountPercent);
        return saveDiscountTier(tier);
    }

    /**
     * Finds a DiscountTier by ID.
     */
    public Optional<DiscountTier> findDiscountTierById(Long id) {
        if (discountTierRepository != null && id != null) {
            return discountTierRepository.findById(id);
        }
        return Optional.empty();
    }

    /**
     * Finds a DiscountTier by name.
     */
    public Optional<DiscountTier> findDiscountTierByName(String name) {
        if (discountTierRepository != null && name != null) {
            return discountTierRepository.findByName(name);
        }
        return Optional.empty();
    }

    /**
     * Retrieves all DiscountTiers.
     */
    public List<DiscountTier> findAllDiscountTiers() {
        if (discountTierRepository != null) {
            return discountTierRepository.findAll();
        }
        return Collections.emptyList();
    }

    /**
     * Checks if a DiscountTier exists by ID.
     */
    public boolean existsDiscountTierById(Long id) {
        return discountTierRepository != null && id != null && discountTierRepository.existsById(id);
    }

    /**
     * Deletes a DiscountTier by ID.
     */
    @Transactional
    public void deleteDiscountTierById(Long id) {
        if (discountTierRepository != null && id != null) {
            discountTierRepository.deleteById(id);
        }
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
     * Persists a CategoryDiscountCeiling record after domain validation.
     */
    @Transactional
    public CategoryDiscountCeiling saveCategoryDiscountCeiling(CategoryDiscountCeiling ceiling) {
        validateCategoryDiscountCeiling(ceiling);
        if (categoryDiscountCeilingRepository != null) {
            return categoryDiscountCeilingRepository.save(ceiling);
        }
        return ceiling;
    }

    /**
     * Creates, validates, and persists a new CategoryDiscountCeiling.
     */
    @Transactional
    public CategoryDiscountCeiling saveCategoryDiscountCeiling(Long id, Long categoryId, Long tierId, BigDecimal maxDiscountPercent) {
        CategoryDiscountCeiling ceiling = createCategoryDiscountCeiling(id, categoryId, tierId, maxDiscountPercent);
        return saveCategoryDiscountCeiling(ceiling);
    }

    /**
     * Finds a CategoryDiscountCeiling by ID.
     */
    public Optional<CategoryDiscountCeiling> findCategoryDiscountCeilingById(Long id) {
        if (categoryDiscountCeilingRepository != null && id != null) {
            return categoryDiscountCeilingRepository.findById(id);
        }
        return Optional.empty();
    }

    /**
     * Finds a CategoryDiscountCeiling by categoryId and tierId.
     */
    public Optional<CategoryDiscountCeiling> findCategoryDiscountCeilingByCategoryIdAndTierId(Long categoryId, Long tierId) {
        if (categoryDiscountCeilingRepository != null && categoryId != null && tierId != null) {
            return categoryDiscountCeilingRepository.findByCategoryIdAndTierId(categoryId, tierId);
        }
        return Optional.empty();
    }

    /**
     * Finds all CategoryDiscountCeilings for a categoryId.
     */
    public List<CategoryDiscountCeiling> findCategoryDiscountCeilingsByCategoryId(Long categoryId) {
        if (categoryDiscountCeilingRepository != null && categoryId != null) {
            return categoryDiscountCeilingRepository.findByCategoryId(categoryId);
        }
        return Collections.emptyList();
    }

    /**
     * Finds all CategoryDiscountCeilings for a tierId.
     */
    public List<CategoryDiscountCeiling> findCategoryDiscountCeilingsByTierId(Long tierId) {
        if (categoryDiscountCeilingRepository != null && tierId != null) {
            return categoryDiscountCeilingRepository.findByTierId(tierId);
        }
        return Collections.emptyList();
    }

    /**
     * Retrieves all CategoryDiscountCeilings.
     */
    public List<CategoryDiscountCeiling> findAllCategoryDiscountCeilings() {
        if (categoryDiscountCeilingRepository != null) {
            return categoryDiscountCeilingRepository.findAll();
        }
        return Collections.emptyList();
    }

    /**
     * Checks if a CategoryDiscountCeiling exists by ID.
     */
    public boolean existsCategoryDiscountCeilingById(Long id) {
        return categoryDiscountCeilingRepository != null && id != null && categoryDiscountCeilingRepository.existsById(id);
    }

    /**
     * Deletes a CategoryDiscountCeiling by ID.
     */
    @Transactional
    public void deleteCategoryDiscountCeilingById(Long id) {
        if (categoryDiscountCeilingRepository != null && id != null) {
            categoryDiscountCeilingRepository.deleteById(id);
        }
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
