package com.odoo.DealFlow360.subscription;

import java.util.Objects;

/**
 * Domain model representing a Subscription Plan (SUBSCRIPTION_PLANS table).
 */
public class SubscriptionPlan {

    private Long id;
    private Long productId;
    private String name;
    private String billingCycle; // MONTHLY, QUARTERLY, YEARLY
    private String prorationRule; // EXACT_DAY, FULL_MONTH
    private String cancellationRefundRule; // PRO_RATA, NO_REFUND

    public SubscriptionPlan() {
    }

    public SubscriptionPlan(Long id, Long productId, String name, String billingCycle,
                            String prorationRule, String cancellationRefundRule) {
        this.id = id;
        this.productId = productId;
        this.name = name;
        this.billingCycle = billingCycle;
        this.prorationRule = prorationRule;
        this.cancellationRefundRule = cancellationRefundRule;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getBillingCycle() {
        return billingCycle;
    }

    public void setBillingCycle(String billingCycle) {
        this.billingCycle = billingCycle;
    }

    public String getProrationRule() {
        return prorationRule;
    }

    public void setProrationRule(String prorationRule) {
        this.prorationRule = prorationRule;
    }

    public String getCancellationRefundRule() {
        return cancellationRefundRule;
    }

    public void setCancellationRefundRule(String cancellationRefundRule) {
        this.cancellationRefundRule = cancellationRefundRule;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        SubscriptionPlan that = (SubscriptionPlan) o;
        return Objects.equals(id, that.id) &&
               Objects.equals(productId, that.productId) &&
               Objects.equals(name, that.name) &&
               Objects.equals(billingCycle, that.billingCycle) &&
               Objects.equals(prorationRule, that.prorationRule) &&
               Objects.equals(cancellationRefundRule, that.cancellationRefundRule);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, productId, name, billingCycle, prorationRule, cancellationRefundRule);
    }

    @Override
    public String toString() {
        return "SubscriptionPlan{" +
               "id=" + id +
               ", productId=" + productId +
               ", name='" + name + '\'' +
               ", billingCycle='" + billingCycle + '\'' +
               ", prorationRule='" + prorationRule + '\'' +
               ", cancellationRefundRule='" + cancellationRefundRule + '\'' +
               '}';
    }
}
