import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Film, Tv, Music, Headphones, Search, SlidersHorizontal, X } from 'lucide-react';
import { searchContents } from '../data/mockData';
import { Content, ContentType } from '../types';
import ContentCard from '../components/content/ContentCard';

const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialType = searchParams.get('type') as ContentType | null;
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedType, setSelectedType] = useState<ContentType | null>(initialType);
  const [results, setResults] = useState<Content[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [yearRange, setYearRange] = useState<[number, number]>([1900, new Date().getFullYear()]);
  
  // All available genres from sample data
  const allGenres = [
    'Action', 'Adventure', 'Biography', 'Comedy', 'Drama', 'Documentary', 
    'Electronic', 'History', 'Indie', 'Investigative Journalism', 'Pop', 
    'R&B', 'Rock', 'Science Fiction', 'Storytelling', 'Thriller', 'True Crime'
  ];

  // Perform search when query or filters change
  useEffect(() => {
    if (initialQuery || initialType) {
      const searchResults = searchContents(initialQuery, initialType || undefined);
      setResults(searchResults);
    }
  }, [initialQuery, initialType]);

  // Update search results when search is performed
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update URL parameters
    const params: Record<string, string> = {};
    if (searchQuery) params.q = searchQuery;
    if (selectedType) params.type = selectedType;
    setSearchParams(params);
    
    // Perform search
    const searchResults = searchContents(searchQuery, selectedType || undefined);
    
    // Apply additional filters (client-side filtering)
    const filteredResults = searchResults.filter(content => {
      // Filter by selected genres if any
      const matchesGenre = selectedGenres.length === 0 || 
        content.genre.some(genre => selectedGenres.includes(genre));
      
      // Filter by year range
      const matchesYear = content.year >= yearRange[0] && content.year <= yearRange[1];
      
      return matchesGenre && matchesYear;
    });
    
    setResults(filteredResults);
  };

  // Handle content type filter
  const handleTypeFilter = (type: ContentType | null) => {
    setSelectedType(type);
  };

  // Toggle genre selection
  const toggleGenre = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter(g => g !== genre));
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedType(null);
    setSelectedGenres([]);
    setYearRange([1900, new Date().getFullYear()]);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <section>
        <h1 className="text-3xl font-bold mb-6">Recherche</h1>
        
        <div className="card p-6 mb-8">
          <form onSubmit={handleSearch}>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher films, séries, musique, podcasts..."
                  className="input w-full pl-10"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search size={18} className="text-gray-400" />
                </div>
              </div>
              <button type="submit" className="btn btn-primary whitespace-nowrap">
                Rechercher
              </button>
              <button 
                type="button" 
                onClick={() => setShowFilters(!showFilters)}
                className="btn text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center"
              >
                <SlidersHorizontal size={16} className="mr-2" />
                Filtres
              </button>
            </div>
            
            {/* Filters */}
            {showFilters && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Type de contenu</h3>
                  <div className="grid grid-cols-4 gap-2">
                    <button
                      type="button"
                      onClick={() => handleTypeFilter(null)}
                      className={`py-2 px-3 rounded-md flex flex-col items-center text-center text-sm ${
                        selectedType === null
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      <span>Tous</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTypeFilter('film')}
                      className={`py-2 px-3 rounded-md flex flex-col items-center text-center text-sm ${
                        selectedType === 'film'
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      <Film size={18} className="mb-1" />
                      <span>Films</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTypeFilter('series')}
                      className={`py-2 px-3 rounded-md flex flex-col items-center text-center text-sm ${
                        selectedType === 'series'
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      <Tv size={18} className="mb-1" />
                      <span>Séries</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTypeFilter('music')}
                      className={`py-2 px-3 rounded-md flex flex-col items-center text-center text-sm ${
                        selectedType === 'music'
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      <Music size={18} className="mb-1" />
                      <span>Musique</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTypeFilter('podcast')}
                      className={`py-2 px-3 rounded-md flex flex-col items-center text-center text-sm ${
                        selectedType === 'podcast'
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      <Headphones size={18} className="mb-1" />
                      <span>Podcasts</span>
                    </button>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Année</h3>
                  <div className="flex items-center space-x-4">
                    <input
                      type="number"
                      min="1900"
                      max={yearRange[1]}
                      value={yearRange[0]}
                      onChange={(e) => setYearRange([parseInt(e.target.value), yearRange[1]])}
                      className="input w-24"
                    />
                    <span>à</span>
                    <input
                      type="number"
                      min={yearRange[0]}
                      max={new Date().getFullYear()}
                      value={yearRange[1]}
                      onChange={(e) => setYearRange([yearRange[0], parseInt(e.target.value)])}
                      className="input w-24"
                    />
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Genres</h3>
                  <div className="flex flex-wrap gap-2">
                    {allGenres.map(genre => (
                      <button
                        key={genre}
                        type="button"
                        onClick={() => toggleGenre(genre)}
                        className={`px-3 py-1 rounded-full text-sm ${
                          selectedGenres.includes(genre)
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {genre}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="md:col-span-2 flex justify-end">
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    <X size={16} className="mr-1" />
                    Effacer les filtres
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
        
        {/* Search Results */}
        {searchQuery || selectedType ? (
          <>
            <h2 className="text-xl font-semibold mb-4">
              Résultats {results.length > 0 ? `(${results.length})` : ''}
            </h2>
            
            {results.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {results.map(content => (
                  <ContentCard key={content.id} content={content} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Search size={48} className="mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium mb-2">Aucun résultat trouvé</h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                  Essayez de modifier vos termes de recherche ou vos filtres pour trouver ce que vous cherchez.
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <Search size={48} className="mx-auto mb-4 text-gray-400" />
            <h2 className="text-xl font-medium mb-2">Recherchez n'importe quel contenu</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              Films, séries, musique, podcasts... Trouvez tout au même endroit.
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default SearchPage;