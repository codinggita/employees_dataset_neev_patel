import React from 'react';
import Card from '../components/common/Card';
import { Typography } from '@mui/material';

export default function LoginPage() {
  return (
    <Card title="Login">
      <Typography variant="body1" color="text.secondary">
        Please sign in to access EmpSphere. This login form will be built in the next step.
      </Typography>
    </Card>
  );
}
