import { useState, useEffect } from 'react';
import { userService } from '../services/airtable/services/userService';
import { useAuth } from '../contexts/AuthContext';
import type { Client } from '../types/client';

export function useClients() {
  const { user } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchClients() {
      try {
        setLoading(true);
        const allClients = await userService.getClientNames();
        
        if (!mounted) return;

        // Filter clients based on user's assigned clients
        let filteredClients = allClients;
        if (user && !user.role?.includes('Administrateur')) {
          const userClients = Array.isArray(user.client) ? user.client : [user.client];
          filteredClients = allClients.filter(client => 
            userClients.includes(client.id)
          );
        }

        setClients(filteredClients);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch clients:', err);
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Failed to fetch clients'));
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchClients();

    return () => {
      mounted = false;
    };
  }, [user]);

  return { clients, loading, error };
}