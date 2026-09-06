package com.odoo.DealFlow360.approval;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ApprovalChainController {

    private final ApprovalService approvalService;
    private final com.odoo.DealFlow360.quotation.QuotationService quotationService;

    @Autowired
    public ApprovalChainController(ApprovalService approvalService,
                                   @Autowired(required = false) com.odoo.DealFlow360.quotation.QuotationService quotationService) {
        this.approvalService = approvalService;
        this.quotationService = quotationService;
    }

    public static class ApprovalRuleCreateRequest {
        public String name;
        public Long customerId;
        public Long tierId;
        public BigDecimal minDiscountPercent;
        public BigDecimal minTotalAmount;
    }

    public static class ApprovalDecisionRequest {
        public Long approverId;
        public String decisionReason;
    }

    // ----------------------------------------------------
    // APPROVAL CHAIN RULES ENDPOINTS
    // ----------------------------------------------------

    @GetMapping("/approval-rules")
    public ResponseEntity<?> getAllApprovalRules(
            @RequestParam(required = false) Long customerId,
            @RequestParam(required = false) Long tierId) {

        if (customerId != null) {
            return ResponseEntity.ok(approvalService.findApprovalChainRulesByCustomerId(customerId));
        }
        if (tierId != null) {
            return ResponseEntity.ok(approvalService.findApprovalChainRulesByTierId(tierId));
        }

        List<ApprovalChainRule> rules = approvalService.findAllApprovalChainRules();
        List<Map<String, Object>> mapped = rules.stream().map(this::mapRuleToResponse).toList();

        Map<String, Object> response = new HashMap<>();
        response.put("data", mapped);
        response.put("meta", Map.of("total", mapped.size(), "page", 1, "limit", 100, "totalPages", 1));
        return ResponseEntity.ok(response);
    }

    @GetMapping("/approval-rules/{id}")
    public ResponseEntity<?> getApprovalRuleById(@PathVariable Long id) {
        return approvalService.findApprovalChainRuleById(id)
                .map(r -> {
                    List<ApprovalChainStep> steps = approvalService.findApprovalChainStepsByRuleId(id);
                    Map<String, Object> res = mapRuleToResponse(r);
                    res.put("steps", steps);
                    return ResponseEntity.ok((Object) res);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/approval-rules")
    public ResponseEntity<?> createApprovalRule(@RequestBody ApprovalRuleCreateRequest request) {
        if (request == null || request.name == null || request.name.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Rule name is required");
        }

        try {
            ApprovalChainRule rule = new ApprovalChainRule(
                    null,
                    request.name.trim(),
                    request.customerId,
                    request.tierId,
                    request.minDiscountPercent,
                    request.minTotalAmount
            );
            ApprovalChainRule saved = approvalService.saveApprovalChainRule(rule);
            return ResponseEntity.status(HttpStatus.CREATED).body(mapRuleToResponse(saved));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/approval-rules/{id}")
    public ResponseEntity<?> updateApprovalRule(@PathVariable Long id, @RequestBody ApprovalRuleCreateRequest request) {
        return approvalService.findApprovalChainRuleById(id)
                .map(existing -> {
                    if (request.name != null && !request.name.trim().isEmpty()) {
                        existing.setName(request.name.trim());
                    }
                    if (request.customerId != null) {
                        existing.setCustomerId(request.customerId);
                    }
                    if (request.tierId != null) {
                        existing.setTierId(request.tierId);
                    }
                    if (request.minDiscountPercent != null) {
                        existing.setMinDiscountPercent(request.minDiscountPercent);
                    }
                    if (request.minTotalAmount != null) {
                        existing.setMinTotalAmount(request.minTotalAmount);
                    }
                    ApprovalChainRule updated = approvalService.saveApprovalChainRule(existing);
                    return ResponseEntity.ok((Object) mapRuleToResponse(updated));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/approval-rules/{id}")
    public ResponseEntity<?> deleteApprovalRule(@PathVariable Long id) {
        if (!approvalService.existsApprovalChainRuleById(id)) {
            return ResponseEntity.notFound().build();
        }
        approvalService.deleteApprovalChainRuleById(id);
        return ResponseEntity.ok(Map.of("message", "Approval rule deleted successfully"));
    }

    // ----------------------------------------------------
    // APPROVAL CHAIN STEPS ENDPOINTS
    // ----------------------------------------------------

    @GetMapping("/approval-rules/{ruleId}/steps")
    public ResponseEntity<List<ApprovalChainStep>> getApprovalSteps(@PathVariable Long ruleId) {
        return ResponseEntity.ok(approvalService.findApprovalChainStepsByRuleId(ruleId));
    }

    @PostMapping("/approval-rules/{ruleId}/steps")
    public ResponseEntity<?> createApprovalStep(@PathVariable Long ruleId, @RequestBody ApprovalChainStep step) {
        if (step == null) {
            return ResponseEntity.badRequest().body("Step data is required");
        }
        step.setRuleId(ruleId);
        try {
            ApprovalChainStep saved = approvalService.saveApprovalChainStep(step);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/approval-rules/steps/{stepId}")
    public ResponseEntity<?> deleteApprovalStep(@PathVariable Long stepId) {
        if (!approvalService.existsApprovalChainStepById(stepId)) {
            return ResponseEntity.notFound().build();
        }
        approvalService.deleteApprovalChainStepById(stepId);
        return ResponseEntity.ok(Map.of("message", "Approval step deleted successfully"));
    }

    // ----------------------------------------------------
    // APPROVAL EXECUTION & QUEUE ENDPOINTS
    // ----------------------------------------------------

    @GetMapping("/approvals")
    public ResponseEntity<List<Approval>> getAllApprovals(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long quotationId) {

        syncPendingApprovalsForQuotations();

        if (quotationId != null) {
            return ResponseEntity.ok(approvalService.findApprovalsByQuotationId(quotationId));
        }
        if (status != null && !status.trim().isEmpty()) {
            return ResponseEntity.ok(approvalService.findApprovalsByStatus(status.toUpperCase()));
        }

        return ResponseEntity.ok(approvalService.findAllApprovals());
    }

    @GetMapping("/approvals/pending")
    public ResponseEntity<List<Approval>> getPendingApprovals() {
        syncPendingApprovalsForQuotations();
        return ResponseEntity.ok(approvalService.findApprovalsByStatus("PENDING"));
    }

    private void syncPendingApprovalsForQuotations() {
        if (quotationService != null && approvalService != null) {
            try {
                List<com.odoo.DealFlow360.quotation.Quotation> pendingQuotes = quotationService.findAllQuotations().stream()
                        .filter(q -> "PENDING_APPROVAL".equalsIgnoreCase(q.getStatus()))
                        .toList();
                List<Approval> existing = approvalService.findAllApprovals();

                for (var q : pendingQuotes) {
                    boolean hasPending = existing.stream()
                            .anyMatch(a -> q.getId().equals(a.getQuotationId()) && "PENDING".equalsIgnoreCase(a.getStatus()));
                    if (!hasPending) {
                        Approval newApproval = approvalService.createPendingApproval(null, q.getId(), null, 1);
                        approvalService.saveApproval(newApproval);
                    }
                }
            } catch (Exception ignored) {}
        }
    }

    @PostMapping("/approvals/{id}/approve")
    public ResponseEntity<?> approveRecord(@PathVariable Long id, @RequestBody(required = false) ApprovalDecisionRequest request) {
        return approvalService.findApprovalById(id)
                .map(approval -> {
                    Long approverId = request != null ? request.approverId : null;
                    String reason = request != null ? request.decisionReason : "Approved via API";
                    try {
                        approvalService.approveRecord(approval, approverId, reason);
                        if (approval.getQuotationId() != null && quotationService != null) {
                            quotationService.findQuotationById(approval.getQuotationId()).ifPresent(q -> {
                                quotationService.changeQuotationStatus(q, "APPROVED");
                                quotationService.saveQuotation(q);
                            });
                        }
                        return ResponseEntity.ok((Object) approval);
                    } catch (Exception e) {
                        return ResponseEntity.badRequest().body(e.getMessage());
                    }
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/approvals/{id}/reject")
    public ResponseEntity<?> rejectRecord(@PathVariable Long id, @RequestBody(required = false) ApprovalDecisionRequest request) {
        return approvalService.findApprovalById(id)
                .map(approval -> {
                    Long approverId = request != null ? request.approverId : null;
                    String reason = request != null ? request.decisionReason : "Rejected via API";
                    try {
                        approvalService.rejectRecord(approval, approverId, reason);
                        if (approval.getQuotationId() != null && quotationService != null) {
                            quotationService.findQuotationById(approval.getQuotationId()).ifPresent(q -> {
                                quotationService.changeQuotationStatus(q, "REJECTED");
                                quotationService.saveQuotation(q);
                            });
                        }
                        return ResponseEntity.ok((Object) approval);
                    } catch (Exception e) {
                        return ResponseEntity.badRequest().body(e.getMessage());
                    }
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/approvals/{id}/return")
    public ResponseEntity<?> returnRecord(@PathVariable Long id, @RequestBody(required = false) ApprovalDecisionRequest request) {
        return approvalService.findApprovalById(id)
                .map(approval -> {
                    Long approverId = request != null ? request.approverId : null;
                    String reason = request != null ? request.decisionReason : "Returned for revision via API";
                    try {
                        approval.setStatus("REJECTED");
                        approval.setApproverId(approverId);
                        approval.setDecisionReason(reason);
                        approval.setDecidedAt(java.time.Instant.now());
                        approvalService.saveApproval(approval);
                        if (approval.getQuotationId() != null && quotationService != null) {
                            quotationService.findQuotationById(approval.getQuotationId()).ifPresent(q -> {
                                quotationService.changeQuotationStatus(q, "REVISION_REQUIRED");
                                quotationService.saveQuotation(q);
                            });
                        }
                        return ResponseEntity.ok((Object) approval);
                    } catch (Exception e) {
                        return ResponseEntity.badRequest().body(e.getMessage());
                    }
                })
                .orElse(ResponseEntity.notFound().build());
    }

    private Map<String, Object> mapRuleToResponse(ApprovalChainRule r) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", r.getId().toString());
        map.put("dbId", r.getId());
        map.put("ruleId", r.getId().toString());
        map.put("name", r.getName());
        map.put("customerId", r.getCustomerId());
        map.put("tierId", r.getTierId());
        map.put("minDiscountPercent", r.getMinDiscountPercent());
        map.put("minTotalAmount", r.getMinTotalAmount());
        map.put("status", "ACTIVE");
        return map;
    }
}
