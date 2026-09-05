import React from 'react';
import { useParams } from 'react-router-dom';
import { MessageCenter } from '../../conversations/components/MessageCenter';

export const SalespersonMessagesPage = () => {
  const { conversationId } = useParams();

  return (
    <div className="space-y-6 pb-16 text-left">
      <div>
        <h1 className="text-xl font-black text-slate-900">Commercial Client Communications</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          Structured messaging inbox for authorized customer accounts, active quotations, sales orders, billing statements, and shipment dispatches.
        </p>
      </div>

      <MessageCenter userType="SALESPERSON" defaultConversationId={conversationId} />
    </div>
  );
};

export default SalespersonMessagesPage;
