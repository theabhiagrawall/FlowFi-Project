package com.cdac.acts.authservice.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${jwt.expiration}")
    private long EXPIRATION_TIME;  // in milliseconds

    private Algorithm getAlgorithm() {
        return Algorithm.HMAC256(secretKey);
    }

    public String generateToken(String userId) {
        return JWT.create()
                .withSubject(userId)
                .withIssuedAt(new Date())
                .withExpiresAt(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .sign(getAlgorithm());
    }

    public String extractUserId(String token) {
        DecodedJWT decodedJWT = JWT.require(getAlgorithm())
                .build()
                .verify(token);
        return decodedJWT.getSubject();
    }

    public boolean validateToken(String token) {
        try {
            JWTVerifier verifier = JWT.require(getAlgorithm()).build();
            verifier.verify(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
