import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../../shared/store';
import CanvasLayout from './CanvasLayout';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';

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