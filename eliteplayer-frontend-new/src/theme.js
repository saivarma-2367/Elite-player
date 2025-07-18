import { createTheme } from '@mui/material/styles';

export const getTheme = (mode) =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: '#007BFF',
      },
      secondary: {
        main: '#001F3F',
      },
      success: {
        main: '#32FF6A',
      },
      error: {
        main: '#FF4136',
      },
      warning: {
        main: '#FFDC00',
      },
      background: {
        default: mode === 'dark' ? '#121212' : '#F4F4F4',
        paper: mode === 'dark' ? '#1D1D1D' : '#FFFFFF',
      },
      text: {
        primary: mode === 'dark' ? '#FFFFFF' : '#1A1A1A',
      },
    },
    shape: {
      borderRadius: 12, // global rounded corners
    },
    spacing: 8, // base unit, e.g., theme.spacing(2) = 16px
    shadows: [
      'none',
      '0px 1px 3px rgba(0,0,0,0.2)',
      '0px 3px 6px rgba(0,0,0,0.3)',
      '0px 5px 10px rgba(0,0,0,0.4)',
      // ... add more if needed
    ],
    typography: {
      fontFamily: `'Roboto', sans-serif`,
      fontWeightLight: 300,
      fontWeightRegular: 400,
      fontWeightMedium: 500,
      fontWeightBold: 700,
      fontSize: 14, // base size (rem-based)
      h1: { fontSize: '2.5rem', fontWeight: 700 },
      h2: { fontSize: '2rem', fontWeight: 700 },
      h3: { fontSize: '1.75rem', fontWeight: 500 },
      body1: { fontSize: '1rem', fontWeight: 400 },
      body2: { fontSize: '0.875rem', fontWeight: 400 },
      caption: { fontSize: '0.75rem', fontWeight: 300 },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            textTransform: 'none', // keep button text case as written
            boxShadow: '0px 3px 6px rgba(0,0,0,0.2)',
            fontWeight: 500,
            padding: '8px 16px',
            '&:hover': {
              boxShadow: '0px 5px 10px rgba(0,0,0,0.3)',
            },
          },
          sizeSmall: {
            fontSize: '0.75rem',
            padding: '6px 12px',
          },
          sizeMedium: {
            fontSize: '0.875rem',
            padding: '8px 16px',
          },
          sizeLarge: {
            fontSize: '1rem',
            padding: '10px 20px',
          },
        },
      },
    },
    custom: {
      maxContentWidth: '1200px',
    },
  });
