import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Film, Tv, Music, Headphones } from 'lucide-react';
import { Content } from '../../types';

interface ContentCardProps {
  content: Content;
  isSelected?: boolean;
  onClick?: () => void;
}

const ContentCard: React.FC<ContentCardProps> = ({ content, isSelected = false, onClick }) => {
  // Get icon based on content type
  const getTypeIcon = () => {
    switch (content.type) {
      case 'film':
        return <Film size={16} />;
      case 'series':
        return <Tv size={16} />;
      case 'music':
        return <Music size={16} />;
      case 'podcast':
        return <Headphones size={16} />;
      default:
        return null;
    }
  };
  
  // Get type label
  const getTypeLabel = () => {
    switch (content.type) {
      case 'film':
        return 'Film';
      case 'series':
        return 'Série';
      case 'music':
        return 'Musique';
      case 'podcast':
        return 'Podcast';
      default:
        return '';
    }
  };

  return (
    <div 
      className={`card group cursor-pointer hover:shadow-md overflow-hidden ${
        isSelected ? 'ring-2 ring-primary' : ''
      }`}
      onClick={onClick}
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={content.imageUrl} 
          alt={content.title} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-2 left-2 bg-black bg-opacity-60 text-white text-xs font-medium px-2 py-1 rounded-full flex items-center">
          {getTypeIcon()}
          <span className="ml-1">{getTypeLabel()}</span>
        </div>
        {content.rating && (
          <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-medium px-2 py-1 rounded-full flex items-center">
            <Star size={12} className="mr-1" />
            {content.rating.toFixed(1)}
          </div>
        )}
      </div>
      <div className="p-4">
        <Link to={`/content/${content.type}/${content.id}`}>
          <h3 className="font-medium text-lg mb-1 line-clamp-1 hover:text-primary transition-colors">
            {content.title}
          </h3>
        </Link>
        <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400 mb-2">
          <span>{content.year}</span>
          <span>{content.creator}</span>
        </div>
        <div className="flex flex-wrap gap-1 mb-2">
          {content.genre.slice(0, 2).map((genre, index) => (
            <span 
              key={index} 
              className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full"
            >
              {genre}
            </span>
          ))}
          {content.genre.length > 2 && (
            <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full">
              +{content.genre.length - 2}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
          {content.description}
        </p>
      </div>
    </div>
  );
};

export default ContentCard;