
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import StarRating from '@/components/anime/StarRating';
import { Play, Star, Search, List, Grid } from 'lucide-react';
import { animeList } from '@/lib/dummyData';
import { getAnimeRatings } from '@/lib/firebase';
import { Anime } from '@/types/anime';

interface AnimeWithRatings extends Anime {
  averageRating: number;
  totalRatings: number;
}

const RatingsPage = () => {
  const [topRatedAnimes, setTopRatedAnimes] = useState<AnimeWithRatings[]>([]);
  const [filteredAnimes, setFilteredAnimes] = useState<AnimeWithRatings[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  useEffect(() => {
    const fetchAllRatings = async () => {
      setIsLoading(true);
      try {
        // Get ratings for all animes
        const animesWithRatings: AnimeWithRatings[] = await Promise.all(
          animeList.map(async (anime) => {
            try {
              const { averageRating, totalRatings } = await getAnimeRatings(anime.id);
              return {
                ...anime,
                averageRating,
                totalRatings
              };
            } catch (error) {
              console.error(`Error fetching ratings for ${anime.title}:`, error);
              return {
                ...anime,
                averageRating: 0,
                totalRatings: 0
              };
            }
          })
        );
        
        // Sort by average rating (highest first)
        const sorted = [...animesWithRatings].sort((a, b) => b.averageRating - a.averageRating);
        setTopRatedAnimes(sorted);
        setFilteredAnimes(sorted);
      } catch (error) {
        console.error("Error fetching ratings:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAllRatings();
  }, []);
  
  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = topRatedAnimes.filter(anime => 
        anime.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredAnimes(filtered);
    } else {
      setFilteredAnimes(topRatedAnimes);
    }
  }, [searchTerm, topRatedAnimes]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Filter is already applied in the useEffect above
  };
  
  const getMostPopular = () => {
    return [...topRatedAnimes].sort((a, b) => b.totalRatings - a.totalRatings);
  };
  
  const getHighestRated = () => {
    return [...topRatedAnimes].filter(anime => anime.totalRatings > 0);
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Anime Ratings</h1>
        
        <div className="mb-6 flex flex-col md:flex-row gap-4 md:items-center justify-between">
          <form onSubmit={handleSearch} className="w-full md:w-96">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search anime..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
              <button
                type="submit"
                className="absolute right-0 top-0 h-full px-3 flex items-center justify-center"
              >
                <Search size={18} className="text-gray-400" />
              </button>
            </div>
          </form>
          
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('grid')}
              className={viewMode === 'grid' ? 'bg-anime-primary hover:bg-anime-secondary' : ''}
            >
              <Grid size={16} />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('list')}
              className={viewMode === 'list' ? 'bg-anime-primary hover:bg-anime-secondary' : ''}
            >
              <List size={16} />
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="text-center py-12">
            <p>Loading ratings...</p>
          </div>
        ) : (
          <Tabs defaultValue="all">
            <TabsList className="w-full mb-6 bg-gray-900 border-b border-gray-800">
              <TabsTrigger value="all">All Anime</TabsTrigger>
              <TabsTrigger value="highest">Highest Rated</TabsTrigger>
              <TabsTrigger value="popular">Most Popular</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-0">
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredAnimes.map((anime) => (
                    <AnimeRatingCard key={anime.id} anime={anime} />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredAnimes.map((anime) => (
                    <AnimeRatingRow key={anime.id} anime={anime} />
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="highest" className="mt-0">
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {getHighestRated().map((anime) => (
                    <AnimeRatingCard key={anime.id} anime={anime} />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {getHighestRated().map((anime) => (
                    <AnimeRatingRow key={anime.id} anime={anime} />
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="popular" className="mt-0">
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {getMostPopular().map((anime) => (
                    <AnimeRatingCard key={anime.id} anime={anime} />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {getMostPopular().map((anime) => (
                    <AnimeRatingRow key={anime.id} anime={anime} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </MainLayout>
  );
};

interface AnimeRatingCardProps {
  anime: AnimeWithRatings;
}

const AnimeRatingCard = ({ anime }: AnimeRatingCardProps) => {
  return (
    <Card className="bg-gray-900 border-gray-800 overflow-hidden">
      <div className="relative">
        <img 
          src={anime.coverImage} 
          alt={anime.title} 
          className="w-full h-56 object-cover"
        />
        {anime.totalRatings > 0 && (
          <div className="absolute top-2 right-2 bg-black/60 px-2 py-1 rounded-md flex items-center">
            <Star className="text-yellow-400 w-4 h-4 mr-1 fill-yellow-400" />
            <span className="text-white text-sm">{anime.averageRating.toFixed(1)}</span>
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <Link to={`/anime/${anime.id}`}>
          <h3 className="font-semibold text-lg mb-2 hover:text-anime-primary truncate">
            {anime.title}
          </h3>
        </Link>
        
        <div className="mb-4">
          {anime.totalRatings > 0 ? (
            <div className="flex items-center gap-3">
              <StarRating initialRating={Math.round(anime.averageRating)} readOnly size="small" />
              <span className="text-sm text-gray-400">({anime.totalRatings} ratings)</span>
            </div>
          ) : (
            <p className="text-sm text-gray-400">No ratings yet</p>
          )}
        </div>
        
        <Link to={`/anime/${anime.id}`}>
          <Button 
            className="w-full bg-anime-primary hover:bg-anime-secondary"
          >
            <Play size={16} className="mr-1" /> Watch Now
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

const AnimeRatingRow = ({ anime }: AnimeRatingCardProps) => {
  return (
    <div className="flex gap-4 bg-gray-900 p-3 rounded-lg border border-gray-800">
      <Link to={`/anime/${anime.id}`} className="w-24 h-36 flex-shrink-0">
        <img 
          src={anime.coverImage} 
          alt={anime.title} 
          className="w-full h-full object-cover rounded-md"
        />
      </Link>
      
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <Link to={`/anime/${anime.id}`}>
            <h3 className="font-semibold text-lg hover:text-anime-primary">
              {anime.title}
            </h3>
          </Link>
          
          <div className="flex items-center gap-3 mt-1">
            {anime.totalRatings > 0 ? (
              <>
                <div className="flex items-center">
                  <Star className="text-yellow-400 w-5 h-5 mr-1 fill-yellow-400" />
                  <span className="font-semibold">{anime.averageRating.toFixed(1)}</span>
                </div>
                <span className="text-sm text-gray-400">({anime.totalRatings} ratings)</span>
              </>
            ) : (
              <span className="text-sm text-gray-400">No ratings yet</span>
            )}
          </div>
          
          <p className="text-gray-400 text-sm mt-2 line-clamp-2">
            {anime.description}
          </p>
        </div>
        
        <div className="flex gap-2 mt-3">
          <Link to={`/anime/${anime.id}`}>
            <Button 
              className="bg-anime-primary hover:bg-anime-secondary"
              size="sm"
            >
              <Play size={14} className="mr-1" /> Watch Now
            </Button>
          </Link>
          
          <Link to={`/anime/${anime.id}`}>
            <Button 
              variant="outline"
              size="sm"
            >
              Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RatingsPage;
