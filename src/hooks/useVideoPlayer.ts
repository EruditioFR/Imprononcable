import { useEffect, useRef } from 'react';
import { useVideoPlayback } from './useVideoPlayback';

export function useVideoPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { initializePlayback } = useVideoPlayback();

  useEffect(() => {
    if (videoRef.current) {
      initializePlayback(videoRef.current);
    }
  }, [initializePlayback]);

  return { videoRef };
}