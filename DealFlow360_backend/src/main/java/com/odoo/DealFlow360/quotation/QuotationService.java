package com.odoo.DealFlow360.quotation;

import com.odoo.DealFlow360.pricing.PriceCalculationResult;
import com.odoo.DealFlow360.pricing.PriceList;
import com.odoo.DealFlow360.pricing.PriceListItem;
import com.odoo.DealFlow360.pricing.PricingEngine;
import com.odoo.DealFlow360.product.Product;
import com.odoo.DealFlow360.product.ProductVariant;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;

/**
 * Business service handling Quotation domain validation, quotation line creation with PricingEngine,
 * monetary total recalculation, state machine transitions, quotation locking, and versioning.
 * Integrates with Spring JDBC repositories for persistence with transactional boundaries.
 */
@Service
public class QuotationService {

    private static final Set<String> ALLOWED_STATUSES = new HashSet<>(Arrays.asList(
            "DRAFT", "SENT", "UNDER_NEGOTIATION", "PENDING_APPROVAL",
            "APPROVED", "REJECTED", "RETURNED_FOR_REVISION", "CONFIRMED"
    ));

    private final PricingEngine pricingEngine;
    private final QuotationRepository quotationRepository;
    private final QuotationLineRepository quotationLineRepository;
    private final QuotationVersionRepository quotationVersionRepository;

    public QuotationService() {
        this(new PricingEngine(), null, null, null);
    }

    public QuotationService(PricingEngine pricingEngine) {
        this(pricingEngine, null, null, null);
    }

    @Autowired
    public QuotationService(PricingEngine pricingEngine,
                            QuotationRepository quotationRepository,
                            QuotationLineRepository quotationLineRepository,
                            QuotationVersionRepository quotationVersionRepository) {
        this.pricingEngine = pricingEngine != null ? pricingEngine : new PricingEngine();
        this.quotationRepository = quotationRepository;
        this.quotationLineRepository = quotationLineRepository;
        this.quotationVersionRepository = quotationVersionRepository;
    }

    /**
     * Validates domain constraints on a Quotation object.
     */
    public void validateQuotation(Quotation quotation) {
        if (quotation == null) {
            throw new IllegalArgumentException("Quotation cannot be null");
        }
        if (quotation.getCustomerId() == null || quotation.getCustomerId() <= 0) {
            throw new IllegalArgumentException("Quotation must be associated with a valid positive Customer ID");
        }
        if (quotation.getPriceListId() != null && quotation.getPriceListId() <= 0) {
            throw new IllegalArgumentException("Price List ID must be a positive number if specified");
        }
        if (quotation.getStatus() == null || quotation.getStatus().trim().isEmpty()) {
            throw new IllegalArgumentException("Quotation status cannot be null or blank");
        }
        if (!ALLOWED_STATUSES.contains(quotation.getStatus().trim().toUpperCase())) {
            throw new IllegalArgumentException("Invalid quotation status: " + quotation.getStatus());
        }
        if (quotation.getCurrency() == null || quotation.getCurrency().trim().isEmpty()) {
            throw new IllegalArgumentException("Quotation currency cannot be null or blank");
        }
        if (quotation.getSubtotalAmount() != null && quotation.getSubtotalAmount().compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Subtotal amount cannot be negative");
        }
        if (quotation.getTaxAmount() != null && quotation.getTaxAmount().compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Tax amount cannot be negative");
        }
        if (quotation.getTotalAmount() != null && quotation.getTotalAmount().compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Total amount cannot be negative");
        }
    }

    /**
     * Creates and validates a new Quotation instance in DRAFT status.
     */
    public Quotation createQuotation(Long id, Long customerId, Long priceListId, String currency) {
        Instant now = Instant.now();
        Quotation quotation = new Quotation(
                id,
                customerId,
                priceListId,
                "DRAFT",
                currency != null ? currency.trim() : "USD",
                BigDecimal.ZERO,
                BigDecimal.ZERO,
                BigDecimal.ZERO,
                null,
                now,
                now
        );
        validateQuotation(quotation);
        return quotation;
    }

    /**
     * Checks if a quotation is in a locked/terminal state (CONFIRMED or REJECTED).
     */
    public boolean isQuotationLocked(Quotation quotation) {
        if (quotation == null || quotation.getStatus() == null) {
            return false;
        }
        String status = quotation.getStatus().trim().toUpperCase();
        return "CONFIRMED".equals(status) || "REJECTED".equals(status);
    }

    /**
     * Validates status transitions for the Quotation state machine.
     */
    public void validateStatusTransition(String currentStatus, String newStatus) {
        if (newStatus == null || newStatus.trim().isEmpty()) {
            throw new IllegalArgumentException("New status cannot be null or blank");
        }
        String current = currentStatus != null ? currentStatus.trim().toUpperCase() : "DRAFT";
        String target = newStatus.trim().toUpperCase();

        if (!ALLOWED_STATUSES.contains(target)) {
            throw new IllegalArgumentException("Invalid quotation status: " + newStatus);
        }

        if (current.equals(target)) {
            return; // No-op transition
        }

        if ("CONFIRMED".equals(current) || "REJECTED".equals(current)) {
            throw new IllegalStateException("Cannot transition out of terminal quotation status: " + current);
        }

        boolean valid = false;
        switch (current) {
            case "DRAFT":
                valid = "SENT".equals(target) || "REJECTED".equals(target) || "PENDING_APPROVAL".equals(target) ||
                        "APPROVED".equals(target) || "UNDER_NEGOTIATION".equals(target) || "CONFIRMED".equals(target);
                break;
            case "SENT":
                valid = "UNDER_NEGOTIATION".equals(target) || "PENDING_APPROVAL".equals(target) ||
                        "APPROVED".equals(target) || "REJECTED".equals(target) ||
                        "RETURNED_FOR_REVISION".equals(target) || "CONFIRMED".equals(target);
                break;
            case "UNDER_NEGOTIATION":
                valid = "PENDING_APPROVAL".equals(target) || "APPROVED".equals(target) ||
                        "REJECTED".equals(target) || "RETURNED_FOR_REVISION".equals(target) || "SENT".equals(target) || "CONFIRMED".equals(target);
                break;
            case "PENDING_APPROVAL":
                valid = "APPROVED".equals(target) || "REJECTED".equals(target) || "RETURNED_FOR_REVISION".equals(target);
                break;
            case "APPROVED":
                valid = "SENT".equals(target) || "CONFIRMED".equals(target) || "REJECTED".equals(target) || "RETURNED_FOR_REVISION".equals(target) || "UNDER_NEGOTIATION".equals(target);
                break;
            case "RETURNED_FOR_REVISION":
                valid = "DRAFT".equals(target) || "SENT".equals(target) || "PENDING_APPROVAL".equals(target);
                break;
            default:
                valid = false;
        }

        if (!valid) {
            throw new IllegalStateException("Illegal quotation status transition from " + current + " to " + target);
        }
    }

    /**
     * Changes the status of a quotation after validating the state machine transition.
     */
    public void changeQuotationStatus(Quotation quotation, String newStatus) {
        if (quotation == null) {
            throw new IllegalArgumentException("Quotation cannot be null");
        }
        validateStatusTransition(quotation.getStatus(), newStatus);
        quotation.setStatus(newStatus.trim().toUpperCase());
        quotation.setUpdatedAt(Instant.now());
    }

    /**
     * Calculates line pricing using the existing PricingEngine and returns a populated QuotationLine.
     */
    public QuotationLine calculateLinePrice(Quotation quotation, PriceList priceList, List<PriceListItem> candidateItems,
                                             Product product, ProductVariant variant, int quantity, Instant pricingInstant) {
        if (quotation == null) {
            throw new IllegalArgumentException("Quotation cannot be null");
        }
        if (isQuotationLocked(quotation)) {
            throw new IllegalStateException("Cannot add line to a locked quotation in status: " + quotation.getStatus());
        }
        if (product == null || product.getId() == null || product.getId() <= 0) {
            throw new IllegalArgumentException("Product cannot be null and must have a positive ID");
        }
        if (variant != null) {
            if (variant.getProductId() == null || !variant.getProductId().equals(product.getId())) {
                throw new IllegalArgumentException("Product variant does not belong to the specified product");
            }
        }
        if (quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be positive (> 0)");
        }

        PriceCalculationResult priceResult = pricingEngine.calculatePrice(priceList, candidateItems, product, variant, quantity, pricingInstant);

        BigDecimal taxPercent = product.getTaxPercent() != null ? product.getTaxPercent() : BigDecimal.ZERO;

        return new QuotationLine(
                null,
                quotation.getId(),
                product.getId(),
                variant != null ? variant.getId() : null,
                quantity,
                priceResult.getUnitPrice(),
                taxPercent,
                priceResult.getNetAmount(),
                priceResult.getTaxAmount(),
                priceResult.getGrossAmount()
        );
    }

    /**
     * Recalculates quotation monetary totals (subtotal, tax, total) derived from its lines.
     */
    public void recalculateQuotationTotals(Quotation quotation, List<QuotationLine> lines) {
        if (quotation == null) {
            throw new IllegalArgumentException("Quotation cannot be null");
        }

        BigDecimal subtotal = BigDecimal.ZERO;
        BigDecimal tax = BigDecimal.ZERO;
        BigDecimal total = BigDecimal.ZERO;

        if (lines != null) {
            for (QuotationLine line : lines) {
                if (line != null) {
                    if (line.getSubtotalAmount() != null) {
                        subtotal = subtotal.add(line.getSubtotalAmount());
                    }
                    if (line.getTaxAmount() != null) {
                        tax = tax.add(line.getTaxAmount());
                    }
                    if (line.getTotalAmount() != null) {
                        total = total.add(line.getTotalAmount());
                    }
                }
            }
        }

        quotation.setSubtotalAmount(subtotal);
        quotation.setTaxAmount(tax);
        quotation.setTotalAmount(total);
        quotation.setUpdatedAt(Instant.now());
    }

    /**
     * Adds a quotation line to a quotation and recalculates quotation totals.
     */
    public void addQuotationLine(Quotation quotation, List<QuotationLine> currentLines, QuotationLine newLine) {
        if (quotation == null) {
            throw new IllegalArgumentException("Quotation cannot be null");
        }
        if (isQuotationLocked(quotation)) {
            throw new IllegalStateException("Cannot modify lines for a locked quotation in status: " + quotation.getStatus());
        }
        if (newLine == null) {
            throw new IllegalArgumentException("Quotation line cannot be null");
        }
        if (newLine.getProductId() == null || newLine.getProductId() <= 0) {
            throw new IllegalArgumentException("Quotation line must have a positive Product ID");
        }
        if (newLine.getQuantity() == null || newLine.getQuantity() <= 0) {
            throw new IllegalArgumentException("Quotation line quantity must be positive (> 0)");
        }

        newLine.setQuotationId(quotation.getId());
        currentLines.add(newLine);
        recalculateQuotationTotals(quotation, currentLines);
    }

    /**
     * Updates an existing line in a quotation and recalculates totals.
     */
    public void updateQuotationLine(Quotation quotation, List<QuotationLine> currentLines, QuotationLine updatedLine) {
        if (quotation == null) {
            throw new IllegalArgumentException("Quotation cannot be null");
        }
        if (isQuotationLocked(quotation)) {
            throw new IllegalStateException("Cannot modify lines for a locked quotation in status: " + quotation.getStatus());
        }
        if (updatedLine == null || updatedLine.getId() == null) {
            throw new IllegalArgumentException("Updated line cannot be null and must have an ID");
        }
        if (updatedLine.getQuantity() == null || updatedLine.getQuantity() <= 0) {
            throw new IllegalArgumentException("Quotation line quantity must be positive (> 0)");
        }

        boolean found = false;
        for (int i = 0; i < currentLines.size(); i++) {
            QuotationLine existing = currentLines.get(i);
            if (existing != null && Objects.equals(existing.getId(), updatedLine.getId())) {
                currentLines.set(i, updatedLine);
                found = true;
                break;
            }
        }

        if (!found) {
            throw new IllegalArgumentException("Quotation line with ID " + updatedLine.getId() + " not found");
        }

        recalculateQuotationTotals(quotation, currentLines);
    }

    /**
     * Removes a line from a quotation and recalculates totals.
     */
    public void removeQuotationLine(Quotation quotation, List<QuotationLine> currentLines, Long lineId) {
        if (quotation == null) {
            throw new IllegalArgumentException("Quotation cannot be null");
        }
        if (isQuotationLocked(quotation)) {
            throw new IllegalStateException("Cannot modify lines for a locked quotation in status: " + quotation.getStatus());
        }
        if (lineId == null || lineId <= 0) {
            throw new IllegalArgumentException("Line ID must be a positive number");
        }

        boolean removed = currentLines.removeIf(line -> line != null && lineId.equals(line.getId()));
        if (!removed) {
            throw new IllegalArgumentException("Quotation line with ID " + lineId + " not found");
        }

        recalculateQuotationTotals(quotation, currentLines);
    }

    /**
     * Creates a new QuotationVersion snapshot capturing the quotation's state and incrementing version number.
     */
    public QuotationVersion createQuotationVersion(Quotation quotation, List<QuotationVersion> existingVersions, String changeSummary) {
        if (quotation == null) {
            throw new IllegalArgumentException("Quotation cannot be null");
        }
        if (quotation.getId() == null || quotation.getId() <= 0) {
            throw new IllegalArgumentException("Quotation must have a valid positive ID to create a version");
        }

        int nextVersionNumber = 1;
        if (existingVersions != null && !existingVersions.isEmpty()) {
            int maxVersion = existingVersions.stream()
                    .filter(v -> v != null && v.getVersionNumber() != null)
                    .mapToInt(QuotationVersion::getVersionNumber)
                    .max()
                    .orElse(0);
            nextVersionNumber = maxVersion + 1;
        }

        return new QuotationVersion(
                null,
                quotation.getId(),
                nextVersionNumber,
                quotation.getStatus(),
                quotation.getTotalAmount() != null ? quotation.getTotalAmount() : BigDecimal.ZERO,
                changeSummary != null ? changeSummary.trim() : "Version " + nextVersionNumber,
                Instant.now()
        );
    }

    // ==========================================
    // PERSISTENCE & TRANSACTIONAL WORKFLOW METHODS
    // ==========================================

    @Transactional
    public Quotation saveQuotation(Quotation quotation) {
        validateQuotation(quotation);
        if (quotationRepository == null) {
            throw new IllegalStateException("QuotationRepository is not initialized");
        }
        return quotationRepository.save(quotation);
    }

    public Optional<Quotation> findQuotationById(Long id) {
        if (quotationRepository == null) {
            throw new IllegalStateException("QuotationRepository is not initialized");
        }
        return quotationRepository.findById(id);
    }

    public List<Quotation> findQuotationsByCustomerId(Long customerId) {
        if (quotationRepository == null) {
            throw new IllegalStateException("QuotationRepository is not initialized");
        }
        return quotationRepository.findByCustomerId(customerId);
    }

    public List<Quotation> findCustomerVisibleQuotations(Long customerId) {
        if (quotationRepository == null) {
            return java.util.Collections.emptyList();
        }
        if (customerId == null) {
            return java.util.Collections.emptyList();
        }
        return quotationRepository.findByCustomerIdAndStatuses(customerId, List.of("SENT", "UNDER_NEGOTIATION", "CONFIRMED"));
    }

    public List<Quotation> findQuotationsByStatus(String status) {
        if (quotationRepository == null) {
            throw new IllegalStateException("QuotationRepository is not initialized");
        }
        return quotationRepository.findByStatus(status);
    }

    public List<Quotation> findAllQuotations() {
        if (quotationRepository == null) {
            throw new IllegalStateException("QuotationRepository is not initialized");
        }
        return quotationRepository.findAll();
    }

    @Transactional
    public void deleteQuotationById(Long id) {
        if (quotationRepository == null) {
            throw new IllegalStateException("QuotationRepository is not initialized");
        }
        quotationRepository.deleteById(id);
    }

    @Transactional
    public QuotationLine saveQuotationLine(QuotationLine line) {
        if (quotationLineRepository == null) {
            throw new IllegalStateException("QuotationLineRepository is not initialized");
        }
        return quotationLineRepository.save(line);
    }

    public Optional<QuotationLine> findQuotationLineById(Long id) {
        if (quotationLineRepository == null) {
            throw new IllegalStateException("QuotationLineRepository is not initialized");
        }
        return quotationLineRepository.findById(id);
    }

    public List<QuotationLine> findLinesByQuotationId(Long quotationId) {
        if (quotationLineRepository == null) {
            throw new IllegalStateException("QuotationLineRepository is not initialized");
        }
        return quotationLineRepository.findByQuotationId(quotationId);
    }

    @Transactional
    public void deleteQuotationLineById(Long id) {
        if (quotationLineRepository == null) {
            throw new IllegalStateException("QuotationLineRepository is not initialized");
        }
        quotationLineRepository.deleteById(id);
    }

    @Transactional
    public void deleteLinesByQuotationId(Long quotationId) {
        if (quotationLineRepository == null) {
            throw new IllegalStateException("QuotationLineRepository is not initialized");
        }
        quotationLineRepository.deleteByQuotationId(quotationId);
    }

    @Transactional
    public QuotationVersion saveQuotationVersion(QuotationVersion version) {
        if (quotationVersionRepository == null) {
            throw new IllegalStateException("QuotationVersionRepository is not initialized");
        }
        return quotationVersionRepository.save(version);
    }

    public Optional<QuotationVersion> findQuotationVersionById(Long id) {
        if (quotationVersionRepository == null) {
            throw new IllegalStateException("QuotationVersionRepository is not initialized");
        }
        return quotationVersionRepository.findById(id);
    }

    public List<QuotationVersion> findVersionsByQuotationId(Long quotationId) {
        if (quotationVersionRepository == null) {
            throw new IllegalStateException("QuotationVersionRepository is not initialized");
        }
        return quotationVersionRepository.findByQuotationId(quotationId);
    }

    public Optional<QuotationVersion> findLatestVersionByQuotationId(Long quotationId) {
        if (quotationVersionRepository == null) {
            throw new IllegalStateException("QuotationVersionRepository is not initialized");
        }
        return quotationVersionRepository.findLatestByQuotationId(quotationId);
    }

    @Transactional
    public Quotation changeQuotationStatusAndSave(Long quotationId, String newStatus) {
        Quotation quotation = findQuotationById(quotationId)
                .orElseThrow(() -> new IllegalArgumentException("Quotation not found with ID: " + quotationId));
        changeQuotationStatus(quotation, newStatus);
        return saveQuotation(quotation);
    }

    @Transactional
    public QuotationLine addQuotationLineAndSave(Long quotationId, PriceList priceList, List<PriceListItem> candidateItems,
                                                 Product product, ProductVariant variant, int quantity, Instant pricingInstant) {
        Quotation quotation = findQuotationById(quotationId)
                .orElseThrow(() -> new IllegalArgumentException("Quotation not found with ID: " + quotationId));
        QuotationLine line = calculateLinePrice(quotation, priceList, candidateItems, product, variant, quantity, pricingInstant);
        QuotationLine savedLine = saveQuotationLine(line);

        List<QuotationLine> currentLines = findLinesByQuotationId(quotationId);
        recalculateQuotationTotals(quotation, currentLines);
        saveQuotation(quotation);

        return savedLine;
    }

    @Transactional
    public QuotationLine updateQuotationLineAndSave(Long quotationId, QuotationLine updatedLine) {
        Quotation quotation = findQuotationById(quotationId)
                .orElseThrow(() -> new IllegalArgumentException("Quotation not found with ID: " + quotationId));
        if (isQuotationLocked(quotation)) {
            throw new IllegalStateException("Cannot modify lines for a locked quotation in status: " + quotation.getStatus());
        }
        if (updatedLine == null || updatedLine.getId() == null) {
            throw new IllegalArgumentException("Updated line cannot be null and must have an ID");
        }
        if (updatedLine.getQuantity() == null || updatedLine.getQuantity() <= 0) {
            throw new IllegalArgumentException("Quotation line quantity must be positive (> 0)");
        }
        QuotationLine savedLine = saveQuotationLine(updatedLine);
        List<QuotationLine> currentLines = findLinesByQuotationId(quotationId);
        recalculateQuotationTotals(quotation, currentLines);
        saveQuotation(quotation);
        return savedLine;
    }

    @Transactional
    public void removeQuotationLineAndSave(Long quotationId, Long lineId) {
        Quotation quotation = findQuotationById(quotationId)
                .orElseThrow(() -> new IllegalArgumentException("Quotation not found with ID: " + quotationId));
        if (isQuotationLocked(quotation)) {
            throw new IllegalStateException("Cannot modify lines for a locked quotation in status: " + quotation.getStatus());
        }
        deleteQuotationLineById(lineId);
        List<QuotationLine> currentLines = findLinesByQuotationId(quotationId);
        recalculateQuotationTotals(quotation, currentLines);
        saveQuotation(quotation);
    }

    @Transactional
    public QuotationVersion createAndSaveQuotationVersion(Long quotationId, String changeSummary) {
        Quotation quotation = findQuotationById(quotationId)
                .orElseThrow(() -> new IllegalArgumentException("Quotation not found with ID: " + quotationId));
        List<QuotationVersion> existingVersions = findVersionsByQuotationId(quotationId);
        QuotationVersion version = createQuotationVersion(quotation, existingVersions, changeSummary);
        return saveQuotationVersion(version);
    }
}
