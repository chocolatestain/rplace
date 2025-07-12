package com.example.shared;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureException;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.Keys;
import java.security.Key;
import java.util.Base64;

public class JwtUtil {
    // TODO: 환경변수/설정파일로 분리 필요
    private static final String SECRET = "rplace-super-secret-key-should-be-long-enough";
    private static final Key KEY = Keys.hmacShaKeyFor(SECRET.getBytes());

    public static long extractUserId(String token) {
        Claims claims = parseClaims(token);
        Object userIdObj = claims.get("userId");
        if (userIdObj instanceof Integer) {
            return ((Integer) userIdObj).longValue();
        } else if (userIdObj instanceof Long) {
            return (Long) userIdObj;
        } else if (userIdObj instanceof String) {
            return Long.parseLong((String) userIdObj);
        }
        throw new IllegalArgumentException("userId claim not found or invalid");
    }

    public static Claims parseClaims(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(KEY)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (ExpiredJwtException e) {
            throw new JwtAuthException("만료된 토큰입니다.");
        } catch (SignatureException | MalformedJwtException e) {
            throw new JwtAuthException("위조된 토큰입니다.");
        } catch (Exception e) {
            throw new JwtAuthException("잘못된 토큰 형식입니다.");
        }
    }

    public static boolean isExpired(String token) {
        try {
            parseClaims(token);
            return false;
        } catch (JwtAuthException e) {
            return e.getMessage().contains("만료");
        }
    }

    // 커스텀 인증 예외
    public static class JwtAuthException extends RuntimeException {
        public JwtAuthException(String msg) { super(msg); }
    }
} 