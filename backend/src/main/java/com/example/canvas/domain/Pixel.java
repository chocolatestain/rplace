package com.example.canvas.domain;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

/**
 * Entity representing a single pixel on the collaborative canvas.
 */
@Entity
@Table(name = "pixel")
public class Pixel {

    @EmbeddedId
    private PixelKey id;

    @Column(nullable = false, length = 7)
    private String color;

    @Column(name = "modified_at", nullable = false)
    private LocalDateTime modifiedAt;

    @Column(name = "modified_by")
    private Long modifiedBy;

    protected Pixel() {
        // JPA only
    }

    public Pixel(PixelKey id, String color, LocalDateTime modifiedAt, Long modifiedBy) {
        this.id = id;
        this.color = color;
        this.modifiedAt = modifiedAt;
        this.modifiedBy = modifiedBy;
    }

    public PixelKey getId() {
        return id;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public LocalDateTime getModifiedAt() {
        return modifiedAt;
    }

    public void setModifiedAt(LocalDateTime modifiedAt) {
        this.modifiedAt = modifiedAt;
    }

    public Long getModifiedBy() {
        return modifiedBy;
    }

    public void setModifiedBy(Long modifiedBy) {
        this.modifiedBy = modifiedBy;
    }
} 