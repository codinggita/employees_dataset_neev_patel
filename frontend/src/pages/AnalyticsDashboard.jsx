import React from 'react';
import Card from '../components/common/Card';
import { Typography } from '@mui/material';

export default function AnalyticsDashboard() {
  return (
    <Card title="Analytics Dashboard">
      <Typography variant="body1" color="text.secondary">
        Welcome to the Analytics Dashboard. This page will display analytics charts and data in later phases.
      </Typography>
    </Card>
  );
}
