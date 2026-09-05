package com.odoo.DealFlow360.pricing;

import java.time.Instant;
import java.util.Objects;

/**
 * Domain model representing a Price List in the system (PRICE_LISTS table).
 */
public class PriceList {

    private Long id;
    private Long discountTierId;
    private String currency;
    private Instant validFrom;
    private Instant validTo;

    public PriceList() {
    }

    public PriceList(Long id, Long discountTierId, String currency, Instant validFrom, Instant validTo) {
        this.id = id;
        this.discountTierId = discountTierId;
        this.currency = currency;
        this.validFrom = validFrom;
        this.validTo = validTo;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getDiscountTierId() {
        return discountTierId;
    }

    public void setDiscountTierId(Long discountTierId) {
        this.discountTierId = discountTierId;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public Instant getValidFrom() {
        return validFrom;
    }

    public void setValidFrom(Instant validFrom) {
        this.validFrom = validFrom;
    }

    public Instant getValidTo() {
        return validTo;
    }

    public void setValidTo(Instant validTo) {
        this.validTo = validTo;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        PriceList priceList = (PriceList) o;
        return Objects.equals(id, priceList.id) &&
               Objects.equals(discountTierId, priceList.discountTierId) &&
               Objects.equals(currency, priceList.currency) &&
               Objects.equals(validFrom, priceList.validFrom) &&
               Objects.equals(validTo, priceList.validTo);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, discountTierId, currency, validFrom, validTo);
    }

    @Override
    public String toString() {
        return "PriceList{" +
               "id=" + id +
               ", discountTierId=" + discountTierId +
               ", currency='" + currency + '\'' +
               ", validFrom=" + validFrom +
               ", validTo=" + validTo +
               '}';
    }
}
