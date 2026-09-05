package com.odoo.DealFlow360.pricing;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.Instant;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class PriceListServiceTest {

    private PriceListService priceListService;

    @BeforeEach
    void setUp() {
        priceListService = new PriceListService();
    }

    @Test
    @DisplayName("Should create valid price list with valid date range")
    void testValidPriceList() {
        Instant from = Instant.now().minusSeconds(3600);
        Instant to = Instant.now().plusSeconds(3600);
        PriceList priceList = priceListService.createPriceList(1L, 2L, "USD", from, to);

        assertThat(priceList).isNotNull();
        assertThat(priceList.getCurrency()).isEqualTo("USD");
        assertThat(priceListService.isActive(priceList, Instant.now())).isTrue();
    }

    @Test
    @DisplayName("Should throw exception when validFrom is after validTo")
    void testInvalidDateRange() {
        Instant from = Instant.now().plusSeconds(3600);
        Instant to = Instant.now().minusSeconds(3600);

        assertThatThrownBy(() -> priceListService.createPriceList(1L, null, "USD", from, to))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Price list validFrom date cannot be after validTo date");
    }

    @Test
    @DisplayName("Should evaluate active status when lower bound validFrom is null")
    void testNoLowerBound() {
        Instant to = Instant.now().plusSeconds(3600);
        PriceList priceList = priceListService.createPriceList(1L, null, "EUR", null, to);

        assertThat(priceListService.isActive(priceList, Instant.now())).isTrue();
        assertThat(priceListService.isActive(priceList, to.plusSeconds(100))).isFalse();
    }

    @Test
    @DisplayName("Should evaluate active status when upper bound validTo is null")
    void testNoUpperBound() {
        Instant from = Instant.now().minusSeconds(3600);
        PriceList priceList = priceListService.createPriceList(1L, null, "EUR", from, null);

        assertThat(priceListService.isActive(priceList, Instant.now())).isTrue();
        assertThat(priceListService.isActive(priceList, from.minusSeconds(100))).isFalse();
    }

    @Test
    @DisplayName("Should correctly evaluate active vs inactive price list")
    void testActiveAndInactiveStatus() {
        Instant from = Instant.parse("2026-01-01T00:00:00Z");
        Instant to = Instant.parse("2026-12-31T23:59:59Z");
        PriceList priceList = priceListService.createPriceList(1L, null, "USD", from, to);

        assertThat(priceListService.isActive(priceList, Instant.parse("2026-06-01T12:00:00Z"))).isTrue();
        assertThat(priceListService.isActive(priceList, Instant.parse("2025-12-31T23:59:59Z"))).isFalse();
        assertThat(priceListService.isActive(priceList, Instant.parse("2027-01-01T00:00:00Z"))).isFalse();
    }

    @Test
    @DisplayName("Should evaluate boundary instant equality as active (inclusive bounds)")
    void testBoundaryEquality() {
        Instant from = Instant.parse("2026-01-01T00:00:00Z");
        Instant to = Instant.parse("2026-12-31T23:59:59Z");
        PriceList priceList = priceListService.createPriceList(1L, null, "USD", from, to);

        // Instant exactly equal to validFrom -> active
        assertThat(priceListService.isActive(priceList, from)).isTrue();
        // Instant exactly equal to validTo -> active
        assertThat(priceListService.isActive(priceList, to)).isTrue();
    }

    @Test
    @DisplayName("Should delegate price list save and find to repository when injected")
    void testPriceListRepositoryDelegation() {
        PriceListRepository repository = org.mockito.Mockito.mock(PriceListRepository.class);
        PriceListService service = new PriceListService(repository);

        PriceList priceList = new PriceList(null, 5L, "USD", null, null);
        PriceList savedPriceList = new PriceList(1L, 5L, "USD", null, null);
        org.mockito.Mockito.when(repository.save(priceList)).thenReturn(savedPriceList);
        org.mockito.Mockito.when(repository.findById(1L)).thenReturn(java.util.Optional.of(savedPriceList));

        PriceList resultSave = service.savePriceList(priceList);
        assertThat(resultSave.getId()).isEqualTo(1L);

        java.util.Optional<PriceList> resultFind = service.findPriceListById(1L);
        assertThat(resultFind).isPresent();
        assertThat(resultFind.get().getCurrency()).isEqualTo("USD");
    }
}

