import React from 'react';
import Card from '../components/common/Card';
import { Typography, Box } from '@mui/material';

export default function NotFoundPage() {
  return (
    <Card title="404 - Page Not Found">
      <Box sx={{ py: 3, textAlignment: 'center' }}>
        <Typography variant="h5" color="error" gutterBottom>
          Oops! Page Not Found.
        </Typography>
        <Typography variant="body1" color="text.secondary">
          The page you are looking for does not exist, or you do not have permission to view it.
        </Typography>
      </Box>
    </Card>
  );
}
