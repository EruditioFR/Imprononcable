import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Calendar, User, Building } from 'lucide-react';
import { format, parse, isValid } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useProcessCreatifDetail } from '../hooks/useProcessCreatifDetail';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { ProcessCreatifContent } from '../components/ProcessCreatif/ProcessCreatifContent';

export function ProcessCreatifDetailPage() {
  const { id } = useParams();
  const { process, loading, error } = useProcessCreatifDetail(id!);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage error={error} />;
  }

  if (!process) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Process créatif non trouvé</p>
      </div>
    );
  }

  // Fonction pour formater la date en toute sécurité
  const formatDate = (dateStr: string) => {
    try {
      // Essayer d'abord le format français (dd/MM/yyyy)
      const parsedDate = parse(dateStr, 'dd/MM/yyyy', new Date());
      if (isValid(parsedDate)) {
        return format(parsedDate, 'dd MMMM yyyy', { locale: fr });
      }

      // Si ça ne marche pas, essayer comme date ISO
      const date = new Date(dateStr);
      if (isValid(date)) {
        return format(date, 'dd MMMM yyyy', { locale: fr });
      }

      // Si aucun format ne fonctionne, retourner la date telle quelle
      return dateStr;
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateStr;
    }
  };

  return (
    <article className="min-h-screen bg-gray-50">
      {/* Featured Image Section */}
      {process.featuredImage && (
        <div className="relative w-full h-[60vh] overflow-hidden">
          <div className="absolute inset-0 bg-black/30 z-10" />
          <img
            src={process.featuredImage}
            alt={process.title}
            className="w-full h-full object-cover"
          />
          
          {/* Breadcrumb on top of hero */}
          <div className="absolute top-8 left-0 right-0 z-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <nav>
                <ol className="flex items-center space-x-2 text-sm text-white/90">
                  <li>
                    <Link to="/process-creatif" className="hover:text-white">
                      Process Créatif
                    </Link>
                  </li>
                  <li>
                    <ChevronRight size={16} />
                  </li>
                  <li className="font-medium truncate max-w-[300px]">
                    {process.title}
                  </li>
                </ol>
              </nav>
            </div>
          </div>

          {/* Title and Meta on top of hero */}
          <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/80 to-transparent pt-32 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h1 className="text-4xl font-bold text-white mb-4">
                {process.title}
              </h1>
              <div className="flex flex-wrap gap-6 text-white/90">
                <div className="flex items-center">
                  <Calendar size={16} className="mr-2" />
                  {formatDate(process.publishedAt)}
                </div>
                {process.author && (
                  <div className="flex items-center">
                    <User size={16} className="mr-2" />
                    {process.author}
                  </div>
                )}
                {process.client && (
                  <div className="flex items-center">
                    <Building size={16} className="mr-2" />
                    {process.client}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Regular Header Section (when no featured image) */}
      {!process.featuredImage && (
        <div className="bg-white border-b border-gray-200">
          <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
            <div className="max-w-[1400px] mx-auto">
              <nav className="mb-6">
                <ol className="flex items-center space-x-2 text-sm text-gray-500">
                  <li>
                    <Link to="/process-creatif" className="hover:text-primary-600">
                      Process Créatif
                    </Link>
                  </li>
                  <li>
                    <ChevronRight size={16} />
                  </li>
                  <li className="text-gray-900 font-medium truncate max-w-[300px]">
                    {process.title}
                  </li>
                </ol>
              </nav>

              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {process.title}
                </h1>
                <div className="flex flex-wrap gap-6 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-2" />
                    {formatDate(process.publishedAt)}
                  </div>
                  {process.author && (
                    <div className="flex items-center">
                      <User size={16} className="mr-2" />
                      {process.author}
                    </div>
                  )}
                  {process.client && (
                    <div className="flex items-center">
                      <Building size={16} className="mr-2" />
                      {process.client}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content Section */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-[1400px] mx-auto">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-8 lg:p-12">
              <ProcessCreatifContent content={process.content} />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}