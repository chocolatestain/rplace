package com.example.canvas.domain;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

/**
 * Entity representing a single pixel on the collaborative canvas.
 */
@Entity
@Table(name = "pixels")
public class Pixel {

    @EmbeddedId
    private PixelKey id;

    @Column(nullable = false, length = 7)
    private String color;

    @Column(nullable = false)
    private LocalDateTime modifiedAt;

    @Column(nullable = false)
    private Long modifiedBy;

    public Pixel() {}

    public Pixel(PixelKey id, String color, LocalDateTime modifiedAt, Long modifiedBy) {
        this.id = id;
        this.color = color;
        this.modifiedAt = modifiedAt;
        this.modifiedBy = modifiedBy;
    }

    public PixelKey getId() { return id; }
    public void setId(PixelKey id) { this.id = id; }
    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }
    public LocalDateTime getModifiedAt() { return modifiedAt; }
    public void setModifiedAt(LocalDateTime modifiedAt) { this.modifiedAt = modifiedAt; }
    public Long getModifiedBy() { return modifiedBy; }
    public void setModifiedBy(Long modifiedBy) { this.modifiedBy = modifiedBy; }
} 