package com.example.shared.cooldown;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CooldownController {

    private final CooldownService cooldownService;

    public CooldownController(CooldownService cooldownService) {
        this.cooldownService = cooldownService;
    }

    @GetMapping("/api/cooldown")
    public ResponseEntity<CooldownResponse> getCooldown(long userId) {
        int remaining = cooldownService.getRemainingCooldown(userId);
        return ResponseEntity.ok(new CooldownResponse(remaining));
    }
}
