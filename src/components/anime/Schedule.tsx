
import React, { useState } from 'react';
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
import { Calendar, Clock } from 'lucide-react';

const Schedule = () => {
  const { data: schedule, isLoading, error } = useAnimeSchedule();
  const [activeDay, setActiveDay] = useState(getCurrentDay());
  
  // Helper to get current day
  function getCurrentDay(): string {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days[new Date().getDay()];
  }
  
  // Helper to format day
  function formatDay(day: string): string {
    return day.charAt(0).toUpperCase() + day.slice(1);
  }
  
  // Get tomorrow
  function getTomorrow(): string {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const today = new Date().getDay();
    return days[(today + 1) % 7];
  }
  
  if (isLoading) {
    return (
      <div className="p-4 bg-gray-900 rounded-lg">
        <h2 className="font-bold text-lg mb-4 flex items-center">
          <Calendar className="h-4 w-4 mr-2" /> Anime Schedule
        </h2>
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
        <h2 className="font-bold text-lg mb-4 flex items-center">
          <Calendar className="h-4 w-4 mr-2" /> Anime Schedule
        </h2>
        <p className="text-red-500">Failed to load schedule</p>
      </div>
    );
  }
  
  return (
    <div className="p-4 bg-gray-900 rounded-lg">
      <h2 className="font-bold text-lg mb-4 flex items-center">
        <Calendar className="h-4 w-4 mr-2" /> Anime Schedule
      </h2>
      
      <div className="flex overflow-x-auto mb-4 gap-1 pb-2">
        {Object.keys(schedule || {}).map((day) => (
          <button
            key={day}
            onClick={() => setActiveDay(day)}
            className={`px-3 py-1 rounded-full text-xs whitespace-nowrap ${
              activeDay === day
                ? 'bg-anime-primary text-white'
                : 'bg-gray-800 hover:bg-gray-700'
            }`}
          >
            {formatDay(day)}
          </button>
        ))}
      </div>
      
      <ScrollArea className="h-full max-h-[calc(100vh-200px)]">
        <div className="space-y-4">
          {/* Today's schedule */}
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-400 mb-2">
              {activeDay === getCurrentDay() ? "Today" : formatDay(activeDay)}
            </h3>
            <div className="space-y-2">
              {schedule && schedule[activeDay]?.slice(0, 10).map((anime) => (
                <Link
                  key={anime.id}
                  to={`/anime/${anime.id}`}
                  className="flex gap-2 p-2 rounded-md hover:bg-gray-800 transition-colors"
                >
                  <img
                    src={anime.coverImage}
                    alt={anime.title}
                    className="h-12 w-12 object-cover rounded-md"
                  />
                  <div>
                    <h4 className="text-sm font-medium line-clamp-1">{anime.title}</h4>
                    <p className="text-xs text-gray-400 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {anime.type} • Ep {anime.seasons[0]?.episodes[0]?.episodeNumber || 1}
                    </p>
                  </div>
                </Link>
              ))}
              
              {(!schedule || !schedule[activeDay] || schedule[activeDay].length === 0) && (
                <p className="text-sm text-gray-400">No anime scheduled</p>
              )}
            </div>
          </div>
          
          {/* Weekly schedule accordion */}
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="weekly">
              <AccordionTrigger className="text-sm font-medium">
                Weekly Schedule
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-2">
                  {Object.entries(schedule || {}).map(([day, animes]) => (
                    <div key={day} className="space-y-2">
                      <h4 className="text-xs font-medium text-gray-400">
                        {formatDay(day)}
                      </h4>
                      <div className="space-y-2">
                        {animes.slice(0, 5).map((anime) => (
                          <Link
                            key={anime.id}
                            to={`/anime/${anime.id}`}
                            className="flex gap-2 p-2 rounded-md hover:bg-gray-800 transition-colors"
                          >
                            <img
                              src={anime.coverImage}
                              alt={anime.title}
                              className="h-10 w-10 object-cover rounded-md"
                            />
                            <div>
                              <h5 className="text-xs font-medium line-clamp-1">{anime.title}</h5>
                              <p className="text-xs text-gray-400">
                                {anime.type}
                              </p>
                            </div>
                          </Link>
                        ))}
                        
                        {animes.length > 5 && (
                          <Link 
                            to="/browse" 
                            className="text-xs text-anime-primary hover:underline"
                          >
                            + {animes.length - 5} more
                          </Link>
                        )}
                        
                        {animes.length === 0 && (
                          <p className="text-xs text-gray-400">No anime scheduled</p>
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
