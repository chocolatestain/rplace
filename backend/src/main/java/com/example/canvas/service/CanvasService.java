package com.example.canvas.service;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.example.canvas.domain.Pixel;
import com.example.canvas.domain.PixelHistory;
import com.example.canvas.domain.PixelKey;
import com.example.canvas.dto.PixelEvent;
import com.example.canvas.dto.SetPixelRequest;
import com.example.canvas.repository.PixelHistoryRepository;
import com.example.canvas.repository.PixelRepository;
import com.example.shared.cooldown.CooldownService;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.transaction.Transactional;

@Service
public class CanvasService {

    private final PixelRepository pixelRepository;
    private final PixelHistoryRepository historyRepository;
    private final CooldownService cooldownService;
    private final org.springframework.data.redis.core.StringRedisTemplate redisTemplate;
    private final ObjectMapper objectMapper;

    public CanvasService(PixelRepository pixelRepository,
                         PixelHistoryRepository historyRepository,
                         CooldownService cooldownService,
                         org.springframework.data.redis.core.StringRedisTemplate redisTemplate,
                         ObjectMapper objectMapper) {
        this.pixelRepository = pixelRepository;
        this.historyRepository = historyRepository;
        this.cooldownService = cooldownService;
        this.redisTemplate = redisTemplate;
        this.objectMapper = objectMapper;
    }

    @Transactional
    public int setPixel(SetPixelRequest request, long userId) {
        // 로그인 사용자는 기본 쿨다운 3초, 비로그인은 5초 적용
        int baseCooldown = (userId != 0) ? 3 : 5;
        int cd = cooldownService.enforceCooldown(userId, baseCooldown);

        PixelKey key = new PixelKey(request.x(), request.y());
        LocalDateTime now = LocalDateTime.now();

        Pixel pixel = pixelRepository.findById(key)
                .orElseGet(() -> new Pixel(key, request.color(), now, userId));

        pixel.setColor(request.color());
        pixel.setModifiedAt(now);
        pixel.setModifiedBy(userId);
        pixelRepository.save(pixel);

        PixelHistory history = new PixelHistory(request.x(), request.y(), request.color(), userId, now);
        historyRepository.save(history);

        try {
            PixelEvent event = new PixelEvent(request.x(), request.y(), request.color(), userId);
            String json = objectMapper.writeValueAsString(event);
            redisTemplate.convertAndSend("canvas:pixel", json);
        } catch (Exception e) {
            // TODO: 로깅 프레임워크로 교체
            e.printStackTrace();
        }
        return cd;
    }
} 