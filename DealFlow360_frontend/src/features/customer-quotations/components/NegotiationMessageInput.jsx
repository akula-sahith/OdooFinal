import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { validateNegotiationMessage } from '../validation/customerQuotationValidation';

export const NegotiationMessageInput = ({ onSendMessage, sending, disabled }) => {
  const [text, setText] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (sending || disabled) return;

    const validation = validateNegotiationMessage(text);
    if (!validation.isValid) {
      setError(validation.error);
      return;
    }

    setError(null);
    try {
      await onSendMessage(text);
      setText('');
    } catch (err) {
      setError(err.message || 'Failed to send message.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
      <div className="space-y-2">
        <div className="relative">
          <textarea
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              if (error) setError(null);
            }}
            disabled={sending || disabled}
            placeholder={
              disabled
                ? 'Negotiation thread is closed for this quotation state.'
                : 'Type a message to your assigned sales executive...'
            }
            rows={3}
            className="w-full p-3 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition text-slate-800 dark:text-slate-200 resize-none disabled:opacity-60"
          />
        </div>

        {error && (
          <p className="text-[11px] text-rose-500 font-medium">{error}</p>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={sending || disabled || !text.trim()}
            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold text-xs rounded-lg flex items-center gap-2 shadow-xs transition disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{sending ? 'Sending...' : 'Send Message'}</span>
          </button>
        </div>
      </div>
    </form>
  );
};
