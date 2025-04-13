
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import StarRating from '@/components/anime/StarRating';
import RatingModal from '@/components/anime/RatingModal';
import { getAnimeById } from '@/lib/dummyData';
import { X, Play, Star } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getUserWatchlist, removeFromWatchlist } from '@/lib/firebase';
import { WatchlistItem } from '@/types/anime';
import { toast } from 'sonner';

const WatchlistPage = () => {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAnimeId, setSelectedAnimeId] = useState<string | null>(null);
  const [selectedAnimeName, setSelectedAnimeName] = useState<string>('');
  const [selectedAnimeRating, setSelectedAnimeRating] = useState<number>(0);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    const fetchWatchlist = async () => {
      setIsLoading(true);
      try {
        const { watchlist, error } = await getUserWatchlist(currentUser.uid);
        if (!error) {
          setWatchlist(watchlist || []);
        } else {
          toast.error("Failed to fetch watchlist");
        }
      } catch (error) {
        console.error("Error fetching watchlist:", error);
        toast.error("An error occurred while fetching watchlist");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchWatchlist();
  }, [currentUser, navigate]);
  
  const handleRemoveFromWatchlist = async (animeId: string, animeName: string) => {
    try {
      const { success, error } = await removeFromWatchlist(currentUser!.uid, animeId);
      
      if (success) {
        setWatchlist(prev => prev.filter(item => item.animeId !== animeId));
        toast.success(`${animeName} removed from watchlist`);
      } else {
        toast.error(error || "Failed to remove from watchlist");
      }
    } catch (error) {
      console.error("Error removing from watchlist:", error);
      toast.error("An error occurred");
    }
  };
  
  const handleOpenRatingModal = (animeId: string, animeName: string, rating: number) => {
    setSelectedAnimeId(animeId);
    setSelectedAnimeName(animeName);
    setSelectedAnimeRating(rating);
    setIsRatingModalOpen(true);
  };
  
  const handleRatingComplete = () => {
    // Refresh watchlist to get updated ratings
    if (currentUser) {
      getUserWatchlist(currentUser.uid).then(({ watchlist }) => {
        setWatchlist(watchlist || []);
      });
    }
  };
  
  const openFirstEpisode = (animeId: string) => {
    const anime = getAnimeById(animeId);
    if (anime && anime.seasons.length > 0 && anime.seasons[0].episodes.length > 0) {
      const firstEpisode = anime.seasons[0].episodes[0];
      navigate(`/anime/${animeId}/watch/${firstEpisode.id}`);
    } else {
      navigate(`/anime/${animeId}`);
    }
  };
  
  // Filter rated and unrated animes
  const ratedAnimes = watchlist.filter(item => item.rating > 0);
  const unratedAnimes = watchlist.filter(item => item.rating === 0);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">My Watchlist</h1>
        
        {isLoading ? (
          <div className="text-center py-12">
            <p>Loading watchlist...</p>
          </div>
        ) : watchlist.length === 0 ? (
          <div className="text-center py-12 bg-gray-900 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Your watchlist is empty</h3>
            <p className="mb-6 text-gray-400">Start adding some anime to your watchlist</p>
            <Button 
              onClick={() => navigate('/browse')}
              className="bg-anime-primary hover:bg-anime-secondary"
            >
              Browse Anime
            </Button>
          </div>
        ) : (
          <Tabs defaultValue="all">
            <TabsList className="w-full mb-6 bg-gray-900 border-b border-gray-800">
              <TabsTrigger value="all">All ({watchlist.length})</TabsTrigger>
              <TabsTrigger value="rated">Rated ({ratedAnimes.length})</TabsTrigger>
              <TabsTrigger value="unrated">Unrated ({unratedAnimes.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {watchlist.map((item) => (
                  <WatchlistCard
                    key={item.id}
                    item={item}
                    onRemove={handleRemoveFromWatchlist}
                    onRate={handleOpenRatingModal}
                    onPlay={openFirstEpisode}
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="rated" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {ratedAnimes.map((item) => (
                  <WatchlistCard
                    key={item.id}
                    item={item}
                    onRemove={handleRemoveFromWatchlist}
                    onRate={handleOpenRatingModal}
                    onPlay={openFirstEpisode}
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="unrated" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {unratedAnimes.map((item) => (
                  <WatchlistCard
                    key={item.id}
                    item={item}
                    onRemove={handleRemoveFromWatchlist}
                    onRate={handleOpenRatingModal}
                    onPlay={openFirstEpisode}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
      
      {/* Rating modal */}
      {selectedAnimeId && (
        <RatingModal
          animeId={selectedAnimeId}
          animeName={selectedAnimeName}
          isOpen={isRatingModalOpen}
          onClose={() => setIsRatingModalOpen(false)}
          onRated={handleRatingComplete}
          currentRating={selectedAnimeRating}
        />
      )}
    </MainLayout>
  );
};

interface WatchlistCardProps {
  item: WatchlistItem;
  onRemove: (animeId: string, animeName: string) => void;
  onRate: (animeId: string, animeName: string, rating: number) => void;
  onPlay: (animeId: string) => void;
}

const WatchlistCard = ({ item, onRemove, onRate, onPlay }: WatchlistCardProps) => {
  return (
    <Card className="bg-gray-900 border-gray-800 overflow-hidden">
      <div className="relative">
        <img 
          src={item.animeCover} 
          alt={item.animeName} 
          className="w-full h-48 object-cover"
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 bg-black/40 hover:bg-black/60 text-white rounded-full"
          onClick={() => onRemove(item.animeId, item.animeName)}
        >
          <X size={16} />
        </Button>
      </div>
      <CardContent className="p-4">
        <Link to={`/anime/${item.animeId}`}>
          <h3 className="font-semibold text-lg mb-2 hover:text-anime-primary truncate">
            {item.animeName}
          </h3>
        </Link>
        
        <div className="mb-4">
          {item.rating > 0 ? (
            <div className="flex items-center gap-2">
              <StarRating initialRating={item.rating} readOnly size="small" />
              <span className="text-sm text-gray-400">({item.rating}/5)</span>
            </div>
          ) : (
            <p className="text-sm text-gray-400">Not rated yet</p>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => onPlay(item.animeId)}
          >
            <Play size={16} className="mr-1" /> Watch
          </Button>
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => onRate(item.animeId, item.animeName, item.rating)}
          >
            <Star size={16} className="mr-1" /> {item.rating > 0 ? 'Edit Rating' : 'Rate'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WatchlistPage;
