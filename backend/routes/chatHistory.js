import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { chatHistoryStore } from '../services/ChatHistoryStore.js';

const router = express.Router();

/**
 * GET /api/chats?userId=...
 * Returns list of user's chats for sidebar
 */
router.get('/chats', async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const chats = chatHistoryStore.getUserChats(userId);

    // Group chats by time periods (ChatGPT-style)
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    const groupedChats = {
      today: [],
      yesterday: [],
      lastWeek: [],
      older: []
    };

    chats.forEach(chat => {
      const chatDate = new Date(chat.updatedAt);
      
      if (chatDate >= today) {
        groupedChats.today.push(chat);
      } else if (chatDate >= yesterday) {
        groupedChats.yesterday.push(chat);
      } else if (chatDate >= lastWeek) {
        groupedChats.lastWeek.push(chat);
      } else {
        groupedChats.older.push(chat);
      }
    });

    res.json({
      success: true,
      userId,
      totalChats: chats.length,
      groupedChats,
      allChats: chats
    });

  } catch (error) {
    console.error('Get chats error:', error);
    res.status(500).json({ error: 'Failed to retrieve chats' });
  }
});

/**
 * GET /api/chats/:chatId?userId=...
 * Returns full chat with all messages
 */
router.get('/chats/:chatId', async (req, res) => {
  try {
    const { chatId } = req.params;
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    if (!chatId) {
      return res.status(400).json({ error: 'chatId is required' });
    }

    const chat = chatHistoryStore.getChat(userId, chatId);

    if (!chat) {
      return res.status(404).json({ error: 'Chat not found or access denied' });
    }

    // Return full chat data
    res.json({
      success: true,
      chat: {
        id: chat.id,
        title: chat.title,
        messages: chat.messages,
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt,
        messageCount: chat.messageCount
      }
    });

  } catch (error) {
    console.error('Get chat error:', error);
    res.status(500).json({ error: 'Failed to retrieve chat' });
  }
});

/**
 * POST /api/chat
 * Send message, save to chat, and return AI response
 */
router.post('/chat', async (req, res) => {
  try {
    const { userId, chatId, message, userProfile, userIntent } = req.body;
    const chatbotService = req.app.locals.chatbotService;
    const logger = req.app.locals.logger;

    // Validation
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }
    
    if (!message) {
      return res.status(400).json({ error: 'message is required' });
    }

    // Generate chatId if not provided (new chat)
    const finalChatId = chatId || uuidv4();
    const sessionId = uuidv4(); // Generate session for compatibility

    logger.info(`Chat message - User: ${userId}, Chat: ${finalChatId}, Intent: ${userIntent || 'none'}`);

    // STEP 1: Add user message to chat history
    chatHistoryStore.addMessage(userId, finalChatId, 'user', message, {
      userIntent,
      userProfile: userProfile?.businessOwnerName
    });

    // STEP 2: Get conversation context
    const chat = chatHistoryStore.getChat(userId, finalChatId);
    const conversationHistory = chat.messages.slice(-10); // Last 10 messages as context

    // Format context for AI
    const conversationContext = conversationHistory.length > 1 
      ? `Previous conversation:\n${conversationHistory.slice(0, -1).map(msg => 
          `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
        ).join('\n')}\n\nContinue the conversation naturally:`
      : 'This is the start of a new conversation.';

    // STEP 3: Get AI response
    const response = await chatbotService.processMessage(message, userProfile, sessionId, {
      chatId: finalChatId,
      userIntent,
      conversationHistory,
      conversationContext
    });

    // STEP 4: Save AI response to chat history
    chatHistoryStore.addMessage(userId, finalChatId, 'assistant', response.message, {
      userIntent,
      responseType: response.type,
      data: response.data,
      dashboardStateUpdate: response.dashboardStateUpdate || null
    });

    // STEP 5: Return response with updated chat info
    const updatedChat = chatHistoryStore.getChat(userId, finalChatId);

    // STATE-EMITTING COPILOT FORMAT
    res.json({
      success: true,
      
      // CHAT_RESPONSE section
      message: response.message,
      type: response.type,
      data: response.data,
      
      // Chat info
      chatId: finalChatId,
      userId,
      chat: {
        id: updatedChat.id,
        title: updatedChat.title,
        messageCount: updatedChat.messageCount,
        updatedAt: updatedChat.updatedAt
      },
      timestamp: new Date().toISOString(),
      
      // DASHBOARD_STATE_UPDATE section - ALWAYS present when dashboard update requested
      dashboardUpdateRequested: response.dashboardUpdateRequested || false,
      dashboardStateUpdate: response.dashboardStateUpdate !== undefined 
        ? response.dashboardStateUpdate 
        : null
    });

  } catch (error) {
    req.app.locals.logger.error('Chat error:', error);
    res.status(500).json({ 
      error: 'Failed to process message',
      message: 'I apologize, but I encountered an error. Please try again.'
    });
  }
});

/**
 * DELETE /api/chats/:chatId?userId=...
 * Delete a specific chat
 */
router.delete('/chats/:chatId', async (req, res) => {
  try {
    const { chatId } = req.params;
    const { userId } = req.query;

    if (!userId || !chatId) {
      return res.status(400).json({ error: 'userId and chatId are required' });
    }

    const deleted = chatHistoryStore.deleteChat(userId, chatId);

    if (!deleted) {
      return res.status(404).json({ error: 'Chat not found or access denied' });
    }

    res.json({
      success: true,
      message: `Chat ${chatId} deleted successfully`
    });

  } catch (error) {
    console.error('Delete chat error:', error);
    res.status(500).json({ error: 'Failed to delete chat' });
  }
});

/**
 * PUT /api/chats/:chatId/title?userId=...
 * Update chat title
 */
router.put('/chats/:chatId/title', async (req, res) => {
  try {
    const { chatId } = req.params;
    const { userId, title } = req.body;

    if (!userId || !chatId || !title) {
      return res.status(400).json({ error: 'userId, chatId, and title are required' });
    }

    const updated = chatHistoryStore.updateChatTitle(userId, chatId, title);

    if (!updated) {
      return res.status(404).json({ error: 'Chat not found or access denied' });
    }

    res.json({
      success: true,
      message: 'Chat title updated successfully',
      title
    });

  } catch (error) {
    console.error('Update title error:', error);
    res.status(500).json({ error: 'Failed to update chat title' });
  }
});

/**
 * GET /api/chat-stats
 * Get chat history statistics
 */
router.get('/chat-stats', async (req, res) => {
  try {
    const stats = chatHistoryStore.getStats();
    
    res.json({
      success: true,
      stats,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to retrieve stats' });
  }
});

export default router; 