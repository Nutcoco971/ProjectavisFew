// src/pages/ContentDetailPage.tsx

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Heart, Share, Bookmark, Play, ChevronRight, MessageCircle } from 'lucide-react';

// Données mockées pour l'affichage initial et les infos utilisateur
// CHEMIN À VÉRIFIER : Si mockData.ts est dans src/data/mockData.ts
import { getContentById, getReviewsByContentId, getUserById } from '../data/mockData';

// Mes types personnalisés
// CHEMIN À VÉRIFIER : Si index.ts (ou types.ts) est dans src/types/
import { Content, Review, ContentStats, User } from '../types';

// Mon formulaire d'avis express
// CHEMIN À VÉRIFIER : Si ExpressReviewForm.tsx est dans src/components/reviews/
import ExpressReviewForm from '../components/reviews/ExpressReviewForm';
// Ma carte d'affichage d'avis
// CHEMIN À VÉRIFIER : Si ReviewCard.tsx est dans src/components/reviews/
import ReviewCard from '../components/reviews/ReviewCard';

// Mon contexte d'authentification
// CHEMIN À VÉRIFIER : Si AuthContext.tsx est dans src/context/
import { useAuth } from '../context/AuthContext';
// Mon client Supabase
// CHEMIN À VÉRIFIER : Si supabase.ts est dans src/lib/
import { supabase } from '../lib/supabase';

// Interface pour typer les données que je reçois de mon ExpressReviewForm
interface ExpressReviewFormData {
  rating: number;
  emoji: string;
  keyword: string;
  hasSpoilers: boolean;
  isEphemeral: boolean;
}

const ContentDetailPage: React.FC = () => {
  const { type, id: contentIdFromParams } = useParams<{ type: string; id: string }>();
  const { user: authUser } = useAuth();

  const [content, setContent] = useState<Content | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ContentStats | null>(null); // TODO: Remplacer par de vraies stats
  const [activeTab, setActiveTab] = useState<'reviews' | 'info' | 'similar'>('reviews');
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const fetchReviewsForContent = useCallback(async (contentId: string) => {
    // Pour l'instant, j'utilise les données mockées pour l'affichage initial.
    // TODO: Passer à un chargement systématique depuis Supabase pour les avis.
    const reviewsData = getReviewsByContentId(contentId);
    setReviews(reviewsData);

    /* --- DÉBUT SECTION COMMENTÉE POUR EXEMPLE SUPABASE ---
    // Ce bloc est un exemple pour plus tard, pour charger les avis depuis Supabase.
    // Il n'est pas actif pour le moment.

    console.log(`Chargement des avis depuis Supabase pour content_id: ${contentId}`);
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        user_profile:users ( username, avatar_url )
      `)
      .eq('content_id', contentId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Erreur Supabase - Impossible de charger les avis:", error);
      setReviews([]);
    } else {
      const formattedReviews = data.map(r => ({
        ...r,
        // Il faudra bien mapper les données de user_profile vers mon type User attendu par ReviewCard
        user: r.user_profile ? {
          id: r.user_id, // Assumant que r.user_id existe bien sûr
          username: (r.user_profile as any).username,
          profileImageUrl: (r.user_profile as any).avatar_url,
          joinedAt: new Date(), // Placeholder
          preferences: { favoriteGenres: [], emotionalTags: [] } // Placeholder
        } : undefined,
      })) as Review[]; // TODO: Typer plus précisément ici au lieu de 'as Review[]' si la structure de données Supabase diffère
      setReviews(formattedReviews);
      console.log("Avis chargés depuis Supabase:", formattedReviews);
    }
    --- FIN SECTION COMMENTÉE POUR EXEMPLE SUPABASE --- */
  }, []); // useCallback avec tableau de dépendances vide car la fonction elle-même ne dépend pas de props ou state pour sa définition.

  useEffect(() => {
    if (contentIdFromParams) {
      console.log(`ID de contenu depuis params: ${contentIdFromParams}, Type: ${type}`); // Ajout du type pour info
      const contentData = getContentById(contentIdFromParams);
      if (contentData) {
        setContent(contentData);
        fetchReviewsForContent(contentIdFromParams);

        // TODO: Remplacer ces stats mockées par des vraies stats calculées dynamiquement
        setStats({
          totalReviews: getReviewsByContentId(contentIdFromParams).length, // Recalculer ici depuis les mocks pour l'instant
          averageRating: contentData.rating || 0,
          ratingDistribution: { '1': 2, '2': 5, '3': 10, '4': 20, '5': 15 },
          topKeywords: ['Captivant', 'Impressionnant', 'Intense'],
          topEmojis: ['🤯', '😍', '👍']
        });
      } else {
        console.warn(`Contenu avec ID ${contentIdFromParams} non trouvé.`);
        setContent(null); // Réinitialiser si non trouvé
        setReviews([]); // Vider les avis aussi
      }
    }
  }, [contentIdFromParams, type, fetchReviewsForContent]); // Ajout de 'type' et fetchReviewsForContent dans les dépendances

  const handleSubmitReview = async (formData: ExpressReviewFormData) => {
    setSubmitError(null);
    setSubmitSuccess(null);

    if (!contentIdFromParams) {
      console.error("Tentative de soumission d'avis sans ID de contenu.");
      setSubmitError("L'ID du contenu est manquant. Impossible de soumettre l'avis.");
      return;
    }

    if (!authUser) {
      const wantsToContinue = window.confirm("Vous n'êtes pas connecté. Votre avis sera anonyme et ne pourra pas être modifié ou supprimé par la suite. Continuer ?");
      if (!wantsToContinue) {
        setIsWritingReview(false);
        return;
      }
    }

    const reviewToInsert = {
      content_id: contentIdFromParams,
      user_id: authUser ? authUser.id : null,
      rating: formData.rating,
      emoji: formData.emoji,
      keyword: formData.keyword,
      has_spoilers: formData.hasSpoilers,
      is_ephemeral: formData.isEphemeral,
      expires_at: formData.isEphemeral ? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() : null,
    };

    console.log("Tentative d'insertion de l'avis:", reviewToInsert);

    try {
      const { data: insertedReview, error: insertError } = await supabase
        .from('reviews')
        .insert([reviewToInsert])
        .select()
        .single();

      if (insertError) {
        console.error("Erreur Supabase lors de l'ajout de l'avis:", insertError);
        if (insertError.message.includes('reviews_content_id_user_id_key') || insertError.message.includes('check_review_uniqueness') || insertError.message.includes('User has already reviewed this content')) {
          setSubmitError("Il semble que vous ayez déjà donné un avis pour ce contenu.");
        } else if (insertError.message.includes('violates row-level security policy')) {
          setSubmitError("Action non autorisée. Il est possible que vous deviez être connecté ou que les permissions soient insuffisantes.");
        } else {
          setSubmitError(`Erreur lors de la publication de l'avis : ${insertError.message}`);
        }
      } else {
        console.log("Avis publié avec succès dans Supabase:", insertedReview);
        setSubmitSuccess("Votre avis a été publié avec succès !");
        setIsWritingReview(false);
        // TODO: Mettre à jour la liste des avis. Soit en rechargeant, soit en ajoutant localement.
        // Pour l'instant, je recharge depuis les mocks pour la démo.
        fetchReviewsForContent(contentIdFromParams);
        setTimeout(() => setSubmitSuccess(null), 4000);
      }
    } catch (err) {
      console.error("Erreur JavaScript inattendue lors de l'ajout de l'avis:", err);
      setSubmitError("Une erreur technique inattendue est survenue. Veuillez réessayer.");
    }
  };

  if (!content) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <p className="text-gray-500 dark:text-gray-400 animate-pulse">Chargement du contenu...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <section className="relative rounded-xl overflow-hidden h-64 md:h-80 lg:h-96">
        <img
          src={content.imageUrl || '/placeholder-image.jpg'}
          alt={content.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-white">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">{content.title}</h1>
          <div className="flex flex-wrap items-center gap-x-3 sm:gap-x-4 gap-y-1 sm:gap-y-2 mb-3 sm:mb-4 text-xs sm:text-sm">
            <span>{content.year}</span>
            {content.creator && <span>{content.creator}</span>}
            {content.rating !== undefined && (
              <div className="flex items-center">
                <Star size={14} className="text-yellow-400 mr-1" fill="currentColor" />
                <span>{content.rating.toFixed(1)}/5</span>
              </div>
            )}
            <div className="flex gap-1 sm:gap-1.5 flex-wrap">
              {content.genre.map((genre, index) => (
                <span key={index} className="text-xs bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full">
                  {genre}
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="btn btn-primary btn-sm sm:btn-md flex items-center">
              <Play size={16} className="mr-1" /> Vu
            </button>
            <button className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm">
              <Heart size={18} />
            </button>
            <button className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm">
              <Bookmark size={18} />
            </button>
            <button className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm">
              <Share size={18} />
            </button>
          </div>
        </div>
      </section>

      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex -mb-px overflow-x-auto">
          {(['reviews', 'info', 'similar'] as const).map((tabName) => (
            <button
              key={tabName}
              onClick={() => setActiveTab(tabName)}
              className={`mr-5 sm:mr-8 py-3 sm:py-4 font-medium text-sm border-b-2 whitespace-nowrap transition-colors focus:outline-none ${
                activeTab === tabName
                  ? 'border-primary text-primary dark:text-primary-300'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              {tabName === 'reviews' ? `Avis (${reviews.length})` : tabName.charAt(0).toUpperCase() + tabName.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      <div className="space-y-6 min-h-[200px]">
        {activeTab === 'reviews' && (
          <>
            {submitSuccess && (
              <div className="p-3 mb-4 text-sm text-green-700 bg-green-100 rounded-lg dark:bg-green-800/30 dark:text-green-300 border border-green-200 dark:border-green-700" role="alert">
                {submitSuccess}
              </div>
            )}
            {submitError && (
              <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-800/30 dark:text-red-300 border border-red-200 dark:border-red-700" role="alert">
                {submitError}
              </div>
            )}

            {!isWritingReview ? (
              <div className="flex justify-center my-6">
                <button
                  onClick={() => {
                    setIsWritingReview(true);
                    setSubmitError(null);
                    setSubmitSuccess(null);
                  }}
                  className="btn btn-primary flex items-center"
                >
                  <MessageCircle size={16} className="mr-2" />
                  Donner mon avis express
                </button>
              </div>
            ) : (
              <div className="card p-6 animate-slide-up mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Votre avis express</h3>
                  <button
                    onClick={() => setIsWritingReview(false)}
                    className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Annuler
                  </button>
                </div>
                <ExpressReviewForm
                  onSubmit={handleSubmitReview}
                />
              </div>
            )}

            <div className="space-y-4">
              {reviews.length > 0 ? (
                reviews.map(review => {
                  const reviewUser = review.userId ? getUserById(review.userId) : undefined;
                  return (
                    <ReviewCard
                      key={review.id}
                      review={review}
                      user={reviewUser}
                    />
                  );
                })
              ) : (
                <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                  <MessageCircle size={36} className="mx-auto mb-3 opacity-50" />
                  <p className="text-md">Aucun avis pour ce contenu pour l'instant.</p>
                  {!isWritingReview && <p className="text-sm mt-1">Soyez le premier à partager votre opinion !</p>}
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === 'info' && (
          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-200">Description</h3>
              <div className="text-gray-700 dark:text-gray-300 prose prose-sm dark:prose-invert max-w-none leading-relaxed">
                {content.description ? <p>{content.description}</p> : <p className="italic">Aucune description disponible pour ce contenu.</p>}
              </div>
            </div>
            {stats && (
              <div className="card p-6">
                <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-200">Statistiques (Exemple)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                      Distribution des notes (Exemple)
                    </h4>
                    <div className="space-y-1.5">
                      {[5, 4, 3, 2, 1].map((ratingValue) => {
                        const count = stats.ratingDistribution[String(ratingValue) as keyof typeof stats.ratingDistribution] || 0;
                        const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;
                        return (
                          <div key={ratingValue} className="flex items-center text-xs">
                            <div className="flex items-center w-8">
                              <span>{ratingValue}</span>
                              <Star size={12} className="ml-1 text-yellow-400 fill-current" />
                            </div>
                            <div className="flex-1 mx-2 h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary transition-all duration-500 ease-out"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-gray-500 dark:text-gray-400 w-8 text-right">
                              {count}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                        Mots-clés populaires (Exemple)
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {stats.topKeywords.map((keyword, index) => (
                          <span
                            key={index}
                            className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2.5 py-1 rounded-full"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                        Emojis populaires (Exemple)
                      </h4>
                      <div className="flex gap-2">
                        {stats.topEmojis.map((emoji, index) => (
                          <span
                            key={index}
                            className="text-2xl bg-gray-100 dark:bg-gray-700 p-1.5 rounded-full"
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
            <div className="text-center py-10 text-gray-500 dark:text-gray-400">
              <p>Les recommandations de contenus similaires seront bientôt disponibles ici.</p>
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-8">
        <Link
          to="/"
          className="text-primary hover:text-primary-dark dark:hover:text-primary-300 flex items-center text-sm font-medium"
        >
          <ChevronRight size={16} className="mr-1 rotate-180" />
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
};

export default ContentDetailPage;