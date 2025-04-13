
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import CommentsSection from '@/components/anime/CommentsSection';
import EpisodeSelector from '@/components/anime/EpisodeSelector';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getAnimeById, getEpisodeById, getAllEpisodes } from '@/lib/dummyData';
import { Anime, Episode } from '@/types/anime';

const WatchEpisodePage = () => {
  const { animeId, episodeId } = useParams<{ animeId: string; episodeId: string }>();
  const [anime, setAnime] = useState<Anime | null>(null);
  const [episode, setEpisode] = useState<Episode | null>(null);
  const [prevEpisode, setPrevEpisode] = useState<Episode | null>(null);
  const [nextEpisode, setNextEpisode] = useState<Episode | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (animeId && episodeId) {
      const animeData = getAnimeById(animeId);
      if (animeData) {
        setAnime(animeData);
        
        const episodeData = getEpisodeById(animeId, episodeId);
        if (episodeData) {
          setEpisode(episodeData);
          
          // Get all episodes in sequential order
          const allEpisodes = getAllEpisodes(animeId);
          const currentIndex = allEpisodes.findIndex(ep => ep.id === episodeId);
          
          if (currentIndex > 0) {
            setPrevEpisode(allEpisodes[currentIndex - 1]);
          } else {
            setPrevEpisode(null);
          }
          
          if (currentIndex < allEpisodes.length - 1) {
            setNextEpisode(allEpisodes[currentIndex + 1]);
          } else {
            setNextEpisode(null);
          }
        }
      }
    }
  }, [animeId, episodeId]);
  
  if (!anime || !episode) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <p>Episode not found</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-4">
          <Link to={`/anime/${anime.id}`} className="text-anime-primary hover:underline">
            &larr; Back to {anime.title}
          </Link>
        </div>
        
        <h1 className="text-2xl md:text-3xl font-bold mb-4">
          {episode.title}
        </h1>
        
        <div className="text-sm text-gray-400 mb-4">
          Season {episode.seasonNumber} • Episode {episode.episodeNumber} • {episode.duration}
        </div>
        
        {/* Video player */}
        <div className="aspect-video bg-black rounded-lg overflow-hidden mb-6">
          <video
            src={episode.videoUrl}
            controls
            className="w-full h-full"
            poster={episode.thumbnail}
          />
        </div>
        
        {/* Episode navigation buttons */}
        <div className="flex justify-between gap-4 mb-8">
          <Button
            variant="outline"
            onClick={() => prevEpisode && navigate(`/anime/${anime.id}/watch/${prevEpisode.id}`)}
            disabled={!prevEpisode}
          >
            <ChevronLeft size={18} className="mr-2" /> Previous Episode
          </Button>
          
          <Button
            className="bg-anime-primary hover:bg-anime-secondary"
            onClick={() => nextEpisode && navigate(`/anime/${anime.id}/watch/${nextEpisode.id}`)}
            disabled={!nextEpisode}
          >
            Next Episode <ChevronRight size={18} className="ml-2" />
          </Button>
        </div>
        
        <Tabs defaultValue="comments">
          <TabsList className="w-full bg-gray-900 border-gray-800">
            <TabsTrigger value="comments" className="flex-1">Comments</TabsTrigger>
            <TabsTrigger value="episodes" className="flex-1">Episodes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="comments" className="mt-4">
            <CommentsSection animeId={anime.id} episodeId={episode.id} />
          </TabsContent>
          
          <TabsContent value="episodes" className="mt-4">
            <EpisodeSelector anime={anime} currentEpisodeId={episode.id} />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default WatchEpisodePage;
