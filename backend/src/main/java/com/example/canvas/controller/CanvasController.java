package com.example.canvas.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import com.example.canvas.dto.SetPixelRequest;
import com.example.canvas.dto.SetPixelResponse;
import com.example.canvas.service.CanvasService;

import jakarta.validation.Valid;

@RestController
public class CanvasController {

    private final CanvasService canvasService;

    public CanvasController(CanvasService canvasService) {
        this.canvasService = canvasService;
    }

    @PostMapping("/api/pixel")
    public ResponseEntity<SetPixelResponse> setPixel(@Valid @RequestBody SetPixelRequest request,
                                                     long userId) {
        int remaining = canvasService.setPixel(request, userId);
        return ResponseEntity.ok(new SetPixelResponse(remaining));
    }
} 