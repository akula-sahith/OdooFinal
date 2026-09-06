package com.odoo.DealFlow360.customer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    private final CustomerService customerService;
    private final CustomerContactService contactService;

    @Autowired
    public CustomerController(CustomerService customerService, CustomerContactService contactService) {
        this.customerService = customerService;
        this.contactService = contactService;
    }

    public static class CustomerCreateRequest {
        public String companyName;
        public String name;
        public Long salesTeamId;
        public Long discountTierId;
        public String portalEmail;
        public String email;
    }

    @GetMapping
    public ResponseEntity<?> getAllCustomers(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "100") int limit) {

        List<Customer> customers = customerService.findAllCustomers();

        if (search != null && !search.trim().isEmpty()) {
            String s = search.trim().toLowerCase();
            customers = customers.stream()
                    .filter(c -> (c.getCompanyName() != null && c.getCompanyName().toLowerCase().contains(s)) ||
                                 (c.getPortalEmail() != null && c.getPortalEmail().toLowerCase().contains(s)))
                    .toList();
        }

        Map<String, Object> response = new HashMap<>();
        response.put("data", customers);
        response.put("meta", Map.of("total", customers.size(), "page", page, "limit", limit, "totalPages", 1));
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCustomerById(@PathVariable Long id) {
        return customerService.findCustomerById(id)
                .map(customer -> {
                    List<CustomerContact> contacts = contactService.findContactsByCustomerId(id);
                    Map<String, Object> res = new HashMap<>();
                    res.put("customer", customer);
                    res.put("contacts", contacts);
                    return ResponseEntity.ok((Object) res);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createCustomer(@RequestBody CustomerCreateRequest request) {
        if (request == null) {
            return ResponseEntity.badRequest().body("Customer data is required");
        }
        String companyName = request.companyName != null ? request.companyName : request.name;
        String email = request.portalEmail != null ? request.portalEmail : request.email;
        if (companyName == null || companyName.trim().isEmpty()) {
            companyName = "New Commercial Customer";
        }
        if (email == null || email.trim().isEmpty()) {
            email = "contact@" + companyName.toLowerCase().replaceAll("[^a-z0-9]", "") + ".com";
        }
        try {
            Customer customer = customerService.createCustomer(
                    null,
                    companyName.trim(),
                    request.salesTeamId != null ? request.salesTeamId : 1L,
                    request.discountTierId != null ? request.discountTierId : 1L,
                    email.trim(),
                    null,
                    Instant.now()
            );
            Customer saved = customerService.saveCustomer(customer);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCustomer(@PathVariable Long id, @RequestBody CustomerCreateRequest request) {
        return customerService.findCustomerById(id)
                .map(existing -> {
                    String companyName = request.companyName != null ? request.companyName : request.name;
                    String email = request.portalEmail != null ? request.portalEmail : request.email;
                    if (companyName != null && !companyName.trim().isEmpty()) {
                        existing.setCompanyName(companyName.trim());
                    }
                    if (request.salesTeamId != null) {
                        existing.setSalesTeamId(request.salesTeamId);
                    }
                    if (request.discountTierId != null) {
                        existing.setDiscountTierId(request.discountTierId);
                    }
                    if (email != null) {
                        existing.setPortalEmail(email.trim());
                    }
                    Customer updated = customerService.saveCustomer(existing);
                    return ResponseEntity.ok((Object) updated);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCustomer(@PathVariable Long id) {
        if (customerService.findCustomerById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        customerService.deleteCustomer(id);
        return ResponseEntity.ok(Map.of("message", "Customer deleted successfully"));
    }

    @GetMapping("/{id}/contacts")
    public ResponseEntity<List<CustomerContact>> getCustomerContacts(@PathVariable Long id) {
        return ResponseEntity.ok(contactService.findContactsByCustomerId(id));
    }

    @PostMapping("/{id}/contacts")
    public ResponseEntity<?> addCustomerContact(@PathVariable Long id, @RequestBody CustomerContact contact) {
        if (contact == null) {
            return ResponseEntity.badRequest().body("Contact data is required");
        }
        contact.setCustomerId(id);
        try {
            CustomerContact saved = contactService.saveContact(contact);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/contacts/{contactId}")
    public ResponseEntity<?> deleteCustomerContact(@PathVariable Long contactId) {
        contactService.deleteContact(contactId);
        return ResponseEntity.ok(Map.of("message", "Contact deleted successfully"));
    }
}
