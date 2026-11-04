import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Sparkles, X } from 'lucide-react';
import ChatWindow from './ChatWindow';
import {
  DEFAULT_WELCOME_MESSAGE,
  getStoredConversationId,
  getStoredMessages,
  setStoredMessages,
  clearChatSession,
  sendChatMessage,
} from '../../services/chatService';

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState(() => getStoredConversationId());
  const [hasUnread, setHasUnread] = useState(false);

  const [messages, setMessages] = useState(() => {
    const saved = getStoredMessages();
    if (saved && saved.length > 0) return saved;

    return [
      {
        id: 'welcome-1',
        role: 'assistant',
        content: DEFAULT_WELCOME_MESSAGE,
        timestamp: new Date().toISOString(),
      },
    ];
  });

  // Sync messages to session storage on update
  useEffect(() => {
    setStoredMessages(messages);
  }, [messages]);

  // Handle incoming message submission
  const handleSendMessage = useCallback(
    async (text) => {
      if (!text || !text.trim() || isLoading) return;

      const userMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: text.trim(),
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      const res = await sendChatMessage({
        message: text.trim(),
        conversationId: conversationId || undefined,
      });

      if (res?.conversationId) {
        setConversationId(res.conversationId);
      }

      const botMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: res.reply,
        timestamp: new Date().toISOString(),
        isError: Boolean(res.isError),
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsLoading(false);

      if (!isOpen || isMinimized) {
        setHasUnread(true);
      }
    },
    [isLoading, conversationId, isOpen, isMinimized]
  );

  const handleOpen = () => {
    setIsOpen(true);
    setIsMinimized(false);
    setHasUnread(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  const handleMinimize = () => {
    setIsMinimized(true);
  };

  const handleResetConversation = () => {
    clearChatSession();
    setConversationId(null);
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        content: DEFAULT_WELCOME_MESSAGE,
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  return (
    <>
      {/* 1. FLOATING CHATBOT TOGGLE BUTTON (Visible when closed or minimized) */}
      {(!isOpen || isMinimized) && (
        <motion.button
          type="button"
          onClick={handleOpen}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white shadow-2xl transition-shadow duration-300 hover:shadow-orange-500/30 focus:outline-none focus:ring-4 focus:ring-accent/30 cursor-pointer"
          aria-label="Open AI Assistant"
        >
          {/* Glowing particle effect */}
          <span className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-orange-400 to-amber-500 opacity-40 blur-sm animate-pulse" />

          {/* AI Icon */}
          <span className="relative flex items-center justify-center">
            <Bot size={26} className="text-white drop-shadow" />
            <Sparkles size={12} className="absolute -top-1 -right-1 text-amber-200 animate-spin [animation-duration:6s]" />
          </span>

          {/* Notification Badge */}
          {hasUnread && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex h-4 w-4 rounded-full bg-red-500 text-[9px] font-bold text-white items-center justify-center">
                1
              </span>
            </span>
          )}
        </motion.button>
      )}

      {/* 2. CHAT WINDOW (ANIMATED) */}
      <AnimatePresence>
        {isOpen && !isMinimized && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 z-50 flex h-full w-full sm:h-[600px] sm:max-h-[86vh] sm:w-[410px] sm:rounded-2xl border border-border shadow-2xl overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Bikes Rental Assistant Chat"
          >
            <ChatWindow
              messages={messages}
              isLoading={isLoading}
              onSendMessage={handleSendMessage}
              onClose={handleClose}
              onMinimize={handleMinimize}
              onResetConversation={handleResetConversation}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatbotWidget;

