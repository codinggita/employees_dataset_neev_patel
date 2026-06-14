import { createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#818CF8',
      light: '#A5B4FC',
      dark: '#6366F1',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#F472B6',
      light: '#F9A8D4',
      dark: '#EC4899',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#0F172A',
      paper: '#1E293B',
    },
    text: {
      primary: '#F1F5F9',
      secondary: '#94A3B8',
    },
    divider: 'rgba(255, 255, 255, 0.08)',
    success: {
      main: '#34D399',
      light: '#6EE7B7',
      dark: '#10B981',
    },
    warning: {
      main: '#FBBF24',
      light: '#FDE68A',
      dark: '#F59E0B',
    },
    error: {
      main: '#F87171',
      light: '#FCA5A5',
      dark: '#EF4444',
    },
    info: {
      main: '#60A5FA',
      light: '#93C5FD',
      dark: '#3B82F6',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700, letterSpacing: '-0.02em' },
    h2: { fontWeight: 700, letterSpacing: '-0.01em' },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 500, color: '#94A3B8' },
    subtitle2: { fontWeight: 500, color: '#94A3B8' },
    button: { fontWeight: 600, textTransform: 'none' },
  },
  shape: {
    borderRadius: 16,
  },
  shadows: [
    'none',
    '0px 1px 3px rgba(0, 0, 0, 0.2)',
    '0px 2px 6px rgba(0, 0, 0, 0.2)',
    '0px 4px 12px rgba(0, 0, 0, 0.25)',
    '0px 4px 20px rgba(0, 0, 0, 0.3)',
    '0px 6px 24px rgba(0, 0, 0, 0.3)',
    '0px 8px 28px rgba(0, 0, 0, 0.35)',
    '0px 10px 32px rgba(0, 0, 0, 0.35)',
    '0px 12px 36px rgba(0, 0, 0, 0.4)',
    '0px 14px 40px rgba(0, 0, 0, 0.4)',
    ...Array(15).fill('0px 4px 20px rgba(0, 0, 0, 0.3)'),
  ],
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.3)',
          backgroundImage: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.3)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          backgroundImage: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 24px',
          fontSize: '0.875rem',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 4px 12px rgba(129, 140, 248, 0.3)',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: '0px 4px 12px rgba(129, 140, 248, 0.4)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          color: '#94A3B8',
          backgroundColor: '#0F172A',
        },
      },
    },
  },
});

export default darkTheme;
