import { useState, useEffect } from 'react';
import { userService } from '../services/airtable/services/userService';
import type { User } from '../types/user';

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getUsers();
      setUsers(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch users'));
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      await userService.deleteUser(userId);
      await fetchUsers();
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to delete user');
    }
  };

  return {
    users,
    loading,
    error,
    deleteUser,
    refreshUsers: fetchUsers
  };
}