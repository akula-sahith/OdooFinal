package com.odoo.DealFlow360.customer;

import com.odoo.DealFlow360.user.SalesTeam;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class CustomerServiceTest {

    private CustomerService customerService;

    @BeforeEach
    void setUp() {
        customerService = new CustomerService();
    }

    @Test
    @DisplayName("Should create customer successfully with valid company name")
    void testCreateCustomerSuccess() {
        Customer customer = customerService.createCustomer("Acme Corp", 10L, 2L, "portal@acme.com", "hash123");

        assertThat(customer).isNotNull();
        assertThat(customer.getCompanyName()).isEqualTo("Acme Corp");
        assertThat(customer.getSalesTeamId()).isEqualTo(10L);
        assertThat(customer.getDiscountTierId()).isEqualTo(2L);
        assertThat(customer.getPortalEmail()).isEqualTo("portal@acme.com");
        assertThat(customer.getCreatedAt()).isNotNull();
    }

    @Test
    @DisplayName("Should throw exception when company name is null or blank")
    void testCreateCustomerInvalidCompanyName() {
        assertThatThrownBy(() -> customerService.createCustomer(null, 1L, null, null, null))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Customer company name cannot be null or blank");

        assertThatThrownBy(() -> customerService.createCustomer("   ", 1L, null, null, null))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Customer company name cannot be null or blank");
    }

    @Test
    @DisplayName("Should throw exception when portal email format is invalid")
    void testCreateCustomerInvalidPortalEmail() {
        assertThatThrownBy(() -> customerService.createCustomer("Acme Corp", 1L, null, "invalid-portal-email", null))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Invalid customer portal email format");
    }

    @Test
    @DisplayName("Should handle valid customer/team relationship")
    void testAssignToSalesTeam() {
        Customer customer = customerService.createCustomer("Stark Industries", null, null, null, null);
        SalesTeam team = new SalesTeam(7L, "Global Accounts");

        customerService.assignToSalesTeam(customer, team);

        assertThat(customer.getSalesTeamId()).isEqualTo(7L);
        assertThat(customerService.belongsToSalesTeam(customer, 7L)).isTrue();
        assertThat(customerService.isAssignedToSalesTeam(customer)).isTrue();

        customerService.removeFromSalesTeam(customer);
        assertThat(customer.getSalesTeamId()).isNull();
        assertThat(customerService.isAssignedToSalesTeam(customer)).isFalse();
    }

    @Test
    @DisplayName("Should preserve reference to discount tier without executing discount rules")
    void testDiscountTierReference() {
        Customer customer = customerService.createCustomer("Wayne Enterprises", 1L, null, null, null);
        assertThat(customerService.hasDiscountTier(customer)).isFalse();

        customerService.assignDiscountTier(customer, 3L);
        assertThat(customer.getDiscountTierId()).isEqualTo(3L);
        assertThat(customerService.hasDiscountTier(customer)).isTrue();

        customerService.removeDiscountTier(customer);
        assertThat(customer.getDiscountTierId()).isNull();
        assertThat(customerService.hasDiscountTier(customer)).isFalse();
    }

    @Test
    @DisplayName("Should throw exception for non-positive discount tier ID reference")
    void testInvalidDiscountTierReference() {
        Customer customer = customerService.createCustomer("Wayne Enterprises", 1L, null, null, null);

        assertThatThrownBy(() -> customerService.assignDiscountTier(customer, 0L))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Discount Tier ID must be a valid positive number");
    }
}
