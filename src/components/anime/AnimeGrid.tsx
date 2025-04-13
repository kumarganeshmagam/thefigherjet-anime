
import React from 'react';
import AnimeCard from './AnimeCard';
import { Anime } from '@/types/anime';

interface AnimeGridProps {
  animes: Anime[];
  title?: string;
  size?: 'small' | 'medium' | 'large';
}

const AnimeGrid = ({ animes, title, size = 'medium' }: AnimeGridProps) => {
  if (animes.length === 0) {
    return (
      <div className="my-8">
        {title && <h2 className="text-2xl font-bold mb-6">{title}</h2>}
        <div className="text-center py-12">
          <p className="text-lg text-gray-400">No anime found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-8">
      {title && <h2 className="text-2xl font-bold mb-6">{title}</h2>}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        {animes.map((anime) => (
          <AnimeCard key={anime.id} anime={anime} size={size} />
        ))}
      </div>
    </div>
  );
};

export default AnimeGrid;
