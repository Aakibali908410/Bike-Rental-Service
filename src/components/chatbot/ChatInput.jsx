import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';

const ChatInput = ({ onSend, isLoading }) => {
  const [text, setText] = useState('');
  const textareaRef = useRef(null);

  // Focus input automatically when idle
  useEffect(() => {
    if (!isLoading && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isLoading]);

  // Adjust height dynamically based on content (up to ~110px)
  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = `${Math.min(el.scrollHeight, 110)}px`;
    }
  }, [text]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    onSend(trimmed);
    setText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t border-border bg-secondary/80 p-3">
      <div className="flex items-end gap-2 rounded-xl border border-border bg-primary px-3 py-2 focus-within:border-accent transition-colors">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about bikes, dates, pricing..."
          disabled={isLoading}
          rows={1}
          maxLength={1000}
          className="max-h-28 flex-1 resize-none bg-transparent text-sm text-text placeholder-textSecondary focus:outline-none disabled:opacity-50"
          aria-label="Chat Message Input"
        />

        <button
          type="submit"
          disabled={!text.trim() || isLoading}
          aria-label="Send Message"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent text-white shadow-sm transition-all hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={15} />}
        </button>
      </div>

      <div className="mt-1 flex items-center justify-between px-1 text-[10px] text-textSecondary select-none">
        <span>Enter to send · Shift+Enter for new line</span>
        {text.length > 800 && (
          <span className={text.length >= 1000 ? 'text-red-400 font-bold' : ''}>
            {text.length}/1000
          </span>
        )}
      </div>
    </form>
  );
};

export default ChatInput;

