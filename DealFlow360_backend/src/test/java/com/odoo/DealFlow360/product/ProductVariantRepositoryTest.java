package com.odoo.DealFlow360.product;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementCreator;
import org.springframework.jdbc.support.KeyHolder;

import java.math.BigDecimal;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class ProductVariantRepositoryTest {

    private JdbcTemplate jdbcTemplate;
    private ProductVariantRepository variantRepository;

    @BeforeEach
    void setUp() {
        jdbcTemplate = mock(JdbcTemplate.class);
        variantRepository = new ProductVariantRepository(jdbcTemplate);
    }

    @Test
    @DisplayName("Should insert new ProductVariant and populate generated ID")
    void testSaveNewVariant() {
        ProductVariant variant = new ProductVariant(null, 100L, "RAM", "16GB", new BigDecimal("50.00"));

        doAnswer(invocation -> {
            KeyHolder keyHolder = invocation.getArgument(1);
            java.util.Map<String, Object> map = new java.util.HashMap<>();
            map.put("id", 501L);
            keyHolder.getKeyList().add(map);
            return 1;
        }).when(jdbcTemplate).update(any(PreparedStatementCreator.class), any(KeyHolder.class));

        ProductVariant saved = variantRepository.save(variant);

        assertThat(saved.getId()).isEqualTo(501L);
        assertThat(saved.getAttributeName()).isEqualTo("RAM");
    }

    @Test
    @DisplayName("Should update existing ProductVariant")
    void testUpdateVariant() {
        ProductVariant variant = new ProductVariant(501L, 100L, "RAM", "32GB", new BigDecimal("100.00"));
        variantRepository.save(variant);

        verify(jdbcTemplate).update(
                eq("UPDATE product_variants SET product_id = ?, attribute_name = ?, value = ?, extra_price = ? WHERE id = ?"),
                eq(100L),
                eq("RAM"),
                eq("32GB"),
                eq(new BigDecimal("100.00")),
                eq(501L)
        );
    }

    @Test
    @DisplayName("Should find ProductVariant by ID")
    void testFindById() {
        ProductVariant variant = new ProductVariant(1L, 10L, "Color", "Red", new BigDecimal("5.00"));
        when(jdbcTemplate.query(eq("SELECT id, product_id, attribute_name, value, extra_price FROM product_variants WHERE id = ?"), any(ProductVariantRepository.ProductVariantRowMapper.class), eq(1L)))
                .thenReturn(Collections.singletonList(variant));

        Optional<ProductVariant> result = variantRepository.findById(1L);

        assertThat(result).isPresent();
        assertThat(result.get().getValue()).isEqualTo("Red");
    }

    @Test
    @DisplayName("Should find ProductVariants by Product ID (relationship query)")
    void testFindByProductId() {
        ProductVariant v1 = new ProductVariant(1L, 10L, "Color", "Red", new BigDecimal("5.00"));
        ProductVariant v2 = new ProductVariant(2L, 10L, "Color", "Blue", new BigDecimal("5.00"));
        when(jdbcTemplate.query(eq("SELECT id, product_id, attribute_name, value, extra_price FROM product_variants WHERE product_id = ? ORDER BY id"), any(ProductVariantRepository.ProductVariantRowMapper.class), eq(10L)))
                .thenReturn(List.of(v1, v2));

        List<ProductVariant> variants = variantRepository.findByProductId(10L);

        assertThat(variants).hasSize(2);
        assertThat(variants.get(0).getProductId()).isEqualTo(10L);
    }

    @Test
    @DisplayName("Should find all ProductVariants")
    void testFindAll() {
        ProductVariant v1 = new ProductVariant(1L, 10L, "Storage", "512GB", new BigDecimal("100.00"));
        when(jdbcTemplate.query(eq("SELECT id, product_id, attribute_name, value, extra_price FROM product_variants ORDER BY id"), any(ProductVariantRepository.ProductVariantRowMapper.class)))
                .thenReturn(Collections.singletonList(v1));

        List<ProductVariant> variants = variantRepository.findAll();

        assertThat(variants).hasSize(1);
    }

    @Test
    @DisplayName("Should check existence by ID")
    void testExistsById() {
        when(jdbcTemplate.queryForObject(eq("SELECT COUNT(*) FROM product_variants WHERE id = ?"), eq(Integer.class), eq(20L)))
                .thenReturn(1);

        assertThat(variantRepository.existsById(20L)).isTrue();
    }

    @Test
    @DisplayName("Should delete ProductVariant by ID")
    void testDeleteById() {
        variantRepository.deleteById(20L);
        verify(jdbcTemplate).update(eq("DELETE FROM product_variants WHERE id = ?"), eq(20L));
    }

    @Test
    @DisplayName("Should map RowMapper correctly")
    void testRowMapper() throws SQLException {
        ResultSet rs = mock(ResultSet.class);
        when(rs.getLong("id")).thenReturn(300L);
        when(rs.getLong("product_id")).thenReturn(50L);
        when(rs.getString("attribute_name")).thenReturn("Size");
        when(rs.getString("value")).thenReturn("XL");
        when(rs.getBigDecimal("extra_price")).thenReturn(new BigDecimal("15.00"));

        ProductVariantRepository.ProductVariantRowMapper rowMapper = new ProductVariantRepository.ProductVariantRowMapper();
        ProductVariant variant = rowMapper.mapRow(rs, 1);

        assertThat(variant.getId()).isEqualTo(300L);
        assertThat(variant.getProductId()).isEqualTo(50L);
        assertThat(variant.getAttributeName()).isEqualTo("Size");
        assertThat(variant.getValue()).isEqualTo("XL");
        assertThat(variant.getExtraPrice()).isEqualTo(new BigDecimal("15.00"));
    }
}
