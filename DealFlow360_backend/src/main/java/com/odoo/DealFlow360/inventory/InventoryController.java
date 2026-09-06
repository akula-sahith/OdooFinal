package com.odoo.DealFlow360.inventory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class InventoryController {

    private final InventoryService inventoryService;

    @Autowired
    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    public static class ReserveStockRequest {
        public Long warehouseId;
        public Long productId;
        public Integer quantity;
    }

    // ----------------------------------------------------
    // WAREHOUSE ENDPOINTS
    // ----------------------------------------------------

    @GetMapping("/warehouses")
    public ResponseEntity<List<Warehouse>> getAllWarehouses() {
        return ResponseEntity.ok(inventoryService.findAllWarehouses());
    }

    @GetMapping("/warehouses/{id}")
    public ResponseEntity<?> getWarehouseById(@PathVariable Long id) {
        return inventoryService.findWarehouseById(id)
                .map(w -> ResponseEntity.ok((Object) w))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/warehouses")
    public ResponseEntity<?> createWarehouse(@RequestBody Warehouse warehouse) {
        if (warehouse == null || warehouse.getName() == null || warehouse.getName().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Warehouse name is required");
        }
        try {
            Warehouse saved = inventoryService.saveWarehouse(warehouse);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/warehouses/{id}")
    public ResponseEntity<?> updateWarehouse(@PathVariable Long id, @RequestBody Warehouse warehouse) {
        return inventoryService.findWarehouseById(id)
                .map(existing -> {
                    if (warehouse.getName() != null) existing.setName(warehouse.getName());
                    if (warehouse.getLocation() != null) existing.setLocation(warehouse.getLocation());
                    if (warehouse.getShippingWeightFactor() != null) existing.setShippingWeightFactor(warehouse.getShippingWeightFactor());
                    Warehouse saved = inventoryService.saveWarehouse(existing);
                    return ResponseEntity.ok((Object) saved);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/warehouses/{id}/status")
    public ResponseEntity<?> updateWarehouseStatus(@PathVariable Long id, @RequestBody Map<String, String> statusBody) {
        return inventoryService.findWarehouseById(id)
                .map(existing -> {
                    Warehouse saved = inventoryService.saveWarehouse(existing);
                    return ResponseEntity.ok((Object) saved);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // ----------------------------------------------------
    // INVENTORY / STOCK ENDPOINTS
    // ----------------------------------------------------

    @GetMapping("/inventory")
    public ResponseEntity<?> getAllStock() {
        return ResponseEntity.ok(inventoryService.findAllStock());
    }

    @GetMapping("/inventory/product/{productId}")
    public ResponseEntity<?> getStockByProductId(@PathVariable Long productId) {
        List<Stock> stocks = inventoryService.findStockByProductId(productId);
        int totalAvailable = inventoryService.getAvailableStockForProduct(productId);
        Map<String, Object> response = new HashMap<>();
        response.put("productId", productId);
        response.put("totalAvailableStock", totalAvailable);
        response.put("stocks", stocks);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/inventory/reserve")
    public ResponseEntity<?> reserveStock(@RequestBody ReserveStockRequest request) {
        if (request == null || request.warehouseId == null || request.productId == null || request.quantity == null || request.quantity <= 0) {
            return ResponseEntity.badRequest().body("Valid warehouseId, productId, and positive quantity are required");
        }
        try {
            Stock updated = inventoryService.reserveStock(request.warehouseId, request.productId, request.quantity);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/inventory/adjustments")
    public ResponseEntity<?> adjustStock(@RequestBody Map<String, Object> adjustment) {
        try {
            Long warehouseId = Long.valueOf(adjustment.get("warehouseId").toString());
            Long productId = Long.valueOf(adjustment.get("productId").toString());
            Integer quantityChange = Integer.valueOf(adjustment.get("quantityChange").toString());
            
            Stock stock = inventoryService.findStockByWarehouseAndProduct(warehouseId, productId)
                    .orElseGet(() -> {
                        Stock newStock = new Stock();
                        newStock.setWarehouseId(warehouseId);
                        newStock.setProductId(productId);
                        newStock.setOnHandAmount(0);
                        newStock.setReservedAmount(0);
                        return newStock;
                    });
            
            stock.setOnHandAmount(Math.max(0, (stock.getOnHandAmount() != null ? stock.getOnHandAmount() : 0) + quantityChange));
            Stock saved = inventoryService.saveStock(stock);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/inventory/movements")
    public ResponseEntity<?> getInventoryMovements() {
        return ResponseEntity.ok(List.of());
    }
}
