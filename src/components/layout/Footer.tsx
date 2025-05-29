import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">MonSiteAvis</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Plateforme d'avis dédiée aux contenus audiovisuels. Simple, moderne et communautaire.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Liens utiles</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-300 transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/search" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-300 transition-colors">
                  Recherche
                </Link>
              </li>
              <li>
                <Link to="/profile/me" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-300 transition-colors">
                  Mon Profil
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Catégories</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/search?type=films" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-300 transition-colors">
                  Films
                </Link>
              </li>
              <li>
                <Link to="/search?type=series" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-300 transition-colors">
                  Séries
                </Link>
              </li>
              <li>
                <Link to="/search?type=music" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-300 transition-colors">
                  Musique
                </Link>
              </li>
              <li>
                <Link to="/search?type=podcasts" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-300 transition-colors">
                  Podcasts
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            © {currentYear} MonSiteAvis. Tous droits réservés.
          </p>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-4 md:mt-0 flex items-center">
            Créé avec <Heart size={14} className="mx-1 text-red-500" /> en France
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;