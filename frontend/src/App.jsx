import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Typography, Button, Paper, Stack } from '@mui/material';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import { lightTheme } from './theme';
import { Provider } from 'react-redux';
import store from './store';

function App() {
  return (
    <ThemeProvider theme={lightTheme}>
      <Provider store={store}>
        <CssBaseline />
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: (theme) => theme.palette.background.default,
            p: 3,
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 6,
              maxWidth: 520,
              width: '100%',
              textAlign: 'center',
            }}
          >
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #6366F1 0%, #818CF8 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3,
              }}
            >
              <RocketLaunchIcon sx={{ fontSize: 32, color: '#fff' }} />
            </Box>

            <Typography variant="h4" gutterBottom sx={{ color: 'text.primary' }}>
              Project Initialized
            </Typography>

            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
              Vite + React + MUI + Tailwind CSS + Redux Store are configured and ready to go.
              Start building your employee management system!
            </Typography>

            <Stack direction="row" spacing={2} justifyContent="center">
              <Button variant="contained" size="large">
                Get Started
              </Button>
              <Button variant="outlined" size="large">
                Learn More
              </Button>
            </Stack>

            <Typography
              variant="caption"
              sx={{ display: 'block', mt: 4, color: 'text.secondary' }}
            >
              Edit <code>src/App.jsx</code> to start building
            </Typography>
          </Paper>
        </Box>
      </Provider>
    </ThemeProvider>
  );
}

export default App;


