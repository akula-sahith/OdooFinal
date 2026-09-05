import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExternalLink, ShieldCheck, Tag, ShoppingCart, Receipt, Truck, FileText, ArrowLeft } from 'lucide-react';
import { MessageBubble } from './MessageBubble';
import { MessageComposer } from './MessageComposer';

const CONTEXT_LINKS = {
  QUOTATION: (id, isCustomer) => (isCustomer ? `/customer/quotations/${id}` : `/company/quotations/${id}`),
  ORDER: (id, isCustomer) => (isCustomer ? `/customer/orders/${id}` : `/company/orders/${id}`),
  INVOICE: (id, isCustomer) => (isCustomer ? `/customer/invoices/${id}` : `/company/invoices/${id}`),
  SHIPMENT: (id, isCustomer) => (isCustomer ? `/customer/shipments/${id}` : `/company/fulfillment/shipments/${id}`),
  REQUEST: (id, isCustomer) => (isCustomer ? `/customer/requests/${id}` : `/company/sales/requests/${id}`),
};

export const ConversationView = ({
  conversation,
  messages = [],
  loading = false,
  sending = false,
  userType = 'CUSTOMER',
  onSendMessage,
  onBackToList,
}) => {
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!conversation) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-12 text-center bg-slate-50 rounded-2xl border border-slate-200">
        <FileText className="w-10 h-10 text-slate-300 mb-2" />
        <h3 className="text-sm font-bold text-slate-800">No Conversation Selected</h3>
        <p className="text-xs text-slate-500 max-w-xs mt-1 font-medium">
          Select a message thread from the left menu to view the contextual conversation.
        </p>
      </div>
    );
  }

  const { contextType = 'ORDER', contextId = '', contextTitle, customerName, salespersonName } = conversation;
  const isCustomer = userType === 'CUSTOMER';
  const recordLink = CONTEXT_LINKS[contextType] ? CONTEXT_LINKS[contextType](contextId, isCustomer) : null;

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-200/90 bg-slate-50 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {onBackToList && (
            <button
              type="button"
              onClick={onBackToList}
              className="md:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-200 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-slate-900 font-mono">
                {contextType} #{contextId}
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-[#F7F2F5] text-[#714B67] border border-[#714B67]/30 uppercase">
                {conversation.status || 'OPEN'}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Participant: {isCustomer ? salespersonName || 'Sales Engineer' : customerName}
            </p>
          </div>
        </div>

        {recordLink && (
          <button
            type="button"
            onClick={() => navigate(recordLink)}
            className="px-3 py-1.5 text-xs font-bold bg-white border border-slate-200 hover:border-[#714B67] text-slate-700 hover:text-[#714B67] rounded-xl transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer shrink-0"
          >
            <span>View Record</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Messages Stream */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 min-h-[320px] max-h-[500px] bg-slate-50/40">
        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400 font-medium">
            Loading messages history...
          </div>
        ) : messages.length > 0 ? (
          messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} currentUserType={userType} />
          ))
        ) : (
          <div className="py-12 text-center text-xs text-slate-400 font-medium">
            No messages recorded in this conversation thread yet.
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Composer Input Footer */}
      <div className="p-4 border-t border-slate-200 bg-white">
        <MessageComposer
          onSendMessage={onSendMessage}
          isSending={sending}
          disabled={conversation.status === 'CLOSED'}
        />
      </div>
    </div>
  );
};
