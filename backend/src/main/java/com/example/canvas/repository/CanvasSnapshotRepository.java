package com.example.canvas.repository;

import com.example.canvas.domain.CanvasSnapshot;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CanvasSnapshotRepository extends JpaRepository<CanvasSnapshot, Long> {
} 