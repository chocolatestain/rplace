package com.example.canvas.service;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.example.canvas.domain.Pixel;
import com.example.canvas.domain.PixelHistory;
import com.example.canvas.domain.PixelKey;
import com.example.canvas.dto.SetPixelRequest;
import com.example.canvas.repository.PixelHistoryRepository;
import com.example.canvas.repository.PixelRepository;
import com.example.shared.cooldown.CooldownService;

import jakarta.transaction.Transactional;

@Service
public class CanvasService {

    private final PixelRepository pixelRepository;
    private final PixelHistoryRepository historyRepository;
    private final CooldownService cooldownService;

    public CanvasService(PixelRepository pixelRepository,
                         PixelHistoryRepository historyRepository,
                         CooldownService cooldownService) {
        this.pixelRepository = pixelRepository;
        this.historyRepository = historyRepository;
        this.cooldownService = cooldownService;
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

        // TODO publish redis event for websocket broadcast (subtask 3)
        return cd;
    }
} 