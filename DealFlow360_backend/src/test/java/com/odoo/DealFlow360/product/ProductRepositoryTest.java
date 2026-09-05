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

class ProductRepositoryTest {

    private JdbcTemplate jdbcTemplate;
    private ProductRepository productRepository;

    @BeforeEach
    void setUp() {
        jdbcTemplate = mock(JdbcTemplate.class);
        productRepository = new ProductRepository(jdbcTemplate);
    }

    @Test
    @DisplayName("Should insert new Product and populate generated ID")
    void testSaveNewProduct() {
        Product product = new Product(null, "Laptop", 10L, new BigDecimal("999.99"), new BigDecimal("10.00"), "USD", true);

        doAnswer(invocation -> {
            KeyHolder keyHolder = invocation.getArgument(1);
            java.util.Map<String, Object> map = new java.util.HashMap<>();
            map.put("id", 101L);
            keyHolder.getKeyList().add(map);
            return 1;
        }).when(jdbcTemplate).update(any(PreparedStatementCreator.class), any(KeyHolder.class));

        Product saved = productRepository.save(product);

        assertThat(saved.getId()).isEqualTo(101L);
        assertThat(saved.getName()).isEqualTo("Laptop");
    }

    @Test
    @DisplayName("Should update existing Product")
    void testUpdateProduct() {
        Product product = new Product(101L, "Laptop Pro", 10L, new BigDecimal("1299.99"), new BigDecimal("10.00"), "USD", true);
        productRepository.save(product);

        verify(jdbcTemplate).update(
                eq("UPDATE products SET name = ?, category_id = ?, base_price = ?, tax_percent = ?, currency = ?, is_subscription = ? WHERE id = ?"),
                eq("Laptop Pro"),
                eq(10L),
                eq(new BigDecimal("1299.99")),
                eq(new BigDecimal("10.00")),
                eq("USD"),
                eq(true),
                eq(101L)
        );
    }

    @Test
    @DisplayName("Should find Product by ID")
    void testFindById() {
        Product product = new Product(1L, "Monitor", null, new BigDecimal("250.00"), new BigDecimal("5.00"), "USD", false);
        when(jdbcTemplate.query(eq("SELECT id, name, category_id, base_price, tax_percent, currency, is_subscription FROM products WHERE id = ?"), any(ProductRepository.ProductRowMapper.class), eq(1L)))
                .thenReturn(Collections.singletonList(product));

        Optional<Product> result = productRepository.findById(1L);

        assertThat(result).isPresent();
        assertThat(result.get().getName()).isEqualTo("Monitor");
        assertThat(result.get().getCategoryId()).isNull();
    }

    @Test
    @DisplayName("Should find Products by Category ID (relationship query)")
    void testFindByCategoryId() {
        Product p1 = new Product(10L, "Keyboard", 5L, new BigDecimal("50.00"), BigDecimal.ZERO, "USD", false);
        Product p2 = new Product(11L, "Mouse", 5L, new BigDecimal("25.00"), BigDecimal.ZERO, "USD", false);
        when(jdbcTemplate.query(eq("SELECT id, name, category_id, base_price, tax_percent, currency, is_subscription FROM products WHERE category_id = ? ORDER BY id"), any(ProductRepository.ProductRowMapper.class), eq(5L)))
                .thenReturn(List.of(p1, p2));

        List<Product> products = productRepository.findByCategoryId(5L);

        assertThat(products).hasSize(2);
        assertThat(products.get(0).getCategoryId()).isEqualTo(5L);
    }

    @Test
    @DisplayName("Should find all Products")
    void testFindAll() {
        Product p1 = new Product(1L, "P1", null, new BigDecimal("10.00"), BigDecimal.ZERO, "USD", false);
        when(jdbcTemplate.query(eq("SELECT id, name, category_id, base_price, tax_percent, currency, is_subscription FROM products ORDER BY id"), any(ProductRepository.ProductRowMapper.class)))
                .thenReturn(Collections.singletonList(p1));

        List<Product> products = productRepository.findAll();

        assertThat(products).hasSize(1);
    }

    @Test
    @DisplayName("Should check existence by ID")
    void testExistsById() {
        when(jdbcTemplate.queryForObject(eq("SELECT COUNT(*) FROM products WHERE id = ?"), eq(Integer.class), eq(15L)))
                .thenReturn(1);

        assertThat(productRepository.existsById(15L)).isTrue();
    }

    @Test
    @DisplayName("Should delete Product by ID")
    void testDeleteById() {
        productRepository.deleteById(15L);
        verify(jdbcTemplate).update(eq("DELETE FROM products WHERE id = ?"), eq(15L));
    }

    @Test
    @DisplayName("Should map RowMapper correctly including null categoryId")
    void testRowMapper() throws SQLException {
        ResultSet rs = mock(ResultSet.class);
        when(rs.getLong("id")).thenReturn(200L);
        when(rs.getString("name")).thenReturn("SaaS Plan");
        when(rs.getLong("category_id")).thenReturn(0L);
        when(rs.wasNull()).thenReturn(true, false);
        when(rs.getBigDecimal("base_price")).thenReturn(new BigDecimal("99.00"));
        when(rs.getBigDecimal("tax_percent")).thenReturn(new BigDecimal("18.00"));
        when(rs.getString("currency")).thenReturn("EUR");
        when(rs.getBoolean("is_subscription")).thenReturn(true);

        ProductRepository.ProductRowMapper rowMapper = new ProductRepository.ProductRowMapper();
        Product product = rowMapper.mapRow(rs, 1);

        assertThat(product.getId()).isEqualTo(200L);
        assertThat(product.getName()).isEqualTo("SaaS Plan");
        assertThat(product.getCategoryId()).isNull();
        assertThat(product.getBasePrice()).isEqualTo(new BigDecimal("99.00"));
        assertThat(product.getTaxPercent()).isEqualTo(new BigDecimal("18.00"));
        assertThat(product.getCurrency()).isEqualTo("EUR");
        assertThat(product.getIsSubscription()).isTrue();
    }
}
