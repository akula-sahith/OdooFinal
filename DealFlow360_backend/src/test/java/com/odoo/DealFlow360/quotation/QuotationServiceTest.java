package com.odoo.DealFlow360.quotation;

import com.odoo.DealFlow360.pricing.PriceList;
import com.odoo.DealFlow360.pricing.PriceListItem;
import com.odoo.DealFlow360.pricing.PricingEngine;
import com.odoo.DealFlow360.product.Product;
import com.odoo.DealFlow360.product.ProductVariant;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class QuotationServiceTest {

    private PricingEngine pricingEngine;
    private QuotationRepository quotationRepository;
    private QuotationLineRepository quotationLineRepository;
    private QuotationVersionRepository quotationVersionRepository;
    private QuotationService quotationService;

    @BeforeEach
    void setUp() {
        pricingEngine = new PricingEngine();
        quotationRepository = mock(QuotationRepository.class);
        quotationLineRepository = mock(QuotationLineRepository.class);
        quotationVersionRepository = mock(QuotationVersionRepository.class);

        quotationService = new QuotationService(
                pricingEngine,
                quotationRepository,
                quotationLineRepository,
                quotationVersionRepository
        );
    }

    @Test
    @DisplayName("Should create valid quotation successfully")
    void testCreateQuotation() {
        Quotation quotation = quotationService.createQuotation(1L, 100L, 10L, "USD");

        assertThat(quotation).isNotNull();
        assertThat(quotation.getId()).isEqualTo(1L);
        assertThat(quotation.getCustomerId()).isEqualTo(100L);
        assertThat(quotation.getPriceListId()).isEqualTo(10L);
        assertThat(quotation.getStatus()).isEqualTo("DRAFT");
        assertThat(quotation.getCurrency()).isEqualTo("USD");
        assertThat(quotation.getSubtotalAmount()).isEqualTo(BigDecimal.ZERO);
        assertThat(quotation.getTaxAmount()).isEqualTo(BigDecimal.ZERO);
        assertThat(quotation.getTotalAmount()).isEqualTo(BigDecimal.ZERO);
    }

    @Test
    @DisplayName("Should integrate PricingEngine to calculate line price")
    void testPricingEngineIntegration() {
        Quotation quotation = quotationService.createQuotation(1L, 100L, 10L, "USD");
        PriceList priceList = new PriceList(10L, null, "USD", null, null);
        Product product = new Product(50L, "Widget", 1L, new BigDecimal("100.00"), new BigDecimal("10.00"), "USD", false);
        PriceListItem item = new PriceListItem(1L, 10L, 50L, null, new BigDecimal("90.00"), 1);

        QuotationLine line = quotationService.calculateLinePrice(quotation, priceList, List.of(item), product, null, 2, Instant.now());

        assertThat(line).isNotNull();
        assertThat(line.getQuotationId()).isEqualTo(1L);
        assertThat(line.getProductId()).isEqualTo(50L);
        assertThat(line.getQuantity()).isEqualTo(2);
        assertThat(line.getUnitPrice()).isEqualTo(new BigDecimal("90.00"));
        assertThat(line.getTaxPercent()).isEqualTo(new BigDecimal("10.00"));
        assertThat(line.getSubtotalAmount()).isEqualTo(new BigDecimal("180.00")); // 90 * 2
        assertThat(line.getTaxAmount()).isEqualTo(new BigDecimal("18.00")); // 180 * 10%
        assertThat(line.getTotalAmount()).isEqualTo(new BigDecimal("198.00")); // 180 + 18
    }

    @Test
    @DisplayName("Should add line and recalculate quotation totals correctly")
    void testAddLineAndSubtotalTaxTotalCalculation() {
        Quotation quotation = quotationService.createQuotation(1L, 100L, 10L, "USD");
        List<QuotationLine> lines = new ArrayList<>();

        QuotationLine line1 = new QuotationLine(101L, 1L, 50L, null, 2,
                new BigDecimal("100.00"), new BigDecimal("10.00"),
                new BigDecimal("200.00"), new BigDecimal("20.00"), new BigDecimal("220.00"));

        quotationService.addQuotationLine(quotation, lines, line1);

        assertThat(lines).hasSize(1);
        assertThat(quotation.getSubtotalAmount()).isEqualTo(new BigDecimal("200.00"));
        assertThat(quotation.getTaxAmount()).isEqualTo(new BigDecimal("20.00"));
        assertThat(quotation.getTotalAmount()).isEqualTo(new BigDecimal("220.00"));
    }

    @Test
    @DisplayName("Should handle multiple-line totals calculation")
    void testMultipleLineTotals() {
        Quotation quotation = quotationService.createQuotation(1L, 100L, 10L, "USD");
        List<QuotationLine> lines = new ArrayList<>();

        QuotationLine line1 = new QuotationLine(101L, 1L, 50L, null, 2,
                new BigDecimal("100.00"), new BigDecimal("10.00"),
                new BigDecimal("200.00"), new BigDecimal("20.00"), new BigDecimal("220.00"));

        QuotationLine line2 = new QuotationLine(102L, 1L, 51L, null, 1,
                new BigDecimal("500.00"), new BigDecimal("20.00"),
                new BigDecimal("500.00"), new BigDecimal("100.00"), new BigDecimal("600.00"));

        quotationService.addQuotationLine(quotation, lines, line1);
        quotationService.addQuotationLine(quotation, lines, line2);

        assertThat(lines).hasSize(2);
        assertThat(quotation.getSubtotalAmount()).isEqualTo(new BigDecimal("700.00")); // 200 + 500
        assertThat(quotation.getTaxAmount()).isEqualTo(new BigDecimal("120.00")); // 20 + 100
        assertThat(quotation.getTotalAmount()).isEqualTo(new BigDecimal("820.00")); // 220 + 600
    }

    @Test
    @DisplayName("Should update line and recalculate totals")
    void testUpdateLine() {
        Quotation quotation = quotationService.createQuotation(1L, 100L, 10L, "USD");
        List<QuotationLine> lines = new ArrayList<>();

        QuotationLine line1 = new QuotationLine(101L, 1L, 50L, null, 1,
                new BigDecimal("100.00"), BigDecimal.ZERO,
                new BigDecimal("100.00"), BigDecimal.ZERO, new BigDecimal("100.00"));
        quotationService.addQuotationLine(quotation, lines, line1);

        QuotationLine updatedLine1 = new QuotationLine(101L, 1L, 50L, null, 3,
                new BigDecimal("100.00"), BigDecimal.ZERO,
                new BigDecimal("300.00"), BigDecimal.ZERO, new BigDecimal("300.00"));

        quotationService.updateQuotationLine(quotation, lines, updatedLine1);

        assertThat(lines).hasSize(1);
        assertThat(quotation.getSubtotalAmount()).isEqualTo(new BigDecimal("300.00"));
        assertThat(quotation.getTotalAmount()).isEqualTo(new BigDecimal("300.00"));
    }

    @Test
    @DisplayName("Should remove line and recalculate totals")
    void testRemoveLine() {
        Quotation quotation = quotationService.createQuotation(1L, 100L, 10L, "USD");
        List<QuotationLine> lines = new ArrayList<>();

        QuotationLine line1 = new QuotationLine(101L, 1L, 50L, null, 1,
                new BigDecimal("100.00"), BigDecimal.ZERO,
                new BigDecimal("100.00"), BigDecimal.ZERO, new BigDecimal("100.00"));
        QuotationLine line2 = new QuotationLine(102L, 1L, 51L, null, 1,
                new BigDecimal("200.00"), BigDecimal.ZERO,
                new BigDecimal("200.00"), BigDecimal.ZERO, new BigDecimal("200.00"));

        quotationService.addQuotationLine(quotation, lines, line1);
        quotationService.addQuotationLine(quotation, lines, line2);

        quotationService.removeQuotationLine(quotation, lines, 101L);

        assertThat(lines).hasSize(1);
        assertThat(quotation.getSubtotalAmount()).isEqualTo(new BigDecimal("200.00"));
        assertThat(quotation.getTotalAmount()).isEqualTo(new BigDecimal("200.00"));
    }

    @Test
    @DisplayName("Should throw exception for invalid line quantity")
    void testInvalidQuantity() {
        Quotation quotation = quotationService.createQuotation(1L, 100L, 10L, "USD");
        PriceList priceList = new PriceList(10L, null, "USD", null, null);
        Product product = new Product(50L, "Widget", 1L, new BigDecimal("100.00"), BigDecimal.ZERO, "USD", false);
        PriceListItem item = new PriceListItem(1L, 10L, 50L, null, new BigDecimal("100.00"), 1);

        assertThatThrownBy(() -> quotationService.calculateLinePrice(quotation, priceList, List.of(item), product, null, 0, Instant.now()))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Quantity must be positive");
    }

    @Test
    @DisplayName("Should throw exception for missing product")
    void testMissingProduct() {
        Quotation quotation = quotationService.createQuotation(1L, 100L, 10L, "USD");
        PriceList priceList = new PriceList(10L, null, "USD", null, null);

        assertThatThrownBy(() -> quotationService.calculateLinePrice(quotation, priceList, Collections.emptyList(), null, null, 1, Instant.now()))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Product cannot be null");
    }

    @Test
    @DisplayName("Should throw exception when variant does not belong to product")
    void testInvalidVariant() {
        Quotation quotation = quotationService.createQuotation(1L, 100L, 10L, "USD");
        PriceList priceList = new PriceList(10L, null, "USD", null, null);
        Product product = new Product(50L, "Widget", 1L, new BigDecimal("100.00"), BigDecimal.ZERO, "USD", false);
        ProductVariant invalidVariant = new ProductVariant(5L, 999L, "Color", "Red", BigDecimal.ZERO); // belongs to product 999

        assertThatThrownBy(() -> quotationService.calculateLinePrice(quotation, priceList, Collections.emptyList(), product, invalidVariant, 1, Instant.now()))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Product variant does not belong to the specified product");
    }

    @Test
    @DisplayName("Should allow legal state transitions and reject illegal state transitions")
    void testStateTransitions() {
        Quotation quotation = quotationService.createQuotation(1L, 100L, 10L, "USD");

        // Legal: DRAFT -> SENT
        quotationService.changeQuotationStatus(quotation, "SENT");
        assertThat(quotation.getStatus()).isEqualTo("SENT");

        // Legal: SENT -> APPROVED
        quotationService.changeQuotationStatus(quotation, "APPROVED");
        assertThat(quotation.getStatus()).isEqualTo("APPROVED");

        // Legal: APPROVED -> CONFIRMED
        quotationService.changeQuotationStatus(quotation, "CONFIRMED");
        assertThat(quotation.getStatus()).isEqualTo("CONFIRMED");

        // Illegal: CONFIRMED is terminal -> transition to SENT rejected
        assertThatThrownBy(() -> quotationService.changeQuotationStatus(quotation, "SENT"))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("Cannot transition out of terminal quotation status");
    }

    @Test
    @DisplayName("Should reject line modification when quotation is in a locked/terminal state")
    void testLockedQuotationModification() {
        Quotation quotation = quotationService.createQuotation(1L, 100L, 10L, "USD");
        quotation.setStatus("CONFIRMED"); // Locked terminal state

        List<QuotationLine> lines = new ArrayList<>();
        QuotationLine newLine = new QuotationLine(101L, 1L, 50L, null, 1, new BigDecimal("100.00"), BigDecimal.ZERO, new BigDecimal("100.00"), BigDecimal.ZERO, new BigDecimal("100.00"));

        assertThatThrownBy(() -> quotationService.addQuotationLine(quotation, lines, newLine))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("Cannot modify lines for a locked quotation");
    }

    @Test
    @DisplayName("Should create quotation version and increment version number cleanly")
    void testVersionCreationAndIncrement() {
        Quotation quotation = quotationService.createQuotation(1L, 100L, 10L, "USD");
        quotation.setTotalAmount(new BigDecimal("1500.00"));
        quotation.setStatus("SENT");

        List<QuotationVersion> versions = new ArrayList<>();

        // First version
        QuotationVersion v1 = quotationService.createQuotationVersion(quotation, versions, "Initial Quote Sent");
        assertThat(v1).isNotNull();
        assertThat(v1.getQuotationId()).isEqualTo(1L);
        assertThat(v1.getVersionNumber()).isEqualTo(1);
        assertThat(v1.getStatus()).isEqualTo("SENT");
        assertThat(v1.getTotalAmount()).isEqualTo(new BigDecimal("1500.00"));
        assertThat(v1.getChangeSummary()).isEqualTo("Initial Quote Sent");

        versions.add(v1);

        // Second version after price update
        quotation.setTotalAmount(new BigDecimal("1350.00"));
        QuotationVersion v2 = quotationService.createQuotationVersion(quotation, versions, "Discounted Total");
        assertThat(v2.getVersionNumber()).isEqualTo(2);
        assertThat(v2.getTotalAmount()).isEqualTo(new BigDecimal("1350.00"));
    }

    // ==========================================
    // REPOSITORY & TRANSACTIONAL WORKFLOW TESTS
    // ==========================================

    @Test
    @DisplayName("Should save quotation via repository")
    void testSaveQuotation() {
        Quotation quotation = quotationService.createQuotation(null, 100L, 10L, "USD");
        when(quotationRepository.save(quotation)).thenReturn(quotation);

        Quotation saved = quotationService.saveQuotation(quotation);

        assertThat(saved).isEqualTo(quotation);
        verify(quotationRepository).save(quotation);
    }

    @Test
    @DisplayName("Should find quotation by id via repository")
    void testFindQuotationById() {
        Quotation quotation = quotationService.createQuotation(1L, 100L, 10L, "USD");
        when(quotationRepository.findById(1L)).thenReturn(Optional.of(quotation));

        Optional<Quotation> result = quotationService.findQuotationById(1L);

        assertThat(result).contains(quotation);
    }

    @Test
    @DisplayName("Should transition status and save quotation in workflow")
    void testChangeQuotationStatusAndSave() {
        Quotation quotation = quotationService.createQuotation(1L, 100L, 10L, "USD");
        when(quotationRepository.findById(1L)).thenReturn(Optional.of(quotation));
        when(quotationRepository.save(any(Quotation.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Quotation updated = quotationService.changeQuotationStatusAndSave(1L, "SENT");

        assertThat(updated.getStatus()).isEqualTo("SENT");
        verify(quotationRepository).save(quotation);
    }

    @Test
    @DisplayName("Should add line and save quotation totals in workflow")
    void testAddQuotationLineAndSave() {
        Quotation quotation = quotationService.createQuotation(1L, 100L, 10L, "USD");
        PriceList priceList = new PriceList(10L, null, "USD", null, null);
        Product product = new Product(50L, "Widget", 1L, new BigDecimal("100.00"), new BigDecimal("10.00"), "USD", false);
        PriceListItem item = new PriceListItem(1L, 10L, 50L, null, new BigDecimal("90.00"), 1);

        when(quotationRepository.findById(1L)).thenReturn(Optional.of(quotation));
        when(quotationLineRepository.save(any(QuotationLine.class))).thenAnswer(invocation -> {
            QuotationLine l = invocation.getArgument(0);
            l.setId(101L);
            return l;
        });
        when(quotationLineRepository.findByQuotationId(1L)).thenReturn(List.of(
                new QuotationLine(101L, 1L, 50L, null, 2, new BigDecimal("90.00"), new BigDecimal("10.00"), new BigDecimal("180.00"), new BigDecimal("18.00"), new BigDecimal("198.00"))
        ));

        QuotationLine line = quotationService.addQuotationLineAndSave(1L, priceList, List.of(item), product, null, 2, Instant.now());

        assertThat(line).isNotNull();
        assertThat(line.getId()).isEqualTo(101L);
        assertThat(quotation.getSubtotalAmount()).isEqualTo(new BigDecimal("180.00"));
        assertThat(quotation.getTaxAmount()).isEqualTo(new BigDecimal("18.00"));
        assertThat(quotation.getTotalAmount()).isEqualTo(new BigDecimal("198.00"));
        verify(quotationRepository).save(quotation);
    }

    @Test
    @DisplayName("Should update line and save quotation totals in workflow")
    void testUpdateQuotationLineAndSave() {
        Quotation quotation = quotationService.createQuotation(1L, 100L, 10L, "USD");
        QuotationLine lineToUpdate = new QuotationLine(101L, 1L, 50L, null, 3, new BigDecimal("90.00"), BigDecimal.ZERO, new BigDecimal("270.00"), BigDecimal.ZERO, new BigDecimal("270.00"));

        when(quotationRepository.findById(1L)).thenReturn(Optional.of(quotation));
        when(quotationLineRepository.save(lineToUpdate)).thenReturn(lineToUpdate);
        when(quotationLineRepository.findByQuotationId(1L)).thenReturn(List.of(lineToUpdate));

        QuotationLine updated = quotationService.updateQuotationLineAndSave(1L, lineToUpdate);

        assertThat(updated).isEqualTo(lineToUpdate);
        assertThat(quotation.getSubtotalAmount()).isEqualTo(new BigDecimal("270.00"));
        verify(quotationRepository).save(quotation);
    }

    @Test
    @DisplayName("Should remove line and save quotation totals in workflow")
    void testRemoveQuotationLineAndSave() {
        Quotation quotation = quotationService.createQuotation(1L, 100L, 10L, "USD");
        when(quotationRepository.findById(1L)).thenReturn(Optional.of(quotation));
        when(quotationLineRepository.findByQuotationId(1L)).thenReturn(Collections.emptyList());

        quotationService.removeQuotationLineAndSave(1L, 101L);

        verify(quotationLineRepository).deleteById(101L);
        assertThat(quotation.getSubtotalAmount()).isEqualTo(BigDecimal.ZERO);
        verify(quotationRepository).save(quotation);
    }

    @Test
    @DisplayName("Should create and save version snapshot in workflow")
    void testCreateAndSaveQuotationVersion() {
        Quotation quotation = quotationService.createQuotation(1L, 100L, 10L, "USD");
        quotation.setTotalAmount(new BigDecimal("500.00"));
        quotation.setStatus("SENT");

        when(quotationRepository.findById(1L)).thenReturn(Optional.of(quotation));
        when(quotationVersionRepository.findByQuotationId(1L)).thenReturn(Collections.emptyList());
        when(quotationVersionRepository.save(any(QuotationVersion.class))).thenAnswer(invocation -> invocation.getArgument(0));

        QuotationVersion version = quotationService.createAndSaveQuotationVersion(1L, "Initial quote sent");

        assertThat(version.getQuotationId()).isEqualTo(1L);
        assertThat(version.getVersionNumber()).isEqualTo(1);
        assertThat(version.getChangeSummary()).isEqualTo("Initial quote sent");
        verify(quotationVersionRepository).save(any(QuotationVersion.class));
    }
}
