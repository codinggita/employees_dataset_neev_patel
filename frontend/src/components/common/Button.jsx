import React from 'react';
import { Button as MuiButton, CircularProgress } from '@mui/material';

/**
 * Custom Button component in Modern SaaS style.
 * Wraps MUI Button with custom styling and loading states.
 */
export default function Button({
  variant = 'contained',
  color = 'primary',
  loading = false,
  fullWidth = false,
  children,
  onClick,
  sx = {},
  ...props
}) {
  const isPrimaryContained = variant === 'contained' && color === 'primary';

  return (
    <MuiButton
      variant={variant}
      color={color}
      fullWidth={fullWidth}
      onClick={onClick}
      disabled={loading || props.disabled}
      sx={{
        borderRadius: '12px',
        textTransform: 'none',
        fontWeight: 600,
        px: 3,
        py: 1.2,
        transition: 'all 0.2s ease-in-out',
        ...(isPrimaryContained && {
          background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
          color: '#ffffff',
          boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)',
          border: 'none',
          '&:hover': {
            background: 'linear-gradient(135deg, #4F46E5 0%, #3730A3 100%)',
            boxShadow: '0 6px 16px rgba(99, 102, 241, 0.3)',
          },
        }),
        ...sx,
      }}
      {...props}
    >
      {loading ? (
        <CircularProgress size={20} color="inherit" />
      ) : (
        children
      )}
    </MuiButton>
  );
}
