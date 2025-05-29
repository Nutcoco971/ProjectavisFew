import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SignInForm from '../components/auth/SignInForm';
import SignUpForm from '../components/auth/SignUpForm';

const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">
            {mode === 'signin' ? 'Connexion' : 'Inscription'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {mode === 'signin' 
              ? 'Connectez-vous pour accéder à votre compte'
              : 'Créez votre compte pour partager vos avis'}
          </p>
        </div>

        <div className="mt-8">
          {mode === 'signin' ? <SignInForm /> : <SignUpForm />}
        </div>

        <div className="text-center mt-4">
          {mode === 'signin' ? (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Pas encore de compte ?{' '}
              <button
                onClick={() => setMode('signup')}
                className="text-primary hover:text-primary-dark transition-colors"
              >
                S'inscrire
              </button>
            </p>
          ) : (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Déjà un compte ?{' '}
              <button
                onClick={() => setMode('signin')}
                className="text-primary hover:text-primary-dark transition-colors"
              >
                Se connecter
              </button>
            </p>
          )}
        </div>

        <div className="text-center mt-4">
          <Link
            to="/"
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;