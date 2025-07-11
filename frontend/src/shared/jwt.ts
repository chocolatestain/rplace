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

// (선택) 만료 여부 체크 등 추가 구현 가능 