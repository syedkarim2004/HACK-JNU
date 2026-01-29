import { COMPLIANCE_DATABASE } from '../data/compliances.js';

/**
 * Compliance Agent - Maps trigger bands to specific compliance obligations
 * 
 * This agent is primarily deterministic and stateless. It takes classification
 * trigger bands and maps them to specific compliance obligations that a
 * business must fulfill. LLM is only used for plain-English explanations.
 * 
 * @author Senior Backend Architect
 * @version 1.0.0
 */

/**
 * Compliance Agent for mapping triggers to obligations
 * 
 * Takes classification trigger bands and deterministically maps them to
 * specific compliance obligations (not legal acts). Returns structured
 * obligation data with plain-English explanations via LLM.
 */
export class ComplianceAgent {
  constructor(ollamaService) {
    this.ollamaService = ollamaService;
    this.name = 'ComplianceAgent';
  }

  /**
   * Process compliance mapping request
   * 
   * @param {string} message - User message (for LLM context)
   * @param {Object} context - Request context
   * @param {Object} session - Session data
   * @returns {Object} Compliance obligations and explanations
   */
  async process(message, context, session) {
    console.log('⚖️ ComplianceAgent: Processing compliance obligations');
    
    const businessProfile = (session || {}).businessProfile || {};
    
    try {
      // Step 1: Get obligations deterministically
      const obligations = this.mapObligations(context.classification);
      
      // Step 2: Generate plain-English explanations via LLM
      const explanation = await this._generateExplanation(obligations, businessProfile, message);
      
      return {
        message: explanation,
        type: 'compliance',
        agent: this.name,
        data: {
          obligations,
          obligationCount: obligations.length,
          businessProfile,
          classification: context.classification
        }
      };

    } catch (error) {
      console.error('❌ ComplianceAgent error:', error);
      return this._getFallbackResponse(businessProfile);
    }
  }

  /**
   * Map classification triggers to specific compliance obligations
   * 
   * This is purely deterministic business logic. No LLM involvement.
   * 
   * @param {Object} classification - Classification result from ClassificationAgent
   * @returns {Array} Array of compliance obligation objects
   */
  mapObligations(classification) {
    if (!classification) {
      throw new Error('Classification is required for obligation mapping');
    }

    const obligations = [];
    const triggers = classification.triggers;
    const stateCode = classification.stateCode;

    // Central Government Obligations
    if (triggers.gstRequired) {
      obligations.push(this._mapGSTObligation());
    }

    if (triggers.fssaiRequired) {
      obligations.push(this._mapFSSAIObligation());
    }

    if (triggers.epfRequired) {
      obligations.push(this._mapEPFObligation());
    }

    if (triggers.esiRequired) {
      obligations.push(this._mapESIObligation());
    }

    // MSME Registration (always beneficial, never mandatory)
    obligations.push(this._mapMSMEObligation());

    // State-specific obligations
    const stateObligations = this._mapStateObligations(triggers, stateCode);
    obligations.push(...stateObligations);

    // Sort by priority (mandatory first, then by timeline)
    return obligations.sort((a, b) => {
      if (a.mandatory !== b.mandatory) return b.mandatory - a.mandatory;
      return this._parseTimelineDays(a.timeline) - this._parseTimelineDays(b.timeline);
    });
  }

  /**
   * Map GST Registration obligation
   * 
   * @private
   * @returns {Object} GST obligation object
   */
  _mapGSTObligation() {
    const gstData = COMPLIANCE_DATABASE.central.GST;
    return {
      id: 'GST_REGISTRATION',
      name: 'GST Registration',
      category: 'taxation',
      mandatory: true,
      priority: 'HIGH',
      description: 'Register for Goods and Services Tax',
      obligations: [
        'Register on GST portal within 30 days of liability',
        'File monthly/quarterly returns as applicable',
        'Maintain GST-compliant invoicing',
        'Pay GST on time to avoid penalties'
      ],
      documents: gstData.documents,
      authority: gstData.authority,
      timeline: gstData.timeline,
      cost: gstData.cost,
      penalties: gstData.penalties,
      applicableWhen: 'Annual turnover exceeds ₹40 lakhs'
    };
  }

  /**
   * Map FSSAI License obligation
   * 
   * @private
   * @returns {Object} FSSAI obligation object
   */
  _mapFSSAIObligation() {
    const fssaiData = COMPLIANCE_DATABASE.central.FSSAI;
    return {
      id: 'FSSAI_LICENSE',
      name: 'FSSAI Food License',
      category: 'food_safety',
      mandatory: true,
      priority: 'HIGH',
      description: 'Obtain Food Safety and Standards Authority License',
      obligations: [
        'Apply for appropriate FSSAI license category',
        'Display FSSAI license number prominently',
        'Maintain food safety standards and hygiene',
        'Renew license before expiry',
        'Keep food safety records'
      ],
      documents: fssaiData.documents,
      authority: fssaiData.authority,
      timeline: fssaiData.timeline,
      cost: fssaiData.cost,
      penalties: fssaiData.penalties,
      applicableWhen: 'Food business operations'
    };
  }

  /**
   * Map EPF Registration obligation
   * 
   * @private
   * @returns {Object} EPF obligation object
   */
  _mapEPFObligation() {
    const epfData = COMPLIANCE_DATABASE.central.EPF;
    return {
      id: 'EPF_REGISTRATION',
      name: 'Employee Provident Fund',
      category: 'labor',
      mandatory: true,
      priority: 'HIGH',
      description: 'Register for Employee Provident Fund',
      obligations: [
        'Register establishment with EPFO',
        'Deduct 12% employee contribution from salary',
        'Contribute 12% employer share',
        'File monthly ECR returns',
        'Provide EPF facility to all eligible employees'
      ],
      documents: epfData.documents,
      authority: epfData.authority,
      timeline: epfData.timeline,
      cost: epfData.cost,
      applicableWhen: '20 or more employees'
    };
  }

  /**
   * Map ESI Registration obligation
   * 
   * @private
   * @returns {Object} ESI obligation object
   */
  _mapESIObligation() {
    const esiData = COMPLIANCE_DATABASE.central.ESI;
    return {
      id: 'ESI_REGISTRATION',
      name: 'Employee State Insurance',
      category: 'labor',
      mandatory: true,
      priority: 'HIGH',
      description: 'Register for Employee State Insurance',
      obligations: [
        'Register establishment with ESIC',
        'Deduct 0.75% employee contribution',
        'Contribute 3.25% employer share',
        'Provide medical benefits to employees',
        'File half-yearly returns'
      ],
      documents: esiData.documents,
      authority: esiData.authority,
      timeline: esiData.timeline,
      cost: esiData.cost,
      applicableWhen: '10 or more employees'
    };
  }

  /**
   * Map MSME Registration obligation (beneficial)
   * 
   * @private
   * @returns {Object} MSME obligation object
   */
  _mapMSMEObligation() {
    const msmeData = COMPLIANCE_DATABASE.central.MSME_UDYAM;
    return {
      id: 'MSME_UDYAM',
      name: 'MSME Udyam Registration',
      category: 'business_registration',
      mandatory: false,
      priority: 'MEDIUM',
      description: 'Register as Micro, Small, or Medium Enterprise',
      obligations: [
        'Complete online Udyam registration',
        'Update details annually if required',
        'Maintain MSME certificate for benefits'
      ],
      documents: msmeData.documents,
      authority: msmeData.authority,
      timeline: msmeData.timeline,
      cost: msmeData.cost,
      benefits: msmeData.benefits,
      applicableWhen: 'All businesses (recommended)'
    };
  }

  /**
   * Map state-specific obligations
   * 
   * @private
   * @param {Object} triggers - Regulatory triggers
   * @param {string} stateCode - State code
   * @returns {Array} Array of state-specific obligations
   */
  _mapStateObligations(triggers, stateCode) {
    const obligations = [];
    const stateData = COMPLIANCE_DATABASE.stateSpecific[stateCode];

    if (!stateData) {
      // Generic state obligations
      if (triggers.shopsActRequired) {
        obligations.push({
          id: 'SHOPS_ACT',
          name: 'Shops and Establishments Act',
          category: 'business_registration',
          mandatory: true,
          priority: 'HIGH',
          description: 'Register under state Shops Act',
          obligations: [
            'Apply for Shops Act license',
            'Display license at business premises',
            'Renew license annually',
            'Maintain employee records'
          ],
          timeline: '15-30 days',
          cost: 500,
          applicableWhen: 'Commercial establishments'
        });
      }
      return obligations;
    }

    // Map specific state obligations
    if (triggers.shopsActRequired && stateData.SHOPS_ACT) {
      const shops = stateData.SHOPS_ACT;
      obligations.push({
        id: shops.id,
        name: shops.name,
        category: shops.category,
        mandatory: shops.mandatory,
        priority: 'HIGH',
        description: 'Register under state Shops and Establishments Act',
        obligations: [
          'Submit application with required documents',
          'Pay applicable fees',
          'Display license at premises',
          'Renew before expiry'
        ],
        documents: shops.documents,
        authority: shops.authority,
        timeline: shops.timeline,
        cost: shops.cost,
        applicableWhen: 'Commercial establishments'
      });
    }

    if (triggers.factoriesActRequired && stateData.FACTORIES_ACT) {
      const factories = stateData.FACTORIES_ACT;
      obligations.push({
        id: factories.id,
        name: factories.name,
        category: factories.category,
        mandatory: factories.mandatory,
        priority: 'HIGH',
        description: 'Register under state Factories Act',
        obligations: [
          'Submit factory plans and layouts',
          'Obtain fire and pollution clearances',
          'Register with Factory Inspector',
          'Maintain safety compliance'
        ],
        documents: factories.documents,
        authority: factories.authority,
        timeline: factories.timeline,
        cost: factories.cost,
        applicableWhen: 'Manufacturing with 10+ employees'
      });
    }

    if (stateData.TRADE_LICENSE) {
      const trade = stateData.TRADE_LICENSE;
      obligations.push({
        id: trade.id,
        name: trade.name,
        category: trade.category,
        mandatory: trade.mandatory,
        priority: 'MEDIUM',
        description: 'Obtain local trade license',
        obligations: [
          'Apply to local municipal authority',
          'Submit NOC from relevant departments',
          'Pay license fees',
          'Renew annually'
        ],
        authority: trade.authority,
        timeline: trade.timeline,
        cost: trade.cost,
        applicableWhen: 'Local business operations'
      });
    }

    return obligations;
  }

  /**
   * Generate plain-English explanation via LLM
   * 
   * @private
   * @param {Array} obligations - Mapped obligations
   * @param {Object} businessProfile - Business profile
   * @param {string} message - User message for context
   * @returns {string} Plain-English explanation
   */
  async _generateExplanation(obligations, businessProfile, message) {
    const systemPrompt = `You are a compliance expert explaining business obligations in simple terms. 
    
You have a list of specific obligations that apply to this business. Your job is to explain them clearly and encouragingly.

Business Type: ${businessProfile.businessType || 'Business'}
Location: ${businessProfile.state || 'India'}

Guidelines:
- Use simple, encouraging language
- Explain WHY each obligation matters
- Prioritize mandatory obligations
- Keep explanations under 200 words
- Use bullet points for clarity
- Be specific about costs and timelines`;

    const userPrompt = `The user asked: "${message}"

Based on their business profile, here are their applicable compliance obligations:

${obligations.map(ob => `
${ob.name} (${ob.mandatory ? 'MANDATORY' : 'OPTIONAL'}):
- Timeline: ${ob.timeline}
- Cost: ${typeof ob.cost === 'object' ? 'Varies' : '₹' + ob.cost}
- Key obligations: ${ob.obligations?.slice(0, 3).join(', ') || 'Register and maintain compliance'}
`).join('\n')}

Explain these obligations in simple terms, focusing on what they need to do and why it matters.`;

    try {
      return await this.ollamaService.generateResponse(
        userPrompt,
        systemPrompt,
        { temperature: 0.4 }
      );
    } catch (error) {
      console.error('❌ LLM explanation failed:', error);
      return this._generateFallbackExplanation(obligations);
    }
  }

  /**
   * Parse timeline string to days for sorting
   * 
   * @private
   * @param {string} timeline - Timeline string
   * @returns {number} Days
   */
  _parseTimelineDays(timeline) {
    if (!timeline) return 999;
    const match = timeline.match(/(\d+)/);
    return match ? parseInt(match[1]) : 999;
  }

  /**
   * Generate fallback explanation without LLM
   * 
   * @private
   * @param {Array} obligations - Obligations array
   * @returns {string} Fallback explanation
   */
  _generateFallbackExplanation(obligations) {
    const mandatory = obligations.filter(ob => ob.mandatory);
    const optional = obligations.filter(ob => !ob.mandatory);

    let explanation = '📋 **Your Compliance Obligations**\n\n';

    if (mandatory.length > 0) {
      explanation += '**🔴 Mandatory Requirements:**\n';
      mandatory.forEach(ob => {
        explanation += `• ${ob.name} - Timeline: ${ob.timeline}\n`;
      });
    }

    if (optional.length > 0) {
      explanation += '\n**🟡 Recommended (Optional):**\n';
      optional.forEach(ob => {
        explanation += `• ${ob.name} - ${ob.benefits ? 'Benefits available' : 'Good for business'}\n`;
      });
    }

    explanation += '\nStart with mandatory requirements first, then consider the optional ones for business benefits.';
    
    return explanation;
  }

  /**
   * Get fallback response when processing fails
   * 
   * @private
   * @param {Object} businessProfile - Business profile
   * @returns {Object} Fallback response
   */
  _getFallbackResponse(businessProfile) {
    return {
      message: `⚠️ **Unable to process compliance requirements**

Please ensure you have provided:
• Business type
• Location (state)
• Employee count or business scale

I can then provide accurate compliance obligations for your ${businessProfile.businessType || 'business'}.`,
      type: 'error',
      agent: this.name,
      data: {
        obligations: [],
        obligationCount: 0
      }
    };
  }
}