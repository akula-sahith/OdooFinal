package com.odoo.DealFlow360.inventory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

/**
 * Service managing Warehouses and Stock levels with transactional safety and row-level concurrency locking.
 */
@Service
public class InventoryService {

    private final InventoryEngine inventoryEngine;
    private final WarehouseRepository warehouseRepository;
    private final StockRepository stockRepository;

    public InventoryService() {
        this(new InventoryEngine(), null, null);
    }

    @Autowired
    public InventoryService(InventoryEngine inventoryEngine,
                             WarehouseRepository warehouseRepository,
                             StockRepository stockRepository) {
        this.inventoryEngine = inventoryEngine != null ? inventoryEngine : new InventoryEngine();
        this.warehouseRepository = warehouseRepository;
        this.stockRepository = stockRepository;
    }

    @Transactional
    public Warehouse saveWarehouse(Warehouse warehouse) {
        if (warehouse == null || warehouse.getName() == null || warehouse.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Warehouse name cannot be null or blank");
        }
        if (warehouseRepository != null) {
            return warehouseRepository.save(warehouse);
        }
        return warehouse;
    }

    public Optional<Warehouse> findWarehouseById(Long id) {
        if (warehouseRepository != null && id != null) {
            return warehouseRepository.findById(id);
        }
        return Optional.empty();
    }

    public List<Warehouse> findAllWarehouses() {
        if (warehouseRepository != null) {
            return warehouseRepository.findAll();
        }
        return Collections.emptyList();
    }

    @Transactional
    public Stock saveStock(Stock stock) {
        if (stock == null || stock.getWarehouseId() == null || stock.getProductId() == null) {
            throw new IllegalArgumentException("Stock record must have valid warehouse ID and product ID");
        }
        if (stockRepository != null) {
            return stockRepository.save(stock);
        }
        return stock;
    }

    public Optional<Stock> findStockByWarehouseAndProduct(Long warehouseId, Long productId) {
        if (stockRepository != null && warehouseId != null && productId != null) {
            return stockRepository.findByWarehouseIdAndProductId(warehouseId, productId);
        }
        return Optional.empty();
    }

    public List<Stock> findStockByProductId(Long productId) {
        if (stockRepository != null && productId != null) {
            return stockRepository.findByProductId(productId);
        }
        return Collections.emptyList();
    }

    public int getAvailableStockForProduct(Long productId) {
        List<Stock> stocks = findStockByProductId(productId);
        return inventoryEngine.calculateTotalAvailableStock(stocks);
    }

    @Transactional
    public Stock reserveStock(Long warehouseId, Long productId, int quantity) {
        if (stockRepository == null) {
            throw new IllegalStateException("StockRepository is not initialized");
        }
        // Concurrency-safe lookup with FOR UPDATE lock
        Stock stock = stockRepository.findByWarehouseIdAndProductIdForUpdate(warehouseId, productId)
                .orElseThrow(() -> new IllegalArgumentException("Stock record not found for warehouse " + warehouseId + " and product " + productId));

        inventoryEngine.reserveStock(stock, quantity);
        return stockRepository.save(stock);
    }

    @Transactional
    public Stock releaseStock(Long warehouseId, Long productId, int quantity) {
        if (stockRepository == null) {
            throw new IllegalStateException("StockRepository is not initialized");
        }
        Stock stock = stockRepository.findByWarehouseIdAndProductIdForUpdate(warehouseId, productId)
                .orElseThrow(() -> new IllegalArgumentException("Stock record not found for warehouse " + warehouseId + " and product " + productId));

        inventoryEngine.releaseStock(stock, quantity);
        return stockRepository.save(stock);
    }

    @Transactional
    public Stock fulfillStock(Long warehouseId, Long productId, int quantity) {
        if (stockRepository == null) {
            throw new IllegalStateException("StockRepository is not initialized");
        }
        Stock stock = stockRepository.findByWarehouseIdAndProductIdForUpdate(warehouseId, productId)
                .orElseThrow(() -> new IllegalArgumentException("Stock record not found for warehouse " + warehouseId + " and product " + productId));

        inventoryEngine.fulfillReservedStock(stock, quantity);
        return stockRepository.save(stock);
    }
}
