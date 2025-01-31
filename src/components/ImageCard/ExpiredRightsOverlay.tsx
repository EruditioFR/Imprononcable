import React, { useState } from 'react';
import { Ban, Clock } from 'lucide-react';
import { Image } from '../../types/gallery';
import { RightsRequestModal } from '../RightsRequest/RightsRequestModal';

interface ExpiredRightsOverlayProps {
  image: Image;
}

export const ExpiredRightsOverlay: React.FC<ExpiredRightsOverlayProps> = ({ image }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="absolute inset-0 bg-gray-900/80 flex flex-col items-center justify-center text-white z-10">
        <Ban size={32} className="mb-2" />
        <p className="text-lg font-semibold mb-4">Droits échus</p>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
        >
          <Clock size={20} />
          <span>Demander une extension</span>
        </button>
      </div>

      <RightsRequestModal
        image={image}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
}