package com.odoo.DealFlow360.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

/**
 * Security configuration setting up password hashing, authentication rules, and API route security.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(List.of("*"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setExposedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**", "/api/portal/**", "/actuator/**", "/db-health", "/api/health/**").permitAll()
                .requestMatchers("/api/admin/**").hasAnyRole("ADMIN", "ADMINISTRATOR", "SALES_MANAGER")
                .requestMatchers("/api/manager/**").hasAnyRole("ADMIN", "SALES_MANAGER")
                .requestMatchers("/api/finance/**").hasAnyRole("ADMIN", "FINANCE")
                .requestMatchers("/api/quotations/**", "/api/orders/**", "/api/approvals/**", "/api/billing/**", "/api/subscriptions/**", "/api/inventory/**", "/api/fulfillment/**", "/api/customers/**", "/api/products/**", "/api/price-lists/**", "/api/discount-tiers/**", "/api/approval-rules/**", "/api/sales/**", "/api/deal-health/**", "/api/reporting/**", "/api/users/**", "/api/roles/**", "/api/customer/requests/**").authenticated()
                .anyRequest().permitAll()
            );

        return http.build();
    }
}
