package com.odoo.DealFlow360.product;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;

/**
 * Business service handling ProductVariant domain validation and operations.
 */
@Service
public class ProductVariantService {

    /**
     * Validates domain constraints on a ProductVariant entity.
     *
     * @param variant ProductVariant entity to validate
     */
    public void validateVariant(ProductVariant variant) {
        if (variant == null) {
            throw new IllegalArgumentException("Product variant cannot be null");
        }
        if (variant.getProductId() == null || variant.getProductId() <= 0) {
            throw new IllegalArgumentException("Variant must be associated with a valid positive Product ID");
        }
        if (variant.getAttributeName() == null || variant.getAttributeName().trim().isEmpty()) {
            throw new IllegalArgumentException("Attribute name cannot be null or blank");
        }
        if (variant.getValue() == null || variant.getValue().trim().isEmpty()) {
            throw new IllegalArgumentException("Variant value cannot be null or blank");
        }
        if (variant.getExtraPrice() == null || variant.getExtraPrice().compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Extra price cannot be null or negative");
        }
    }

    /**
     * Creates and validates a ProductVariant instance.
     */
    public ProductVariant createVariant(Long id, Long productId, String attributeName, String value, BigDecimal extraPrice) {
        ProductVariant variant = new ProductVariant(
                id,
                productId,
                attributeName != null ? attributeName.trim() : null,
                value != null ? value.trim() : null,
                extraPrice != null ? extraPrice : BigDecimal.ZERO
        );
        validateVariant(variant);
        return variant;
    }
}
