import React from 'react';

interface RightsButtonProps {
  isActive: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  count: number;
}

export const RightsButton: React.FC<RightsButtonProps> = ({
  isActive,
  onClick,
  icon,
  label,
  count,
}) => (
  <button
    onClick={onClick}
    className={`h-10 px-4 rounded-lg flex items-center gap-2 transition-colors ${
      isActive
        ? 'text-white hover:bg-opacity-90'
        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
    }`}
    style={isActive ? { backgroundColor: '#055E4C' } : undefined}
  >
    {icon}
    <span className="text-sm">{label}</span>
    <span className={`text-sm px-2 py-0.5 rounded-full ${
      isActive ? 'bg-opacity-40 bg-white' : 'bg-gray-200'
    }`}>
      {count}
    </span>
  </button>
);