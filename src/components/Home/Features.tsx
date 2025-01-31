import React from 'react';
import { Camera, Users, Share2 } from 'lucide-react';

export function Features() {
  const features = [
    {
      icon: Camera,
      title: "Banque d'images",
      description: "Accédez à toutes vos ressources visuelles et gérez les droits d'utilisation en un seul endroit."
    },
    {
      icon: Users,
      title: "Collaboration en temps réel",
      description: "Échangez directement avec l'équipe d'Imprononcable sur vos projets créatifs."
    },
    {
      icon: Share2,
      title: "Partage simplifié",
      description: "Partagez facilement vos ressources avec votre équipe et vos partenaires."
    }
  ];

  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Une suite complète d'outils de collaboration
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Tout ce dont vous avez besoin pour une collaboration efficace avec notre agence
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div key={index} className="pt-6">
                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 rounded-md shadow-lg" style={{ backgroundColor: '#055E4C' }}>
                        <feature.icon className="h-6 w-6 text-white" />
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                      {feature.title}
                    </h3>
                    <p className="mt-5 text-base text-gray-500">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}