// src/components/reviews/ReviewCard.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ThumbsUp, ThumbsDown, MessageSquare, Clock } from 'lucide-react';
import { Review, User } from '../../types'; // Adaptez ce chemin si nécessaire

interface ReviewCardProps {
  review: Review;
  user?: User;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review, user }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSpoiler, setShowSpoiler] = useState(review.text ? !review.hasSpoilers : true); // Ne masque que s'il y a du texte et un spoiler

  const formatDate = (dateInput: Date | string | undefined) => {
    if (!dateInput) return 'Date inconnue';
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const timeLeft = review.isEphemeral && review.expiresAt
    ? Math.max(0, Math.floor((new Date(review.expiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
    : null;

  const getRatingColor = (rating: number | null | undefined): string => {
    if (rating === null || rating === undefined) return 'text-gray-500 dark:text-gray-400'; // Couleur pour note non définie
    if (rating >= 8) return 'text-green-500 dark:text-green-400';
    if (rating >= 5) return 'text-yellow-500 dark:text-yellow-400';
    if (rating >= 1) return 'text-red-500 dark:text-red-400';
    return 'text-gray-500 dark:text-gray-400'; // Par défaut ou pour 0 si vous l'autorisez
  };

  const profileImage = user?.profileImageUrl || `https://api.dicebear.com/8.x/initials/svg?seed=${user?.username || 'Anonyme'}&radius=50&backgroundType=gradientLinear&fontFamily=Arial`;

  return (
    <div className={`card p-5 md:p-6 ${review.isEphemeral ? 'border-2 border-amber-400/70 dark:border-amber-600/70 shadow-amber-500/10' : 'shadow-sm dark:shadow-md'}`}>
      <div className="flex flex-col sm:flex-row justify-between items-start mb-3">
        <div className="flex items-center mb-3 sm:mb-0">
          <Link to={user ? `/profile/${user.id}` : '#'}>
            <img
              src={profileImage}
              alt={user?.username || 'Avatar utilisateur'}
              className="w-10 h-10 rounded-full mr-3 border border-gray-200 dark:border-gray-700 object-cover"
            />
          </Link>
          <div>
            <Link to={user ? `/profile/${user.id}` : '#'} className="font-semibold text-gray-800 dark:text-gray-200 hover:text-primary transition-colors">
              {user?.username || 'Utilisateur anonyme'}
            </Link>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {formatDate(review.createdAt)}
              {review.context && <span className="italic"> • {review.context}</span>}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2 self-start sm:self-center mt-2 sm:mt-0">
          {review.emoji && <div className="text-2xl md:text-3xl transform transition-transform hover:scale-125">{review.emoji}</div>}
          {review.rating !== null && review.rating !== undefined && (
            <div className={`flex items-baseline p-1.5 rounded-lg bg-gray-100 dark:bg-gray-700/60 ${getRatingColor(review.rating)}`}>
              <span className="text-xl md:text-2xl font-bold">{review.rating}</span>
              <span className="text-sm font-medium opacity-80">/10</span>
            </div>
          )}
        </div>
      </div>

      {review.isEphemeral && review.expiresAt && (
        <div className="mb-3 flex items-center text-amber-700 dark:text-amber-400 text-sm p-2 bg-amber-50 dark:bg-amber-800/20 rounded-md border border-amber-200 dark:border-amber-700/50">
          <Clock size={14} className="mr-2 flex-shrink-0" />
          {timeLeft === 0
            ? "Cet avis express est sur le point d'expirer."
            : `Avis express, expire dans ${timeLeft} jour${timeLeft! > 1 ? 's' : ''}.`}
        </div>
      )}

      {review.keyword && (
        <div className="mb-3">
          <span className="font-bold text-lg text-gray-800 dark:text-gray-200">{review.keyword}</span>
        </div>
      )}

      {review.text && (
        <div className="mb-4 text-gray-700 dark:text-gray-300 prose prose-sm dark:prose-invert max-w-none">
          {review.hasSpoilers && !showSpoiler ? (
            <div
              className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md text-center cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              onClick={() => setShowSpoiler(true)}
            >
              <AlertTriangle size={18} className="inline-block mr-2 text-orange-500" />
              <span className="text-sm">Ce commentaire contient des spoilers. Cliquez pour afficher.</span>
            </div>
          ) : (
            <p className={`${!isExpanded && review.text.length > 200 ? 'line-clamp-4' : ''}`}>
              {review.text}
            </p>
          )}
          {review.text.length > 200 && (review.hasSpoilers ? showSpoiler : true) && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-primary hover:text-primary-dark dark:text-primary-300 dark:hover:text-primary-400 text-sm mt-1 font-medium"
            >
              {isExpanded ? 'Voir moins' : 'Voir plus'}
            </button>
          )}
        </div>
      )}

      {review.audioUrl && (
        <div className="my-4">
          <audio
            controls
            src={review.audioUrl}
            className="w-full h-10"
            preload="none"
          >
            Votre navigateur ne supporte pas l'élément audio.
          </audio>
        </div>
      )}

      <div className="flex space-x-4 text-gray-500 dark:text-gray-400 text-sm border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
        <button className="flex items-center hover:text-primary dark:hover:text-primary-300 transition-colors">
          <ThumbsUp size={16} className="mr-1.5" />
          <span>Utile</span> {/* TODO: (12) - Rendre dynamique */}
        </button>
        <button className="flex items-center hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
          <ThumbsDown size={16} className="mr-1.5" />
        </button>
        <button className="flex items-center hover:text-primary dark:hover:text-primary-300 transition-colors">
          <MessageSquare size={16} className="mr-1.5" />
          <span>Commenter</span>
        </button>
      </div>
    </div>
  );
};

export default ReviewCard;