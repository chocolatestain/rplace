import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../../shared/store';
import CanvasLayout from './CanvasLayout';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import * as pixelApi from '../hooks/usePixelApi';
import * as canvasSocket from '../hooks/useCanvasSocket';
import * as jwtUtil from '../../../shared/jwt';

expect.extend(toHaveNoViolations);

describe('CanvasLayout', () => {
  it('렌더링 시 주요 UI 요소가 모두 표시된다', () => {
    render(
      <Provider store={store}>
        <CanvasLayout />
      </Provider>
    );
    expect(screen.getByLabelText('픽셀 캔버스')).toBeInTheDocument();
    expect(screen.getByText('색상 팔레트')).toBeInTheDocument();
    expect(screen.getByText('쿨다운 타이머')).toBeInTheDocument();
  });

  it('캔버스 클릭 시 해당 픽셀만 색상이 바뀐다', () => {
    render(
      <Provider store={store}>
        <CanvasLayout />
      </Provider>
    );
    const canvas = screen.getByLabelText('픽셀 캔버스') as HTMLCanvasElement;
    // 임의 좌표 클릭
    fireEvent.mouseDown(canvas, { clientX: 10, clientY: 10 });
    // 픽셀 상태가 변경되었는지 확인 (store 직접 확인)
    const state = store.getState().canvas;
    const key = '2,2'; // 800/200=4px, 10/4=2
    expect(state.pixels[key]).toBeDefined();
  });

  it('접근성 위반이 없어야 한다(axe)', async () => {
    const { container } = render(
      <Provider store={store}>
        <CanvasLayout />
      </Provider>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe('CanvasLayout 통합 시나리오', () => {
  let setPixelMock: ReturnType<typeof vi.fn>;
  let onPixelEventMock: (event: any) => void;

  beforeEach(() => {
    setPixelMock = vi.fn();
    onPixelEventMock = vi.fn();
    vi.spyOn(pixelApi, 'usePixelApi').mockReturnValue({
      setPixel: setPixelMock,
      loading: false,
      error: null,
      cooldown: 0,
    });
    vi.spyOn(canvasSocket, 'useCanvasSocket').mockImplementation(({ onPixelEvent }: { onPixelEvent: (event: any) => void }) => {
      // 테스트에서 직접 onPixelEvent를 호출할 수 있도록 mock 저장
      if (onPixelEvent) onPixelEventMock = onPixelEvent;
    });
    vi.spyOn(jwtUtil, 'getJwtToken').mockReturnValue('mock-jwt');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('픽셀 클릭 시 REST API setPixel이 호출된다', () => {
    render(
      <Provider store={store}>
        <CanvasLayout />
      </Provider>
    );
    const canvas = screen.getByLabelText('픽셀 캔버스') as HTMLCanvasElement;
    fireEvent.mouseDown(canvas, { clientX: 20, clientY: 20 });
    expect(setPixelMock).toHaveBeenCalledWith({ x: 5, y: 5, color: expect.any(String) });
  });

  it('WebSocket 이벤트 수신 시 상태가 반영된다', () => {
    render(
      <Provider store={store}>
        <CanvasLayout />
      </Provider>
    );
    // 픽셀 이벤트 mock 호출
    onPixelEventMock({ x: 1, y: 1, color: '#000000' });
    const state = store.getState().canvas;
    expect(state.pixels['1,1']).toEqual({ x: 1, y: 1, color: '#000000' });
  });

  it('쿨다운/에러/로딩 UI 피드백이 정상 노출된다', () => {
    vi.spyOn(pixelApi, 'usePixelApi').mockReturnValue({
      setPixel: setPixelMock,
      loading: true,
      error: '에러 발생',
      cooldown: 3,
    });
    render(
      <Provider store={store}>
        <CanvasLayout />
      </Provider>
    );
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.getByText('에러 발생')).toBeInTheDocument();
    expect(screen.getByText(/쿨다운 중/)).toBeInTheDocument();
  });

  it('JWT/게스트 분기 동작이 정상이다', () => {
    vi.spyOn(jwtUtil, 'getJwtToken').mockReturnValueOnce(null); // 게스트
    render(
      <Provider store={store}>
        <CanvasLayout />
      </Provider>
    );
    // 게스트 분기: JWT가 없을 때도 정상 렌더링
    expect(screen.getByLabelText('픽셀 캔버스')).toBeInTheDocument();
  });

  it('반응형(모바일/데스크탑) UI가 정상 렌더링된다', () => {
    // 데스크탑
    window.innerWidth = 1200;
    window.dispatchEvent(new Event('resize'));
    render(
      <Provider store={store}>
        <CanvasLayout />
      </Provider>
    );
    expect(screen.getByText('색상 팔레트')).toBeInTheDocument();
    expect(screen.getByText('쿨다운 타이머')).toBeInTheDocument();
    // 모바일
    window.innerWidth = 375;
    window.dispatchEvent(new Event('resize'));
    render(
      <Provider store={store}>
        <CanvasLayout />
      </Provider>
    );
    expect(screen.getByText('색상 팔레트')).toBeInTheDocument();
    expect(screen.getByText('쿨다운 타이머')).toBeInTheDocument();
  });
}); 