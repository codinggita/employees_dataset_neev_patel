import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Typography } from '@mui/material';
import { lightTheme } from './theme';
import { Provider } from 'react-redux';
import store from './store';
import DashboardLayout from './components/layout/DashboardLayout';

function App() {
  return (
    <ThemeProvider theme={lightTheme}>
      <Provider store={store}>
        <CssBaseline />
        <DashboardLayout>
          <Typography variant="h5" fontWeight={700}>
            Dashboard Layout Shell Loaded Successfully!
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Use the chevron toggle button in the bottom left corner of the sidebar drawer panel to verify responsive collapsing behavior.
          </Typography>
        </DashboardLayout>
      </Provider>
    </ThemeProvider>
  );
}


export default App;


