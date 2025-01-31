import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { CreateUserForm } from '../components/Users/CreateUserForm';
import { useCreateUser } from '../hooks/useCreateUser';
import type { UserFormData } from '../types/user';

export function CreateUserPage() {
  const navigate = useNavigate();
  const { createUser, isSubmitting, error } = useCreateUser();

  const handleSubmit = async (data: UserFormData) => {
    try {
      await createUser(data);
      navigate('/users'); // Redirect to users list after successful creation
    } catch (err) {
      // Error is handled by the hook
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <UserPlus className="h-8 w-8 text-primary-500" />
            <h1 className="text-3xl font-bold text-gray-900">
              Création d'un utilisateur
            </h1>
          </div>
          <p className="mt-2 text-gray-600">
            Créez un nouvel utilisateur en remplissant le formulaire ci-dessous. Tous les champs sont obligatoires.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <CreateUserForm
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            error={error}
          />
        </div>
      </div>
    </div>
  );
}