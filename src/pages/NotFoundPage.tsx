import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <h1 className="text-6xl md:text-8xl font-bold text-primary mb-4">404</h1>
      <h2 className="text-2xl md:text-3xl font-medium mb-6">Page introuvable</h2>
      <p className="text-gray-600 dark:text-gray-400 max-w-md mb-8">
        La page que vous cherchez n'existe pas ou a été déplacée.
      </p>
      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
        <Link to="/" className="btn btn-primary flex items-center justify-center">
          <Home size={16} className="mr-2" />
          Retour à l'accueil
        </Link>
        <button 
          onClick={() => window.history.back()} 
          className="btn bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center"
        >
          <ArrowLeft size={16} className="mr-2" />
          Page précédente
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;