import React, { useState, useEffect } from 'react';
import { Search, Star, Clock, AlertCircle } from 'lucide-react';
import { mockContents } from '../../data/mockData';
import { Content } from '../../types';

interface ExpressReviewFormProps {
  onSubmit: (data: {
    contentId: string;
    rating: number;
    emoji: string;
    keyword: string;
    hasSpoilers: boolean;
    isEphemeral: boolean;
  }) => void;
}

const EMOJI_OPTIONS = ['😍', '😊', '🤔', '😐', '😢', '😠', '🤯', '🎭', '🎬', '🎵', '🎧', '📚'];

const ExpressReviewForm: React.FC<ExpressReviewFormProps> = ({ onSubmit }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Content[]>([]);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [rating, setRating] = useState(0);
  const [emoji, setEmoji] = useState('');
  const [keyword, setKeyword] = useState('');
  const [hasSpoilers, setHasSpoilers] = useState(false);
  const [isEphemeral, setIsEphemeral] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Handle search query change
  useEffect(() => {
    if (searchQuery.length > 2) {
      const results = mockContents.filter(content => 
        content.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(results);
      setShowSearchResults(true);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  }, [searchQuery]);

  // Handle content selection
  const handleSelectContent = (content: Content) => {
    setSelectedContent(content);
    setSearchQuery('');
    setShowSearchResults(false);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedContent || rating === 0 || !emoji || !keyword.trim()) {
      // Form validation error
      return;
    }
    
    onSubmit({
      contentId: selectedContent.id,
      rating,
      emoji,
      keyword: keyword.trim(),
      hasSpoilers,
      isEphemeral
    });
    
    // Reset form
    setSelectedContent(null);
    setRating(0);
    setEmoji('');
    setKeyword('');
    setHasSpoilers(false);
    setIsEphemeral(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
      {/* Content Search */}
      <div className="relative">
        <label htmlFor="content-search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Rechercher un contenu
        </label>
        <div className="relative">
          <input
            id="content-search"
            type="text"
            value={selectedContent ? selectedContent.title : searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Titre du film, série, album, podcast..."
            className="input w-full pr-10"
            onClick={() => selectedContent && setSelectedContent(null)}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
        </div>
        
        {/* Search Results Dropdown */}
        {showSearchResults && searchResults.length > 0 && (
          <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-md max-h-60 overflow-y-auto">
            {searchResults.map(content => (
              <div 
                key={content.id}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                onClick={() => handleSelectContent(content)}
              >
                <div className="font-medium">{content.title}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 flex justify-between">
                  <span>{content.year}</span>
                  <span>{content.type}</span>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {showSearchResults && searchResults.length === 0 && searchQuery.length > 2 && (
          <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-md p-3 text-center text-gray-600 dark:text-gray-400">
            Aucun résultat trouvé
          </div>
        )}
      </div>

      {/* Rating */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Note
        </label>
        <div className="flex space-x-2">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              className={`p-2 rounded-full transition-colors ${
                rating >= value 
                  ? 'text-yellow-500' 
                  : 'text-gray-300 dark:text-gray-600 hover:text-yellow-500'
              }`}
            >
              <Star size={24} fill={rating >= value ? 'currentColor' : 'none'} />
            </button>
          ))}
        </div>
      </div>

      {/* Emoji Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Emoji
        </label>
        <div className="grid grid-cols-6 gap-2">
          {EMOJI_OPTIONS.map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => setEmoji(e)}
              className={`text-2xl p-2 rounded-md transition-colors ${
                emoji === e
                  ? 'bg-primary bg-opacity-20 border border-primary'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700 border border-transparent'
              }`}
            >
              {e}
            </button>
          ))}
        </div>
      </div>

      {/* Keyword */}
      <div>
        <label htmlFor="keyword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Mot-clé (max 20 caractères)
        </label>
        <input
          id="keyword"
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value.slice(0, 20))}
          placeholder="Ex: Captivant, Intense, Émouvant..."
          className="input w-full"
          maxLength={20}
        />
        <div className="flex justify-end mt-1">
          <span className="text-xs text-gray-500">
            {keyword.length}/20
          </span>
        </div>
      </div>

      {/* Options */}
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center">
          <input
            id="has-spoilers"
            type="checkbox"
            checked={hasSpoilers}
            onChange={(e) => setHasSpoilers(e.target.checked)}
            className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
          />
          <label htmlFor="has-spoilers" className="ml-2 text-sm text-gray-700 dark:text-gray-300 flex items-center">
            <AlertCircle size={14} className="mr-1" />
            Contient des spoilers
          </label>
        </div>
        
        <div className="flex items-center">
          <input
            id="is-ephemeral"
            type="checkbox"
            checked={isEphemeral}
            onChange={(e) => setIsEphemeral(e.target.checked)}
            className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
          />
          <label htmlFor="is-ephemeral" className="ml-2 text-sm text-gray-700 dark:text-gray-300 flex items-center">
            <Clock size={14} className="mr-1" />
            Avis éphémère (24h)
          </label>
        </div>
      </div>

      {/* Submit */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={!selectedContent || rating === 0 || !emoji || !keyword.trim()}
          className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Publier mon avis express
        </button>
      </div>
    </form>
  );
};

export default ExpressReviewForm;