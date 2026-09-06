package com.odoo.DealFlow360.fulfillment;

import com.odoo.DealFlow360.inventory.InventoryService;
import com.odoo.DealFlow360.inventory.Stock;
import com.odoo.DealFlow360.inventory.Warehouse;
import com.odoo.DealFlow360.quotation.Quotation;
import com.odoo.DealFlow360.quotation.QuotationLine;
import com.odoo.DealFlow360.quotation.QuotationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

/**
 * Service managing Order lifecycle, quotation conversion, multi-warehouse fulfillment splitting, and backorder handling.
 */
@Service
public class FulfillmentService {

    private final FulfillmentEngine fulfillmentEngine;
    private final QuotationService quotationService;
    private final InventoryService inventoryService;
    private final OrderRepository orderRepository;
    private final OrderLineRepository orderLineRepository;
    private final FulfillmentOrderRepository fulfillmentOrderRepository;
    private final FulfillmentSplitRepository fulfillmentSplitRepository;

    public FulfillmentService() {
        this(new FulfillmentEngine(), null, null, null, null, null, null);
    }

    @Autowired
    public FulfillmentService(FulfillmentEngine fulfillmentEngine,
                               QuotationService quotationService,
                               InventoryService inventoryService,
                               OrderRepository orderRepository,
                               OrderLineRepository orderLineRepository,
                               FulfillmentOrderRepository fulfillmentOrderRepository,
                               FulfillmentSplitRepository fulfillmentSplitRepository) {
        this.fulfillmentEngine = fulfillmentEngine != null ? fulfillmentEngine : new FulfillmentEngine();
        this.quotationService = quotationService;
        this.inventoryService = inventoryService;
        this.orderRepository = orderRepository;
        this.orderLineRepository = orderLineRepository;
        this.fulfillmentOrderRepository = fulfillmentOrderRepository;
        this.fulfillmentSplitRepository = fulfillmentSplitRepository;
    }

    /**
     * Converts a confirmed Quotation into a new Order entity with corresponding OrderLine entries.
     */
    @Transactional
    public Order convertQuotationToOrder(Quotation quotation, List<QuotationLine> quotationLines) {
        if (quotation == null) {
            throw new IllegalArgumentException("Quotation cannot be null");
        }
        if (quotation.getCustomerId() == null || quotation.getCustomerId() <= 0) {
            throw new IllegalArgumentException("Quotation must have a valid positive Customer ID");
        }

        Instant now = Instant.now();
        Order order = new Order(
                null,
                quotation.getId(),
                quotation.getCustomerId(),
                "CONFIRMED",
                quotation.getCurrency() != null ? quotation.getCurrency() : "USD",
                quotation.getSubtotalAmount() != null ? quotation.getSubtotalAmount() : BigDecimal.ZERO,
                quotation.getTaxAmount() != null ? quotation.getTaxAmount() : BigDecimal.ZERO,
                quotation.getTotalAmount() != null ? quotation.getTotalAmount() : BigDecimal.ZERO,
                BigDecimal.ZERO,
                now,
                now
        );

        if (orderRepository != null) {
            order = orderRepository.save(order);
        } else {
            order.setId(1L);
        }

        if (quotationLines != null && orderLineRepository != null) {
            for (QuotationLine qLine : quotationLines) {
                if (qLine != null) {
                    OrderLine oLine = new OrderLine(
                            null,
                            order.getId(),
                            qLine.getProductId(),
                            qLine.getProductVariantId(),
                            qLine.getQuantity(),
                            qLine.getUnitPrice(),
                            qLine.getTaxPercent(),
                            qLine.getSubtotalAmount(),
                            qLine.getTaxAmount(),
                            qLine.getTotalAmount(),
                            false // updated by subscription domain if recurring
                    );
                    orderLineRepository.save(oLine);
                }
            }
        }

        if (quotationService != null) {
            quotationService.changeQuotationStatus(quotation, "CONFIRMED");
            quotationService.saveQuotation(quotation);
        }

        return order;
    }

    /**
     * Generates auto-split recommendations and creates FulfillmentOrder + FulfillmentSplit records for an Order.
     */
    @Transactional
    public FulfillmentOrder processOrderFulfillmentSplit(Long orderId) {
        if (orderRepository == null || orderLineRepository == null || inventoryService == null) {
            throw new IllegalStateException("Repositories/Services not initialized");
        }

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found with ID: " + orderId));

        List<OrderLine> lines = orderLineRepository.findByOrderId(orderId);
        List<Warehouse> warehouses = inventoryService.findAllWarehouses();

        FulfillmentOrder fo = new FulfillmentOrder(null, order.getId(), "PROCESSING", Instant.now(), null);
        if (fulfillmentOrderRepository != null) {
            fo = fulfillmentOrderRepository.save(fo);
        } else {
            fo.setId(1L);
        }

        for (OrderLine line : lines) {
            List<Stock> availableStock = inventoryService.findStockByProductId(line.getProductId());
            List<FulfillmentEngine.SplitRecommendation> recommendations = fulfillmentEngine.calculateLineSplit(line, warehouses, availableStock);

            for (FulfillmentEngine.SplitRecommendation rec : recommendations) {
                FulfillmentSplit split = new FulfillmentSplit(
                        null,
                        fo.getId(),
                        line.getId(),
                        rec.getWarehouseId(),
                        rec.getQuantityAllocated(),
                        0,
                        rec.isBackorder() ? "STOCK_DEFICIT" : null
                );
                if (fulfillmentSplitRepository != null) {
                    fulfillmentSplitRepository.save(split);
                }

                // Reserve stock in inventory if not backorder
                if (!rec.isBackorder() && rec.getQuantityAllocated() > 0) {
                    inventoryService.reserveStock(rec.getWarehouseId(), line.getProductId(), rec.getQuantityAllocated());
                }
            }
        }

        return fo;
    }

    @Transactional
    public FulfillmentOrder overrideFulfillmentSplit(Long orderId, List<ManualSplitItem> items) {
        if (orderRepository == null || orderLineRepository == null || inventoryService == null) {
            throw new IllegalStateException("Services not initialized");
        }

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found with ID: " + orderId));

        List<FulfillmentOrder> existingFos = findFulfillmentOrdersByOrderId(orderId);
        FulfillmentOrder fo;
        if (existingFos.isEmpty()) {
            fo = new FulfillmentOrder(null, order.getId(), "MANUAL_OVERRIDE", Instant.now(), null);
            if (fulfillmentOrderRepository != null) fo = fulfillmentOrderRepository.save(fo);
        } else {
            fo = existingFos.get(0);
            fo.setStatus("MANUAL_OVERRIDE");
            if (fulfillmentOrderRepository != null) fo = fulfillmentOrderRepository.save(fo);
        }

        if (items != null) {
            for (ManualSplitItem item : items) {
                OrderLine line = orderLineRepository.findById(item.orderLineId).orElse(null);
                if (line != null && item.warehouseId != null && item.quantityAllocated != null && item.quantityAllocated > 0) {
                    FulfillmentSplit split = new FulfillmentSplit(
                            null,
                            fo.getId(),
                            line.getId(),
                            item.warehouseId,
                            item.quantityAllocated,
                            0,
                            null
                    );
                    if (fulfillmentSplitRepository != null) {
                        fulfillmentSplitRepository.save(split);
                    }
                    inventoryService.reserveStock(item.warehouseId, line.getProductId(), item.quantityAllocated);
                }
            }
        }

        return fo;
    }

    public static class ManualSplitItem {
        public Long orderLineId;
        public Long warehouseId;
        public Integer quantityAllocated;
    }

    public Optional<Order> findOrderById(Long id) {
        if (orderRepository != null && id != null) {
            return orderRepository.findById(id);
        }
        return Optional.empty();
    }

    public Optional<Order> findOrderByQuotationId(Long quotationId) {
        if (orderRepository != null && quotationId != null) {
            return orderRepository.findByQuotationId(quotationId);
        }
        return Optional.empty();
    }

    public List<Order> findOrdersByCustomerId(Long customerId) {
        if (orderRepository != null && customerId != null) {
            return orderRepository.findByCustomerId(customerId);
        }
        return Collections.emptyList();
    }

    public List<Order> findAllOrders() {
        if (orderRepository != null) {
            return orderRepository.findAll();
        }
        return Collections.emptyList();
    }

    public List<OrderLine> findOrderLinesByOrderId(Long orderId) {
        if (orderLineRepository != null && orderId != null) {
            return orderLineRepository.findByOrderId(orderId);
        }
        return Collections.emptyList();
    }

    public List<FulfillmentOrder> findFulfillmentOrdersByOrderId(Long orderId) {
        if (fulfillmentOrderRepository != null && orderId != null) {
            return fulfillmentOrderRepository.findByOrderId(orderId);
        }
        return Collections.emptyList();
    }

    public List<FulfillmentSplit> findFulfillmentSplitsByFulfillmentOrderId(Long fulfillmentOrderId) {
        if (fulfillmentSplitRepository != null && fulfillmentOrderId != null) {
            return fulfillmentSplitRepository.findByFulfillmentOrderId(fulfillmentOrderId);
        }
        return Collections.emptyList();
    }
}
