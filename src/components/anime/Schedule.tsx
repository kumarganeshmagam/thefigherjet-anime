
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAnimeSchedule } from '@/lib/jikanApi';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, Clock, RefreshCw } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const Schedule = () => {
  const { data: schedule, isLoading, error, refetch } = useAnimeSchedule();
  const [activeDay, setActiveDay] = useState(getCurrentDay());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showMore, setShowMore] = useState(false);
  
  // Helper to get current day
  function getCurrentDay(): string {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days[new Date().getDay()];
  }
  
  // Helper to format day
  function formatDay(day: string): string {
    return day.charAt(0).toUpperCase() + day.slice(1);
  }
  
  // Refresh schedule data
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
      toast.success("Schedule updated with latest data");
    } catch (err) {
      toast.error("Failed to update schedule");
    } finally {
      setIsRefreshing(false);
    }
  };
  
  // Set active day to current day when schedule loads
  useEffect(() => {
    if (schedule && !isLoading) {
      setActiveDay(getCurrentDay());
    }
  }, [schedule, isLoading]);
  
  if (isLoading) {
    return (
      <div className="p-4 bg-gray-900 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-lg flex items-center">
            <Calendar className="h-4 w-4 mr-2" /> Anime Schedule
          </h2>
          <Button size="sm" variant="ghost" disabled>
            <RefreshCw className="h-3 w-3 mr-1" />
            Refresh
          </Button>
        </div>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-2 items-center">
              <Skeleton className="h-12 w-12 rounded-md" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-4 bg-gray-900 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-lg flex items-center">
            <Calendar className="h-4 w-4 mr-2" /> Anime Schedule
          </h2>
          <Button size="sm" variant="ghost" onClick={handleRefresh}>
            <RefreshCw className="h-3 w-3 mr-1" />
            Retry
          </Button>
        </div>
        <p className="text-red-500">Failed to load schedule</p>
      </div>
    );
  }
  
  return (
    <div className="p-4 bg-gray-900 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-lg flex items-center">
          <Calendar className="h-4 w-4 mr-2" /> Anime Schedule
        </h2>
        <Button 
          size="sm" 
          variant="ghost" 
          onClick={handleRefresh} 
          disabled={isRefreshing}
          className="text-xs"
        >
          <RefreshCw className={`h-3 w-3 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Updating...' : 'Refresh'}
        </Button>
      </div>
      
      <div className="flex overflow-x-auto mb-4 gap-1 pb-2 scrollbar-hide">
        {Object.keys(schedule || {}).map((day) => (
          <button
            key={day}
            onClick={() => setActiveDay(day)}
            className={`px-3 py-1 rounded-full text-xs whitespace-nowrap transition-all ${
              activeDay === day
                ? 'bg-anime-primary text-white shadow-md scale-105'
                : 'bg-gray-800 hover:bg-gray-700'
            }`}
          >
            {formatDay(day)}
          </button>
        ))}
      </div>
      
      <ScrollArea className="h-full max-h-[calc(100vh-250px)]">
        <div className="space-y-4">
          {/* Today's schedule */}
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-400 mb-2 flex items-center">
              <span className="bg-gray-800 px-2 py-0.5 rounded-md">
                {activeDay === getCurrentDay() ? "Today" : formatDay(activeDay)}
              </span>
              {schedule && schedule[activeDay] && (
                <span className="text-xs ml-2 text-gray-500">
                  {schedule[activeDay].length} anime
                </span>
              )}
            </h3>
            
            <Collapsible 
              open={true}
              className="space-y-2"
            >
              <CollapsibleContent className="space-y-2">
                {schedule && schedule[activeDay]?.slice(0, showMore ? undefined : 6).map((anime) => (
                  <Link
                    key={anime.id}
                    to={`/anime/${anime.id}`}
                    className="flex gap-2 p-2 rounded-md hover:bg-gray-800 transition-colors group"
                  >
                    <img
                      src={anime.coverImage}
                      alt={anime.title}
                      className="h-14 w-14 object-cover rounded-md group-hover:shadow-md transition-all"
                      loading="lazy"
                    />
                    <div>
                      <h4 className="text-sm font-medium line-clamp-1 group-hover:text-anime-primary transition-colors">{anime.title}</h4>
                      <p className="text-xs text-gray-400 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {anime.type} • Ep {anime.seasons[0]?.episodes[0]?.episodeNumber || 1}
                      </p>
                      <p className="text-xs text-gray-500">{anime.status}</p>
                    </div>
                  </Link>
                ))}
                
                {(!schedule || !schedule[activeDay] || schedule[activeDay].length === 0) && (
                  <p className="text-sm text-gray-400 py-4 text-center italic">No anime scheduled for this day</p>
                )}
                
                {schedule && schedule[activeDay] && schedule[activeDay].length > 6 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full text-xs"
                    onClick={() => setShowMore(!showMore)}
                  >
                    {showMore ? 'Show Less' : `Show ${schedule[activeDay].length - 6} More`}
                  </Button>
                )}
              </CollapsibleContent>
            </Collapsible>
          </div>
          
          {/* Weekly schedule accordion */}
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="weekly" className="border-gray-800">
              <AccordionTrigger className="text-sm font-medium hover:no-underline">
                Weekly Schedule
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-2">
                  {Object.entries(schedule || {})
                    .filter(([day]) => day !== activeDay)
                    .map(([day, animes]) => (
                    <div key={day} className="space-y-2">
                      <h4 className="text-xs font-medium text-gray-400 flex items-center">
                        <span 
                          className="cursor-pointer hover:bg-gray-800 px-2 py-0.5 rounded-md transition-colors"
                          onClick={() => setActiveDay(day)}
                        >
                          {formatDay(day)}
                        </span>
                        <span className="text-xs ml-2 text-gray-500">
                          {animes.length} anime
                        </span>
                      </h4>
                      <div className="space-y-2">
                        {animes.slice(0, 3).map((anime) => (
                          <Link
                            key={anime.id}
                            to={`/anime/${anime.id}`}
                            className="flex gap-2 p-2 rounded-md hover:bg-gray-800 transition-colors group"
                          >
                            <img
                              src={anime.coverImage}
                              alt={anime.title}
                              className="h-10 w-10 object-cover rounded-md"
                              loading="lazy"
                            />
                            <div>
                              <h5 className="text-xs font-medium line-clamp-1 group-hover:text-anime-primary transition-colors">{anime.title}</h5>
                              <p className="text-xs text-gray-400">
                                Ep {anime.seasons[0]?.episodes[0]?.episodeNumber || 1}
                              </p>
                            </div>
                          </Link>
                        ))}
                        
                        {animes.length > 3 && (
                          <Link 
                            to="/browse" 
                            className="text-xs text-anime-primary hover:underline block px-2"
                          >
                            + {animes.length - 3} more
                          </Link>
                        )}
                        
                        {animes.length === 0 && (
                          <p className="text-xs text-gray-400 py-2 px-2 italic">No anime scheduled</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </ScrollArea>
    </div>
  );
};

export default Schedule;
