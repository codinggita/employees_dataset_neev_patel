import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

/**
 * Custom Modal/Dialog component in Modern SaaS style.
 * Features rounded corners, header close button, and blurred backdrop.
 */
export default function Modal({
  open,
  onClose,
  title,
  children,
  actions,
  fullWidth = true,
  maxWidth = 'sm',
  ...props
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      slotProps={{
        backdrop: {
          sx: {
            backdropFilter: 'blur(8px)',
            backgroundColor: 'rgba(15, 23, 42, 0.3)',
          },
        },
      }}
      PaperProps={{
        sx: {
          borderRadius: '20px',
          boxShadow: '0px 25px 50px -12px rgba(0, 0, 0, 0.15)',
          overflow: 'hidden',
          p: 0,
        },
      }}
      {...props}
    >
      {title && (
        <DialogTitle
          sx={{
            m: 0,
            p: 3,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="h6" fontWeight={700} color="text.primary">
            {title}
          </Typography>
          {onClose && (
            <IconButton
              onClick={onClose}
              aria-label="close"
              sx={{
                color: 'text.secondary',
                transition: 'all 0.2s',
                '&:hover': {
                  color: 'text.primary',
                  backgroundColor: 'action.hover',
                },
              }}
            >
              <CloseIcon />
            </IconButton>
          )}
        </DialogTitle>
      )}
      <DialogContent sx={{ px: 3, py: title ? 1 : 3, pb: actions ? 1 : 3 }}>
        {children}
      </DialogContent>
      {actions && (
        <DialogActions sx={{ px: 3, py: 2.5, gap: 1.5, borderTop: '1px solid rgba(0, 0, 0, 0.06)' }}>
          {actions}
        </DialogActions>
      )}
    </Dialog>
  );
}
