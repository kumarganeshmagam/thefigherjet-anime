
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { Anime, Episode, Season } from '@/types/anime';

interface EpisodeSelectorProps {
  anime: Anime;
  currentEpisodeId?: string;
}

const EpisodeSelector = ({ anime, currentEpisodeId }: EpisodeSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [episodesPerPage, setEpisodesPerPage] = useState(10);
  
  // Find default selected season based on current episode, or first season
  const currentEpisode = currentEpisodeId ? 
    anime.seasons
      .flatMap(season => season.episodes)
      .find(episode => episode.id === currentEpisodeId) 
    : null;
    
  const defaultSeasonId = currentEpisode 
    ? anime.seasons.find(season => 
        season.episodes.some(ep => ep.id === currentEpisodeId)
      )?.id 
    : anime.seasons[0]?.id;
    
  const [selectedSeason, setSelectedSeason] = useState<string>(defaultSeasonId || '');
  
  // Filter episodes based on search term
  const filteredEpisodes: Episode[] = selectedSeason ? 
    anime.seasons
      .find(season => season.id === selectedSeason)
      ?.episodes.filter(episode => 
        episode.title.toLowerCase().includes(searchTerm.toLowerCase())
      ) || [] 
    : [];
    
  // Calculate pagination
  const totalPages = Math.ceil(filteredEpisodes.length / episodesPerPage);
  const currentEpisodes = filteredEpisodes.slice(
    (currentPage - 1) * episodesPerPage,
    currentPage * episodesPerPage
  );
  
  const goToPage = (pageNumber: number) => {
    setCurrentPage(Math.max(1, Math.min(pageNumber, totalPages)));
  };
  
  const jumpToLastEpisode = () => {
    const lastSeason = anime.seasons[anime.seasons.length - 1];
    if (lastSeason) {
      const lastEpisode = lastSeason.episodes[lastSeason.episodes.length - 1];
      if (lastEpisode) {
        setSelectedSeason(lastSeason.id);
        setCurrentPage(Math.ceil(lastSeason.episodes.length / episodesPerPage));
      }
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg p-4">
      <h3 className="text-xl font-semibold mb-4">Episodes</h3>
      
      <div className="mb-4 flex flex-col sm:flex-row gap-4">
        <Select 
          value={selectedSeason} 
          onValueChange={setSelectedSeason}
        >
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Select Season" />
          </SelectTrigger>
          <SelectContent>
            {anime.seasons.map((season) => (
              <SelectItem key={season.id} value={season.id}>
                {season.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Search episodes..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pr-10"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
        </div>
        
        <Button 
          variant="outline" 
          className="whitespace-nowrap"
          onClick={jumpToLastEpisode}
        >
          <ChevronRight className="mr-1" size={16} />
          Latest Episode
        </Button>
      </div>
      
      {selectedSeason && (
        <div className="space-y-4">
          <div className="grid gap-2">
            {currentEpisodes.map((episode) => (
              <Link
                key={episode.id}
                to={`/anime/${anime.id}/watch/${episode.id}`}
                className={`p-3 rounded-md flex items-center hover:bg-gray-800 transition-colors ${
                  episode.id === currentEpisodeId ? 'bg-anime-primary/20 border border-anime-primary' : 'bg-gray-800'
                }`}
              >
                <div className="mr-3 w-10 h-10 bg-anime-primary rounded-full flex items-center justify-center text-white font-medium">
                  {episode.episodeNumber}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{episode.title}</h4>
                  <p className="text-gray-400 text-sm">{episode.duration}</p>
                </div>
              </Link>
            ))}
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={16} />
                Previous
              </Button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNumber = currentPage;
                  
                  if (totalPages <= 5) {
                    pageNumber = i + 1;
                  } else if (currentPage <= 3) {
                    pageNumber = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNumber = totalPages - 4 + i;
                  } else {
                    pageNumber = currentPage - 2 + i;
                  }
                  
                  return (
                    <Button
                      key={pageNumber}
                      variant={currentPage === pageNumber ? "default" : "outline"}
                      size="sm"
                      className="w-8 h-8 p-0"
                      onClick={() => goToPage(pageNumber)}
                    >
                      {pageNumber}
                    </Button>
                  );
                })}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight size={16} />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EpisodeSelector;
