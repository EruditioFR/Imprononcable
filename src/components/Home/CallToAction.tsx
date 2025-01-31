import React from 'react';
import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';

export function CallToAction() {
  return (
    <div style={{ backgroundColor: '#055E4C' }}>
      <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
          <span className="block">Prêt à commencer ?</span>
          <span className="block">Accédez à vos ressources dès maintenant</span>
        </h2>
        <p className="mt-4 text-lg leading-6" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
          Découvrez comment CollabSpace peut transformer votre façon de collaborer avec Imprononcable.
        </p>
        <Link
          to="/banque-images"
          className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md hover:bg-gray-50 sm:w-auto transition-colors duration-200"
          style={{ backgroundColor: 'white', color: '#055E4C' }}
        >
          <Clock className="mr-2 h-5 w-5" />
          Commencer maintenant
        </Link>
      </div>
    </div>
  );
}