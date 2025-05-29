import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  User, Settings, Film, Tv, Music, Headphones, Clock, Calendar, 
  TrendingUp, Heart, BarChart2
} from 'lucide-react';
import { getUserById, mockReviews, getContentById } from '../data/mockData';
import ReviewCard from '../components/reviews/ReviewCard';
import { Review, Content } from '../types';

const ProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState(getUserById(id || '1')); // Default to first user if no ID
  const [userReviews, setUserReviews] = useState<Review[]>([]);
  const [reviewContents, setReviewContents] = useState<Record<string, Content>>({});
  const [activeTab, setActiveTab] = useState<'reviews' | 'stats' | 'lists'>('reviews');

  useEffect(() => {
    // Get user data
    const userData = getUserById(id || '1');
    if (userData) {
      setUser(userData);
      
      // Get user reviews
      const reviews = mockReviews.filter(review => review.userId === userData.id);
      setUserReviews(reviews);
      
      // Get content for each review
      const contents: Record<string, Content> = {};
      reviews.forEach(review => {
        const content = getContentById(review.contentId);
        if (content) {
          contents[review.contentId] = content;
        }
      });
      setReviewContents(contents);
    }
  }, [id]);

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-pulse">Utilisateur non trouvé</div>
      </div>
    );
  }

  // Format date
  const formatJoinDate = (date: Date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Profile Header */}
      <section className="card overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-blue-600 to-purple-600"></div>
        <div className="p-6 relative">
          <div className="absolute -top-12 left-6">
            <img 
              src={user.profileImageUrl || "https://images.pexels.com/photos/1462630/pexels-photo-1462630.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"}
              alt={user.username} 
              className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-800"
            />
          </div>
          <div className="flex justify-end mb-4">
            <button className="btn flex items-center text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
              <Settings size={16} className="mr-2" />
              Modifier le profil
            </button>
          </div>
          <div className="mt-6">
            <h1 className="text-2xl font-bold mb-2">{user.username}</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-4 flex items-center">
              <Calendar size={16} className="mr-2" />
              Membre depuis {formatJoinDate(user.joinedAt)}
            </p>
            {user.bio && (
              <p className="text-gray-700 dark:text-gray-300 mb-6">{user.bio}</p>
            )}
            <div className="flex flex-wrap gap-2 mb-2">
              <div className="flex items-center text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-full px-3 py-1">
                <Film size={14} className="mr-1" />
                <span className="text-sm">10 Films</span>
              </div>
              <div className="flex items-center text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-full px-3 py-1">
                <Tv size={14} className="mr-1" />
                <span className="text-sm">5 Séries</span>
              </div>
              <div className="flex items-center text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-full px-3 py-1">
                <Music size={14} className="mr-1" />
                <span className="text-sm">8 Albums</span>
              </div>
              <div className="flex items-center text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-full px-3 py-1">
                <Headphones size={14} className="mr-1" />
                <span className="text-sm">3 Podcasts</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-4">
              <h3 className="w-full text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Genres préférés</h3>
              {user.preferences.favoriteGenres.map((genre, index) => (
                <span 
                  key={index} 
                  className="text-sm bg-primary bg-opacity-10 text-primary px-3 py-1 rounded-full"
                >
                  {genre}
                </span>
              ))}
            </div>
            
            <div className="flex flex-wrap gap-2 mt-4">
              <h3 className="w-full text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Tags émotionnels</h3>
              {user.preferences.emotionalTags.map((tag, index) => (
                <span 
                  key={index} 
                  className="text-sm bg-accent bg-opacity-10 text-accent px-3 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
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
            Avis ({userReviews.length})
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`mr-8 py-4 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'stats'
                ? 'border-primary text-primary dark:text-primary-300'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Statistiques
          </button>
          <button
            onClick={() => setActiveTab('lists')}
            className={`mr-8 py-4 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'lists'
                ? 'border-primary text-primary dark:text-primary-300'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Listes
          </button>
        </nav>
      </div>

      {/* Content based on active tab */}
      <div className="space-y-6">
        {activeTab === 'reviews' && (
          <>
            {userReviews.length > 0 ? (
              <div className="space-y-4">
                {userReviews.map(review => (
                  <div key={review.id} className="space-y-2">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        {reviewContents[review.contentId]?.title}
                      </span>
                      <span className="mx-2">•</span>
                      <span>{reviewContents[review.contentId]?.year}</span>
                    </div>
                    <ReviewCard review={review} user={user} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <User size={32} className="mx-auto mb-2 opacity-50" />
                <p>Aucun avis publié pour l'instant.</p>
              </div>
            )}
          </>
        )}

        {activeTab === 'stats' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card p-6">
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <Clock size={18} className="mr-2" />
                Temps de visionnage
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Ce mois-ci</p>
                  <p className="text-2xl font-bold">28h 15min</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Films</p>
                    <p className="text-lg font-medium">12h 40min</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Séries</p>
                    <p className="text-lg font-medium">15h 35min</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="card p-6">
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <TrendingUp size={18} className="mr-2" />
                Activité récente
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Cette semaine</p>
                  <p className="text-2xl font-bold">8 contenus</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Visionnés</p>
                    <p className="text-lg font-medium">5</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Avis publiés</p>
                    <p className="text-lg font-medium">3</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="card p-6">
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <Heart size={18} className="mr-2" />
                Préférences
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Genres les plus consultés</p>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center">
                      <span className="w-32">Science Fiction</span>
                      <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: '80%' }}></div>
                      </div>
                      <span className="ml-2 text-sm">80%</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-32">Thriller</span>
                      <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: '65%' }}></div>
                      </div>
                      <span className="ml-2 text-sm">65%</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-32">Drama</span>
                      <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: '45%' }}></div>
                      </div>
                      <span className="ml-2 text-sm">45%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="card p-6">
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <BarChart2 size={18} className="mr-2" />
                Humeur dominante
              </h3>
              <div className="space-y-4">
                <div className="text-center py-4">
                  <div className="text-5xl mb-4">🤯</div>
                  <p className="text-xl font-medium">Blown Away</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Vous aimez les contenus qui vous surprennent !
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'lists' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Mes listes</h2>
              <button className="btn btn-primary">Créer une liste</button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="card overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-500 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Film size={32} className="text-white" />
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-lg mb-1">À voir absolument</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Ma liste de films à ne pas manquer
                  </p>
                  <div className="flex justify-between items-center text-sm">
                    <span>12 films</span>
                    <span>Mise à jour il y a 2 jours</span>
                  </div>
                </div>
              </div>
              
              <div className="card overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-32 bg-gradient-to-r from-pink-500 to-red-500 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Tv size={32} className="text-white" />
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-lg mb-1">Séries du moment</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Les séries qui m'ont marqué récemment
                  </p>
                  <div className="flex justify-between items-center text-sm">
                    <span>8 séries</span>
                    <span>Mise à jour il y a 5 jours</span>
                  </div>
                </div>
              </div>
              
              <div className="card overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-32 bg-gradient-to-r from-green-500 to-teal-500 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Headphones size={32} className="text-white" />
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-lg mb-1">Podcasts pour s'endormir</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Parfaits pour une soirée calme
                  </p>
                  <div className="flex justify-between items-center text-sm">
                    <span>5 podcasts</span>
                    <span>Mise à jour il y a 2 semaines</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;