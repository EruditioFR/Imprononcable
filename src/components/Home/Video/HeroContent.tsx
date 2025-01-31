import React from 'react';
import { Link } from 'react-router-dom';
import { Camera } from 'lucide-react';

export function HeroContent() {
  return (
    <div className="relative z-20 text-center px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
        <span className="block">Simplifiez votre</span>
        <span className="block text-blue-400">collaboration créative</span>
      </h1>
      <p className="mt-3 max-w-md mx-auto text-base text-gray-200 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
        CollabSpace est votre plateforme centralisée pour gérer et collaborer sur vos contenus photos et vidéos avec l'agence Imprononcable.
      </p>
      <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
        <Link
          to="/banque-images"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
        >
          <Camera className="mr-2 h-5 w-5" />
          Accéder à la banque d'images
        </Link>
      </div>
    </div>
  );
}