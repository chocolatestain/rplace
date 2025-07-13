import React from 'react';
import CooldownTimer from './CooldownTimer';

const TimerPanel: React.FC = () => {
  return (
    <div>
      <h2>쿨다운 타이머</h2>
      <CooldownTimer />
    </div>
  );
};

export default TimerPanel; 