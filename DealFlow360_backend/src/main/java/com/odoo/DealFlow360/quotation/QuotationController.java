package com.odoo.DealFlow360.quotation;

import com.odoo.DealFlow360.approval.ApprovalRouteResult;
import com.odoo.DealFlow360.approval.ApprovalService;
import com.odoo.DealFlow360.discount.DiscountLineRiskResult;
import com.odoo.DealFlow360.discount.DiscountRiskResult;
import com.odoo.DealFlow360.discount.DiscountService;
import com.odoo.DealFlow360.recommendation.RecommendationService;
import com.odoo.DealFlow360.recommendation.UpsellRule;
import com.odoo.DealFlow360.pricing.PriceList;
import com.odoo.DealFlow360.pricing.PriceListItemService;
import com.odoo.DealFlow360.pricing.PriceListService;
import com.odoo.DealFlow360.product.ProductService;
import com.odoo.DealFlow360.product.ProductVariantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("/api/quotations")
public class QuotationController {

    private final QuotationService quotationService;
    private final DiscountService discountService;
    private final ApprovalService approvalService;
    private final RecommendationService recommendationService;
    private final ProductService productService;
    private final ProductVariantService productVariantService;
    private final PriceListService priceListService;
    private final PriceListItemService priceListItemService;

    @Autowired
    public QuotationController(QuotationService quotationService,
                               DiscountService discountService,
                               ApprovalService approvalService,
                               RecommendationService recommendationService,
                               ProductService productService,
                               ProductVariantService productVariantService,
                               PriceListService priceListService,
                               PriceListItemService priceListItemService) {
        this.quotationService = quotationService;
        this.discountService = discountService;
        this.approvalService = approvalService;
        this.recommendationService = recommendationService;
        this.productService = productService;
        this.productVariantService = productVariantService;
        this.priceListService = priceListService;
        this.priceListItemService = priceListItemService;
    }

    public static class CreateQuotationRequest {
        public Long customerId;
        public Long priceListId;
        public String currency;
    }

    @PostMapping
    public ResponseEntity<?> createQuotation(@RequestBody CreateQuotationRequest request) {
        if (request == null || request.customerId == null || request.customerId <= 0) {
            return ResponseEntity.badRequest().body("Positive customer ID is required");
        }
        try {
            Long plId = request.priceListId != null ? request.priceListId : 1L;
            Quotation quotation = quotationService.createQuotation(null, request.customerId, plId, request.currency);
            quotation = quotationService.saveQuotation(quotation);
            return ResponseEntity.status(HttpStatus.CREATED).body(quotation);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<Quotation>> getAllQuotations() {
        return ResponseEntity.ok(quotationService.findAllQuotations());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getQuotationById(@PathVariable Long id) {
        return quotationService.findQuotationById(id)
                .map(quotation -> {
                    List<QuotationLine> lines = quotationService.findLinesByQuotationId(id);
                    Map<String, Object> response = new HashMap<>();
                    response.put("quotation", quotation);
                    response.put("lines", lines);
                    return ResponseEntity.ok((Object) response);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    public static class AddLineRequest {
        public Long productId;
        public Long productVariantId;
        public Integer quantity;
        public BigDecimal unitPrice;
    }

    @PostMapping("/{id}/lines")
    public ResponseEntity<?> addLine(@PathVariable Long id, @RequestBody AddLineRequest request) {
        return quotationService.findQuotationById(id)
                .map(quotation -> {
                    if (request == null || request.productId == null) {
                        return ResponseEntity.badRequest().body("Product ID is required");
                    }
                    Long priceListId = quotation.getPriceListId() != null ? quotation.getPriceListId() : 1L;
                    int qty = (request.quantity != null && request.quantity > 0) ? request.quantity : 1;
                    var product = productService.findProductById(request.productId)
                            .orElseThrow(() -> new IllegalArgumentException("Product not found"));
                    var variant = request.productVariantId == null ? null : productVariantService.findVariantById(request.productVariantId)
                            .orElseThrow(() -> new IllegalArgumentException("Product variant not found"));
                    BigDecimal unitPrice = request.unitPrice != null ? request.unitPrice : (product.getBasePrice() != null ? product.getBasePrice() : BigDecimal.ZERO);
                    BigDecimal sub = unitPrice.multiply(BigDecimal.valueOf(qty));
                    BigDecimal taxPercent = product.getTaxPercent() != null ? product.getTaxPercent() : BigDecimal.ZERO;
                    BigDecimal taxAmount = sub.multiply(taxPercent).divide(BigDecimal.valueOf(100), 2, java.math.RoundingMode.HALF_UP);
                    BigDecimal total = sub.add(taxAmount);

                    QuotationLine line = new QuotationLine(null, id, product.getId(), request.productVariantId, qty, unitPrice, taxPercent, sub, taxAmount, total);
                    QuotationLine savedLine = quotationService.saveQuotationLine(line);

                    List<QuotationLine> lines = quotationService.findLinesByQuotationId(id);
                    quotationService.recalculateQuotationTotals(quotation, lines);
                    quotationService.saveQuotation(quotation);

                    return ResponseEntity.status(HttpStatus.CREATED).body(savedLine);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/lines/{lineId}")
    public ResponseEntity<?> updateLine(@PathVariable Long id, @PathVariable Long lineId, @RequestBody AddLineRequest request) {
        return quotationService.findQuotationById(id)
                .map(quotation -> {
                    try {
                        QuotationLine line = quotationService.findQuotationLineById(lineId).orElse(null);
                        if (line == null) {
                            return ResponseEntity.notFound().build();
                        }
                        if (request != null && request.quantity != null && request.quantity > 0) {
                            line.setQuantity(request.quantity);
                        }
                        if (request != null && request.unitPrice != null && request.unitPrice.compareTo(BigDecimal.ZERO) >= 0) {
                            BigDecimal roundedUnitPrice = request.unitPrice.setScale(2, java.math.RoundingMode.HALF_UP);
                            line.setUnitPrice(roundedUnitPrice);
                        }
                        BigDecimal sub = line.getUnitPrice().multiply(BigDecimal.valueOf(line.getQuantity()));
                        line.setSubtotalAmount(sub);
                        BigDecimal taxPercent = line.getTaxPercent() != null ? line.getTaxPercent() : BigDecimal.ZERO;
                        BigDecimal taxAmount = sub.multiply(taxPercent).divide(BigDecimal.valueOf(100), 2, java.math.RoundingMode.HALF_UP);
                        line.setTaxAmount(taxAmount);
                        line.setTotalAmount(sub.add(taxAmount));

                        QuotationLine updated = quotationService.updateQuotationLineAndSave(id, line);
                        return ResponseEntity.ok(updated);
                    } catch (Exception e) {
                        return ResponseEntity.badRequest().body(Map.of("message", e.getMessage() != null ? e.getMessage() : "Failed to update quotation line"));
                    }
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/submit-approval")
    public ResponseEntity<?> submitForApproval(@PathVariable Long id) {
        return quotationService.findQuotationById(id)
                .map(quotation -> {
                    List<QuotationLine> lines = quotationService.findLinesByQuotationId(id);
                    List<DiscountLineRiskResult> lineRisks = lines.stream()
                            .map(l -> {
                                if (discountService == null) return null;
                                var product = productService.findProductById(l.getProductId()).orElse(null);
                                BigDecimal base = product != null && product.getBasePrice() != null ? product.getBasePrice() : l.getUnitPrice();
                                BigDecimal discPercent = BigDecimal.ZERO;
                                if (base != null && base.compareTo(BigDecimal.ZERO) > 0 && l.getUnitPrice() != null) {
                                    BigDecimal diff = base.subtract(l.getUnitPrice());
                                    if (diff.compareTo(BigDecimal.ZERO) > 0) {
                                        discPercent = diff.multiply(BigDecimal.valueOf(100)).divide(base, 2, java.math.RoundingMode.HALF_UP);
                                    }
                                }
                                return discountService.evaluateLineRisk(l.getProductId(), l.getProductVariantId(), discPercent, null, null);
                            })
                            .filter(Objects::nonNull)
                            .toList();
                    DiscountRiskResult riskResult = discountService != null ? discountService.aggregateQuotationRisk(lineRisks) : null;
                    BigDecimal overallRisk = riskResult != null ? riskResult.getOverallViolationPercent() : BigDecimal.ZERO;
                    ApprovalRouteResult routeResult = approvalService != null ? approvalService.determineApprovalRouteFromDb(quotation.getCustomerId(), null, overallRisk, quotation.getTotalAmount() != null ? quotation.getTotalAmount() : BigDecimal.ZERO) : null;

                    boolean approvalNeeded = (riskResult != null && riskResult.isOverallApprovalRequired()) || (routeResult != null && routeResult.isApprovalRequired());
                    String targetState = approvalNeeded ? "PENDING_APPROVAL" : "APPROVED";

                    if (approvalNeeded && approvalService != null) {
                        try {
                            com.odoo.DealFlow360.approval.Approval pendingApproval = approvalService.createPendingApproval(null, id, null, 1);
                            approvalService.saveApproval(pendingApproval);
                        } catch (Exception ignored) {}
                    }

                    quotationService.changeQuotationStatus(quotation, targetState);
                    quotationService.saveQuotation(quotation);
                    quotationService.createAndSaveQuotationVersion(id, "Status changed to " + targetState);

                    Map<String, Object> response = new HashMap<>();
                    response.put("quotation", quotation);
                    response.put("riskResult", riskResult);
                    response.put("routeResult", routeResult);
                    return ResponseEntity.ok((Object) response);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}/lines/{lineId}")
    public ResponseEntity<?> deleteLine(@PathVariable Long id, @PathVariable Long lineId) {
        return quotationService.findQuotationById(id)
                .map(quotation -> {
                    try {
                        quotationService.removeQuotationLineAndSave(id, lineId);
                        return ResponseEntity.ok(Map.of("message", "Quotation line deleted successfully"));
                    } catch (Exception e) {
                        return ResponseEntity.badRequest().body(Map.of("message", e.getMessage() != null ? e.getMessage() : "Failed to delete quotation line"));
                    }
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/send-to-customer")
    public ResponseEntity<?> sendToCustomer(@PathVariable Long id) {
        return quotationService.findQuotationById(id)
                .map(quotation -> {
                    if ("PENDING_APPROVAL".equalsIgnoreCase(quotation.getStatus())) {
                        return ResponseEntity.badRequest().body(Map.of(
                                "message", "Quotation #" + id + " is currently awaiting manager approval and cannot be sent to customer until approved."
                        ));
                    }
                    try {
                        quotationService.changeQuotationStatus(quotation, "SENT");
                        quotationService.saveQuotation(quotation);
                        quotationService.createAndSaveQuotationVersion(id, "Published quotation to customer portal");
                        return ResponseEntity.ok((Object) quotation);
                    } catch (Exception e) {
                        return ResponseEntity.badRequest().body(Map.of("message", e.getMessage() != null ? e.getMessage() : "Failed to publish quotation to customer portal"));
                    }
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/evaluate-risk")
    public ResponseEntity<?> evaluateQuotationRisk(@PathVariable Long id) {
        return quotationService.findQuotationById(id)
                .map(quotation -> {
                    List<QuotationLine> lines = quotationService.findLinesByQuotationId(id);
                    List<DiscountLineRiskResult> lineRisks = lines.stream()
                            .map(l -> {
                                if (discountService == null) return null;
                                var product = productService.findProductById(l.getProductId()).orElse(null);
                                BigDecimal base = product != null && product.getBasePrice() != null ? product.getBasePrice() : l.getUnitPrice();
                                BigDecimal discPercent = BigDecimal.ZERO;
                                if (base != null && base.compareTo(BigDecimal.ZERO) > 0 && l.getUnitPrice() != null) {
                                    BigDecimal diff = base.subtract(l.getUnitPrice());
                                    if (diff.compareTo(BigDecimal.ZERO) > 0) {
                                        discPercent = diff.multiply(BigDecimal.valueOf(100)).divide(base, 2, java.math.RoundingMode.HALF_UP);
                                    }
                                }
                                return discountService.evaluateLineRisk(l.getProductId(), l.getProductVariantId(), discPercent, null, null);
                            })
                            .filter(Objects::nonNull)
                            .toList();
                    DiscountRiskResult riskResult = discountService != null ? discountService.aggregateQuotationRisk(lineRisks) : null;
                    return ResponseEntity.ok((Object) Map.of("quotation", quotation, "riskResult", riskResult));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/recommendations")
    public ResponseEntity<?> getRecommendations(@PathVariable Long id) {
        List<QuotationLine> lines = quotationService.findLinesByQuotationId(id);
        List<UpsellRule> suggestions = new java.util.ArrayList<>();

        if (recommendationService != null) {
            if (!lines.isEmpty()) {
                java.util.Set<Long> existingProductIds = lines.stream()
                        .map(QuotationLine::getProductId)
                        .filter(Objects::nonNull)
                        .collect(java.util.stream.Collectors.toSet());

                for (QuotationLine line : lines) {
                    if (line.getProductId() != null) {
                        List<UpsellRule> rules = recommendationService.findUpsellRulesByBaseProductId(line.getProductId());
                        for (UpsellRule rule : rules) {
                            if (!existingProductIds.contains(rule.getSuggestedProductId())
                                    && suggestions.stream().noneMatch(r -> Objects.equals(r.getSuggestedProductId(), rule.getSuggestedProductId()))) {
                                suggestions.add(rule);
                            }
                        }
                    }
                }
            }

            if (suggestions.isEmpty()) {
                List<UpsellRule> allRules = recommendationService.findAllUpsellRules();
                for (UpsellRule rule : allRules) {
                    if (suggestions.stream().noneMatch(r -> Objects.equals(r.getSuggestedProductId(), rule.getSuggestedProductId()))) {
                        suggestions.add(rule);
                    }
                }
            }
        }

        return ResponseEntity.ok(suggestions);
    }
}
