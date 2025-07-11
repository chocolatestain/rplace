-- 픽셀 테이블
CREATE TABLE pixels (
    x INT NOT NULL,
    y INT NOT NULL,
    color VARCHAR(7) NOT NULL,
    modified_at TIMESTAMP NOT NULL,
    modified_by BIGINT NOT NULL,
    PRIMARY KEY (x, y)
);

-- 픽셀 히스토리 테이블
CREATE TABLE pixel_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    x INT NOT NULL,
    y INT NOT NULL,
    color VARCHAR(7) NOT NULL,
    modified_by BIGINT NOT NULL,
    modified_at TIMESTAMP NOT NULL,
    INDEX idx_coordinates (x, y),
    INDEX idx_modified_at (modified_at)
);

-- 사용자 테이블 (향후 확장용)
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 쿨다운 로그 테이블
CREATE TABLE cooldown_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    ip_address VARCHAR(45),
    cooldown_duration INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at)
); 