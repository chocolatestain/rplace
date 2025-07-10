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
    private Integer x;

    @Column(nullable = false)
    private Integer y;

    @Column(nullable = false, length = 7)
    private String color;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "modified_at", nullable = false)
    private LocalDateTime modifiedAt;

    protected PixelHistory() {
    }

    public PixelHistory(Integer x, Integer y, String color, Long userId, LocalDateTime modifiedAt) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.userId = userId;
        this.modifiedAt = modifiedAt;
    }

    // getters omitted for brevity
} 