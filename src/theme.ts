import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#10b981', // Emerald-500
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#64748b', // Slate-500
    },
    background: {
      default: '#020617', // Slate-950
      paper: '#0f172a', // Slate-900
    },
    text: {
      primary: '#f1f5f9', // Slate-100
      secondary: '#94a3b8', // Slate-400
    },
  },
  typography: {
    fontFamily: '"Inter", system-ui, sans-serif',
    button: {
      textTransform: 'none', // No uppercase buttons
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none', // Remove default gradient overlay
        },
      },
    },
  },
});
