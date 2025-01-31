import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader } from 'lucide-react';
import { useClients } from '../../hooks/useClients';
import { userSchema, type UserFormData } from '../../types/user';
import { FormField } from './Form/FormField';
import { PasswordFields } from './Form/PasswordFields';

interface CreateUserFormProps {
  onSubmit: (data: UserFormData) => Promise<void>;
  isSubmitting: boolean;
  error: string | null;
}

export function CreateUserForm({ onSubmit, isSubmitting, error }: CreateUserFormProps) {
  const navigate = useNavigate();
  const { clients, loading: loadingClients } = useClients();
  const { register, handleSubmit, formState: { errors } } = useForm<UserFormData>({
    resolver: zodResolver(userSchema)
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <FormField
          label="Nom"
          error={errors.nom?.message}
        >
          <input
            type="text"
            {...register('nom')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            disabled={isSubmitting}
          />
        </FormField>

        <FormField
          label="Prénom"
          error={errors.prenom?.message}
        >
          <input
            type="text"
            {...register('prenom')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            disabled={isSubmitting}
          />
        </FormField>
      </div>

      <FormField
        label="Adresse email"
        error={errors.email?.message}
      >
        <input
          type="email"
          {...register('email')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          disabled={isSubmitting}
        />
      </FormField>

      <FormField
        label="Client"
        error={errors.client?.message}
      >
        <select
          {...register('client')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          disabled={isSubmitting || loadingClients}
        >
          <option value="">Sélectionner un client</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name}
            </option>
          ))}
        </select>
      </FormField>

      <FormField
        label="Rôle"
        error={errors.role?.message}
      >
        <select
          {...register('role')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          disabled={isSubmitting}
        >
          <option value="">Sélectionner un rôle</option>
          <option value="Utilisateur">Utilisateur</option>
          <option value="Administrateur">Administrateur</option>
        </select>
      </FormField>

      <PasswordFields
        register={register}
        errors={errors}
        disabled={isSubmitting}
      />

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => navigate('/users')}
          disabled={isSubmitting}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader className="animate-spin" size={20} />
              <span>Création en cours...</span>
            </>
          ) : (
            <span>Créer l'utilisateur</span>
          )}
        </button>
      </div>
    </form>
  );
}