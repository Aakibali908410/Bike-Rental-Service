import React from 'react';
import { Bot } from 'lucide-react';

const TypingIndicator = () => {
  return (
    <div className="flex items-start gap-2.5 my-3 animate-fadeIn">
      {/* Bot Avatar */}
      <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full bg-accent/20 text-accent border border-accent/30 shadow-sm">
        <Bot size={17} />
      </div>

      {/* Bubble with bouncing dots */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm border border-border bg-secondary px-4 py-3 text-text shadow-sm">
          <span className="text-xs text-textSecondary font-medium mr-1">Bikes Rental Assistant</span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-accent animate-bounce [animation-delay:-0.3s]" />
            <span className="h-2 w-2 rounded-full bg-accent animate-bounce [animation-delay:-0.15s]" />
            <span className="h-2 w-2 rounded-full bg-accent animate-bounce" />
          </span>
        </div>
        <span className="text-[10px] text-textSecondary px-1">Checking real-time fleet...</span>
      </div>
    </div>
  );
};

export default TypingIndicator;

