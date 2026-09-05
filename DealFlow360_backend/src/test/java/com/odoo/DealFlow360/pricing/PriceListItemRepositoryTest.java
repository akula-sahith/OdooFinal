package com.odoo.DealFlow360.pricing;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementCreator;
import org.springframework.jdbc.support.KeyHolder;

import java.math.BigDecimal;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class PriceListItemRepositoryTest {

    private JdbcTemplate jdbcTemplate;
    private PriceListItemRepository itemRepository;

    @BeforeEach
    void setUp() {
        jdbcTemplate = mock(JdbcTemplate.class);
        itemRepository = new PriceListItemRepository(jdbcTemplate);
    }

    @Test
    @DisplayName("Should insert new PriceListItem and populate generated ID")
    void testSaveNewPriceListItem() {
        PriceListItem item = new PriceListItem(null, 1L, 10L, 100L, new BigDecimal("49.99"), 5);

        doAnswer(invocation -> {
            KeyHolder keyHolder = invocation.getArgument(1);
            java.util.Map<String, Object> map = new java.util.HashMap<>();
            map.put("id", 2001L);
            keyHolder.getKeyList().add(map);
            return 1;
        }).when(jdbcTemplate).update(any(PreparedStatementCreator.class), any(KeyHolder.class));

        PriceListItem saved = itemRepository.save(item);

        assertThat(saved.getId()).isEqualTo(2001L);
        assertThat(saved.getUnitPrice()).isEqualTo(new BigDecimal("49.99"));
    }

    @Test
    @DisplayName("Should update existing PriceListItem")
    void testUpdatePriceListItem() {
        PriceListItem item = new PriceListItem(2001L, 1L, 10L, null, new BigDecimal("39.99"), 10);
        itemRepository.save(item);

        verify(jdbcTemplate).update(
                eq("UPDATE price_list_items SET price_list_id = ?, product_id = ?, product_variant_id = ?, unit_price = ?, min_quantity = ? WHERE id = ?"),
                eq(1L),
                eq(10L),
                eq((Long) null),
                eq(new BigDecimal("39.99")),
                eq(10),
                eq(2001L)
        );
    }

    @Test
    @DisplayName("Should find PriceListItem by ID")
    void testFindById() {
        PriceListItem item = new PriceListItem(1L, 10L, 100L, null, new BigDecimal("15.00"), 1);
        when(jdbcTemplate.query(eq("SELECT id, price_list_id, product_id, product_variant_id, unit_price, min_quantity FROM price_list_items WHERE id = ?"), any(PriceListItemRepository.PriceListItemRowMapper.class), eq(1L)))
                .thenReturn(Collections.singletonList(item));

        Optional<PriceListItem> result = itemRepository.findById(1L);

        assertThat(result).isPresent();
        assertThat(result.get().getProductVariantId()).isNull();
    }

    @Test
    @DisplayName("Should find PriceListItems by Price List ID (relationship query)")
    void testFindByPriceListId() {
        PriceListItem item1 = new PriceListItem(1L, 10L, 100L, null, new BigDecimal("15.00"), 1);
        when(jdbcTemplate.query(eq("SELECT id, price_list_id, product_id, product_variant_id, unit_price, min_quantity FROM price_list_items WHERE price_list_id = ? ORDER BY id"), any(PriceListItemRepository.PriceListItemRowMapper.class), eq(10L)))
                .thenReturn(Collections.singletonList(item1));

        List<PriceListItem> items = itemRepository.findByPriceListId(10L);

        assertThat(items).hasSize(1);
        assertThat(items.get(0).getPriceListId()).isEqualTo(10L);
    }

    @Test
    @DisplayName("Should find PriceListItems by Product ID (relationship query)")
    void testFindByProductId() {
        PriceListItem item1 = new PriceListItem(1L, 10L, 100L, null, new BigDecimal("15.00"), 1);
        when(jdbcTemplate.query(eq("SELECT id, price_list_id, product_id, product_variant_id, unit_price, min_quantity FROM price_list_items WHERE product_id = ? ORDER BY id"), any(PriceListItemRepository.PriceListItemRowMapper.class), eq(100L)))
                .thenReturn(Collections.singletonList(item1));

        List<PriceListItem> items = itemRepository.findByProductId(100L);

        assertThat(items).hasSize(1);
        assertThat(items.get(0).getProductId()).isEqualTo(100L);
    }

    @Test
    @DisplayName("Should find PriceListItems by Price List ID and Product ID (relationship query)")
    void testFindByPriceListIdAndProductId() {
        PriceListItem item1 = new PriceListItem(1L, 10L, 100L, null, new BigDecimal("15.00"), 1);
        when(jdbcTemplate.query(eq("SELECT id, price_list_id, product_id, product_variant_id, unit_price, min_quantity FROM price_list_items WHERE price_list_id = ? AND product_id = ? ORDER BY id"), any(PriceListItemRepository.PriceListItemRowMapper.class), eq(10L), eq(100L)))
                .thenReturn(Collections.singletonList(item1));

        List<PriceListItem> items = itemRepository.findByPriceListIdAndProductId(10L, 100L);

        assertThat(items).hasSize(1);
        assertThat(items.get(0).getPriceListId()).isEqualTo(10L);
        assertThat(items.get(0).getProductId()).isEqualTo(100L);
    }

    @Test
    @DisplayName("Should find all PriceListItems")
    void testFindAll() {
        PriceListItem item1 = new PriceListItem(1L, 10L, 100L, null, new BigDecimal("15.00"), 1);
        when(jdbcTemplate.query(eq("SELECT id, price_list_id, product_id, product_variant_id, unit_price, min_quantity FROM price_list_items ORDER BY id"), any(PriceListItemRepository.PriceListItemRowMapper.class)))
                .thenReturn(Collections.singletonList(item1));

        List<PriceListItem> items = itemRepository.findAll();

        assertThat(items).hasSize(1);
    }

    @Test
    @DisplayName("Should check existence by ID")
    void testExistsById() {
        when(jdbcTemplate.queryForObject(eq("SELECT COUNT(*) FROM price_list_items WHERE id = ?"), eq(Integer.class), eq(70L)))
                .thenReturn(1);

        assertThat(itemRepository.existsById(70L)).isTrue();
    }

    @Test
    @DisplayName("Should delete PriceListItem by ID")
    void testDeleteById() {
        itemRepository.deleteById(70L);
        verify(jdbcTemplate).update(eq("DELETE FROM price_list_items WHERE id = ?"), eq(70L));
    }

    @Test
    @DisplayName("Should map RowMapper correctly including null productVariantId")
    void testRowMapper() throws SQLException {
        ResultSet rs = mock(ResultSet.class);
        when(rs.getLong("id")).thenReturn(900L);
        when(rs.getLong("price_list_id")).thenReturn(20L);
        when(rs.getLong("product_id")).thenReturn(300L);
        when(rs.getLong("product_variant_id")).thenReturn(0L);
        when(rs.wasNull()).thenReturn(true);
        when(rs.getBigDecimal("unit_price")).thenReturn(new BigDecimal("199.99"));
        when(rs.getInt("min_quantity")).thenReturn(10);

        PriceListItemRepository.PriceListItemRowMapper rowMapper = new PriceListItemRepository.PriceListItemRowMapper();
        PriceListItem item = rowMapper.mapRow(rs, 1);

        assertThat(item.getId()).isEqualTo(900L);
        assertThat(item.getPriceListId()).isEqualTo(20L);
        assertThat(item.getProductId()).isEqualTo(300L);
        assertThat(item.getProductVariantId()).isNull();
        assertThat(item.getUnitPrice()).isEqualTo(new BigDecimal("199.99"));
        assertThat(item.getMinQuantity()).isEqualTo(10);
    }
}
