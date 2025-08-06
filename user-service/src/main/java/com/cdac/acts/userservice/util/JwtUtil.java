package com.cdac.acts.userservice.util;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.UUID;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String jwtSecret;

    public UUID extractUserId(String token) {
        DecodedJWT decodedJWT = JWT.decode(token);
        String userIdStr = decodedJWT.getSubject();  // or use getClaim("userId").asString() if custom claim
        return UUID.fromString(userIdStr);
    }
}
