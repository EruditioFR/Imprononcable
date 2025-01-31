import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { useUsers } from '../hooks/useUsers';
import { UsersFilter } from '../components/Users/UsersList/UsersFilter';
import { UsersTable } from '../components/Users/UsersList/UsersTable';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';

export function UsersPage() {
  const navigate = useNavigate();
  const { users, loading, error, deleteUser } = useUsers();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('');

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = searchQuery.toLowerCase().split(' ').every(term =>
        `${user.nom} ${user.prenom} ${user.email} ${user.client}`.toLowerCase().includes(term)
      );
      
      const matchesRole = !selectedRole || user.role === selectedRole;
      
      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, selectedRole]);

  const handleEdit = (userId: string) => {
    navigate(`/users/${userId}`);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage error={error} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Gestion des utilisateurs
              </h1>
              <p className="mt-2 text-gray-600">
                Gérez les utilisateurs de la plateforme et leurs droits d'accès
              </p>
            </div>
            <Link
              to="/users/create"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
            >
              <UserPlus className="h-5 w-5 mr-2" />
              Créer un utilisateur
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <UsersFilter
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedRole={selectedRole}
              onRoleChange={setSelectedRole}
            />
            
            <UsersTable
              users={filteredUsers}
              onEdit={handleEdit}
              onDelete={deleteUser}
            />
          </div>
        </div>
      </div>
    </div>
  );
}