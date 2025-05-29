import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ThumbsUp, ThumbsDown, MessageSquare, Clock } from 'lucide-react';
import { Review, User } from '../../types';

interface ReviewCardProps {
  review: Review;
  user?: User;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review, user }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSpoiler, setShowSpoiler] = useState(!review.hasSpoilers);
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };
  
  const timeLeft = review.isEphemeral && review.expiresAt 
    ? Math.max(0, Math.floor((new Date(review.expiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
    : null;

  return (
    <div className={`card p-6 ${review.isEphemeral ? 'border border-amber-300 dark:border-amber-600' : ''}`}>
      {/* User Info & Rating */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center">
          {user ? (
            <>
              <Link to={`/profile/${user.id}`}>
                <img 
                  src={user.profileImageUrl || "https://images.pexels.com/photos/1462630/pexels-photo-1462630.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"}
                  alt={user.username} 
                  className="w-10 h-10 rounded-full mr-3"
                />
              </Link>
              <div>
                <Link to={`/profile/${user.id}`} className="font-medium hover:text-primary transition-colors">
                  {user.username}
                </Link>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(review.createdAt)}
                  {review.context && <span> • {review.context}</span>}
                </div>
              </div>
            </>
          ) : (
            <div>
              <span className="font-medium">Utilisateur anonyme</span>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {formatDate(review.createdAt)}
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center">
          <div className="text-xl mr-2">{review.emoji}</div>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <span 
                key={star} 
                className={`text-lg ${star <= review.rating ? 'text-yellow-500' : 'text-gray-300 dark:text-gray-600'}`}
              >
                ★
              </span>
            ))}
          </div>
        </div>
      </div>
      
      {/* Ephemeral Badge */}
      {review.isEphemeral && (
        <div className="mb-3 flex items-center text-amber-600 dark:text-amber-400 text-sm">
          <Clock size={14} className="mr-1" />
          {timeLeft === 0 
            ? "Expire aujourd'hui" 
            : `Expire dans ${timeLeft} jour${timeLeft > 1 ? 's' : ''}`}
        </div>
      )}
      
      {/* Keyword */}
      <div className="mb-3">
        <span className="font-medium text-lg">{review.keyword}</span>
      </div>
      
      {/* Review Content */}
      {review.text && (
        <div className="mb-4">
          {review.hasSpoilers && !showSpoiler ? (
            <div 
              className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md text-center cursor-pointer"
              onClick={() => setShowSpoiler(true)}
            >
              <AlertTriangle size={18} className="inline-block mr-2 text-amber-600" />
              <span>Ce commentaire contient des spoilers. Cliquez pour afficher.</span>
            </div>
          ) : (
            <p className={`text-gray-700 dark:text-gray-300 ${!isExpanded && review.text.length > 200 ? 'line-clamp-3' : ''}`}>
              {review.text}
            </p>
          )}
          
          {review.text.length > 200 && (
            <button 
              onClick={() => setIsExpanded(!isExpanded)} 
              className="text-primary hover:text-primary-dark text-sm mt-1"
            >
              {isExpanded ? 'Voir moins' : 'Voir plus'}
            </button>
          )}
        </div>
      )}
      
      {/* Audio Review */}
      {review.audioUrl && (
        <div className="mb-4">
          <audio 
            controls 
            className="w-full"
            preload="none"
          >
            <source src={review.audioUrl} type="audio/mpeg" />
            Votre navigateur ne supporte pas l'élément audio.
          </audio>
        </div>
      )}
      
      {/* Actions */}
      <div className="flex space-x-4 text-gray-500 dark:text-gray-400 text-sm">
        <button className="flex items-center hover:text-gray-700 dark:hover:text-gray-300">
          <ThumbsUp size={16} className="mr-1" />
          <span>Utile (12)</span>
        </button>
        <button className="flex items-center hover:text-gray-700 dark:hover:text-gray-300">
          <ThumbsDown size={16} className="mr-1" />
          <span>Pas utile (2)</span>
        </button>
        <button className="flex items-center hover:text-gray-700 dark:hover:text-gray-300">
          <MessageSquare size={16} className="mr-1" />
          <span>Commenter</span>
        </button>
      </div>
    </div>
  );
};

export default ReviewCard;