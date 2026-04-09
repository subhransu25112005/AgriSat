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
  const apiKey = import.meta.env.VITE_GNEWS_API_KEY;
  if (!apiKey) {
    throw new Error("MISSING_API_KEY");
  }

  // Using GNews API for better global coverage / free tier without localhost restrictions
  try {
    const res = await axios.get("https://gnews.io/api/v4/search", {
      params: {
        q: "agriculture OR farming OR crops OR mandi india",
        lang: "en",
        country: "in",
        max: 10,
        apikey: apiKey,
      }
    });

    return res.data.articles.map(article => ({
      title: article.title,
      description: article.description,
      image: article.image,
      source: article.source.name,
      publishedAt: article.publishedAt,
      url: article.url
    }));
  } catch (error) {
    console.error("News API Error:", error);
    throw new Error("API_ERROR");
  }
};
