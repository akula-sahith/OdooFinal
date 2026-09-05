import { useState, useEffect, useCallback } from 'react';
import { communicationService } from '../services/communicationService';

export const useConversation = (conversationId, contextInfo = null) => {
  const [conversation, setConversation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchConversation = useCallback(async () => {
    if (!conversationId && (!contextInfo || !contextInfo.contextType || !contextInfo.contextId)) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      let data;
      if (conversationId) {
        data = await communicationService.getConversationById(conversationId);
      } else if (contextInfo) {
        data = await communicationService.getOrCreateConversation(
          contextInfo.contextType,
          contextInfo.contextId,
          contextInfo.details
        );
      }
      setConversation(data);
    } catch (err) {
      console.error('Failed loading conversation:', err);
      setError(err.message || 'Conversation thread not found or access denied.');
    } finally {
      setLoading(false);
    }
  }, [conversationId, contextInfo]);

  useEffect(() => {
    fetchConversation();
  }, [fetchConversation]);

  return { conversation, loading, error, refetch: fetchConversation };
};
