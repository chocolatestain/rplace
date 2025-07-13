package com.example.canvas.domain;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "canvas_snapshot")
public class CanvasSnapshot {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Lob
    @Column(name = "snapshot_data", nullable = false)
    private byte[] snapshotData;

    public CanvasSnapshot() {}

    public CanvasSnapshot(LocalDateTime createdAt, byte[] snapshotData) {
        this.createdAt = createdAt;
        this.snapshotData = snapshotData;
    }

    public Long getId() { return id; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public byte[] getSnapshotData() { return snapshotData; }
    public void setId(Long id) { this.id = id; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setSnapshotData(byte[] snapshotData) { this.snapshotData = snapshotData; }
} 