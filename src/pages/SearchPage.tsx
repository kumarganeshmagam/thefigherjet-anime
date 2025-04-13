
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import AnimeGrid from '@/components/anime/AnimeGrid';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { searchAnimes } from '@/lib/dummyData';
import { Anime } from '@/types/anime';
import { Search } from 'lucide-react';

const SearchPage = () => {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Anime[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  
  // Extract query param from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('q');
    
    if (query) {
      setSearchTerm(query);
      performSearch(query);
    }
  }, [location.search]);
  
  const performSearch = (query: string) => {
    if (query.trim()) {
      const results = searchAnimes(query);
      setSearchResults(results);
      setHasSearched(true);
    } else {
      setSearchResults([]);
      setHasSearched(false);
    }
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchTerm);
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Search Anime</h1>
        
        <form onSubmit={handleSearch} className="max-w-xl mx-auto mb-8">
          <div className="flex">
            <Input
              type="text"
              placeholder="Search by anime title, genre, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" className="ml-2 bg-anime-primary hover:bg-anime-secondary">
              <Search size={18} />
            </Button>
          </div>
        </form>
        
        {hasSearched && (
          <div className="mb-4">
            <h2 className="text-xl font-semibold">
              {searchResults.length > 0 
                ? `Search results for "${searchTerm}" (${searchResults.length} found)` 
                : `No results found for "${searchTerm}"`}
            </h2>
          </div>
        )}
        
        {searchResults.length > 0 ? (
          <AnimeGrid animes={searchResults} />
        ) : hasSearched && (
          <div className="text-center py-12 bg-gray-900 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">No anime found</h3>
            <p className="text-gray-400">Try searching with different keywords</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default SearchPage;
