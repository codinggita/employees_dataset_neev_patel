import React from 'react';
import { Card as MuiCard, CardContent, CardHeader, CardActions, Typography, Divider } from '@mui/material';

/**
 * Custom Card component in Modern SaaS style.
 * Wraps MUI Card with 16px rounded corners, soft shadows, and clean dividers.
 */
export default function Card({ title, children, actions, sx = {}, ...props }) {
  return (
    <MuiCard
      sx={{
        borderRadius: '16px',
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
        border: '1px solid rgba(0, 0, 0, 0.06)',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'background.paper',
        overflow: 'hidden',
        ...sx,
      }}
      {...props}
    >
      {title && (
        <>
          <CardHeader
            title={
              typeof title === 'string' ? (
                <Typography variant="h6" fontWeight={600} color="text.primary">
                  {title}
                </Typography>
              ) : (
                title
              )
            }
            sx={{ px: 3, py: 2 }}
          />
          <Divider sx={{ opacity: 0.6 }} />
        </>
      )}
      <CardContent sx={{ flexGrow: 1, p: 3, '&:last-child': { pb: 3 } }}>
        {children}
      </CardContent>
      {actions && (
        <>
          <Divider sx={{ opacity: 0.6 }} />
          <CardActions
            sx={{
              px: 3,
              py: 2,
              justifyContent: 'flex-end',
              gap: 1.5,
              backgroundColor: (theme) =>
                theme.palette.mode === 'light' ? '#F8F9FC' : 'rgba(255, 255, 255, 0.02)',
            }}
          >
            {actions}
          </CardActions>
        </>
      )}
    </MuiCard>
  );
}
