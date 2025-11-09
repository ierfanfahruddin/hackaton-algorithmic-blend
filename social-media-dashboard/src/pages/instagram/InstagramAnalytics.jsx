import React from 'react';
import { Grid, Paper, Typography } from '@mui/material';
import EngagementChart from '../../components/charts/EngagementChart';

const InstagramAnalytics = () => {
  // Sample data - nanti akan diambil dari API
  const engagementData = [
    { date: '2025-01', likes: 200, comments: 45, shares: 10 },
    { date: '2025-02', likes: 250, comments: 55, shares: 15 },
    { date: '2025-03', likes: 300, comments: 60, shares: 20 },
    // ... tambahkan data lainnya
  ];

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Instagram Analytics
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <EngagementChart 
            data={engagementData} 
            title="Instagram Engagement Over Time"
          />
        </Grid>
        
        {/* Tambahkan komponen analitik lainnya di sini */}
      </Grid>
    </div>
  );
};

export default InstagramAnalytics;