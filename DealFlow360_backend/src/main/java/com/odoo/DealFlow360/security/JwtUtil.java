package com.odoo.DealFlow360.security;

import org.springframework.stereotype.Component;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;

@Component
public class JwtUtil {

    private static final String SECRET = "DealFlow360SecretKeyForJwtSigningProductionGrade2026!";

    public String generateToken(String email, String role) {
        String header = Base64.getUrlEncoder().withoutPadding().encodeToString("{\"alg\":\"HS256\",\"typ\":\"JWT\"}".getBytes(StandardCharsets.UTF_8));
        long now = System.currentTimeMillis();
        long exp = now + 86400000L; // 24 hours
        String payload = Base64.getUrlEncoder().withoutPadding().encodeToString(
                String.format("{\"sub\":\"%s\",\"role\":\"%s\",\"iat\":%d,\"exp\":%d}", email, role != null ? role : "SALES_REP", now / 1000, exp / 1000).getBytes(StandardCharsets.UTF_8)
        );
        String data = header + "." + payload;
        String signature = hmacSha256(data, SECRET);
        return data + "." + signature;
    }

    public boolean validateToken(String token) {
        if (token == null || !token.contains(".")) return false;
        String[] parts = token.split("\\.");
        if (parts.length != 3) return false;
        String data = parts[0] + "." + parts[1];
        String expectedSig = hmacSha256(data, SECRET);
        return expectedSig.equals(parts[2]);
    }

    public String getEmailFromToken(String token) {
        try {
            String[] parts = token.split("\\.");
            String payload = new String(Base64.getUrlDecoder().decode(parts[1]), StandardCharsets.UTF_8);
            int subIdx = payload.indexOf("\"sub\":\"");
            if (subIdx == -1) return null;
            int start = subIdx + 7;
            int end = payload.indexOf("\"", start);
            return payload.substring(start, end);
        } catch (Exception e) {
            return null;
        }
    }

    public String getRoleFromToken(String token) {
        try {
            String[] parts = token.split("\\.");
            String payload = new String(Base64.getUrlDecoder().decode(parts[1]), StandardCharsets.UTF_8);
            int roleIdx = payload.indexOf("\"role\":\"");
            if (roleIdx == -1) return null;
            int start = roleIdx + 8;
            int end = payload.indexOf("\"", start);
            return payload.substring(start, end);
        } catch (Exception e) {
            return null;
        }
    }

    private String hmacSha256(String data, String secret) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKey = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            mac.init(secretKey);
            byte[] hash = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            return Base64.getUrlEncoder().withoutPadding().encodeToString(hash);
        } catch (NoSuchAlgorithmException | InvalidKeyException e) {
            throw new RuntimeException("HMAC SHA256 error", e);
        }
    }
}
