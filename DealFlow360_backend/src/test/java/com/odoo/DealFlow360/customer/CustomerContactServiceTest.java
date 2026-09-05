package com.odoo.DealFlow360.customer;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class CustomerContactServiceTest {

    private CustomerContactService contactService;

    @BeforeEach
    void setUp() {
        contactService = new CustomerContactService();
    }

    @Test
    @DisplayName("Should create contact successfully with valid customer context")
    void testCreateContactSuccess() {
        CustomerContact contact = contactService.createContact(100L, "Sarah Connor", "sarah@cyberdyne.com", "555-0199", "ACTIVE");

        assertThat(contact).isNotNull();
        assertThat(contact.getCustomerId()).isEqualTo(100L);
        assertThat(contact.getName()).isEqualTo("Sarah Connor");
        assertThat(contact.getEmail()).isEqualTo("sarah@cyberdyne.com");
        assertThat(contact.getPhone()).isEqualTo("555-0199");
        assertThat(contact.getStatus()).isEqualTo("ACTIVE");
    }

    @Test
    @DisplayName("Should create contact for Customer domain entity context")
    void testCreateContactForCustomerEntity() {
        Customer customer = new Customer(50L, "Cyberdyne Systems", 1L, null, null, null, null);
        CustomerContact contact = contactService.createContactForCustomer(customer, "Miles Dyson", "miles@cyberdyne.com", "555-0200", "ACTIVE");

        assertThat(contact).isNotNull();
        assertThat(contact.getCustomerId()).isEqualTo(50L);
        assertThat(contactService.belongsToCustomer(contact, 50L)).isTrue();
        assertThat(contactService.isAssociatedWithCustomer(contact)).isTrue();
    }

    @Test
    @DisplayName("Should throw exception when customer context is missing or invalid ID")
    void testCreateContactMissingCustomerContext() {
        assertThatThrownBy(() -> contactService.createContact(null, "John", "john@example.com", "123", "ACTIVE"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Contact must be associated with a valid positive Customer ID context");

        assertThatThrownBy(() -> contactService.createContact(-1L, "John", "john@example.com", "123", "ACTIVE"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Contact must be associated with a valid positive Customer ID context");
    }

    @Test
    @DisplayName("Should throw exception when contact name is blank")
    void testCreateContactInvalidName() {
        assertThatThrownBy(() -> contactService.createContact(10L, "", "john@example.com", "123", "ACTIVE"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Contact name cannot be null or blank");
    }

    @Test
    @DisplayName("Should throw exception when contact email format is invalid")
    void testCreateContactInvalidEmail() {
        assertThatThrownBy(() -> contactService.createContact(10L, "John Doe", "bad-email-format", "123", "ACTIVE"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Invalid contact email format");
    }

    @Test
    @DisplayName("Should throw exception when contact email is null or blank")
    void testCreateContactMissingEmail() {
        assertThatThrownBy(() -> contactService.createContact(10L, "John Doe", null, "123", "ACTIVE"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Contact email cannot be null or blank");

        assertThatThrownBy(() -> contactService.createContact(10L, "John Doe", "   ", "123", "ACTIVE"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Contact email cannot be null or blank");
    }

    @Test
    @DisplayName("Should re-associate contact with another customer context")
    void testAssociateWithCustomer() {
        CustomerContact contact = contactService.createContact(10L, "Alice", "alice@example.com", null, null);
        Customer newCustomer = new Customer(20L, "New Corp", null, null, null, null, null);

        contactService.associateWithCustomer(contact, newCustomer);

        assertThat(contact.getCustomerId()).isEqualTo(20L);
        assertThat(contactService.belongsToCustomer(contact, 20L)).isTrue();
    }
}
