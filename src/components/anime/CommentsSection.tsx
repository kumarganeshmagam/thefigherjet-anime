
import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { ThumbsUp, MessageCircle } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { addComment, getEpisodeComments } from '@/lib/firebase';
import { Comment } from '@/types/anime';
import { toast } from 'sonner';

interface CommentsSectionProps {
  animeId: string;
  episodeId: string;
}

const CommentsSection = ({ animeId, episodeId }: CommentsSectionProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser } = useAuth();
  
  useEffect(() => {
    const fetchComments = async () => {
      setIsLoading(true);
      try {
        const { comments, error } = await getEpisodeComments(animeId, episodeId);
        if (!error && comments) {
          setComments(comments);
        } else if (error) {
          console.error("Error fetching comments:", error);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchComments();
  }, [animeId, episodeId]);
  
  const handlePostComment = async () => {
    if (!currentUser) {
      toast.error("Please log in to comment");
      return;
    }
    
    if (!newComment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }
    
    setIsLoading(true);
    try {
      const { commentId, error } = await addComment(
        currentUser.uid,
        animeId,
        episodeId,
        newComment
      );
      
      if (!error && commentId) {
        toast.success("Comment posted successfully");
        
        // Refresh comments
        const { comments: updatedComments } = await getEpisodeComments(animeId, episodeId);
        if (updatedComments) {
          setComments(updatedComments);
        }
        
        setNewComment('');
      } else {
        toast.error(error || "Failed to post comment");
      }
    } catch (error) {
      toast.error("An error occurred");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg p-4">
      <h3 className="text-xl font-semibold mb-4 flex items-center">
        <MessageCircle className="mr-2" /> 
        Comments ({comments.length})
      </h3>
      
      {/* Comment form */}
      <div className="mb-6">
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder={currentUser ? "Share your thoughts on this episode..." : "Please log in to comment"}
          disabled={!currentUser || isLoading}
          className="mb-2 min-h-24"
        />
        <div className="flex justify-end">
          <Button 
            onClick={handlePostComment} 
            disabled={!currentUser || isLoading || !newComment.trim()}
            className="bg-anime-primary hover:bg-anime-secondary"
          >
            Post Comment
          </Button>
        </div>
      </div>
      
      {isLoading && comments.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-400">Loading comments...</p>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 bg-gray-800/50 rounded-md">
          <p className="text-gray-400">Be the first to comment on this episode!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="p-3 bg-gray-800 rounded-md">
              <div className="flex items-start gap-3">
                <Avatar>
                  <AvatarImage src={comment.userPhoto || undefined} />
                  <AvatarFallback className="bg-anime-primary text-white">
                    {comment.userName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{comment.userName}</h4>
                    <span className="text-xs text-gray-400">
                      {format(new Date(comment.createdAt), 'MMM d, yyyy • h:mm a')}
                    </span>
                  </div>
                  <p className="mt-1 text-gray-300">{comment.content}</p>
                  <div className="mt-2 flex items-center gap-4">
                    <button className="flex items-center gap-1 text-gray-400 hover:text-anime-primary text-sm">
                      <ThumbsUp size={14} /> {comment.likes} Likes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentsSection;
