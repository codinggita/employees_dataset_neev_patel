import React from 'react';
import Card from '../components/common/Card';
import { Typography } from '@mui/material';

export default function ProfilePage() {
  return (
    <Card title="User Profile">
      <Typography variant="body1" color="text.secondary">
        Manage your user profile here. This page will display your account information and permissions in later phases.
      </Typography>
    </Card>
  );
}
