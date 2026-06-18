import React from 'react';
import Card from '../components/common/Card';
import { Typography } from '@mui/material';

export default function SearchPage() {
  return (
    <Card title="Search Employees">
      <Typography variant="body1" color="text.secondary">
        Search for employees here. This page will include search filters and search results in later phases.
      </Typography>
    </Card>
  );
}
