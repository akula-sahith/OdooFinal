import React, { useRef, useEffect } from 'react';
import { MessageSquare } from 'lucide-react';
import { MessageBubble } from './MessageBubble';

/**
 * MessageList Component
 * Renders conversation history with auto-scroll and empty states.
 */
export const MessageList = ({ messages = [], loading = false, currentUserType = 'CUSTOMER' }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (loading) {
    return (
      <div className="py-12 text-center text-slate-400 text-xs">
        Loading communication history...
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="py-12 text-center text-slate-400 text-xs flex flex-col items-center justify-center">
        <MessageSquare className="w-8 h-8 text-slate-300 mb-2" />
        <p className="font-semibold text-slate-600">No messages exchanged yet</p>
        <p className="text-[11px] mt-0.5">Send a message below to clarify requirement specifications.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 overflow-y-auto max-h-[420px] p-4 bg-slate-50/50 rounded-xl border border-slate-100">
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} currentUserType={currentUserType} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
};

export default MessageList;
