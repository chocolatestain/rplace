// JWT 토큰 관리 및 인증 상태 유틸

export function getJwtToken(): string | null {
  return localStorage.getItem('jwtToken');
}

export function setJwtToken(token: string) {
  localStorage.setItem('jwtToken', token);
}

export function removeJwtToken() {
  localStorage.removeItem('jwtToken');
}

export function isGuest(): boolean {
  return !getJwtToken();
}

// JWT payload(Base64) 파싱
export function parseJwtPayload(token: string): any | null {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

// JWT 만료(exp) 검증
export function isJwtExpired(token: string): boolean {
  const payload = parseJwtPayload(token);
  if (!payload || typeof payload.exp !== 'number') return true;
  // exp는 초 단위, Date.now()는 ms 단위
  return Date.now() / 1000 > payload.exp;
}

// (선택) 만료 여부 체크 등 추가 구현 가능 