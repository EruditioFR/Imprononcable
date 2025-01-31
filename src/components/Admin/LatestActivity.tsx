import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Image, Newspaper, User, Clock } from 'lucide-react';
import { format, parseISO, isValid } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { ActivityItem } from '../../types/activity';
import { Pagination } from '../Pagination';

interface LatestActivityProps {
  activities: ActivityItem[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function LatestActivity({ 
  activities, 
  currentPage,
  totalPages,
  onPageChange 
}: LatestActivityProps) {
  const getIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'article':
        return <Newspaper className="h-5 w-5 text-blue-500" />;
      case 'resource':
        return <FileText className="h-5 w-5 text-green-500" />;
      case 'image':
        return <Image className="h-5 w-5 text-purple-500" />;
      case 'user':
        return <User className="h-5 w-5 text-orange-500" />;
    }
  };

  const getTypeLabel = (type: ActivityItem['type']) => {
    switch (type) {
      case 'article':
        return 'Article';
      case 'resource':
        return 'Ressource';
      case 'image':
        return 'Image';
      case 'user':
        return 'Utilisateur';
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      // First try parsing as ISO date
      const date = parseISO(dateStr);
      if (isValid(date)) {
        return format(date, 'dd MMMM yyyy à HH:mm', { locale: fr });
      }

      // If that fails, try parsing as French date (dd/MM/yyyy)
      const [day, month, year] = dateStr.split('/').map(Number);
      const frenchDate = new Date(year, month - 1, day);
      if (isValid(frenchDate)) {
        return format(frenchDate, 'dd MMMM yyyy à HH:mm', { locale: fr });
      }

      // If all parsing fails, return the original string
      return dateStr;
    } catch (error) {
      console.warn('Failed to format date:', { dateStr, error });
      return dateStr;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Dernières modifications
      </h2>
      
      <div className="space-y-6 mb-6">
        {activities.map((activity) => (
          <div 
            key={activity.id}
            className="flex items-start gap-4 pb-6 border-b border-gray-100 last:border-0 last:pb-0"
          >
            <div className="p-2 bg-gray-50 rounded-lg">
              {getIcon(activity.type)}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-gray-500">
                  {getTypeLabel(activity.type)}
                </span>
                <span className="text-gray-300">•</span>
                <span className="text-sm text-gray-500">
                  {activity.action === 'create' ? 'Création' : 'Modification'}
                </span>
                {activity.status && (
                  <>
                    <span className="text-gray-300">•</span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      activity.status === 'published'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {activity.status === 'published' ? 'Publié' : 'Brouillon'}
                    </span>
                  </>
                )}
              </div>
              
              {activity.url ? (
                <Link 
                  to={activity.url}
                  className="text-lg font-medium text-gray-900 hover:text-primary-600 truncate block"
                >
                  {activity.title}
                </Link>
              ) : (
                <p className="text-lg font-medium text-gray-900 truncate">
                  {activity.title}
                </p>
              )}
              
              <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                <Clock className="h-4 w-4" />
                <span>{formatDate(activity.timestamp)}</span>
                <span className="text-gray-300">•</span>
                <span>par {activity.author}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="border-t border-gray-100 pt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
}