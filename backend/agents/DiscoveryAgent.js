import { INDIAN_STATES_DATA } from '../data/states.js';
import { COMPLIANCE_DATABASE } from '../data/compliances.js';

/**
 * Discovery Agent - Handles initial business discovery using Ollama LLM
 * Uses real datasets to provide contextual responses
 */
export class DiscoveryAgent {
  constructor(ollamaService, complianceService) {
    this.ollamaService = ollamaService;
    this.complianceService = complianceService;
    this.name = 'DiscoveryAgent';
  }

  async process(message, context, session) {
    console.log('🔍 DiscoveryAgent: Processing message');
    
    const businessProfile = (session || {}).businessProfile || {};
    
    // Create context from datasets
    const statesInfo = INDIAN_STATES_DATA.states.map(state => 
      `${state.name} (${state.id}): Capital ${state.capital}, Business types: ${state.businessTypes.join(', ')}`
    ).slice(0, 10).join('\n');

    const complianceTypes = Object.keys(COMPLIANCE_DATABASE.central).join(', ');
    
    const systemPrompt = `You are a business discovery agent for Indian MSME compliance. Be concise and focused.

Available States: ${statesInfo}

Current Profile: ${JSON.stringify(businessProfile, null, 2)}

Guidelines:
- Ask ONE question at a time
- Be brief and direct
- Use bullet points for options
- Keep responses under 100 words
- Focus on missing information only`;

    // Build enhanced prompt with conversation context
    let userPrompt = `User said: "${message}"`;
    
    // Add conversation context for continuity (NEW MEMORY FEATURE)
    if (context.conversationContext && context.conversationContext !== 'This is the start of a new conversation.') {
      userPrompt = `${context.conversationContext}\n\nUser said: "${message}"`;
    }

    userPrompt += `

What specific information do you need next? Ask ONE focused question about:
1. Business type (if missing)
2. Location/state (if missing) 
3. Scale/size (if missing)
4. Investment amount (if missing)
5. Timeline (if missing)

If all info provided, say "Profile complete" and suggest next steps.`;

    try {
      const response = await this.ollamaService.generateResponse(
        userPrompt,
        systemPrompt,
        { temperature: 0.3 }
      );

      // Update business profile based on user input
      this.updateBusinessProfile(message, businessProfile);

      return {
        message: response,
        type: 'discovery',
        agent: this.name,
        data: {
          businessProfile,
          step: this.determineNextStep(businessProfile),
          // NEW: Memory context indicators
          memoryEnabled: true,
          conversationLength: context.memoryContext?.length || 0,
          hasConversationHistory: !!(context.conversationContext && context.conversationContext !== 'This is the start of a new conversation.')
        }
      };

    } catch (error) {
      console.error('❌ DiscoveryAgent Ollama error:', error);
      return this.getFallbackResponse(message, businessProfile);
    }
  }

  updateBusinessProfile(message, businessProfile) {
    const lowerMessage = message.toLowerCase();
    
    // Extract business type
    const businessTypes = ['cafe', 'restaurant', 'retail', 'manufacturing', 'textile', 'garment', 'food', 'shop', 'store', 'factory'];
    for (const type of businessTypes) {
      if (lowerMessage.includes(type)) {
        businessProfile.businessType = type;
        businessProfile.rawBusinessType = message;
        break;
      }
    }

    // Extract location from states data
    for (const state of INDIAN_STATES_DATA.states) {
      if (lowerMessage.includes(state.name.toLowerCase()) || lowerMessage.includes(state.capital.toLowerCase())) {
        businessProfile.state = state.name;
        businessProfile.location = state.capital;
        break;
      }
    }

    // Extract scale indicators
    const scaleIndicators = {
      'small': ['small', 'tiny', 'local', '10-20', '1-10'],
      'medium': ['medium', 'moderate', '20-50', '10-50'],
      'large': ['large', 'big', '50+', 'major', '100+']
    };
    
    for (const [scale, indicators] of Object.entries(scaleIndicators)) {
      if (indicators.some(indicator => lowerMessage.includes(indicator))) {
        businessProfile.scale = scale;
        break;
      }
    }

    // Extract investment/budget
    const budgetMatch = message.match(/(\d+)\s*(lakh|lakhs|crore|crores|thousand|k)/i);
    if (budgetMatch) {
      businessProfile.investment = budgetMatch[0];
    }

    // Extract timeline
    const timelineIndicators = {
      'immediate': ['now', 'immediately', 'asap', 'soon'],
      '1-3 months': ['1 month', '2 month', '3 month', 'few months'],
      '3-6 months': ['4 month', '5 month', '6 month', 'half year'],
      '6+ months': ['year', 'long term', 'planning']
    };
    
    for (const [timeline, indicators] of Object.entries(timelineIndicators)) {
      if (indicators.some(indicator => lowerMessage.includes(indicator))) {
        businessProfile.timeline = timeline;
        break;
      }
    }
  }

  determineNextStep(businessProfile) {
    if (!businessProfile.businessType) return 'businessType';
    if (!businessProfile.location) return 'location';
    if (!businessProfile.scale) return 'scale';
    if (!businessProfile.investment) return 'investment';
    if (!businessProfile.timeline) return 'timeline';
    return 'complete';
  }

  getFallbackResponse(message, businessProfile) {
    return {
      message: `I understand you're interested in starting a business! Let me help you with the discovery process.

🎯 **What type of business are you planning?**

**Popular options:**
• Café/Restaurant
• Retail Store
• Manufacturing
• Textile/Garment
• Online Business

Please tell me what interests you most!`,
      type: 'discovery',
      agent: this.name,
      data: {
        businessProfile,
        step: 'businessType'
      }
    };
  }
}