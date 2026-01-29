import { OllamaService } from './OllamaService.js';
import { DiscoveryAgent } from '../agents/DiscoveryAgent.js';
import { ClassificationAgent } from '../agents/ClassificationAgent.js';
import { ComplianceAgent } from '../agents/ComplianceAgent.js';
import { TimelineAgent } from '../agents/TimelineAgent.js';
import { PlatformAgent } from '../agents/PlatformAgent.js';

export class AgentOrchestrator {
  constructor(ruleEngine, complianceService) {
    this.ruleEngine = ruleEngine;
    this.complianceService = complianceService;
    this.ollamaService = new OllamaService();
    
    this.discoveryAgent = new DiscoveryAgent(this.ollamaService, complianceService);
    this.classificationAgent = new ClassificationAgent();
    this.complianceAgent = new ComplianceAgent(this.ollamaService);
    this.timelineAgent = new TimelineAgent(this.ollamaService, complianceService);
    this.platformAgent = new PlatformAgent(this.ollamaService, complianceService);

    console.log('✅ AgentOrchestrator initialized - Clean Architecture');
  }

  async processMessage(message, context = {}) {
    console.log('🎯 Orchestrator: Processing request with conversation memory...');
    
    // Log memory context if available
    if (context.memoryContext && context.memoryContext.length > 0) {
      console.log(`💭 Memory: Found ${context.memoryContext.length} previous messages`);
    }
    
    try {
      const intent = await this._extractIntent(message, context);
      return await this._routeToAgent(intent, message, context);
    } catch (error) {
      console.error('❌ Orchestrator error:', error);
      return { message: 'Sorry, there was an error processing your request.', type: 'error' };
    }
  }

  async _extractIntent(message, context) {
    try {
      // Enhanced intent extraction with conversation context
      const systemPrompt = 'Extract intent: DISCOVERY, COMPLIANCE, TIMELINE, PLATFORM, or GENERAL. Return only the intent type.';
      let userPrompt = `Message: "${message}".`;
      
      // Add conversation context if available
      if (context.conversationContext && context.conversationContext !== 'This is the start of a new conversation.') {
        userPrompt = `${context.conversationContext}\n\nCurrent message: "${message}".`;
      }
      
      // Add user intent context if provided from frontend
      if (context.userIntent) {
        userPrompt += ` User's declared intent: ${context.userIntent}.`;
      }
      
      userPrompt += ` Intent:`;
      
      const response = await this.ollamaService.generateResponse(userPrompt, systemPrompt, { temperature: 0.2 });
      const intentType = response.trim().toUpperCase();
      const validIntents = ['DISCOVERY', 'COMPLIANCE', 'TIMELINE', 'PLATFORM', 'GENERAL'];
      
      return { type: validIntents.includes(intentType) ? intentType : 'GENERAL' };
    } catch (error) {
      return this._fallbackIntent(message);
    }
  }

  _fallbackIntent(message) {
    const lowerMsg = message.toLowerCase();
    if (lowerMsg.match(/\b(start|business|cafe|restaurant|textile)\b/)) return { type: 'DISCOVERY' };
    if (lowerMsg.match(/\b(compliance|license|gst|fssai)\b/)) return { type: 'COMPLIANCE' };
    if (lowerMsg.match(/\b(timeline|duration|steps)\b/)) return { type: 'TIMELINE' };
    if (lowerMsg.match(/\b(swiggy|zomato|amazon|platform)\b/)) return { type: 'PLATFORM' };
    return { type: 'GENERAL' };
  }

  async _routeToAgent(intent, message, context) {
    console.log(`🤖 Routing to ${intent.type} agent`);

    switch (intent.type) {
      case 'DISCOVERY':
        return await this.discoveryAgent.process(message, context, context.session);
      case 'COMPLIANCE':
        return await this._handleCompliance(message, context);
      case 'TIMELINE':
        return await this.timelineAgent.process(message, context, context.session);
      case 'PLATFORM':
        return await this.platformAgent.process(message, context, context.session);
      default:
        return await this._handleGeneral(message, context);
    }
  }

  async _handleCompliance(message, context) {
    const businessProfile = context.session?.businessProfile;
    
    if (!businessProfile?.businessType) {
      return {
        message: 'I need your business details first. What type of business are you starting?',
        type: 'redirect'
      };
    }

    const classification = this.classificationAgent.classify(businessProfile);
    const complianceContext = { ...context, classification: classification.classification };
    
    return await this.complianceAgent.process(message, complianceContext, context.session);
  }

  async _handleGeneral(message, context) {
    try {
      // Build enhanced prompt with conversation context
      let userPrompt = `User: "${message}". Provide helpful response for business compliance assistant:`;
      
      // Add conversation context for better continuity
      if (context.conversationContext && context.conversationContext !== 'This is the start of a new conversation.') {
        userPrompt = `${context.conversationContext}\n\nUser: "${message}". Continue the conversation naturally and provide helpful business compliance guidance:`;
      }
      
      const response = await this.ollamaService.generateResponse(
        userPrompt,
        'You help with Indian business compliance. Be brief, accurate, and encouraging. Limit responses to 50 words. Maintain conversation context.',
        { temperature: 0.3 }
      );
      
      return { message: response, type: 'general' };
    } catch (error) {
      return { message: 'Hello! I can help you with business compliance in India. What would you like to know?', type: 'general' };
    }
  }
}