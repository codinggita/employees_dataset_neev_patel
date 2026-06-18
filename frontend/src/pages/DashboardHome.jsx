import React from 'react';
import Card from '../components/common/Card';
import { Typography } from '@mui/material';

export default function DashboardHome() {
  return (
    <Card title="Dashboard">
      <Typography variant="body1" color="text.secondary">
        Welcome to EmpSphere — your employee management dashboard. This page will be built out in later phases.
      </Typography>
    </Card>
  );
}
