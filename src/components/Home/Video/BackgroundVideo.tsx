import React from 'react';
import { useVideoPlayer } from '../../../hooks/useVideoPlayer';

interface BackgroundVideoProps {
  src: string;
}

export function BackgroundVideo({ src }: BackgroundVideoProps) {
  const { videoRef } = useVideoPlayer();

  return (
    <div className="absolute inset-0 w-full h-full">
      <div className="absolute inset-0 bg-black/50 z-10" />
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source
          src={src}
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}