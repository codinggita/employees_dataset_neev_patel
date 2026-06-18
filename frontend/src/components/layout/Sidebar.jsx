import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
  Box,
  Typography,
  Avatar,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSidebar } from '../../store/slices/uiSlice';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import BubbleChartIcon from '@mui/icons-material/BubbleChart';

const sidebarWidth = 240;
const collapsedWidth = 72;

/**
 * Sidebar layout component with permanent collapsible drawer.
 */
export default function Sidebar() {
  const dispatch = useDispatch();
  const sidebarOpen = useSelector((state) => state.ui.sidebarOpen);

  // Nav items configuration
  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Employees', icon: <PeopleIcon />, path: '/employees' },
    { text: 'Analytics', icon: <BarChartIcon />, path: '/analytics' },
    { text: 'Stats', icon: <QueryStatsIcon />, path: '/stats' },
    { text: 'Search', icon: <SearchIcon />, path: '/search' },
    { text: 'Profile', icon: <AccountCircleIcon />, path: '/profile' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
  ];

  // Visual active highlight based on path
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: sidebarOpen ? sidebarWidth : collapsedWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        '& .MuiDrawer-paper': {
          width: sidebarOpen ? sidebarWidth : collapsedWidth,
          transition: (theme) =>
            theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          overflowX: 'hidden',
          borderRight: '1px solid rgba(0, 0, 0, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        },
      }}
    >
      <Box>
        {/* Sidebar Header / Brand Logo */}
        <Box
          sx={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            px: sidebarOpen ? 2.5 : 1.5,
            gap: 1.5,
          }}
        >
          <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
            <BubbleChartIcon />
          </Avatar>
          {sidebarOpen && (
            <Typography variant="h6" fontWeight={800} color="primary.main">
              EmpSphere
            </Typography>
          )}
        </Box>
        <Divider />

        {/* Menu Navigation Items */}
        <List sx={{ px: 1, py: 2 }}>
          {menuItems.map((item) => {
            const isActive = currentPath === item.path;
            return (
              <ListItem key={item.text} disablePadding sx={{ display: 'block', mb: 0.5 }}>
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: sidebarOpen ? 'initial' : 'center',
                    px: 2.5,
                    borderRadius: '8px',
                    backgroundColor: isActive ? 'primary.light' : 'transparent',
                    color: isActive ? 'primary.contrastText' : 'text.primary',
                    '&:hover': {
                      backgroundColor: isActive ? 'primary.main' : 'action.hover',
                      color: isActive ? 'primary.contrastText' : 'text.primary',
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: sidebarOpen ? 3 : 'auto',
                      justifyContent: 'center',
                      color: isActive ? 'primary.contrastText' : 'text.secondary',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {sidebarOpen && (
                    <ListItemText
                      primary={item.text}
                      primaryTypographyProps={{ fontWeight: 600, fontSize: '0.875rem' }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      {/* Bottom Toggle Control */}
      <Box>
        <Divider />
        <Box sx={{ display: 'flex', justifyContent: sidebarOpen ? 'flex-end' : 'center', p: 1 }}>
          <IconButton onClick={() => dispatch(toggleSidebar())}>
            {sidebarOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </Box>
      </Box>
    </Drawer>
  );
}
