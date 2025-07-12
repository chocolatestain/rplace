package com.example.canvas;

import com.example.canvas.dto.SetPixelRequest;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Date;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class CanvasControllerIntegrationTest {
    @Autowired
    MockMvc mockMvc;
    @Autowired
    ObjectMapper objectMapper;

    private static final String SECRET = "rplace-super-secret-key-should-be-long-enough";

    private String createJwt(long userId, long expSeconds) {
        return Jwts.builder()
                .claim("userId", userId)
                .setExpiration(new Date(System.currentTimeMillis() + expSeconds * 1000))
                .signWith(SignatureAlgorithm.HS256, SECRET.getBytes())
                .compact();
    }

    @Test
    @DisplayName("인증 사용자: JWT로 픽셀 그리기 성공")
    void setPixel_authenticated() throws Exception {
        String jwt = createJwt(123L, 60);
        SetPixelRequest req = new SetPixelRequest(1, 1, "#FF0000");
        mockMvc.perform(post("/api/pixel")
                .header("Authorization", "Bearer " + jwt)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.cooldown").value(3)); // 인증자는 3초 쿨다운
    }

    @Test
    @DisplayName("게스트: JWT 없이 픽셀 그리기 성공")
    void setPixel_guest() throws Exception {
        SetPixelRequest req = new SetPixelRequest(2, 2, "#00FF00");
        mockMvc.perform(post("/api/pixel")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.cooldown").value(5)); // 게스트는 5초 쿨다운
    }

    @Test
    @DisplayName("만료된 JWT: 401 에러 및 표준 에러 응답")
    void setPixel_expiredJwt() throws Exception {
        String jwt = createJwt(123L, -10); // 이미 만료
        SetPixelRequest req = new SetPixelRequest(3, 3, "#0000FF");
        mockMvc.perform(post("/api/pixel")
                .header("Authorization", "Bearer " + jwt)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value("UNAUTHORIZED"));
    }

    @Test
    @DisplayName("위조된 JWT: 401 에러 및 표준 에러 응답")
    void setPixel_invalidJwt() throws Exception {
        String jwt = "invalid.jwt.token";
        SetPixelRequest req = new SetPixelRequest(4, 4, "#123456");
        mockMvc.perform(post("/api/pixel")
                .header("Authorization", "Bearer " + jwt)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value("UNAUTHORIZED"));
    }
} 