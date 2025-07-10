package com.example.shared.exception;

public class CooldownViolationException extends RuntimeException {
    private final int remainingSeconds;

    public CooldownViolationException(int remainingSeconds) {
        super("Cooldown active: " + remainingSeconds + "s remaining");
        this.remainingSeconds = remainingSeconds;
    }

    public int getRemainingSeconds() {
        return remainingSeconds;
    }
} 