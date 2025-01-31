import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Calendar, User, Building, Pencil } from 'lucide-react';
import { format, parse, isValid } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useRoleCheck } from '../../hooks/useRoleCheck';
import type { ProcessCreatif } from '../../types/processCreatif';

interface ProcessCreatifCardProps {
  process: ProcessCreatif;
}

export function ProcessCreatifCard({ process }: ProcessCreatifCardProps) {
  const { isAdmin } = useRoleCheck();

  // Parse the French date format and format it properly
  const formatDate = (dateStr: string) => {
    try {
      // First try parsing as French format (dd/MM/yyyy)
      const parsedDate = parse(dateStr, 'dd/MM/yyyy', new Date());
      
      if (isValid(parsedDate)) {
        return format(parsedDate, 'dd MMMM yyyy', { locale: fr });
      }

      // If that fails, try parsing as ISO format
      const date = new Date(dateStr);
      if (isValid(date)) {
        return format(date, 'dd MMMM yyyy', { locale: fr });
      }

      // If all parsing fails, return the original string
      return dateStr;
    } catch (error) {
      console.warn('Date parsing failed:', error);
      return dateStr;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
      {process.featuredImage && (
        <div className="relative aspect-video w-full overflow-hidden">
          <img
            src={process.featuredImage}
            alt={process.title}
            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {process.title}
          </h3>
          <div className="flex items-center gap-2">
            {isAdmin() && (
              <Link
                to={`/ressources/edit/${process.id}`}
                className="p-2 text-gray-400 hover:text-primary-500 transition-colors"
              >
                <Pencil size={18} />
              </Link>
            )}
            <Link
              to={`/ressources/${process.id}`}
              className="p-2 text-gray-400 hover:text-primary-500 transition-colors"
            >
              <Eye size={18} />
            </Link>
          </div>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <Calendar size={16} className="mr-2" />
            {formatDate(process.publishedAt)}
          </div>

          <div className="flex items-center text-sm text-gray-500">
            <User size={16} className="mr-2" />
            {process.author}
          </div>

          <div className="flex items-center text-sm text-gray-500">
            <Building size={16} className="mr-2" />
            {process.client}
          </div>
        </div>

        <div className="prose prose-sm line-clamp-3">
          <div dangerouslySetInnerHTML={{ 
            __html: process.content.substring(0, 150) + '...' 
          }} />
        </div>
      </div>
    </div>
  );
}