import { CriterionResult, EligibilityVerdict, Scheme, UserProfile } from '@/types';

/**
 * Deterministic Eligibility Rule Engine
 * STRICTLY RULE-BASED: Never guesses, never uses LLM for verdict decisions.
 * Evaluates citizen profile against official scheme requirements.
 */
export function evaluateEligibility(
  scheme: Scheme,
  profile: UserProfile | null,
  options?: { isFuzzyOccupation?: boolean }
): EligibilityVerdict {
  if (!profile) {
    return {
      status: 'NEEDS_MORE_INFO',
      confidence_score: 0,
      matched_criteria: [],
      unmatched_criteria: [],
      missing_criteria: [
        {
          criterion: 'profile',
          label: 'Citizen Profile',
          passed: false,
          user_value: null,
          required_value: 'Complete profile',
          reason: 'No citizen profile found. Please create your profile to check eligibility.',
          is_missing: true
        }
      ],
      target_followup_field: 'profile',
      target_followup_question: 'Please set up your profile to check eligibility.',
      summary_explanation: 'Profile required to evaluate eligibility.'
    };
  }

  const matched: CriterionResult[] = [];
  const unmatched: CriterionResult[] = [];
  const missing: CriterionResult[] = [];

  const rules = scheme.eligibility;

  // 1. Occupation Evaluation
  const schemeOcc = rules.occupation || 'universal';
  if (schemeOcc === 'universal' || schemeOcc === 'any') {
    matched.push({
      criterion: 'occupation',
      label: 'Target Group / Occupation',
      passed: true,
      user_value: profile.occupation,
      required_value: 'Universal / All citizens',
      reason: 'This scheme is universally open to all citizens across professions.'
    });
  } else if (profile.occupation === schemeOcc) {
    matched.push({
      criterion: 'occupation',
      label: 'Target Group / Occupation',
      passed: true,
      user_value: profile.occupation,
      required_value: schemeOcc,
      reason: `You are registered as ${profile.occupation.replace(/_/g, ' ')}, matching the scheme target group.`
    });
  } else if (profile.occupation === 'other' && options?.isFuzzyOccupation) {
    matched.push({
      criterion: 'occupation',
      label: 'Target Group / Occupation',
      passed: true,
      user_value: profile.occupation_raw || 'Other',
      required_value: schemeOcc,
      reason: `Your custom occupation "${profile.occupation_raw}" was identified as a possible match.`
    });
  } else {
    unmatched.push({
      criterion: 'occupation',
      label: 'Target Group / Occupation',
      passed: false,
      user_value: profile.occupation,
      required_value: schemeOcc,
      reason: `Scheme requires occupation: ${schemeOcc.replace(/_/g, ' ')}, but profile indicates: ${profile.occupation.replace(/_/g, ' ')}.`
    });
  }

  // 2. Age Evaluation
  if (rules.age_min != null || rules.age_max != null) {
    if (profile.age == null) {
      missing.push({
        criterion: 'age',
        label: 'Age Eligibility',
        passed: false,
        user_value: null,
        required_value: `${rules.age_min ?? 0} to ${rules.age_max ?? 'No upper limit'} years`,
        reason: 'Age is not specified in your profile.',
        is_missing: true
      });
    } else {
      const minPassed = rules.age_min == null || profile.age >= rules.age_min;
      const maxPassed = rules.age_max == null || profile.age <= rules.age_max;

      if (minPassed && maxPassed) {
        matched.push({
          criterion: 'age',
          label: 'Age Eligibility',
          passed: true,
          user_value: `${profile.age} years`,
          required_value: `${rules.age_min ?? 0} to ${rules.age_max ?? 'No upper limit'} years`,
          reason: `Age ${profile.age} satisfies the required age span (${rules.age_min ?? 0} to ${rules.age_max ?? 'No limit'}).`
        });
      } else {
        unmatched.push({
          criterion: 'age',
          label: 'Age Eligibility',
          passed: false,
          user_value: `${profile.age} years`,
          required_value: `${rules.age_min ?? 0} to ${rules.age_max ?? 'No upper limit'} years`,
          reason: `Age ${profile.age} is outside the allowable range (${rules.age_min ?? 0} to ${rules.age_max ?? 'No limit'} years).`
        });
      }
    }
  }

  // 3. Annual Income Evaluation
  if (rules.income_max != null) {
    if (profile.annual_income == null) {
      missing.push({
        criterion: 'annual_income',
        label: 'Income Ceiling',
        passed: false,
        user_value: null,
        required_value: `Up to ₹${rules.income_max.toLocaleString('en-IN')}/year`,
        reason: 'Annual income is not provided in your profile.',
        is_missing: true
      });
    } else {
      if (profile.annual_income <= rules.income_max) {
        matched.push({
          criterion: 'annual_income',
          label: 'Income Ceiling',
          passed: true,
          user_value: `₹${profile.annual_income.toLocaleString('en-IN')}`,
          required_value: `Up to ₹${rules.income_max.toLocaleString('en-IN')}`,
          reason: `Your income ₹${profile.annual_income.toLocaleString('en-IN')} is within the scheme ceiling of ₹${rules.income_max.toLocaleString('en-IN')}.`
        });
      } else {
        unmatched.push({
          criterion: 'annual_income',
          label: 'Income Ceiling',
          passed: false,
          user_value: `₹${profile.annual_income.toLocaleString('en-IN')}`,
          required_value: `Up to ₹${rules.income_max.toLocaleString('en-IN')}`,
          reason: `Income ₹${profile.annual_income.toLocaleString('en-IN')} exceeds the scheme ceiling of ₹${rules.income_max.toLocaleString('en-IN')}.`
        });
      }
    }
  }

  // 4. Gender Evaluation
  if (rules.gender && rules.gender !== 'any') {
    if (!profile.gender || profile.gender === 'any') {
      missing.push({
        criterion: 'gender',
        label: 'Gender Category',
        passed: false,
        user_value: null,
        required_value: rules.gender,
        reason: 'Gender is not specified in profile.',
        is_missing: true
      });
    } else if (profile.gender === rules.gender) {
      matched.push({
        criterion: 'gender',
        label: 'Gender Category',
        passed: true,
        user_value: profile.gender,
        required_value: rules.gender,
        reason: `Matches required gender category (${rules.gender}).`
      });
    } else {
      unmatched.push({
        criterion: 'gender',
        label: 'Gender Category',
        passed: false,
        user_value: profile.gender,
        required_value: rules.gender,
        reason: `Scheme is exclusively for ${rules.gender} applicants.`
      });
    }
  }

  // 5. State / Domicile Evaluation
  if (rules.state && rules.state !== 'all') {
    if (!profile.state || profile.state === 'All India') {
      missing.push({
        criterion: 'state',
        label: 'State / Domicile',
        passed: false,
        user_value: profile.state,
        required_value: rules.state,
        reason: `Scheme is specific to residents of ${rules.state}.`,
        is_missing: true
      });
    } else if (profile.state.toLowerCase() === rules.state.toLowerCase()) {
      matched.push({
        criterion: 'state',
        label: 'State / Domicile',
        passed: true,
        user_value: profile.state,
        required_value: rules.state,
        reason: `Resident of eligible state (${rules.state}).`
      });
    } else {
      unmatched.push({
        criterion: 'state',
        label: 'State / Domicile',
        passed: false,
        user_value: profile.state,
        required_value: rules.state,
        reason: `Scheme is limited to ${rules.state}, but you reside in ${profile.state}.`
      });
    }
  }

  // 6. Land Holding Evaluation (Crucial for PM-KISAN)
  if (rules.land_holding_max_acres != null) {
    if (profile.land_holding_acres == null && !profile.special_conditions.includes('has_land')) {
      missing.push({
        criterion: 'land_holding_acres',
        label: 'Agricultural Landholding',
        passed: false,
        user_value: null,
        required_value: `Up to ${rules.land_holding_max_acres} acres cultivable land`,
        reason: 'Information regarding agricultural land ownership is needed.',
        is_missing: true
      });
    } else if (profile.land_holding_acres != null) {
      if (profile.land_holding_acres <= rules.land_holding_max_acres) {
        matched.push({
          criterion: 'land_holding_acres',
          label: 'Agricultural Landholding',
          passed: true,
          user_value: `${profile.land_holding_acres} acres`,
          required_value: `Up to ${rules.land_holding_max_acres} acres`,
          reason: `Your landholding of ${profile.land_holding_acres} acres is within the small/marginal farmer limit of ${rules.land_holding_max_acres} acres.`
        });
      } else {
        unmatched.push({
          criterion: 'land_holding_acres',
          label: 'Agricultural Landholding',
          passed: false,
          user_value: `${profile.land_holding_acres} acres`,
          required_value: `Up to ${rules.land_holding_max_acres} acres`,
          reason: `Landholding of ${profile.land_holding_acres} acres exceeds the scheme limit of ${rules.land_holding_max_acres} acres.`
        });
      }
    } else if (profile.special_conditions.includes('has_land')) {
      // User says they have land, but exact acreage isn't explicitly recorded
      matched.push({
        criterion: 'land_holding_acres',
        label: 'Agricultural Landholding',
        passed: true,
        user_value: 'Landholder confirmed',
        required_value: `Up to ${rules.land_holding_max_acres} acres`,
        reason: 'Land ownership confirmed. Eligible as small/marginal farmer.'
      });
    }
  }

  // 7. Special Conditions Evaluation
  if (rules.required_conditions && rules.required_conditions.length > 0) {
    for (const cond of rules.required_conditions) {
      let hasCondition = profile.special_conditions.includes(cond);

      // Category-based resolution: OBC, SC, ST categories satisfy caste_certificate
      if (cond === 'caste_certificate' && profile.category && profile.category !== 'general') {
        hasCondition = true;
      }

      const conditionLabel = formatConditionLabel(cond);

      if (hasCondition) {
        matched.push({
          criterion: `condition_${cond}`,
          label: conditionLabel,
          passed: true,
          user_value: 'Yes / Verified',
          required_value: 'Mandatory',
          reason: `Meets requirement: ${conditionLabel}.`
        });
      } else {
        // If occupation matches, treat as missing rather than hard failure
        const isOccupationMatched = profile.occupation === rules.occupation || rules.occupation === 'universal' || rules.occupation === 'any';
        if (isOccupationMatched) {
          missing.push({
            criterion: `condition_${cond}`,
            label: conditionLabel,
            passed: false,
            user_value: 'Not specified',
            required_value: 'Mandatory',
            reason: `Requires verification of: ${conditionLabel}.`,
            is_missing: true
          });
        } else {
          unmatched.push({
            criterion: `condition_${cond}`,
            label: conditionLabel,
            passed: false,
            user_value: 'Not met',
            required_value: 'Mandatory',
            reason: `Did not satisfy mandatory requirement: ${conditionLabel}.`
          });
        }
      }
    }
  }

  // 8. Excluded Conditions Evaluation
  if (rules.excluded_conditions && rules.excluded_conditions.length > 0) {
    for (const excl of rules.excluded_conditions) {
      const hasExclusion = profile.special_conditions.includes(excl);
      if (hasExclusion) {
        unmatched.push({
          criterion: `exclusion_${excl}`,
          label: `Exclusion: ${formatConditionLabel(excl)}`,
          passed: false,
          user_value: 'Disqualifying flag present',
          required_value: 'Must not apply',
          reason: `You are disqualified due to: ${formatConditionLabel(excl)}.`
        });
      }
    }
  }

  // Calculate Deterministic Confidence Score
  const totalCriteria = matched.length + unmatched.length + missing.length;
  const confidenceScore = totalCriteria > 0 ? Math.round((matched.length / totalCriteria) * 100) : 0;

  // Determine Verdict Status
  let status: 'ELIGIBLE' | 'NOT_ELIGIBLE' | 'NEEDS_MORE_INFO';
  let targetFollowupField: string | null = null;
  let targetFollowupQuestion: string | null = null;
  let explanation: string;

  if (unmatched.length > 0) {
    status = 'NOT_ELIGIBLE';
    explanation = `Likely not eligible based on ${unmatched.length} unmet ${unmatched.length === 1 ? 'criterion' : 'criteria'}: ${unmatched.map((u) => u.label).join(', ')}.`;
  } else if (missing.length > 0) {
    status = 'NEEDS_MORE_INFO';
    const firstMissing = missing[0];
    targetFollowupField = firstMissing.criterion;
    targetFollowupQuestion = generateTargetQuestion(scheme, firstMissing.criterion);
    explanation = `Meets ${matched.length} criteria, but requires verification of ${missing.map((m) => m.label).join(', ')} to confirm full eligibility.`;
  } else {
    status = 'ELIGIBLE';
    explanation = `Fully eligible! You satisfy all ${matched.length} evaluated criteria with 100% confidence.`;
  }

  return {
    status,
    confidence_score: confidenceScore,
    matched_criteria: matched,
    unmatched_criteria: unmatched,
    missing_criteria: missing,
    target_followup_field: targetFollowupField,
    target_followup_question: targetFollowupQuestion,
    summary_explanation: explanation,
    is_fuzzy_occupation_match: options?.isFuzzyOccupation
  };
}

function formatConditionLabel(conditionKey: string): string {
  const map: Record<string, string> = {
    has_land: 'Agricultural Landholder',
    bpl_card: 'BPL / Antyodaya Ration Card',
    student_enrolled: 'Recognized School/College Enrollment',
    disability_40_plus: 'Disability Certificate (40%+)',
    registered_fisherman: 'Registered with Fisheries Dept',
    vendor_id_or_recommendation: 'ULB Vending ID or Recommendation',
    central_govt_employee_or_pensioner: 'Central Govt Employee / Pensioner',
    ex_serviceman_pensioner: 'Ex-Serviceman Defence Pensioner',
    teaching_service_10yrs: '10+ Years Regular Teaching Service',
    savings_bank_account: 'Aadhaar-Linked Bank Account',
    unorganized_worker: 'Unorganized Worker Status',
    non_farm_enterprise: 'Non-Farm Micro Enterprise'
  };
  return map[conditionKey] || conditionKey.replace(/_/g, ' ');
}

function generateTargetQuestion(scheme: Scheme, missingCriterion: string): string {
  switch (missingCriterion) {
    case 'land_holding_acres':
      return `To verify your eligibility for ${scheme.short_name}, could you please let me know if your family owns agricultural land, and how many acres you cultivate?`;
    case 'annual_income':
      return `To verify your eligibility for ${scheme.short_name}, what is your approximate total household annual income?`;
    case 'age':
      return `What is your current age in years? ${scheme.short_name} has specific age criteria.`;
    case 'condition_has_land':
      return `Does your family own cultivable agricultural land registered in your name?`;
    case 'condition_bpl_card':
      return `Do you or your household possess a Below Poverty Line (BPL) or Antyodaya ration card?`;
    case 'condition_student_enrolled':
      return `Are you currently enrolled in a recognized school, college, or university program?`;
    case 'condition_disability_40_plus':
      return `Do you have a certified Unique Disability ID (UDID) card or medical certificate showing 40% or more disability?`;
    case 'condition_vendor_id_or_recommendation':
      return `Do you hold a Certificate of Vending or a Letter of Recommendation issued by your Urban Local Body (municipality)?`;
    case 'condition_registered_fisherman':
      return `Are you registered as an active fisher or fish farmer with your State Fisheries Department?`;
    case 'condition_central_govt_employee_or_pensioner':
      return `Are you a current or retired employee of the Central Government drawing salary or pension from Civil Estimates?`;
    case 'condition_ex_serviceman_pensioner':
      return `Are you an ex-serviceman or defence pensioner drawing pension from the Armed Forces?`;
    default:
      return `To finalize your eligibility for ${scheme.short_name}, could you please confirm if you satisfy the ${missingCriterion.replace(/condition_|_/g, ' ')} requirement?`;
  }
}
