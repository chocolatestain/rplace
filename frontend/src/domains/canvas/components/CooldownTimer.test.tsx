import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CooldownTimer from './CooldownTimer';
import * as useCooldownHook from '../hooks/useCooldown';

jest.mock('../hooks/useCooldown');

describe('CooldownTimer', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('에러 상태일 때 에러 Alert와 재시도 버튼이 노출된다', () => {
    (useCooldownHook.useCooldown as jest.Mock).mockReturnValue({
      cooldown: 0,
      penalty: false,
      error: '쿨다운 에러',
      refreshCooldown: jest.fn(),
    });
    render(<CooldownTimer />);
    expect(screen.getByText(/쿨다운 상태를 불러오지 못했습니다/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /재시도/ })).toBeInTheDocument();
  });

  it('페널티 상태일 때 경고 Alert와 남은 시간 표시', () => {
    (useCooldownHook.useCooldown as jest.Mock).mockReturnValue({
      cooldown: 61,
      penalty: true,
      error: null,
      refreshCooldown: jest.fn(),
    });
    render(<CooldownTimer />);
    expect(screen.getByText(/1분 페널티/)).toBeInTheDocument();
    expect(screen.getByText(/남은 시간/)).toBeInTheDocument();
  });

  it('쿨다운 중일 때 CircularProgress와 남은 시간 안내', () => {
    (useCooldownHook.useCooldown as jest.Mock).mockReturnValue({
      cooldown: 5,
      penalty: false,
      error: null,
      refreshCooldown: jest.fn(),
    });
    render(<CooldownTimer />);
    expect(screen.getByText(/쿨다운 중/)).toBeInTheDocument();
    expect(screen.getByText(/5/)).toBeInTheDocument();
  });

  it('쿨다운이 0이면 즉시 그릴 수 있다는 안내', () => {
    (useCooldownHook.useCooldown as jest.Mock).mockReturnValue({
      cooldown: 0,
      penalty: false,
      error: null,
      refreshCooldown: jest.fn(),
    });
    render(<CooldownTimer />);
    expect(screen.getByText(/지금 바로 픽셀을 그릴 수 있습니다/)).toBeInTheDocument();
  });
}); 