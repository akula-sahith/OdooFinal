package com.odoo.DealFlow360.product;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class ProductServiceTest {

    private ProductService productService;

    @BeforeEach
    void setUp() {
        productService = new ProductService();
    }

    @Test
    @DisplayName("Should create and validate product category successfully")
    void testValidProductCategory() {
        ProductCategory category = productService.createProductCategory(1L, "Software");
        assertThat(category).isNotNull();
        assertThat(category.getName()).isEqualTo("Software");
    }

    @Test
    @DisplayName("Should throw exception for blank product category name")
    void testBlankCategoryName() {
        assertThatThrownBy(() -> productService.createProductCategory(1L, "  "))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Product category name cannot be null or blank");
    }

    @Test
    @DisplayName("Should create valid product successfully")
    void testValidProduct() {
        Product product = productService.createProduct(10L, "Enterprise License", 1L, new BigDecimal("1000.00"), new BigDecimal("18.00"), "USD", true);
        assertThat(product).isNotNull();
        assertThat(product.getName()).isEqualTo("Enterprise License");
        assertThat(product.getBasePrice()).isEqualTo(new BigDecimal("1000.00"));
    }

    @Test
    @DisplayName("Should throw exception for blank product name")
    void testBlankProductName() {
        assertThatThrownBy(() -> productService.createProduct(10L, "", 1L, new BigDecimal("100.00"), new BigDecimal("0.00"), "USD", false))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Product name cannot be null or blank");
    }

    @Test
    @DisplayName("Should throw exception for negative base price")
    void testNegativeBasePrice() {
        assertThatThrownBy(() -> productService.createProduct(10L, "Widget", 1L, new BigDecimal("-10.00"), new BigDecimal("0.00"), "USD", false))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Base price cannot be null or negative");
    }

    @Test
    @DisplayName("Should throw exception for negative tax percentage")
    void testNegativeTaxPercent() {
        assertThatThrownBy(() -> productService.createProduct(10L, "Widget", 1L, new BigDecimal("10.00"), new BigDecimal("-5.00"), "USD", false))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Tax percentage cannot be null or negative");
    }

    @Test
    @DisplayName("Should throw exception for missing currency")
    void testMissingCurrency() {
        assertThatThrownBy(() -> productService.createProduct(10L, "Widget", 1L, new BigDecimal("10.00"), new BigDecimal("0.00"), null, false))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Product currency cannot be null or blank");
    }
}
