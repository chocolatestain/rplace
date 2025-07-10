import React from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './shared/theme';
import CanvasLayout from './domains/canvas/components/CanvasLayout';

const App: React.FC = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <CanvasLayout />
  </ThemeProvider>
);

export default App; 