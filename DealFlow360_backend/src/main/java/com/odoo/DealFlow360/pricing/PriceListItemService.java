package com.odoo.DealFlow360.pricing;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

/**
 * Business service handling PriceListItem validation and domain operations.
 */
@Service
public class PriceListItemService {

    private final PriceListItemRepository itemRepository;

    public PriceListItemService() {
        this.itemRepository = null;
    }

    @Autowired
    public PriceListItemService(PriceListItemRepository itemRepository) {
        this.itemRepository = itemRepository;
    }

    /**
     * Validates domain constraints on a PriceListItem entity.
     *
     * @param item PriceListItem entity to validate
     */
    public void validatePriceListItem(PriceListItem item) {
        if (item == null) {
            throw new IllegalArgumentException("Price list item cannot be null");
        }
        if (item.getPriceListId() == null || item.getPriceListId() <= 0) {
            throw new IllegalArgumentException("Price list item must be associated with a valid positive Price List ID");
        }
        if (item.getProductId() == null || item.getProductId() <= 0) {
            throw new IllegalArgumentException("Price list item must be associated with a valid positive Product ID");
        }
        if (item.getProductVariantId() != null && item.getProductVariantId() <= 0) {
            throw new IllegalArgumentException("Product Variant ID must be a positive number if specified");
        }
        if (item.getUnitPrice() == null || item.getUnitPrice().compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Unit price cannot be null or negative");
        }
        if (item.getMinQuantity() == null || item.getMinQuantity() <= 0) {
            throw new IllegalArgumentException("Minimum quantity must be a positive integer (> 0)");
        }
    }

    /**
     * Creates and validates a PriceListItem instance.
     */
    public PriceListItem createPriceListItem(Long id, Long priceListId, Long productId, Long productVariantId, BigDecimal unitPrice, Integer minQuantity) {
        PriceListItem item = new PriceListItem(
                id,
                priceListId,
                productId,
                productVariantId,
                unitPrice,
                minQuantity != null ? minQuantity : 1
        );
        validatePriceListItem(item);
        return item;
    }

    /**
     * Persists a PriceListItem entity after validation.
     */
    public PriceListItem savePriceListItem(PriceListItem item) {
        validatePriceListItem(item);
        if (itemRepository != null) {
            return itemRepository.save(item);
        }
        return item;
    }

    /**
     * Finds a PriceListItem by ID.
     */
    public Optional<PriceListItem> findPriceListItemById(Long id) {
        if (itemRepository != null && id != null) {
            return itemRepository.findById(id);
        }
        return Optional.empty();
    }

    /**
     * Finds all PriceListItems for a Price List ID.
     */
    public List<PriceListItem> findPriceListItemsByPriceListId(Long priceListId) {
        if (itemRepository != null && priceListId != null) {
            return itemRepository.findByPriceListId(priceListId);
        }
        return Collections.emptyList();
    }

    /**
     * Finds all PriceListItems for a Product ID.
     */
    public List<PriceListItem> findPriceListItemsByProductId(Long productId) {
        if (itemRepository != null && productId != null) {
            return itemRepository.findByProductId(productId);
        }
        return Collections.emptyList();
    }

    /**
     * Finds PriceListItems matching both Price List ID and Product ID.
     */
    public List<PriceListItem> findPriceListItemsByPriceListIdAndProductId(Long priceListId, Long productId) {
        if (itemRepository != null && priceListId != null && productId != null) {
            return itemRepository.findByPriceListIdAndProductId(priceListId, productId);
        }
        return Collections.emptyList();
    }

    /**
     * Retrieves all PriceListItems.
     */
    public List<PriceListItem> findAllPriceListItems() {
        if (itemRepository != null) {
            return itemRepository.findAll();
        }
        return Collections.emptyList();
    }

    /**
     * Deletes a PriceListItem by ID.
     */
    public void deletePriceListItem(Long id) {
        if (itemRepository != null && id != null) {
            itemRepository.deleteById(id);
        }
    }
}

