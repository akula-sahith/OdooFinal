package com.odoo.DealFlow360.pricing;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/price-lists")
public class PriceListController {

    private final PriceListService priceListService;
    private final PriceListItemService priceListItemService;

    @Autowired
    public PriceListController(PriceListService priceListService, PriceListItemService priceListItemService) {
        this.priceListService = priceListService;
        this.priceListItemService = priceListItemService;
    }

    public static class PriceListCreateRequest {
        public String name;
        public String code;
        public Long discountTierId;
        public String currency;
        public String validFrom;
        public String validTo;
        public String effectiveFrom;
        public String effectiveTo;
    }

    @GetMapping
    public ResponseEntity<?> getAllPriceLists(
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "100") int limit) {

        List<PriceList> priceLists = priceListService.findAllPriceLists();
        List<Map<String, Object>> mapped = priceLists.stream().map(this::mapPriceListToResponse).toList();

        Map<String, Object> response = new HashMap<>();
        response.put("data", mapped);
        response.put("meta", Map.of("total", mapped.size(), "page", page, "limit", limit, "totalPages", 1));
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPriceListById(@PathVariable Long id) {
        return priceListService.findPriceListById(id)
                .map(pl -> {
                    List<PriceListItem> items = priceListItemService.findPriceListItemsByPriceListId(id);
                    Map<String, Object> res = mapPriceListToResponse(pl);
                    res.put("items", items);
                    return ResponseEntity.ok((Object) res);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createPriceList(@RequestBody PriceListCreateRequest request) {
        if (request == null || request.currency == null || request.currency.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Currency is required");
        }

        Instant from = parseInstant(request.validFrom != null ? request.validFrom : request.effectiveFrom);
        Instant to = parseInstant(request.validTo != null ? request.validTo : request.effectiveTo);

        try {
            PriceList priceList = priceListService.createPriceList(null, request.discountTierId, request.currency, from, to);
            PriceList saved = priceListService.savePriceList(priceList);
            return ResponseEntity.status(HttpStatus.CREATED).body(mapPriceListToResponse(saved));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePriceList(@PathVariable Long id, @RequestBody PriceListCreateRequest request) {
        return priceListService.findPriceListById(id)
                .map(existing -> {
                    if (request.discountTierId != null) {
                        existing.setDiscountTierId(request.discountTierId);
                    }
                    if (request.currency != null) {
                        existing.setCurrency(request.currency.trim());
                    }
                    if (request.validFrom != null || request.effectiveFrom != null) {
                        existing.setValidFrom(parseInstant(request.validFrom != null ? request.validFrom : request.effectiveFrom));
                    }
                    if (request.validTo != null || request.effectiveTo != null) {
                        existing.setValidTo(parseInstant(request.validTo != null ? request.validTo : request.effectiveTo));
                    }
                    PriceList updated = priceListService.savePriceList(existing);
                    return ResponseEntity.ok((Object) mapPriceListToResponse(updated));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePriceList(@PathVariable Long id) {
        if (priceListService.findPriceListById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        priceListService.deletePriceList(id);
        return ResponseEntity.ok(Map.of("message", "Price list deleted successfully"));
    }

    @GetMapping("/{id}/items")
    public ResponseEntity<List<PriceListItem>> getPriceListItems(@PathVariable Long id) {
        return ResponseEntity.ok(priceListItemService.findPriceListItemsByPriceListId(id));
    }

    @PostMapping("/{id}/items")
    public ResponseEntity<?> addPriceListItem(@PathVariable Long id, @RequestBody PriceListItem item) {
        if (item == null) {
            return ResponseEntity.badRequest().body("Price list item is required");
        }
        item.setPriceListId(id);
        try {
            PriceListItem saved = priceListItemService.savePriceListItem(item);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<?> deletePriceListItem(@PathVariable Long itemId) {
        priceListItemService.deletePriceListItem(itemId);
        return ResponseEntity.ok(Map.of("message", "Price list item deleted successfully"));
    }

    private Map<String, Object> mapPriceListToResponse(PriceList pl) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", pl.getId().toString());
        map.put("dbId", pl.getId());
        map.put("priceListId", pl.getId().toString());
        map.put("code", "PL-" + pl.getCurrency() + "-" + pl.getId());
        map.put("name", "Standard " + pl.getCurrency() + " Price List #" + pl.getId());
        map.put("currency", pl.getCurrency());
        map.put("discountTierId", pl.getDiscountTierId());
        map.put("status", "ACTIVE");
        map.put("validFrom", pl.getValidFrom() != null ? pl.getValidFrom().toString() : null);
        map.put("validTo", pl.getValidTo() != null ? pl.getValidTo().toString() : null);
        map.put("effectiveFrom", pl.getValidFrom() != null ? pl.getValidFrom().toString() : null);
        map.put("effectiveTo", pl.getValidTo() != null ? pl.getValidTo().toString() : null);
        return map;
    }

    private Instant parseInstant(String dateStr) {
        if (dateStr == null || dateStr.trim().isEmpty()) return null;
        try {
            return Instant.parse(dateStr);
        } catch (Exception e) {
            try {
                return Instant.parse(dateStr + "T00:00:00Z");
            } catch (Exception ex) {
                return null;
            }
        }
    }
}
