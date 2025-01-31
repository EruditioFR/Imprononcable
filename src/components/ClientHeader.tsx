import React from 'react';
import type { ClientInfo } from '../types/gallery';
import { useAuth } from '../contexts/AuthContext';
import { CLIENT_CONFIG } from '../config/client';

interface ClientHeaderProps {
  clientInfo?: ClientInfo;
}

export const ClientHeader: React.FC<ClientHeaderProps> = ({ 
  clientInfo = CLIENT_CONFIG 
}) => {
  const { user } = useAuth();

  return (
    <div className="text-center mb-12">
      <div className="text-xl text-gray-600 max-w-3xl mx-auto">
        <p className="mb-4">
          Bonjour {user?.prenom || ''},
        </p>
        <div
          dangerouslySetInnerHTML={{ 
            __html: clientInfo.description.split('<br />').join('<br class="mb-4" />') 
          }}
        />
      </div>
    </div>
  );
};