package com.odoo.DealFlow360.pricing;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

/**
 * Business service handling PriceList domain validation and validity checking.
 */
@Service
public class PriceListService {

    private final PriceListRepository priceListRepository;

    public PriceListService() {
        this.priceListRepository = null;
    }

    @Autowired
    public PriceListService(PriceListRepository priceListRepository) {
        this.priceListRepository = priceListRepository;
    }

    /**
     * Validates domain constraints on a PriceList entity.
     *
     * @param priceList PriceList entity to validate
     */
    public void validatePriceList(PriceList priceList) {
        if (priceList == null) {
            throw new IllegalArgumentException("Price list cannot be null");
        }
        if (priceList.getCurrency() == null || priceList.getCurrency().trim().isEmpty()) {
            throw new IllegalArgumentException("Price list currency cannot be null or blank");
        }
        if (priceList.getDiscountTierId() != null && priceList.getDiscountTierId() <= 0) {
            throw new IllegalArgumentException("Discount Tier ID must be a positive number if specified");
        }
        if (priceList.getValidFrom() != null && priceList.getValidTo() != null) {
            if (priceList.getValidFrom().isAfter(priceList.getValidTo())) {
                throw new IllegalArgumentException("Price list validFrom date cannot be after validTo date");
            }
        }
    }

    /**
     * Creates and validates a PriceList instance.
     */
    public PriceList createPriceList(Long id, Long discountTierId, String currency, Instant validFrom, Instant validTo) {
        PriceList priceList = new PriceList(
                id,
                discountTierId,
                currency != null ? currency.trim() : null,
                validFrom,
                validTo
        );
        validatePriceList(priceList);
        return priceList;
    }

    /**
     * Persists a PriceList entity after validation.
     */
    public PriceList savePriceList(PriceList priceList) {
        validatePriceList(priceList);
        if (priceListRepository != null) {
            return priceListRepository.save(priceList);
        }
        return priceList;
    }

    /**
     * Finds a PriceList by ID.
     */
    public Optional<PriceList> findPriceListById(Long id) {
        if (priceListRepository != null && id != null) {
            return priceListRepository.findById(id);
        }
        return Optional.empty();
    }

    /**
     * Finds all PriceLists matching a Discount Tier ID.
     */
    public List<PriceList> findPriceListsByDiscountTierId(Long discountTierId) {
        if (priceListRepository != null && discountTierId != null) {
            return priceListRepository.findByDiscountTierId(discountTierId);
        }
        return Collections.emptyList();
    }

    /**
     * Retrieves all PriceLists.
     */
    public List<PriceList> findAllPriceLists() {
        if (priceListRepository != null) {
            return priceListRepository.findAll();
        }
        return Collections.emptyList();
    }

    /**
     * Deletes a PriceList by ID.
     */
    public void deletePriceList(Long id) {
        if (priceListRepository != null && id != null) {
            priceListRepository.deleteById(id);
        }
    }

    /**
     * Determines whether a PriceList is active at a given requested instant.
     *
     * Implementation Policy / Convention:
     * - Null validFrom represents an open lower bound (no starting restriction).
     * - Null validTo represents an open upper bound (no ending restriction).
     * - When specified, validity bounds are evaluated INCLUSIVELY (validFrom <= instant <= validTo).
     *
     * @param priceList PriceList entity to check
     * @param instant   Requested point in time
     * @return true if active at the given instant, false otherwise
     */
    public boolean isActive(PriceList priceList, Instant instant) {
        if (priceList == null || instant == null) {
            return false;
        }

        // Validate basic state before checking activity
        validatePriceList(priceList);

        if (priceList.getValidFrom() != null && instant.isBefore(priceList.getValidFrom())) {
            return false;
        }
        if (priceList.getValidTo() != null && instant.isAfter(priceList.getValidTo())) {
            return false;
        }
        return true;
    }
}

