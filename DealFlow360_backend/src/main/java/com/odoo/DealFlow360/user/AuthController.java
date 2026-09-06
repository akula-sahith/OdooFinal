package com.odoo.DealFlow360.user;

import com.odoo.DealFlow360.customer.Customer;
import com.odoo.DealFlow360.customer.CustomerService;
import com.odoo.DealFlow360.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final CustomerService customerService;

    @Autowired
    public AuthController(UserService userService, PasswordEncoder passwordEncoder, JwtUtil jwtUtil, CustomerService customerService) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.customerService = customerService;
    }

    public static class LoginRequest {
        public String email;
        public String password;
    }

    public static class RegisterRequest {
        public String name;
        public String email;
        public String password;
        public String role;
        public Long teamId;
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            if (jwtUtil != null && jwtUtil.validateToken(token)) {
                String email = jwtUtil.getEmailFromToken(token);
                if (email != null) {
                    return userService.findUserByEmail(email)
                            .map(user -> ResponseEntity.ok((Object) user))
                            .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "User not found")));
                }
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Not authenticated"));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        Map<String, String> res = new HashMap<>();
        res.put("message", "Logged out successfully");
        return ResponseEntity.ok(res);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        if (request == null || request.email == null || request.password == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email and password are required"));
        }

        return userService.findUserByEmail(request.email.trim().toLowerCase())
                .map(user -> {
                    boolean matches = passwordEncoder != null
                            ? passwordEncoder.matches(request.password, user.getPasswordHash())
                            : request.password.equals(user.getPasswordHash());
                    if (matches) {
                        String token = jwtUtil != null ? jwtUtil.generateToken(user.getEmail(), user.getRole())
                                : "jwt-token-for-" + user.getEmail();
                        Map<String, Object> response = new HashMap<>();
                        response.put("status", "SUCCESS");
                        response.put("user", user);
                        response.put("token", token);
                        return ResponseEntity.ok((Object) response);
                    } else {
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid credentials"));
                    }
                })
                .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid credentials")));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (request == null || request.name == null || request.email == null || request.password == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Name, email, and password are required"));
        }

        String email = request.email.trim().toLowerCase();

        Optional<User> existingOpt = userService.findUserByEmail(email);
        if (existingOpt.isPresent()) {
            User existing = existingOpt.get();
            String encodedPassword = passwordEncoder != null ? passwordEncoder.encode(request.password) : request.password;
            existing.setPasswordHash(encodedPassword);
            if (request.role != null) existing.setRole(request.role);
            if (request.teamId != null) existing.setTeamId(request.teamId);
            existing = userService.saveUser(existing);
            return ResponseEntity.ok(existing);
        }

        try {
            String encodedPassword = passwordEncoder != null ? passwordEncoder.encode(request.password)
                    : request.password;
            User user = userService.createUser(null, request.name, email, encodedPassword,
                    request.role != null ? request.role : "SALES_REP", request.teamId, Instant.now());
            user = userService.saveUser(user);
            return ResponseEntity.status(HttpStatus.CREATED).body(user);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage() != null ? e.getMessage() : "Registration failed"));
        }
    }

    @PostMapping("/customer/signup")
    public ResponseEntity<?> customerSignup(@RequestBody Map<String, Object> body) {
        String emailRaw = body.get("businessEmail") != null ? body.get("businessEmail").toString()
                : (body.get("contactEmail") != null ? body.get("contactEmail").toString()
                : (body.get("email") != null ? body.get("email").toString() : null));

        String companyName = body.get("companyName") != null ? body.get("companyName").toString()
                : (body.get("fullName") != null ? body.get("fullName").toString() : "Commercial Account");

        String fn = body.get("firstName") != null ? body.get("firstName").toString().trim() : "";
        String ln = body.get("lastName") != null ? body.get("lastName").toString().trim() : "";
        String constructedName = (fn + " " + ln).trim();

        String name = body.get("fullName") != null ? body.get("fullName").toString()
                : (body.get("name") != null ? body.get("name").toString()
                : (!constructedName.isEmpty() ? constructedName : companyName));

        String rawPassword = body.get("password") != null ? body.get("password").toString() : "Password123!";

        if (emailRaw == null || emailRaw.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email address is required."));
        }

        String email = emailRaw.trim().toLowerCase();

        if (userService.findUserByEmail(email).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "An account with email address " + email + " already exists. Please sign in instead."));
        }

        try {
            String encodedPassword = passwordEncoder != null ? passwordEncoder.encode(rawPassword) : rawPassword;
            User user = userService.createUser(null, name, email, encodedPassword, "CUSTOMER", null, Instant.now());
            user = userService.saveUser(user);

            // Create corresponding customer company record in customers table
            if (customerService != null) {
                try {
                    Customer customer = customerService.createCustomer(
                            null,
                            companyName,
                            1L,
                            1L,
                            email,
                            null,
                            Instant.now()
                    );
                    customerService.saveCustomer(customer);
                } catch (Exception e) {
                    // ignore if customer record already exists
                }
            }

            String token = jwtUtil != null ? jwtUtil.generateToken(user.getEmail(), user.getRole()) : "jwt-token-for-" + user.getEmail();
            Map<String, Object> response = new HashMap<>();
            response.put("status", "SUCCESS");
            response.put("user", user);
            response.put("token", token);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage() != null ? e.getMessage() : "Customer signup failed"));
        }
    }
}
