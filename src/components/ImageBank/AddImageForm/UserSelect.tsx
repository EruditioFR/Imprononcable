import React from 'react';
import { useUsers } from '../../../hooks/useUsers';
import { MultiSelect } from '../../ui/MultiSelect';

interface UserSelectProps {
  value: string[];
  onChange: (userIds: string[]) => void;
  disabled?: boolean;
}

export function UserSelect({ value, onChange, disabled }: UserSelectProps) {
  const { users } = useUsers();

  return (
    <MultiSelect
      options={users.map(user => ({
        label: `${user.prenom} ${user.nom}`,
        value: user.id
      }))}
      value={value}
      onChange={onChange}
      placeholder="Sélectionner des utilisateurs"
      disabled={disabled}
    />
  );
}