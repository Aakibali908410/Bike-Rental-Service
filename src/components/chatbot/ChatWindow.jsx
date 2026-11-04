import React, { useRef, useEffect } from 'react';
import { Bot, Sparkles, X, Minus, RotateCcw } from 'lucide-react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import TypingIndicator from './TypingIndicator';
import { SUGGESTED_QUESTIONS } from '../../services/chatService';

const ChatWindow = ({
  messages,
  isLoading,
  onSendMessage,
  onClose,
  onMinimize,
  onResetConversation,
}) => {
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom on new message or loading change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-primary text-text shadow-2xl">
      {/* 1. HEADER */}
      <header className="flex items-center justify-between border-b border-border bg-secondary px-4 py-3 select-none">
        <div className="flex items-center gap-2.5">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-accent/20 text-accent border border-accent/40 shadow-sm">
            <Bot size={20} />
            <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-success" />
            </span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-sm font-bold tracking-tight text-text">Bikes Rental Assistant</h2>
              <span className="rounded bg-accent/15 px-1.5 py-0.5 text-[10px] font-bold text-accent">
                AI
              </span>
            </div>
            <p className="flex items-center gap-1 text-[11px] text-textSecondary">
              <span className="h-1.5 w-1.5 rounded-full bg-success" /> Online · Real-time Fleet
            </p>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onResetConversation}
            title="Start New Chat"
            aria-label="Start New Chat"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-textSecondary transition-colors hover:bg-primary hover:text-text cursor-pointer"
          >
            <RotateCcw size={15} />
          </button>
          <button
            type="button"
            onClick={onMinimize}
            title="Minimize"
            aria-label="Minimize Chat"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-textSecondary transition-colors hover:bg-primary hover:text-text cursor-pointer"
          >
            <Minus size={17} />
          </button>
          <button
            type="button"
            onClick={onClose}
            title="Close"
            aria-label="Close Chat"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-textSecondary transition-colors hover:bg-primary hover:text-text cursor-pointer"
          >
            <X size={17} />
          </button>
        </div>
      </header>

      {/* 2. MESSAGES SCROLL AREA */}
      <div className="flex-1 overflow-y-auto p-4 scroll-smooth">
        {/* Welcome Banner */}
        <div className="mb-4 rounded-xl border border-accent/20 bg-accent/5 p-3.5 text-xs text-textSecondary">
          <div className="flex items-center gap-2 font-semibold text-accent mb-1">
            <Sparkles size={14} />
            <span>Smart Motorcycle Concierge</span>
          </div>
          <p>
            Ask me about live availability, rental rates, 18% GST calculation, security deposits, or pickup locations.
          </p>
        </div>

        {/* Messages */}
        {messages.map((msg, index) => (
          <ChatMessage key={msg.id || index} message={msg} />
        ))}

        {/* Typing indicator */}
        {isLoading && <TypingIndicator />}

        {/* Suggested Questions Chips (Show when history is short) */}
        {!isLoading && messages.length <= 2 && (
          <div className="mt-4 pt-2 border-t border-border/50">
            <p className="text-[11px] font-semibold text-textSecondary mb-2 flex items-center gap-1.5">
              <span>Suggested questions:</span>
            </p>
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTED_QUESTIONS.map((question) => (
                <button
                  key={question}
                  type="button"
                  onClick={() => onSendMessage(question)}
                  className="rounded-full border border-border bg-secondary/80 px-3 py-1.5 text-xs text-textSecondary transition-all hover:border-accent hover:bg-secondary hover:text-accent cursor-pointer text-left"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 3. INPUT AREA */}
      <ChatInput onSend={onSendMessage} isLoading={isLoading} />
    </div>
  );
};

export default ChatWindow;

