import { useState } from 'react';
import axios from 'axios';
import { removeJwtToken, isJwtExpired } from '../../../shared/jwt';

interface SetPixelParams {
  x: number;
  y: number;
  color: string;
}

interface UsePixelApiResult {
  setPixel: (params: SetPixelParams) => Promise<void>;
  loading: boolean;
  error: string | null;
  cooldown: number;
}

interface UsePixelApiOptions {
  jwtToken?: string;
  onAuthError?: () => void;
}

export function usePixelApi(options?: UsePixelApiOptions): UsePixelApiResult {
  const jwtToken = options?.jwtToken;
  const onAuthError = options?.onAuthError;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  const setPixel = async (params: SetPixelParams) => {
    setLoading(true);
    setError(null);
    try {
      if (jwtToken && isJwtExpired(jwtToken)) {
        removeJwtToken();
        setError('인증이 만료되었습니다. <a href="/login">다시 로그인</a>해 주세요.');
        if (onAuthError) onAuthError();
        setLoading(false);
        return;
      }
      const res = await axios.post(
        '/api/pixel',
        params,
        {
          headers: jwtToken ? { Authorization: `Bearer ${jwtToken}` } : {},
        }
      );
      // 서버에서 남은 쿨다운(초) 반환 시 반영
      if (res.data && typeof res.data.cooldown === 'number') {
        setCooldown(res.data.cooldown);
      } else {
        setCooldown(0);
      }
    } catch (e: any) {
      setError(e?.response?.data?.message || '픽셀 전송 실패');
      if (e?.response?.data?.cooldown) {
        setCooldown(e.response.data.cooldown);
      }
    } finally {
      setLoading(false);
    }
  };

  return { setPixel, loading, error, cooldown };
} 