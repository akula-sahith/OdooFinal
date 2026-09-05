import { useState, useEffect, useCallback } from 'react';
import { communicationService } from '../services/communicationService';

export const useConversations = (initialParams = {}) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialParams);

  const fetchConversations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await communicationService.getConversations(filters);
      setConversations(data);
    } catch (err) {
      console.error('Failed loading conversations list:', err);
      setError(err.message || 'Unable to load conversation directory.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  return { conversations, loading, error, filters, setFilters, refetch: fetchConversations };
};
