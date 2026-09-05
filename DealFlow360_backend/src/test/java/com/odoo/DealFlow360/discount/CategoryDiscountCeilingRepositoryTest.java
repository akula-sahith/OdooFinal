package com.odoo.DealFlow360.discount;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.jdbc.core.JdbcTemplate;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class CategoryDiscountCeilingRepositoryTest {

    private JdbcTemplate jdbcTemplate;
    private CategoryDiscountCeilingRepository ceilingRepository;

    @BeforeEach
    void setUp() {
        jdbcTemplate = mock(JdbcTemplate.class);
        ceilingRepository = new CategoryDiscountCeilingRepository(jdbcTemplate);
    }

    @Test
    @DisplayName("Should find category ceiling by id")
    void testFindById() {
        CategoryDiscountCeiling ceiling = new CategoryDiscountCeiling(1L, 10L, 2L, new BigDecimal("12.50"));
        String expectedSql = "SELECT id, category_id, tier_id, max_discount_percent FROM category_discount_ceilings WHERE id = ?";
        when(jdbcTemplate.query(eq(expectedSql), any(CategoryDiscountCeilingRepository.CategoryDiscountCeilingRowMapper.class), eq(1L)))
                .thenReturn(Collections.singletonList(ceiling));

        Optional<CategoryDiscountCeiling> result = ceilingRepository.findById(1L);

        assertThat(result).isPresent();
        assertThat(result.get().getCategoryId()).isEqualTo(10L);
        assertThat(result.get().getTierId()).isEqualTo(2L);
        assertThat(result.get().getMaxDiscountPercent()).isEqualTo(new BigDecimal("12.50"));
    }

    @Test
    @DisplayName("Should find category ceiling by categoryId and tierId")
    void testFindByCategoryIdAndTierId() {
        CategoryDiscountCeiling ceiling = new CategoryDiscountCeiling(1L, 10L, 2L, new BigDecimal("12.50"));
        String expectedSql = "SELECT id, category_id, tier_id, max_discount_percent FROM category_discount_ceilings WHERE category_id = ? AND tier_id = ?";
        when(jdbcTemplate.query(eq(expectedSql), any(CategoryDiscountCeilingRepository.CategoryDiscountCeilingRowMapper.class), eq(10L), eq(2L)))
                .thenReturn(Collections.singletonList(ceiling));

        Optional<CategoryDiscountCeiling> result = ceilingRepository.findByCategoryIdAndTierId(10L, 2L);

        assertThat(result).isPresent();
        assertThat(result.get().getId()).isEqualTo(1L);
    }

    @Test
    @DisplayName("Should find category ceilings by categoryId")
    void testFindByCategoryId() {
        CategoryDiscountCeiling ceiling = new CategoryDiscountCeiling(1L, 10L, 2L, new BigDecimal("12.50"));
        String expectedSql = "SELECT id, category_id, tier_id, max_discount_percent FROM category_discount_ceilings WHERE category_id = ? ORDER BY id";
        when(jdbcTemplate.query(eq(expectedSql), any(CategoryDiscountCeilingRepository.CategoryDiscountCeilingRowMapper.class), eq(10L)))
                .thenReturn(List.of(ceiling));

        List<CategoryDiscountCeiling> results = ceilingRepository.findByCategoryId(10L);

        assertThat(results).hasSize(1);
    }

    @Test
    @DisplayName("Should find category ceilings by tierId")
    void testFindByTierId() {
        CategoryDiscountCeiling ceiling = new CategoryDiscountCeiling(1L, 10L, 2L, new BigDecimal("12.50"));
        String expectedSql = "SELECT id, category_id, tier_id, max_discount_percent FROM category_discount_ceilings WHERE tier_id = ? ORDER BY id";
        when(jdbcTemplate.query(eq(expectedSql), any(CategoryDiscountCeilingRepository.CategoryDiscountCeilingRowMapper.class), eq(2L)))
                .thenReturn(List.of(ceiling));

        List<CategoryDiscountCeiling> results = ceilingRepository.findByTierId(2L);

        assertThat(results).hasSize(1);
    }

    @Test
    @DisplayName("Should update existing category ceiling")
    void testUpdateCategoryCeiling() {
        CategoryDiscountCeiling ceiling = new CategoryDiscountCeiling(1L, 10L, 2L, new BigDecimal("15.00"));

        ceilingRepository.save(ceiling);

        String expectedSql = "UPDATE category_discount_ceilings SET category_id = ?, tier_id = ?, max_discount_percent = ? WHERE id = ?";
        verify(jdbcTemplate).update(
                eq(expectedSql),
                eq(10L),
                eq(2L),
                eq(new BigDecimal("15.00")),
                eq(1L)
        );
    }

    @Test
    @DisplayName("Should delete category ceiling by id")
    void testDeleteById() {
        ceilingRepository.deleteById(5L);
        verify(jdbcTemplate).update(eq("DELETE FROM category_discount_ceilings WHERE id = ?"), eq(5L));
    }
}
