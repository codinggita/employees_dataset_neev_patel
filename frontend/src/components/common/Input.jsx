import React from 'react';
import { TextField } from '@mui/material';

/**
 * Custom Input component in Modern SaaS style.
 * Wraps MUI TextField with rounded corners and consistent bottom spacing.
 */
export default function Input({
  label,
  name,
  value,
  onChange,
  error = false,
  helperText = '',
  type = 'text',
  fullWidth = true,
  variant = 'outlined',
  sx = {},
  ...props
}) {
  return (
    <TextField
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      error={error}
      helperText={helperText}
      type={type}
      fullWidth={fullWidth}
      variant={variant}
      sx={{
        mb: 2.5,
        '& .MuiOutlinedInput-root': {
          borderRadius: '12px',
          transition: 'all 0.2s ease-in-out',
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'primary.light',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'primary.main',
            borderWidth: '2px',
          },
        },
        '& .MuiInputLabel-root': {
          fontWeight: 500,
        },
        ...sx,
      }}
      {...props}
    />
  );
}
