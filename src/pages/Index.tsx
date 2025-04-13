
import React, { useEffect, useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import HeroSection from '@/components/anime/HeroSection';
import AnimeCarousel from '@/components/anime/AnimeCarousel';
import { getTopAnimes, getRecentAnimes, animeList } from '@/lib/dummyData';
import { Anime } from '@/types/anime';

const HomePage = () => {
  const [featuredAnime, setFeaturedAnime] = useState<Anime | null>(null);
  const [topAnimes, setTopAnimes] = useState<Anime[]>([]);
  const [recentAnimes, setRecentAnimes] = useState<Anime[]>([]);
  const [actionAnimes, setActionAnimes] = useState<Anime[]>([]);
  const [romanceAnimes, setRomanceAnimes] = useState<Anime[]>([]);
  
  useEffect(() => {
    // Get a random anime for the hero section
    const randomAnime = animeList[Math.floor(Math.random() * animeList.length)];
    setFeaturedAnime(randomAnime);
    
    // Top rated animes
    setTopAnimes(getTopAnimes(10));
    
    // Recent animes
    setRecentAnimes(getRecentAnimes(10));
    
    // Action animes (filter by genre)
    const actionGenre = animeList.filter(anime => 
      anime.genres.some(genre => genre.name.toLowerCase() === 'action')
    );
    setActionAnimes(actionGenre);
    
    // Romance animes (filter by genre)
    const romanceGenre = animeList.filter(anime => 
      anime.genres.some(genre => genre.name.toLowerCase() === 'romance')
    );
    setRomanceAnimes(romanceGenre);
  }, []);
  
  if (!featuredAnime) return <div>Loading...</div>;
  
  return (
    <MainLayout>
      <HeroSection anime={featuredAnime} />
      
      <div className="container mx-auto px-4 py-8">
        <AnimeCarousel 
          animes={topAnimes}
          title="Top Rated Anime"
        />
        
        <AnimeCarousel 
          animes={recentAnimes}
          title="Recently Added"
        />
        
        <AnimeCarousel 
          animes={actionAnimes}
          title="Action Anime"
        />
        
        <AnimeCarousel 
          animes={romanceAnimes}
          title="Romance Anime"
        />
      </div>
    </MainLayout>
  );
};

export default HomePage;
