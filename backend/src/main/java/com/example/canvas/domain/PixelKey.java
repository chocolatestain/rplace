package com.example.canvas.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

/**
 * Composite primary key for {@link Pixel}.
 */
@Embeddable
public class PixelKey implements Serializable {

    @Column(name = "x", nullable = false)
    private Integer x;

    @Column(name = "y", nullable = false)
    private Integer y;

    protected PixelKey() {
        // JPA only
    }

    public PixelKey(Integer x, Integer y) {
        this.x = x;
        this.y = y;
    }

    public Integer getX() {
        return x;
    }

    public Integer getY() {
        return y;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        PixelKey pixelKey = (PixelKey) o;
        return Objects.equals(x, pixelKey.x) && Objects.equals(y, pixelKey.y);
    }

    @Override
    public int hashCode() {
        return Objects.hash(x, y);
    }
} 