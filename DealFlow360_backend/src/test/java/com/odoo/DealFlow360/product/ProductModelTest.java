package com.odoo.DealFlow360.product;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;

class ProductModelTest {

    @Test
    @DisplayName("Should create and verify ProductCategory model")
    void testProductCategory() {
        ProductCategory category = new ProductCategory(1L, "Software");
        assertThat(category.getId()).isEqualTo(1L);
        assertThat(category.getName()).isEqualTo("Software");

        ProductCategory other = new ProductCategory(1L, "Software");
        assertThat(category).isEqualTo(other);
        assertThat(category.hashCode()).isEqualTo(other.hashCode());
        assertThat(category.toString()).contains("Software");
    }

    @Test
    @DisplayName("Should create and verify Product model")
    void testProduct() {
        Product product = new Product(10L, "Enterprise License", 1L, new BigDecimal("999.99"), new BigDecimal("18.00"), "USD", true);
        assertThat(product.getId()).isEqualTo(10L);
        assertThat(product.getName()).isEqualTo("Enterprise License");
        assertThat(product.getCategoryId()).isEqualTo(1L);
        assertThat(product.getBasePrice()).isEqualTo(new BigDecimal("999.99"));
        assertThat(product.getTaxPercent()).isEqualTo(new BigDecimal("18.00"));
        assertThat(product.getCurrency()).isEqualTo("USD");
        assertThat(product.getIsSubscription()).isTrue();
    }

    @Test
    @DisplayName("Should create and verify ProductVariant model")
    void testProductVariant() {
        ProductVariant variant = new ProductVariant(5L, 10L, "Users", "50 Users", new BigDecimal("200.00"));
        assertThat(variant.getId()).isEqualTo(5L);
        assertThat(variant.getProductId()).isEqualTo(10L);
        assertThat(variant.getAttributeName()).isEqualTo("Users");
        assertThat(variant.getValue()).isEqualTo("50 Users");
        assertThat(variant.getExtraPrice()).isEqualTo(new BigDecimal("200.00"));
    }
}
