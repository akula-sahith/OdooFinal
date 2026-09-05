import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Button } from '../../../components/ui/Button/Button';
import { Textarea } from '../../../components/ui/Textarea/Textarea';

/**
 * MessageComposer Component
 * Text input area for composing and sending messages in a request conversation.
 */
export const MessageComposer = ({
  onSendMessage,
  isSending = false,
  disabled = false,
}) => {
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim() || isSending || disabled) return;
    onSendMessage(content.trim());
    setContent('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 pt-3">
      <div className="relative">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message to the sales engineer... (Press Enter to send, Shift+Enter for new line)"
          disabled={disabled || isSending}
          rows={3}
          className="resize-none text-xs sm:text-sm"
        />
      </div>

      <div className="flex items-center justify-between">
        <span className="text-[11px] text-slate-400">
          {content.length} / 1000 characters
        </span>

        <Button
          type="submit"
          disabled={!content.trim() || isSending || disabled}
          isLoading={isSending}
          leftIcon={Send}
          className="bg-[#714B67] hover:bg-[#5a3b52] text-white py-1.5 px-4 text-xs"
        >
          {isSending ? 'Sending...' : 'Send Message'}
        </Button>
      </div>
    </form>
  );
};

export default MessageComposer;
