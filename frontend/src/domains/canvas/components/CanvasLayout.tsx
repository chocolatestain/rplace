import React from 'react';
import { Grid, Box } from '@mui/material';
import PalettePanel from './PalettePanel';
import TimerPanel from './TimerPanel';

const CanvasLayout: React.FC = () => {
  return (
    <Grid container sx={{ height: '100vh' }}>
      {/* Palette - left on desktop, top on mobile */}
      <Grid item xs={12} md={2} order={{ xs: 1, md: 1 }}>
        <PalettePanel />
      </Grid>

      {/* Canvas area */}
      <Grid
        item
        xs={12}
        md={8}
        order={{ xs: 2, md: 2 }}
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Box
          component="canvas"
          id="pixel-canvas"
          width={800}
          height={800}
          tabIndex={0}
          aria-label="픽셀 캔버스"
          sx={{ border: 1, borderColor: 'grey.300' }}
        />
      </Grid>

      {/* Timer - right on desktop, bottom on mobile */}
      <Grid item xs={12} md={2} order={{ xs: 3, md: 3 }}>
        <TimerPanel />
      </Grid>
    </Grid>
  );
};

export default CanvasLayout; 