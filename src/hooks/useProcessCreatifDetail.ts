import { useState, useEffect } from 'react';
import { processCreatifService } from '../services/airtable/services/processCreatifService';
import type { ProcessCreatif } from '../types/processCreatif';

export function useProcessCreatifDetail(id: string) {
  const [process, setProcess] = useState<ProcessCreatif | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchProcess() {
      try {
        const data = await processCreatifService.getProcess(id);
        if (!mounted) return;
        setProcess(data);
        setError(null);
      } catch (err) {
        if (!mounted) return;
        setError(err instanceof Error ? err : new Error('Une erreur est survenue'));
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchProcess();

    return () => {
      mounted = false;
    };
  }, [id]);

  return { process, loading, error };
}