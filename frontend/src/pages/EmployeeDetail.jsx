import React from 'react';
import Card from '../components/common/Card';
import { Typography } from '@mui/material';
import { useParams } from 'react-router-dom';

export default function EmployeeDetail() {
  const { id } = useParams();
  return (
    <Card title={`Employee Detail — #${id}`}>
      <Typography variant="body1" color="text.secondary">
        Viewing details for employee ID: {id}. This page will be built out in later phases.
      </Typography>
    </Card>
  );
}
