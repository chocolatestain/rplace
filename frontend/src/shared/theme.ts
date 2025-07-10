import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#FF4500',
    },
    secondary: {
      main: '#2450A4',
    },
  },
  typography: {
    fontFamily: 'Roboto, "Noto Sans KR", sans-serif',
  },
});

export default theme; 