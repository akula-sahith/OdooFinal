import React from 'react';
import { MessageSquare, ShieldCheck, User } from 'lucide-react';
import { Card } from '../../../components/ui/Card/Card';
import { MessageList } from '../../conversations/components/MessageList';
import { MessageComposer } from '../../conversations/components/MessageComposer';
import { useConversation } from '../../conversations/hooks/useConversation';
import { usePermissions } from '../../../hooks/auth/usePermissions';

/**
 * SalespersonConversationPanel Component
 * Real-time requirement clarification communication panel for Sales Engineer ↔ Customer Client.
 * References the SAME conversationId / requestId as Customer Portal.
 */
export const SalespersonConversationPanel = ({
  requestId,
  requestTitle = 'Requirement Request',
  customerName = 'B2B Client',
  disabled = false,
}) => {
  const { user } = usePermissions();
  const { messages, loading, sending, error, sendMessage } = useConversation(
    requestId,
    user,
    'SALESPERSON'
  );

  const handleSend = async (text) => {
    await sendMessage(text);
  };

  return (
    <Card variant="default" padding="lg" className="text-left space-y-4">
      <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-3 gap-2">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#714B67]" />
            Customer Clarification & Messaging Channel
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Direct communication thread with <span className="font-semibold text-slate-800">{customerName}</span> for request <span className="font-mono text-[#714B67]">{requestId}</span>.
          </p>
        </div>

        <div className="px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-[#714B67] text-xs font-semibold flex items-center gap-1.5">
          <User className="w-3.5 h-3.5" />
          <span>Client: {customerName}</span>
        </div>
      </div>

      {error ? (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-medium">
          {error}
        </div>
      ) : null}

      <MessageList
        messages={messages}
        loading={loading}
        currentUserType="SALESPERSON"
      />

      <MessageComposer
        onSendMessage={handleSend}
        isSending={sending}
        disabled={disabled || loading}
        placeholder="Type clarification question or response to customer..."
      />
    </Card>
  );
};

export default SalespersonConversationPanel;
