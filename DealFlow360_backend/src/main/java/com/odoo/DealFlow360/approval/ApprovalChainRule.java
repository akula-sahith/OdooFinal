package com.odoo.DealFlow360.approval;

import java.math.BigDecimal;
import java.util.Objects;

/**
 * Domain model representing approval chain applicability rules (APPROVAL_CHAIN_RULES table).
 */
public class ApprovalChainRule {

    private Long id;
    private String name;
    private Long customerId;
    private Long tierId;
    private BigDecimal minDiscountPercent;
    private BigDecimal minTotalAmount;

    public ApprovalChainRule() {
    }

    public ApprovalChainRule(Long id, String name, Long customerId, Long tierId,
                              BigDecimal minDiscountPercent, BigDecimal minTotalAmount) {
        this.id = id;
        this.name = name;
        this.customerId = customerId;
        this.tierId = tierId;
        this.minDiscountPercent = minDiscountPercent;
        this.minTotalAmount = minTotalAmount;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public Long getTierId() {
        return tierId;
    }

    public void setTierId(Long tierId) {
        this.tierId = tierId;
    }

    public BigDecimal getMinDiscountPercent() {
        return minDiscountPercent;
    }

    public void setMinDiscountPercent(BigDecimal minDiscountPercent) {
        this.minDiscountPercent = minDiscountPercent;
    }

    public BigDecimal getMinTotalAmount() {
        return minTotalAmount;
    }

    public void setMinTotalAmount(BigDecimal minTotalAmount) {
        this.minTotalAmount = minTotalAmount;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ApprovalChainRule that = (ApprovalChainRule) o;
        return Objects.equals(id, that.id) &&
               Objects.equals(name, that.name) &&
               Objects.equals(customerId, that.customerId) &&
               Objects.equals(tierId, that.tierId) &&
               Objects.equals(minDiscountPercent, that.minDiscountPercent) &&
               Objects.equals(minTotalAmount, that.minTotalAmount);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, customerId, tierId, minDiscountPercent, minTotalAmount);
    }

    @Override
    public String toString() {
        return "ApprovalChainRule{" +
               "id=" + id +
               ", name='" + name + '\'' +
               ", customerId=" + customerId +
               ", tierId=" + tierId +
               ", minDiscountPercent=" + minDiscountPercent +
               ", minTotalAmount=" + minTotalAmount +
               '}';
    }
}
