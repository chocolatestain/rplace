import React from 'react';
import { Alert, Box, Typography, CircularProgress } from '@mui/material';
import { useCooldown } from '../hooks/useCooldown';

interface CooldownTimerProps {
  userToken?: string;
}

const CooldownTimer: React.FC<CooldownTimerProps> = ({ userToken }) => {
  const { cooldown, penalty, error, refreshCooldown } = useCooldown(userToken);

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        쿨다운 상태를 불러오지 못했습니다. <button onClick={refreshCooldown}>재시도</button>
      </Alert>
    );
  }

  if (penalty) {
    return (
      <Alert severity="warning" sx={{ mb: 2 }}>
        쿨다운 위반으로 1분 페널티가 적용되었습니다.<br />
        남은 시간: <b>{cooldown}</b>초
      </Alert>
    );
  }

  if (cooldown > 0) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <CircularProgress size={20} sx={{ mr: 1 }} />
        <Typography variant="body2" aria-live="polite">
          쿨다운 중: <b>{cooldown}</b>초 후 다시 그릴 수 있습니다.
        </Typography>
      </Box>
    );
  }

  return (
    <Typography variant="body2" color="success.main" sx={{ mb: 2 }} aria-live="polite">
      지금 바로 픽셀을 그릴 수 있습니다!
    </Typography>
  );
};

export default CooldownTimer; 