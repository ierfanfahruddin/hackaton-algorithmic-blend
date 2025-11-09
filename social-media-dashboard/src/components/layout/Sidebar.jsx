import React from 'react';
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { Facebook, Instagram, Chat } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();

  const menuItems = [
    { text: 'Facebook Analytics', icon: <Facebook />, path: '/facebook' },
    { text: 'Instagram Analytics', icon: <Instagram />, path: '/instagram' }
    ,{ text: 'Ai Respon', icon: <Facebook />, path: '/post-content' }
    ,{ text: 'Chatbot', icon: <Chat />, path: '/chatbot' }
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
        },
      }}
    >
      <Typography variant="h6" sx={{ p: 2 }}>
        Social Media Dashboard
      </Typography>
      <List>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.text}
            onClick={() => navigate(item.path)}
          >
            <ListItemIcon>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;