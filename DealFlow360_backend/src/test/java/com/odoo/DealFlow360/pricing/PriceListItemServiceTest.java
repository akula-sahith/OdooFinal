package com.odoo.DealFlow360.pricing;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class PriceListItemServiceTest {

    private PriceListItemService itemService;

    @BeforeEach
    void setUp() {
        itemService = new PriceListItemService();
    }

    @Test
    @DisplayName("Should create valid price list item successfully")
    void testValidPriceListItem() {
        PriceListItem item = itemService.createPriceListItem(1L, 100L, 10L, 5L, new BigDecimal("150.00"), 10);
        assertThat(item).isNotNull();
        assertThat(item.getPriceListId()).isEqualTo(100L);
        assertThat(item.getProductId()).isEqualTo(10L);
        assertThat(item.getProductVariantId()).isEqualTo(5L);
        assertThat(item.getUnitPrice()).isEqualTo(new BigDecimal("150.00"));
        assertThat(item.getMinQuantity()).isEqualTo(10);
    }

    @Test
    @DisplayName("Should support nullable variant in price list item")
    void testNullableVariant() {
        PriceListItem item = itemService.createPriceListItem(1L, 100L, 10L, null, new BigDecimal("150.00"), 1);
        assertThat(item.getProductVariantId()).isNull();
    }

    @Test
    @DisplayName("Should throw exception for negative unit price")
    void testNegativeUnitPrice() {
        assertThatThrownBy(() -> itemService.createPriceListItem(1L, 100L, 10L, null, new BigDecimal("-1.00"), 1))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Unit price cannot be null or negative");
    }

    @Test
    @DisplayName("Should throw exception for zero or negative minQuantity")
    void testInvalidMinQuantity() {
        assertThatThrownBy(() -> itemService.createPriceListItem(1L, 100L, 10L, null, new BigDecimal("100.00"), 0))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Minimum quantity must be a positive integer");

        assertThatThrownBy(() -> itemService.createPriceListItem(1L, 100L, 10L, null, new BigDecimal("100.00"), -5))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Minimum quantity must be a positive integer");
    }

    @Test
    @DisplayName("Should delegate item save and find to repository when injected")
    void testPriceListItemRepositoryDelegation() {
        PriceListItemRepository repository = org.mockito.Mockito.mock(PriceListItemRepository.class);
        PriceListItemService service = new PriceListItemService(repository);

        PriceListItem item = new PriceListItem(null, 100L, 10L, null, new BigDecimal("150.00"), 1);
        PriceListItem savedItem = new PriceListItem(1L, 100L, 10L, null, new BigDecimal("150.00"), 1);
        org.mockito.Mockito.when(repository.save(item)).thenReturn(savedItem);
        org.mockito.Mockito.when(repository.findById(1L)).thenReturn(java.util.Optional.of(savedItem));

        PriceListItem resultSave = service.savePriceListItem(item);
        assertThat(resultSave.getId()).isEqualTo(1L);

        java.util.Optional<PriceListItem> resultFind = service.findPriceListItemById(1L);
        assertThat(resultFind).isPresent();
        assertThat(resultFind.get().getUnitPrice()).isEqualTo(new BigDecimal("150.00"));
    }
}

