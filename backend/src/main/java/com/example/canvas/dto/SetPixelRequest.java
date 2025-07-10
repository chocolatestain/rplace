package com.example.canvas.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public record SetPixelRequest(
        @NotNull @Min(0) Integer x,
        @NotNull @Min(0) Integer y,
        @NotNull @Pattern(regexp = "#[0-9A-Fa-f]{6}") String color
) {
} 