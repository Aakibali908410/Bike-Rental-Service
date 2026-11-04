import Conversation from "../models/Conversation.js";
import asyncHandler from "../utils/asyncHandler.js";
import { processChatMessage } from "../services/aiService.js";

const generateConversationId = () =>
  `AMR-CHAT-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

// @route POST /api/chat/message
export const sendChatMessage = asyncHandler(async (req, res) => {
  const { message, conversationId } = req.body;

  if (!message || typeof message !== "string" || !message.trim()) {
    return res.status(400).json({
      success: false,
      message: "Message is required and must be non-empty.",
    });
  }

  const trimmedMessage = message.trim();
  if (trimmedMessage.length > 1000) {
    return res.status(400).json({
      success: false,
      message: "Message exceeds the maximum allowed length of 1000 characters.",
    });
  }

  let conversation = null;

  try {
    if (conversationId && typeof conversationId === "string") {
      conversation = await Conversation.findOne({ conversationId: conversationId.trim() });

      if (conversation) {
        // Authorization check: if conversation belongs to an authenticated user, prevent other users from accessing it
        if (
          conversation.user &&
          (!req.user || req.user._id.toString() !== conversation.user.toString())
        ) {
          return res.status(403).json({
            success: false,
            message: "You do not have access to this conversation.",
          });
        }
      }
    }

    // Create new conversation if not found or not provided
    if (!conversation) {
      conversation = await Conversation.create({
        conversationId: generateConversationId(),
        user: req.user ? req.user._id : null,
        messages: [],
      });
    } else if (!conversation.user && req.user) {
      // If guest logs in, associate future messages with user
      conversation.user = req.user._id;
    }
  } catch (dbErr) {
    console.error("Conversation DB lookup/create error:", dbErr.message);
    return res.status(503).json({
      success: false,
      message:
        "The chat service is temporarily unavailable due to a database connection issue. Please try again shortly or browse our bikes directly on the Bikes page.",
      isError: true,
    });
  }

  // Append user's incoming message
  conversation.messages.push({
    role: "user",
    content: trimmedMessage,
    createdAt: new Date(),
  });

  // Process message through OpenAI & tools
  const { message: aiReply, error: isAiError } = await processChatMessage({
    messages: conversation.messages,
    user: req.user,
  });

  // Append assistant's answer
  conversation.messages.push({
    role: "assistant",
    content: aiReply,
    createdAt: new Date(),
  });

  conversation.lastActiveAt = new Date();

  // Keep stored messages array bounded to last 30 messages
  if (conversation.messages.length > 30) {
    conversation.messages = conversation.messages.slice(-30);
  }

  try {
    await conversation.save();
  } catch (saveErr) {
    console.error("Conversation save error:", saveErr.message);
    // Non-fatal: user still receives reply even if DB save encountered a transient issue
  }

  return res.status(200).json({
    success: true,
    conversationId: conversation.conversationId,
    reply: aiReply,
    isError: Boolean(isAiError),
  });
});

