/**
 * ChatMemoryStore - Manages conversation memory per user, per chat session
 * 
 * This module provides isolated ChatGPT-style conversation memory where:
 * - Each user has isolated storage (cannot access other users' data)
 * - Each user can have multiple chat sessions (chatId)
 * - All messages (user + assistant) are stored per user per session
 * - Previous conversation context is available for AI responses
 * - Memory persists during the server session (in-memory storage)
 * 
 * ISOLATION STRUCTURE:
 * userId → chatId → messages[]
 * 
 * SECURITY: Users cannot access other users' conversations
 */

export class ChatMemoryStore {
  constructor() {
    // USER-ISOLATED STORAGE: Map<userId, Map<chatId, conversationData>>
    // This creates a two-level isolation: userId → chatId → messages
    this.userConversations = new Map();
    
    // Configuration
    this.maxMessagesPerChat = 50; // Limit to prevent memory bloat
    this.maxContextMessages = 10;  // Last N messages sent to AI as context
    this.maxChatsPerUser = 20;     // Limit chats per user for memory management
    
    console.log('💾 ChatMemoryStore initialized - Per-user isolated conversation storage');
    console.log('🔒 Security: Users cannot access other users\' conversations');
  }

  /**
   * Get user's chat storage (creates if doesn't exist)
   * @param {string} userId - Unique user identifier
   * @returns {Map} User's chat storage map
   */
  _getUserChatStorage(userId) {
    if (!this.userConversations.has(userId)) {
      this.userConversations.set(userId, new Map());
      console.log(`👤 New user storage created: ${userId}`);
    }
    return this.userConversations.get(userId);
  }

  /**
   * Get all messages for a specific user's chat session
   * @param {string} userId - Unique user identifier  
   * @param {string} chatId - Unique chat identifier
   * @returns {Array} Array of message objects (empty if user/chat doesn't exist)
   */
  getMessages(userId, chatId) {
    if (!userId || !chatId) {
      console.warn('⚠️ getMessages: userId and chatId are required');
      return [];
    }

    const userChats = this.userConversations.get(userId);
    if (!userChats) {
      return []; // User doesn't exist yet
    }

    const conversation = userChats.get(chatId);
    return conversation ? conversation.messages : [];
  }

  /**
   * Add a new message to a user's chat session
   * @param {string} userId - Unique user identifier
   * @param {string} chatId - Unique chat identifier
   * @param {string} role - Either 'user' or 'assistant'
   * @param {string} content - Message content
   * @param {Object} metadata - Optional metadata (intent, timestamp, etc.)
   */
  addMessage(userId, chatId, role, content, metadata = {}) {
    // SECURITY VALIDATION: Ensure all required parameters
    if (!userId || !chatId || !role || !content) {
      throw new Error('ChatMemoryStore: userId, chatId, role, and content are required for user isolation');
    }

    if (!['user', 'assistant'].includes(role)) {
      throw new Error('ChatMemoryStore: role must be either "user" or "assistant"');
    }

    // Get user's isolated chat storage
    const userChats = this._getUserChatStorage(userId);

    // Get or create conversation for this user's chatId
    let conversation = userChats.get(chatId);
    if (!conversation) {
      conversation = {
        userId,           // Store userId for audit trail
        chatId,
        messages: [],
        createdAt: new Date(),
        lastActivity: new Date(),
        metadata: {
          userIntent: metadata.userIntent || null,
          sessionId: metadata.sessionId || null
        }
      };
      userChats.set(chatId, conversation);
      console.log(`💬 New chat created for user ${userId}: ${chatId}`);
      
      // MEMORY MANAGEMENT: Limit chats per user
      if (userChats.size > this.maxChatsPerUser) {
        const oldestChat = Array.from(userChats.entries())
          .sort((a, b) => a[1].lastActivity - b[1].lastActivity)[0];
        userChats.delete(oldestChat[0]);
        console.log(`🗑️ Removed oldest chat for user ${userId} (memory management)`);
      }
    }

    // Create message object
    const message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,           // SECURITY: Always store userId with message
      chatId,           // Store chatId for reference
      role,
      content,
      timestamp: new Date(),
      ...metadata
    };

    // Add message to conversation
    conversation.messages.push(message);
    conversation.lastActivity = new Date();

    // MEMORY MANAGEMENT: Trim old messages if exceeding limit
    if (conversation.messages.length > this.maxMessagesPerChat) {
      const removed = conversation.messages.splice(0, conversation.messages.length - this.maxMessagesPerChat);
      console.log(`🗑️ Trimmed ${removed.length} old messages from user ${userId} chat ${chatId}`);
    }

    console.log(`💾 Message added to user ${userId} chat ${chatId}: ${role} - ${content.substring(0, 50)}...`);
    return message;
  }

  /**
   * Get recent messages for AI context (last N messages formatted for Ollama)
   * @param {string} userId - User identifier
   * @param {string} chatId - Chat identifier 
   * @param {number} limit - Number of recent messages to return
   * @returns {Array} Array of messages formatted for AI context
   */
  getContextMessages(userId, chatId, limit = null) {
    const messages = this.getMessages(userId, chatId);
    const contextLimit = limit || this.maxContextMessages;
    
    // Get last N messages (excluding the current user message being processed)
    const recentMessages = messages.slice(-contextLimit);
    
    // Format for AI context
    return recentMessages.map(msg => ({
      role: msg.role,
      content: msg.content,
      timestamp: msg.timestamp
    }));
  }

  /**
   * Format conversation history as a string for Ollama prompt
   * @param {string} userId - User identifier
   * @param {string} chatId - Chat identifier
   * @param {number} limit - Number of recent messages to include
   * @returns {string} Formatted conversation history
   */
  getConversationContextString(userId, chatId, limit = null) {
    const contextMessages = this.getContextMessages(userId, chatId, limit);
    
    if (contextMessages.length === 0) {
      return "This is the start of a new conversation.";
    }

    // Format as conversation history
    const conversationLines = contextMessages.map(msg => {
      const role = msg.role === 'user' ? 'User' : 'Assistant';
      return `${role}: ${msg.content}`;
    });

    return `Previous conversation:\n${conversationLines.join('\n')}\n\nContinue the conversation naturally:`;
  }

  /**
   * Check if a user's chat session exists
   * @param {string} userId - User identifier
   * @param {string} chatId - Chat identifier
   * @returns {boolean} True if chat exists for this user
   */
  hasChat(userId, chatId) {
    if (!userId || !chatId) return false;
    const userChats = this.userConversations.get(userId);
    return userChats ? userChats.has(chatId) : false;
  }

  /**
   * Get chat metadata (creation time, message count, etc.)
   * @param {string} userId - User identifier
   * @param {string} chatId - Chat identifier
   * @returns {Object} Chat metadata or null
   */
  getChatInfo(userId, chatId) {
    if (!userId || !chatId) return null;
    
    const userChats = this.userConversations.get(userId);
    if (!userChats) return null;
    
    const conversation = userChats.get(chatId);
    if (!conversation) return null;

    return {
      userId: conversation.userId,
      chatId: conversation.chatId,
      messageCount: conversation.messages.length,
      createdAt: conversation.createdAt,
      lastActivity: conversation.lastActivity,
      userIntent: conversation.metadata.userIntent,
      sessionId: conversation.metadata.sessionId
    };
  }

  /**
   * Delete a user's chat session
   * @param {string} userId - User identifier
   * @param {string} chatId - Chat identifier
   * @returns {boolean} True if chat was deleted
   */
  deleteChat(userId, chatId) {
    if (!userId || !chatId) return false;
    
    const userChats = this.userConversations.get(userId);
    if (!userChats) return false;
    
    const deleted = userChats.delete(chatId);
    if (deleted) {
      console.log(`🗑️ Chat session deleted: ${chatId} for user ${userId}`);
      
      // Clean up empty user storage
      if (userChats.size === 0) {
        this.userConversations.delete(userId);
        console.log(`🗑️ Empty user storage removed: ${userId}`);
      }
    }
    return deleted;
  }

  /**
   * Clear all conversations for a specific user
   * @param {string} userId - User identifier
   * @returns {number} Number of chats deleted
   */
  clearUserChats(userId) {
    if (!userId) return 0;
    
    const userChats = this.userConversations.get(userId);
    if (!userChats) return 0;
    
    const count = userChats.size;
    this.userConversations.delete(userId);
    console.log(`🗑️ All ${count} chats cleared for user ${userId}`);
    return count;
  }

  /**
   * Clear all conversations (for testing or server restart cleanup)
   */
  clearAll() {
    const stats = this.getStats();
    this.userConversations.clear();
    console.log(`🗑️ All conversations cleared - ${stats.totalUsers} users, ${stats.totalChats} chats, ${stats.totalMessages} messages`);
  }

  /**
   * Get stats about memory usage
   * @returns {Object} Memory usage statistics
   */
  getStats() {
    const totalUsers = this.userConversations.size;
    let totalChats = 0;
    let totalMessages = 0;

    this.userConversations.forEach(userChats => {
      totalChats += userChats.size;
      userChats.forEach(conversation => {
        totalMessages += conversation.messages.length;
      });
    });

    return {
      totalUsers,
      totalChats,
      totalMessages,
      averageChatsPerUser: totalUsers > 0 ? Math.round(totalChats / totalUsers) : 0,
      averageMessagesPerChat: totalChats > 0 ? Math.round(totalMessages / totalChats) : 0,
      memoryUsageKB: Math.round(JSON.stringify(Array.from(this.userConversations.values())).length / 1024)
    };
  }
}

// Create and export singleton instance
export const chatMemoryStore = new ChatMemoryStore();