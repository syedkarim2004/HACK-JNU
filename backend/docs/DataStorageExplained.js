/**
 * CHATBOT DATA STORAGE OVERVIEW
 * 
 * This document explains where and how the chatbot saves data in your system.
 */

// ==========================
// 🗄️ DATA STORAGE LOCATIONS
// ==========================

const dataStorageOverview = {
  
  // 1. CONVERSATION MEMORY (Primary Chat Storage)
  chatMemoryStore: {
    location: "/backend/services/ChatMemoryStore.js",
    storageType: "In-Memory Map",
    dataStructure: "this.conversations = new Map()",
    purpose: "Stores chat messages for conversation continuity",
    persistence: "Lost when server restarts",
    
    dataExample: {
      "chat_123": {
        chatId: "chat_123",
        messages: [
          { 
            id: "msg_123", 
            role: "user", 
            content: "I want to start a restaurant", 
            timestamp: "2026-01-29T10:00:00Z" 
          },
          { 
            id: "msg_124", 
            role: "assistant", 
            content: "Great! What type of cuisine?", 
            timestamp: "2026-01-29T10:00:05Z" 
          }
        ],
        createdAt: "2026-01-29T10:00:00Z",
        lastActivity: "2026-01-29T10:00:05Z",
        metadata: {
          userIntent: "NEW_BUSINESS",
          sessionId: "session_456"
        }
      }
    }
  },

  // 2. USER SESSIONS (Business Profiles)
  chatbotService: {
    location: "/backend/services/ChatbotService.js", 
    storageType: "In-Memory Map",
    dataStructure: "this.sessions = new Map()",
    purpose: "Stores user business profiles and session state",
    persistence: "Lost when server restarts",
    
    dataExample: {
      "session_456": {
        id: "session_456",
        businessProfile: {
          businessName: "Kumar Restaurant",
          businessType: "Restaurant", 
          industry: "Food Service",
          location: "Mumbai",
          scale: "Small"
        },
        messages: [], // Legacy storage
        currentPhase: "discovery",
        lastActivity: "2026-01-29T10:00:00Z",
        createdAt: "2026-01-29T10:00:00Z"
      }
    }
  },

  // 3. SESSION MANAGER (Additional Session Tracking)
  chatSessionManager: {
    location: "/backend/services/ChatSessionManager.js",
    storageType: "In-Memory Map", 
    dataStructure: "this.sessions = new Map()",
    purpose: "Tracks session metadata and activity",
    persistence: "Lost when server restarts",
    
    dataExample: {
      "session_456": {
        sessionId: "session_456",
        createdAt: "2026-01-29T10:00:00Z",
        lastMessage: "I want to start a restaurant",
        lastResponse: "Great! What type of cuisine?",
        messageCount: 2
      }
    }
  }
};

// ==========================
// 📍 WHERE DATA IS SAVED
// ==========================

const dataSavingFlow = {
  
  step1_userSendsMessage: {
    endpoint: "POST /api/chat/message",
    file: "/backend/routes/chat.js",
    action: "chatMemoryStore.addMessage(chatId, 'user', message)"
  },
  
  step2_processMessage: {
    file: "/backend/services/ChatbotService.js", 
    action: "session.messages.push({ role: 'user', content: message })"
  },
  
  step3_aiResponse: {
    action: "AI generates response using Ollama"
  },
  
  step4_saveResponse: {
    file: "/backend/routes/chat.js",
    action: "chatMemoryStore.addMessage(chatId, 'assistant', response)"
  },
  
  step5_updateSession: {
    file: "/backend/services/ChatSessionManager.js",
    action: "sessionManager.updateSession(sessionId, message, response)"
  }
};

// ==========================
// 🔍 HOW TO VIEW SAVED DATA  
// ==========================

const viewDataCommands = {
  
  // View conversation memory
  conversationHistory: "GET /api/chat/conversation/:chatId",
  
  // View session data  
  sessionData: "GET /api/chat/session/:sessionId",
  
  // View memory statistics
  memoryStats: "GET /api/chat/stats",
  
  // View chat history (legacy)
  chatHistory: "GET /api/chat/history/:sessionId"
};

// ==========================
// 💾 DATA PERSISTENCE LEVELS
// ==========================

const persistenceLevels = {
  
  // CURRENT: In-Memory Storage
  current: {
    type: "RAM-based Maps",
    persistence: "Session-only (lost on restart)",
    performance: "Very fast",
    scalability: "Limited by server memory",
    backupability: "None"
  },
  
  // FUTURE: File-based Storage  
  fileUpgrade: {
    type: "JSON files",
    persistence: "Survives restarts",
    performance: "Fast",
    scalability: "Good",
    implementation: "Save/load conversations to/from JSON files"
  },
  
  // ENTERPRISE: Database Storage
  databaseUpgrade: {
    type: "MongoDB/PostgreSQL", 
    persistence: "Permanent",
    performance: "Good", 
    scalability: "Excellent",
    features: "Indexing, querying, clustering"
  }
};

// ==========================
// 🛠️ DEBUGGING DATA STORAGE
// ==========================

const debuggingCommands = {
  
  // Check if backend is saving data
  testMemory: `
    curl -X POST http://localhost:3001/api/chat/test-memory \\
      -H "Content-Type: application/json" \\
      -d '{"chatId": "debug-test"}'
  `,
  
  // Send a message and see if it's stored
  sendMessage: `
    curl -X POST http://localhost:3001/api/chat/message \\
      -H "Content-Type: application/json" \\
      -d '{
        "chatId": "debug-test",
        "message": "Hello, testing storage",
        "userIntent": "NEW_BUSINESS"
      }'
  `,
  
  // View stored conversation
  viewStored: `
    curl http://localhost:3001/api/chat/conversation/debug-test
  `,
  
  // Check memory usage
  memoryStats: `
    curl http://localhost:3001/api/chat/stats
  `
};

// ==========================
// 📁 ACTUAL FILE LOCATIONS
// ==========================

const fileLocations = {
  primaryMemory: "/Users/abdulkarim/HACK-JNU/backend/services/ChatMemoryStore.js",
  sessionStorage: "/Users/abdulkarim/HACK-JNU/backend/services/ChatbotService.js", 
  sessionManager: "/Users/abdulkarim/HACK-JNU/backend/services/ChatSessionManager.js",
  chatRoutes: "/Users/abdulkarim/HACK-JNU/backend/routes/chat.js",
  
  // Where data would be saved if using files:
  potentialFileStorage: "/Users/abdulkarim/HACK-JNU/backend/data/conversations/",
  potentialBackup: "/Users/abdulkarim/HACK-JNU/backend/backup/chat-history.json"
};

export {
  dataStorageOverview,
  dataSavingFlow, 
  viewDataCommands,
  persistenceLevels,
  debuggingCommands,
  fileLocations
};