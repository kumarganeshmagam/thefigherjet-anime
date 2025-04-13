
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import StarRating from './StarRating';
import { useAuth } from '@/contexts/AuthContext';
import { rateAnime } from '@/lib/firebase';
import { toast } from 'sonner';

interface RatingModalProps {
  animeId: string;
  animeName: string;
  isOpen: boolean;
  onClose: () => void;
  onRated?: () => void;
  currentRating?: number;
}

const RatingModal = ({
  animeId,
  animeName,
  isOpen,
  onClose,
  onRated,
  currentRating = 0
}: RatingModalProps) => {
  const [rating, setRating] = useState(currentRating);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { currentUser } = useAuth();
  
  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };
  
  const handleSubmit = async () => {
    if (!currentUser) {
      toast.error("Please log in to rate anime");
      onClose();
      return;
    }
    
    setIsSubmitting(true);
    try {
      const { success, error } = await rateAnime(currentUser.uid, animeId, rating);
      
      if (success) {
        toast.success(`You rated ${animeName} ${rating} out of 5 stars`);
        if (onRated) onRated();
        onClose();
      } else {
        toast.error(error || "Failed to submit rating");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rate {animeName}</DialogTitle>
          <DialogDescription>
            How would you rate this anime?
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-8 flex flex-col items-center justify-center">
          <StarRating
            initialRating={currentRating}
            onRatingChange={handleRatingChange}
            size="large"
          />
          <p className="mt-4 text-lg font-semibold">
            {rating} out of 5
          </p>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting || rating === 0}
            className="bg-anime-primary hover:bg-anime-secondary"
          >
            Submit Rating
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RatingModal;
