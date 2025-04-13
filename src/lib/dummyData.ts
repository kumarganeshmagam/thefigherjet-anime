
import { Anime, Genre, Season, Episode } from '../types/anime';

export const genres: Genre[] = [
  { id: 'g1', name: 'Action' },
  { id: 'g2', name: 'Adventure' },
  { id: 'g3', name: 'Comedy' },
  { id: 'g4', name: 'Drama' },
  { id: 'g5', name: 'Fantasy' },
  { id: 'g6', name: 'Horror' },
  { id: 'g7', name: 'Mystery' },
  { id: 'g8', name: 'Romance' },
  { id: 'g9', name: 'Sci-Fi' },
  { id: 'g10', name: 'Slice of Life' },
  { id: 'g11', name: 'Supernatural' },
  { id: 'g12', name: 'Thriller' }
];

// Helper function to generate episodes
const generateEpisodes = (seasonNumber: number, count: number, animeTitle: string): Episode[] => {
  return Array(count).fill(0).map((_, index) => ({
    id: `s${seasonNumber}e${index + 1}`,
    title: `${animeTitle} S${seasonNumber} Episode ${index + 1}`,
    description: `This is episode ${index + 1} of season ${seasonNumber} of ${animeTitle}.`,
    thumbnail: `https://picsum.photos/seed/${animeTitle.replace(/\s+/g, '')}-s${seasonNumber}e${index + 1}/300/200`,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    duration: '24:00',
    seasonNumber,
    episodeNumber: index + 1
  }));
};

// Helper function to generate seasons
const generateSeasons = (count: number, animeTitle: string, episodesPerSeason = 12): Season[] => {
  return Array(count).fill(0).map((_, index) => ({
    id: `season${index + 1}`,
    title: `Season ${index + 1}`,
    episodes: generateEpisodes(index + 1, episodesPerSeason, animeTitle)
  }));
};

export const animeList: Anime[] = [
  {
    id: 'anime1',
    title: 'Demon Slayer',
    description: 'Tanjiro Kamado, a young boy who becomes a demon slayer after his family is slaughtered and his younger sister Nezuko is turned into a demon.',
    coverImage: 'https://picsum.photos/seed/DemonSlayer/300/450',
    bannerImage: 'https://picsum.photos/seed/DemonSlayerBanner/1200/500',
    genres: [genres[0], genres[1], genres[4], genres[10]],
    seasons: generateSeasons(3, 'Demon Slayer'),
    releaseYear: 2019,
    status: 'Ongoing',
    type: 'TV',
    rating: 4.8
  },
  {
    id: 'anime2',
    title: 'Attack on Titan',
    description: 'In a world where humanity lives inside cities surrounded by enormous walls due to the Titans, gigantic humanoid creatures who devour humans seemingly without reason.',
    coverImage: 'https://picsum.photos/seed/AttackOnTitan/300/450',
    bannerImage: 'https://picsum.photos/seed/AttackOnTitanBanner/1200/500',
    genres: [genres[0], genres[3], genres[8], genres[11]],
    seasons: generateSeasons(4, 'Attack on Titan', 24),
    releaseYear: 2013,
    status: 'Completed',
    type: 'TV',
    rating: 4.9
  },
  {
    id: 'anime3',
    title: 'My Hero Academia',
    description: 'In a world where people with superpowers known as "Quirks" are the norm, a boy without superpowers dreams of becoming a superhero himself.',
    coverImage: 'https://picsum.photos/seed/MyHeroAcademia/300/450',
    bannerImage: 'https://picsum.photos/seed/MyHeroAcademiaBanner/1200/500',
    genres: [genres[0], genres[2], genres[4]],
    seasons: generateSeasons(6, 'My Hero Academia', 25),
    releaseYear: 2016,
    status: 'Ongoing',
    type: 'TV',
    rating: 4.7
  },
  {
    id: 'anime4',
    title: 'One Piece',
    description: 'Follows the adventures of Monkey D. Luffy and his pirate crew in order to find the greatest treasure ever left by the legendary Pirate, Gold Roger.',
    coverImage: 'https://picsum.photos/seed/OnePiece/300/450',
    bannerImage: 'https://picsum.photos/seed/OnePieceBanner/1200/500',
    genres: [genres[0], genres[1], genres[2], genres[4]],
    seasons: generateSeasons(20, 'One Piece', 50),
    releaseYear: 1999,
    status: 'Ongoing',
    type: 'TV',
    rating: 4.8
  },
  {
    id: 'anime5',
    title: 'Jujutsu Kaisen',
    description: 'A boy swallows a cursed talisman - the finger of a demon - and becomes cursed himself. He enters a shaman school to be able to locate the demon\'s other body parts and thus exorcise himself.',
    coverImage: 'https://picsum.photos/seed/JujutsuKaisen/300/450',
    bannerImage: 'https://picsum.photos/seed/JujutsuKaisenBanner/1200/500',
    genres: [genres[0], genres[4], genres[10], genres[11]],
    seasons: generateSeasons(2, 'Jujutsu Kaisen'),
    releaseYear: 2020,
    status: 'Ongoing',
    type: 'TV',
    rating: 4.8
  },
  {
    id: 'anime6',
    title: 'Your Lie in April',
    description: 'A piano prodigy who lost his ability to play after suffering a traumatic event meets a violinist who helps him return to the music world.',
    coverImage: 'https://picsum.photos/seed/YourLieInApril/300/450',
    bannerImage: 'https://picsum.photos/seed/YourLieInAprilBanner/1200/500',
    genres: [genres[3], genres[7], genres[9]],
    seasons: generateSeasons(1, 'Your Lie in April', 22),
    releaseYear: 2014,
    status: 'Completed',
    type: 'TV',
    rating: 4.9
  },
  {
    id: 'anime7',
    title: 'Haikyuu!!',
    description: 'High school student Shoyo Hinata joins the school volleyball team, aiming to be like his idol, the "Little Giant", despite his small stature.',
    coverImage: 'https://picsum.photos/seed/Haikyuu/300/450',
    bannerImage: 'https://picsum.photos/seed/HaikyuuBanner/1200/500',
    genres: [genres[2], genres[3], genres[9]],
    seasons: generateSeasons(4, 'Haikyuu!!'),
    releaseYear: 2014,
    status: 'Completed',
    type: 'TV',
    rating: 4.7
  },
  {
    id: 'anime8',
    title: 'Death Note',
    description: 'A high school student discovers a supernatural notebook that has deadly powers. When the student writes someone\'s name in it while picturing their face, they die.',
    coverImage: 'https://picsum.photos/seed/DeathNote/300/450',
    bannerImage: 'https://picsum.photos/seed/DeathNoteBanner/1200/500',
    genres: [genres[6], genres[11], genres[8]],
    seasons: generateSeasons(1, 'Death Note', 37),
    releaseYear: 2006,
    status: 'Completed',
    type: 'TV',
    rating: 4.9
  }
];

export const getAnimeById = (id: string): Anime | undefined => {
  return animeList.find(anime => anime.id === id);
};

export const getEpisodeById = (animeId: string, episodeId: string): Episode | undefined => {
  const anime = getAnimeById(animeId);
  if (!anime) return undefined;
  
  for (const season of anime.seasons) {
    const episode = season.episodes.find(ep => ep.id === episodeId);
    if (episode) return episode;
  }
  
  return undefined;
};

export const getSeasonById = (animeId: string, seasonId: string): Season | undefined => {
  const anime = getAnimeById(animeId);
  if (!anime) return undefined;
  
  return anime.seasons.find(season => season.id === seasonId);
};

export const getTopAnimes = (count: number = 5): Anime[] => {
  return [...animeList].sort((a, b) => b.rating - a.rating).slice(0, count);
};

export const getRecentAnimes = (count: number = 5): Anime[] => {
  return [...animeList].sort((a, b) => b.releaseYear - a.releaseYear).slice(0, count);
};

export const searchAnimes = (query: string): Anime[] => {
  const lowercaseQuery = query.toLowerCase();
  return animeList.filter(anime => 
    anime.title.toLowerCase().includes(lowercaseQuery) || 
    anime.description.toLowerCase().includes(lowercaseQuery) ||
    anime.genres.some(genre => genre.name.toLowerCase().includes(lowercaseQuery))
  );
};

export const filterAnimesByGenre = (genreId: string): Anime[] => {
  return animeList.filter(anime => 
    anime.genres.some(genre => genre.id === genreId)
  );
};

export const getAllEpisodes = (animeId: string): Episode[] => {
  const anime = getAnimeById(animeId);
  if (!anime) return [];
  
  return anime.seasons.flatMap(season => season.episodes);
};
