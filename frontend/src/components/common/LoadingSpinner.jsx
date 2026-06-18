import React from 'react';
import { Box, CircularProgress } from '@mui/material';

export default function LoadingSpinner() {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '200px',
        width: '100%',
        flexGrow: 1,
      }}
    >
      <CircularProgress color="primary" />
    </Box>
  );
}
