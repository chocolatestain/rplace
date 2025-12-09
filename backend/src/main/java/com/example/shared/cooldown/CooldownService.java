package com.example.shared.cooldown;

import java.time.Duration;
import java.util.concurrent.TimeUnit;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import com.example.shared.exception.CooldownViolationException;

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
            // 남용 시 1분 페널티를 적용하기 위해 TTL을 60초로 갱신한다.
            redisTemplate.expire(key, Duration.ofSeconds(60));
            throw new CooldownViolationException(ttl.intValue());
        }

        // 정상 요청의 경우 기본 쿨다운(로그인 상태에 따라 변동 가능)을 설정한다.
        redisTemplate.opsForValue().set(key, "1", Duration.ofSeconds(baseSeconds));
        return baseSeconds;
    }

    public int getRemainingCooldown(long userId) {
        String key = "cooldown:" + userId;
        Long ttl = redisTemplate.getExpire(key, TimeUnit.SECONDS);
        return (ttl != null && ttl > 0) ? ttl.intValue() : 0;
    }
}
