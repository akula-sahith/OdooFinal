package com.odoo.DealFlow360.billing;

import com.odoo.DealFlow360.fulfillment.Order;
import com.odoo.DealFlow360.fulfillment.OrderLine;
import com.odoo.DealFlow360.fulfillment.OrderRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

/**
 * Service managing Invoices, Payments, Credit Notes, and Hybrid Order Billing.
 */
@Service
public class BillingService {

    private final BillingEngine billingEngine;
    private final OrderRepository orderRepository;
    private final InvoiceRepository invoiceRepository;
    private final PaymentRepository paymentRepository;
    private final CreditNoteRepository creditNoteRepository;

    public BillingService() {
        this(new BillingEngine(), null, null, null, null);
    }

    @Autowired
    public BillingService(BillingEngine billingEngine,
                          OrderRepository orderRepository,
                          InvoiceRepository invoiceRepository,
                          PaymentRepository paymentRepository,
                          CreditNoteRepository creditNoteRepository) {
        this.billingEngine = billingEngine != null ? billingEngine : new BillingEngine();
        this.orderRepository = orderRepository;
        this.invoiceRepository = invoiceRepository;
        this.paymentRepository = paymentRepository;
        this.creditNoteRepository = creditNoteRepository;
    }

    /**
     * Creates an Invoice for upfront one-time lines of a hybrid order.
     */
    @Transactional
    public Invoice createInvoiceForOrder(Order order, List<OrderLine> lines) {
        if (order == null) {
            throw new IllegalArgumentException("Order cannot be null");
        }

        BillingEngine.HybridBillingBreakdown breakdown = billingEngine.categorizeOrderLines(lines);

        BigDecimal subtotal = breakdown.getOneTimeTotal();
        BigDecimal tax = subtotal.multiply(new BigDecimal("0.10")).setScale(2, java.math.RoundingMode.HALF_UP);
        BigDecimal total = subtotal.add(tax);

        Instant now = Instant.now();
        Invoice invoice = new Invoice(
                null,
                order.getId(),
                order.getCustomerId(),
                "ISSUED",
                subtotal,
                tax,
                total,
                now.plusSeconds(30 * 24 * 3600), // 30 days due
                now
        );

        if (invoiceRepository != null) {
            invoice = invoiceRepository.save(invoice);
        } else {
            invoice.setId(1L);
        }

        return invoice;
    }

    @Transactional
    public Payment recordPayment(Long invoiceId, String paymentMethod, BigDecimal amount, String reference) {
        if (invoiceId == null || invoiceId <= 0) {
            throw new IllegalArgumentException("Invoice ID must be positive");
        }
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Payment amount must be positive (> 0)");
        }

        Invoice invoice = findInvoiceById(invoiceId)
                .orElseThrow(() -> new IllegalArgumentException("Invoice not found with ID: " + invoiceId));

        Payment payment = new Payment(null, invoiceId, paymentMethod != null ? paymentMethod : "CREDIT_CARD", amount, "SUCCESS", reference, Instant.now());
        if (paymentRepository != null) {
            payment = paymentRepository.save(payment);
        } else {
            payment.setId(1L);
        }

        List<Payment> allPayments = findPaymentsByInvoiceId(invoiceId);
        BigDecimal totalPaid = allPayments.stream()
                .filter(p -> "SUCCESS".equalsIgnoreCase(p.getStatus()))
                .map(Payment::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        String newStatus = billingEngine.resolveInvoiceStatus(invoice.getTotalAmount(), totalPaid);
        invoice.setStatus(newStatus);
        if (invoiceRepository != null) {
            invoiceRepository.save(invoice);
        }

        return payment;
    }

    @Transactional
    public CreditNote issueCreditNote(Long invoiceId, BigDecimal amount, String reason) {
        if (invoiceId == null || invoiceId <= 0) {
            throw new IllegalArgumentException("Invoice ID must be positive");
        }
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Credit note amount must be positive (> 0)");
        }
        if (reason == null || reason.trim().isEmpty()) {
            throw new IllegalArgumentException("Reason cannot be null or blank");
        }

        CreditNote cn = new CreditNote(null, invoiceId, amount, reason.trim(), BigDecimal.ZERO, Instant.now());
        if (creditNoteRepository != null) {
            return creditNoteRepository.save(cn);
        }
        return cn;
    }

    public Optional<Invoice> findInvoiceById(Long id) {
        if (invoiceRepository != null && id != null) {
            return invoiceRepository.findById(id);
        }
        return Optional.empty();
    }

    public List<Invoice> findInvoicesByCustomerId(Long customerId) {
        if (invoiceRepository != null && customerId != null) {
            return invoiceRepository.findByCustomerId(customerId);
        }
        return Collections.emptyList();
    }

    public List<Payment> findPaymentsByInvoiceId(Long invoiceId) {
        if (paymentRepository != null && invoiceId != null) {
            return paymentRepository.findByInvoiceId(invoiceId);
        }
        return Collections.emptyList();
    }

    public List<CreditNote> findCreditNotesByInvoiceId(Long invoiceId) {
        if (creditNoteRepository != null && invoiceId != null) {
            return creditNoteRepository.findByInvoiceId(invoiceId);
        }
        return Collections.emptyList();
    }
}
