# Canvas API & Real-Time Architecture Plan

_Last updated: 2025-07-10_

## 1. Package & Layer Structure

```
com.example.canvas
├── controller
│   └── CanvasController.java       # REST: POST /api/pixel
├── service
│   └── CanvasService.java          # business logic, cooldown, concurrency
├── domain
│   ├── PixelKey.java               # @Embeddable composite key (x,y)
│   └── Pixel.java                  # @Entity pixel table mapping
├── repository
│   └── PixelRepository.java        # Spring Data JPA repo
└── websocket
    ├── CanvasWebSocketConfig.java  # STOMP broker config (/ws/canvas)
    └── CanvasSocketController.java # @MessageMapping, broadcast
```

Shared modules
```
com.example.shared
├── exception (GlobalExceptionHandler, ErrorResponse)
└── cooldown (CooldownService)      # Redis-based TTL enforcement
```

## 2. Pixel Write Flow

1. Client → `POST /api/pixel {x,y,color}` (JWT)
2. `CanvasController` validates DTO → `CanvasService#setPixel()`
3. Business logic
   * Cooldown check (`CooldownService` via Redis `cooldown:{userId}`)
   * Transactional update (`pixel` table) + history append
   * Write-through to Redis `HSET canvas:{x}:{y}`
   * `PUBLISH canvas:update` with payload `{x,y,color}`
4. Service returns remaining cooldown seconds
5. WebSocket subscriber picks message → broadcasts via `/topic/canvas`

## 3. Technical Requirements Mapping

| Requirement | Implementation |
|-------------|----------------|
| 동시 1k, p95 ≤ 300 ms | Redis write-through, JPA transaction, Connection pool sizing |
| 쿨다운 3/5 s & 페널티 60 s | Redis `SETEX cooldown:{userId}` TTL logic |
| 색상 HEX 유효성 | Bean Validation `@Pattern` on DTO |
| 실시간 브로드캐스트 | Redis pub/sub + STOMP `/topic/canvas` |

## 4. Risk & Mitigation

| Risk | Mitigation |
|------|-----------|
| Redis cluster fail | Fallback queue, retry on reconnect |
| DB row contention | PK (x,y) sharded across grid; SERIALIZABLE isolation sufficient at MVP |
| WebSocket overload | Broker relay & load balancer sticky sessions |

## 5. Milestones

1. Domain & Repository (+ Flyway schema) **(done)**
2. Service business logic + cooldown **(WIP)**
3. REST controller with validation **(TODO)**
4. Redis integration & pub/sub **(TODO)**
5. WebSocket config & broadcast **(TODO)**
6. Tests & docs **(TODO)** 