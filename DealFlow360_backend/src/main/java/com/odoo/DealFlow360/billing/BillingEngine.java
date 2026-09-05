package com.odoo.DealFlow360.billing;

import com.odoo.DealFlow360.fulfillment.OrderLine;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Pure database-independent business engine handling hybrid order billing (separating one-time vs subscription lines),
 * invoice totals calculations, and payment verification.
 */
@Component
public class BillingEngine {

    public static class HybridBillingBreakdown {
        private final List<OrderLine> oneTimeLines;
        private final List<OrderLine> subscriptionLines;
        private final BigDecimal oneTimeTotal;
        private final BigDecimal subscriptionTotal;

        public HybridBillingBreakdown(List<OrderLine> oneTimeLines, List<OrderLine> subscriptionLines,
                                      BigDecimal oneTimeTotal, BigDecimal subscriptionTotal) {
            this.oneTimeLines = oneTimeLines;
            this.subscriptionLines = subscriptionLines;
            this.oneTimeTotal = oneTimeTotal;
            this.subscriptionTotal = subscriptionTotal;
        }

        public List<OrderLine> getOneTimeLines() { return oneTimeLines; }
        public List<OrderLine> getSubscriptionLines() { return subscriptionLines; }
        public BigDecimal getOneTimeTotal() { return oneTimeTotal; }
        public BigDecimal getSubscriptionTotal() { return subscriptionTotal; }
    }

    /**
     * Categorizes order lines into one-time product lines vs recurring subscription lines.
     */
    public HybridBillingBreakdown categorizeOrderLines(List<OrderLine> lines) {
        if (lines == null || lines.isEmpty()) {
            return new HybridBillingBreakdown(new ArrayList<>(), new ArrayList<>(), BigDecimal.ZERO, BigDecimal.ZERO);
        }

        List<OrderLine> oneTime = lines.stream()
                .filter(l -> l != null && (l.getIsSubscription() == null || !l.getIsSubscription()))
                .collect(Collectors.toList());

        List<OrderLine> recurring = lines.stream()
                .filter(l -> l != null && Boolean.TRUE.equals(l.getIsSubscription()))
                .collect(Collectors.toList());

        BigDecimal oneTimeTotal = oneTime.stream()
                .map(l -> l.getTotalAmount() != null ? l.getTotalAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal subscriptionTotal = recurring.stream()
                .map(l -> l.getTotalAmount() != null ? l.getTotalAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new HybridBillingBreakdown(oneTime, recurring, oneTimeTotal, subscriptionTotal);
    }

    /**
     * Resolves resulting invoice status based on total invoice amount and total payments recorded.
     */
    public String resolveInvoiceStatus(BigDecimal invoiceTotal, BigDecimal totalPaid) {
        if (invoiceTotal == null || invoiceTotal.compareTo(BigDecimal.ZERO) <= 0) {
            return "PAID";
        }
        if (totalPaid == null || totalPaid.compareTo(BigDecimal.ZERO) <= 0) {
            return "ISSUED";
        }
        if (totalPaid.compareTo(invoiceTotal) >= 0) {
            return "PAID";
        } else {
            return "PARTIALLY_PAID";
        }
    }
}
