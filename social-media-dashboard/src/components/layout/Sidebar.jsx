import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { Facebook, Instagram } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();

  const menuItems = [
    { text: 'Facebook Analytics', icon: <Facebook />, path: '/facebook' },
    { text: 'Instagram Analytics', icon: <Instagram />, path: '/instagram' }
    ,{ text: 'Post Content', icon: <Facebook />, path: '/post-content' }
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
          <ListItem
            button
            key={item.text}
            onClick={() => navigate(item.path)}
          >
            <ListItemIcon>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;