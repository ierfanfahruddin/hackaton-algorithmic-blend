import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Box, Paper, Typography } from '@mui/material';

const EngagementChart = ({ data, title }) => {
  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Box sx={{ width: '100%', height: 300 }}>
        <LineChart
          width={800}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="likes" stroke="#8884d8" />
          <Line type="monotone" dataKey="comments" stroke="#82ca9d" />
          <Line type="monotone" dataKey="shares" stroke="#ffc658" />
        </LineChart>
      </Box>
    </Paper>
  );
};

export default EngagementChart;