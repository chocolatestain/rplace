-- 동일 내용: 초기 스키마 정의 (참조: /database/migration/V1__init.sql)
-- 사용자, 픽셀, 픽셀 히스토리, 캔버스 스냅샷 테이블 생성

-- 1. 사용자 테이블
CREATE TABLE IF NOT EXISTS user (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. 픽셀 테이블
CREATE TABLE IF NOT EXISTS pixel (
    x INT NOT NULL,
    y INT NOT NULL,
    color CHAR(7) NOT NULL,
    modified_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    modified_by BIGINT,
    PRIMARY KEY (x, y),
    CONSTRAINT chk_color_hex CHECK (color REGEXP '^#[0-9A-Fa-f]{6}$'),
    CONSTRAINT fk_pixel_user FOREIGN KEY (modified_by) REFERENCES user(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. 픽셀 히스토리
CREATE TABLE IF NOT EXISTS pixel_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    x INT NOT NULL,
    y INT NOT NULL,
    color CHAR(7) NOT NULL,
    user_id BIGINT,
    modified_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_pixel_xy (x, y, modified_at),
    INDEX idx_pixel_user_time (user_id, modified_at),
    CONSTRAINT chk_history_color_hex CHECK (color REGEXP '^#[0-9A-Fa-f]{6}$'),
    CONSTRAINT fk_history_user FOREIGN KEY (user_id) REFERENCES user(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. 캔버스 스냅샷
CREATE TABLE IF NOT EXISTS canvas_snapshot (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    snapshot_time DATETIME NOT NULL UNIQUE,
    data LONGBLOB NOT NULL
) ENGINE=InnoDB; 