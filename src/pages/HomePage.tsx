import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Bookmark, Star, Tv, Music, Headphones, Film, TrendingUp } from 'lucide-react';
import { mockContents } from '../data/mockData';
import ContentCard from '../components/content/ContentCard';
import ExpressReviewForm from '../components/reviews/ExpressReviewForm';

const HomePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'films' | 'series' | 'music' | 'podcasts'>('all');
  const [selectedContent, setSelectedContent] = useState<string | null>(null);
  
  // Filter content based on active tab
  const filteredContent = activeTab === 'all' 
    ? mockContents 
    : mockContents.filter(content => content.type === activeTab.slice(0, -1)); // Remove the 's' at the end

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="relative rounded-xl overflow-hidden h-72 md:h-96">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600"></div>
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="relative z-10 flex flex-col justify-center items-center h-full text-white text-center px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Partagez vos impressions en 30 secondes</h1>
          <p className="text-lg md:text-xl mb-6 max-w-2xl">Films, séries, musique, podcasts... Donnez votre avis sur tous vos contenus préférés au même endroit.</p>
          <Link to="/search" className="btn btn-primary flex items-center">
            <Play size={16} className="mr-2" />
            Commencer
          </Link>
        </div>
      </section>

      {/* Quick Express Review */}
      <section className="card p-6">
        <h2 className="text-xl font-semibold mb-4">Avis Express</h2>
        <ExpressReviewForm 
          onSubmit={(data) => console.log('Express review submitted:', data)}
        />
      </section>

      {/* Content Tabs */}
      <section>
        <div className="flex overflow-x-auto pb-2 mb-4 space-x-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex items-center px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
              activeTab === 'all' 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            <TrendingUp size={16} className="mr-2" />
            Tous
          </button>
          <button
            onClick={() => setActiveTab('films')}
            className={`flex items-center px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
              activeTab === 'films' 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            <Film size={16} className="mr-2" />
            Films
          </button>
          <button
            onClick={() => setActiveTab('series')}
            className={`flex items-center px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
              activeTab === 'series' 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            <Tv size={16} className="mr-2" />
            Séries
          </button>
          <button
            onClick={() => setActiveTab('music')}
            className={`flex items-center px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
              activeTab === 'music' 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            <Music size={16} className="mr-2" />
            Musique
          </button>
          <button
            onClick={() => setActiveTab('podcasts')}
            className={`flex items-center px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
              activeTab === 'podcasts' 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            <Headphones size={16} className="mr-2" />
            Podcasts
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredContent.map(content => (
            <ContentCard 
              key={content.id}
              content={content}
              onClick={() => setSelectedContent(content.id === selectedContent ? null : content.id)}
              isSelected={content.id === selectedContent}
            />
          ))}
        </div>
      </section>

      {/* Featured Lists */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Listes Recommandées</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="card p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-medium mb-2">Films pour un dimanche pluvieux</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Une sélection parfaite pour se détendre quand il pleut dehors.</p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">10 films</span>
              <button className="text-primary hover:text-primary-dark">
                <Bookmark size={18} />
              </button>
            </div>
          </div>
          <div className="card p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-medium mb-2">Séries qui vont vous obséder</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Ces séries addictives vont vous tenir en haleine.</p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">8 séries</span>
              <button className="text-primary hover:text-primary-dark">
                <Bookmark size={18} />
              </button>
            </div>
          </div>
          <div className="card p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-medium mb-2">Podcasts pour votre trajet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Rendez vos trajets plus intéressants avec ces podcasts captivants.</p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">12 podcasts</span>
              <button className="text-primary hover:text-primary-dark">
                <Bookmark size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;