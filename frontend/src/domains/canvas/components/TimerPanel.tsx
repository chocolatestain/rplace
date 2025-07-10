import React from 'react';
import { Box, Typography } from '@mui/material';

const TimerPanel: React.FC = () => (
  <Box p={2} role="contentinfo" aria-label="쿨다운 타이머">
    <Typography variant="h6" gutterBottom>
      타이머
    </Typography>
    <Typography variant="h4" component="div" aria-live="polite">
      0
    </Typography>
  </Box>
);

export default TimerPanel; 