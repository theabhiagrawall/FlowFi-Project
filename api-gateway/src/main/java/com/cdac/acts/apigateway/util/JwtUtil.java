package com.cdac.acts.apigateway.util;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secretKey;

    private Algorithm getAlgorithm() {
        return Algorithm.HMAC256(secretKey);
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

    public String extractUserId(String token) {
        DecodedJWT decodedJWT = JWT.require(getAlgorithm()).build().verify(token);
        return decodedJWT.getSubject();
    }
}
