import { useState, useEffect, useCallback } from 'react';
import { conversationService } from '../services/conversationService';

/**
 * Custom Hook for managing Customer ↔ Salesperson Conversation history and message submission.
 */
export const useConversation = (requestId, currentUser = null, userType = 'CUSTOMER') => {
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  const fetchConversation = useCallback(async () => {
    if (!requestId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await conversationService.getConversation(requestId);
      setConversation(data);
      setMessages(data.messages || []);
      // Automatically mark unread messages from the other party as read
      await conversationService.markConversationAsRead(requestId, userType);
    } catch (err) {
      console.error('[useConversation] Failed to fetch conversation:', err);
      setError(err.message || 'Failed to load conversation history.');
    } finally {
      setLoading(false);
    }
  }, [requestId, userType]);

  useEffect(() => {
    fetchConversation();
  }, [fetchConversation]);

  const sendMessage = async (content) => {
    if (!conversation) return { success: false, error: 'No active conversation session.' };
    setSending(true);
    try {
      const senderInfo = {
        senderType: userType,
        senderName:
          currentUser?.fullName ||
          currentUser?.name ||
          currentUser?.email ||
          (userType === 'SALESPERSON' ? 'Sales Engineer' : 'Customer Representative'),
      };

      const newMsg = await conversationService.sendMessage(conversation.id, content, senderInfo);
      setMessages((prev) => [...prev, newMsg]);
      setSending(false);
      return { success: true, data: newMsg };
    } catch (err) {
      setSending(false);
      return { success: false, error: err.message || 'Failed to send message.' };
    }
  };

  return {
    conversation,
    messages,
    loading,
    sending,
    error,
    refetch: fetchConversation,
    sendMessage,
  };
};

export default useConversation;
