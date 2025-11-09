import React, { useEffect, useState } from 'react';
import { Grid, Paper, Typography, CircularProgress, Alert } from '@mui/material';
import EngagementChart from '../../components/charts/EngagementChart';
import { socialMediaService } from '../../services/socialMediaService';
import CommentsList from '../../components/comments/CommentsList';

// Helper: normalize post list into monthly aggregates
const aggregatePostsByMonth = (posts = []) => {
  const map = new Map();

  posts.forEach((post) => {
    const created = post.created_time ? new Date(post.created_time) : null;
    if (!created) return;
    const monthKey = `${created.getUTCFullYear()}-${String(created.getUTCMonth() + 1).padStart(2, '0')}`;

    const likes = (post.likes && post.likes.summary && post.likes.summary.total_count) || 0;
    const comments = (post.comments && post.comments.summary && post.comments.summary.total_count) || 0;
    const shares = (post.shares && post.shares.count) || 0;

    if (!map.has(monthKey)) map.set(monthKey, { date: monthKey, likes: 0, comments: 0, shares: 0 });

    const agg = map.get(monthKey);
    agg.likes += likes;
    agg.comments += comments;
    agg.shares += shares;
  });

  // Convert to sorted array
  return Array.from(map.values()).sort((a, b) => (a.date > b.date ? 1 : -1));
};

const sampleData = [
  { date: '2025-01', likes: 100, comments: 20, shares: 15 },
  { date: '2025-02', likes: 120, comments: 25, shares: 18 },
  { date: '2025-03', likes: 150, comments: 30, shares: 25 },
];

const FacebookAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [engagementData, setEngagementData] = useState(sampleData);
  const [commentsForDisplay, setCommentsForDisplay] = useState([]);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Call the service we added. It returns the Graph API response for posts.
        const postsResponse = await socialMediaService.getFacebookPosts(50);

        // The service returns data object from Graph API. Try to access posts array.
        const posts = postsResponse && postsResponse.data ? postsResponse.data : [];

        const aggregated = aggregatePostsByMonth(posts);

        // Also fetch recent comments for the first few posts so we can show a comments list
        let commentsArray = [];
        try {
          const postsToFetch = posts.slice(0, 5);
          const commentPromises = postsToFetch.map(p => socialMediaService.getFacebookComments(p.id, 20).catch(e => {
            console.error('Failed to fetch comments for post', p.id, e);
            return null;
          }));

          const commentsResults = await Promise.all(commentPromises);
          commentsResults.forEach((res, idx) => {
            if (res && res.data) {
              // annotate each comment with post id and post message (if available)
              const annotated = res.data.map(c => ({ ...c, _postId: postsToFetch[idx].id, _postMessage: postsToFetch[idx].message }));
              commentsArray = commentsArray.concat(annotated);
            }
          });
        } catch (err) {
          console.error('Error fetching comments batch:', err);
        }

        if (mounted) {
          // update comments state regardless
          setCommentsForDisplay(commentsArray);
          if (aggregated.length > 0) {
            setEngagementData(aggregated);
          } else {
            // no posts found, keep sample data but display notice
            setError('No posts returned from Facebook API (using sample data).');
          }
        }
      } catch (err) {
        console.error('Failed to fetch Facebook posts:', err);
        if (mounted) {
          setError(err.message || 'Failed to fetch Facebook data');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Facebook Analytics
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, mb: 2 }}>
            {loading ? (
              <CircularProgress />
            ) : (
              <>
                {error && <Alert severity="warning">{error}</Alert>}
                <EngagementChart data={engagementData} title="Facebook Engagement Over Time" />
                  {/* Comments list for recent posts */}
                  <CommentsList comments={commentsForDisplay} title="Komentar Terbaru" />
              </>
            )}
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default FacebookAnalytics;