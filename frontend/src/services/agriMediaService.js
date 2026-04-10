import axios from "axios";

/**
 * Real-time Media API Service
 * Fetches actual live data from YouTube and News API platforms.
 */

export const getAgriVideos = async () => {
  const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
  if (!apiKey) {
    throw new Error("MISSING_API_KEY");
  }

  // Fetching specifically short-form vertical videos (reels/shorts) by using videoDuration=short
  try {
    const res = await axios.get("https://www.googleapis.com/youtube/v3/search", {
      params: {
        part: "snippet",
        q: "agriculture shorts india farming tips",
        type: "video",
        videoDuration: "short",
        maxResults: 8,
        key: apiKey,
      }
    });

    return res.data.items.map(item => ({
      videoId: item.id.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.high.url,
      channel: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt
    }));
  } catch (error) {
    console.error("YouTube API Error:", error);
    throw new Error("API_ERROR");
  }
};

export const getAgriNews = async () => {
  const API_BASE = import.meta.env.VITE_API_URL;
  
  try {
    const res = await axios.get(`${API_BASE}/api/news`, { timeout: 15000 });

    if (res.data && res.data.articles) {
      return res.data.articles;
    }
    
    return []; // Return empty array if structure is unexpected
  } catch (error) {
    console.error("News API Proxy Error:", error);
    return []; // CRITICAL: Prevent UI crash by returning empty array
  }
};
