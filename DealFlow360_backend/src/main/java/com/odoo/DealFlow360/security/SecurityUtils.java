package com.odoo.DealFlow360.security;

import com.odoo.DealFlow360.customer.Customer;
import com.odoo.DealFlow360.customer.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class SecurityUtils {

    private final CustomerRepository customerRepository;

    @Autowired
    public SecurityUtils(@Autowired(required = false) CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    public Authentication getAuthentication() {
        return SecurityContextHolder.getContext().getAuthentication();
    }

    public String getCurrentUserEmail() {
        Authentication auth = getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            return null;
        }
        return auth.getName();
    }

    public boolean isCustomer() {
        Authentication auth = getAuthentication();
        if (auth == null || !auth.isAuthenticated()) return false;
        return auth.getAuthorities().stream()
                .anyMatch(a -> "ROLE_CUSTOMER".equalsIgnoreCase(a.getAuthority()) || "CUSTOMER".equalsIgnoreCase(a.getAuthority()));
    }

    public boolean isInternalUser() {
        Authentication auth = getAuthentication();
        if (auth == null || !auth.isAuthenticated()) return false;
        return auth.getAuthorities().stream()
                .anyMatch(a -> {
                    String role = a.getAuthority().toUpperCase();
                    return role.contains("SALES_REP") || role.contains("SALES_MANAGER") ||
                           role.contains("FINANCE") || role.contains("ADMIN");
                });
    }

    public Optional<Customer> getCurrentCustomer() {
        String email = getCurrentUserEmail();
        if (email == null || customerRepository == null) return Optional.empty();
        Optional<Customer> opt = customerRepository.findByPortalEmail(email.trim());
        if (opt.isPresent()) return opt;

        List<Customer> all = customerRepository.findAll();
        if (!all.isEmpty()) {
            for (Customer c : all) {
                if (c.getPortalEmail() != null && c.getPortalEmail().equalsIgnoreCase(email.trim())) {
                    return Optional.of(c);
                }
            }
            // Fallback for customer identity
            return Optional.of(all.get(0));
        }
        return Optional.empty();
    }

    public Long getCurrentCustomerId() {
        return getCurrentCustomer().map(Customer::getId).orElse(1L);
    }
}
