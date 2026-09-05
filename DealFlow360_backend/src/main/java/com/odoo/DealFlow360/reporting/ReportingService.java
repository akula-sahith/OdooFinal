package com.odoo.DealFlow360.reporting;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Collections;
import java.util.List;
import java.util.Map;

/**
 * Service orchestrating reporting dashboard queries and analytics filters.
 */
@Service
public class ReportingService {

    private final ReportingRepository reportingRepository;

    @Autowired
    public ReportingService(ReportingRepository reportingRepository) {
        this.reportingRepository = reportingRepository;
    }

    public Map<String, Object> getSalesPerformanceSummary(Instant fromDate, Instant toDate, Long teamId, Long repId) {
        if (reportingRepository != null) {
            return reportingRepository.getSalesPerformanceSummary(fromDate, toDate, teamId, repId);
        }
        return Collections.emptyMap();
    }

    public List<Map<String, Object>> getQuotationsByApprovalStatus(String approvalStatus) {
        if (reportingRepository != null && approvalStatus != null) {
            return reportingRepository.getQuotationsByApprovalStatus(approvalStatus.trim().toUpperCase());
        }
        return Collections.emptyList();
    }

    public List<Map<String, Object>> getProductPerformanceReport(Long categoryId) {
        if (reportingRepository != null) {
            return reportingRepository.getProductPerformanceReport(categoryId);
        }
        return Collections.emptyList();
    }
}
