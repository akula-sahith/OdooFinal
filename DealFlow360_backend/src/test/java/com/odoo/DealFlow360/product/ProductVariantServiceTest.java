package com.odoo.DealFlow360.product;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class ProductVariantServiceTest {

    private ProductVariantService variantService;

    @BeforeEach
    void setUp() {
        variantService = new ProductVariantService();
    }

    @Test
    @DisplayName("Should create valid product variant successfully")
    void testValidVariant() {
        ProductVariant variant = variantService.createVariant(1L, 10L, "Color", "Blue", new BigDecimal("15.00"));
        assertThat(variant).isNotNull();
        assertThat(variant.getProductId()).isEqualTo(10L);
        assertThat(variant.getAttributeName()).isEqualTo("Color");
        assertThat(variant.getValue()).isEqualTo("Blue");
        assertThat(variant.getExtraPrice()).isEqualTo(new BigDecimal("15.00"));
    }

    @Test
    @DisplayName("Should throw exception for missing or invalid product ID")
    void testMissingProductId() {
        assertThatThrownBy(() -> variantService.createVariant(1L, null, "Size", "Large", new BigDecimal("0.00")))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Variant must be associated with a valid positive Product ID");

        assertThatThrownBy(() -> variantService.createVariant(1L, -1L, "Size", "Large", new BigDecimal("0.00")))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Variant must be associated with a valid positive Product ID");
    }

    @Test
    @DisplayName("Should throw exception for blank attribute name")
    void testBlankAttributeName() {
        assertThatThrownBy(() -> variantService.createVariant(1L, 10L, " ", "Large", new BigDecimal("0.00")))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Attribute name cannot be null or blank");
    }

    @Test
    @DisplayName("Should throw exception for blank variant value")
    void testBlankVariantValue() {
        assertThatThrownBy(() -> variantService.createVariant(1L, 10L, "Size", "", new BigDecimal("0.00")))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Variant value cannot be null or blank");
    }

    @Test
    @DisplayName("Should throw exception for negative extra price")
    void testNegativeExtraPrice() {
        assertThatThrownBy(() -> variantService.createVariant(1L, 10L, "Size", "Large", new BigDecimal("-5.00")))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Extra price cannot be null or negative");
    }
}
