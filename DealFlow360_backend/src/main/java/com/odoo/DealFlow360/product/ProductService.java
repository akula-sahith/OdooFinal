package com.odoo.DealFlow360.product;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;

/**
 * Business service handling Product and ProductCategory validation and domain operations.
 */
@Service
public class ProductService {

    /**
     * Validates a ProductCategory entity.
     *
     * @param category ProductCategory entity to validate
     */
    public void validateProductCategory(ProductCategory category) {
        if (category == null) {
            throw new IllegalArgumentException("Product category cannot be null");
        }
        if (category.getName() == null || category.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Product category name cannot be null or blank");
        }
        if (category.getId() != null && category.getId() <= 0) {
            throw new IllegalArgumentException("Product category ID must be a positive number if specified");
        }
    }

    /**
     * Creates and validates a ProductCategory instance.
     */
    public ProductCategory createProductCategory(Long id, String name) {
        ProductCategory category = new ProductCategory(id, name != null ? name.trim() : null);
        validateProductCategory(category);
        return category;
    }

    /**
     * Validates domain constraints on a Product entity.
     *
     * @param product Product entity to validate
     */
    public void validateProduct(Product product) {
        if (product == null) {
            throw new IllegalArgumentException("Product cannot be null");
        }
        if (product.getName() == null || product.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Product name cannot be null or blank");
        }
        if (product.getBasePrice() == null || product.getBasePrice().compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Base price cannot be null or negative");
        }
        if (product.getTaxPercent() == null || product.getTaxPercent().compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Tax percentage cannot be null or negative");
        }
        if (product.getCurrency() == null || product.getCurrency().trim().isEmpty()) {
            throw new IllegalArgumentException("Product currency cannot be null or blank");
        }
        if (product.getCategoryId() != null && product.getCategoryId() <= 0) {
            throw new IllegalArgumentException("Category ID must be a positive number if specified");
        }
        if (product.getIsSubscription() == null) {
            throw new IllegalArgumentException("Subscription flag cannot be null");
        }
    }

    /**
     * Creates and validates a Product instance.
     */
    public Product createProduct(Long id, String name, Long categoryId, BigDecimal basePrice, BigDecimal taxPercent, String currency, Boolean isSubscription) {
        Product product = new Product(
                id,
                name != null ? name.trim() : null,
                categoryId,
                basePrice,
                taxPercent != null ? taxPercent : BigDecimal.ZERO,
                currency != null ? currency.trim() : null,
                isSubscription != null ? isSubscription : Boolean.FALSE
        );
        validateProduct(product);
        return product;
    }
}
