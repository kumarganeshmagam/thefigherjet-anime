
import React, { useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import Schedule from '@/components/anime/Schedule';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Calendar, ChevronRight } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  
  // Use Drawer on mobile, Sheet on desktop
  const ScheduleComponent = isMobile ? (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="fixed left-0 top-1/2 -translate-y-1/2 z-30 bg-background/80 backdrop-blur-sm rounded-r-full rounded-l-none border-l-0 hover:translate-x-1 transition-transform"
        >
          <Calendar className="h-4 w-4" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[80vh]">
        <Schedule />
      </DrawerContent>
    </Drawer>
  ) : (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <div className="fixed top-20 left-0 z-30 hidden md:block">
        <SheetTrigger asChild>
          <Button 
            variant="outline" 
            size="icon" 
            className={`${isOpen ? 'translate-x-64' : 'translate-x-0'} transition-transform duration-300 rounded-r-full rounded-l-none border-l-0 bg-background/80 backdrop-blur-sm`}
          >
            {isOpen ? <ChevronRight className="h-4 w-4" /> : <Calendar className="h-4 w-4" />}
          </Button>
        </SheetTrigger>
      </div>
      <SheetContent
        side="left"
        className={`w-64 p-0 ${isOpen ? 'block' : 'hidden'}`}
      >
        <Schedule />
      </SheetContent>
    </Sheet>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      {ScheduleComponent}
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
