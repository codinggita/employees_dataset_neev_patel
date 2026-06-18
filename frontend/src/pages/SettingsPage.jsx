import React from 'react';
import Card from '../components/common/Card';
import { Typography } from '@mui/material';

export default function SettingsPage() {
  return (
    <Card title="Settings">
      <Typography variant="body1" color="text.secondary">
        Configure application preferences and settings here. This page will be developed in later phases.
      </Typography>
    </Card>
  );
}
