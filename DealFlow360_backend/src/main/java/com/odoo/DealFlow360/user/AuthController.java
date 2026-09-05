package com.odoo.DealFlow360.user;

import com.odoo.DealFlow360.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Autowired
    public AuthController(UserService userService, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
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

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        if (request == null || request.email == null || request.password == null) {
            return ResponseEntity.badRequest().body("Email and password are required");
        }

        return userService.findUserByEmail(request.email)
                .map(user -> {
                    boolean matches = passwordEncoder != null ? passwordEncoder.matches(request.password, user.getPasswordHash()) : request.password.equals(user.getPasswordHash());
                    if (matches) {
                        String token = jwtUtil != null ? jwtUtil.generateToken(user.getEmail(), user.getRole()) : "jwt-token-for-" + user.getEmail();
                        Map<String, Object> response = new HashMap<>();
                        response.put("status", "SUCCESS");
                        response.put("user", user);
                        response.put("token", token);
                        return ResponseEntity.ok((Object) response);
                    } else {
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
                    }
                })
                .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials"));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (request == null || request.name == null || request.email == null || request.password == null) {
            return ResponseEntity.badRequest().body("Name, email, and password are required");
        }

        if (userService.findUserByEmail(request.email).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("User with email " + request.email + " already exists");
        }

        try {
            String encodedPassword = passwordEncoder != null ? passwordEncoder.encode(request.password) : request.password;
            User user = userService.createUser(null, request.name, request.email, encodedPassword, request.role != null ? request.role : "SALES_REP", request.teamId, Instant.now());
            user = userService.saveUser(user);
            return ResponseEntity.status(HttpStatus.CREATED).body(user);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
