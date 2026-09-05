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

class DiscountTierRepositoryTest {

    private JdbcTemplate jdbcTemplate;
    private DiscountTierRepository discountTierRepository;

    @BeforeEach
    void setUp() {
        jdbcTemplate = mock(JdbcTemplate.class);
        discountTierRepository = new DiscountTierRepository(jdbcTemplate);
    }

    @Test
    @DisplayName("Should find discount tier by id")
    void testFindById() {
        DiscountTier tier = new DiscountTier(1L, "Gold Tier", new BigDecimal("15.00"));
        String expectedSql = "SELECT id, name, max_discount_percent FROM discount_tiers WHERE id = ?";
        when(jdbcTemplate.query(eq(expectedSql), any(DiscountTierRepository.DiscountTierRowMapper.class), eq(1L)))
                .thenReturn(Collections.singletonList(tier));

        Optional<DiscountTier> result = discountTierRepository.findById(1L);

        assertThat(result).isPresent();
        assertThat(result.get().getName()).isEqualTo("Gold Tier");
        assertThat(result.get().getMaxDiscountPercent()).isEqualTo(new BigDecimal("15.00"));
    }

    @Test
    @DisplayName("Should find discount tier by name")
    void testFindByName() {
        DiscountTier tier = new DiscountTier(2L, "Silver Tier", new BigDecimal("10.00"));
        String expectedSql = "SELECT id, name, max_discount_percent FROM discount_tiers WHERE name = ?";
        when(jdbcTemplate.query(eq(expectedSql), any(DiscountTierRepository.DiscountTierRowMapper.class), eq("Silver Tier")))
                .thenReturn(Collections.singletonList(tier));

        Optional<DiscountTier> result = discountTierRepository.findByName("Silver Tier");

        assertThat(result).isPresent();
        assertThat(result.get().getId()).isEqualTo(2L);
    }

    @Test
    @DisplayName("Should find all discount tiers")
    void testFindAll() {
        DiscountTier t1 = new DiscountTier(1L, "Gold", new BigDecimal("15.00"));
        DiscountTier t2 = new DiscountTier(2L, "Silver", new BigDecimal("10.00"));
        String expectedSql = "SELECT id, name, max_discount_percent FROM discount_tiers ORDER BY id";
        when(jdbcTemplate.query(eq(expectedSql), any(DiscountTierRepository.DiscountTierRowMapper.class)))
                .thenReturn(List.of(t1, t2));

        List<DiscountTier> results = discountTierRepository.findAll();

        assertThat(results).hasSize(2);
        assertThat(results.get(0).getName()).isEqualTo("Gold");
        assertThat(results.get(1).getName()).isEqualTo("Silver");
    }

    @Test
    @DisplayName("Should update existing discount tier")
    void testUpdateDiscountTier() {
        DiscountTier tier = new DiscountTier(1L, "Gold Tier Updated", new BigDecimal("20.00"));

        discountTierRepository.save(tier);

        String expectedSql = "UPDATE discount_tiers SET name = ?, max_discount_percent = ? WHERE id = ?";
        verify(jdbcTemplate).update(
                eq(expectedSql),
                eq("Gold Tier Updated"),
                eq(new BigDecimal("20.00")),
                eq(1L)
        );
    }

    @Test
    @DisplayName("Should check discount tier existence by id")
    void testExistsById() {
        when(jdbcTemplate.queryForObject(eq("SELECT COUNT(*) FROM discount_tiers WHERE id = ?"), eq(Integer.class), eq(1L)))
                .thenReturn(1);

        assertThat(discountTierRepository.existsById(1L)).isTrue();
    }

    @Test
    @DisplayName("Should delete discount tier by id")
    void testDeleteById() {
        discountTierRepository.deleteById(10L);
        verify(jdbcTemplate).update(eq("DELETE FROM discount_tiers WHERE id = ?"), eq(10L));
    }
}
