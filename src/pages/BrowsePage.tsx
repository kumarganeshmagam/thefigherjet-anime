
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import AnimeGrid from '@/components/anime/AnimeGrid';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { animeList, genres } from '@/lib/dummyData';
import { Anime, Genre } from '@/types/anime';
import { Search } from 'lucide-react';

const BrowsePage = () => {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [displayedAnimes, setDisplayedAnimes] = useState<Anime[]>(animeList);
  
  useEffect(() => {
    // Check for genre in URL
    const params = new URLSearchParams(location.search);
    const genreParam = params.get('genre');
    
    if (genreParam) {
      const genreObj = genres.find(g => g.name.toLowerCase() === genreParam.toLowerCase());
      if (genreObj) {
        setSelectedGenres([genreObj.id]);
      }
    }
  }, [location.search]);
  
  useEffect(() => {
    filterAnimes();
  }, [searchTerm, selectedGenres]);
  
  const filterAnimes = () => {
    let filtered = [...animeList];
    
    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(anime => 
        anime.title.toLowerCase().includes(term) || 
        anime.description.toLowerCase().includes(term)
      );
    }
    
    // Filter by selected genres
    if (selectedGenres.length > 0) {
      filtered = filtered.filter(anime => 
        anime.genres.some(genre => selectedGenres.includes(genre.id))
      );
    }
    
    setDisplayedAnimes(filtered);
  };
  
  const handleGenreToggle = (genreId: string) => {
    setSelectedGenres(prev => 
      prev.includes(genreId)
        ? prev.filter(id => id !== genreId)
        : [...prev, genreId]
    );
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    filterAnimes();
  };
  
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedGenres([]);
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Browse Anime</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900 rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-4">Filters</h2>
              
              <form onSubmit={handleSearch} className="mb-6">
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Search anime..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" size="icon">
                    <Search size={18} />
                  </Button>
                </div>
              </form>
              
              <div className="mb-4">
                <h3 className="font-medium mb-2">Genres</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {genres.map((genre) => (
                    <div key={genre.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`genre-${genre.id}`}
                        checked={selectedGenres.includes(genre.id)}
                        onCheckedChange={() => handleGenreToggle(genre.id)}
                      />
                      <label
                        htmlFor={`genre-${genre.id}`}
                        className="text-sm cursor-pointer"
                      >
                        {genre.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <Button
                variant="outline"
                onClick={clearFilters}
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
          
          {/* Anime grid */}
          <div className="lg:col-span-3">
            <AnimeGrid
              animes={displayedAnimes}
              title={`${displayedAnimes.length} Anime Found`}
              size="medium"
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default BrowsePage;
