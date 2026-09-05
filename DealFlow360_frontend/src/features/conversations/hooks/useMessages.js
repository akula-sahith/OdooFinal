import { useState, useEffect, useCallback } from 'react';
import { communicationService } from '../services/communicationService';

export const useMessages = (conversationId, userType = 'CUSTOMER') => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  const fetchMessages = useCallback(async () => {
    if (!conversationId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await communicationService.getMessages(conversationId);
      setMessages(data);
      // Mark read when user opens messages
      await communicationService.markMessagesRead(conversationId, userType);
    } catch (err) {
      console.error('Failed loading messages:', err);
      setError(err.message || 'Unable to retrieve messages.');
    } finally {
      setLoading(false);
    }
  }, [conversationId, userType]);

  const sendMessage = async (body, senderName = '') => {
    if (!conversationId) return;
    setSending(true);
    setError(null);
    try {
      const newMsg = await communicationService.sendMessage(conversationId, {
        body,
        senderType: userType,
        senderName,
      });
      setMessages((prev) => [...prev, newMsg]);
      return newMsg;
    } catch (err) {
      console.error('Failed sending message:', err);
      setError(err.message || 'Failed to send message.');
      throw err;
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  return { messages, loading, sending, error, sendMessage, refetch: fetchMessages };
};
