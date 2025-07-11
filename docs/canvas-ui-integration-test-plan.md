# 캔버스 UI 연동 구조 및 통합 테스트 전략

## 1. 연동 구조 개요
- **REST API**: 픽셀 클릭 시 POST /api/pixel로 서버에 픽셀 정보 전송(JWT 인증/게스트 분기)
- **WebSocket**: /ws/canvas 채널 구독, 서버에서 픽셀 변경 이벤트 수신 시 실시간 상태 반영
- **JWT 인증/게스트**: localStorage 기반 토큰 관리, 인증/비인증 분기 처리
- **쿨다운**: 서버 응답 및 실시간 이벤트로 남은 쿨다운 시간 동기화, UI에 안내
- **상태 관리**: Redux Toolkit slice로 픽셀, 쿨다운, 에러, 로딩 등 관리

## 2. 주요 컴포넌트/훅/유틸 구조
- `CanvasLayout.tsx`: UI/이벤트 처리, REST/WS 훅 연동, 상태/피드백 표시
- `usePixelApi.ts`: REST API 연동, 쿨다운/에러/로딩 관리
- `useCanvasSocket.ts`: WebSocket 구독, 실시간 이벤트 수신/상태 갱신
- `jwt.ts`: JWT 토큰 관리, 인증/게스트 분기 유틸
- `slice.ts`: 픽셀/쿨다운/에러/로딩 등 Redux 상태 관리

## 3. 통합 테스트 전략
- **mock 기반 테스트**: REST API(axios), WebSocket, JWT 등 외부 의존성은 모두 mock/spyon 처리
- **주요 시나리오**
  - 픽셀 클릭 시 REST API(setPixel) 호출 여부
  - WebSocket 이벤트 수신 시 상태 반영(onPixelEvent)
  - 쿨다운/에러/로딩 UI 피드백 노출 여부
  - JWT/게스트 분기 동작(토큰 유무에 따른 분기)
- **테스트 도구**: Vitest, React Testing Library, jest.spyOn/mock
- **테스트 파일**: `CanvasLayout.test.tsx`에 describe/it 구조로 통합 시나리오 테스트 작성

## 4. 체크리스트
- [x] REST/WS 연동 mock 구조 구현
- [x] 쿨다운/에러/로딩/인증 분기 UI 피드백 테스트
- [x] 주요 시나리오별 단위/통합 테스트 작성
- [x] 테스트 코드와 실제 연동 구조 일치 여부 검증

## 5. 참고
- 실서비스 환경에서는 E2E 테스트, WebSocket 서버 mock 등 추가 필요
- 이 문서는 개발/테스트 품질 추적 및 인수인계 참고용으로 활용 