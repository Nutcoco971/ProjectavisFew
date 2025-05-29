// src/components/reviews/ExpressReviewForm.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Search, Clock, AlertCircle, ChevronDown, Star as StarIcon } from 'lucide-react';
import { mockContents } from '../../data/mockData'; // Adaptez ce chemin si nécessaire
import { Content } from '../../types'; // Adaptez ce chemin si nécessaire

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
  const [rating, setRating] = useState<number>(0);
  const [emoji, setEmoji] = useState('');
  const [keyword, setKeyword] = useState('');
  const [hasSpoilers, setHasSpoilers] = useState(false);
  const [isEphemeral, setIsEphemeral] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showRatingDropdown, setShowRatingDropdown] = useState(false);

  const ratingDropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null); // Pour gérer le focus

  useEffect(() => {
    if (searchQuery.length > 1 && !selectedContent) { // Réduit à 2 caractères pour la recherche
      const results = mockContents.filter(content =>
        content.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(results);
      setShowSearchResults(true);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  }, [searchQuery, selectedContent]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ratingDropdownRef.current && !ratingDropdownRef.current.contains(event.target as Node)) {
        setShowRatingDropdown(false);
      }
      // Pour le dropdown de recherche aussi
      if (searchInputRef.current && !searchInputRef.current.parentElement?.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelectContent = (content: Content) => {
    setSelectedContent(content);
    setSearchQuery(content.title);
    setShowSearchResults(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedContent || rating === 0 || !emoji || !keyword.trim()) {
      // TODO: Gérer une notification d'erreur plus visible pour l'utilisateur
      console.error("Validation error: missing fields");
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
    setSelectedContent(null);
    setSearchQuery('');
    setRating(0);
    setEmoji('');
    setKeyword('');
    setHasSpoilers(false);
    setIsEphemeral(false);
  };

  const handleRatingSelect = (value: number) => {
    setRating(value);
    setShowRatingDropdown(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
      <div className="relative">
        <label htmlFor="content-search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Quel contenu souhaitez-vous noter ?
        </label>
        <div className="relative" ref={searchInputRef}>
          <input
            id="content-search"
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (selectedContent) setSelectedContent(null);
            }}
            onFocus={() => searchQuery.length > 1 && !selectedContent && setShowSearchResults(true)}
            placeholder="Titre du film, série, album, podcast..."
            className="input w-full pr-10"
            autoComplete="off"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          {showSearchResults && searchResults.length > 0 && (
            <div className="absolute z-20 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-md max-h-60 overflow-y-auto border border-gray-200 dark:border-gray-700">
              {searchResults.map(content => (
                <div
                  key={content.id}
                  className="p-3 hover:bg-primary/10 dark:hover:bg-primary/20 cursor-pointer transition-colors duration-150"
                  onClick={() => handleSelectContent(content)}
                >
                  <div className="font-medium text-gray-800 dark:text-gray-200">{content.title}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 flex justify-between">
                    <span>{content.year}</span>
                    <span className="capitalize">{content.type}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          {showSearchResults && searchResults.length === 0 && searchQuery.length > 1 && !selectedContent && (
            <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-md p-3 text-center text-sm text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
              Aucun résultat trouvé pour "{searchQuery}"
            </div>
          )}
        </div>
      </div>

      <div className="relative" ref={ratingDropdownRef}>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Votre note (sur 10)
        </label>
        <button
          type="button"
          onClick={() => setShowRatingDropdown(!showRatingDropdown)}
          className="input w-full flex justify-between items-center text-left"
          aria-haspopup="listbox"
          aria-expanded={showRatingDropdown}
        >
          {rating === 0 ? (
            <span className="text-gray-400 dark:text-gray-500">Sélectionner une note</span>
          ) : (
            <span className="font-semibold text-primary">{rating}/10</span>
          )}
          <ChevronDown size={20} className={`text-gray-400 transition-transform ${showRatingDropdown ? 'rotate-180' : ''}`} />
        </button>
        {showRatingDropdown && (
          <div
            className="absolute z-20 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-md max-h-60 overflow-y-auto border border-gray-200 dark:border-gray-700 py-1"
            role="listbox"
          >
            {[...Array(10)].map((_, i) => {
              const value = i + 1;
              return (
                <div
                  key={value}
                  onClick={() => handleRatingSelect(value)}
                  className={`px-4 py-2.5 cursor-pointer hover:bg-primary/10 dark:hover:bg-primary/20 ${
                    rating === value ? 'bg-primary/20 font-semibold text-primary dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'
                  } transition-colors duration-150 flex items-center justify-between text-sm`}
                  role="option"
                  aria-selected={rating === value}
                >
                  <span>{value}</span>
                  <StarIcon size={16} className={rating >= value ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-600'} />
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Votre ressenti en un emoji
        </label>
        <div className="grid grid-cols-6 gap-2">
          {EMOJI_OPTIONS.map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => setEmoji(e)}
              className={`text-2xl p-2 rounded-lg transition-all duration-150 ease-in-out transform hover:scale-110 ${
                emoji === e
                  ? 'bg-primary/20 ring-2 ring-primary'
                  : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {e}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="keyword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          En un mot <span className="text-xs text-gray-400 dark:text-gray-500">(max 30 caract.)</span>
        </label>
        <input
          id="keyword"
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value.slice(0, 30))}
          placeholder="Ex: Captivant, Intense, Émouvant..."
          className="input w-full"
          maxLength={30}
        />
        <div className="flex justify-end mt-1">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {keyword.length}/30
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-x-6 gap-y-3">
        <div className="flex items-center">
          <input
            id="has-spoilers"
            type="checkbox"
            checked={hasSpoilers}
            onChange={(e) => setHasSpoilers(e.target.checked)}
            className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary dark:focus:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
          />
          <label htmlFor="has-spoilers" className="ml-2 text-sm text-gray-700 dark:text-gray-300 flex items-center">
            <AlertCircle size={14} className="mr-1 text-orange-500" />
            Contient des spoilers
          </label>
        </div>
        <div className="flex items-center">
          <input
            id="is-ephemeral"
            type="checkbox"
            checked={isEphemeral}
            onChange={(e) => setIsEphemeral(e.target.checked)}
            className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary dark:focus:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
          />
          <label htmlFor="is-ephemeral" className="ml-2 text-sm text-gray-700 dark:text-gray-300 flex items-center">
            <Clock size={14} className="mr-1 text-blue-500" />
            Avis éphémère <span className="text-xs text-gray-400 dark:text-gray-500 ml-1">(sera masqué après 24h)</span>
          </label>
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={!selectedContent || rating === 0 || !emoji || !keyword.trim()}
          className="btn btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
        >
          Publier mon avis express
        </button>
      </div>
    </form>
  );
};

export default ExpressReviewForm;