import { useState, useEffect } from 'react';
import { processCreatifService } from '../services/airtable/services/processCreatifService';
import type { ProcessCreatif } from '../types/processCreatif';

export function useProcessCreatif() {
  const [processes, setProcesses] = useState<ProcessCreatif[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProcesses = async () => {
    try {
      setLoading(true);
      const data = await processCreatifService.getProcesses();
      setProcesses(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Une erreur est survenue'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProcesses();
  }, []);

  const deleteProcess = async (id: string) => {
    try {
      await processCreatifService.deleteProcess(id);
      await fetchProcesses(); // Refresh the list
    } catch (err) {
      throw err instanceof Error 
        ? err 
        : new Error('Impossible de supprimer le process créatif');
    }
  };

  return { processes, loading, error, deleteProcess };
}