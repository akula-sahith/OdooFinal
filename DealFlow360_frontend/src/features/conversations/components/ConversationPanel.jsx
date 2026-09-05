import React from 'react';
import { MessageSquare, ShieldCheck } from 'lucide-react';
import { Card } from '../../../components/ui/Card/Card';
import { MessageList } from './MessageList';
import { MessageComposer } from './MessageComposer';
import { useConversation } from '../hooks/useConversation';

/**
 * ConversationPanel Component
 * Embeddable communication interface for Customer ↔ Salesperson requirement clarification.
 */
export const ConversationPanel = ({
  requestId,
  requestTitle = 'Requirement Request',
  assignedSalespersonName = 'Unassigned',
  customerUser = null,
  disabled = false,
}) => {
  const { messages, loading, sending, error, sendMessage } = useConversation(requestId, customerUser);

  const handleSend = async (text) => {
    await sendMessage(text);
  };

  return (
    <Card variant="default" padding="lg" className="text-left space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#714B67]" />
            Request Conversation
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Requirement discussions for <span className="font-semibold text-slate-800">{requestTitle}</span>.
          </p>
        </div>

        <div className="px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-[#714B67] text-xs font-semibold flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Assigned: {assignedSalespersonName}</span>
        </div>
      </div>

      {error ? (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-medium">
          {error}
        </div>
      ) : null}

      <MessageList messages={messages} loading={loading} />

      <MessageComposer
        onSendMessage={handleSend}
        isSending={sending}
        disabled={disabled || loading}
      />
    </Card>
  );
};

export default ConversationPanel;
