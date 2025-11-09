
import axios from 'axios';
import { facebookConfig, FACEBOOK_API_VERSION, FACEBOOK_GRAPH_URL } from '../config/facebook.config';

const BASE_URL = FACEBOOK_GRAPH_URL;

export const socialMediaService = {
  // Facebook Analytics
  getFacebookPageInfo: async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/${FACEBOOK_API_VERSION}/${facebookConfig.pageId}`,
        {
          params: {
            access_token: facebookConfig.accessToken,
            fields: 'name,category,fan_count,followers_count'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching Facebook page info:', error);
      throw error;
    }
  },

  getFacebookEngagement: async (timeRange = 'day') => {
    try {
      const response = await axios.get(
        `${BASE_URL}/${FACEBOOK_API_VERSION}/${facebookConfig.pageId}/insights`,
        {
          params: {
            access_token: facebookConfig.accessToken,
            metric: 'page_engaged_users,page_post_engagements,page_impressions',
            period: timeRange
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching Facebook engagement:', error);
      throw error;
    }
  },

  getFacebookPosts: async (limit = 10) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/${FACEBOOK_API_VERSION}/${facebookConfig.pageId}/posts`,
        {
          params: {
            access_token: facebookConfig.accessToken,
            fields: 'id,message,created_time,likes.summary(true),comments.summary(true),shares',
            limit
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching Facebook posts:', error);
      throw error;
    }
  },

  // Fetch comments for a specific post
  getFacebookComments: async (postId, limit = 20) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/${FACEBOOK_API_VERSION}/${postId}/comments`,
        {
          params: {
            access_token: facebookConfig.accessToken,
            fields: 'id,message,from,like_count,created_time',
            limit
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching comments for post ${postId}:`, error);
      throw error;
    }
  },

  // Instagram Analytics
  getInstagramEngagement: async (timeRange) => {
    try {
      const response = await axios.get(`${BASE_URL}/instagram/engagement`, {
        params: { timeRange }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching Instagram engagement:', error);
      throw error;
    }
  },

  // Tambahkan fungsi lain sesuai kebutuhan
};