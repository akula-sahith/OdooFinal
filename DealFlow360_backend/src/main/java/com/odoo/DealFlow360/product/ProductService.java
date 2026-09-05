package com.odoo.DealFlow360.product;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

/**
 * Business service handling Product and ProductCategory validation and domain operations.
 */
@Service
public class ProductService {

    private final ProductCategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    public ProductService() {
        this.categoryRepository = null;
        this.productRepository = null;
    }

    @Autowired
    public ProductService(ProductCategoryRepository categoryRepository, ProductRepository productRepository) {
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
    }

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
     * Persists a ProductCategory entity after validation.
     */
    public ProductCategory saveProductCategory(ProductCategory category) {
        validateProductCategory(category);
        if (categoryRepository != null) {
            return categoryRepository.save(category);
        }
        return category;
    }

    /**
     * Finds a ProductCategory by ID.
     */
    public Optional<ProductCategory> findProductCategoryById(Long id) {
        if (categoryRepository != null && id != null) {
            return categoryRepository.findById(id);
        }
        return Optional.empty();
    }

    /**
     * Finds a ProductCategory by name.
     */
    public Optional<ProductCategory> findProductCategoryByName(String name) {
        if (categoryRepository != null && name != null) {
            return categoryRepository.findByName(name);
        }
        return Optional.empty();
    }

    /**
     * Retrieves all ProductCategories.
     */
    public List<ProductCategory> findAllProductCategories() {
        if (categoryRepository != null) {
            return categoryRepository.findAll();
        }
        return Collections.emptyList();
    }

    /**
     * Deletes a ProductCategory by ID.
     */
    public void deleteProductCategory(Long id) {
        if (categoryRepository != null && id != null) {
            categoryRepository.deleteById(id);
        }
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

    /**
     * Persists a Product entity after domain validation.
     */
    public Product saveProduct(Product product) {
        validateProduct(product);
        if (productRepository != null) {
            return productRepository.save(product);
        }
        return product;
    }

    /**
     * Finds a Product by ID.
     */
    public Optional<Product> findProductById(Long id) {
        if (productRepository != null && id != null) {
            return productRepository.findById(id);
        }
        return Optional.empty();
    }

    /**
     * Finds all Products belonging to a Category ID.
     */
    public List<Product> findProductsByCategoryId(Long categoryId) {
        if (productRepository != null && categoryId != null) {
            return productRepository.findByCategoryId(categoryId);
        }
        return Collections.emptyList();
    }

    /**
     * Retrieves all Products.
     */
    public List<Product> findAllProducts() {
        if (productRepository != null) {
            return productRepository.findAll();
        }
        return Collections.emptyList();
    }

    /**
     * Deletes a Product by ID.
     */
    public void deleteProduct(Long id) {
        if (productRepository != null && id != null) {
            productRepository.deleteById(id);
        }
    }
}

