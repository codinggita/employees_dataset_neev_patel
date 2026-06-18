import React from 'react';
import { Paper, Box, Typography, Avatar } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

/**
 * Custom StatCard component in Modern SaaS style.
 * Displays dashboard metrics with colored icons and positive/negative trend values.
 */
export default function StatCard({
  title,
  value,
  icon: Icon,
  trend, // { value: "+12.5%", label: "vs last month", isPositive: true }
  color = 'primary', // 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
  sx = {},
  ...props
}) {
  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: '16px',
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
        border: '1px solid rgba(0, 0, 0, 0.06)',
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
        backgroundColor: 'background.paper',
        ...sx,
      }}
      {...props}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>
          {title}
        </Typography>
        {Icon && (
          <Avatar
            sx={{
              bgcolor: (theme) => {
                const c = theme.palette[color] || theme.palette.primary;
                return `${c.main}15`; // hex opacity (~8%)
              },
              color: (theme) => {
                const c = theme.palette[color] || theme.palette.primary;
                return c.main;
              },
              width: 48,
              height: 48,
            }}
          >
            <Icon sx={{ fontSize: 24 }} />
          </Avatar>
        )}
      </Box>

      <Box>
        <Typography variant="h4" fontWeight={700} sx={{ color: 'text.primary', letterSpacing: '-0.02em' }}>
          {value}
        </Typography>
      </Box>

      {trend && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              color: trend.isPositive ? 'success.main' : 'error.main',
              fontWeight: 600,
              fontSize: '0.875rem',
            }}
          >
            {trend.isPositive ? (
              <ArrowUpwardIcon sx={{ fontSize: 16, mr: 0.25 }} />
            ) : (
              <ArrowDownwardIcon sx={{ fontSize: 16, mr: 0.25 }} />
            )}
            {trend.value}
          </Box>
          <Typography variant="caption" color="text.secondary">
            {trend.label}
          </Typography>
        </Box>
      )}
    </Paper>
  );
}
