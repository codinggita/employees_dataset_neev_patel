import React from 'react';
import Card from '../components/common/Card';
import { Typography } from '@mui/material';

export default function StatsDashboard() {
  return (
    <Card title="Stats Dashboard">
      <Typography variant="body1" color="text.secondary">
        Welcome to the Stats Dashboard. This page will display statistical tables and data in later phases.
      </Typography>
    </Card>
  );
}
