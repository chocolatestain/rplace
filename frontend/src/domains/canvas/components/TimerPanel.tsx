import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, LinearProgress } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../../shared/store';

const TimerPanel: React.FC = () => {
  const cooldownRemaining = useSelector((state: RootState) => state.canvas.cooldownRemaining);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (cooldownRemaining > 0) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + (100 / (cooldownRemaining * 10)); // 10fps로 업데이트
          return newProgress >= 100 ? 100 : newProgress;
        });
      }, 100);

      return () => clearInterval(interval);
    } else {
      setProgress(0);
    }
  }, [cooldownRemaining]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" gutterBottom>
        쿨다운 타이머
      </Typography>
      
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {cooldownRemaining > 0 ? (
          <>
            <Typography variant="h4" align="center" color="primary" gutterBottom>
              {formatTime(cooldownRemaining)}
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={progress} 
              sx={{ height: 8, borderRadius: 4 }}
            />
            <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
              다음 픽셀까지 대기 중...
            </Typography>
          </>
        ) : (
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" color="success.main" gutterBottom>
              준비됨
            </Typography>
            <Typography variant="body2" color="text.secondary">
              픽셀을 그릴 수 있습니다
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default TimerPanel; 