import React from 'react';
import { UseFormRegister } from 'react-hook-form';
import { FormField } from './FormField';
import type { UserFormData } from '../../../types/user';

interface PasswordFieldsProps {
  register: UseFormRegister<UserFormData>;
  errors: Record<string, any>;
  disabled?: boolean;
}

export function PasswordFields({ register, errors, disabled }: PasswordFieldsProps) {
  return (
    <div className="grid grid-cols-2 gap-6">
      <FormField
        label="Mot de passe"
        error={errors.password?.message}
      >
        <input
          type="password"
          {...register('password')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          disabled={disabled}
        />
      </FormField>

      <FormField
        label="Confirmation du mot de passe"
        error={errors.confirmPassword?.message}
      >
        <input
          type="password"
          {...register('confirmPassword')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          disabled={disabled}
        />
      </FormField>
    </div>
  );
}