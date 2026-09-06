package com.odoo.DealFlow360.customer;

import com.odoo.DealFlow360.user.SalesTeam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.regex.Pattern;

/**
 * Business service handling Customer domain operations, validation,
 * sales team assignment semantics, discount tier reference management, and JDBC repository integration.
 */
@Service
public class CustomerService {

    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");

    private final CustomerRepository customerRepository;

    public CustomerService() {
        this.customerRepository = null;
    }

    @Autowired
    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    /**
     * Creates and validates a new Customer instance.
     *
     * @param companyName Company name (required)
     * @param salesTeamId Sales Team ID (optional)
     * @param discountTierId Discount Tier ID reference (optional)
     * @param portalEmail Portal email (optional, valid format if provided)
     * @param portalPasswordHash Portal password hash (optional)
     * @return Validated Customer instance
     */
    public Customer createCustomer(String companyName, Long salesTeamId, Long discountTierId, String portalEmail, String portalPasswordHash) {
        return createCustomer(null, companyName, salesTeamId, discountTierId, portalEmail, portalPasswordHash, Instant.now());
    }

    /**
     * Creates and validates a Customer instance with full parameters.
     *
     * @param id                 Customer ID
     * @param companyName        Company name (required)
     * @param salesTeamId        Sales Team ID (optional)
     * @param discountTierId     Discount Tier ID reference (optional)
     * @param portalEmail        Portal email (optional, valid format if provided)
     * @param portalPasswordHash Portal password hash (optional)
     * @param createdAt          Creation timestamp (defaults to now if null)
     * @return Validated Customer instance
     */
    public Customer createCustomer(Long id, String companyName, Long salesTeamId, Long discountTierId, String portalEmail, String portalPasswordHash, Instant createdAt) {
        Customer customer = new Customer(
                id,
                companyName != null ? companyName.trim() : null,
                salesTeamId,
                discountTierId,
                portalEmail != null ? portalEmail.trim() : null,
                portalPasswordHash,
                createdAt != null ? createdAt : Instant.now()
        );
        validateCustomer(customer);
        return customer;
    }

    /**
     * Validates domain constraints on a Customer object.
     *
     * @param customer Customer entity to validate
     */
    public void validateCustomer(Customer customer) {
        if (customer == null) {
            throw new IllegalArgumentException("Customer cannot be null");
        }
        if (customer.getCompanyName() == null || customer.getCompanyName().trim().isEmpty()) {
            throw new IllegalArgumentException("Customer company name cannot be null or blank");
        }
        if (customer.getPortalEmail() != null && !customer.getPortalEmail().trim().isEmpty()) {
            if (!EMAIL_PATTERN.matcher(customer.getPortalEmail().trim()).matches()) {
                throw new IllegalArgumentException("Invalid customer portal email format: " + customer.getPortalEmail());
            }
        }
        if (customer.getSalesTeamId() != null && customer.getSalesTeamId() <= 0) {
            throw new IllegalArgumentException("Sales Team ID must be a positive number if specified");
        }
        if (customer.getDiscountTierId() != null && customer.getDiscountTierId() <= 0) {
            throw new IllegalArgumentException("Discount Tier ID must be a positive number if specified");
        }
    }

    /**
     * Assigns a customer to a sales team using a SalesTeam domain entity.
     *
     * @param customer Customer entity
     * @param team     SalesTeam entity
     */
    public void assignToSalesTeam(Customer customer, SalesTeam team) {
        if (customer == null) {
            throw new IllegalArgumentException("Customer cannot be null");
        }
        if (team == null) {
            throw new IllegalArgumentException("Sales team cannot be null");
        }
        if (team.getId() == null || team.getId() <= 0) {
            throw new IllegalArgumentException("Sales team must have a valid positive ID to assign to a customer");
        }
        customer.setSalesTeamId(team.getId());
    }

    /**
     * Assigns a customer to a sales team using a team ID.
     *
     * @param customer    Customer entity
     * @param salesTeamId Sales Team ID
     */
    public void assignToSalesTeam(Customer customer, Long salesTeamId) {
        if (customer == null) {
            throw new IllegalArgumentException("Customer cannot be null");
        }
        if (salesTeamId == null || salesTeamId <= 0) {
            throw new IllegalArgumentException("Sales team ID must be a valid positive number");
        }
        customer.setSalesTeamId(salesTeamId);
    }

    /**
     * Removes a customer from their assigned sales team.
     *
     * @param customer Customer entity
     */
    public void removeFromSalesTeam(Customer customer) {
        if (customer == null) {
            throw new IllegalArgumentException("Customer cannot be null");
        }
        customer.setSalesTeamId(null);
    }

    /**
     * Checks if a customer is assigned to a specific sales team.
     *
     * @param customer    Customer entity
     * @param salesTeamId Sales Team ID
     * @return true if assigned to salesTeamId, false otherwise
     */
    public boolean belongsToSalesTeam(Customer customer, Long salesTeamId) {
        if (customer == null || salesTeamId == null) {
            return false;
        }
        return salesTeamId.equals(customer.getSalesTeamId());
    }

    /**
     * Checks if a customer is assigned to any sales team.
     *
     * @param customer Customer entity
     * @return true if salesTeamId is non-null, false otherwise
     */
    public boolean isAssignedToSalesTeam(Customer customer) {
        return customer != null && customer.getSalesTeamId() != null;
    }

    /**
     * Assigns a discount tier reference to a customer.
     * Note: Discount logic/calculation is handled in a later iteration.
     *
     * @param customer       Customer entity
     * @param discountTierId Discount Tier ID reference
     */
    public void assignDiscountTier(Customer customer, Long discountTierId) {
        if (customer == null) {
            throw new IllegalArgumentException("Customer cannot be null");
        }
        if (discountTierId == null || discountTierId <= 0) {
            throw new IllegalArgumentException("Discount Tier ID must be a valid positive number");
        }
        customer.setDiscountTierId(discountTierId);
    }

    /**
     * Removes the discount tier reference from a customer.
     *
     * @param customer Customer entity
     */
    public void removeDiscountTier(Customer customer) {
        if (customer == null) {
            throw new IllegalArgumentException("Customer cannot be null");
        }
        customer.setDiscountTierId(null);
    }

    /**
     * Checks if a customer has an assigned discount tier reference.
     *
     * @param customer Customer entity
     * @return true if discountTierId is non-null, false otherwise
     */
    public boolean hasDiscountTier(Customer customer) {
        return customer != null && customer.getDiscountTierId() != null;
    }

    /**
     * Persists a Customer entity after domain validation.
     */
    public Customer saveCustomer(Customer customer) {
        validateCustomer(customer);
        if (customerRepository != null) {
            return customerRepository.save(customer);
        }
        return customer;
    }

    /**
     * Finds a Customer by ID using the repository.
     */
    public Optional<Customer> findCustomerById(Long id) {
        if (customerRepository != null && id != null) {
            return customerRepository.findById(id);
        }
        return Optional.empty();
    }

    /**
     * Finds a Customer by portal email using the repository.
     */
    public Optional<Customer> findCustomerByPortalEmail(String portalEmail) {
        if (customerRepository != null && portalEmail != null && !portalEmail.isBlank()) {
            return customerRepository.findByPortalEmail(portalEmail);
        }
        return Optional.empty();
    }

    public Optional<Customer> findByPortalEmail(String portalEmail) {
        return findCustomerByPortalEmail(portalEmail);
    }

    /**
     * Finds all Customers assigned to a Sales Team using the repository.
     */
    public List<Customer> findCustomersBySalesTeamId(Long salesTeamId) {
        if (customerRepository != null && salesTeamId != null) {
            return customerRepository.findBySalesTeamId(salesTeamId);
        }
        return Collections.emptyList();
    }

    /**
     * Retrieves all Customers from database.
     */
    public List<Customer> findAllCustomers() {
        if (customerRepository != null) {
            return customerRepository.findAll();
        }
        return Collections.emptyList();
    }

    /**
     * Deletes a Customer by ID.
     */
    public void deleteCustomer(Long id) {
        if (customerRepository != null && id != null) {
            customerRepository.deleteById(id);
        }
    }
}
