package com.odoo.DealFlow360.quotation;

import java.math.BigDecimal;
import java.util.Objects;

/**
 * Domain model representing a Quotation Line in the system (QUOTATION_LINES table).
 */
public class QuotationLine {

    private Long id;
    private Long quotationId;
    private Long productId;
    private Long productVariantId;
    private Integer quantity;
    private BigDecimal unitPrice;
    private BigDecimal taxPercent;
    private BigDecimal subtotalAmount;
    private BigDecimal taxAmount;
    private BigDecimal totalAmount;

    public QuotationLine() {
    }

    public QuotationLine(Long id, Long quotationId, Long productId, Long productVariantId,
                         Integer quantity, BigDecimal unitPrice, BigDecimal taxPercent,
                         BigDecimal subtotalAmount, BigDecimal taxAmount, BigDecimal totalAmount) {
        this.id = id;
        this.quotationId = quotationId;
        this.productId = productId;
        this.productVariantId = productVariantId;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.taxPercent = taxPercent;
        this.subtotalAmount = subtotalAmount;
        this.taxAmount = taxAmount;
        this.totalAmount = totalAmount;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getQuotationId() {
        return quotationId;
    }

    public void setQuotationId(Long quotationId) {
        this.quotationId = quotationId;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public Long getProductVariantId() {
        return productVariantId;
    }

    public void setProductVariantId(Long productVariantId) {
        this.productVariantId = productVariantId;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(BigDecimal unitPrice) {
        this.unitPrice = unitPrice;
    }

    public BigDecimal getTaxPercent() {
        return taxPercent;
    }

    public void setTaxPercent(BigDecimal taxPercent) {
        this.taxPercent = taxPercent;
    }

    public BigDecimal getSubtotalAmount() {
        return subtotalAmount;
    }

    public void setSubtotalAmount(BigDecimal subtotalAmount) {
        this.subtotalAmount = subtotalAmount;
    }

    public BigDecimal getTaxAmount() {
        return taxAmount;
    }

    public void setTaxAmount(BigDecimal taxAmount) {
        this.taxAmount = taxAmount;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        QuotationLine that = (QuotationLine) o;
        return Objects.equals(id, that.id) &&
               Objects.equals(quotationId, that.quotationId) &&
               Objects.equals(productId, that.productId) &&
               Objects.equals(productVariantId, that.productVariantId) &&
               Objects.equals(quantity, that.quantity) &&
               Objects.equals(unitPrice, that.unitPrice) &&
               Objects.equals(taxPercent, that.taxPercent) &&
               Objects.equals(subtotalAmount, that.subtotalAmount) &&
               Objects.equals(taxAmount, that.taxAmount) &&
               Objects.equals(totalAmount, that.totalAmount);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, quotationId, productId, productVariantId, quantity, unitPrice, taxPercent, subtotalAmount, taxAmount, totalAmount);
    }

    @Override
    public String toString() {
        return "QuotationLine{" +
               "id=" + id +
               ", quotationId=" + quotationId +
               ", productId=" + productId +
               ", productVariantId=" + productVariantId +
               ", quantity=" + quantity +
               ", unitPrice=" + unitPrice +
               ", taxPercent=" + taxPercent +
               ", subtotalAmount=" + subtotalAmount +
               ", taxAmount=" + taxAmount +
               ", totalAmount=" + totalAmount +
               '}';
    }
}
