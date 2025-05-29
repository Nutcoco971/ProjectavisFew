import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Clock, AlertCircle, Heart, Share, Bookmark, Play, ChevronRight, MessageCircle } from 'lucide-react';
import { getContentById, getReviewsByContentId, getUserById } from '../data/mockData';
import { Content, Review, ContentStats } from '../types';
import ExpressReviewForm from '../components/reviews/ExpressReviewForm';
import ReviewCard from '../components/reviews/ReviewCard';

const ContentDetailPage: React.FC = () => {
  const { type, id } = useParams<{ type: string; id: string }>();
  const [content, setContent] = useState<Content | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ContentStats | null>(null);
  const [activeTab, setActiveTab] = useState<'reviews' | 'info' | 'similar'>('reviews');
  const [isWritingReview, setIsWritingReview] = useState(false);

  useEffect(() => {
    if (id) {
      const contentData = getContentById(id);
      if (contentData) {
        setContent(contentData);
        const reviewsData = getReviewsByContentId(id);
        setReviews(reviewsData);
        
        // Generate mock stats
        setStats({
          totalReviews: reviewsData.length,
          averageRating: contentData.rating || 0,
          ratingDistribution: {
            '1': 2,
            '2': 5,
            '3': 10,
            '4': 20,
            '5': 15
          },
          topKeywords: ['Captivant', 'Impressionnant', 'Intense'],
          topEmojis: ['🤯', '😍', '👍']
        });
      }
    }
  }, [id]);

  if (!content) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-pulse">Chargement...</div>
      </div>
    );
  }

  const handleSubmitReview = (data: any) => {
    console.log('Review submitted:', data);
    setIsWritingReview(false);
    // In a real app, you would save the review to a database
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Section */}
      <section className="relative rounded-xl overflow-hidden h-64 md:h-80">
        <img 
          src={content.imageUrl} 
          alt={content.title} 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{content.title}</h1>
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <span className="text-sm">{content.year}</span>
            <span className="text-sm">{content.creator}</span>
            <div className="flex items-center">
              <Star size={16} className="text-yellow-500 mr-1" fill="currentColor" />
              <span>{content.rating?.toFixed(1)}</span>
            </div>
            <div className="flex gap-1">
              {content.genre.map((genre, index) => (
                <span key={index} className="text-xs bg-black bg-opacity-40 px-2 py-1 rounded-full">
                  {genre}
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="btn btn-primary flex items-center">
              <Play size={16} className="mr-1" /> Vu
            </button>
            <button className="p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors">
              <Heart size={20} />
            </button>
            <button className="p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors">
              <Bookmark size={20} />
            </button>
            <button className="p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors">
              <Share size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Tabs Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex -mb-px">
          <button
            onClick={() => setActiveTab('reviews')}
            className={`mr-8 py-4 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'reviews'
                ? 'border-primary text-primary dark:text-primary-300'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Avis ({reviews.length})
          </button>
          <button
            onClick={() => setActiveTab('info')}
            className={`mr-8 py-4 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'info'
                ? 'border-primary text-primary dark:text-primary-300'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Informations
          </button>
          <button
            onClick={() => setActiveTab('similar')}
            className={`mr-8 py-4 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'similar'
                ? 'border-primary text-primary dark:text-primary-300'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Similaires
          </button>
        </nav>
      </div>

      {/* Content based on active tab */}
      <div className="space-y-6">
        {activeTab === 'reviews' && (
          <>
            {/* Quick Review Button */}
            {!isWritingReview ? (
              <div className="flex justify-center mb-6">
                <button
                  onClick={() => setIsWritingReview(true)}
                  className="btn btn-primary flex items-center"
                >
                  <MessageCircle size={16} className="mr-2" />
                  Donner mon avis
                </button>
              </div>
            ) : (
              <div className="card p-6 animate-slide-up">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Avis Express</h3>
                  <button 
                    onClick={() => setIsWritingReview(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    Annuler
                  </button>
                </div>
                <ExpressReviewForm onSubmit={handleSubmitReview} />
              </div>
            )}

            {/* Reviews List */}
            <div className="space-y-4">
              {reviews.length > 0 ? (
                reviews.map(review => {
                  const user = getUserById(review.userId);
                  return (
                    <ReviewCard 
                      key={review.id}
                      review={review}
                      user={user}
                    />
                  );
                })
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <MessageCircle size={32} className="mx-auto mb-2 opacity-50" />
                  <p>Aucun avis pour l'instant. Soyez le premier à partager votre opinion !</p>
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === 'info' && (
          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="text-lg font-medium mb-4">Description</h3>
              <p className="text-gray-700 dark:text-gray-300">
                {content.description}
              </p>
            </div>
            
            {stats && (
              <div className="card p-6">
                <h3 className="text-lg font-medium mb-4">Statistiques</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                      Distribution des notes
                    </h4>
                    <div className="space-y-2">
                      {[5, 4, 3, 2, 1].map((rating) => {
                        const count = stats.ratingDistribution[rating as keyof typeof stats.ratingDistribution];
                        const percentage = (count / stats.totalReviews) * 100;
                        
                        return (
                          <div key={rating} className="flex items-center">
                            <div className="flex items-center w-8">
                              <span className="text-sm">{rating}</span>
                              <Star size={12} className="ml-1 text-yellow-500" fill="currentColor" />
                            </div>
                            <div className="flex-1 mx-2 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-primary"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-500 dark:text-gray-400 w-8">
                              {count}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  <div>
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                        Mots-clés populaires
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {stats.topKeywords.map((keyword, index) => (
                          <span 
                            key={index} 
                            className="text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                        Emojis populaires
                      </h4>
                      <div className="flex gap-2">
                        {stats.topEmojis.map((emoji, index) => (
                          <span 
                            key={index} 
                            className="text-2xl bg-gray-100 dark:bg-gray-700 p-2 rounded-full"
                          >
                            {emoji}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'similar' && (
          <div className="space-y-6">
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                Les recommandations similaires seront bientôt disponibles.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <Link 
          to="/" 
          className="text-primary hover:text-primary-dark dark:hover:text-primary-300 flex items-center"
        >
          <ChevronRight size={16} className="mr-1 rotate-180" />
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
};

export default ContentDetailPage;