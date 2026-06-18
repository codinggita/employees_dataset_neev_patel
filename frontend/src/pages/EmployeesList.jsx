import React from 'react';
import Card from '../components/common/Card';
import { Typography } from '@mui/material';

export default function EmployeesList() {
  return (
    <Card title="Employees Directory">
      <Typography variant="body1" color="text.secondary">
        Browse, search, and manage all employees. This page will be built out in later phases.
      </Typography>
    </Card>
  );
}
