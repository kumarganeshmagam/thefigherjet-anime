
import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import CommentsSection from '@/components/anime/CommentsSection';
import EpisodeSelector from '@/components/anime/EpisodeSelector';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAnimeById } from '@/lib/jikanApi';
import { Anime, Episode } from '@/types/anime';
import { saveEpisodeProgress, getEpisodeProgress, isEpisodeWatched } from '@/lib/episodeCache';
import { toast } from 'sonner';

const WatchEpisodePage = () => {
  const { animeId, episodeId } = useParams<{ animeId: string; episodeId: string }>();
  const { data: anime, isLoading: isLoadingAnime } = useAnimeById(animeId);
  const [episode, setEpisode] = useState<Episode | null>(null);
  const [prevEpisode, setPrevEpisode] = useState<Episode | null>(null);
  const [nextEpisode, setNextEpisode] = useState<Episode | null>(null);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressSaveInterval = useRef<number | null>(null);
  
  useEffect(() => {
    if (anime && episodeId) {
      // Find the current episode
      const allEpisodes = anime.seasons.flatMap(s => s.episodes);
      const currentEpisode = allEpisodes.find(ep => ep.id === episodeId);
      
      if (currentEpisode) {
        setEpisode(currentEpisode);
        
        // Find previous and next episodes
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
  }, [anime, episodeId]);
  
  // Load saved progress when video is loaded
  useEffect(() => {
    const videoElement = videoRef.current;
    
    if (videoElement && anime && episode) {
      const handleVideoLoaded = () => {
        setIsVideoLoading(false);
        
        // Get saved progress
        const progress = getEpisodeProgress(anime.id, episode.id);
        if (progress && progress.timestamp > 0) {
          // Only set time if it's less than 95% of the video
          if (progress.percentage < 95) {
            videoElement.currentTime = progress.timestamp;
            toast.info(`Resuming from ${formatTime(progress.timestamp)}`);
          } else {
            toast.info("You've already watched this episode");
          }
        }
        
        // Start saving progress periodically
        if (progressSaveInterval.current) {
          window.clearInterval(progressSaveInterval.current);
        }
        
        progressSaveInterval.current = window.setInterval(() => {
          if (videoElement.currentTime > 0 && !videoElement.paused) {
            saveEpisodeProgress(
              anime.id,
              episode.id,
              videoElement.currentTime,
              videoElement.duration
            );
          }
        }, 5000); // Save every 5 seconds
      };
      
      videoElement.addEventListener('loadeddata', handleVideoLoaded);
      
      // Handle video ended
      const handleVideoEnded = () => {
        saveEpisodeProgress(
          anime.id,
          episode.id,
          videoElement.duration,
          videoElement.duration
        );
        
        // Go to next episode if available
        if (nextEpisode) {
          toast.info("Playing next episode...", {
            duration: 3000
          });
          
          setTimeout(() => {
            navigate(`/anime/${anime.id}/watch/${nextEpisode.id}`);
          }, 3000);
        }
      };
      
      videoElement.addEventListener('ended', handleVideoEnded);
      
      return () => {
        videoElement.removeEventListener('loadeddata', handleVideoLoaded);
        videoElement.removeEventListener('ended', handleVideoEnded);
        
        if (progressSaveInterval.current) {
          window.clearInterval(progressSaveInterval.current);
        }
        
        // Save progress when unmounting
        if (videoElement.currentTime > 0 && anime && episode) {
          saveEpisodeProgress(
            anime.id,
            episode.id,
            videoElement.currentTime,
            videoElement.duration
          );
        }
      };
    }
  }, [anime, episode, nextEpisode, navigate]);
  
  // Helper to format time (MM:SS)
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  if (isLoadingAnime || !anime) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-4 w-48 mb-6" />
          <Skeleton className="aspect-video w-full rounded-lg mb-6" />
          <div className="flex justify-between gap-4 mb-8">
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-10 w-40" />
          </div>
        </div>
      </MainLayout>
    );
  }
  
  if (!episode) {
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
          {isEpisodeWatched(anime.id, episode.id) && (
            <span className="ml-2 bg-anime-primary/20 text-anime-primary rounded-full px-2 py-0.5 text-xs">
              Watched
            </span>
          )}
        </div>
        
        {/* Video player */}
        <div className="aspect-video bg-black rounded-lg overflow-hidden mb-6 relative">
          {isVideoLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-anime-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          <video
            ref={videoRef}
            src={episode.videoUrl}
            controls
            className="w-full h-full"
            poster={episode.thumbnail}
            onError={() => {
              setIsVideoLoading(false);
              toast.error("Failed to load video");
            }}
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
