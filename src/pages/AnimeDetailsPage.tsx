
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import EpisodeSelector from '@/components/anime/EpisodeSelector';
import AnimeCarousel from '@/components/anime/AnimeCarousel';
import StarRating from '@/components/anime/StarRating';
import RatingModal from '@/components/anime/RatingModal';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Plus, Play, Star } from 'lucide-react';
import { getAnimeById, animeList } from '@/lib/dummyData';
import { Anime } from '@/types/anime';
import { useAuth } from '@/contexts/AuthContext';
import { addToWatchlist, getUserWatchlist, getAnimeRatings } from '@/lib/firebase';
import { toast } from 'sonner';

const AnimeDetailsPage = () => {
  const { animeId } = useParams<{ animeId: string }>();
  const [anime, setAnime] = useState<Anime | null>(null);
  const [similarAnimes, setSimilarAnimes] = useState<Anime[]>([]);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const { currentUser } = useAuth();
  
  useEffect(() => {
    if (animeId) {
      const animeData = getAnimeById(animeId);
      if (animeData) {
        setAnime(animeData);
        
        // Find similar animes (same genre)
        if (animeData.genres.length > 0) {
          const primaryGenre = animeData.genres[0];
          const similar = animeList
            .filter(a => 
              a.id !== animeId && 
              a.genres.some(g => g.id === primaryGenre.id)
            )
            .slice(0, 10);
          setSimilarAnimes(similar);
        }
      }
    }
  }, [animeId]);
  
  useEffect(() => {
    const checkWatchlist = async () => {
      if (currentUser && animeId) {
        try {
          const { watchlist } = await getUserWatchlist(currentUser.uid);
          const inList = watchlist.some(item => item.animeId === animeId);
          setIsInWatchlist(inList);
          
          // Get user rating if in watchlist
          const userItem = watchlist.find(item => item.animeId === animeId);
          if (userItem) {
            setUserRating(userItem.rating);
          }
        } catch (error) {
          console.error("Error checking watchlist:", error);
        }
      }
    };
    
    const fetchRatings = async () => {
      if (animeId) {
        try {
          const { averageRating, totalRatings } = await getAnimeRatings(animeId);
          setAverageRating(averageRating);
          setTotalRatings(totalRatings);
        } catch (error) {
          console.error("Error fetching ratings:", error);
        }
      }
    };
    
    checkWatchlist();
    fetchRatings();
  }, [currentUser, animeId]);
  
  const handleAddToWatchlist = async () => {
    if (!currentUser) {
      toast.error("Please log in to add to your watchlist");
      return;
    }
    
    if (!anime) return;
    
    try {
      const { error } = await addToWatchlist(
        currentUser.uid, 
        anime.id, 
        anime.title, 
        anime.coverImage
      );
      
      if (error) {
        if (error === "Anime already in watchlist") {
          setIsInWatchlist(true);
          toast.info(`${anime.title} is already in your watchlist`);
        } else {
          toast.error(error);
        }
      } else {
        setIsInWatchlist(true);
        toast.success(`${anime.title} added to your watchlist`);
      }
    } catch (error) {
      toast.error("Failed to add to watchlist");
      console.error(error);
    }
  };
  
  const handleRateAnime = () => {
    if (!currentUser) {
      toast.error("Please log in to rate anime");
      return;
    }
    
    if (!isInWatchlist) {
      toast.info("Please add to watchlist before rating");
      return;
    }
    
    setIsRatingModalOpen(true);
  };
  
  const handleRatingComplete = () => {
    // Refresh ratings
    if (animeId) {
      getAnimeRatings(animeId).then(({ averageRating, totalRatings }) => {
        setAverageRating(averageRating);
        setTotalRatings(totalRatings);
      });
    }
  };
  
  if (!anime) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <p>Anime not found</p>
        </div>
      </MainLayout>
    );
  }
  
  // Get the first episode of the first season for the "Watch Now" button
  const firstEpisode = anime.seasons[0]?.episodes[0];

  return (
    <MainLayout>
      {/* Banner with anime image */}
      <div
        className="relative w-full h-[50vh] md:h-[60vh] bg-cover bg-center"
        style={{ backgroundImage: `url(${anime.bannerImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 -mt-32 relative z-10">
          {/* Anime poster */}
          <div className="md:col-span-1">
            <img
              src={anime.coverImage}
              alt={anime.title}
              className="w-full rounded-lg shadow-lg"
            />
            
            <div className="mt-6 flex flex-col gap-3">
              {firstEpisode && (
                <Link to={`/anime/${anime.id}/watch/${firstEpisode.id}`}>
                  <Button className="w-full bg-anime-primary hover:bg-anime-secondary">
                    <Play size={18} className="mr-2" /> Watch Now
                  </Button>
                </Link>
              )}
              
              {!isInWatchlist ? (
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={handleAddToWatchlist}
                >
                  <Plus size={18} className="mr-2" /> Add to Watchlist
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleRateAnime}
                >
                  <Star size={18} className="mr-2" /> {userRating > 0 ? 'Edit Rating' : 'Rate Anime'}
                </Button>
              )}
            </div>
            
            <div className="mt-6 p-4 bg-gray-900 rounded-lg">
              <h3 className="font-semibold mb-2">Information</h3>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span className="text-gray-400">Type:</span>
                  <span>{anime.type}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-400">Released:</span>
                  <span>{anime.releaseYear}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-400">Status:</span>
                  <span>{anime.status}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-400">Seasons:</span>
                  <span>{anime.seasons.length}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-400">Episodes:</span>
                  <span>
                    {anime.seasons.reduce((total, season) => total + season.episodes.length, 0)}
                  </span>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Anime details */}
          <div className="md:col-span-2 text-white">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{anime.title}</h1>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center">
                <Star className="text-yellow-400 w-5 h-5 mr-1 fill-yellow-400" />
                <span className="font-semibold">{averageRating.toFixed(1)}</span>
                <span className="text-gray-400 text-sm ml-1">({totalRatings} ratings)</span>
              </div>
              
              <Separator orientation="vertical" className="h-5" />
              
              <div className="flex flex-wrap gap-2">
                {anime.genres.map((genre) => (
                  <Link 
                    key={genre.id} 
                    to={`/browse?genre=${genre.name.toLowerCase()}`}
                    className="bg-gray-800 hover:bg-gray-700 text-xs px-2 py-1 rounded transition-colors"
                  >
                    {genre.name}
                  </Link>
                ))}
              </div>
            </div>
            
            <p className="text-gray-300 mb-6">
              {anime.description}
            </p>
            
            {/* Episode selector */}
            <EpisodeSelector anime={anime} />
          </div>
        </div>
        
        {/* Similar anime section */}
        {similarAnimes.length > 0 && (
          <div className="mt-12">
            <AnimeCarousel 
              animes={similarAnimes}
              title="Similar Anime You Might Like"
            />
          </div>
        )}
      </div>
      
      {/* Rating modal */}
      <RatingModal
        animeId={anime.id}
        animeName={anime.title}
        isOpen={isRatingModalOpen}
        onClose={() => setIsRatingModalOpen(false)}
        onRated={handleRatingComplete}
        currentRating={userRating}
      />
    </MainLayout>
  );
};

export default AnimeDetailsPage;
