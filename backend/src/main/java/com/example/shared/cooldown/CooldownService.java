package com.example.shared.cooldown;

import com.example.shared.exception.CooldownViolationException;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.concurrent.TimeUnit;

@Service
public class CooldownService {

    private final StringRedisTemplate redisTemplate;

    public CooldownService(StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public int enforceCooldown(long userId, int baseSeconds) {
        String key = "cooldown:" + userId;
        Long ttl = redisTemplate.getExpire(key, TimeUnit.SECONDS);
        if (ttl != null && ttl > 0) {
            throw new CooldownViolationException(ttl.intValue());
        }
        redisTemplate.opsForValue().set(key, "1", Duration.ofSeconds(baseSeconds));
        return baseSeconds;
    }
} 