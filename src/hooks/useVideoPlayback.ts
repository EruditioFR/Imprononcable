import { useCallback } from 'react';
import { logVideoError } from '../utils/logging';

export function useVideoPlayback() {
  const initializePlayback = useCallback(async (videoElement: HTMLVideoElement) => {
    try {
      videoElement.muted = true;
      videoElement.playbackRate = 1.0;
      
      // Load metadata first
      await new Promise((resolve) => {
        videoElement.addEventListener('loadedmetadata', resolve, { once: true });
      });

      // Attempt playback
      await videoElement.play();
    } catch (error) {
      logVideoError('Video playback failed', error);
    }
  }, []);

  return { initializePlayback };
}