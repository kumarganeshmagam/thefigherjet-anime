
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Play, Plus } from 'lucide-react';
import { Anime } from '@/types/anime';
import { useAuth } from '@/contexts/AuthContext';
import { addToWatchlist } from '@/lib/firebase';
import { toast } from 'sonner';

interface HeroSectionProps {
  anime: Anime;
}

const HeroSection = ({ anime }: HeroSectionProps) => {
  const { currentUser } = useAuth();
  
  const handleAddToWatchlist = async () => {
    if (!currentUser) {
      toast.error("Please log in to add to your watchlist");
      return;
    }
    
    try {
      const { error } = await addToWatchlist(
        currentUser.uid, 
        anime.id, 
        anime.title, 
        anime.coverImage
      );
      
      if (error) {
        toast.error(error);
      } else {
        toast.success(`${anime.title} added to your watchlist`);
      }
    } catch (error) {
      toast.error("Failed to add to watchlist");
      console.error(error);
    }
  };
  
  // Get the first episode from the first season for the "Play" button
  const firstEpisode = anime.seasons[0]?.episodes[0];

  return (
    <div
      className="relative w-full h-[70vh] bg-cover bg-center"
      style={{ backgroundImage: `url(${anime.bannerImage})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
      <div className="container mx-auto px-4 relative h-full flex flex-col justify-end pb-16">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">{anime.title}</h1>
          <div className="flex flex-wrap gap-2 mb-4">
            {anime.genres.map((genre) => (
              <span key={genre.id} className="bg-anime-primary/20 border border-anime-primary text-white text-xs px-2 py-1 rounded">
                {genre.name}
              </span>
            ))}
          </div>
          <p className="text-gray-300 mb-6 line-clamp-3 md:line-clamp-none">
            {anime.description}
          </p>
          <div className="flex flex-wrap gap-4">
            {firstEpisode && (
              <Link to={`/anime/${anime.id}/watch/${firstEpisode.id}`}>
                <Button className="bg-anime-primary hover:bg-anime-secondary">
                  <Play size={18} className="mr-2" /> Watch Now
                </Button>
              </Link>
            )}
            <Button variant="outline" className="border-white text-white hover:bg-white/20" onClick={handleAddToWatchlist}>
              <Plus size={18} className="mr-2" /> Add to My List
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
