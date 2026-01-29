/**
 * ChatHistoryStore - Manages user chat history like ChatGPT
 * 
 * STRUCTURE: userId → chatId → { title, messages[], createdAt, updatedAt }
 * FEATURES: User isolation, auto-generated titles, time-based grouping
 */

export class ChatHistoryStore {
  constructor() {
    // USER-ISOLATED STORAGE: Map<userId, Map<chatId, chatData>>
    this.userChats = new Map();
    
    // Configuration
    this.maxChatsPerUser = 100;
    this.maxMessagesPerChat = 100;
    
    console.log('📚 ChatHistoryStore initialized - ChatGPT-style history');
  }

  /**
   * Get or create user's chat storage
   * @param {string} userId - User identifier
   * @returns {Map} User's chat map
   */
  _getUserChatStorage(userId) {
    if (!this.userChats.has(userId)) {
      this.userChats.set(userId, new Map());
      console.log(`👤 New user chat storage: ${userId}`);
    }
    return this.userChats.get(userId);
  }

  /**
   * Generate chat title from first message
   * @param {string} firstMessage - First user message
   * @returns {string} Generated title
   */
  _generateChatTitle(firstMessage) {
    if (!firstMessage) return 'New Chat';
    
    // Clean and truncate message for title
    const cleanMessage = firstMessage
      .replace(/[^\w\s]/g, '')
      .trim()
      .substring(0, 40);
    
    return cleanMessage || 'New Chat';
  }

  /**
   * Create a new chat for user
   * @param {string} userId - User identifier
   * @param {string} chatId - Chat identifier (optional)
   * @param {string} firstMessage - First message for title generation
   * @returns {Object} Created chat object
   */
  createChat(userId, chatId = null, firstMessage = '') {
    if (!userId) {
      throw new Error('userId is required');
    }

    const finalChatId = chatId || `chat_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`;
    const userChats = this._getUserChatStorage(userId);
    
    const newChat = {
      id: finalChatId,
      userId,
      title: this._generateChatTitle(firstMessage),
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      messageCount: 0
    };

    userChats.set(finalChatId, newChat);
    
    // Memory management: Remove oldest chat if exceeding limit
    if (userChats.size > this.maxChatsPerUser) {
      const oldestChat = Array.from(userChats.values())
        .sort((a, b) => a.createdAt - b.createdAt)[0];
      userChats.delete(oldestChat.id);
      console.log(`🗑️ Removed oldest chat for user ${userId}`);
    }

    console.log(`💬 New chat created: ${finalChatId} for user ${userId}`);
    return newChat;
  }

  /**
   * Add message to chat
   * @param {string} userId - User identifier
   * @param {string} chatId - Chat identifier
   * @param {string} role - 'user' or 'assistant'
   * @param {string} content - Message content
   * @param {Object} metadata - Additional metadata
   * @returns {Object} Added message
   */
  addMessage(userId, chatId, role, content, metadata = {}) {
    if (!userId || !chatId || !role || !content) {
      throw new Error('userId, chatId, role, and content are required');
    }

    const userChats = this._getUserChatStorage(userId);
    let chat = userChats.get(chatId);

    // Create chat if doesn't exist
    if (!chat) {
      chat = this.createChat(userId, chatId, role === 'user' ? content : '');
    }

    // Update title with first user message
    if (chat.messages.length === 0 && role === 'user') {
      chat.title = this._generateChatTitle(content);
    }

    // Create message object
    const message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      role,
      content,
      timestamp: new Date(),
      ...metadata
    };

    // Add message to chat
    chat.messages.push(message);
    chat.updatedAt = new Date();
    chat.messageCount = chat.messages.length;

    // Memory management: Trim old messages
    if (chat.messages.length > this.maxMessagesPerChat) {
      const removed = chat.messages.splice(0, chat.messages.length - this.maxMessagesPerChat);
      console.log(`🗑️ Trimmed ${removed.length} old messages from chat ${chatId}`);
    }

    console.log(`💾 Message added to chat ${chatId}: ${role} - ${content.substring(0, 30)}...`);
    return message;
  }

  /**
   * Get all chats for a user (for sidebar list)
   * @param {string} userId - User identifier
   * @returns {Array} Array of chat summaries
   */
  getUserChats(userId) {
    if (!userId) return [];

    const userChats = this._getUserChatStorage(userId);
    
    return Array.from(userChats.values())
      .map(chat => ({
        id: chat.id,
        title: chat.title,
        messageCount: chat.messageCount,
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt,
        lastMessage: chat.messages[chat.messages.length - 1]?.content?.substring(0, 50) || ''
      }))
      .sort((a, b) => b.updatedAt - a.updatedAt); // Most recent first
  }

  /**
   * Get full chat with all messages
   * @param {string} userId - User identifier
   * @param {string} chatId - Chat identifier
   * @returns {Object|null} Full chat object or null
   */
  getChat(userId, chatId) {
    if (!userId || !chatId) return null;

    const userChats = this.userChats.get(userId);
    if (!userChats) return null;

    return userChats.get(chatId) || null;
  }

  /**
   * Delete a chat
   * @param {string} userId - User identifier
   * @param {string} chatId - Chat identifier
   * @returns {boolean} Success
   */
  deleteChat(userId, chatId) {
    if (!userId || !chatId) return false;

    const userChats = this.userChats.get(userId);
    if (!userChats) return false;

    const deleted = userChats.delete(chatId);
    if (deleted) {
      console.log(`🗑️ Chat deleted: ${chatId} for user ${userId}`);
    }
    return deleted;
  }

  /**
   * Update chat title
   * @param {string} userId - User identifier
   * @param {string} chatId - Chat identifier
   * @param {string} newTitle - New title
   * @returns {boolean} Success
   */
  updateChatTitle(userId, chatId, newTitle) {
    const chat = this.getChat(userId, chatId);
    if (!chat) return false;

    chat.title = newTitle;
    chat.updatedAt = new Date();
    return true;
  }

  /**
   * Get chat statistics
   * @returns {Object} Statistics
   */
  getStats() {
    const totalUsers = this.userChats.size;
    let totalChats = 0;
    let totalMessages = 0;

    this.userChats.forEach(userChats => {
      totalChats += userChats.size;
      userChats.forEach(chat => {
        totalMessages += chat.messages.length;
      });
    });

    return {
      totalUsers,
      totalChats,
      totalMessages,
      averageChatsPerUser: totalUsers > 0 ? Math.round(totalChats / totalUsers) : 0,
      averageMessagesPerChat: totalChats > 0 ? Math.round(totalMessages / totalChats) : 0
    };
  }

  /**
   * Clear all data (for testing)
   */
  clearAll() {
    const stats = this.getStats();
    this.userChats.clear();
    console.log(`🗑️ All chat data cleared (${stats.totalChats} chats, ${stats.totalMessages} messages)`);
  }
}

// Export singleton instance
export const chatHistoryStore = new ChatHistoryStore();