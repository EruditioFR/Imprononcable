import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { CreaPhotoService } from '../services/airtable/services/creaPhotoService';
import { AirtableError } from '../services/airtable/errors';

const creaPhotoService = new CreaPhotoService();

export function useCreaPhoto() {
  const { user } = useAuth();
  const [contents, setContents] = useState<{ id: string; content: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchContent() {
      if (!user) {
        setError(new Error('Vous devez être connecté pour accéder à ce contenu'));
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching content for user:', { 
          userId: user.id,
          userEmail: user.email
        });

        const records = await creaPhotoService.getCreaPhotoRecords(user.id);
        
        if (!mounted) return;

        if (records.length === 0) {
          setError(new Error('Aucun contenu disponible pour votre compte'));
          setContents([]);
        } else {
          setContents(records);
          setError(null);
        }
      } catch (err) {
        console.error('Failed to fetch content:', err);
        
        if (!mounted) return;
        
        if (err instanceof AirtableError) {
          setError(err);
        } else {
          setError(new Error('Une erreur est survenue lors du chargement du contenu'));
        }
        
        setContents([]);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchContent();

    return () => {
      mounted = false;
    };
  }, [user]);

  return { contents, loading, error };
}