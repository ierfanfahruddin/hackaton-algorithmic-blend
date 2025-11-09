import React from 'react';
import { Box } from '@mui/material';

const MainLayout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex' }}>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          marginLeft: '240px', // Sama dengan lebar Sidebar
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default MainLayout;