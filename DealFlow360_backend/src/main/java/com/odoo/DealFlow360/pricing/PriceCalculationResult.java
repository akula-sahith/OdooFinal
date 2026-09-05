package com.odoo.DealFlow360.pricing;

import java.math.BigDecimal;
import java.util.Objects;

/**
 * Result value object representing the output of a pricing calculation performed by PricingEngine.
 */
public class PriceCalculationResult {

    private final Long productId;
    private final Long productVariantId;
    private final Long priceListId;
    private final Integer quantity;
    private final BigDecimal unitPrice;
    private final BigDecimal netAmount;
    private final BigDecimal taxAmount;
    private final BigDecimal grossAmount;
    private final String currency;

    public PriceCalculationResult(Long productId, Long productVariantId, Long priceListId, Integer quantity, BigDecimal unitPrice, BigDecimal netAmount, BigDecimal taxAmount, BigDecimal grossAmount, String currency) {
        this.productId = productId;
        this.productVariantId = productVariantId;
        this.priceListId = priceListId;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.netAmount = netAmount;
        this.taxAmount = taxAmount;
        this.grossAmount = grossAmount;
        this.currency = currency;
    }

    public Long getProductId() {
        return productId;
    }

    public Long getProductVariantId() {
        return productVariantId;
    }

    public Long getPriceListId() {
        return priceListId;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public BigDecimal getUnitPrice() {
        return unitPrice;
    }

    public BigDecimal getNetAmount() {
        return netAmount;
    }

    public BigDecimal getTaxAmount() {
        return taxAmount;
    }

    public BigDecimal getGrossAmount() {
        return grossAmount;
    }

    public String getCurrency() {
        return currency;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        PriceCalculationResult that = (PriceCalculationResult) o;
        return Objects.equals(productId, that.productId) &&
               Objects.equals(productVariantId, that.productVariantId) &&
               Objects.equals(priceListId, that.priceListId) &&
               Objects.equals(quantity, that.quantity) &&
               Objects.equals(unitPrice, that.unitPrice) &&
               Objects.equals(netAmount, that.netAmount) &&
               Objects.equals(taxAmount, that.taxAmount) &&
               Objects.equals(grossAmount, that.grossAmount) &&
               Objects.equals(currency, that.currency);
    }

    @Override
    public int hashCode() {
        return Objects.hash(productId, productVariantId, priceListId, quantity, unitPrice, netAmount, taxAmount, grossAmount, currency);
    }

    @Override
    public String toString() {
        return "PriceCalculationResult{" +
               "productId=" + productId +
               ", productVariantId=" + productVariantId +
               ", priceListId=" + priceListId +
               ", quantity=" + quantity +
               ", unitPrice=" + unitPrice +
               ", netAmount=" + netAmount +
               ", taxAmount=" + taxAmount +
               ", grossAmount=" + grossAmount +
               ", currency='" + currency + '\'' +
               '}';
    }
}
