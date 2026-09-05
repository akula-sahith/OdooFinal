package com.odoo.DealFlow360.user;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class SalesTeamRepositoryTest {

    private JdbcTemplate jdbcTemplate;
    private SalesTeamRepository salesTeamRepository;

    @BeforeEach
    void setUp() {
        jdbcTemplate = mock(JdbcTemplate.class);
        salesTeamRepository = new SalesTeamRepository(jdbcTemplate);
    }

    @Test
    @DisplayName("Should find sales team by id")
    void testFindById() {
        SalesTeam team = new SalesTeam(1L, "Alpha Team");
        when(jdbcTemplate.query(eq("SELECT id, name FROM sales_teams WHERE id = ?"), any(SalesTeamRepository.SalesTeamRowMapper.class), eq(1L)))
                .thenReturn(Collections.singletonList(team));

        Optional<SalesTeam> result = salesTeamRepository.findById(1L);

        assertThat(result).isPresent();
        assertThat(result.get().getName()).isEqualTo("Alpha Team");
    }

    @Test
    @DisplayName("Should find sales team by name")
    void testFindByName() {
        SalesTeam team = new SalesTeam(2L, "Beta Team");
        when(jdbcTemplate.query(eq("SELECT id, name FROM sales_teams WHERE name = ?"), any(SalesTeamRepository.SalesTeamRowMapper.class), eq("Beta Team")))
                .thenReturn(Collections.singletonList(team));

        Optional<SalesTeam> result = salesTeamRepository.findByName("Beta Team");

        assertThat(result).isPresent();
        assertThat(result.get().getId()).isEqualTo(2L);
    }

    @Test
    @DisplayName("Should update existing sales team")
    void testUpdateSalesTeam() {
        SalesTeam team = new SalesTeam(1L, "Updated Team");
        salesTeamRepository.save(team);

        verify(jdbcTemplate).update(
                eq("UPDATE sales_teams SET name = ? WHERE id = ?"),
                eq("Updated Team"),
                eq(1L)
        );
    }

    @Test
    @DisplayName("Should check existence by id")
    void testExistsById() {
        when(jdbcTemplate.queryForObject(eq("SELECT COUNT(*) FROM sales_teams WHERE id = ?"), eq(Integer.class), eq(10L)))
                .thenReturn(1);

        assertThat(salesTeamRepository.existsById(10L)).isTrue();
    }
}
