import { chatAPI, isNetworkFailure } from "../utils/api";

const SESSION_CONVERSATION_KEY = "ali_moto_chat_conversation_id";
const SESSION_MESSAGES_KEY = "ali_moto_chat_messages";

export const DEFAULT_WELCOME_MESSAGE =
  "Hi! Welcome to Bikes Rental Service. I'm Bikes Rental Assistant. I can help you find bikes, check availability, understand rental pricing, and answer your questions.";

export const SUGGESTED_QUESTIONS = [
  "Which bikes are available?",
  "Is Classic 350 available tomorrow?",
  "What is the security deposit?",
  "How can I rent a bike?",
  "What is your cancellation policy?",
];

/**
 * Retrieve stored conversationId from current browser session
 */
export const getStoredConversationId = () => {
  try {
    return sessionStorage.getItem(SESSION_CONVERSATION_KEY) || null;
  } catch {
    return null;
  }
};

/**
 * Persist conversationId to browser session storage
 */
export const setStoredConversationId = (id) => {
  try {
    if (id) {
      sessionStorage.setItem(SESSION_CONVERSATION_KEY, id);
    }
  } catch {
    // Ignore storage errors in restricted contexts
  }
};

/**
 * Clear stored conversationId from browser session
 */
export const clearStoredConversationId = () => {
  try {
    sessionStorage.removeItem(SESSION_CONVERSATION_KEY);
  } catch {
    // Ignore storage errors
  }
};

/**
 * Retrieve messages from browser session storage
 */
export const getStoredMessages = () => {
  try {
    const raw = sessionStorage.getItem(SESSION_MESSAGES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // Ignore parsing errors
  }
  return null;
};

/**
 * Save messages array to browser session storage (capped at last 30 messages)
 */
export const setStoredMessages = (messages) => {
  try {
    if (Array.isArray(messages)) {
      const bounded = messages.slice(-30);
      sessionStorage.setItem(SESSION_MESSAGES_KEY, JSON.stringify(bounded));
    }
  } catch {
    // Ignore storage errors
  }
};

/**
 * Clear chat session entirely (both conversationId and messages)
 */
export const clearChatSession = () => {
  try {
    sessionStorage.removeItem(SESSION_CONVERSATION_KEY);
    sessionStorage.removeItem(SESSION_MESSAGES_KEY);
  } catch {
    // Ignore storage errors
  }
};

/**
 * Send message to backend AI Chatbot with graceful error normalization
 */
export const sendChatMessage = async ({ message, conversationId }) => {
  try {
    const res = await chatAPI.sendMessage({
      message: message.trim(),
      conversationId: conversationId || undefined,
    });

    if (res?.success) {
      if (res.conversationId) {
        setStoredConversationId(res.conversationId);
      }
      return {
        success: true,
        conversationId: res.conversationId,
        reply: res.reply,
        isError: Boolean(res.isError),
      };
    }

    throw new Error(res?.message || "Failed to receive response from AI assistant.");
  } catch (err) {
    if (isNetworkFailure(err)) {
      return {
        success: false,
        isError: true,
        reply:
          "Unable to connect to our server. Please check your internet connection or verify the backend server is running.",
      };
    }

    if (err?.status === 429) {
      return {
        success: false,
        isError: true,
        reply:
          "You're sending messages a bit too quickly. Please wait a moment before asking another question.",
      };
    }

    if (err?.status === 400) {
      return {
        success: false,
        isError: true,
        reply: err.message || "Please provide a valid message.",
      };
    }

    return {
      success: false,
      isError: true,
      reply:
        err.message ||
        "I'm temporarily having trouble responding. Please feel free to check our Bikes catalogue directly or try again shortly.",
    };
  }
};

