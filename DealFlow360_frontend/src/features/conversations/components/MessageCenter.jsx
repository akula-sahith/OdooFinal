import React, { useState } from 'react';
import { Search, Filter, MessageSquare } from 'lucide-react';
import { ConversationList } from './ConversationList';
import { ConversationView } from './ConversationView';
import { useConversations } from '../hooks/useConversations';
import { useMessages } from '../hooks/useMessages';

export const MessageCenter = ({ userType = 'CUSTOMER', defaultConversationId = null }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContext, setSelectedContext] = useState('ALL');
  const [activeConv, setActiveConv] = useState(null);

  const { conversations, loading: convsLoading, setFilters } = useConversations({
    search: searchTerm,
    contextType: selectedContext,
    userType,
  });

  const activeId = activeConv ? activeConv.id : defaultConversationId || (conversations[0]?.id || null);
  const currentConversation = conversations.find((c) => c.id === activeId || c.contextId === activeId) || activeConv || conversations[0];

  const { messages, loading: msgsLoading, sending, sendMessage } = useMessages(
    currentConversation?.id,
    userType
  );

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    setFilters((prev) => ({ ...prev, search: val }));
  };

  const handleContextFilter = (type) => {
    setSelectedContext(type);
    setFilters((prev) => ({ ...prev, contextType: type }));
  };

  const handleSelectConv = (conv) => {
    setActiveConv(conv);
  };

  return (
    <div className="space-y-4 text-left">
      {/* Search & Filter Toolbar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search conversations by ID, context, or keyword..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full h-10 pl-9 pr-4 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#714B67] outline-none transition-all"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl shrink-0 overflow-x-auto">
            {['ALL', 'QUOTATION', 'ORDER', 'INVOICE', 'SHIPMENT', 'REQUEST'].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => handleContextFilter(type)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedContext === type
                    ? 'bg-[#714B67] text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-200/60'
                }`}
              >
                {type === 'ALL' ? 'All Contexts' : type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Split-Pane Message Center Container */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Conversations Directory Sidebar */}
        <div
          className={`md:col-span-4 bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-2xs ${
            activeConv ? 'hidden md:block' : 'block'
          }`}
        >
          <div className="p-3 border-b border-slate-100 bg-slate-50 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <MessageSquare className="w-3.5 h-3.5 text-[#714B67]" />
            Active Message Threads ({conversations.length})
          </div>

          {convsLoading ? (
            <div className="py-12 text-center text-xs text-slate-400 font-medium">
              Loading message threads...
            </div>
          ) : (
            <ConversationList
              conversations={conversations}
              activeId={currentConversation?.id}
              onSelectConversation={handleSelectConv}
              userType={userType}
            />
          )}
        </div>

        {/* Active Conversation View Main Panel */}
        <div
          className={`md:col-span-8 min-h-[550px] ${
            !activeConv ? 'block' : 'block'
          }`}
        >
          <ConversationView
            conversation={currentConversation}
            messages={messages}
            loading={msgsLoading}
            sending={sending}
            userType={userType}
            onSendMessage={(body) => sendMessage(body)}
            onBackToList={() => setActiveConv(null)}
          />
        </div>
      </div>
    </div>
  );
};
