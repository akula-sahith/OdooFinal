package com.odoo.DealFlow360.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserController(UserService userService, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    public static class UserCreateRequest {
        public String firstName;
        public String lastName;
        public String name;
        public String email;
        public String password;
        public String role;
        public String roleId;
        public Long teamId;
        public String status;
        public String phone;
        public String department;
        public String employeeCode;
    }

    public static class UserUpdateRequest {
        public String firstName;
        public String lastName;
        public String name;
        public String email;
        public String role;
        public String roleId;
        public Long teamId;
        public String status;
        public String phone;
        public String department;
        public String employeeCode;
    }

    @GetMapping
    public ResponseEntity<?> getUsers(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String roleId,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "100") int limit) {

        List<User> users = userService.findAllUsers();

        // Filter search
        if (search != null && !search.trim().isEmpty()) {
            String s = search.trim().toLowerCase();
            users = users.stream()
                    .filter(u -> (u.getName() != null && u.getName().toLowerCase().contains(s)) ||
                                 (u.getEmail() != null && u.getEmail().toLowerCase().contains(s)))
                    .collect(Collectors.toList());
        }

        // Filter roleId
        if (roleId != null && !roleId.trim().isEmpty() && !"ALL".equalsIgnoreCase(roleId)) {
            String targetRole = mapRoleIdToRole(roleId);
            users = users.stream()
                    .filter(u -> u.getRole() != null && u.getRole().equalsIgnoreCase(targetRole))
                    .collect(Collectors.toList());
        }

        List<Map<String, Object>> mappedUsers = users.stream()
                .map(this::mapUserToResponse)
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("data", mappedUsers);
        Map<String, Object> meta = new HashMap<>();
        meta.put("total", mappedUsers.size());
        meta.put("page", page);
        meta.put("limit", limit);
        meta.put("totalPages", 1);
        response.put("meta", meta);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        return userService.findUserById(id)
                .map(user -> ResponseEntity.ok((Object) mapUserToResponse(user)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody UserCreateRequest request) {
        if (request == null || (request.email == null || request.email.trim().isEmpty())) {
            return ResponseEntity.badRequest().body("Email is required");
        }

        String email = request.email.trim().toLowerCase();
        if (userService.findUserByEmail(email).isPresent()) {
            Map<String, Object> err = new HashMap<>();
            err.put("message", "A staff user with this email address already exists.");
            err.put("status", 409);
            Map<String, String> fieldErrors = new HashMap<>();
            fieldErrors.put("email", "Email address must be unique across staff accounts.");
            err.put("errors", fieldErrors);
            return ResponseEntity.status(HttpStatus.CONFLICT).body(err);
        }

        String displayName = request.name;
        if (displayName == null || displayName.trim().isEmpty()) {
            String fn = request.firstName != null ? request.firstName.trim() : "";
            String ln = request.lastName != null ? request.lastName.trim() : "";
            displayName = (fn + " " + ln).trim();
            if (displayName.isEmpty()) {
                displayName = email.split("@")[0];
            }
        }

        String role = request.role;
        if (role == null || role.trim().isEmpty()) {
            role = mapRoleIdToRole(request.roleId);
        }

        String rawPassword = request.password != null && !request.password.trim().isEmpty()
                ? request.password.trim()
                : "Password123!";

        String encodedPassword = passwordEncoder != null ? passwordEncoder.encode(rawPassword) : rawPassword;

        User user = userService.createUser(null, displayName, email, encodedPassword, role, request.teamId, Instant.now());
        User savedUser = userService.saveUser(user);

        return ResponseEntity.status(HttpStatus.CREATED).body(mapUserToResponse(savedUser));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody UserUpdateRequest request) {
        Optional<User> existingOpt = userService.findUserById(id);
        if (existingOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User existing = existingOpt.get();

        if (request.email != null && !request.email.trim().equalsIgnoreCase(existing.getEmail())) {
            String newEmail = request.email.trim().toLowerCase();
            if (userService.findUserByEmail(newEmail).isPresent()) {
                Map<String, Object> err = new HashMap<>();
                err.put("message", "A staff user with this email address already exists.");
                err.put("status", 409);
                return ResponseEntity.status(HttpStatus.CONFLICT).body(err);
            }
            existing.setEmail(newEmail);
        }

        if (request.name != null && !request.name.trim().isEmpty()) {
            existing.setName(request.name.trim());
        } else if (request.firstName != null || request.lastName != null) {
            String fn = request.firstName != null ? request.firstName.trim() : "";
            String ln = request.lastName != null ? request.lastName.trim() : "";
            existing.setName((fn + " " + ln).trim());
        }

        if (request.role != null || request.roleId != null) {
            existing.setRole(request.role != null ? request.role : mapRoleIdToRole(request.roleId));
        }

        if (request.teamId != null) {
            existing.setTeamId(request.teamId);
        }

        User updatedUser = userService.saveUser(existing);
        return ResponseEntity.ok(mapUserToResponse(updatedUser));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        if (!userService.findUserById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        userService.deleteUser(id);
        return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateUserStatus(@PathVariable Long id, @RequestBody Map<String, String> statusBody) {
        Optional<User> existingOpt = userService.findUserById(id);
        if (existingOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        User user = existingOpt.get();
        return ResponseEntity.ok(mapUserToResponse(user));
    }

    private Map<String, Object> mapUserToResponse(User user) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", user.getId().toString());
        map.put("dbId", user.getId());

        String fullName = user.getName() != null ? user.getName() : "";
        String[] parts = fullName.split(" ", 2);
        map.put("firstName", parts.length > 0 ? parts[0] : "");
        map.put("lastName", parts.length > 1 ? parts[1] : "");
        map.put("name", fullName);
        map.put("email", user.getEmail());
        map.put("role", user.getRole());
        map.put("roleId", mapRoleToRoleId(user.getRole()));
        map.put("roleName", mapRoleToRoleName(user.getRole()));
        map.put("roleCode", "ROLE-" + (user.getRole() != null ? user.getRole() : "STAFF"));
        map.put("status", "ACTIVE");
        map.put("teamId", user.getTeamId());
        map.put("createdAt", user.getCreatedAt() != null ? user.getCreatedAt().toString() : Instant.now().toString());
        return map;
    }

    private String mapRoleIdToRole(String roleId) {
        if (roleId == null) return "SALES_REP";
        switch (roleId.toLowerCase()) {
            case "role_admin":
            case "admin":
                return "ADMIN";
            case "role_sales_manager":
            case "sales_manager":
                return "SALES_MANAGER";
            case "role_salesperson":
            case "sales_rep":
            case "salesrep":
                return "SALES_REP";
            case "role_finance_ops":
            case "finance":
                return "FINANCE";
            case "role_customer":
            case "customer":
                return "CUSTOMER";
            default:
                return roleId.toUpperCase();
        }
    }

    private String mapRoleToRoleId(String role) {
        if (role == null) return "role_salesperson";
        switch (role.toUpperCase()) {
            case "ADMIN":
                return "role_admin";
            case "SALES_MANAGER":
                return "role_sales_manager";
            case "SALES_REP":
                return "role_salesperson";
            case "FINANCE":
                return "role_finance_ops";
            case "CUSTOMER":
                return "role_customer";
            default:
                return "role_" + role.toLowerCase();
        }
    }

    private String mapRoleToRoleName(String role) {
        if (role == null) return "Staff Member";
        switch (role.toUpperCase()) {
            case "ADMIN":
                return "Administrator";
            case "SALES_MANAGER":
                return "Sales Manager";
            case "SALES_REP":
                return "Salesperson";
            case "FINANCE":
                return "Finance / Operations";
            case "CUSTOMER":
                return "Customer Portal User";
            default:
                return role;
        }
    }
}
