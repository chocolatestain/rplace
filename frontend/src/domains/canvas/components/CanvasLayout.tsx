import React, { useRef, useEffect, useState } from 'react';
import { Grid, Box } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../shared/store';
import { setPixel } from '../slice';
import PalettePanel from './PalettePanel';
import TimerPanel from './TimerPanel';

const CANVAS_SIZE = 800;
const GRID_SIZE = 200; // 200x200 바둑판
const PIXEL_SIZE = CANVAS_SIZE / GRID_SIZE; // 4px

const CanvasLayout: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dispatch = useDispatch();
  const { pixels, selectedColor, cooldownRemaining } = useSelector(
    (state: RootState) => state.canvas
  );
  const [isDrawing, setIsDrawing] = useState(false);

  // 캔버스 렌더링
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    // 캔버스 초기화
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    // 바둑판 그리기
    for (let x = 0; x < GRID_SIZE; x++) {
      for (let y = 0; y < GRID_SIZE; y++) {
        const key = `${x},${y}`;
        ctx.fillStyle = pixels[key]?.color || '#fff';
        ctx.fillRect(x * PIXEL_SIZE, y * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
        // 그리드 라인
        ctx.strokeStyle = '#eee';
        ctx.strokeRect(x * PIXEL_SIZE, y * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
      }
    }
  }, [pixels]);

  // 마우스 이벤트 처리
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (cooldownRemaining > 0) return;
    setIsDrawing(true);
    handlePixelPlacement(e);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || cooldownRemaining > 0) return;
    handlePixelPlacement(e);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handlePixelPlacement = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / PIXEL_SIZE);
    const y = Math.floor((e.clientY - rect.top) / PIXEL_SIZE);
    // 바둑판 범위 체크
    if (x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE) {
      dispatch(setPixel({ x, y, color: selectedColor }));
    }
  };

  return (
    <Grid container sx={{ height: '100vh' }}>
      {/* Palette - left on desktop, top on mobile */}
      <Grid item xs={12} md={2} order={{ xs: 1, md: 1 }}>
        <PalettePanel />
      </Grid>
      {/* Canvas area */}
      <Grid
        item
        xs={12}
        md={8}
        order={{ xs: 2, md: 2 }}
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Box
          component="canvas"
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          tabIndex={0}
          aria-label="픽셀 캔버스"
          sx={{ 
            border: 1, 
            borderColor: 'grey.300',
            cursor: cooldownRemaining > 0 ? 'not-allowed' : 'crosshair'
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
      </Grid>
      {/* Timer - right on desktop, bottom on mobile */}
      <Grid item xs={12} md={2} order={{ xs: 3, md: 3 }}>
        <TimerPanel />
      </Grid>
    </Grid>
  );
};

export default CanvasLayout; 