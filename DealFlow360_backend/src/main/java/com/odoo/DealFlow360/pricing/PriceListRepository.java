package com.odoo.DealFlow360.pricing;

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
import java.util.List;
import java.util.Optional;

/**
 * Repository for PriceList persistence operations using Spring JDBC.
 */
@Repository
public class PriceListRepository {

    private final JdbcTemplate jdbcTemplate;
    private final RowMapper<PriceList> rowMapper = new PriceListRowMapper();

    public PriceListRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     * Persists a PriceList (inserts if id is null, updates if id is present).
     *
     * @param priceList PriceList domain object
     * @return Saved PriceList object with generated ID populated
     */
    public PriceList save(PriceList priceList) {
        if (priceList.getId() == null) {
            String sql = "INSERT INTO price_lists (discount_tier_id, currency, valid_from, valid_to) VALUES (?, ?, ?, ?)";
            KeyHolder keyHolder = new GeneratedKeyHolder();
            jdbcTemplate.update(connection -> {
                PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
                if (priceList.getDiscountTierId() != null) {
                    ps.setLong(1, priceList.getDiscountTierId());
                } else {
                    ps.setNull(1, java.sql.Types.BIGINT);
                }
                ps.setString(2, priceList.getCurrency() != null ? priceList.getCurrency() : "USD");
                if (priceList.getValidFrom() != null) {
                    ps.setTimestamp(3, Timestamp.from(priceList.getValidFrom()));
                } else {
                    ps.setNull(3, java.sql.Types.TIMESTAMP);
                }
                if (priceList.getValidTo() != null) {
                    ps.setTimestamp(4, Timestamp.from(priceList.getValidTo()));
                } else {
                    ps.setNull(4, java.sql.Types.TIMESTAMP);
                }
                return ps;
            }, keyHolder);

            Number key = keyHolder.getKey();
            if (key != null) {
                priceList.setId(key.longValue());
            }
            return priceList;
        } else {
            String sql = "UPDATE price_lists SET discount_tier_id = ?, currency = ?, valid_from = ?, valid_to = ? WHERE id = ?";
            jdbcTemplate.update(sql,
                    priceList.getDiscountTierId(),
                    priceList.getCurrency() != null ? priceList.getCurrency() : "USD",
                    priceList.getValidFrom() != null ? Timestamp.from(priceList.getValidFrom()) : null,
                    priceList.getValidTo() != null ? Timestamp.from(priceList.getValidTo()) : null,
                    priceList.getId());
            return priceList;
        }
    }

    /**
     * Finds a PriceList by ID.
     */
    public Optional<PriceList> findById(Long id) {
        String sql = "SELECT id, discount_tier_id, currency, valid_from, valid_to FROM price_lists WHERE id = ?";
        List<PriceList> results = jdbcTemplate.query(sql, rowMapper, id);
        return results.stream().findFirst();
    }

    /**
     * Finds all PriceLists matching a specific Discount Tier ID.
     */
    public List<PriceList> findByDiscountTierId(Long discountTierId) {
        String sql = "SELECT id, discount_tier_id, currency, valid_from, valid_to FROM price_lists WHERE discount_tier_id = ? ORDER BY id";
        return jdbcTemplate.query(sql, rowMapper, discountTierId);
    }

    /**
     * Checks if a PriceList exists by ID.
     */
    public boolean existsById(Long id) {
        String sql = "SELECT COUNT(*) FROM price_lists WHERE id = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, id);
        return count != null && count > 0;
    }

    /**
     * Retrieves all PriceLists.
     */
    public List<PriceList> findAll() {
        String sql = "SELECT id, discount_tier_id, currency, valid_from, valid_to FROM price_lists ORDER BY id";
        return jdbcTemplate.query(sql, rowMapper);
    }

    /**
     * Deletes a PriceList by ID.
     */
    public void deleteById(Long id) {
        String sql = "DELETE FROM price_lists WHERE id = ?";
        jdbcTemplate.update(sql, id);
    }

    /**
     * RowMapper implementation for PriceList entities.
     */
    public static class PriceListRowMapper implements RowMapper<PriceList> {
        @Override
        public PriceList mapRow(ResultSet rs, int rowNum) throws SQLException {
            PriceList priceList = new PriceList();
            priceList.setId(rs.getLong("id"));
            long dtId = rs.getLong("discount_tier_id");
            priceList.setDiscountTierId(rs.wasNull() ? null : dtId);
            priceList.setCurrency(rs.getString("currency"));
            Timestamp vf = rs.getTimestamp("valid_from");
            priceList.setValidFrom(vf != null ? vf.toInstant() : null);
            Timestamp vt = rs.getTimestamp("valid_to");
            priceList.setValidTo(vt != null ? vt.toInstant() : null);
            return priceList;
        }
    }
}
