package com.odoo.DealFlow360.dealhealth;

import com.odoo.DealFlow360.quotation.Quotation;
import com.odoo.DealFlow360.quotation.QuotationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

/**
 * Service managing Deal Health Anomaly Alerts and automated escalation nudges.
 */
@Service
public class DealHealthService {

    private final DealHealthEngine dealHealthEngine;
    private final QuotationService quotationService;
    private final DealHealthAlertRepository alertRepository;

    public DealHealthService() {
        this(new DealHealthEngine(), null, null);
    }

    @Autowired
    public DealHealthService(DealHealthEngine dealHealthEngine,
                             QuotationService quotationService,
                             DealHealthAlertRepository alertRepository) {
        this.dealHealthEngine = dealHealthEngine != null ? dealHealthEngine : new DealHealthEngine();
        this.quotationService = quotationService;
        this.alertRepository = alertRepository;
    }

    @Transactional
    public Optional<DealHealthAlert> evaluateQuotationHealth(Quotation quotation, int maxInactiveDays, BigDecimal repAvgDiscount) {
        if (quotation == null || quotation.getId() == null) {
            return Optional.empty();
        }

        Instant now = Instant.now();
        boolean stalled = dealHealthEngine.isStalledDeal(quotation.getUpdatedAt(), maxInactiveDays, now);
        if (stalled) {
            DealHealthAlert alert = new DealHealthAlert(null, quotation.getId(), "STALLED_DEAL", "HIGH", "ACTIVE", now, null);
            if (alertRepository != null) {
                alert = alertRepository.save(alert);
            }
            return Optional.of(alert);
        }

        return Optional.empty();
    }

    @Transactional
    public DealHealthAlert resolveAlert(Long alertId) {
        DealHealthAlert alert = findById(alertId)
                .orElseThrow(() -> new IllegalArgumentException("Deal health alert not found with ID: " + alertId));

        alert.setStatus("RESOLVED");
        alert.setResolvedAt(Instant.now());
        if (alertRepository != null) {
            return alertRepository.save(alert);
        }
        return alert;
    }

    public Optional<DealHealthAlert> findById(Long id) {
        if (alertRepository != null && id != null) {
            return alertRepository.findById(id);
        }
        return Optional.empty();
    }

    public List<DealHealthAlert> findAlertsByQuotationId(Long quotationId) {
        if (alertRepository != null && quotationId != null) {
            return alertRepository.findByQuotationId(quotationId);
        }
        return Collections.emptyList();
    }

    public List<DealHealthAlert> findAlertsByStatus(String status) {
        if (alertRepository != null && status != null) {
            return alertRepository.findByStatus(status);
        }
        return Collections.emptyList();
    }

    public List<DealHealthAlert> findAllAlerts() {
        if (alertRepository != null) {
            return alertRepository.findAll();
        }
        return Collections.emptyList();
    }
}
