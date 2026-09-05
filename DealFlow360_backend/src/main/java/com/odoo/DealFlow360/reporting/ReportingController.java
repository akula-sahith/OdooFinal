package com.odoo.DealFlow360.reporting;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reporting")
public class ReportingController {

    private final ReportingService reportingService;

    @Autowired
    public ReportingController(ReportingService reportingService) {
        this.reportingService = reportingService;
    }

    @GetMapping("/sales-performance")
    public ResponseEntity<Map<String, Object>> getSalesPerformance(@RequestParam(required = false) Long teamId) {
        return ResponseEntity.ok(reportingService.getSalesPerformanceSummary(null, null, teamId, null));
    }

    @GetMapping("/quotations-by-status")
    public ResponseEntity<List<Map<String, Object>>> getQuotationsByStatus(@RequestParam(defaultValue = "PENDING_APPROVAL") String status) {
        return ResponseEntity.ok(reportingService.getQuotationsByApprovalStatus(status));
    }

    @GetMapping("/product-performance")
    public ResponseEntity<List<Map<String, Object>>> getProductPerformance(@RequestParam(required = false) Long categoryId) {
        return ResponseEntity.ok(reportingService.getProductPerformanceReport(categoryId));
    }
}
