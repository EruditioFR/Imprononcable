import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserCog, UserPlus } from 'lucide-react';
import { useUser } from '../hooks/useUser';
import { useEditUser } from '../hooks/useEditUser';
import { EditUserForm } from '../components/Users/EditUserForm';
import { CreateUserForm } from '../components/Users/CreateUserForm';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import type { UserFormData } from '../types/user';
import { useCreateUser } from '../hooks/useCreateUser';

export function EditUserPage() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { user, loading, error: fetchError } = useUser(userId);
  const { editUser, isSubmitting: isEditing, error: editError } = useEditUser();
  const { createUser, isSubmitting: isCreating, error: createError } = useCreateUser();

  if (loading) {
    return <LoadingSpinner />;
  }

  // If no userId or user not found, show creation form
  if (!userId || (!loading && !user)) {
    const handleCreate = async (data: UserFormData) => {
      try {
        await createUser(data);
        navigate('/users');
      } catch (err) {
        // Error handled by hook
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
              Créez un nouvel utilisateur en remplissant le formulaire ci-dessous
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <CreateUserForm
              onSubmit={handleCreate}
              isSubmitting={isCreating}
              error={createError}
            />
          </div>
        </div>
      </div>
    );
  }

  const handleEdit = async (data: UserFormData) => {
    try {
      await editUser(userId, data);
      navigate('/users');
    } catch (err) {
      // Error handled by hook
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <UserCog className="h-8 w-8 text-primary-500" />
            <h1 className="text-3xl font-bold text-gray-900">
              Modifier l'utilisateur
            </h1>
          </div>
          <p className="mt-2 text-gray-600">
            Modifiez les informations de l'utilisateur ci-dessous
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <EditUserForm
            user={user}
            onSubmit={handleEdit}
            isSubmitting={isEditing}
            error={editError}
          />
        </div>
      </div>
    </div>
  );
}