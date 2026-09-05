package com.odoo.DealFlow360.customer;

import java.time.Instant;
import java.util.Objects;

/**
 * Domain model representing a Customer in the system (CUSTOMERS table).
 */
public class Customer {

    private Long id;
    private String companyName;
    private Long salesTeamId;
    private Long discountTierId;
    private String portalEmail;
    private String portalPasswordHash;
    private Instant createdAt;

    public Customer() {
    }

    public Customer(Long id, String companyName, Long salesTeamId, Long discountTierId, String portalEmail, String portalPasswordHash, Instant createdAt) {
        this.id = id;
        this.companyName = companyName;
        this.salesTeamId = salesTeamId;
        this.discountTierId = discountTierId;
        this.portalEmail = portalEmail;
        this.portalPasswordHash = portalPasswordHash;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public Long getSalesTeamId() {
        return salesTeamId;
    }

    public void setSalesTeamId(Long salesTeamId) {
        this.salesTeamId = salesTeamId;
    }

    public Long getDiscountTierId() {
        return discountTierId;
    }

    public void setDiscountTierId(Long discountTierId) {
        this.discountTierId = discountTierId;
    }

    public String getPortalEmail() {
        return portalEmail;
    }

    public void setPortalEmail(String portalEmail) {
        this.portalEmail = portalEmail;
    }

    public String getPortalPasswordHash() {
        return portalPasswordHash;
    }

    public void setPortalPasswordHash(String portalPasswordHash) {
        this.portalPasswordHash = portalPasswordHash;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Customer customer = (Customer) o;
        return Objects.equals(id, customer.id) &&
               Objects.equals(companyName, customer.companyName) &&
               Objects.equals(salesTeamId, customer.salesTeamId) &&
               Objects.equals(discountTierId, customer.discountTierId) &&
               Objects.equals(portalEmail, customer.portalEmail) &&
               Objects.equals(portalPasswordHash, customer.portalPasswordHash) &&
               Objects.equals(createdAt, customer.createdAt);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, companyName, salesTeamId, discountTierId, portalEmail, portalPasswordHash, createdAt);
    }

    @Override
    public String toString() {
        return "Customer{" +
               "id=" + id +
               ", companyName='" + companyName + '\'' +
               ", salesTeamId=" + salesTeamId +
               ", discountTierId=" + discountTierId +
               ", portalEmail='" + portalEmail + '\'' +
               ", createdAt=" + createdAt +
               '}';
    }
}
