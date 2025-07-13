import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../shared/store';
import { setCooldownRemaining } from '../slice';
import { useCanvasSocket } from './useCanvasSocket';
import axios from 'axios';

interface UseCooldownResult {
  cooldown: number;
  penalty: boolean;
  error: string | null;
  refreshCooldown: () => void;
}

/**
 * 서버와 동기화되는 쿨다운 상태 관리 훅
 * - cooldown: 남은 쿨다운(초)
 * - penalty: 1분 페널티 여부
 * - error: 쿨다운 관련 에러 메시지
 * - refreshCooldown: 서버에서 쿨다운 상태 재조회
 */
export function useCooldown(userToken?: string): UseCooldownResult {
  const dispatch = useDispatch();
  const cooldown = useSelector((state: RootState) => state.canvas.cooldownRemaining);
  const [penalty, setPenalty] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // WebSocket 실시간 쿨다운 동기화
  useCanvasSocket({
    jwtToken: userToken,
    onPixelEvent: (event) => {
      if (event && typeof event.cooldown === 'number') {
        dispatch(setCooldownRemaining(event.cooldown));
        setPenalty(event.cooldown >= 60);
      }
    },
  });

  // 쿨다운 타이머 감소
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setInterval(() => {
        dispatch(setCooldownRemaining(Math.max(0, cooldown - 1)));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [cooldown, dispatch]);

  // 서버에서 쿨다운 상태 재조회
  const refreshCooldown = useCallback(async () => {
    try {
      setError(null);
      const res = await axios.get('/api/cooldown', {
        headers: userToken ? { Authorization: `Bearer ${userToken}` } : {},
      });
      if (typeof res.data.cooldown === 'number') {
        dispatch(setCooldownRemaining(res.data.cooldown));
        setPenalty(res.data.cooldown >= 60);
      }
    } catch (e: any) {
      setError(e?.response?.data?.message || '쿨다운 상태 조회 실패');
    }
  }, [userToken, dispatch]);

  return { cooldown, penalty, error, refreshCooldown };
} 