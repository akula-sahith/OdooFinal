import { useState, useEffect, useCallback } from 'react';
import { quotationCommunicationService } from '../services/quotationCommunicationService';

export const useQuotationNegotiation = (quotationId, currentVersion = 1) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  const fetchThread = useCallback(async () => {
    if (!quotationId) return;
    setLoading(true);
    setError(null);
    try {
      const thread = await quotationCommunicationService.getNegotiationThread(quotationId);
      setMessages(thread || []);
    } catch (err) {
      console.error('[useQuotationNegotiation] Fetch thread error:', err);
      setError(err.message || 'Failed to load negotiation conversation history.');
    } finally {
      setLoading(false);
    }
  }, [quotationId]);

  useEffect(() => {
    fetchThread();
  }, [fetchThread]);

  const sendMessage = async (messageText) => {
    if (!quotationId || sending) return;
    setSending(true);
    setError(null);
    try {
      const newMsg = await quotationCommunicationService.sendNegotiationMessage(
        quotationId,
        messageText,
        {
          senderType: 'CUSTOMER',
          quotationVersion: currentVersion,
        }
      );
      setMessages((prev) => [...prev, newMsg]);
      return newMsg;
    } catch (err) {
      setError(err.message || 'Failed to send message.');
      throw err;
    } finally {
      setSending(false);
    }
  };

  return {
    messages,
    loading,
    sending,
    error,
    sendMessage,
    refetch: fetchThread,
  };
};
