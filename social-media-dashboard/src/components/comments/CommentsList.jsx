import React from 'react';
import { List, ListItem, ListItemText, Avatar, ListItemAvatar, Typography, Paper } from '@mui/material';

const CommentsList = ({ comments, title = 'Komentar' }) => {
  if (!comments || comments.length === 0) {
    return (
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6">{title}</Typography>
        <Typography variant="body2">Belum ada komentar.</Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <List>
        {comments.map((c) => (
          <ListItem key={c.id} alignItems="flex-start">
            <ListItemAvatar>
              <Avatar>{(c.from && c.from.name && c.from.name[0]) || '?'}</Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={c.from && c.from.name ? c.from.name : 'Pengguna Facebook'}
              secondary={
                <>
                  <Typography component="span" variant="body2" color="text.primary">
                    {c.message}
                  </Typography>
                  <Typography component="div" variant="caption" color="text.secondary">
                    {new Date(c.created_time).toLocaleString()} • Likes: {c.like_count || 0}
                  </Typography>
                </>
              }
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default CommentsList;
