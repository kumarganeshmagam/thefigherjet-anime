
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import HeroSection from '@/components/anime/HeroSection';
import AnimeCarousel from '@/components/anime/AnimeCarousel';
import { useTopAnimes, useSeasonalAnimes, useSearchAnimes } from '@/lib/jikanApi';
import { Skeleton } from '@/components/ui/skeleton';

const HomePage = () => {
  const { data: topAnimes, isLoading: isLoadingTop } = useTopAnimes(10);
  const { data: seasonalAnimes, isLoading: isLoadingSeasonal } = useSeasonalAnimes(10);
  const { data: actionAnimes } = useSearchAnimes('action', 10);
  const { data: romanceAnimes } = useSearchAnimes('romance', 10);
  
  // Select a featured anime from seasonal or top animes
  const featuredAnime = seasonalAnimes?.[0] || topAnimes?.[0];
  
  const isLoading = isLoadingTop || isLoadingSeasonal;
  
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
