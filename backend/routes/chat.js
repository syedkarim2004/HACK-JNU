import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { ChatSessionManager } from '../services/ChatSessionManager.js';
import { chatMemoryStore } from '../services/ChatMemoryStore.js';

const router = express.Router();

// Initialize session manager
const sessionManager = new ChatSessionManager();

// POST /api/chat/message - Process chat message with conversation memory
router.post('/message', async (req, res) => {
  try {
    const { message, userProfile, sessionId, chatId, userIntent } = req.body;
    const chatbotService = req.app.locals.chatbotService;
    const logger = req.app.locals.logger;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Generate IDs if not provided
    const finalSessionId = sessionId || uuidv4();
    const finalChatId = chatId || uuidv4();
    const userId = userProfile?.userId || finalSessionId; // Use sessionId as userId fallback
    
    logger.info(`Processing chat message - Session: ${finalSessionId}, Chat: ${finalChatId}, Intent: ${userIntent || 'none'}`);

    // MEMORY FLOW STEP 1: Store user message in conversation memory
    chatMemoryStore.addMessage(userId, finalChatId, 'user', message, {
      userIntent,
      sessionId: finalSessionId,
      userProfile: userProfile?.businessOwnerName
    });

    // MEMORY FLOW STEP 2: Get conversation context for AI
    const conversationHistory = chatMemoryStore.getContextMessages(userId, finalChatId);
    const conversationContext = chatMemoryStore.getConversationContextString(userId, finalChatId);
    
    logger.info(`Chat context retrieved: ${conversationHistory.length} previous messages`);

    // MEMORY FLOW STEP 3: Process message with conversation context
    const response = await chatbotService.processMessage(message, userProfile, finalSessionId, {
      chatId: finalChatId,
      userIntent,
      conversationHistory,
      conversationContext
    });

    // MEMORY FLOW STEP 4: Store assistant response in memory
    chatMemoryStore.addMessage(userId, finalChatId, 'assistant', response.message, {
      userIntent,
      responseType: response.type,
      data: response.data
    });

    // Update session with chat data
    sessionManager.updateSession(finalSessionId, message, response);

    res.json({
      ...response,
      sessionId: finalSessionId,
      chatId: finalChatId,
      timestamp: new Date().toISOString(),
      conversationLength: chatMemoryStore.getChatInfo(userId, finalChatId)?.messageCount || 0
    });

  } catch (error) {
    req.app.locals.logger.error('Chat message error:', error);
    res.status(500).json({ 
      error: 'Failed to process message',
      message: 'I apologize, but I encountered an error. Please try again.'
    });
  }
});

// GET /api/chat/session/:sessionId - Get session data
router.get('/session/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const chatbotService = req.app.locals.chatbotService;

    const session = chatbotService.getSession(sessionId);
    
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json({
      sessionId: session.id,
      businessProfile: session.businessProfile,
      currentPhase: session.currentPhase,
      messageCount: session.messages.length,
      lastActivity: session.lastActivity,
      createdAt: session.createdAt
    });

  } catch (error) {
    req.app.locals.logger.error('Get session error:', error);
    res.status(500).json({ error: 'Failed to retrieve session' });
  }
});

// POST /api/chat/session/reset - Reset or create new session
router.post('/session/reset', async (req, res) => {
  try {
    const { userProfile } = req.body;
    const chatbotService = req.app.locals.chatbotService;
    
    const newSessionId = uuidv4();
    const session = chatbotService.createSession(newSessionId, userProfile);

    res.json({
      sessionId: newSessionId,
      message: 'New session created successfully',
      businessProfile: session.businessProfile
    });

  } catch (error) {
    req.app.locals.logger.error('Reset session error:', error);
    res.status(500).json({ error: 'Failed to reset session' });
  }
});

// GET /api/chat/history/:sessionId - Get chat history
router.get('/history/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { limit = 50, offset = 0 } = req.query;
    const chatbotService = req.app.locals.chatbotService;

    const session = chatbotService.getSession(sessionId);
    
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const messages = session.messages
      .slice(parseInt(offset), parseInt(offset) + parseInt(limit))
      .map(msg => ({
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp,
        data: msg.data
      }));

    res.json({
      messages,
      total: session.messages.length,
      sessionId
    });

  } catch (error) {
    req.app.locals.logger.error('Get history error:', error);
    res.status(500).json({ error: 'Failed to retrieve chat history' });
  }
});

// NEW MEMORY ROUTES

// GET /api/chat/conversation/:chatId - Get full conversation history by chatId
router.get('/conversation/:chatId', async (req, res) => {
  try {
    const { chatId } = req.params;
    const { limit = 50 } = req.query;

    if (!chatMemoryStore.hasChat(chatId)) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    const messages = chatMemoryStore.getMessages(chatId);
    const chatInfo = chatMemoryStore.getChatInfo(chatId);

    // Apply limit if specified
    const limitedMessages = limit ? messages.slice(-parseInt(limit)) : messages;

    res.json({
      chatId,
      messages: limitedMessages,
      total: messages.length,
      chatInfo
    });

  } catch (error) {
    req.app.locals.logger.error('Get conversation error:', error);
    res.status(500).json({ error: 'Failed to retrieve conversation' });
  }
});

// DELETE /api/chat/conversation/:chatId - Clear specific conversation
router.delete('/conversation/:chatId', async (req, res) => {
  try {
    const { chatId } = req.params;
    
    const deleted = chatMemoryStore.deleteChat(chatId);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    res.json({
      success: true,
      message: `Conversation ${chatId} cleared successfully`
    });

  } catch (error) {
    req.app.locals.logger.error('Delete conversation error:', error);
    res.status(500).json({ error: 'Failed to clear conversation' });
  }
});

// GET /api/chat/stats - Get memory usage statistics  
router.get('/stats', async (req, res) => {
  try {
    const stats = chatMemoryStore.getStats();
    
    res.json({
      memoryStats: stats,
      serverUptime: process.uptime(),
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    req.app.locals.logger.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to retrieve stats' });
  }
});

// POST /api/chat/test-memory - Test conversation memory (for development)
router.post('/test-memory', async (req, res) => {
  try {
    const { chatId = 'test-chat-123' } = req.body;
    
    // Simulate a conversation to test memory
    const testMessages = [
      { role: 'user', content: 'Hi, I want to start a restaurant business' },
      { role: 'assistant', content: 'Great! I can help you with restaurant compliance. What type of cuisine will you serve?' },
      { role: 'user', content: 'Indian cuisine, specifically South Indian' },
      { role: 'assistant', content: 'Perfect! South Indian restaurants need FSSAI license. Where will you open this restaurant?' }
    ];
    
    // Add test messages to memory
    testMessages.forEach(msg => {
      chatMemoryStore.addMessage(chatId, msg.role, msg.content, { testData: true });
    });
    
    // Demonstrate memory retrieval
    const conversationHistory = chatMemoryStore.getMessages(chatId);
    const contextString = chatMemoryStore.getConversationContextString(chatId);
    const chatInfo = chatMemoryStore.getChatInfo(chatId);
    
    res.json({
      success: true,
      demonstration: {
        chatId,
        totalMessages: conversationHistory.length,
        conversationHistory,
        contextString,
        chatInfo
      },
      instructions: {
        nextStep: `Now send a message to /api/chat/message with chatId: "${chatId}"`,
        example: {
          method: 'POST',
          url: '/api/chat/message',
          body: {
            chatId,
            message: 'What licenses do I need?',
            userIntent: 'NEW_BUSINESS'
          }
        }
      }
    });

  } catch (error) {
    req.app.locals.logger.error('Test memory error:', error);
    res.status(500).json({ error: 'Failed to test memory' });
  }
});

export default router;
