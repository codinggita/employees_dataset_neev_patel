import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box, Avatar, Menu, MenuItem, Tooltip, Divider } from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { toggleTheme } from '../../store/slices/uiSlice';
import { logout } from '../../store/slices/authSlice';

const sidebarWidth = 240;
const collapsedWidth = 72;

/**
 * Navbar component fixed to the top header, adjusting for Collapsible Sidebar.
 */
export default function Navbar() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const sidebarOpen = useSelector((state) => state.ui.sidebarOpen);
  const themeMode = useSelector((state) => state.ui.theme);
  const user = useSelector((state) => state.auth.user);

  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogoutClick = () => {
    handleMenuClose();
    dispatch(logout());
    navigate('/login');
  };

  const userName = user?.name || 'Guest';

  // Determine page title based on path
  const currentPath = location.pathname;
  const getPageTitle = () => {
    if (currentPath.startsWith('/dashboard')) return 'Dashboard';
    if (currentPath.startsWith('/employees')) return 'Employees Directory';
    if (currentPath.startsWith('/analytics')) return 'Analytics Dashboard';
    if (currentPath.startsWith('/stats')) return 'System Statistics';
    if (currentPath.startsWith('/search')) return 'Employee Search';
    if (currentPath.startsWith('/profile')) return 'User Profile';
    if (currentPath.startsWith('/settings')) return 'Settings';
    return 'Management Board';
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        width: {
          sm: `calc(100% - ${sidebarOpen ? sidebarWidth : collapsedWidth}px)`,
        },
        ml: {
          sm: `${sidebarOpen ? sidebarWidth : collapsedWidth}px`,
        },
        transition: (theme) =>
          theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        backgroundColor: 'background.paper',
        color: 'text.primary',
        boxShadow: 'none',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', px: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="h6" fontWeight={700}>
            {getPageTitle()}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Theme Mode Toggle */}
          <IconButton color="inherit" size="medium" onClick={() => dispatch(toggleTheme())}>
            {themeMode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>

          {/* User Profile dropdown */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography
              variant="body2"
              fontWeight={600}
              sx={{ display: { xs: 'none', md: 'block' } }}
            >
              {userName}
            </Typography>
            <Tooltip title="Account settings">
              <IconButton onClick={handleMenuOpen} size="small" sx={{ p: 0 }}>
                <Avatar
                  sx={{
                    bgcolor: 'secondary.main',
                    width: 36,
                    height: 36,
                    fontWeight: 700,
                    fontSize: '0.9rem',
                  }}
                >
                  {userName.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              onClick={handleMenuClose}
              PaperProps={{
                sx: {
                  mt: 1.5,
                  borderRadius: '12px',
                  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
                  border: '1px solid rgba(0, 0, 0, 0.06)',
                  minWidth: 160,
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem onClick={() => { handleMenuClose(); navigate('/profile'); }}>My Profile</MenuItem>
              <MenuItem onClick={() => { handleMenuClose(); navigate('/settings'); }}>Settings</MenuItem>
              <Divider />
              <MenuItem onClick={handleLogoutClick} sx={{ color: 'error.main', fontWeight: 600 }}>
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
