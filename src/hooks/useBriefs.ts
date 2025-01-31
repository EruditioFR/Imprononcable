import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { CreaPhotoService } from '../services/airtable/services/creaPhotoService';
import { AirtableError } from '../services/airtable/errors';

const creaPhotoService = new CreaPhotoService();

export function useBriefs() {
  const { user } = useAuth();
  const [briefs, setBriefs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBriefs = async () => {
    if (!user) {
      setError(new Error('Vous devez être connecté pour accéder aux briefs'));
      setLoading(false);
      return;
    }

    try {
      const records = await creaPhotoService.getBriefs(user.id);
      setBriefs(records);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch briefs:', err);
      setError(
        err instanceof AirtableError 
          ? err 
          : new Error('Impossible de charger les briefs')
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBriefs();
  }, [user]);

  const deleteBrief = async (id: string) => {
    try {
      await creaPhotoService.deleteBrief(id);
      await fetchBriefs(); // Refresh the list
    } catch (err) {
      throw err instanceof Error 
        ? err 
        : new Error('Impossible de supprimer le brief');
    }
  };

  return { briefs, loading, error, deleteBrief };
}