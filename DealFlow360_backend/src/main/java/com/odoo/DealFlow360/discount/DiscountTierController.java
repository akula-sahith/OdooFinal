package com.odoo.DealFlow360.discount;

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
public class DiscountTierController {

    private final DiscountService discountService;

    @Autowired
    public DiscountTierController(DiscountService discountService) {
        this.discountService = discountService;
    }

    public static class DiscountTierCreateRequest {
        public String name;
        public BigDecimal maxDiscountPercent;
        public BigDecimal maxDiscount;
    }

    public static class CategoryCeilingCreateRequest {
        public Long categoryId;
        public Long tierId;
        public BigDecimal maxDiscountPercent;
    }

    // ----------------------------------------------------
    // DISCOUNT TIERS ENDPOINTS
    // ----------------------------------------------------

    @GetMapping("/discount-tiers")
    public ResponseEntity<?> getAllDiscountTiers(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "100") int limit) {

        List<DiscountTier> tiers = discountService.findAllDiscountTiers();

        if (search != null && !search.trim().isEmpty()) {
            String s = search.trim().toLowerCase();
            tiers = tiers.stream()
                    .filter(t -> t.getName() != null && t.getName().toLowerCase().contains(s))
                    .toList();
        }

        List<Map<String, Object>> mapped = tiers.stream().map(this::mapTierToResponse).toList();

        Map<String, Object> response = new HashMap<>();
        response.put("data", mapped);
        response.put("meta", Map.of("total", mapped.size(), "page", page, "limit", limit, "totalPages", 1));
        return ResponseEntity.ok(response);
    }

    @GetMapping("/discount-tiers/{id}")
    public ResponseEntity<?> getDiscountTierById(@PathVariable Long id) {
        return discountService.findDiscountTierById(id)
                .map(t -> ResponseEntity.ok((Object) mapTierToResponse(t)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/discount-tiers")
    public ResponseEntity<?> createDiscountTier(@RequestBody DiscountTierCreateRequest request) {
        if (request == null || request.name == null || request.name.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Discount tier name is required");
        }

        BigDecimal maxDisc = request.maxDiscountPercent != null ? request.maxDiscountPercent
                : (request.maxDiscount != null ? request.maxDiscount : BigDecimal.ZERO);

        try {
            DiscountTier tier = discountService.createDiscountTier(null, request.name, maxDisc);
            DiscountTier saved = discountService.saveDiscountTier(tier);
            return ResponseEntity.status(HttpStatus.CREATED).body(mapTierToResponse(saved));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/discount-tiers/{id}")
    public ResponseEntity<?> updateDiscountTier(@PathVariable Long id, @RequestBody DiscountTierCreateRequest request) {
        return discountService.findDiscountTierById(id)
                .map(existing -> {
                    if (request.name != null && !request.name.trim().isEmpty()) {
                        existing.setName(request.name.trim());
                    }
                    if (request.maxDiscountPercent != null || request.maxDiscount != null) {
                        BigDecimal maxDisc = request.maxDiscountPercent != null ? request.maxDiscountPercent : request.maxDiscount;
                        existing.setMaxDiscountPercent(maxDisc);
                    }
                    DiscountTier updated = discountService.saveDiscountTier(existing);
                    return ResponseEntity.ok((Object) mapTierToResponse(updated));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/discount-tiers/{id}")
    public ResponseEntity<?> deleteDiscountTier(@PathVariable Long id) {
        if (!discountService.existsDiscountTierById(id)) {
            return ResponseEntity.notFound().build();
        }
        discountService.deleteDiscountTierById(id);
        return ResponseEntity.ok(Map.of("message", "Discount tier deleted successfully"));
    }

    // ----------------------------------------------------
    // CATEGORY DISCOUNT CEILINGS ENDPOINTS
    // ----------------------------------------------------

    @GetMapping("/discount-ceilings")
    public ResponseEntity<List<CategoryDiscountCeiling>> getAllCategoryCeilings(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Long tierId) {

        if (categoryId != null) {
            return ResponseEntity.ok(discountService.findCategoryDiscountCeilingsByCategoryId(categoryId));
        }
        if (tierId != null) {
            return ResponseEntity.ok(discountService.findCategoryDiscountCeilingsByTierId(tierId));
        }

        return ResponseEntity.ok(discountService.findAllCategoryDiscountCeilings());
    }

    @PostMapping("/discount-ceilings")
    public ResponseEntity<?> createCategoryCeiling(@RequestBody CategoryCeilingCreateRequest request) {
        if (request == null || request.categoryId == null || request.tierId == null || request.maxDiscountPercent == null) {
            return ResponseEntity.badRequest().body("Category ID, Tier ID, and Max Discount Percent are required");
        }
        try {
            CategoryDiscountCeiling ceiling = discountService.createCategoryDiscountCeiling(
                    null, request.categoryId, request.tierId, request.maxDiscountPercent
            );
            CategoryDiscountCeiling saved = discountService.saveCategoryDiscountCeiling(ceiling);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/discount-ceilings/{id}")
    public ResponseEntity<?> deleteCategoryCeiling(@PathVariable Long id) {
        if (!discountService.existsCategoryDiscountCeilingById(id)) {
            return ResponseEntity.notFound().build();
        }
        discountService.deleteCategoryDiscountCeilingById(id);
        return ResponseEntity.ok(Map.of("message", "Category discount ceiling deleted successfully"));
    }

    private Map<String, Object> mapTierToResponse(DiscountTier t) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", t.getId().toString());
        map.put("dbId", t.getId());
        map.put("tierId", t.getId().toString());
        map.put("name", t.getName());
        map.put("maxDiscountPercent", t.getMaxDiscountPercent());
        map.put("maxDiscount", t.getMaxDiscountPercent());
        map.put("status", "ACTIVE");
        return map;
    }
}
