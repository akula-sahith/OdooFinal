package com.odoo.DealFlow360.recommendation;

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

class UpsellRuleRepositoryTest {

    private JdbcTemplate jdbcTemplate;
    private UpsellRuleRepository ruleRepository;

    @BeforeEach
    void setUp() {
        jdbcTemplate = mock(JdbcTemplate.class);
        ruleRepository = new UpsellRuleRepository(jdbcTemplate);
    }

    @Test
    @DisplayName("Should insert new UpsellRule and populate generated ID")
    void testSaveNewUpsellRule() {
        UpsellRule rule = new UpsellRule(null, 10L, 20L, true, new BigDecimal("15.50"));

        doAnswer(invocation -> {
            KeyHolder keyHolder = invocation.getArgument(1);
            java.util.Map<String, Object> map = new java.util.HashMap<>();
            map.put("id", 3001L);
            keyHolder.getKeyList().add(map);
            return 1;
        }).when(jdbcTemplate).update(any(PreparedStatementCreator.class), any(KeyHolder.class));

        UpsellRule saved = ruleRepository.save(rule);

        assertThat(saved.getId()).isEqualTo(3001L);
        assertThat(saved.getIsPromoted()).isTrue();
        assertThat(saved.getMinMarginThreshold()).isEqualTo(new BigDecimal("15.50"));
    }

    @Test
    @DisplayName("Should update existing UpsellRule")
    void testUpdateUpsellRule() {
        UpsellRule rule = new UpsellRule(3001L, 10L, 20L, false, null);
        ruleRepository.save(rule);

        verify(jdbcTemplate).update(
                eq("UPDATE upsell_rules SET base_product_id = ?, suggested_product_id = ?, is_promoted = ?, min_margin_threshold = ? WHERE id = ?"),
                eq(10L),
                eq(20L),
                eq(false),
                eq((BigDecimal) null),
                eq(3001L)
        );
    }

    @Test
    @DisplayName("Should find UpsellRule by ID")
    void testFindById() {
        UpsellRule rule = new UpsellRule(1L, 10L, 20L, true, new BigDecimal("10.00"));
        when(jdbcTemplate.query(eq("SELECT id, base_product_id, suggested_product_id, is_promoted, min_margin_threshold FROM upsell_rules WHERE id = ?"), any(UpsellRuleRepository.UpsellRuleRowMapper.class), eq(1L)))
                .thenReturn(Collections.singletonList(rule));

        Optional<UpsellRule> result = ruleRepository.findById(1L);

        assertThat(result).isPresent();
        assertThat(result.get().getBaseProductId()).isEqualTo(10L);
    }

    @Test
    @DisplayName("Should find UpsellRules by Base Product ID (relationship query)")
    void testFindByBaseProductId() {
        UpsellRule r1 = new UpsellRule(1L, 10L, 20L, true, new BigDecimal("10.00"));
        UpsellRule r2 = new UpsellRule(2L, 10L, 30L, false, null);
        when(jdbcTemplate.query(eq("SELECT id, base_product_id, suggested_product_id, is_promoted, min_margin_threshold FROM upsell_rules WHERE base_product_id = ? ORDER BY id"), any(UpsellRuleRepository.UpsellRuleRowMapper.class), eq(10L)))
                .thenReturn(List.of(r1, r2));

        List<UpsellRule> rules = ruleRepository.findByBaseProductId(10L);

        assertThat(rules).hasSize(2);
        assertThat(rules.get(0).getBaseProductId()).isEqualTo(10L);
    }

    @Test
    @DisplayName("Should find all UpsellRules")
    void testFindAll() {
        UpsellRule r1 = new UpsellRule(1L, 10L, 20L, true, new BigDecimal("10.00"));
        when(jdbcTemplate.query(eq("SELECT id, base_product_id, suggested_product_id, is_promoted, min_margin_threshold FROM upsell_rules ORDER BY id"), any(UpsellRuleRepository.UpsellRuleRowMapper.class)))
                .thenReturn(Collections.singletonList(r1));

        List<UpsellRule> rules = ruleRepository.findAll();

        assertThat(rules).hasSize(1);
    }

    @Test
    @DisplayName("Should check existence by ID")
    void testExistsById() {
        when(jdbcTemplate.queryForObject(eq("SELECT COUNT(*) FROM upsell_rules WHERE id = ?"), eq(Integer.class), eq(80L)))
                .thenReturn(1);

        assertThat(ruleRepository.existsById(80L)).isTrue();
    }

    @Test
    @DisplayName("Should delete UpsellRule by ID")
    void testDeleteById() {
        ruleRepository.deleteById(80L);
        verify(jdbcTemplate).update(eq("DELETE FROM upsell_rules WHERE id = ?"), eq(80L));
    }

    @Test
    @DisplayName("Should map RowMapper correctly including null minMarginThreshold")
    void testRowMapper() throws SQLException {
        ResultSet rs = mock(ResultSet.class);
        when(rs.getLong("id")).thenReturn(400L);
        when(rs.getLong("base_product_id")).thenReturn(15L);
        when(rs.getLong("suggested_product_id")).thenReturn(25L);
        when(rs.getBoolean("is_promoted")).thenReturn(true);
        when(rs.getBigDecimal("min_margin_threshold")).thenReturn(null);

        UpsellRuleRepository.UpsellRuleRowMapper rowMapper = new UpsellRuleRepository.UpsellRuleRowMapper();
        UpsellRule rule = rowMapper.mapRow(rs, 1);

        assertThat(rule.getId()).isEqualTo(400L);
        assertThat(rule.getBaseProductId()).isEqualTo(15L);
        assertThat(rule.getSuggestedProductId()).isEqualTo(25L);
        assertThat(rule.getIsPromoted()).isTrue();
        assertThat(rule.getMinMarginThreshold()).isNull();
    }
}
