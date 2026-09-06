package com.odoo.DealFlow360.common;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class NotificationController {

    private static final List<Map<String, Object>> NOTIFICATIONS = new ArrayList<>();

    static {
        Map<String, Object> n1 = new HashMap<>();
        n1.put("id", "notif_101");
        n1.put("userType", "CUSTOMER");
        n1.put("recipientId", "CUST-001");
        n1.put("type", "ORDER_SHIPPED");
        n1.put("title", "Consignment Dispatched");
        n1.put("message", "Shipment SHP-2026-001 for Order ORD-2026-8912 is in transit via FedEx.");
        n1.put("entityType", "SHIPMENT");
        n1.put("entityId", "SHP-2026-001");
        n1.put("priority", "HIGH");
        n1.put("isRead", false);
        n1.put("readAt", null);
        n1.put("createdAt", Instant.now().minusSeconds(86400).toString());

        Map<String, Object> n2 = new HashMap<>();
        n2.put("id", "notif_102");
        n2.put("userType", "CUSTOMER");
        n2.put("recipientId", "CUST-001");
        n2.put("type", "INVOICE_ISSUED");
        n2.put("title", "Invoice Issued");
        n2.put("message", "Commercial Invoice INV-2026-000001 generated for $145,800.00.");
        n2.put("entityType", "INVOICE");
        n2.put("entityId", "INV-2026-000001");
        n2.put("priority", "NORMAL");
        n2.put("isRead", false);
        n2.put("readAt", null);
        n2.put("createdAt", Instant.now().minusSeconds(86400 * 3).toString());

        Map<String, Object> n3 = new HashMap<>();
        n3.put("id", "notif_103");
        n3.put("userType", "SALESPERSON");
        n3.put("recipientId", "SP-014");
        n3.put("type", "QUOTATION_ACCEPTED");
        n3.put("title", "Quotation Accepted");
        n3.put("message", "Client accepted Quotation QT-2026-1004. Order ORD-2026-8912 generated.");
        n3.put("entityType", "QUOTATION");
        n3.put("entityId", "QT-2026-1004");
        n3.put("priority", "HIGH");
        n3.put("isRead", false);
        n3.put("readAt", null);
        n3.put("createdAt", Instant.now().minusSeconds(86400 * 4).toString());

        Map<String, Object> n4 = new HashMap<>();
        n4.put("id", "notif_104");
        n4.put("userType", "SALESPERSON");
        n4.put("recipientId", "SP-014");
        n4.put("type", "PAYMENT_RECEIVED");
        n4.put("title", "Payment Received");
        n4.put("message", "Wire payment of $50,000 received for Invoice INV-2026-000001.");
        n4.put("entityType", "PAYMENT");
        n4.put("entityId", "PAY-2026-000001");
        n4.put("priority", "NORMAL");
        n4.put("isRead", true);
        n4.put("readAt", Instant.now().minusSeconds(86400 * 2).toString());
        n4.put("createdAt", Instant.now().minusSeconds(86400 * 2).toString());

        NOTIFICATIONS.add(n1);
        NOTIFICATIONS.add(n2);
        NOTIFICATIONS.add(n3);
        NOTIFICATIONS.add(n4);
    }

    @GetMapping({"/sales/notifications", "/customer/notifications"})
    public ResponseEntity<?> getNotifications(@RequestParam(required = false) String status) {
        List<Map<String, Object>> filtered = NOTIFICATIONS.stream()
                .filter(n -> status == null || !status.equals("UNREAD") || Boolean.FALSE.equals(n.get("isRead")))
                .collect(Collectors.toList());

        long unreadCount = NOTIFICATIONS.stream()
                .filter(n -> Boolean.FALSE.equals(n.get("isRead")))
                .count();

        Map<String, Object> response = new HashMap<>();
        response.put("data", filtered);
        response.put("unreadCount", unreadCount);
        response.put("total", filtered.size());
        return ResponseEntity.ok(response);
    }

    @GetMapping({"/sales/notifications/unread-count", "/customer/notifications/unread-count"})
    public ResponseEntity<?> getUnreadCount() {
        long unreadCount = NOTIFICATIONS.stream()
                .filter(n -> Boolean.FALSE.equals(n.get("isRead")))
                .count();
        Map<String, Object> res = new HashMap<>();
        res.put("count", unreadCount);
        res.put("unreadCount", unreadCount);
        return ResponseEntity.ok(res);
    }

    @PatchMapping({"/sales/notifications/{id}/read", "/customer/notifications/{id}/read"})
    public ResponseEntity<?> markAsRead(@PathVariable String id) {
        for (Map<String, Object> n : NOTIFICATIONS) {
            if (n.get("id").equals(id)) {
                n.put("isRead", true);
                n.put("readAt", Instant.now().toString());
            }
        }
        Map<String, Boolean> res = new HashMap<>();
        res.put("success", true);
        return ResponseEntity.ok(res);
    }

    @PostMapping({"/sales/notifications/read-all", "/customer/notifications/read-all"})
    public ResponseEntity<?> markAllAsRead() {
        for (Map<String, Object> n : NOTIFICATIONS) {
            n.put("isRead", true);
            n.put("readAt", Instant.now().toString());
        }
        Map<String, Boolean> res = new HashMap<>();
        res.put("success", true);
        return ResponseEntity.ok(res);
    }
}
