
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import HeroSection from '@/components/anime/HeroSection';
import AnimeCarousel from '@/components/anime/AnimeCarousel';
import { useTopAnimes, useSeasonalAnimes, useSearchAnimes } from '@/lib/jikanApi';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

const HomePage = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const { 
    data: topAnimes, 
    isLoading: isLoadingTop,
    refetch: refetchTop
  } = useTopAnimes(10);
  
  const { 
    data: seasonalAnimes, 
    isLoading: isLoadingSeasonal,
    refetch: refetchSeasonal
  } = useSeasonalAnimes(10);
  
  const { 
    data: actionAnimes,
    refetch: refetchAction
  } = useSearchAnimes('action', 10);
  
  const { 
    data: romanceAnimes,
    refetch: refetchRomance
  } = useSearchAnimes('romance', 10);
  
  // Select a featured anime from seasonal or top animes
  const featuredAnime = seasonalAnimes?.[0] || topAnimes?.[0];
  
  const isLoading = isLoadingTop || isLoadingSeasonal;
  
  // Refresh all anime data
  const handleRefreshAll = async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    toast.info("Refreshing anime data...");
    
    try {
      await Promise.all([
        refetchTop(),
        refetchSeasonal(),
        refetchAction(),
        refetchRomance()
      ]);
      toast.success("Anime data updated successfully");
    } catch (error) {
      toast.error("Failed to refresh some anime data");
      console.error("Refresh error:", error);
    } finally {
      setIsRefreshing(false);
    }
  };
  
  if (isLoading || !featuredAnime) {
    return (
      <MainLayout>
        <div className="w-full h-[70vh] bg-gray-900">
          <Skeleton className="w-full h-full" />
        </div>
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-48 mb-4" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-lg" />
            ))}
          </div>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <HeroSection anime={featuredAnime} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Discover Anime</h2>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleRefreshAll}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Updating...' : 'Refresh All'}
          </Button>
        </div>
        
        {topAnimes && topAnimes.length > 0 && (
          <AnimeCarousel 
            animes={topAnimes}
            title="Top Rated Anime"
          />
        )}
        
        {seasonalAnimes && seasonalAnimes.length > 0 && (
          <AnimeCarousel 
            animes={seasonalAnimes}
            title="Currently Airing"
          />
        )}
        
        {actionAnimes && actionAnimes.length > 0 && (
          <AnimeCarousel 
            animes={actionAnimes}
            title="Action Anime"
          />
        )}
        
        {romanceAnimes && romanceAnimes.length > 0 && (
          <AnimeCarousel 
            animes={romanceAnimes}
            title="Romance Anime"
          />
        )}
      </div>
    </MainLayout>
  );
};

export default HomePage;
