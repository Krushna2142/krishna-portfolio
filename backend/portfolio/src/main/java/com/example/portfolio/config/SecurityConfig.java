package com.example.portfolio.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.example.portfolio.repository.UserRepository;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtUtils jwtUtils;
    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;

    public SecurityConfig(JwtUtils jwtUtils, UserRepository userRepo, PasswordEncoder passwordEncoder) {
        this.jwtUtils = jwtUtils;
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
    }

    @Bean
    public UserDetailsService userDetailsService() {
        return username -> userRepo.findByUsername(username)
                .map(u -> org.springframework.security.core.userdetails.User
                        .withUsername(u.getUsername())
                        .password(u.getPassword())
                        .authorities("ROLE_" + u.getRole()) // Add ROLE_ prefix
                        .build())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter(jwtUtils);
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService());
        provider.setPasswordEncoder(passwordEncoder);
        return provider;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(org.springframework.security.config.annotation.web.builders.HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**", "/api/public/**", "/actuator/**").permitAll()
                .anyRequest().authenticated()
            );

        // Add JWT filter before the default username/password filter
        http.addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);

        // Optional: allow frames for H2 console (not necessary for MongoDB)
        http.headers(headers -> headers.defaultsDisabled().frameOptions(frame -> frame.sameOrigin()));

        return http.build();
    }
}
