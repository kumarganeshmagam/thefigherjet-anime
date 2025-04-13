
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Anime } from '@/types/anime';

interface AnimeCarouselProps {
  animes: Anime[];
  title: string;
}

const AnimeCarousel = ({ animes, title }: AnimeCarouselProps) => {
  const [scrollX, setScrollX] = useState(0);
  const scrollAmount = 300;
  
  if (animes.length === 0) return null;

  const scrollLeft = () => {
    const container = document.getElementById(`carousel-${title.replace(/\s+/g, '-')}`);
    if (container) {
      const newScrollX = Math.max(scrollX - scrollAmount, 0);
      container.scrollTo({ left: newScrollX, behavior: 'smooth' });
      setScrollX(newScrollX);
    }
  };

  const scrollRight = () => {
    const container = document.getElementById(`carousel-${title.replace(/\s+/g, '-')}`);
    if (container) {
      const maxScroll = container.scrollWidth - container.clientWidth;
      const newScrollX = Math.min(scrollX + scrollAmount, maxScroll);
      container.scrollTo({ left: newScrollX, behavior: 'smooth' });
      setScrollX(newScrollX);
    }
  };

  return (
    <div className="my-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="icon" onClick={scrollLeft} className="rounded-full">
            <ChevronLeft size={20} />
          </Button>
          <Button variant="outline" size="icon" onClick={scrollRight} className="rounded-full">
            <ChevronRight size={20} />
          </Button>
        </div>
      </div>
      
      <div
        id={`carousel-${title.replace(/\s+/g, '-')}`}
        className="flex overflow-x-auto scrollbar-hide space-x-4 pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {animes.map((anime) => (
          <Link 
            key={anime.id} 
            to={`/anime/${anime.id}`}
            className="flex-shrink-0 w-48 relative group"
          >
            <div className="rounded-md overflow-hidden">
              <img 
                src={anime.coverImage} 
                alt={anime.title} 
                className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                <div className="p-3">
                  <h3 className="text-white font-semibold">{anime.title}</h3>
                  <div className="flex justify-between mt-1">
                    <p className="text-gray-300 text-sm">{anime.type}</p>
                    <p className="text-gray-300 text-sm">{anime.releaseYear}</p>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AnimeCarousel;
