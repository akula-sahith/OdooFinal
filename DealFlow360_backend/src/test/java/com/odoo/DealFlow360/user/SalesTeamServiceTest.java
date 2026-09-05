package com.odoo.DealFlow360.user;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class SalesTeamServiceTest {

    private SalesTeamService salesTeamService;

    @BeforeEach
    void setUp() {
        salesTeamService = new SalesTeamService();
    }

    @Test
    @DisplayName("Should create sales team successfully with valid name")
    void testCreateSalesTeamSuccess() {
        SalesTeam team = salesTeamService.createSalesTeam(10L, "Enterprise Sales");
        assertThat(team).isNotNull();
        assertThat(team.getId()).isEqualTo(10L);
        assertThat(team.getName()).isEqualTo("Enterprise Sales");
    }

    @Test
    @DisplayName("Should throw exception when creating sales team with null or blank name")
    void testCreateSalesTeamInvalidName() {
        assertThatThrownBy(() -> salesTeamService.createSalesTeam(10L, null))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Sales team name cannot be null or blank");

        assertThatThrownBy(() -> salesTeamService.createSalesTeam(10L, "   "))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Sales team name cannot be null or blank");
    }

    @Test
    @DisplayName("Should validate sales team correctly")
    void testValidateSalesTeam() {
        SalesTeam team = new SalesTeam(1L, "SMB Sales");
        salesTeamService.validateSalesTeam(team);

        assertThatThrownBy(() -> salesTeamService.validateSalesTeam(null))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Sales team cannot be null");

        SalesTeam invalidTeam = new SalesTeam(2L, "");
        assertThatThrownBy(() -> salesTeamService.validateSalesTeam(invalidTeam))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Sales team name cannot be null or blank");
    }

    @Test
    @DisplayName("Should rename sales team with valid input")
    void testRenameSalesTeam() {
        SalesTeam team = new SalesTeam(1L, "Old Name");
        salesTeamService.renameSalesTeam(team, "New Name");

        assertThat(team.getName()).isEqualTo("New Name");
    }
}
