/**
 * Classification Agent - Converts business profile into regulatory trigger bands
 * 
 * This agent is purely deterministic and stateless. It takes a business profile
 * and classifies it into standardized trigger bands that determine which
 * compliance obligations apply.
 * 
 * @author Senior Backend Architect
 * @version 1.0.0
 */

/**
 * Classification Agent for converting business profiles into trigger bands
 * 
 * Trigger bands are standardized categories that determine which compliance
 * obligations apply to a business. This classification is deterministic
 * and based on clear business rules.
 */
export class ClassificationAgent {
  constructor() {
    this.name = 'ClassificationAgent';
  }

  /**
   * Classify a business profile into regulatory trigger bands
   * 
   * @param {Object} businessProfile - The business profile to classify
   * @param {string} businessProfile.businessType - Type of business (e.g., 'restaurant', 'manufacturing')
   * @param {string} businessProfile.state - State code or name
   * @param {number} businessProfile.employees - Number of employees
   * @param {number} businessProfile.annualTurnover - Annual turnover in INR
   * @param {string} businessProfile.scale - Business scale ('small', 'medium', 'large')
   * @param {string} businessProfile.investment - Investment amount with units
   * 
   * @returns {Object} Classification result with trigger bands
   * @returns {string} returns.employeeBand - Employee count band (NONE, MICRO, SMALL, MEDIUM, LARGE)
   * @returns {string} returns.turnoverBand - Turnover band (MICRO, SMALL, MEDIUM, LARGE, EXEMPT)
   * @returns {string} returns.industryCode - Standardized industry code
   * @returns {string} returns.stateCode - ISO state code
   * @returns {Object} returns.triggers - Specific regulatory triggers
   */
  classify(businessProfile) {
    if (!businessProfile) {
      throw new Error('Business profile is required for classification');
    }

    const classification = {
      employeeBand: this._classifyEmployeeBand(businessProfile),
      turnoverBand: this._classifyTurnoverBand(businessProfile),
      industryCode: this._classifyIndustryCode(businessProfile.businessType),
      stateCode: this._classifyStateCode(businessProfile.state),
      triggers: this._identifyTriggers(businessProfile)
    };

    return {
      classification,
      metadata: {
        timestamp: new Date().toISOString(),
        agent: this.name,
        version: '1.0.0'
      }
    };
  }

  /**
   * Classify business into employee count bands
   * 
   * @private
   * @param {Object} businessProfile - Business profile
   * @returns {string} Employee band classification
   */
  _classifyEmployeeBand(businessProfile) {
    let employeeCount = businessProfile.employees;

    // If employees not directly provided, infer from scale or investment
    if (!employeeCount) {
      employeeCount = this._inferEmployeeCount(businessProfile);
    }

    if (employeeCount === 0) return 'NONE';
    if (employeeCount <= 9) return 'MICRO';
    if (employeeCount <= 19) return 'SMALL';
    if (employeeCount <= 49) return 'MEDIUM';
    return 'LARGE';
  }

  /**
   * Classify business into turnover bands for tax obligations
   * 
   * @private
   * @param {Object} businessProfile - Business profile
   * @returns {string} Turnover band classification
   */
  _classifyTurnoverBand(businessProfile) {
    let turnover = businessProfile.annualTurnover;

    // If turnover not provided, infer from investment or scale
    if (!turnover) {
      turnover = this._inferTurnover(businessProfile);
    }

    if (turnover < 4000000) return 'EXEMPT'; // Below GST threshold
    if (turnover <= 5000000) return 'MICRO';  // Up to 5 Cr
    if (turnover <= 75000000) return 'SMALL'; // Up to 75 Cr
    if (turnover <= 2500000000) return 'MEDIUM'; // Up to 250 Cr
    return 'LARGE';
  }

  /**
   * Classify business type into standardized industry codes
   * 
   * @private
   * @param {string} businessType - Raw business type
   * @returns {string} Standardized industry code
   */
  _classifyIndustryCode(businessType) {
    if (!businessType) return 'GENERAL';

    const type = businessType.toLowerCase();

    // Food & Beverage
    if (type.includes('restaurant') || type.includes('cafe') || 
        type.includes('food') || type.includes('catering')) {
      return 'FOOD_BEVERAGE';
    }

    // Manufacturing
    if (type.includes('manufacturing') || type.includes('factory') || 
        type.includes('production') || type.includes('textile')) {
      return 'MANUFACTURING';
    }

    // Retail Trade
    if (type.includes('retail') || type.includes('shop') || 
        type.includes('store') || type.includes('trading')) {
      return 'RETAIL_TRADE';
    }

    // Services
    if (type.includes('service') || type.includes('consulting') || 
        type.includes('software') || type.includes('it')) {
      return 'SERVICES';
    }

    // Construction
    if (type.includes('construction') || type.includes('building') || 
        type.includes('infrastructure')) {
      return 'CONSTRUCTION';
    }

    return 'GENERAL';
  }

  /**
   * Convert state name/identifier to ISO state code
   * 
   * @private
   * @param {string} state - State name or identifier
   * @returns {string} ISO state code
   */
  _classifyStateCode(state) {
    if (!state) return 'UNKNOWN';

    const stateMappings = {
      'andhra pradesh': 'AP',
      'assam': 'AS',
      'bihar': 'BR',
      'chhattisgarh': 'CT',
      'goa': 'GA',
      'gujarat': 'GJ',
      'haryana': 'HR',
      'himachal pradesh': 'HP',
      'jharkhand': 'JH',
      'karnataka': 'KA',
      'kerala': 'KL',
      'madhya pradesh': 'MP',
      'maharashtra': 'MH',
      'manipur': 'MN',
      'meghalaya': 'ML',
      'mizoram': 'MZ',
      'nagaland': 'NL',
      'odisha': 'OD',
      'punjab': 'PB',
      'rajasthan': 'RJ',
      'sikkim': 'SK',
      'tamil nadu': 'TN',
      'telangana': 'TS',
      'tripura': 'TR',
      'uttar pradesh': 'UP',
      'uttarakhand': 'UK',
      'west bengal': 'WB',
      'delhi': 'DL',
      'mumbai': 'MH',
      'bangalore': 'KA',
      'chennai': 'TN',
      'hyderabad': 'TS',
      'pune': 'MH',
      'kolkata': 'WB',
      'patna': 'BR'
    };

    const normalizedState = state.toLowerCase().trim();
    return stateMappings[normalizedState] || state.toUpperCase();
  }

  /**
   * Identify specific regulatory triggers based on business profile
   * 
   * @private
   * @param {Object} businessProfile - Business profile
   * @returns {Object} Specific regulatory triggers
   */
  _identifyTriggers(businessProfile) {
    const triggers = {
      gstRequired: false,
      fssaiRequired: false,
      epfRequired: false,
      esiRequired: false,
      factoriesActRequired: false,
      pollutionClearanceRequired: false,
      shopsActRequired: false
    };

    const employeeCount = businessProfile.employees || this._inferEmployeeCount(businessProfile);
    const turnover = businessProfile.annualTurnover || this._inferTurnover(businessProfile);
    const industryCode = this._classifyIndustryCode(businessProfile.businessType);

    // GST trigger
    triggers.gstRequired = turnover >= 4000000;

    // FSSAI trigger
    triggers.fssaiRequired = industryCode === 'FOOD_BEVERAGE';

    // EPF trigger
    triggers.epfRequired = employeeCount >= 20;

    // ESI trigger
    triggers.esiRequired = employeeCount >= 10;

    // Factories Act trigger
    triggers.factoriesActRequired = industryCode === 'MANUFACTURING' && employeeCount >= 10;

    // Pollution clearance trigger
    triggers.pollutionClearanceRequired = industryCode === 'MANUFACTURING';

    // Shops Act trigger (most commercial establishments)
    triggers.shopsActRequired = ['RETAIL_TRADE', 'SERVICES', 'GENERAL'].includes(industryCode);

    return triggers;
  }

  /**
   * Infer employee count from business scale and investment
   * 
   * @private
   * @param {Object} businessProfile - Business profile
   * @returns {number} Inferred employee count
   */
  _inferEmployeeCount(businessProfile) {
    const scale = businessProfile.scale?.toLowerCase();
    const investment = this._parseInvestment(businessProfile.investment);

    // Scale-based inference
    if (scale === 'small') return 5;
    if (scale === 'medium') return 25;
    if (scale === 'large') return 75;

    // Investment-based inference (rough estimates)
    if (investment < 1000000) return 2;      // < 10L
    if (investment < 5000000) return 10;     // < 50L
    if (investment < 20000000) return 30;    // < 2Cr
    return 50;                               // > 2Cr
  }

  /**
   * Infer annual turnover from investment and business type
   * 
   * @private
   * @param {Object} businessProfile - Business profile
   * @returns {number} Inferred annual turnover
   */
  _inferTurnover(businessProfile) {
    const investment = this._parseInvestment(businessProfile.investment);
    const industryCode = this._classifyIndustryCode(businessProfile.businessType);

    // Industry multipliers (annual turnover vs investment)
    const multipliers = {
      'RETAIL_TRADE': 3,      // High turnover multiple
      'FOOD_BEVERAGE': 2.5,   // Good turnover multiple
      'SERVICES': 2,          // Moderate turnover multiple
      'MANUFACTURING': 1.5,   // Lower turnover multiple
      'CONSTRUCTION': 1.2,    // Project-based
      'GENERAL': 2
    };

    const multiplier = multipliers[industryCode] || 2;
    return investment * multiplier;
  }

  /**
   * Parse investment string to numeric value
   * 
   * @private
   * @param {string} investment - Investment string (e.g., "5 lakh", "2 crore")
   * @returns {number} Investment amount in INR
   */
  _parseInvestment(investment) {
    if (!investment) return 1000000; // Default 10L

    const str = investment.toLowerCase().replace(/[₹,]/g, '');
    const amount = parseFloat(str.match(/[\d.]+/)?.[0] || '10');

    if (str.includes('crore')) return amount * 10000000;
    if (str.includes('lakh')) return amount * 100000;
    if (str.includes('k')) return amount * 1000;
    
    return amount; // Assume raw number is in INR
  }
}