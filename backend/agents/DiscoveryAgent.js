import { INDIAN_STATES_DATA } from '../data/states.js';
import { COMPLIANCE_DATABASE } from '../data/compliances.js';

/**
 * CITY TO STATE MAPPING - Common Indian civic knowledge
 * The agent should NEVER ask "which state is X in?" for these cities
 */
const CITY_STATE_MAP = {
  // Major metros
  'mumbai': { state: 'Maharashtra', stateId: 'MH', type: 'state' },
  'delhi': { state: 'NCT of Delhi', stateId: 'DL', type: 'union_territory' },
  'new delhi': { state: 'NCT of Delhi', stateId: 'DL', type: 'union_territory' },
  'bengaluru': { state: 'Karnataka', stateId: 'KA', type: 'state' },
  'bangalore': { state: 'Karnataka', stateId: 'KA', type: 'state' },
  'chennai': { state: 'Tamil Nadu', stateId: 'TN', type: 'state' },
  'kolkata': { state: 'West Bengal', stateId: 'WB', type: 'state' },
  'hyderabad': { state: 'Telangana', stateId: 'TG', type: 'state' },
  
  // Tier 1 cities
  'pune': { state: 'Maharashtra', stateId: 'MH', type: 'state' },
  'ahmedabad': { state: 'Gujarat', stateId: 'GJ', type: 'state' },
  'jaipur': { state: 'Rajasthan', stateId: 'RJ', type: 'state' },
  'lucknow': { state: 'Uttar Pradesh', stateId: 'UP', type: 'state' },
  'kanpur': { state: 'Uttar Pradesh', stateId: 'UP', type: 'state' },
  'nagpur': { state: 'Maharashtra', stateId: 'MH', type: 'state' },
  'indore': { state: 'Madhya Pradesh', stateId: 'MP', type: 'state' },
  'bhopal': { state: 'Madhya Pradesh', stateId: 'MP', type: 'state' },
  'visakhapatnam': { state: 'Andhra Pradesh', stateId: 'AP', type: 'state' },
  'patna': { state: 'Bihar', stateId: 'BR', type: 'state' },
  'vadodara': { state: 'Gujarat', stateId: 'GJ', type: 'state' },
  'surat': { state: 'Gujarat', stateId: 'GJ', type: 'state' },
  'ludhiana': { state: 'Punjab', stateId: 'PB', type: 'state' },
  'agra': { state: 'Uttar Pradesh', stateId: 'UP', type: 'state' },
  'nashik': { state: 'Maharashtra', stateId: 'MH', type: 'state' },
  'varanasi': { state: 'Uttar Pradesh', stateId: 'UP', type: 'state' },
  'chandigarh': { state: 'Chandigarh', stateId: 'CH', type: 'union_territory' },
  'gurgaon': { state: 'Haryana', stateId: 'HR', type: 'state' },
  'gurugram': { state: 'Haryana', stateId: 'HR', type: 'state' },
  'noida': { state: 'Uttar Pradesh', stateId: 'UP', type: 'state' },
  'ghaziabad': { state: 'Uttar Pradesh', stateId: 'UP', type: 'state' },
  'faridabad': { state: 'Haryana', stateId: 'HR', type: 'state' },
  'coimbatore': { state: 'Tamil Nadu', stateId: 'TN', type: 'state' },
  'kochi': { state: 'Kerala', stateId: 'KL', type: 'state' },
  'cochin': { state: 'Kerala', stateId: 'KL', type: 'state' },
  'trivandrum': { state: 'Kerala', stateId: 'KL', type: 'state' },
  'thiruvananthapuram': { state: 'Kerala', stateId: 'KL', type: 'state' },
  'mysore': { state: 'Karnataka', stateId: 'KA', type: 'state' },
  'mysuru': { state: 'Karnataka', stateId: 'KA', type: 'state' },
  'mangalore': { state: 'Karnataka', stateId: 'KA', type: 'state' },
  'mangaluru': { state: 'Karnataka', stateId: 'KA', type: 'state' },
  'goa': { state: 'Goa', stateId: 'GA', type: 'state' },
  'panaji': { state: 'Goa', stateId: 'GA', type: 'state' },
  'shimla': { state: 'Himachal Pradesh', stateId: 'HP', type: 'state' },
  'dehradun': { state: 'Uttarakhand', stateId: 'UK', type: 'state' },
  'ranchi': { state: 'Jharkhand', stateId: 'JH', type: 'state' },
  'bhubaneswar': { state: 'Odisha', stateId: 'OR', type: 'state' },
  'raipur': { state: 'Chhattisgarh', stateId: 'CT', type: 'state' },
  'guwahati': { state: 'Assam', stateId: 'AS', type: 'state' },
  'imphal': { state: 'Manipur', stateId: 'MN', type: 'state' },
  'shillong': { state: 'Meghalaya', stateId: 'ML', type: 'state' },
  'gangtok': { state: 'Sikkim', stateId: 'SK', type: 'state' },
  'pondicherry': { state: 'Puducherry', stateId: 'PY', type: 'union_territory' },
  'puducherry': { state: 'Puducherry', stateId: 'PY', type: 'union_territory' },
  'jammu': { state: 'Jammu and Kashmir', stateId: 'JK', type: 'union_territory' },
  'srinagar': { state: 'Jammu and Kashmir', stateId: 'JK', type: 'union_territory' },
  'amritsar': { state: 'Punjab', stateId: 'PB', type: 'state' },
  'jodhpur': { state: 'Rajasthan', stateId: 'RJ', type: 'state' },
  'udaipur': { state: 'Rajasthan', stateId: 'RJ', type: 'state' },
  'thane': { state: 'Maharashtra', stateId: 'MH', type: 'state' },
  'navi mumbai': { state: 'Maharashtra', stateId: 'MH', type: 'state' },
};

/**
 * BUSINESS TYPE INFERENCE - Common Indian business terminology
 */
const BUSINESS_TYPE_INFERENCE = {
  // Food & Beverage
  'cafe': { sector: 'food_beverage', type: 'cafe', needsFSSAI: true },
  'coffee shop': { sector: 'food_beverage', type: 'cafe', needsFSSAI: true },
  'restaurant': { sector: 'food_beverage', type: 'restaurant', needsFSSAI: true },
  'dhaba': { sector: 'food_beverage', type: 'restaurant', needsFSSAI: true },
  'food stall': { sector: 'food_beverage', type: 'food_stall', needsFSSAI: true },
  'tiffin service': { sector: 'food_beverage', type: 'catering', needsFSSAI: true },
  'catering': { sector: 'food_beverage', type: 'catering', needsFSSAI: true },
  'bakery': { sector: 'food_beverage', type: 'bakery', needsFSSAI: true },
  'sweet shop': { sector: 'food_beverage', type: 'bakery', needsFSSAI: true },
  'cloud kitchen': { sector: 'food_beverage', type: 'cloud_kitchen', needsFSSAI: true },
  'bar': { sector: 'food_beverage', type: 'bar', needsFSSAI: true, needsLiquorLicense: true },
  'pub': { sector: 'food_beverage', type: 'bar', needsFSSAI: true, needsLiquorLicense: true },
  
  // Retail
  'retail': { sector: 'retail', type: 'retail_store', needsShopAct: true },
  'shop': { sector: 'retail', type: 'retail_store', needsShopAct: true },
  'store': { sector: 'retail', type: 'retail_store', needsShopAct: true },
  'kirana': { sector: 'retail', type: 'grocery', needsShopAct: true },
  'grocery': { sector: 'retail', type: 'grocery', needsShopAct: true },
  'supermarket': { sector: 'retail', type: 'supermarket', needsShopAct: true },
  'medical store': { sector: 'retail', type: 'pharmacy', needsDrugLicense: true },
  'pharmacy': { sector: 'retail', type: 'pharmacy', needsDrugLicense: true },
  'chemist': { sector: 'retail', type: 'pharmacy', needsDrugLicense: true },
  
  // Manufacturing
  'manufacturing': { sector: 'manufacturing', type: 'manufacturing', needsFactoryLicense: true },
  'factory': { sector: 'manufacturing', type: 'factory', needsFactoryLicense: true },
  'textile': { sector: 'manufacturing', type: 'textile', needsFactoryLicense: true },
  'garment': { sector: 'manufacturing', type: 'garment', needsFactoryLicense: true },
  
  // Services
  'salon': { sector: 'services', type: 'salon', needsShopAct: true },
  'parlour': { sector: 'services', type: 'salon', needsShopAct: true },
  'gym': { sector: 'services', type: 'gym', needsShopAct: true },
  'fitness': { sector: 'services', type: 'gym', needsShopAct: true },
  'clinic': { sector: 'healthcare', type: 'clinic', needsClinicalEstablishment: true },
  'hospital': { sector: 'healthcare', type: 'hospital', needsClinicalEstablishment: true },
  
  // IT/Tech
  'it company': { sector: 'it_services', type: 'it_company', needsShopAct: true },
  'software': { sector: 'it_services', type: 'it_company', needsShopAct: true },
  'startup': { sector: 'it_services', type: 'startup', needsShopAct: true },
  'tech': { sector: 'it_services', type: 'tech_company', needsShopAct: true },
  
  // E-commerce
  'ecommerce': { sector: 'ecommerce', type: 'ecommerce', needsGST: true },
  'online store': { sector: 'ecommerce', type: 'ecommerce', needsGST: true },
  'online business': { sector: 'ecommerce', type: 'ecommerce', needsGST: true },
};

/**
 * Discovery Agent - Handles initial business discovery using Ollama LLM
 * Uses real datasets and INDIAN CIVIC KNOWLEDGE to provide contextual responses
 * 
 * CRITICAL: Never ask questions whose answers are common knowledge
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
    
    // FIRST: Extract all inferable information from the message
    this.extractAndInferInfo(message, businessProfile);
    
    // Determine what's genuinely missing
    const missingInfo = this.getGenuinelyMissingInfo(businessProfile);
    
    console.log('📊 Business Profile:', JSON.stringify(businessProfile, null, 2));
    console.log('❓ Genuinely missing:', missingInfo);

    // If we have enough info, provide compliance guidance directly
    if (missingInfo.length === 0 || (businessProfile.businessType && businessProfile.city)) {
      return await this.provideComplianceGuidance(businessProfile, context);
    }

    // Only ask about genuinely missing critical info
    return await this.askOnlyNecessaryQuestion(message, businessProfile, missingInfo, context);
  }

  /**
   * Extract and INFER information using Indian civic knowledge
   * NEVER ask for information that can be inferred
   */
  extractAndInferInfo(message, businessProfile) {
    const lowerMessage = message.toLowerCase();
    
    // 1. Extract city and AUTO-INFER state
    for (const [city, info] of Object.entries(CITY_STATE_MAP)) {
      if (lowerMessage.includes(city)) {
        businessProfile.city = city.charAt(0).toUpperCase() + city.slice(1);
        businessProfile.state = info.state;
        businessProfile.stateId = info.stateId;
        businessProfile.locationType = info.type;
        console.log(`📍 Auto-inferred: ${businessProfile.city} → ${businessProfile.state}`);
        break;
      }
    }
    
    // Also check state names directly
    for (const state of INDIAN_STATES_DATA.states || []) {
      if (lowerMessage.includes(state.name.toLowerCase())) {
        businessProfile.state = state.name;
        businessProfile.stateId = state.id;
        break;
      }
    }
    
    // 2. Extract business type and INFER sector + requirements
    for (const [keyword, info] of Object.entries(BUSINESS_TYPE_INFERENCE)) {
      if (lowerMessage.includes(keyword)) {
        businessProfile.businessType = info.type;
        businessProfile.sector = info.sector;
        businessProfile.inferredRequirements = {
          needsFSSAI: info.needsFSSAI || false,
          needsShopAct: info.needsShopAct || false,
          needsFactoryLicense: info.needsFactoryLicense || false,
          needsLiquorLicense: info.needsLiquorLicense || false,
          needsDrugLicense: info.needsDrugLicense || false,
          needsClinicalEstablishment: info.needsClinicalEstablishment || false,
        };
        console.log(`🏢 Auto-inferred: ${keyword} → ${info.sector}/${info.type}`);
        break;
      }
    }
    
    // 3. Extract scale/employee count
    const employeePatterns = [
      /(\d+)\s*(employees?|staff|workers?|people)/i,
      /(small|tiny|local|one-man)/i,
      /(medium|moderate)/i,
      /(large|big|major)/i,
    ];
    
    const employeeMatch = message.match(/(\d+)\s*(employees?|staff|workers?|people)/i);
    if (employeeMatch) {
      businessProfile.employeeCount = parseInt(employeeMatch[1]);
      businessProfile.scale = this.inferScale(businessProfile.employeeCount);
    } else if (lowerMessage.match(/small|tiny|local|one.?man/)) {
      businessProfile.scale = 'small';
      businessProfile.employeeCount = businessProfile.employeeCount || 5;
    } else if (lowerMessage.match(/medium|moderate/)) {
      businessProfile.scale = 'medium';
      businessProfile.employeeCount = businessProfile.employeeCount || 25;
    } else if (lowerMessage.match(/large|big|major/)) {
      businessProfile.scale = 'large';
      businessProfile.employeeCount = businessProfile.employeeCount || 100;
    }
    
    // 4. Extract investment/budget
    const budgetMatch = message.match(/(\d+(?:\.\d+)?)\s*(lakh|lakhs|lac|lacs|crore|crores|cr|k|thousand)/i);
    if (budgetMatch) {
      let amount = parseFloat(budgetMatch[1]);
      const unit = budgetMatch[2].toLowerCase();
      
      if (unit.includes('crore') || unit === 'cr') {
        amount *= 10000000;
      } else if (unit.includes('lakh') || unit.includes('lac')) {
        amount *= 100000;
      } else if (unit === 'k' || unit === 'thousand') {
        amount *= 1000;
      }
      
      businessProfile.investment = amount;
      businessProfile.investmentFormatted = budgetMatch[0];
    }
    
    // 5. Infer default scale for small businesses if not specified
    if (!businessProfile.scale && businessProfile.businessType) {
      // Default assumption: MSME means small/micro unless stated otherwise
      businessProfile.scale = 'small';
      businessProfile.employeeCount = businessProfile.employeeCount || 5;
    }
  }

  inferScale(employeeCount) {
    if (employeeCount <= 10) return 'micro';
    if (employeeCount <= 50) return 'small';
    if (employeeCount <= 200) return 'medium';
    return 'large';
  }

  /**
   * Get ONLY genuinely missing critical information
   * Don't ask for things that can be safely assumed or aren't critical
   */
  getGenuinelyMissingInfo(profile) {
    const missing = [];
    
    // Business type is critical
    if (!profile.businessType) {
      missing.push({
        field: 'businessType',
        question: 'What type of business are you planning?',
        reason: 'determines your compliance requirements'
      });
    }
    
    // Location is critical for state-specific compliances
    if (!profile.city && !profile.state) {
      missing.push({
        field: 'location',
        question: 'Which city will your business operate in?',
        reason: 'needed for state-specific registrations'
      });
    }
    
    // Employee count matters for EPF/ESI - but only ask if scale is large
    // For small businesses, assume <10 employees initially
    
    return missing;
  }

  /**
   * Provide direct compliance guidance when we have enough info
   */
  async provideComplianceGuidance(businessProfile, context) {
    const requirements = this.getApplicableCompliances(businessProfile);
    
    const systemPrompt = `You are an expert MSME compliance consultant in India. 
Be practical, concise, and helpful. Sound like a knowledgeable Indian consultant.
DO NOT ask questions whose answers are common knowledge.
DO NOT ask "which state is Delhi in" or similar obvious questions.
Provide actionable guidance.`;

    const prompt = `Business Profile:
- Type: ${businessProfile.businessType || 'business'}
- City: ${businessProfile.city || 'Not specified'}
- State: ${businessProfile.state || 'Not specified'}
- Scale: ${businessProfile.scale || 'small'}
- Employees: ${businessProfile.employeeCount || 'under 10'}

Applicable Compliances: ${requirements.map(r => r.name).join(', ')}

Provide a brief, actionable summary of:
1. Key registrations needed (prioritized)
2. Estimated timeline and costs
3. Immediate first step

Keep response under 150 words. Be practical and encouraging.`;

    try {
      const response = await this.ollamaService.generateResponse(prompt, systemPrompt, { temperature: 0.4 });
      
      return {
        message: response,
        type: 'guidance',
        agent: this.name,
        data: {
          businessProfile,
          compliances: requirements,
          step: 'compliance_identified',
          profileComplete: true
        }
      };
    } catch (error) {
      console.error('❌ DiscoveryAgent Ollama error:', error);
      return this.getFallbackGuidance(businessProfile, requirements);
    }
  }

  /**
   * Ask only ONE necessary question with clear reason
   */
  async askOnlyNecessaryQuestion(message, businessProfile, missingInfo, context) {
    const nextQuestion = missingInfo[0];
    
    const systemPrompt = `You are an expert MSME compliance consultant. Ask ONE brief, focused question.
DO NOT ask about things that are common knowledge.
DO NOT provide multiple choice lists unless truly necessary.
Be conversational and friendly.`;

    const prompt = `User said: "${message}"

Current profile: ${JSON.stringify(businessProfile)}

You need to ask about: ${nextQuestion.field}
Reason: ${nextQuestion.reason}

Ask ONE brief, natural question. Keep it under 30 words.`;

    try {
      const response = await this.ollamaService.generateResponse(prompt, systemPrompt, { temperature: 0.5 });
      
      return {
        message: response,
        type: 'discovery',
        agent: this.name,
        data: {
          businessProfile,
          step: nextQuestion.field,
          awaiting: nextQuestion.field
        }
      };
    } catch (error) {
      return {
        message: nextQuestion.question,
        type: 'discovery',
        agent: this.name,
        data: {
          businessProfile,
          step: nextQuestion.field
        }
      };
    }
  }

  /**
   * Get applicable compliances based on business profile
   */
  getApplicableCompliances(profile) {
    const compliances = [];
    const central = COMPLIANCE_DATABASE.central || {};
    
    // GST - applicable for most businesses
    if (central.GST) {
      compliances.push({
        id: 'GST',
        name: 'GST Registration',
        mandatory: profile.investment > 4000000 || profile.sector === 'ecommerce',
        timeline: '7-15 days',
        cost: 0
      });
    }
    
    // FSSAI - for food businesses
    if (profile.inferredRequirements?.needsFSSAI && central.FSSAI) {
      compliances.push({
        id: 'FSSAI',
        name: 'FSSAI License',
        mandatory: true,
        timeline: '7-60 days',
        cost: '₹100-₹7,500'
      });
    }
    
    // Udyam Registration - recommended for all MSMEs
    if (central.MSME_UDYAM) {
      compliances.push({
        id: 'UDYAM',
        name: 'Udyam Registration',
        mandatory: false,
        benefits: 'Priority lending, govt tenders',
        timeline: '1 day',
        cost: 0
      });
    }
    
    // Shop Act - for retail/service businesses
    if (profile.inferredRequirements?.needsShopAct || profile.sector === 'retail' || profile.sector === 'services') {
      compliances.push({
        id: 'SHOP_ACT',
        name: `${profile.state || 'State'} Shop & Establishment Act`,
        mandatory: true,
        timeline: '7-15 days',
        cost: '₹500-₹5,000'
      });
    }
    
    // EPF - if 20+ employees
    if (profile.employeeCount >= 20 && central.EPF) {
      compliances.push({
        id: 'EPF',
        name: 'EPF Registration',
        mandatory: true,
        timeline: '30 days',
        cost: 0
      });
    }
    
    // ESI - if 10+ employees
    if (profile.employeeCount >= 10 && central.ESI) {
      compliances.push({
        id: 'ESI',
        name: 'ESI Registration',
        mandatory: true,
        timeline: '30 days',
        cost: 0
      });
    }
    
    return compliances;
  }

  getFallbackGuidance(profile, compliances) {
    const complianceList = compliances.map(c => `• ${c.name} (${c.mandatory ? 'Mandatory' : 'Recommended'})`).join('\n');
    
    return {
      message: `Great! For your ${profile.businessType} in ${profile.city || profile.state || 'India'}, here are the key registrations:

${complianceList}

**First Step:** Start with Udyam Registration (free, instant) and then proceed with ${compliances[0]?.name || 'GST'}.

Would you like a detailed timeline or cost breakdown?`,
      type: 'guidance',
      agent: this.name,
      data: {
        businessProfile: profile,
        compliances,
        profileComplete: true
      }
    };
  }
}