package com.odoo.DealFlow360.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.regex.Pattern;

/**
 * Business service handling User domain operations, validation, Sales Team assignment semantics,
 * and JDBC repository integration.
 */
@Service
public class UserService {

    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");

    private final UserRepository userRepository;

    public UserService() {
        this.userRepository = null;
    }

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Creates and validates a new User instance.
     *
     * @param name         User display name (required)
     * @param email        User email address (required, valid format)
     * @param passwordHash Password hash string (required)
     * @param role         User role (required)
     * @return Validated User instance with current timestamp
     */
    public User createUser(String name, String email, String passwordHash, String role) {
        return createUser(null, name, email, passwordHash, role, null, Instant.now());
    }

    /**
     * Creates and validates a User instance with full parameters.
     *
     * @param id           User ID
     * @param name         User display name (required)
     * @param email        User email address (required, valid format)
     * @param passwordHash Password hash string (required)
     * @param role         User role (required)
     * @param teamId       Associated Sales Team ID (optional)
     * @param createdAt    Creation timestamp (defaults to now if null)
     * @return Validated User instance
     */
    public User createUser(Long id, String name, String email, String passwordHash, String role, Long teamId, Instant createdAt) {
        User user = new User(id, name, email, passwordHash, role, teamId, createdAt != null ? createdAt : Instant.now());
        validateUser(user);
        return user;
    }

    /**
     * Validates domain constraints on a User object.
     *
     * @param user User entity to validate
     */
    public void validateUser(User user) {
        if (user == null) {
            throw new IllegalArgumentException("User cannot be null");
        }
        if (user.getName() == null || user.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("User name cannot be null or blank");
        }
        if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("User email cannot be null or blank");
        }
        if (!EMAIL_PATTERN.matcher(user.getEmail().trim()).matches()) {
            throw new IllegalArgumentException("Invalid user email format: " + user.getEmail());
        }
        if (user.getPasswordHash() == null || user.getPasswordHash().trim().isEmpty()) {
            throw new IllegalArgumentException("User password hash cannot be null or blank");
        }
        if (user.getRole() == null || user.getRole().trim().isEmpty()) {
            throw new IllegalArgumentException("User role cannot be null or blank");
        }
        if (user.getTeamId() != null && user.getTeamId() <= 0) {
            throw new IllegalArgumentException("Sales Team ID must be a positive number if specified");
        }
    }

    /**
     * Assigns a user to a sales team using a SalesTeam domain entity.
     *
     * @param user User to assign
     * @param team SalesTeam entity
     */
    public void assignToTeam(User user, SalesTeam team) {
        if (user == null) {
            throw new IllegalArgumentException("User cannot be null");
        }
        if (team == null) {
            throw new IllegalArgumentException("Sales team cannot be null");
        }
        if (team.getId() == null || team.getId() <= 0) {
            throw new IllegalArgumentException("Sales team must have a valid positive ID to assign users");
        }
        user.setTeamId(team.getId());
    }

    /**
     * Assigns a user to a sales team using a team ID.
     *
     * @param user   User to assign
     * @param teamId Sales Team ID
     */
    public void assignToTeam(User user, Long teamId) {
        if (user == null) {
            throw new IllegalArgumentException("User cannot be null");
        }
        if (teamId == null || teamId <= 0) {
            throw new IllegalArgumentException("Sales team ID must be a valid positive number");
        }
        user.setTeamId(teamId);
    }

    /**
     * Removes a user from their assigned sales team.
     *
     * @param user User to unassign
     */
    public void removeFromTeam(User user) {
        if (user == null) {
            throw new IllegalArgumentException("User cannot be null");
        }
        user.setTeamId(null);
    }

    /**
     * Checks if a user belongs to a specific sales team.
     *
     * @param user   User entity
     * @param teamId Sales Team ID to check
     * @return true if assigned to teamId, false otherwise
     */
    public boolean belongsToTeam(User user, Long teamId) {
        if (user == null || teamId == null) {
            return false;
        }
        return teamId.equals(user.getTeamId());
    }

    /**
     * Checks if a user is currently assigned to any sales team.
     *
     * @param user User entity
     * @return true if teamId is non-null, false otherwise
     */
    public boolean isAssignedToTeam(User user) {
        return user != null && user.getTeamId() != null;
    }

    /**
     * Persists a User entity after domain validation.
     */
    public User saveUser(User user) {
        validateUser(user);
        if (userRepository != null) {
            return userRepository.save(user);
        }
        return user;
    }

    /**
     * Finds a User by ID using the repository.
     */
    public Optional<User> findUserById(Long id) {
        if (userRepository != null && id != null) {
            return userRepository.findById(id);
        }
        return Optional.empty();
    }

    /**
     * Finds a User by email using the repository.
     */
    public Optional<User> findUserByEmail(String email) {
        if (userRepository != null && email != null) {
            return userRepository.findByEmail(email);
        }
        return Optional.empty();
    }

    /**
     * Finds all Users assigned to a Sales Team using the repository.
     */
    public List<User> findUsersByTeamId(Long teamId) {
        if (userRepository != null && teamId != null) {
            return userRepository.findByTeamId(teamId);
        }
        return Collections.emptyList();
    }

    /**
     * Retrieves all Users from database.
     */
    public List<User> findAllUsers() {
        if (userRepository != null) {
            return userRepository.findAll();
        }
        return Collections.emptyList();
    }

    /**
     * Deletes a User by ID.
     */
    public void deleteUser(Long id) {
        if (userRepository != null && id != null) {
            userRepository.deleteById(id);
        }
    }
}
