
// Local storage keys
const WATCHED_EPISODES_KEY = 'anime_watched_episodes';
const EPISODE_PROGRESS_KEY = 'anime_episode_progress';

// Types
interface EpisodeProgress {
  animeId: string;
  episodeId: string;
  timestamp: number;
  duration: number;
  percentage: number;
}

// Get all watched episodes
export const getWatchedEpisodes = (): Record<string, string[]> => {
  try {
    const stored = localStorage.getItem(WATCHED_EPISODES_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Error getting watched episodes:', error);
    return {};
  }
};

// Mark episode as watched
export const markEpisodeAsWatched = (animeId: string, episodeId: string): void => {
  try {
    const watchedEpisodes = getWatchedEpisodes();
    
    if (!watchedEpisodes[animeId]) {
      watchedEpisodes[animeId] = [];
    }
    
    if (!watchedEpisodes[animeId].includes(episodeId)) {
      watchedEpisodes[animeId].push(episodeId);
    }
    
    localStorage.setItem(WATCHED_EPISODES_KEY, JSON.stringify(watchedEpisodes));
  } catch (error) {
    console.error('Error marking episode as watched:', error);
  }
};

// Check if episode is watched
export const isEpisodeWatched = (animeId: string, episodeId: string): boolean => {
  const watchedEpisodes = getWatchedEpisodes();
  return watchedEpisodes[animeId]?.includes(episodeId) || false;
};

// Get episode progress
export const getEpisodeProgress = (animeId: string, episodeId: string): EpisodeProgress | null => {
  try {
    const stored = localStorage.getItem(EPISODE_PROGRESS_KEY);
    const progress = stored ? JSON.parse(stored) : {};
    const key = `${animeId}_${episodeId}`;
    
    return progress[key] || null;
  } catch (error) {
    console.error('Error getting episode progress:', error);
    return null;
  }
};

// Save episode progress
export const saveEpisodeProgress = (
  animeId: string,
  episodeId: string,
  timestamp: number,
  duration: number
): void => {
  try {
    const stored = localStorage.getItem(EPISODE_PROGRESS_KEY);
    const progress = stored ? JSON.parse(stored) : {};
    const key = `${animeId}_${episodeId}`;
    
    // Calculate percentage
    const percentage = Math.min(Math.round((timestamp / duration) * 100), 100);
    
    // Save progress
    progress[key] = {
      animeId,
      episodeId,
      timestamp,
      duration,
      percentage,
      updatedAt: Date.now()
    };
    
    localStorage.setItem(EPISODE_PROGRESS_KEY, JSON.stringify(progress));
    
    // Mark as watched if more than 90% complete
    if (percentage > 90) {
      markEpisodeAsWatched(animeId, episodeId);
    }
  } catch (error) {
    console.error('Error saving episode progress:', error);
  }
};

// Get all episodes in progress
export const getAllEpisodesInProgress = (): EpisodeProgress[] => {
  try {
    const stored = localStorage.getItem(EPISODE_PROGRESS_KEY);
    const progress = stored ? JSON.parse(stored) : {};
    
    return Object.values(progress);
  } catch (error) {
    console.error('Error getting episodes in progress:', error);
    return [];
  }
};

// Clear episode progress
export const clearEpisodeProgress = (animeId: string, episodeId: string): void => {
  try {
    const stored = localStorage.getItem(EPISODE_PROGRESS_KEY);
    const progress = stored ? JSON.parse(stored) : {};
    const key = `${animeId}_${episodeId}`;
    
    if (progress[key]) {
      delete progress[key];
      localStorage.setItem(EPISODE_PROGRESS_KEY, JSON.stringify(progress));
    }
  } catch (error) {
    console.error('Error clearing episode progress:', error);
  }
};
