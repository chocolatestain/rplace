package com.example.canvas.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.canvas.domain.PixelHistory;

@Repository
public interface PixelHistoryRepository extends JpaRepository<PixelHistory, Long> {
} 