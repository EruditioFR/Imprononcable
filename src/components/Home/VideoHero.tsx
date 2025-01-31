import React from 'react';
import { BackgroundVideo } from './Video/BackgroundVideo';
import { HeroContent } from './Video/HeroContent';

const VIDEO_URL = 'https://imprononcable.com/storage/2024/01/SHOW-REEL-IMPRONONCABLE.mp4';

export function VideoHero() {
  return (
    <div className="relative h-screen flex items-center justify-center overflow-hidden">
      <BackgroundVideo src={VIDEO_URL} />
      <HeroContent />
    </div>
  );
}