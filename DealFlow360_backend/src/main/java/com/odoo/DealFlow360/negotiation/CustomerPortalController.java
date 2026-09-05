package com.odoo.DealFlow360.negotiation;

import com.odoo.DealFlow360.fulfillment.FulfillmentService;
import com.odoo.DealFlow360.fulfillment.Order;
import com.odoo.DealFlow360.quotation.Quotation;
import com.odoo.DealFlow360.quotation.QuotationLine;
import com.odoo.DealFlow360.quotation.QuotationService;
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

@RestController
@RequestMapping("/api/portal")
public class CustomerPortalController {

    private final QuotationService quotationService;
    private final NegotiationService negotiationService;
    private final FulfillmentService fulfillmentService;

    @Autowired
    public CustomerPortalController(QuotationService quotationService,
                                  NegotiationService negotiationService,
                                  FulfillmentService fulfillmentService) {
        this.quotationService = quotationService;
        this.negotiationService = negotiationService;
        this.fulfillmentService = fulfillmentService;
    }

    public static class PortalNegotiationSubmission {
        public Long customerId;
        public Long quotationId;
        public String requestType;
        public String description;
        public BigDecimal counterDiscountPercent;
        public String lineComments;
        public BigDecimal proposedUnitPrice;
    }

    public static class PortalConfirmQuotationRequest {
        public Long quotationId;
    }

    @GetMapping("/quotations/{id}")
    public ResponseEntity<?> getPortalQuotationView(@PathVariable Long id) {
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

    @PostMapping("/negotiate")
    public ResponseEntity<?> submitPortalNegotiation(@RequestBody PortalNegotiationSubmission submission) {
        if (submission == null || submission.customerId == null || submission.quotationId == null) {
            return ResponseEntity.badRequest().body("Customer ID and Quotation ID are required");
        }

        try {
            NegotiationRequest req = negotiationService.createNegotiationRequest(
                    null,
                    submission.customerId,
                    submission.quotationId,
                    submission.requestType != null ? submission.requestType : "COUNTER_DISCOUNT",
                    submission.description != null ? submission.description : "Customer counter offer"
            );
            req.setCounterDiscountPercent(submission.counterDiscountPercent);
            req.setLineComments(submission.lineComments);
            req.setProposedUnitPrice(submission.proposedUnitPrice);

            req = negotiationService.saveNegotiationRequest(req);

            Quotation quotation = quotationService.findQuotationById(submission.quotationId).orElse(null);
            if (quotation != null) {
                quotationService.changeQuotationStatus(quotation, "UNDER_NEGOTIATION");
                quotationService.saveQuotation(quotation);
            }

            return ResponseEntity.status(HttpStatus.CREATED).body(req);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/confirm-quotation")
    public ResponseEntity<?> confirmQuotationFromPortal(@RequestBody PortalConfirmQuotationRequest request) {
        if (request == null || request.quotationId == null) {
            return ResponseEntity.badRequest().body("Quotation ID is required");
        }

        return quotationService.findQuotationById(request.quotationId)
                .map(quotation -> {
                    quotationService.changeQuotationStatus(quotation, "CONFIRMED");
                    quotationService.saveQuotation(quotation);

                    List<QuotationLine> lines = quotationService.findLinesByQuotationId(request.quotationId);
                    Order order = fulfillmentService.convertQuotationToOrder(quotation, lines);

                    Map<String, Object> response = new HashMap<>();
                    response.put("status", "CONFIRMED");
                    response.put("quotation", quotation);
                    response.put("order", order);
                    return ResponseEntity.ok((Object) response);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
