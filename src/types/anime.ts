
export interface Episode {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  duration: string;
  seasonNumber: number;
  episodeNumber: number;
}

export interface Season {
  id: string;
  title: string;
  episodes: Episode[];
}

export interface Genre {
  id: string;
  name: string;
}

export interface Anime {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  bannerImage: string;
  genres: Genre[];
  seasons: Season[];
  releaseYear: number;
  status: string;
  type: string;
  rating: number;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userPhoto: string | null;
  content: string;
  createdAt: Date;
  likes: number;
}

export interface WatchlistItem {
  id: string;
  animeId: string;
  animeName: string;
  animeCover: string;
  addedAt: Date;
  rating: number;
}
