package com.odoo.DealFlow360.customer;

import java.util.Objects;

/**
 * Domain model representing a Customer Contact in the system (CUSTOMER_CONTACTS table).
 */
public class CustomerContact {

    private Long id;
    private Long customerId;
    private String name;
    private String email;
    private String phone;
    private String status;

    public CustomerContact() {
    }

    public CustomerContact(Long id, Long customerId, String name, String email, String phone, String status) {
        this.id = id;
        this.customerId = customerId;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        CustomerContact contact = (CustomerContact) o;
        return Objects.equals(id, contact.id) &&
               Objects.equals(customerId, contact.customerId) &&
               Objects.equals(name, contact.name) &&
               Objects.equals(email, contact.email) &&
               Objects.equals(phone, contact.phone) &&
               Objects.equals(status, contact.status);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, customerId, name, email, phone, status);
    }

    @Override
    public String toString() {
        return "CustomerContact{" +
               "id=" + id +
               ", customerId=" + customerId +
               ", name='" + name + '\'' +
               ", email='" + email + '\'' +
               ", phone='" + phone + '\'' +
               ", status='" + status + '\'' +
               '}';
    }
}
