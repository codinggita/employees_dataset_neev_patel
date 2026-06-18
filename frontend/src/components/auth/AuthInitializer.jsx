import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getProfile } from '../../store/slices/authSlice';
import { TOKEN_KEY } from '../../utils/constants';
import { Box, CircularProgress } from '@mui/material';

/**
 * AuthInitializer — Mount wrapper that checks for an existing token on app load.
 * If a token is found in localStorage, dispatches getProfile() to restore user state.
 * Shows a full-screen spinner while checking, then renders children.
 */
export default function AuthInitializer({ children }) {
  const dispatch = useDispatch();
  const [initialized, setInitialized] = useState(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    return !storedToken;
  });

  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);

    if (storedToken) {
      // Token exists — try to restore the user session
      dispatch(getProfile())
        .finally(() => {
          setInitialized(true);
        });
    }
  }, [dispatch]);

  if (!initialized) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          width: '100vw',
          bgcolor: 'background.default',
        }}
      >
        <CircularProgress color="primary" size={48} />
      </Box>
    );
  }

  return children;
}

