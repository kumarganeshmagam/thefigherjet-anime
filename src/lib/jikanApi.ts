
import { useQuery } from '@tanstack/react-query';
import { Anime, Episode, Genre, Season } from '@/types/anime';

const BASE_URL = 'https://api.jikan.moe/v4';

// Helper function to handle API rate limiting
const fetchWithRetry = async (url: string, retries = 3, delay = 1000) => {
  try {
    const response = await fetch(url);
    
    // If we hit rate limit, wait and retry
    if (response.status === 429) {
      if (retries > 0) {
        console.log(`Rate limited, retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return fetchWithRetry(url, retries - 1, delay * 2);
      } else {
        throw new Error('API rate limit exceeded');
      }
    }
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

// Convert Jikan anime to our app's format
const mapJikanAnimeToAnime = (jikanAnime: any): Anime => {
  // Create dummy seasons and episodes since Jikan doesn't provide those directly
  const episodes: Episode[] = Array.from({ length: jikanAnime.episodes || 1 }, (_, i) => ({
    id: `${jikanAnime.mal_id}_ep${i + 1}`,
    title: `Episode ${i + 1}`,
    description: jikanAnime.synopsis || 'No description available',
    thumbnail: jikanAnime.images?.jpg?.image_url || '',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', // Placeholder video
    duration: '24 min',
    seasonNumber: 1,
    episodeNumber: i + 1
  }));

  const season: Season = {
    id: `${jikanAnime.mal_id}_s1`,
    title: 'Season 1',
    episodes: episodes
  };

  const genres: Genre[] = (jikanAnime.genres || []).map((genre: any) => ({
    id: String(genre.mal_id),
    name: genre.name
  }));

  return {
    id: String(jikanAnime.mal_id),
    title: jikanAnime.title || 'Unknown Title',
    description: jikanAnime.synopsis || 'No description available',
    coverImage: jikanAnime.images?.jpg?.large_image_url || jikanAnime.images?.jpg?.image_url || '',
    bannerImage: jikanAnime.images?.jpg?.large_image_url || jikanAnime.images?.jpg?.image_url || '',
    genres: genres,
    seasons: [season],
    releaseYear: new Date(jikanAnime.aired?.from || Date.now()).getFullYear(),
    status: jikanAnime.status || 'Unknown',
    type: jikanAnime.type || 'TV',
    rating: jikanAnime.score || 0
  };
};

// API Calls
export const getTopAnimes = async (limit = 10): Promise<Anime[]> => {
  const data = await fetchWithRetry(`${BASE_URL}/top/anime?limit=${limit}`);
  return data.data.map(mapJikanAnimeToAnime);
};

export const getSeasonalAnimes = async (limit = 10): Promise<Anime[]> => {
  const data = await fetchWithRetry(`${BASE_URL}/seasons/now?limit=${limit}`);
  return data.data.map(mapJikanAnimeToAnime);
};

export const getAnimeById = async (id: string): Promise<Anime | null> => {
  try {
    const data = await fetchWithRetry(`${BASE_URL}/anime/${id}`);
    return mapJikanAnimeToAnime(data.data);
  } catch (error) {
    console.error('Error fetching anime by ID:', error);
    return null;
  }
};

export const searchAnimes = async (query: string, limit = 10): Promise<Anime[]> => {
  const data = await fetchWithRetry(`${BASE_URL}/anime?q=${encodeURIComponent(query)}&limit=${limit}`);
  return data.data.map(mapJikanAnimeToAnime);
};

export const getSchedule = async (): Promise<Record<string, Anime[]>> => {
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const schedule: Record<string, Anime[]> = {};
  
  for (const day of days) {
    const data = await fetchWithRetry(`${BASE_URL}/schedules?filter=${day}`);
    schedule[day] = data.data.map(mapJikanAnimeToAnime);
  }
  
  return schedule;
};

// React Query hooks
export const useTopAnimes = (limit = 10) => {
  return useQuery({
    queryKey: ['topAnimes', limit],
    queryFn: () => getTopAnimes(limit),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};

export const useSeasonalAnimes = (limit = 10) => {
  return useQuery({
    queryKey: ['seasonalAnimes', limit],
    queryFn: () => getSeasonalAnimes(limit),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};

export const useAnimeById = (id: string | undefined) => {
  return useQuery({
    queryKey: ['anime', id],
    queryFn: () => id ? getAnimeById(id) : Promise.resolve(null),
    staleTime: 1000 * 60 * 60, // 1 hour
    enabled: !!id,
  });
};

export const useSearchAnimes = (query: string, limit = 10) => {
  return useQuery({
    queryKey: ['searchAnimes', query, limit],
    queryFn: () => searchAnimes(query, limit),
    staleTime: 1000 * 60 * 60, // 1 hour
    enabled: query.length > 2,
  });
};

export const useAnimeSchedule = () => {
  return useQuery({
    queryKey: ['animeSchedule'],
    queryFn: getSchedule,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};
