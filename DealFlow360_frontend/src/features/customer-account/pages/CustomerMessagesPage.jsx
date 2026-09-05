import React from 'react';
import { useParams } from 'react-router-dom';
import { MessageCenter } from '../../conversations/components/MessageCenter';

export const CustomerMessagesPage = () => {
  const { conversationId } = useParams();

  return (
    <div className="space-y-6 pb-16 text-left">
      <div>
        <h1 className="text-xl font-black text-slate-900">Message Center & Communication</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          Structured B2B communication with your assigned sales representative, linked directly to quotations, orders, invoices, and shipments.
        </p>
      </div>

      <MessageCenter userType="CUSTOMER" defaultConversationId={conversationId} />
    </div>
  );
};

export default CustomerMessagesPage;
