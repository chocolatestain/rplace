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
        // enforce cooldown (5s default, TODO adjust for logged-in user)
        int cd = cooldownService.enforceCooldown(userId, 5);

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