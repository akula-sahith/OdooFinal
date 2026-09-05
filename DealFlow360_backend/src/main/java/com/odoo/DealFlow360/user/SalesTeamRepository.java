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
import java.util.List;
import java.util.Optional;

/**
 * Repository for SalesTeam persistence operations using Spring JDBC.
 */
@Repository
public class SalesTeamRepository {

    private final JdbcTemplate jdbcTemplate;
    private final RowMapper<SalesTeam> rowMapper = new SalesTeamRowMapper();

    public SalesTeamRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     * Persists a SalesTeam (inserts if id is null, updates if id is present).
     *
     * @param salesTeam SalesTeam domain object
     * @return Saved SalesTeam object with generated ID populated
     */
    public SalesTeam save(SalesTeam salesTeam) {
        if (salesTeam.getId() == null) {
            String sql = "INSERT INTO sales_teams (name) VALUES (?)";
            KeyHolder keyHolder = new GeneratedKeyHolder();
            jdbcTemplate.update(connection -> {
                PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
                ps.setString(1, salesTeam.getName());
                return ps;
            }, keyHolder);

            Number key = keyHolder.getKey();
            if (key != null) {
                salesTeam.setId(key.longValue());
            }
            return salesTeam;
        } else {
            String sql = "UPDATE sales_teams SET name = ? WHERE id = ?";
            jdbcTemplate.update(sql, salesTeam.getName(), salesTeam.getId());
            return salesTeam;
        }
    }

    /**
     * Finds a SalesTeam by ID.
     */
    public Optional<SalesTeam> findById(Long id) {
        String sql = "SELECT id, name FROM sales_teams WHERE id = ?";
        List<SalesTeam> results = jdbcTemplate.query(sql, rowMapper, id);
        return results.stream().findFirst();
    }

    /**
     * Finds a SalesTeam by name.
     */
    public Optional<SalesTeam> findByName(String name) {
        String sql = "SELECT id, name FROM sales_teams WHERE name = ?";
        List<SalesTeam> results = jdbcTemplate.query(sql, rowMapper, name);
        return results.stream().findFirst();
    }

    /**
     * Checks if a SalesTeam exists by ID.
     */
    public boolean existsById(Long id) {
        String sql = "SELECT COUNT(*) FROM sales_teams WHERE id = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, id);
        return count != null && count > 0;
    }

    /**
     * Retrieves all SalesTeams.
     */
    public List<SalesTeam> findAll() {
        String sql = "SELECT id, name FROM sales_teams ORDER BY id";
        return jdbcTemplate.query(sql, rowMapper);
    }

    /**
     * Deletes a SalesTeam by ID.
     */
    public void deleteById(Long id) {
        String sql = "DELETE FROM sales_teams WHERE id = ?";
        jdbcTemplate.update(sql, id);
    }

    /**
     * RowMapper implementation for SalesTeam entities.
     */
    public static class SalesTeamRowMapper implements RowMapper<SalesTeam> {
        @Override
        public SalesTeam mapRow(ResultSet rs, int rowNum) throws SQLException {
            SalesTeam team = new SalesTeam();
            team.setId(rs.getLong("id"));
            team.setName(rs.getString("name"));
            return team;
        }
    }
}
