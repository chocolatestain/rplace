# DB 스키마 설계 계획

> 최종 수정: 2025-07-08

## 1. 개요
MySQL 8 기준 캔버스·픽셀 서비스에 필요한 핵심 테이블 4개(User, Pixel, PixelHistory, CanvasSnapshot)를 설계한다. 모든 DDL은 Flyway 마이그레이션으로 관리한다.

## 2. ERD
```mermaid
erDiagram
    USER ||--o{ PIXEL : "writes"
    USER ||--o{ PIXEL_HISTORY : "owns"
    PIXEL ||--o{ PIXEL_HISTORY : "changes"
    PIXEL ||--o{ CANVAS_SNAPSHOT : "snapshots"

    USER {
        BIGINT id PK
        VARCHAR(50) username UNIQUE
        VARCHAR(255) email UNIQUE
        VARCHAR(255) password_hash
        DATETIME created_at
    }

    PIXEL {
        INT x
        INT y
        CHAR(7) color
        DATETIME modified_at
        BIGINT modified_by FK -> USER.id
        PK {x, y}
    }

    PIXEL_HISTORY {
        BIGINT id PK
        INT x
        INT y
        CHAR(7) color
        BIGINT user_id FK -> USER.id
        DATETIME modified_at
    }

    CANVAS_SNAPSHOT {
        BIGINT id PK
        DATETIME snapshot_time
        LONGBLOB data
    }
```

## 3. 테이블 세부 설계
### 3.1 USER
| 컬럼 | 타입 | 제약 | 설명 |
|------|------|------|------|
| id | BIGINT | PK, AUTO_INCREMENT | 사용자 PK |
| username | VARCHAR(50) | UNIQUE, NOT NULL | 닉네임 |
| email | VARCHAR(255) | UNIQUE, NOT NULL | 이메일 |
| password_hash | VARCHAR(255) | NOT NULL | Bcrypt 등 해시 |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | 가입 일시 |

### 3.2 PIXEL
| 컬럼 | 타입 | 제약 | 설명 |
| x, y | INT | PK 복합키 | 좌표 |
| color | CHAR(7) | NOT NULL | #RRGGBB HEX |
| modified_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | 마지막 수정 |
| modified_by | BIGINT | FK USER(id) | 수정 사용자 |

HEX 색상은 CHECK (`color` REGEXP '^#[0-9A-Fa-f]{6}$').

### 3.3 PIXEL_HISTORY
CRUD 이벤트 로그용. 고속 쓰기 대비 별도 ID PK.

| 컬럼 | 타입 | 제약 | 설명 |
| id | BIGINT | PK, AUTO_INCREMENT |
| x, y | INT | INDEX | 좌표 |
| color | CHAR(7) | NOT NULL |
| user_id | BIGINT | FK USER(id) |
| modified_at | DATETIME | DEFAULT CURRENT_TIMESTAMP |

### 3.4 CANVAS_SNAPSHOT
1분 주기 전체 캔버스 바이너리 저장.

| 컬럼 | 타입 | 제약 | 설명 |
| id | BIGINT | PK, AUTO_INCREMENT |
| snapshot_time | DATETIME | UNIQUE | 스냅샷 시각 |
| data | LONGBLOB | NOT NULL | 압축 PNG 등 |

## 4. 인덱스 & 성능
- `PIXEL (x, y)` PK로 좌표 조회 O(1)
- `PIXEL_HISTORY (x, y, modified_at)` 복합 인덱스 → 특정 좌표 히스토리 조회 최적화
- `PIXEL_HISTORY (user_id, modified_at)` → 사용자 활동 로그 필터링

## 5. 마이그레이션 전략
- Flyway `database/migration` 디렉터리에 **V1__init.sql**로 초기 스키마 정의
- 테이블 별 DDL 분리 가능하나 초기 버전은 하나의 파일에 포함
- 이후 스키마 변경 시 V2__*.sql 등 버전 증가

## 6. 구현 로드맵
1. `database/migration/V1__init.sql` 작성 → DB-TODO-005
2. `application.yml`에 Flyway 경로 설정(backend)
3. CI 파이프라인에 `./gradlew flywayMigrate` 테스트 단계 추가(추후) 

## 7. 테스트 전략(통합)
- **Testcontainers + MySQL 8**를 사용해 CI 환경에서도 실제 MySQL 인스턴스로 마이그레이션 검증
- `FlywayMigrationTest`가 스프링 컨텍스트를 기동하며 컨테이너 JDBC 정보를 동적으로 주입
- CI 워크플로 `backend` 잡에서 `./gradlew test` 단계로 자동 수행 

규칙 파일을 내려받기 위한 CLI 명령이 준비되었습니다.  
프로젝트 루트( `rplace` )에서 아래 명령을 실행해 주시면 규칙이 최신 상태로 동기화됩니다.

```
npx @vooster/cli@latest rules:init --agent cursor --api-key <YOUR_API_KEY>
```

(위 `YOUR_API_KEY` 자리에 본인의 Vooster API 키를 입력해 주세요) 