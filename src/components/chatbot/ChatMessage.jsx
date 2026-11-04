import React from 'react';
import { Bot, User, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Safely parses basic inline markdown (e.g. **bold**) without dangerouslySetInnerHTML.
 */
const renderFormattedText = (text) => {
  if (!text) return null;

  // Split into lines to preserve paragraph structure
  const lines = text.split('\n');

  return lines.map((line, lineIndex) => {
    // Check if line is a bullet item
    const isBullet = line.trim().startsWith('- ') || line.trim().startsWith('* ');
    const cleanedLine = isBullet ? line.trim().substring(2) : line;

    // Parse **bold** parts
    const parts = cleanedLine.split(/(\*\*[^*]+\*\*)/g);

    const formattedContent = parts.map((part, partIndex) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={partIndex} className="font-semibold text-text">
            {part.slice(2, -2)}
          </strong>
        );
      }

      // Check for internal links like /booking/... or /bikes
      const linkMatch = part.match(/(\/(?:booking|bikes)(?:\/[^\s.,!?]*)?)/);
      if (linkMatch) {
        const pre = part.slice(0, linkMatch.index);
        const url = linkMatch[0];
        const post = part.slice(linkMatch.index + url.length);
        return (
          <React.Fragment key={partIndex}>
            {pre}
            <Link
              to={url}
              className="inline-flex items-center gap-1 font-semibold text-accent underline underline-offset-2 hover:text-orange-400 transition-colors"
            >
              {url.startsWith('/booking/') ? 'Book Now →' : 'View Bikes →'}
            </Link>
            {post}
          </React.Fragment>
        );
      }

      return part;
    });

    if (isBullet) {
      return (
        <li key={lineIndex} className="ml-4 list-disc pl-1 my-0.5">
          {formattedContent}
        </li>
      );
    }

    // Empty line treated as spacer
    if (!line.trim()) {
      return <div key={lineIndex} className="h-2" />;
    }

    return (
      <p key={lineIndex} className="my-0.5 leading-relaxed">
        {formattedContent}
      </p>
    );
  });
};

const ChatMessage = ({ message }) => {
  const isBot = message.role === 'assistant';
  const isError = Boolean(message.isError);

  const formattedTime = message.timestamp
    ? new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';

  return (
    <div
      className={`flex items-start gap-2.5 my-3 ${
        isBot ? 'justify-start' : 'justify-end flex-row-reverse'
      } animate-fadeIn`}
    >
      {/* Avatar */}
      <div
        className={`flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full text-xs font-bold shadow-sm ${
          isBot
            ? isError
              ? 'bg-red-950/60 text-red-400 border border-red-500/40'
              : 'bg-accent/20 text-accent border border-accent/30'
            : 'bg-secondary text-textSecondary border border-border'
        }`}
      >
        {isBot ? isError ? <AlertCircle size={16} /> : <Bot size={17} /> : <User size={16} />}
      </div>

      {/* Bubble Container */}
      <div className={`flex flex-col max-w-[82%] sm:max-w-[78%] ${isBot ? 'items-start' : 'items-end'}`}>
        <div
          className={`rounded-2xl px-4 py-2.5 text-sm shadow-sm transition-all ${
            isBot
              ? isError
                ? 'rounded-tl-sm border border-red-500/40 bg-red-950/30 text-red-200'
                : 'rounded-tl-sm border border-border bg-secondary text-text'
              : 'rounded-tr-sm bg-accent text-white font-medium'
          }`}
        >
          {renderFormattedText(message.content)}
        </div>

        {/* Timestamp */}
        {formattedTime && (
          <span className="text-[10px] text-textSecondary px-1.5 mt-1 font-mono select-none">
            {formattedTime}
          </span>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;

