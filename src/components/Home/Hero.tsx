import React from 'react';
import { BackgroundImage } from './Hero/BackgroundImage';
import { HeroContent } from './Hero/HeroContent';

// Convertir l'URL Dropbox en URL directe en remplaçant dl=0 par raw=1
const HERO_IMAGE = 'https://www.dropbox.com/scl/fi/66fy0oruj44vns06yq45q/1J0A4869.png?rlkey=e86yncdmhwxan4o1jx57f8oji&raw=1';

export function Hero() {
  return (
    <div className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute inset-0 bg-black/50 z-10" />
        <img
          src={HERO_IMAGE}
          alt="CollabSpace - Collaboration créative avec Imprononcable"
          className="absolute inset-0 w-full h-full object-cover object-center"
          style={{ objectPosition: 'center 30%' }}
        />
      </div>
      <HeroContent />
    </div>
  );
}