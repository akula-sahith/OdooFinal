package com.odoo.DealFlow360.customer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.regex.Pattern;

/**
 * Business service handling CustomerContact domain operations, validation,
 * customer association semantics, and JDBC repository integration.
 */
@Service
public class CustomerContactService {

    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");

    private final CustomerContactRepository customerContactRepository;

    public CustomerContactService() {
        this.customerContactRepository = null;
    }

    @Autowired
    public CustomerContactService(CustomerContactRepository customerContactRepository) {
        this.customerContactRepository = customerContactRepository;
    }

    /**
     * Creates and validates a new CustomerContact instance associated with a customer ID.
     *
     * @param customerId Customer ID context (required, positive)
     * @param name       Contact name (required)
     * @param email      Contact email (optional, valid format if provided)
     * @param phone      Contact phone number (optional)
     * @param status     Contact status (optional)
     * @return Validated CustomerContact instance
     */
    public CustomerContact createContact(Long customerId, String name, String email, String phone, String status) {
        return createContact(null, customerId, name, email, phone, status);
    }

    /**
     * Creates and validates a CustomerContact instance with full parameters.
     *
     * @param id         Contact ID
     * @param customerId Customer ID context (required, positive)
     * @param name       Contact name (required)
     * @param email      Contact email (optional, valid format if provided)
     * @param phone      Contact phone number (optional)
     * @param status     Contact status (optional)
     * @return Validated CustomerContact instance
     */
    public CustomerContact createContact(Long id, Long customerId, String name, String email, String phone, String status) {
        CustomerContact contact = new CustomerContact(
                id,
                customerId,
                name != null ? name.trim() : null,
                email != null ? email.trim() : null,
                phone != null ? phone.trim() : null,
                status != null ? status.trim() : null
        );
        validateContact(contact);
        return contact;
    }

    /**
     * Creates and validates a CustomerContact instance directly linked to a Customer domain entity context.
     *
     * @param customer Customer entity context (required, must have non-null ID)
     * @param name     Contact name (required)
     * @param email    Contact email (optional)
     * @param phone    Contact phone (optional)
     * @param status   Contact status (optional)
     * @return Validated CustomerContact instance
     */
    public CustomerContact createContactForCustomer(Customer customer, String name, String email, String phone, String status) {
        if (customer == null) {
            throw new IllegalArgumentException("Customer entity context cannot be null");
        }
        if (customer.getId() == null || customer.getId() <= 0) {
            throw new IllegalArgumentException("Customer must have a valid positive ID to associate contacts");
        }
        return createContact(null, customer.getId(), name, email, phone, status);
    }

    /**
     * Validates domain constraints on a CustomerContact object.
     *
     * @param contact CustomerContact entity to validate
     */
    public void validateContact(CustomerContact contact) {
        if (contact == null) {
            throw new IllegalArgumentException("Customer contact cannot be null");
        }
        if (contact.getCustomerId() == null || contact.getCustomerId() <= 0) {
            throw new IllegalArgumentException("Contact must be associated with a valid positive Customer ID context");
        }
        if (contact.getName() == null || contact.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Contact name cannot be null or blank");
        }
        if (contact.getEmail() == null || contact.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("Contact email cannot be null or blank");
        }
        if (!EMAIL_PATTERN.matcher(contact.getEmail().trim()).matches()) {
            throw new IllegalArgumentException("Invalid contact email format: " + contact.getEmail());
        }
    }

    /**
     * Associates an existing contact with a Customer domain entity context.
     *
     * @param contact  CustomerContact entity
     * @param customer Customer entity context
     */
    public void associateWithCustomer(CustomerContact contact, Customer customer) {
        if (contact == null) {
            throw new IllegalArgumentException("Customer contact cannot be null");
        }
        if (customer == null) {
            throw new IllegalArgumentException("Customer entity context cannot be null");
        }
        if (customer.getId() == null || customer.getId() <= 0) {
            throw new IllegalArgumentException("Customer must have a valid positive ID to associate contacts");
        }
        contact.setCustomerId(customer.getId());
    }

    /**
     * Associates an existing contact with a Customer ID.
     *
     * @param contact    CustomerContact entity
     * @param customerId Customer ID
     */
    public void associateWithCustomer(CustomerContact contact, Long customerId) {
        if (contact == null) {
            throw new IllegalArgumentException("Customer contact cannot be null");
        }
        if (customerId == null || customerId <= 0) {
            throw new IllegalArgumentException("Customer ID must be a valid positive number");
        }
        contact.setCustomerId(customerId);
    }

    /**
     * Checks if a contact is associated with a specific customer ID.
     *
     * @param contact    CustomerContact entity
     * @param customerId Customer ID
     * @return true if associated with customerId, false otherwise
     */
    public boolean belongsToCustomer(CustomerContact contact, Long customerId) {
        if (contact == null || customerId == null) {
            return false;
        }
        return customerId.equals(contact.getCustomerId());
    }

    /**
     * Checks if a contact has an associated customer context.
     *
     * @param contact CustomerContact entity
     * @return true if customerId is non-null, false otherwise
     */
    public boolean isAssociatedWithCustomer(CustomerContact contact) {
        return contact != null && contact.getCustomerId() != null && contact.getCustomerId() > 0;
    }

    /**
     * Persists a CustomerContact entity after domain validation.
     */
    public CustomerContact saveContact(CustomerContact contact) {
        validateContact(contact);
        if (customerContactRepository != null) {
            return customerContactRepository.save(contact);
        }
        return contact;
    }

    /**
     * Finds a CustomerContact by ID using the repository.
     */
    public Optional<CustomerContact> findContactById(Long id) {
        if (customerContactRepository != null && id != null) {
            return customerContactRepository.findById(id);
        }
        return Optional.empty();
    }

    /**
     * Finds all CustomerContacts belonging to a specific Customer using the repository.
     */
    public List<CustomerContact> findContactsByCustomerId(Long customerId) {
        if (customerContactRepository != null && customerId != null) {
            return customerContactRepository.findByCustomerId(customerId);
        }
        return Collections.emptyList();
    }

    /**
     * Retrieves all CustomerContacts from database.
     */
    public List<CustomerContact> findAllContacts() {
        if (customerContactRepository != null) {
            return customerContactRepository.findAll();
        }
        return Collections.emptyList();
    }

    /**
     * Deletes a CustomerContact by ID.
     */
    public void deleteContact(Long id) {
        if (customerContactRepository != null && id != null) {
            customerContactRepository.deleteById(id);
        }
    }
}
