import React from 'react';
import { Box, Typography, Paper, Alert } from '@mui/material';
import postContent from './post.json';

const PostContent = () => {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>AI-Generated Post</Typography>

      <Paper sx={{ p: 2, mt: 2 }}>
        {!postContent ? (
          <Alert severity="info">No post available yet.</Alert>
        ) : (
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography sx={{ mt: 1 }}>{postContent.postText}</Typography>
            {postContent.imageUrl && (
              <Box sx={{ mt: 1 }}>
                <img src={postContent.imageUrl} alt="post" style={{ maxWidth: '100%', height: 'auto' }} />
              </Box>
            )}
          </Paper>
        )}
      </Paper>
    </Box>
  );
};

export default PostContent;
