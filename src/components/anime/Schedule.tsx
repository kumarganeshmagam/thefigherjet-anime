
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ChevronRight } from 'lucide-react';
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger 
} from "@/components/ui/collapsible";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { animeList } from '@/lib/dummyData';
import { Badge } from '@/components/ui/badge';

// Helper function to get today's day name
const getDayName = (dayOffset = 0) => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = new Date();
  today.setDate(today.getDate() + dayOffset);
  return days[today.getDay()];
};

// Group anime by day for the schedule
const getScheduleByDay = () => {
  // In a real app, this would come from an API
  // For now, we'll use the dummy data and assign days randomly
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const schedule = days.reduce((acc, day) => {
    acc[day] = [];
    return acc;
  }, {} as Record<string, typeof animeList>);
  
  // Assign animes to days (for demo purposes only)
  animeList.forEach((anime) => {
    // Randomly assign a day (in real app, this would be from actual schedule data)
    const randomDay = days[Math.floor(Math.random() * days.length)];
    schedule[randomDay].push(anime);
  });
  
  return schedule;
};

const Schedule = () => {
  const schedule = getScheduleByDay();
  const today = getDayName();
  const tomorrow = getDayName(1);
  const [expandedDay, setExpandedDay] = useState<string | null>(null);
  
  const toggleDayExpansion = (day: string) => {
    setExpandedDay(expandedDay === day ? null : day);
  };
  
  return (
    <div className="h-full">
      <div className="p-4 pb-20">
        <h2 className="text-lg font-medium flex items-center mb-4">
          <Calendar className="mr-2 h-5 w-5" />
          Anime Schedule
        </h2>
        
        {/* Today's Schedule */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold flex items-center mb-3 text-anime-primary">
            Today - {today}
            <Badge className="ml-2 bg-anime-primary text-xs" variant="secondary">
              NEW
            </Badge>
          </h3>
          <ul className="space-y-3">
            {schedule[today].slice(0, 5).map((anime) => (
              <li key={anime.id} className="text-sm hover:text-anime-primary transition-colors group">
                <Link to={`/anime/${anime.id}`} className="flex items-center">
                  <div className="w-12 h-16 overflow-hidden rounded mr-3 relative group-hover:ring-1 group-hover:ring-anime-primary transition-all">
                    <img 
                      src={anime.coverImage} 
                      alt={anime.title} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="flex-1">
                    <span className="line-clamp-1 font-medium">{anime.title}</span>
                    <span className="text-xs text-gray-400 line-clamp-1 mt-1">Episode {Math.floor(Math.random() * 12) + 1}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Tomorrow's Schedule */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-3">Tomorrow - {tomorrow}</h3>
          <ul className="space-y-3">
            {schedule[tomorrow].slice(0, 3).map((anime) => (
              <li key={anime.id} className="text-sm hover:text-anime-primary transition-colors group">
                <Link to={`/anime/${anime.id}`} className="flex items-center">
                  <div className="w-12 h-16 overflow-hidden rounded mr-3 relative group-hover:ring-1 group-hover:ring-anime-primary transition-all">
                    <img 
                      src={anime.coverImage} 
                      alt={anime.title} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="flex-1">
                    <span className="line-clamp-1 font-medium">{anime.title}</span>
                    <span className="text-xs text-gray-400 line-clamp-1 mt-1">Episode {Math.floor(Math.random() * 12) + 1}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Full Weekly Schedule (Accordion) */}
        <Accordion type="single" collapsible className="mt-6">
          <AccordionItem value="weekly-schedule" className="border-b-0">
            <AccordionTrigger className="text-sm font-medium py-3 px-2 bg-gray-800/50 rounded-lg hover:bg-gray-800">
              Weekly Schedule
            </AccordionTrigger>
            <AccordionContent className="pt-3">
              {Object.entries(schedule).map(([day, animes]) => (
                <Collapsible 
                  key={day} 
                  className="mb-2" 
                  open={expandedDay === day}
                  onOpenChange={() => toggleDayExpansion(day)}
                >
                  <CollapsibleTrigger className="flex items-center justify-between w-full text-sm font-medium py-2 px-2 rounded hover:bg-gray-800/50 transition-colors">
                    <span className={day === today ? 'text-anime-primary' : ''}>{day}</span>
                    <ChevronRight className={`h-4 w-4 transition-transform ${expandedDay === day ? 'rotate-90' : ''}`} />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <ul className="py-2 space-y-2 ml-2">
                      {animes.map((anime) => (
                        <li key={anime.id} className="text-xs hover:text-anime-primary transition-colors">
                          <Link to={`/anime/${anime.id}`} className="flex items-center py-1">
                            <div className="w-6 h-8 overflow-hidden rounded mr-2">
                              <img 
                                src={anime.coverImage} 
                                alt={anime.title} 
                                className="w-full h-full object-cover" 
                              />
                            </div>
                            <span className="line-clamp-1">{anime.title}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default Schedule;
