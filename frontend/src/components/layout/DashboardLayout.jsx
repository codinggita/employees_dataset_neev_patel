import React from 'react';
import { Box, Toolbar } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

/**
 * Main Layout wrapper wrapping top Navbar, collapsible Sidebar, and dynamic routing contents.
 */
export default function DashboardLayout({ children }) {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: 'background.default' }}>
      {/* Top fixed Appbar */}
      <Navbar />

      {/* Side permanent collapsible Drawer */}
      <Sidebar />

      {/* Main dashboard content container */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 4,
          width: '100%',
          overflowX: 'hidden',
        }}
      >
        {/* Helper Toolbar matches fixed Navbar height spacing */}
        <Toolbar />
        
        {/* Render child elements or react-router-dom Outlet */}
        {children || <Outlet />}
      </Box>
    </Box>
  );
}
