package com.odoo.DealFlow360.user;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class UserServiceTest {

    private UserService userService;

    @BeforeEach
    void setUp() {
        userService = new UserService();
    }

    @Test
    @DisplayName("Should create user successfully with valid inputs")
    void testCreateUserSuccess() {
        User user = userService.createUser("John Doe", "john.doe@example.com", "$2a$10$hashedpassword", "SALES_REP");

        assertThat(user).isNotNull();
        assertThat(user.getName()).isEqualTo("John Doe");
        assertThat(user.getEmail()).isEqualTo("john.doe@example.com");
        assertThat(user.getRole()).isEqualTo("SALES_REP");
        assertThat(user.getCreatedAt()).isNotNull();
    }

    @Test
    @DisplayName("Should throw exception when user email format is invalid")
    void testCreateUserInvalidEmail() {
        assertThatThrownBy(() -> userService.createUser("John Doe", "invalid-email", "$2a$10$hash", "SALES_REP"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Invalid user email format");
    }

    @Test
    @DisplayName("Should throw exception when required fields are missing")
    void testCreateUserMissingFields() {
        assertThatThrownBy(() -> userService.createUser("", "john@example.com", "hash", "ROLE"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("User name cannot be null or blank");

        assertThatThrownBy(() -> userService.createUser("John", "john@example.com", "", "ROLE"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("User password hash cannot be null or blank");

        assertThatThrownBy(() -> userService.createUser("John", "john@example.com", "hash", " "))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("User role cannot be null or blank");
    }

    @Test
    @DisplayName("Should handle valid user and sales team relationship assignment")
    void testAssignToTeamWithEntity() {
        User user = userService.createUser("Jane Smith", "jane@example.com", "hash123", "MANAGER");
        SalesTeam team = new SalesTeam(5L, "Alpha Team");

        userService.assignToTeam(user, team);

        assertThat(user.getTeamId()).isEqualTo(5L);
        assertThat(userService.belongsToTeam(user, 5L)).isTrue();
        assertThat(userService.isAssignedToTeam(user)).isTrue();
    }

    @Test
    @DisplayName("Should assign user to team using valid team ID")
    void testAssignToTeamWithId() {
        User user = userService.createUser("Alice", "alice@example.com", "hash123", "REP");
        userService.assignToTeam(user, 12L);

        assertThat(user.getTeamId()).isEqualTo(12L);
        assertThat(userService.belongsToTeam(user, 12L)).isTrue();
    }

    @Test
    @DisplayName("Should throw exception when assigning to team with invalid team ID")
    void testAssignToTeamInvalidId() {
        User user = userService.createUser("Bob", "bob@example.com", "hash123", "REP");

        assertThatThrownBy(() -> userService.assignToTeam(user, 0L))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Sales team ID must be a valid positive number");
    }

    @Test
    @DisplayName("Should remove user from team successfully")
    void testRemoveFromTeam() {
        User user = userService.createUser(1L, "Alice", "alice@example.com", "hash123", "REP", 10L, null);
        assertThat(userService.isAssignedToTeam(user)).isTrue();

        userService.removeFromTeam(user);

        assertThat(user.getTeamId()).isNull();
        assertThat(userService.isAssignedToTeam(user)).isFalse();
    }
}
