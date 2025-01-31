import React from 'react';
import { Clock, Ban, Filter } from 'lucide-react';
import { RightsButton } from './RightsButton';

interface RightsFilterProps {
  activeRights: 'all' | 'active' | 'expired';
  onRightsChange: (rights: 'all' | 'active' | 'expired') => void;
  expiredCount: number;
  activeCount: number;
}

export const RightsFilter: React.FC<RightsFilterProps> = ({
  activeRights,
  onRightsChange,
  expiredCount,
  activeCount,
}) => {
  const totalCount = activeCount + expiredCount;

  return (
    <div>
      <h3 className="text-lg font-medium mb-3">Filtrer par droits</h3>
      <div className="flex gap-2">
        <RightsButton
          isActive={activeRights === 'all'}
          onClick={() => onRightsChange('all')}
          icon={<Filter size={20} />}
          label="Tous les droits"
          count={totalCount}
        />
        <RightsButton
          isActive={activeRights === 'active'}
          onClick={() => onRightsChange('active')}
          icon={<Clock size={20} />}
          label="Droits actifs"
          count={activeCount}
        />
        <RightsButton
          isActive={activeRights === 'expired'}
          onClick={() => onRightsChange('expired')}
          icon={<Ban size={20} />}
          label="Droits échus"
          count={expiredCount}
        />
      </div>
    </div>
  );
};