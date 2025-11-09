const BACKEND = (typeof window !== 'undefined' && window.__POST_CONTENT_URL__) ? window.__POST_CONTENT_URL__ : 'http://localhost:5173';

export const postContentService = {
  fetchPosts: async () => {
    const res = await fetch(`${BACKEND}/post-content`);
    if (!res.ok) throw new Error('Failed to fetch post content');
    const json = await res.json();
    return json.data || [];
  }
};
