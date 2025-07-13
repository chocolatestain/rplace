-- 캔버스 스냅샷 테이블
CREATE TABLE canvas_snapshot (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    snapshot_data LONGBLOB NOT NULL,
    INDEX idx_created_at (created_at)
); 