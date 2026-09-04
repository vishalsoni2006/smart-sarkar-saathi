export type OccupationType =
  | 'farmer'
  | 'fisherman'
  | 'student'
  | 'teacher'
  | 'government_employee'
  | 'defence_personnel'
  | 'unorganized_worker'
  | 'street_vendor'
  | 'entrepreneur'
  | 'senior_citizen'
  | 'person_with_disability'
  | 'unemployed'
  | 'other';

export type GenderType = 'any' | 'male' | 'female' | 'transgender';

export type CategoryType = 'general' | 'obc' | 'sc' | 'st' | 'ews' | 'any';

export interface EligibilityRules {
  occupation?: OccupationType | 'universal' | 'any';
  income_max?: number | null; // Annual income in INR (null if no cap)
  income_min?: number | null;
  age_min?: number | null;
  age_max?: number | null;
  gender?: GenderType;
  state?: string; // 'all' or specific state name
  land_holding_max_acres?: number | null; // e.g., 5 acres for small farmers
  required_conditions?: string[]; // e.g., ['bpl_card', 'udid_card', 'student_enrolled', 'disability_40_plus']
  excluded_conditions?: string[]; // e.g., ['institutional_taxpayer', 'epfo_member']
}

export interface SchemeChunk {
  id: string;
  title: string;
  section: string;
  content: string;
  citation_tag: string;
}

export interface Scheme {
  id: string;
  name: string;
  short_name: string;
  ministry: string;
  category: string; // e.g., 'Agriculture', 'Education', 'Social Welfare'
  category_icon: string; // Lucide icon identifier
  benefit_summary: string;
  benefit_details: string[];
  eligibility: EligibilityRules;
  occupation_tags: string[]; // Synonyms for fuzzy embedding matching
  source_text: string; // Full official text for RAG
  chunks: SchemeChunk[];
  official_apply_url: string;
  required_documents: string[];
  last_verified: string; // ISO date 'YYYY-MM-DD'
  application_steps?: string[];
  official_contact?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  mobile?: string;
  age?: number | null;
  annual_income?: number | null;
  occupation: OccupationType;
  occupation_raw?: string | null; // Free-text if occupation is 'other'
  state: string;
  gender: GenderType;
  category: CategoryType;
  special_conditions: string[]; // ['bpl_card', 'has_land', 'disability_40_plus', 'student_enrolled', 'ex_serviceman', etc.]
  land_holding_acres?: number | null;
  monthly_income?: number | null;
  occupation_specific_data?: Record<string, any>;
  updated_at: string;
}

export type VerdictStatus = 'ELIGIBLE' | 'NOT_ELIGIBLE' | 'NEEDS_MORE_INFO';

export interface CriterionResult {
  criterion: string;
  label: string;
  passed: boolean;
  user_value: string | number | boolean | null;
  required_value: string | number | boolean | null;
  reason: string;
  is_missing?: boolean;
}

export interface EligibilityVerdict {
  status: VerdictStatus;
  confidence_score: number; // 0 to 100
  matched_criteria: CriterionResult[];
  unmatched_criteria: CriterionResult[];
  missing_criteria: CriterionResult[];
  target_followup_field?: string | null; // The exact single field needed to flip to Eligible
  target_followup_question?: string | null; // Pre-crafted question in English
  summary_explanation: string;
  is_fuzzy_occupation_match?: boolean;
}

export interface Citation {
  scheme_id: string;
  scheme_name: string;
  section: string;
  source_excerpt: string;
  citation_label: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  detected_language?: string;
  citations?: Citation[];
  suggested_prompts?: string[];
  timestamp: string;
  is_verdict_followup?: boolean;
  field_updated?: string;
}

export interface UnmatchedOccupation {
  occupation_raw: string;
  count: number;
  first_seen: string;
  last_seen: string;
}

export interface SavedScheme {
  scheme_id: string;
  saved_at: string;
  notes?: string;
}
