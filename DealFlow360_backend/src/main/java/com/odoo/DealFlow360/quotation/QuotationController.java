package com.odoo.DealFlow360.quotation;

import com.odoo.DealFlow360.approval.ApprovalRouteResult;
import com.odoo.DealFlow360.approval.ApprovalService;
import com.odoo.DealFlow360.discount.DiscountLineRiskResult;
import com.odoo.DealFlow360.discount.DiscountRiskResult;
import com.odoo.DealFlow360.discount.DiscountService;
import com.odoo.DealFlow360.recommendation.RecommendationService;
import com.odoo.DealFlow360.recommendation.UpsellRule;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

    @Autowired
    public QuotationController(QuotationService quotationService,
                               DiscountService discountService,
                               ApprovalService approvalService,
                               RecommendationService recommendationService) {
        this.quotationService = quotationService;
        this.discountService = discountService;
        this.approvalService = approvalService;
        this.recommendationService = recommendationService;
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
            Quotation quotation = quotationService.createQuotation(null, request.customerId, request.priceListId, request.currency);
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
                    int qty = (request.quantity != null && request.quantity > 0) ? request.quantity : 1;
                    BigDecimal price = request.unitPrice != null ? request.unitPrice : BigDecimal.valueOf(100);
                    BigDecimal taxPercent = BigDecimal.valueOf(10);
                    BigDecimal subtotal = price.multiply(BigDecimal.valueOf(qty));
                    BigDecimal tax = subtotal.multiply(taxPercent).divide(BigDecimal.valueOf(100), 2, java.math.RoundingMode.HALF_UP);
                    BigDecimal total = subtotal.add(tax);

                    QuotationLine line = new QuotationLine(null, id, request.productId, request.productVariantId, qty, price, taxPercent, subtotal, tax, total);
                    QuotationLine savedLine = quotationService.saveQuotationLine(line);

                    List<QuotationLine> lines = quotationService.findLinesByQuotationId(id);
                    quotationService.recalculateQuotationTotals(quotation, lines);
                    quotationService.saveQuotation(quotation);

                    return ResponseEntity.status(HttpStatus.CREATED).body(savedLine);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/submit-approval")
    public ResponseEntity<?> submitForApproval(@PathVariable Long id) {
        return quotationService.findQuotationById(id)
                .map(quotation -> {
                    List<QuotationLine> lines = quotationService.findLinesByQuotationId(id);
                    List<DiscountLineRiskResult> lineRisks = lines.stream()
                            .map(l -> discountService != null ? discountService.evaluateLineRisk(l.getProductId(), l.getProductVariantId(), BigDecimal.ZERO, null, null) : null)
                            .filter(Objects::nonNull)
                            .toList();
                    DiscountRiskResult riskResult = discountService != null ? discountService.aggregateQuotationRisk(lineRisks) : null;
                    ApprovalRouteResult routeResult = approvalService != null ? approvalService.determineApprovalRouteFromDb(quotation.getCustomerId(), null, BigDecimal.ZERO, quotation.getTotalAmount() != null ? quotation.getTotalAmount() : BigDecimal.ZERO) : null;

                    boolean approvalNeeded = (riskResult != null && riskResult.isOverallApprovalRequired()) || (routeResult != null && routeResult.isApprovalRequired());
                    String targetState = approvalNeeded ? "PENDING_APPROVAL" : "APPROVED";

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

    @GetMapping("/{id}/recommendations")
    public ResponseEntity<?> getRecommendations(@PathVariable Long id) {
        List<QuotationLine> lines = quotationService.findLinesByQuotationId(id);
        if (lines.isEmpty()) {
            return ResponseEntity.ok(List.of());
        }

        Long baseProductId = lines.get(0).getProductId();
        List<UpsellRule> suggestions = recommendationService != null ? recommendationService.findUpsellRulesByBaseProductId(baseProductId) : List.of();
        return ResponseEntity.ok(suggestions);
    }
}
