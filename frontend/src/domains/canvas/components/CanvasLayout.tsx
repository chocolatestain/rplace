import React, { useRef, useEffect, useState } from 'react';
import { Grid, Box, Alert, CircularProgress, Typography } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../shared/store';
import { setPixel } from '../slice';
import PalettePanel from './PalettePanel';
import TimerPanel from './TimerPanel';
import { usePixelApi } from '../hooks/usePixelApi';
import { useCanvasSocket } from '../hooks/useCanvasSocket';
import { getJwtToken, isGuest, removeJwtToken, isJwtExpired } from '../../../shared/jwt';

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
  // 인증 상태 변화 감지용 state
  const [authState, setAuthState] = useState<'auth' | 'guest'>(isGuest() ? 'guest' : 'auth');
  // JWT 만료/위조 시 자동 게스트 전환
  useEffect(() => {
    const token = getJwtToken();
    if (!token || isJwtExpired(token)) {
      removeJwtToken();
      if (authState !== 'guest') setAuthState('guest');
    } else {
      if (authState !== 'auth') setAuthState('auth');
    }
  });
  // jwtToken은 항상 최신 상태로 반영
  const jwtToken = getJwtToken();
  const { setPixel: apiSetPixel, loading, error, cooldown } = usePixelApi({
    jwtToken: jwtToken || undefined,
    onAuthError: () => {
      // 인증 만료 시 자동 리다이렉트
      window.location.href = '/login';
    },
  });

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

  // 실시간 픽셀 이벤트 수신 시 상태 갱신
  useCanvasSocket({
    jwtToken: jwtToken || undefined,
    onPixelEvent: (event) => {
      // 서버에서 { x, y, color } 등 픽셀 정보 브로드캐스트 시 상태 갱신
      if (event && typeof event.x === 'number' && typeof event.y === 'number' && typeof event.color === 'string') {
        dispatch(setPixel({ x: event.x, y: event.y, color: event.color }));
      }
    },
  });

  // 쿨다운 동기화(REST 응답/에러, 실시간 등)
  useEffect(() => {
    if (cooldown > 0) {
      dispatch({ type: 'canvas/setCooldownRemaining', payload: cooldown });
    }
  }, [cooldown, dispatch]);

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
      // REST API 호출(쿨다운, 에러, 인증 분기)
      apiSetPixel({ x, y, color: selectedColor });
      // (실시간 반영은 WebSocket에서 수신 시 처리)
    }
  };

  return (
    <Grid container sx={{ height: '100vh' }}>
      {/* 인증 상태 안내 */}
      <Grid item xs={12}>
        {authState === 'guest' ? (
          <Alert severity="info" sx={{ mb: 2 }}>
            게스트 모드입니다. 일부 기능이 제한될 수 있습니다.
          </Alert>
        ) : null}
      </Grid>
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
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}
      >
        {/* 로딩 인디케이터 */}
        {loading && <CircularProgress sx={{ mb: 2 }} />}
        {/* 에러 메시지 */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            <span dangerouslySetInnerHTML={{ __html: error }} />
          </Alert>
        )}
        {/* 쿨다운 안내 */}
        {cooldownRemaining > 0 && (
          <Alert severity="info" sx={{ mb: 2 }}>
            쿨다운 중: {cooldownRemaining}초 후 다시 그릴 수 있습니다.
          </Alert>
        )}
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