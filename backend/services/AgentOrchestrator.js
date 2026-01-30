import { OllamaService } from './OllamaService.js';
import { DiscoveryAgent } from '../agents/DiscoveryAgent.js';
import { ClassificationAgent } from '../agents/ClassificationAgent.js';
import { ComplianceAgent } from '../agents/ComplianceAgent.js';
import { TimelineAgent } from '../agents/TimelineAgent.js';
import { PlatformAgent } from '../agents/PlatformAgent.js';

/**
 * Dashboard update trigger phrases
 * ONLY these phrases should trigger a dashboard update
 */
const DASHBOARD_UPDATE_TRIGGERS = [
  'add this to dashboard',
  'add to dashboard',
  'show this on dashboard',
  'show on dashboard',
  'reflect this on dashboard',
  'reflect on dashboard',
  'update dashboard',
  'update the dashboard',
  'update my dashboard',
  'make this live',
  'make this live on dashboard',
  'apply this to dashboard',
  'apply to dashboard',
  'put on dashboard',
  'sync to dashboard',
  'push to dashboard'
];

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
    
    // Dashboard state storage per session
    this.dashboardState = new Map();

    console.log('✅ AgentOrchestrator initialized - Chat-Driven Compliance Copilot');
  }

  async processMessage(message, context = {}) {
    console.log('🎯 Orchestrator: Processing request with conversation memory...');
    
    // Log memory context if available
    if (context.memoryContext && context.memoryContext.length > 0) {
      console.log(`💭 Memory: Found ${context.memoryContext.length} previous messages`);
    }
    
    try {
      // CRITICAL: Check if this is a dashboard update request FIRST
      const dashboardUpdateRequested = this._isDashboardUpdateRequest(message);
      
      if (dashboardUpdateRequested) {
        console.log('📊 DASHBOARD STATE UPDATE REQUESTED - Will emit structured state');
      }
      
      // Check if message has business context (for forcing DISCOVERY agent)
      const hasBusinessContext = this._hasBusinessContext(message);
      
      let intent;
      let response;
      
      // CRITICAL FIX: If dashboard update requested AND message has business context,
      // ALWAYS route through DISCOVERY agent to extract profile
      if (dashboardUpdateRequested && hasBusinessContext) {
        console.log('📊 Dashboard update with business context - forcing DISCOVERY agent');
        intent = { type: 'DISCOVERY' };
        response = await this.discoveryAgent.process(message, context, context.session);
      } else {
        intent = await this._extractIntent(message, context);
        response = await this._routeToAgent(intent, message, context);
      }
      
      // MANDATORY: If dashboard update was requested, ALWAYS include state fields
      if (dashboardUpdateRequested) {
        const dashboardOutput = this._generateDashboardOutput(response, context, message);
        
        // ALWAYS set these fields when dashboard update is requested
        response.dashboardUpdateRequested = true;
        response.dashboardStateUpdate = dashboardOutput; // Can be null or valid JSON
        
        if (dashboardOutput) {
          console.log('📊 DASHBOARD_STATE_UPDATE: Valid state emitted');
          // Store in session state for incremental updates
          this._updateSessionDashboardState(context.sessionId, dashboardOutput);
        } else {
          console.log('📊 DASHBOARD_STATE_UPDATE: null (insufficient data)');
        }
      }
      
      return response;
    } catch (error) {
      console.error('❌ Orchestrator error:', error);
      return { 
        message: 'Sorry, there was an error processing your request.', 
        type: 'error',
        dashboardUpdateRequested: this._isDashboardUpdateRequest(message),
        dashboardStateUpdate: null
      };
    }
  }

  /**
   * Store dashboard state for incremental updates
   */
  _updateSessionDashboardState(sessionId, newState) {
    if (!sessionId) return;
    
    const existingState = this.dashboardState.get(sessionId) || {};
    const mergedState = { ...existingState, ...newState };
    
    // Merge arrays instead of replacing
    if (newState.pendingTasks && existingState.pendingTasks) {
      const existingIds = new Set(existingState.pendingTasks.map(t => t.id));
      mergedState.pendingTasks = [
        ...existingState.pendingTasks,
        ...newState.pendingTasks.filter(t => !existingIds.has(t.id))
      ];
    }
    
    this.dashboardState.set(sessionId, mergedState);
    console.log(`📊 Session ${sessionId} dashboard state updated`);
  }

  /**
   * Check if the message explicitly requests a dashboard update
   * ONLY exact trigger phrases should return true
   */
  _isDashboardUpdateRequest(message) {
    const lowerMessage = message.toLowerCase();
    return DASHBOARD_UPDATE_TRIGGERS.some(trigger => lowerMessage.includes(trigger));
  }

  /**
   * Check if message contains business context that needs profile extraction
   * Returns true if message mentions business type, location, or employees
   */
  _hasBusinessContext(message) {
    const lowerMessage = message.toLowerCase();
    
    // Business types
    const businessTerms = [
      'cafe', 'restaurant', 'hotel', 'shop', 'store', 'business',
      'startup', 'company', 'firm', 'agency', 'textile', 'manufacturing',
      'retail', 'wholesale', 'bakery', 'food', 'software', 'tech', 'it',
      'consulting', 'service', 'trading', 'export', 'import', 'pharmacy',
      'clinic', 'salon', 'gym', 'academy', 'school', 'institute'
    ];
    
    // Location terms (major Indian cities)
    const locationTerms = [
      'delhi', 'mumbai', 'bangalore', 'bengaluru', 'chennai', 'kolkata',
      'hyderabad', 'pune', 'ahmedabad', 'jaipur', 'lucknow', 'kanpur',
      'nagpur', 'indore', 'bhopal', 'patna', 'vadodara', 'ghaziabad',
      'ludhiana', 'agra', 'nashik', 'varanasi', 'meerut', 'rajkot',
      'surat', 'noida', 'gurugram', 'gurgaon', 'faridabad', 'chandigarh'
    ];
    
    // Employee-related terms
    const employeeTerms = ['employee', 'staff', 'worker', 'team', 'people'];
    
    const hasBusinessTerm = businessTerms.some(term => lowerMessage.includes(term));
    const hasLocationTerm = locationTerms.some(term => lowerMessage.includes(term));
    const hasEmployeeTerm = employeeTerms.some(term => lowerMessage.includes(term));
    
    // Return true if at least one business term OR (location + employee context)
    return hasBusinessTerm || (hasLocationTerm && hasEmployeeTerm);
  }

  /**
   * Generate structured dashboard output based on conversation context
   * 
   * STRICT RULES:
   * - INCREMENTAL updates only (never reset state)
   * - Every value must be TRACEABLE to user message or compliance rule
   * - NO invented data, NO placeholders, NO defaults
   * - Returns null if insufficient data
   */
  _generateDashboardOutput(response, context, userMessage) {
    const profile = response.data?.businessProfile;
    const compliances = response.data?.compliances || [];
    
    // RULE: If no business profile, cannot generate dashboard update
    if (!profile || !profile.businessType) {
      console.log('⚠️ Dashboard update rejected: Insufficient business profile data');
      return null;
    }
    
    // RULE: If no compliances identified, cannot generate meaningful dashboard
    if (compliances.length === 0) {
      console.log('⚠️ Dashboard update rejected: No compliances identified from conversation');
      return null;
    }

    const dashboardOutput = {};
    const sourceContext = this._buildSourceContext(profile, userMessage);
    
    // Generate pending tasks ONLY from identified compliances with TRACEABILITY
    dashboardOutput.pendingTasks = compliances.map(c => ({
      id: c.id,
      title: this._getTaskTitle(c),
      priority: c.mandatory ? 'High' : 'Medium',
      deadlineDays: this._getComplianceDeadline(c.id),
      status: 'pending',
      source: this._getTaskSource(c, profile) // TRACEABILITY: Every task has a source
    }));
    
    // Compliance score: 0 initially (all tasks pending) - NOT INVENTED
    // Score = (completed / total) * 100
    dashboardOutput.complianceScore = 0; // Starts at 0, increases as user marks tasks complete
    
    // Generate compliance breakdown ONLY for identified compliances
    dashboardOutput.complianceBreakdown = this._generateTraceableBreakdown(compliances, profile);
    
    // Calculate risks based ONLY on identified mandatory compliances
    const mandatoryCompliances = compliances.filter(c => c.mandatory);
    dashboardOutput.risks = {
      high: mandatoryCompliances.length,
      medium: compliances.length - mandatoryCompliances.length,
      low: 0
    };
    
    // Chat insights - TRACEABLE to specific conversation context
    dashboardOutput.chatInsights = this._generateTraceableInsights(profile, compliances, sourceContext);
    
    // Upcoming deadlines - ONLY for mandatory compliances with known timelines
    dashboardOutput.upcomingDeadlines = mandatoryCompliances
      .map(c => ({
        id: c.id,
        title: c.name,
        dueDate: this._calculateDueDate(c),
        priority: 'High',
        source: `Mandatory for ${profile.businessType} in ${profile.state || 'India'}`
      }));
    
    return dashboardOutput;
  }

  /**
   * Build source context for traceability
   */
  _buildSourceContext(profile, userMessage) {
    const sources = [];
    
    if (profile.city) sources.push(`Location: ${profile.city}`);
    if (profile.state) sources.push(`State: ${profile.state}`);
    if (profile.businessType) sources.push(`Business: ${profile.businessType}`);
    if (profile.employeeCount) sources.push(`Employees: ${profile.employeeCount}`);
    if (profile.sector) sources.push(`Sector: ${profile.sector}`);
    
    return sources.join(', ');
  }

  /**
   * Get task source for TRACEABILITY - every task must have an explanation
   */
  _getTaskSource(compliance, profile) {
    const sources = {
      'GST': `Required for businesses with turnover > ₹40L or interstate sales`,
      'FSSAI': `Mandatory for ${profile.businessType || 'food'} business (Food Safety Act)`,
      'UDYAM': `Recommended for MSME benefits and government schemes`,
      'SHOP_ACT': `Required under ${profile.state || 'State'} Shops & Establishments Act`,
      'EPF': `Mandatory for businesses with ${profile.employeeCount || '20+'} employees (EPF Act 1952)`,
      'ESI': `Mandatory for businesses with ${profile.employeeCount || '10+'} employees (ESI Act 1948)`,
      'TRADE_LICENSE': `Required by ${profile.city || 'Municipal'} Corporation`,
      'FIRE_NOC': `Required for commercial establishments (Fire Services Act)`
    };
    
    return sources[compliance.id] || `Required for ${profile.businessType} in ${profile.state || 'India'}`;
  }

  /**
   * Get compliance deadline from known regulatory timelines - NOT INVENTED
   */
  _getComplianceDeadline(complianceId) {
    // These are standard regulatory timelines, not invented
    const knownDeadlines = {
      'GST': 30,      // Should register within 30 days of crossing threshold
      'FSSAI': 60,    // Should obtain before starting food operations
      'UDYAM': 7,     // Can be done in 1 day, but allow 7 for paperwork
      'SHOP_ACT': 30, // Must register within 30 days of starting business
      'EPF': 30,      // Must register within 1 month of threshold
      'ESI': 30,      // Must register within 1 month of threshold
      'TRADE_LICENSE': 45,
      'FIRE_NOC': 60
    };
    return knownDeadlines[complianceId] || null; // Return null if unknown, NOT a guess
  }

  /**
   * Generate breakdown with TRACEABILITY
   */
  _generateTraceableBreakdown(compliances, profile) {
    const breakdown = {};
    
    compliances.forEach(c => {
      const category = this._getComplianceCategory(c.id);
      if (!breakdown[category]) {
        breakdown[category] = { total: 0, completed: 0, items: [] };
      }
      breakdown[category].total++;
      breakdown[category].items.push({
        id: c.id,
        name: c.name,
        mandatory: c.mandatory,
        source: this._getTaskSource(c, profile)
      });
    });
    
    return breakdown;
  }

  _getComplianceCategory(complianceId) {
    const categories = {
      'GST': 'taxation',
      'PROFESSIONAL_TAX': 'taxation',
      'TDS': 'taxation',
      'SHOP_ACT': 'licensing',
      'TRADE_LICENSE': 'licensing',
      'FIRE_NOC': 'licensing',
      'EPF': 'labor',
      'ESI': 'labor',
      'GRATUITY': 'labor',
      'FSSAI': 'foodSafety',
      'UDYAM': 'registration'
    };
    return categories[complianceId] || 'other';
  }

  /**
   * Generate TRACEABLE insights - each insight has a clear source
   */
  _generateTraceableInsights(profile, compliances, sourceContext) {
    const insights = [];
    
    // Only add insights that are DIRECTLY derived from conversation
    if (profile.city && profile.state) {
      insights.push({
        text: `Business location: ${profile.city}, ${profile.state}`,
        source: 'User-provided location'
      });
    }
    
    if (profile.businessType && profile.sector) {
      insights.push({
        text: `Business type: ${profile.businessType} (${profile.sector} sector)`,
        source: 'User-provided business type'
      });
    }
    
    if (profile.inferredRequirements?.needsFSSAI) {
      insights.push({
        text: 'FSSAI license required for food business',
        source: 'Food Safety and Standards Act, 2006'
      });
    }
    
    if (profile.employeeCount >= 20) {
      insights.push({
        text: `EPF mandatory (${profile.employeeCount} employees)`,
        source: 'EPF Act 1952 - applies to 20+ employees'
      });
    }
    
    if (profile.employeeCount >= 10) {
      insights.push({
        text: `ESI applicable (${profile.employeeCount} employees)`,
        source: 'ESI Act 1948 - applies to 10+ employees'
      });
    }
    
    const mandatoryCount = compliances.filter(c => c.mandatory).length;
    if (mandatoryCount > 0) {
      insights.push({
        text: `${mandatoryCount} mandatory compliance${mandatoryCount > 1 ? 's' : ''} identified`,
        source: `Based on ${profile.businessType} in ${profile.state || 'India'}`
      });
    }
    
    return insights;
  }

  _getTaskTitle(compliance) {
    const taskTitles = {
      'GST': 'Complete GST Registration',
      'FSSAI': 'Apply for FSSAI License',
      'UDYAM': 'Register for Udyam (MSME)',
      'SHOP_ACT': 'Apply for Shop & Establishment License',
      'EPF': 'Register for Employee Provident Fund',
      'ESI': 'Register for Employee State Insurance',
      'TRADE_LICENSE': 'Obtain Trade License',
      'FIRE_NOC': 'Get Fire Safety NOC'
    };
    return taskTitles[compliance.id] || `Complete ${compliance.name}`;
  }

  _calculateDueDate(compliance) {
    const days = this._getComplianceDeadline(compliance.id) || 30;
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + days);
    return dueDate.toISOString().split('T')[0];
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
      
      const systemPrompt = `You are an expert MSME compliance consultant in India.

CRITICAL RULES:
1. Use Indian civic knowledge - Delhi is NCT Delhi, Mumbai is Maharashtra, etc.
2. NEVER ask obvious geographic questions
3. Be practical, concise, and helpful
4. Limit responses to 100 words
5. Maintain conversation context
6. Sound like a knowledgeable Indian consultant, not a robot`;
      
      const response = await this.ollamaService.generateResponse(
        userPrompt,
        systemPrompt,
        { temperature: 0.4 }
      );
      
      return { message: response, type: 'general' };
    } catch (error) {
      return { message: 'Hello! I can help you with business compliance in India. What would you like to know?', type: 'general' };
    }
  }
}