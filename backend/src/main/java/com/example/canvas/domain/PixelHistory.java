package com.example.canvas.domain;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "pixel_history")
public class PixelHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private int x;

    @Column(nullable = false)
    private int y;

    @Column(nullable = false, length = 7)
    private String color;

    @Column(nullable = false)
    private Long modifiedBy;

    @Column(nullable = false)
    private LocalDateTime modifiedAt;

    public PixelHistory() {}

    public PixelHistory(int x, int y, String color, Long modifiedBy, LocalDateTime modifiedAt) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.modifiedBy = modifiedBy;
        this.modifiedAt = modifiedAt;
    }

    public Long getId() { return id; }
    public int getX() { return x; }
    public int getY() { return y; }
    public String getColor() { return color; }
    public Long getModifiedBy() { return modifiedBy; }
    public LocalDateTime getModifiedAt() { return modifiedAt; }
} 