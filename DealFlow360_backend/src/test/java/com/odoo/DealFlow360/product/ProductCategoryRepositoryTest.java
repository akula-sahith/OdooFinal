package com.odoo.DealFlow360.product;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementCreator;
import org.springframework.jdbc.support.KeyHolder;

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

class ProductCategoryRepositoryTest {

    private JdbcTemplate jdbcTemplate;
    private ProductCategoryRepository categoryRepository;

    @BeforeEach
    void setUp() {
        jdbcTemplate = mock(JdbcTemplate.class);
        categoryRepository = new ProductCategoryRepository(jdbcTemplate);
    }

    @Test
    @DisplayName("Should insert new ProductCategory and populate generated ID")
    void testSaveNewCategory() {
        ProductCategory category = new ProductCategory(null, "Electronics");

        doAnswer(invocation -> {
            KeyHolder keyHolder = invocation.getArgument(1);
            // Simulate generated key
            java.util.Map<String, Object> map = new java.util.HashMap<>();
            map.put("id", 42L);
            keyHolder.getKeyList().add(map);
            return 1;
        }).when(jdbcTemplate).update(any(PreparedStatementCreator.class), any(KeyHolder.class));

        ProductCategory saved = categoryRepository.save(category);

        assertThat(saved.getId()).isEqualTo(42L);
        assertThat(saved.getName()).isEqualTo("Electronics");
    }

    @Test
    @DisplayName("Should update existing ProductCategory")
    void testUpdateCategory() {
        ProductCategory category = new ProductCategory(10L, "Hardware");
        categoryRepository.save(category);

        verify(jdbcTemplate).update(
                eq("UPDATE product_categories SET name = ? WHERE id = ?"),
                eq("Hardware"),
                eq(10L)
        );
    }

    @Test
    @DisplayName("Should find ProductCategory by ID")
    void testFindById() {
        ProductCategory category = new ProductCategory(1L, "Software");
        when(jdbcTemplate.query(eq("SELECT id, name FROM product_categories WHERE id = ?"), any(ProductCategoryRepository.ProductCategoryRowMapper.class), eq(1L)))
                .thenReturn(Collections.singletonList(category));

        Optional<ProductCategory> result = categoryRepository.findById(1L);

        assertThat(result).isPresent();
        assertThat(result.get().getName()).isEqualTo("Software");
    }

    @Test
    @DisplayName("Should find ProductCategory by Name")
    void testFindByName() {
        ProductCategory category = new ProductCategory(2L, "Services");
        when(jdbcTemplate.query(eq("SELECT id, name FROM product_categories WHERE name = ?"), any(ProductCategoryRepository.ProductCategoryRowMapper.class), eq("Services")))
                .thenReturn(Collections.singletonList(category));

        Optional<ProductCategory> result = categoryRepository.findByName("Services");

        assertThat(result).isPresent();
        assertThat(result.get().getId()).isEqualTo(2L);
    }

    @Test
    @DisplayName("Should find all ProductCategories")
    void testFindAll() {
        ProductCategory c1 = new ProductCategory(1L, "Cat1");
        ProductCategory c2 = new ProductCategory(2L, "Cat2");
        when(jdbcTemplate.query(eq("SELECT id, name FROM product_categories ORDER BY id"), any(ProductCategoryRepository.ProductCategoryRowMapper.class)))
                .thenReturn(List.of(c1, c2));

        List<ProductCategory> categories = categoryRepository.findAll();

        assertThat(categories).hasSize(2);
    }

    @Test
    @DisplayName("Should check existence by ID")
    void testExistsById() {
        when(jdbcTemplate.queryForObject(eq("SELECT COUNT(*) FROM product_categories WHERE id = ?"), eq(Integer.class), eq(5L)))
                .thenReturn(1);

        assertThat(categoryRepository.existsById(5L)).isTrue();
    }

    @Test
    @DisplayName("Should delete ProductCategory by ID")
    void testDeleteById() {
        categoryRepository.deleteById(7L);
        verify(jdbcTemplate).update(eq("DELETE FROM product_categories WHERE id = ?"), eq(7L));
    }

    @Test
    @DisplayName("Should map RowMapper correctly")
    void testRowMapper() throws SQLException {
        ResultSet rs = mock(ResultSet.class);
        when(rs.getLong("id")).thenReturn(100L);
        when(rs.getString("name")).thenReturn("Cloud Services");

        ProductCategoryRepository.ProductCategoryRowMapper rowMapper = new ProductCategoryRepository.ProductCategoryRowMapper();
        ProductCategory category = rowMapper.mapRow(rs, 1);

        assertThat(category.getId()).isEqualTo(100L);
        assertThat(category.getName()).isEqualTo("Cloud Services");
    }
}
