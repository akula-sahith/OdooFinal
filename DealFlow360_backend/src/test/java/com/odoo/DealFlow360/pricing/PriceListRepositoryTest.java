package com.odoo.DealFlow360.pricing;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementCreator;
import org.springframework.jdbc.support.KeyHolder;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.Instant;
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

class PriceListRepositoryTest {

    private JdbcTemplate jdbcTemplate;
    private PriceListRepository priceListRepository;

    @BeforeEach
    void setUp() {
        jdbcTemplate = mock(JdbcTemplate.class);
        priceListRepository = new PriceListRepository(jdbcTemplate);
    }

    @Test
    @DisplayName("Should insert new PriceList and populate generated ID")
    void testSaveNewPriceList() {
        Instant now = Instant.now();
        PriceList priceList = new PriceList(null, 5L, "USD", now, now.plusSeconds(3600));

        doAnswer(invocation -> {
            KeyHolder keyHolder = invocation.getArgument(1);
            java.util.Map<String, Object> map = new java.util.HashMap<>();
            map.put("id", 1001L);
            keyHolder.getKeyList().add(map);
            return 1;
        }).when(jdbcTemplate).update(any(PreparedStatementCreator.class), any(KeyHolder.class));

        PriceList saved = priceListRepository.save(priceList);

        assertThat(saved.getId()).isEqualTo(1001L);
        assertThat(saved.getCurrency()).isEqualTo("USD");
    }

    @Test
    @DisplayName("Should update existing PriceList")
    void testUpdatePriceList() {
        Instant now = Instant.now();
        PriceList priceList = new PriceList(1001L, 5L, "EUR", now, now.plusSeconds(3600));
        priceListRepository.save(priceList);

        verify(jdbcTemplate).update(
                eq("UPDATE price_lists SET discount_tier_id = ?, currency = ?, valid_from = ?, valid_to = ? WHERE id = ?"),
                eq(5L),
                eq("EUR"),
                eq(Timestamp.from(now)),
                eq(Timestamp.from(now.plusSeconds(3600))),
                eq(1001L)
        );
    }

    @Test
    @DisplayName("Should find PriceList by ID")
    void testFindById() {
        PriceList priceList = new PriceList(1L, null, "USD", null, null);
        when(jdbcTemplate.query(eq("SELECT id, discount_tier_id, currency, valid_from, valid_to FROM price_lists WHERE id = ?"), any(PriceListRepository.PriceListRowMapper.class), eq(1L)))
                .thenReturn(Collections.singletonList(priceList));

        Optional<PriceList> result = priceListRepository.findById(1L);

        assertThat(result).isPresent();
        assertThat(result.get().getDiscountTierId()).isNull();
        assertThat(result.get().getValidFrom()).isNull();
    }

    @Test
    @DisplayName("Should find PriceLists by Discount Tier ID (relationship query)")
    void testFindByDiscountTierId() {
        PriceList p1 = new PriceList(1L, 10L, "USD", null, null);
        PriceList p2 = new PriceList(2L, 10L, "EUR", null, null);
        when(jdbcTemplate.query(eq("SELECT id, discount_tier_id, currency, valid_from, valid_to FROM price_lists WHERE discount_tier_id = ? ORDER BY id"), any(PriceListRepository.PriceListRowMapper.class), eq(10L)))
                .thenReturn(List.of(p1, p2));

        List<PriceList> results = priceListRepository.findByDiscountTierId(10L);

        assertThat(results).hasSize(2);
        assertThat(results.get(0).getDiscountTierId()).isEqualTo(10L);
    }

    @Test
    @DisplayName("Should find all PriceLists")
    void testFindAll() {
        PriceList p1 = new PriceList(1L, null, "USD", null, null);
        when(jdbcTemplate.query(eq("SELECT id, discount_tier_id, currency, valid_from, valid_to FROM price_lists ORDER BY id"), any(PriceListRepository.PriceListRowMapper.class)))
                .thenReturn(Collections.singletonList(p1));

        List<PriceList> results = priceListRepository.findAll();

        assertThat(results).hasSize(1);
    }

    @Test
    @DisplayName("Should check existence by ID")
    void testExistsById() {
        when(jdbcTemplate.queryForObject(eq("SELECT COUNT(*) FROM price_lists WHERE id = ?"), eq(Integer.class), eq(50L)))
                .thenReturn(1);

        assertThat(priceListRepository.existsById(50L)).isTrue();
    }

    @Test
    @DisplayName("Should delete PriceList by ID")
    void testDeleteById() {
        priceListRepository.deleteById(50L);
        verify(jdbcTemplate).update(eq("DELETE FROM price_lists WHERE id = ?"), eq(50L));
    }

    @Test
    @DisplayName("Should map RowMapper correctly including Instant timestamps and nulls")
    void testRowMapper() throws SQLException {
        Instant vf = Instant.parse("2026-01-01T00:00:00Z");
        Instant vt = Instant.parse("2026-12-31T23:59:59Z");

        ResultSet rs = mock(ResultSet.class);
        when(rs.getLong("id")).thenReturn(500L);
        when(rs.getLong("discount_tier_id")).thenReturn(15L);
        when(rs.wasNull()).thenReturn(false);
        when(rs.getString("currency")).thenReturn("GBP");
        when(rs.getTimestamp("valid_from")).thenReturn(Timestamp.from(vf));
        when(rs.getTimestamp("valid_to")).thenReturn(Timestamp.from(vt));

        PriceListRepository.PriceListRowMapper rowMapper = new PriceListRepository.PriceListRowMapper();
        PriceList priceList = rowMapper.mapRow(rs, 1);

        assertThat(priceList.getId()).isEqualTo(500L);
        assertThat(priceList.getDiscountTierId()).isEqualTo(15L);
        assertThat(priceList.getCurrency()).isEqualTo("GBP");
        assertThat(priceList.getValidFrom()).isEqualTo(vf);
        assertThat(priceList.getValidTo()).isEqualTo(vt);
    }
}
