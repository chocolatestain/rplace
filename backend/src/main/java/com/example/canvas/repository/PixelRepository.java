package com.example.canvas.repository;

import com.example.canvas.domain.Pixel;
import com.example.canvas.domain.PixelKey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PixelRepository extends JpaRepository<Pixel, PixelKey> {
} 