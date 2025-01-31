import { useState, useEffect } from 'react';
import type { Image } from '../types/gallery';
import { AirtableService } from '../services/airtable/airtableService';
import { useAuth } from '../contexts/AuthContext';
import { useRoleCheck } from './useRoleCheck';

const AIRTABLE_API_KEY = 'patQemOBq0tOK20kf.a3492ccbd7a980be8200e06e9ca79630d19b0d6ed1d4d52545b304cbeeee15aa';
const AIRTABLE_BASE_ID = 'appuX6tVBjsu4nJhm';
const AIRTABLE_TABLE_NAME = 'tbl1p8FHvgJmFIQ9j';

const airtableService = new AirtableService(
  AIRTABLE_API_KEY,
  AIRTABLE_BASE_ID,
  AIRTABLE_TABLE_NAME
);

export function useAirtableImages() {
  const { user } = useAuth();
  const { isAdmin } = useRoleCheck();
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadImages() {
      if (!user) {
        setError(new Error('Vous devez être connecté pour accéder aux images'));
        setLoading(false);
        return;
      }

      if (!user.authorizedImageIds?.length) {
        console.log('No authorized images for user:', {
          userId: user.id,
          email: user.email
        });
        setImages([]);
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching images for user:', {
          userId: user.id,
          email: user.email,
          authorizedCount: user.authorizedImageIds.length,
          isAdmin: isAdmin(),
          userClients: user.client
        });

        const allImages = await airtableService.getImages(user.authorizedImageIds);
        
        if (!mounted) return;

        // Filter images based on user's client(s)
        const filteredImages = isAdmin() 
          ? allImages 
          : allImages.filter(img => {
              const userClients = Array.isArray(user.client) 
                ? user.client 
                : [user.client];
              
              const matchesClient = userClients.includes(img.client);
              
              if (!matchesClient) {
                console.log('Filtering out image due to client mismatch:', {
                  imageId: img.id,
                  imageClient: img.client,
                  userClients
                });
              }
              return matchesClient;
            });

        console.log('Images filtered successfully:', {
          total: allImages.length,
          filtered: filteredImages.length,
          userClient: user.client,
          isAdmin: isAdmin()
        });

        setImages(filteredImages);
        setError(null);
      } catch (err) {
        console.error('Failed to load images:', {
          error: err instanceof Error ? err.message : 'Unknown error',
          userId: user.id,
          email: user.email
        });
        
        if (!mounted) return;
        
        setError(new Error(
          err instanceof Error 
            ? err.message 
            : 'Une erreur est survenue lors du chargement des images'
        ));
        setImages([]);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadImages();

    return () => {
      mounted = false;
    };
  }, [user, isAdmin]);

  return { images, loading, error };
}