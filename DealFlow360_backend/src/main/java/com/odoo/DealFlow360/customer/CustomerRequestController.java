package com.odoo.DealFlow360.customer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * REST controller for Customer Requirement Requests.
 * Serves the customer portal's request submission and the salesperson's request pipeline.
 */
@RestController
@RequestMapping("/api/customer/requests")
public class CustomerRequestController {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public CustomerRequestController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping
    public ResponseEntity<?> getRequests(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String priority,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "100") int limit) {

        StringBuilder sql = new StringBuilder(
                "SELECT id, customer_id, quotation_id, request_type, description, status, counter_discount_percent, line_comments, proposed_unit_price, created_at, updated_at, customer_name, customer_email FROM (" +
                "  SELECT cr.id, cr.customer_id, cr.quotation_id, cr.request_type, cr.description, cr.status, NULL AS counter_discount_percent, NULL AS line_comments, NULL AS proposed_unit_price, cr.created_at, cr.updated_at, c.company_name AS customer_name, c.portal_email AS customer_email FROM customer_requests cr LEFT JOIN customers c ON cr.customer_id = c.id " +
                "  UNION ALL " +
                "  SELECT nr.id, nr.customer_id, nr.quotation_id, nr.request_type, nr.description, nr.status, nr.counter_discount_percent, nr.line_comments, nr.proposed_unit_price, nr.created_at, nr.updated_at, c.company_name AS customer_name, c.portal_email AS customer_email FROM negotiation_requests nr LEFT JOIN customers c ON nr.customer_id = c.id " +
                ") reqs WHERE 1=1 ");

        if (status != null && !status.trim().isEmpty() && !"ALL".equalsIgnoreCase(status)) {
            sql.append("AND UPPER(status) = '").append(status.trim().toUpperCase().replace("'", "''")).append("' ");
        }
        if (search != null && !search.trim().isEmpty()) {
            String escaped = search.trim().replace("'", "''").toLowerCase();
            sql.append("AND (LOWER(description) LIKE '%").append(escaped).append("%' OR LOWER(request_type) LIKE '%").append(escaped).append("%') ");
        }

        sql.append("ORDER BY id DESC LIMIT ").append(limit).append(" OFFSET ").append((page - 1) * limit);

        try {
            List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql.toString());

            // Map to frontend-expected shape
            List<Map<String, Object>> data = rows.stream().map(row -> {
                Map<String, Object> m = new HashMap<>();
                m.put("id", "REQ-" + row.get("id"));
                m.put("requestId", "REQ-" + row.get("id"));
                m.put("dbId", row.get("id"));
                m.put("customerId", row.get("customer_id"));
                m.put("customerName", row.get("customer_name"));
                m.put("companyName", row.get("customer_name"));
                m.put("customerEmail", row.get("customer_email"));
                m.put("quotationId", row.get("quotation_id"));
                m.put("title", row.get("request_type"));
                m.put("description", row.get("description"));
                m.put("status", row.get("status"));
                m.put("counterDiscountPercent", row.get("counter_discount_percent"));
                m.put("lineComments", row.get("line_comments"));
                m.put("proposedUnitPrice", row.get("proposed_unit_price"));
                m.put("priority", "NORMAL");
                m.put("createdAt", row.get("created_at") != null ? row.get("created_at").toString() : null);
                m.put("updatedAt", row.get("updated_at") != null ? row.get("updated_at").toString() : null);
                return m;
            }).toList();

            Map<String, Object> response = new HashMap<>();
            response.put("data", data);
            response.put("meta", Map.of("total", data.size(), "page", page, "limit", limit, "totalPages", 1));
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of(
                    "data", List.of(),
                    "meta", Map.of("total", 0, "page", page, "limit", limit, "totalPages", 0)
            ));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getRequestById(@PathVariable Long id) {
        try {
            Map<String, Object> row = jdbcTemplate.queryForMap(
                    "SELECT cr.id, cr.customer_id, cr.quotation_id, cr.request_type, cr.description, " +
                    "cr.status, cr.created_at, cr.updated_at, c.company_name AS customer_name, c.portal_email AS customer_email " +
                    "FROM customer_requests cr LEFT JOIN customers c ON cr.customer_id = c.id WHERE cr.id = ?", id);

            Map<String, Object> m = new HashMap<>();
            m.put("id", "REQ-" + row.get("id"));
            m.put("requestId", "REQ-" + row.get("id"));
            m.put("dbId", row.get("id"));
            m.put("customerId", row.get("customer_id"));
            m.put("customerName", row.get("customer_name"));
            m.put("companyName", row.get("customer_name"));
            m.put("customerEmail", row.get("customer_email"));
            m.put("quotationId", row.get("quotation_id"));
            m.put("title", row.get("request_type"));
            m.put("description", row.get("description"));
            m.put("status", row.get("status"));
            m.put("priority", "NORMAL");
            m.put("createdAt", row.get("created_at") != null ? row.get("created_at").toString() : null);
            m.put("updatedAt", row.get("updated_at") != null ? row.get("updated_at").toString() : null);
            return ResponseEntity.ok(m);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<?> createRequest(@RequestBody Map<String, Object> body) {
        Long customerId = body.get("customerId") != null ? Long.parseLong(body.get("customerId").toString()) : null;
        String requestType = body.get("title") != null ? body.get("title").toString()
                : (body.get("requestType") != null ? body.get("requestType").toString() : "General Inquiry");
        String description = body.get("description") != null ? body.get("description").toString() : "";
        String status = body.get("status") != null ? body.get("status").toString() : "SUBMITTED";
        if (Boolean.TRUE.equals(body.get("isSubmit"))) {
            status = "SUBMITTED";
        }

        if (customerId == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Customer ID is required"));
        }

        try {
            jdbcTemplate.update(
                    "INSERT INTO customer_requests (customer_id, request_type, description, status) VALUES (?, ?, ?, ?)",
                    customerId, requestType, description, status);

            Map<String, Object> lastRow = jdbcTemplate.queryForMap(
                    "SELECT cr.id, cr.customer_id, cr.request_type, cr.description, cr.status, cr.created_at, cr.updated_at, " +
                    "c.company_name AS customer_name, c.portal_email AS customer_email " +
                    "FROM customer_requests cr LEFT JOIN customers c ON cr.customer_id = c.id ORDER BY cr.id DESC LIMIT 1");

            Map<String, Object> m = new HashMap<>();
            m.put("id", "REQ-" + lastRow.get("id"));
            m.put("requestId", "REQ-" + lastRow.get("id"));
            m.put("dbId", lastRow.get("id"));
            m.put("customerId", lastRow.get("customer_id"));
            m.put("customerName", lastRow.get("customer_name"));
            m.put("title", lastRow.get("request_type"));
            m.put("description", lastRow.get("description"));
            m.put("status", lastRow.get("status"));
            m.put("createdAt", lastRow.get("created_at") != null ? lastRow.get("created_at").toString() : null);
            return ResponseEntity.status(HttpStatus.CREATED).body(m);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage() != null ? e.getMessage() : "Failed to create request"));
        }
    }

    @PostMapping("/{id}/submit")
    public ResponseEntity<?> submitRequest(@PathVariable Long id) {
        try {
            int updated = jdbcTemplate.update(
                    "UPDATE customer_requests SET status = 'SUBMITTED', updated_at = CURRENT_TIMESTAMP WHERE id = ?", id);
            if (updated == 0) return ResponseEntity.notFound().build();
            return ResponseEntity.ok(Map.of("message", "Request submitted", "status", "SUBMITTED"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Failed to submit request"));
        }
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<?> cancelRequest(@PathVariable Long id) {
        try {
            int updated = jdbcTemplate.update(
                    "UPDATE customer_requests SET status = 'CANCELLED', updated_at = CURRENT_TIMESTAMP WHERE id = ?", id);
            if (updated == 0) return ResponseEntity.notFound().build();
            return ResponseEntity.ok(Map.of("message", "Request cancelled", "status", "CANCELLED"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Failed to cancel request"));
        }
    }

    @PostMapping("/{id}/respond")
    public ResponseEntity<?> respondToRequest(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        String responseNotes = body != null && body.get("response") != null ? body.get("response").toString()
                : (body != null && body.get("notes") != null ? body.get("notes").toString() : "Rep responded to customer request.");
        String targetStatus = body != null && body.get("status") != null ? body.get("status").toString().toUpperCase() : "RESOLVED";

        try {
            int updated = jdbcTemplate.update(
                    "UPDATE customer_requests SET status = ?, description = description || '\n[REP RESPONSE]: ' || ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
                    targetStatus, responseNotes, id);
            if (updated == 0) return ResponseEntity.notFound().build();

            return ResponseEntity.ok(Map.of(
                    "message", "Response recorded successfully",
                    "status", targetStatus,
                    "response", responseNotes
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage() != null ? e.getMessage() : "Failed to record response"));
        }
    }
}
