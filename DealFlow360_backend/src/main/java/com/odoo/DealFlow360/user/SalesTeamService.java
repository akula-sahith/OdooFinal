package com.odoo.DealFlow360.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

/**
 * Business service handling Sales Team domain validation, logic, and JDBC repository integration.
 */
@Service
public class SalesTeamService {

    private final SalesTeamRepository salesTeamRepository;

    public SalesTeamService() {
        this.salesTeamRepository = null;
    }

    @Autowired
    public SalesTeamService(SalesTeamRepository salesTeamRepository) {
        this.salesTeamRepository = salesTeamRepository;
    }

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

    /**
     * Persists a SalesTeam after validating domain inputs.
     *
     * @param salesTeam SalesTeam entity to persist
     * @return Persisted SalesTeam
     */
    public SalesTeam saveSalesTeam(SalesTeam salesTeam) {
        validateSalesTeam(salesTeam);
        if (salesTeamRepository != null) {
            return salesTeamRepository.save(salesTeam);
        }
        return salesTeam;
    }

    /**
     * Finds a SalesTeam by ID using the repository.
     */
    public Optional<SalesTeam> findSalesTeamById(Long id) {
        if (salesTeamRepository != null && id != null) {
            return salesTeamRepository.findById(id);
        }
        return Optional.empty();
    }

    /**
     * Finds a SalesTeam by name using the repository.
     */
    public Optional<SalesTeam> findSalesTeamByName(String name) {
        if (salesTeamRepository != null && name != null) {
            return salesTeamRepository.findByName(name);
        }
        return Optional.empty();
    }

    /**
     * Retrieves all SalesTeams from database.
     */
    public List<SalesTeam> findAllSalesTeams() {
        if (salesTeamRepository != null) {
            return salesTeamRepository.findAll();
        }
        return Collections.emptyList();
    }

    /**
     * Deletes a SalesTeam by ID.
     */
    public void deleteSalesTeam(Long id) {
        if (salesTeamRepository != null && id != null) {
            salesTeamRepository.deleteById(id);
        }
    }
}
