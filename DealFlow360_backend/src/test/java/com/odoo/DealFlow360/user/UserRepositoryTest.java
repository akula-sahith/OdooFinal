package com.odoo.DealFlow360.user;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.jdbc.core.JdbcTemplate;

import java.time.Instant;
import java.util.Collections;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class UserRepositoryTest {

    private JdbcTemplate jdbcTemplate;
    private UserRepository userRepository;

    @BeforeEach
    void setUp() {
        jdbcTemplate = mock(JdbcTemplate.class);
        userRepository = new UserRepository(jdbcTemplate);
    }

    @Test
    @DisplayName("Should find user by id")
    void testFindById() {
        User user = new User(1L, "Alice", "alice@example.com", "hash", "ADMIN", 5L, Instant.now());
        when(jdbcTemplate.query(eq("SELECT id, name, email, password_hash, role, team_id, created_at FROM users WHERE id = ?"), any(UserRepository.UserRowMapper.class), eq(1L)))
                .thenReturn(Collections.singletonList(user));

        Optional<User> result = userRepository.findById(1L);

        assertThat(result).isPresent();
        assertThat(result.get().getEmail()).isEqualTo("alice@example.com");
    }

    @Test
    @DisplayName("Should find user by email")
    void testFindByEmail() {
        User user = new User(2L, "Bob", "bob@example.com", "hash", "USER", null, Instant.now());
        when(jdbcTemplate.query(eq("SELECT id, name, email, password_hash, role, team_id, created_at FROM users WHERE email = ?"), any(UserRepository.UserRowMapper.class), eq("bob@example.com")))
                .thenReturn(Collections.singletonList(user));

        Optional<User> result = userRepository.findByEmail("bob@example.com");

        assertThat(result).isPresent();
        assertThat(result.get().getName()).isEqualTo("Bob");
    }

    @Test
    @DisplayName("Should update existing user")
    void testUpdateUser() {
        User user = new User(1L, "Alice Updated", "alice@example.com", "newhash", "ADMIN", 5L, Instant.now());
        userRepository.save(user);

        verify(jdbcTemplate).update(
                eq("UPDATE users SET name = ?, email = ?, password_hash = ?, role = ?, team_id = ? WHERE id = ?"),
                eq("Alice Updated"),
                eq("alice@example.com"),
                eq("newhash"),
                eq("ADMIN"),
                eq(5L),
                eq(1L)
        );
    }

    @Test
    @DisplayName("Should check user existence by id")
    void testExistsById() {
        when(jdbcTemplate.queryForObject(eq("SELECT COUNT(*) FROM users WHERE id = ?"), eq(Integer.class), eq(10L)))
                .thenReturn(1);

        assertThat(userRepository.existsById(10L)).isTrue();
    }
}
