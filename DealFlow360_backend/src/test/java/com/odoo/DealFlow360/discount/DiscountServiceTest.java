package com.odoo.DealFlow360.discount;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class DiscountServiceTest {

    private DiscountService service;

    @BeforeEach
    void setUp() {
        service = new DiscountService(new DiscountRiskEngine());
    }

    @Test
    @DisplayName("Should create valid discount tier successfully")
    void testCreateDiscountTier() {
        DiscountTier tier = service.createDiscountTier(1L, "Gold Tier", new BigDecimal("15.00"));

        assertThat(tier).isNotNull();
        assertThat(tier.getId()).isEqualTo(1L);
        assertThat(tier.getName()).isEqualTo("Gold Tier");
        assertThat(tier.getMaxDiscountPercent()).isEqualTo(new BigDecimal("15.00"));
    }

    @Test
    @DisplayName("Should reject blank discount tier name")
    void testBlankTierNameRejected() {
        assertThatThrownBy(() -> service.createDiscountTier(1L, "   ", new BigDecimal("10.00")))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("name cannot be null or blank");
    }

    @Test
    @DisplayName("Should reject negative or over-100% max discount percent on tier")
    void testInvalidTierDiscountPercent() {
        assertThatThrownBy(() -> service.createDiscountTier(1L, "Gold", new BigDecimal("-5.00")))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("cannot be negative");

        assertThatThrownBy(() -> service.createDiscountTier(1L, "Gold", new BigDecimal("105.00")))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("cannot exceed 100%");
    }

    @Test
    @DisplayName("Should create valid category discount ceiling successfully")
    void testCreateCategoryDiscountCeiling() {
        CategoryDiscountCeiling ceiling = service.createCategoryDiscountCeiling(1L, 10L, 2L, new BigDecimal("20.00"));

        assertThat(ceiling).isNotNull();
        assertThat(ceiling.getId()).isEqualTo(1L);
        assertThat(ceiling.getCategoryId()).isEqualTo(10L);
        assertThat(ceiling.getTierId()).isEqualTo(2L);
        assertThat(ceiling.getMaxDiscountPercent()).isEqualTo(new BigDecimal("20.00"));
    }

    @Test
    @DisplayName("Should reject invalid category or tier IDs")
    void testInvalidCeilingIds() {
        assertThatThrownBy(() -> service.createCategoryDiscountCeiling(1L, null, 2L, new BigDecimal("10.00")))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Category ID must be a positive number");

        assertThatThrownBy(() -> service.createCategoryDiscountCeiling(1L, 10L, -1L, new BigDecimal("10.00")))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Tier ID must be a positive number");
    }

    @Test
    @DisplayName("Should delegate line risk evaluation cleanly")
    void testEvaluateLineRiskDelegation() {
        DiscountTier tier = new DiscountTier(1L, "Tier 1", new BigDecimal("15.00"));
        CategoryDiscountCeiling ceiling = new CategoryDiscountCeiling(10L, 5L, 1L, new BigDecimal("10.00"));

        DiscountLineRiskResult result = service.evaluateLineRisk(50L, null, new BigDecimal("12.00"), tier, ceiling);

        assertThat(result.getEffectiveAllowedDiscountPercent()).isEqualTo(new BigDecimal("10.00")); // Category ceiling (10%) is stricter than tier (15%)
        assertThat(result.getViolationPercent()).isEqualTo(new BigDecimal("2.00"));
        assertThat(result.isApprovalRequired()).isTrue();
    }

    @Test
    @DisplayName("Should delegate discount tier persistence operations to repository")
    void testDiscountTierPersistenceDelegation() {
        DiscountTierRepository tierRepo = org.mockito.Mockito.mock(DiscountTierRepository.class);
        DiscountService serviceWithRepo = new DiscountService(new DiscountRiskEngine(), tierRepo, null);

        DiscountTier tier = new DiscountTier(null, "Bronze", new BigDecimal("5.00"));
        DiscountTier savedTier = new DiscountTier(1L, "Bronze", new BigDecimal("5.00"));

        org.mockito.Mockito.when(tierRepo.save(tier)).thenReturn(savedTier);
        org.mockito.Mockito.when(tierRepo.findById(1L)).thenReturn(java.util.Optional.of(savedTier));

        DiscountTier result = serviceWithRepo.saveDiscountTier(tier);
        assertThat(result.getId()).isEqualTo(1L);

        java.util.Optional<DiscountTier> found = serviceWithRepo.findDiscountTierById(1L);
        assertThat(found).isPresent();
        assertThat(found.get().getName()).isEqualTo("Bronze");
    }

    @Test
    @DisplayName("Should delegate category ceiling persistence operations to repository")
    void testCategoryCeilingPersistenceDelegation() {
        CategoryDiscountCeilingRepository ceilingRepo = org.mockito.Mockito.mock(CategoryDiscountCeilingRepository.class);
        DiscountService serviceWithRepo = new DiscountService(new DiscountRiskEngine(), null, ceilingRepo);

        CategoryDiscountCeiling ceiling = new CategoryDiscountCeiling(null, 10L, 2L, new BigDecimal("15.00"));
        CategoryDiscountCeiling savedCeiling = new CategoryDiscountCeiling(1L, 10L, 2L, new BigDecimal("15.00"));

        org.mockito.Mockito.when(ceilingRepo.save(ceiling)).thenReturn(savedCeiling);
        org.mockito.Mockito.when(ceilingRepo.findByCategoryIdAndTierId(10L, 2L)).thenReturn(java.util.Optional.of(savedCeiling));

        CategoryDiscountCeiling result = serviceWithRepo.saveCategoryDiscountCeiling(ceiling);
        assertThat(result.getId()).isEqualTo(1L);

        java.util.Optional<CategoryDiscountCeiling> found = serviceWithRepo.findCategoryDiscountCeilingByCategoryIdAndTierId(10L, 2L);
        assertThat(found).isPresent();
        assertThat(found.get().getMaxDiscountPercent()).isEqualTo(new BigDecimal("15.00"));
    }
}
