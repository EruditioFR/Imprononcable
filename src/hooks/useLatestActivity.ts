import { useState, useEffect } from 'react';
import { blogService } from '../services/airtable/services/blogService';
import { processCreatifService } from '../services/airtable/services/processCreatifService';
import type { ActivityItem } from '../types/activity';

const ITEMS_PER_PAGE = 10;

export function useLatestActivity(page: number = 1) {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchActivity() {
      try {
        setLoading(true);

        // Fetch both blog posts and resources
        const [articles, resources] = await Promise.all([
          blogService.getArticles(false), // Get all articles including drafts
          processCreatifService.getProcesses()
        ]);

        // Convert blog posts to activity items
        const articleActivities: ActivityItem[] = articles.map(article => ({
          id: `article-${article.id}`,
          type: 'article',
          title: article.title,
          action: 'update', // We'll assume update as we don't track creation date separately
          timestamp: article.publishedAt,
          author: article.author,
          authorId: article.authorId,
          contentId: article.id,
          status: article.status,
          url: article.status === 'published' ? `/ensemble/${article.id}` : undefined
        }));

        // Convert resources to activity items
        const resourceActivities: ActivityItem[] = resources.map(resource => ({
          id: `resource-${resource.id}`,
          type: 'resource',
          title: resource.title,
          action: 'update',
          timestamp: resource.publishedAt,
          author: resource.author,
          authorId: resource.authorId || '',
          contentId: resource.id,
          status: 'published', // Resources are always published
          url: `/ressources/${resource.id}`
        }));

        // Combine and sort all activities by timestamp
        const allActivities = [...articleActivities, ...resourceActivities]
          .sort((a, b) => {
            const dateA = new Date(a.timestamp).getTime();
            const dateB = new Date(b.timestamp).getTime();
            return dateB - dateA; // Sort in descending order (newer first)
          })
          .filter(activity => !isNaN(new Date(activity.timestamp).getTime())); // Filter out invalid dates

        setTotalItems(allActivities.length);

        // Get paginated results
        const start = (page - 1) * ITEMS_PER_PAGE;
        const paginatedActivities = allActivities.slice(start, start + ITEMS_PER_PAGE);
        
        setActivities(paginatedActivities);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch activity:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch activity'));
      } finally {
        setLoading(false);
      }
    }

    fetchActivity();
  }, [page]);

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  return { 
    activities, 
    loading, 
    error,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems,
      itemsPerPage: ITEMS_PER_PAGE
    }
  };
}