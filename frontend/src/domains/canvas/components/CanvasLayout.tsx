import React, { useRef, useEffect, useState } from 'react';
import { Grid, Box } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../shared/store';
import { setPixel } from '../slice';
import PalettePanel from './PalettePanel';
import TimerPanel from './TimerPanel';

const CANVAS_SIZE = 800;
const PIXEL_SIZE = 4; // 4x4 픽셀
const GRID_SIZE = CANVAS_SIZE / PIXEL_SIZE; // 200x200 그리드

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

    // 모든 픽셀 그리기
    Object.values(pixels).forEach((pixel) => {
      const x = pixel.x * PIXEL_SIZE;
      const y = pixel.y * PIXEL_SIZE;
      ctx.fillStyle = pixel.color;
      ctx.fillRect(x, y, PIXEL_SIZE, PIXEL_SIZE);
    });
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

    // 그리드 범위 체크
    if (x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE) {
      dispatch(setPixel({ x, y, color: selectedColor }));
      
      // 서버에 픽셀 전송 (실제 구현 시)
      // TODO: API 호출 및 WebSocket 이벤트 처리
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