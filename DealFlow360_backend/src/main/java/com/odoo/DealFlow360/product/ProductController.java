package com.odoo.DealFlow360.product;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ProductController {

    private final ProductService productService;
    private final ProductVariantService variantService;

    @Autowired
    public ProductController(ProductService productService, ProductVariantService variantService) {
        this.productService = productService;
        this.variantService = variantService;
    }

    public static class ProductCreateRequest {
        public String name;
        public Long categoryId;
        public BigDecimal basePrice;
        public BigDecimal unitBasePrice;
        public BigDecimal price;
        public BigDecimal taxPercent;
        public String currency;
        public Boolean isSubscription;
    }

    public static class CategoryCreateRequest {
        public String name;
    }

    // ----------------------------------------------------
    // PRODUCTS ENDPOINTS
    // ----------------------------------------------------

    @GetMapping("/products")
    public ResponseEntity<?> getAllProducts(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "100") int limit) {

        List<Product> products = productService.findAllProducts();

        if (categoryId != null) {
            products = products.stream().filter(p -> categoryId.equals(p.getCategoryId())).toList();
        }

        if (search != null && !search.trim().isEmpty()) {
            String s = search.trim().toLowerCase();
            products = products.stream()
                    .filter(p -> p.getName() != null && p.getName().toLowerCase().contains(s))
                    .toList();
        }

        List<Map<String, Object>> mapped = products.stream().map(this::mapProductToResponse).toList();

        Map<String, Object> response = new HashMap<>();
        response.put("data", mapped);
        response.put("meta", Map.of("total", mapped.size(), "page", page, "limit", limit, "totalPages", 1));
        return ResponseEntity.ok(response);
    }

    @GetMapping("/products/{id}")
    public ResponseEntity<?> getProductById(@PathVariable Long id) {
        return productService.findProductById(id)
                .map(p -> {
                    List<ProductVariant> variants = variantService.findVariantsByProductId(id);
                    Map<String, Object> res = mapProductToResponse(p);
                    res.put("variants", variants);
                    return ResponseEntity.ok((Object) res);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/products")
    public ResponseEntity<?> createProduct(@RequestBody ProductCreateRequest request) {
        if (request == null || request.name == null || request.name.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Product name is required");
        }

        BigDecimal price = request.basePrice != null ? request.basePrice
                : (request.unitBasePrice != null ? request.unitBasePrice : (request.price != null ? request.price : BigDecimal.ZERO));
        BigDecimal tax = request.taxPercent != null ? request.taxPercent : BigDecimal.ZERO;
        String curr = request.currency != null ? request.currency : "USD";
        Boolean isSub = request.isSubscription != null ? request.isSubscription : Boolean.FALSE;

        try {
            Product product = productService.createProduct(null, request.name, request.categoryId, price, tax, curr, isSub);
            Product saved = productService.saveProduct(product);
            return ResponseEntity.status(HttpStatus.CREATED).body(mapProductToResponse(saved));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/products/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable Long id, @RequestBody ProductCreateRequest request) {
        return productService.findProductById(id)
                .map(existing -> {
                    if (request.name != null && !request.name.trim().isEmpty()) {
                        existing.setName(request.name.trim());
                    }
                    if (request.categoryId != null) {
                        existing.setCategoryId(request.categoryId);
                    }
                    if (request.basePrice != null || request.unitBasePrice != null || request.price != null) {
                        BigDecimal p = request.basePrice != null ? request.basePrice
                                : (request.unitBasePrice != null ? request.unitBasePrice : request.price);
                        existing.setBasePrice(p);
                    }
                    if (request.taxPercent != null) {
                        existing.setTaxPercent(request.taxPercent);
                    }
                    if (request.currency != null) {
                        existing.setCurrency(request.currency.trim());
                    }
                    if (request.isSubscription != null) {
                        existing.setIsSubscription(request.isSubscription);
                    }

                    Product updated = productService.saveProduct(existing);
                    return ResponseEntity.ok((Object) mapProductToResponse(updated));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        if (productService.findProductById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        productService.deleteProduct(id);
        return ResponseEntity.ok(Map.of("message", "Product deleted successfully"));
    }

    // ----------------------------------------------------
    // CATEGORIES ENDPOINTS
    // ----------------------------------------------------

    @GetMapping("/categories")
    public ResponseEntity<?> getAllCategories() {
        List<ProductCategory> categories = productService.findAllProductCategories();
        return ResponseEntity.ok(categories);
    }

    @GetMapping("/categories/{id}")
    public ResponseEntity<?> getCategoryById(@PathVariable Long id) {
        return productService.findProductCategoryById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/categories")
    public ResponseEntity<?> createCategory(@RequestBody CategoryCreateRequest request) {
        if (request == null || request.name == null || request.name.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Category name is required");
        }
        try {
            ProductCategory category = productService.createProductCategory(null, request.name);
            ProductCategory saved = productService.saveProductCategory(category);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/categories/{id}")
    public ResponseEntity<?> updateCategory(@PathVariable Long id, @RequestBody CategoryCreateRequest request) {
        if (request == null || request.name == null || request.name.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Category name is required");
        }
        return productService.findProductCategoryById(id)
                .map(existing -> {
                    existing.setName(request.name.trim());
                    ProductCategory updated = productService.saveProductCategory(existing);
                    return ResponseEntity.ok(updated);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/categories/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable Long id) {
        if (productService.findProductCategoryById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        productService.deleteProductCategory(id);
        return ResponseEntity.ok(Map.of("message", "Category deleted successfully"));
    }

    // ----------------------------------------------------
    // VARIANTS ENDPOINTS
    // ----------------------------------------------------

    @GetMapping("/products/{productId}/variants")
    public ResponseEntity<List<ProductVariant>> getProductVariants(@PathVariable Long productId) {
        return ResponseEntity.ok(variantService.findVariantsByProductId(productId));
    }

    @PostMapping("/products/{productId}/variants")
    public ResponseEntity<?> createProductVariant(@PathVariable Long productId, @RequestBody ProductVariant variant) {
        if (variant == null) {
            return ResponseEntity.badRequest().body("Variant data is required");
        }
        variant.setProductId(productId);
        try {
            ProductVariant saved = variantService.saveVariant(variant);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/products/variants/{variantId}")
    public ResponseEntity<?> deleteProductVariant(@PathVariable Long variantId) {
        variantService.deleteVariant(variantId);
        return ResponseEntity.ok(Map.of("message", "Variant deleted successfully"));
    }

    private Map<String, Object> mapProductToResponse(Product p) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", p.getId().toString());
        map.put("dbId", p.getId());
        map.put("productId", p.getId().toString());
        map.put("name", p.getName());
        map.put("categoryId", p.getCategoryId());
        map.put("basePrice", p.getBasePrice());
        map.put("unitBasePrice", p.getBasePrice());
        map.put("price", p.getBasePrice());
        map.put("taxPercent", p.getTaxPercent());
        map.put("currency", p.getCurrency());
        map.put("isSubscription", p.getIsSubscription());
        map.put("status", "ACTIVE");

        if (p.getCategoryId() != null) {
            productService.findProductCategoryById(p.getCategoryId())
                    .ifPresent(cat -> map.put("category", cat.getName()));
        }
        return map;
    }
}
