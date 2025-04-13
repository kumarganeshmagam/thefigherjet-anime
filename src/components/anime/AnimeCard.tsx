
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { Anime } from '@/types/anime';

interface AnimeCardProps {
  anime: Anime;
  size?: 'small' | 'medium' | 'large';
}

const AnimeCard = ({ anime, size = 'medium' }: AnimeCardProps) => {
  const sizeClasses = {
    small: 'w-36 md:w-40',
    medium: 'w-48 md:w-56',
    large: 'w-60 md:w-72'
  };

  return (
    <Link to={`/anime/${anime.id}`}>
      <Card className={`${sizeClasses[size]} bg-gray-900 border-gray-800 overflow-hidden anime-card hover:border-anime-primary`}>
        <div className="relative">
          <img 
            src={anime.coverImage} 
            alt={anime.title} 
            className="w-full object-cover transition-transform"
            style={{ height: size === 'small' ? '160px' : size === 'medium' ? '240px' : '320px' }}
          />
          <div className="absolute top-0 right-0 bg-black/70 px-2 py-1 flex items-center rounded-bl-md">
            <Star className="text-yellow-400 w-4 h-4 mr-1" />
            <span className="text-white text-xs">{anime.rating.toFixed(1)}</span>
          </div>
        </div>
        <CardContent className="p-3">
          <h3 className="font-semibold text-white truncate">
            {anime.title}
          </h3>
          <div className="flex mt-1 justify-between">
            <p className="text-gray-400 text-xs">{anime.type}</p>
            <p className="text-gray-400 text-xs">{anime.releaseYear}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default AnimeCard;
