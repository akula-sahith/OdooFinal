package com.odoo.DealFlow360.user;

import org.springframework.stereotype.Service;

/**
 * Business service handling Sales Team domain validation and logic.
 */
@Service
public class SalesTeamService {

    /**
     * Creates and validates a new SalesTeam domain object.
     *
     * @param name Name of the sales team
     * @return Validated SalesTeam object
     */
    public SalesTeam createSalesTeam(String name) {
        return createSalesTeam(null, name);
    }

    /**
     * Creates and validates a new SalesTeam domain object with an assigned ID.
     *
     * @param id   Sales team ID
     * @param name Name of the sales team
     * @return Validated SalesTeam object
     */
    public SalesTeam createSalesTeam(Long id, String name) {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Sales team name cannot be null or blank");
        }
        return new SalesTeam(id, name.trim());
    }

    /**
     * Validates a SalesTeam domain entity.
     *
     * @param salesTeam SalesTeam entity to validate
     */
    public void validateSalesTeam(SalesTeam salesTeam) {
        if (salesTeam == null) {
            throw new IllegalArgumentException("Sales team cannot be null");
        }
        if (salesTeam.getName() == null || salesTeam.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Sales team name cannot be null or blank");
        }
    }

    /**
     * Renames an existing sales team after validating the new name.
     *
     * @param salesTeam SalesTeam entity to rename
     * @param newName   New team name
     */
    public void renameSalesTeam(SalesTeam salesTeam, String newName) {
        validateSalesTeam(salesTeam);
        if (newName == null || newName.trim().isEmpty()) {
            throw new IllegalArgumentException("New sales team name cannot be null or blank");
        }
        salesTeam.setName(newName.trim());
    }
}
