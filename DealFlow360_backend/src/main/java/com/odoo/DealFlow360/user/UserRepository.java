package com.odoo.DealFlow360.user;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

/**
 * Repository for User persistence operations using Spring JDBC.
 */
@Repository
public class UserRepository {

    private final JdbcTemplate jdbcTemplate;
    private final RowMapper<User> rowMapper = new UserRowMapper();

    public UserRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     * Persists a User (inserts if id is null, updates if id is present).
     *
     * @param user User domain object
     * @return Saved User object with generated ID populated
     */
    public User save(User user) {
        if (user.getCreatedAt() == null) {
            user.setCreatedAt(Instant.now());
        }
        if (user.getId() == null) {
            String sql = "INSERT INTO users (name, email, password_hash, role, team_id, created_at) VALUES (?, ?, ?, ?, ?, ?)";
            KeyHolder keyHolder = new GeneratedKeyHolder();
            jdbcTemplate.update(connection -> {
                PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
                ps.setString(1, user.getName());
                ps.setString(2, user.getEmail());
                ps.setString(3, user.getPasswordHash());
                ps.setString(4, user.getRole());
                if (user.getTeamId() != null) {
                    ps.setLong(5, user.getTeamId());
                } else {
                    ps.setNull(5, java.sql.Types.BIGINT);
                }
                ps.setTimestamp(6, Timestamp.from(user.getCreatedAt()));
                return ps;
            }, keyHolder);

            Number key = keyHolder.getKey();
            if (key != null) {
                user.setId(key.longValue());
            }
            return user;
        } else {
            String sql = "UPDATE users SET name = ?, email = ?, password_hash = ?, role = ?, team_id = ? WHERE id = ?";
            jdbcTemplate.update(sql,
                    user.getName(),
                    user.getEmail(),
                    user.getPasswordHash(),
                    user.getRole(),
                    user.getTeamId(),
                    user.getId());
            return user;
        }
    }

    /**
     * Finds a User by ID.
     */
    public Optional<User> findById(Long id) {
        String sql = "SELECT id, name, email, password_hash, role, team_id, created_at FROM users WHERE id = ?";
        List<User> results = jdbcTemplate.query(sql, rowMapper, id);
        return results.stream().findFirst();
    }

    /**
     * Finds a User by email.
     */
    public Optional<User> findByEmail(String email) {
        String sql = "SELECT id, name, email, password_hash, role, team_id, created_at FROM users WHERE email = ?";
        List<User> results = jdbcTemplate.query(sql, rowMapper, email);
        return results.stream().findFirst();
    }

    /**
     * Finds all Users belonging to a specific Sales Team.
     */
    public List<User> findByTeamId(Long teamId) {
        String sql = "SELECT id, name, email, password_hash, role, team_id, created_at FROM users WHERE team_id = ? ORDER BY id";
        return jdbcTemplate.query(sql, rowMapper, teamId);
    }

    /**
     * Checks if a User exists by ID.
     */
    public boolean existsById(Long id) {
        String sql = "SELECT COUNT(*) FROM users WHERE id = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, id);
        return count != null && count > 0;
    }

    /**
     * Retrieves all Users.
     */
    public List<User> findAll() {
        String sql = "SELECT id, name, email, password_hash, role, team_id, created_at FROM users ORDER BY id";
        return jdbcTemplate.query(sql, rowMapper);
    }

    /**
     * Deletes a User by ID.
     */
    public void deleteById(Long id) {
        String sql = "DELETE FROM users WHERE id = ?";
        jdbcTemplate.update(sql, id);
    }

    /**
     * RowMapper implementation for User entities.
     */
    public static class UserRowMapper implements RowMapper<User> {
        @Override
        public User mapRow(ResultSet rs, int rowNum) throws SQLException {
            User user = new User();
            user.setId(rs.getLong("id"));
            user.setName(rs.getString("name"));
            user.setEmail(rs.getString("email"));
            user.setPasswordHash(rs.getString("password_hash"));
            user.setRole(rs.getString("role"));
            long teamId = rs.getLong("team_id");
            user.setTeamId(rs.wasNull() ? null : teamId);
            Timestamp ts = rs.getTimestamp("created_at");
            user.setCreatedAt(ts != null ? ts.toInstant() : null);
            return user;
        }
    }
}
