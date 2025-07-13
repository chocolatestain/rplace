import { renderHook, act } from '@testing-library/react-hooks';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as canvasSocket from './useCanvasSocket';
import axios from 'axios';
import { useCooldown } from './useCooldown';
import React, { ReactNode } from 'react';

jest.mock('axios');

const mockStore = configureStore([thunk]);

describe('useCooldown', () => {
  let store: any;
  beforeEach(() => {
    store = mockStore({ canvas: { cooldownRemaining: 0 } });
    jest.spyOn(canvasSocket, 'useCanvasSocket').mockImplementation(() => {});
  });

  const wrapper: React.FC<{ children: ReactNode }> = ({ children }) => (
    <Provider store={store}>{children}</Provider>
  );

  it('기본적으로 쿨다운/페널티/에러가 0/false/null이다', () => {
    const { result } = renderHook(() => useCooldown(), { wrapper });
    expect(result.current.cooldown).toBe(0);
    expect(result.current.penalty).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('서버에서 쿨다운 상태를 받아오면 상태가 갱신된다', async () => {
    (axios.get as jest.Mock).mockResolvedValue({ data: { cooldown: 10 } });
    const { result } = renderHook(() => useCooldown(), { wrapper });
    await act(async () => {
      await result.current.refreshCooldown();
    });
    expect(result.current.cooldown).toBe(10);
    expect(result.current.penalty).toBe(false);
  });

  it('쿨다운이 60초 이상이면 페널티로 간주한다', async () => {
    (axios.get as jest.Mock).mockResolvedValue({ data: { cooldown: 65 } });
    const { result } = renderHook(() => useCooldown(), { wrapper });
    await act(async () => {
      await result.current.refreshCooldown();
    });
    expect(result.current.penalty).toBe(true);
  });

  it('서버 에러 발생 시 error 상태가 세팅된다', async () => {
    (axios.get as jest.Mock).mockRejectedValue({ response: { data: { message: '쿨다운 에러' } } });
    const { result } = renderHook(() => useCooldown(), { wrapper });
    await act(async () => {
      await result.current.refreshCooldown();
    });
    expect(result.current.error).toBe('쿨다운 에러');
  });
}); 