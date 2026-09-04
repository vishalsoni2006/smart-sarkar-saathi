import { VERIFIED_SCHEMES } from '@/data/schemes';
import { evaluateEligibility } from '@/lib/rule-engine/evaluator';
import { EligibilityVerdict, Scheme, UserProfile } from '@/types';

export interface RankedScheme {
  scheme: Scheme;
  verdict: EligibilityVerdict;
  isFuzzyMatch?: boolean;
  fuzzyMatchScore?: number;
}

export interface DashboardRankings {
  topRecommendations: RankedScheme[];
  universalSchemes: RankedScheme[];
  likelyNotEligible: RankedScheme[];
  unmatchedRawOccupation?: string | null;
}

/**
 * Fuzzy similarity between user free-text occupation and scheme occupation tags
 */
export function calculateOccupationFuzzyScore(rawOccupation: string, tags: string[]): number {
  if (!rawOccupation || !tags || tags.length === 0) return 0;

  const rawClean = rawOccupation.toLowerCase().trim();
  const rawTokens = rawClean.split(/[\s,/-]+/).filter((t) => t.length > 2);

  let bestScore = 0;

  for (const tag of tags) {
    const tagClean = tag.toLowerCase().trim();

    // Exact match or substring
    if (tagClean === rawClean) return 1.0;
    if (rawClean.includes(tagClean) || tagClean.includes(rawClean)) {
      bestScore = Math.max(bestScore, 0.85);
    }

    // Token overlap
    for (const token of rawTokens) {
      if (tagClean.includes(token)) {
        bestScore = Math.max(bestScore, 0.75);
      }
    }

    // Levenshtein similarity for slight typos (e.g., 'kisaan' -> 'kisan')
    const distance = levenshtein(rawClean, tagClean);
    const maxLen = Math.max(rawClean.length, tagClean.length);
    const ratio = 1 - distance / maxLen;
    if (ratio > 0.7) {
      bestScore = Math.max(bestScore, ratio);
    }
  }

  return bestScore;
}

function levenshtein(a: string, b: string): number {
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

/**
 * Computes deterministic confidence and ranking for all schemes
 */
export function rankSchemesForUser(
  profile: UserProfile | null,
  schemes: Scheme[] = VERIFIED_SCHEMES
): DashboardRankings {
  if (!profile) {
    // Default preview without profile
    const allRanked: RankedScheme[] = schemes.map((s) => ({
      scheme: s,
      verdict: evaluateEligibility(s, null)
    }));

    return {
      topRecommendations: allRanked.slice(0, 6),
      universalSchemes: allRanked.filter((r) => r.scheme.eligibility.occupation === 'universal'),
      likelyNotEligible: []
    };
  }

  const isCustomOccupation = profile.occupation === 'other' && !!profile.occupation_raw;
  let hasAnyFuzzyMatch = false;

  const evaluated: RankedScheme[] = schemes.map((scheme) => {
    let isFuzzy = false;
    let fuzzyScore = 0;

    if (isCustomOccupation && profile.occupation_raw) {
      fuzzyScore = calculateOccupationFuzzyScore(profile.occupation_raw, scheme.occupation_tags);
      if (fuzzyScore >= 0.55) {
        isFuzzy = true;
        hasAnyFuzzyMatch = true;
      }
    }

    const verdict = evaluateEligibility(scheme, profile, { isFuzzyOccupation: isFuzzy });

    return {
      scheme,
      verdict,
      isFuzzyMatch: isFuzzy,
      fuzzyMatchScore: fuzzyScore
    };
  });

  // Sort by confidence score descending, then by status (ELIGIBLE > NEEDS_MORE_INFO > NOT_ELIGIBLE)
  const statusWeight: Record<string, number> = {
    ELIGIBLE: 3,
    NEEDS_MORE_INFO: 2,
    NOT_ELIGIBLE: 1
  };

  evaluated.sort((a, b) => {
    const statusDiff = statusWeight[b.verdict.status] - statusWeight[a.verdict.status];
    if (statusDiff !== 0) return statusDiff;
    return b.verdict.confidence_score - a.verdict.confidence_score;
  });

  // Partition into categories
  const topRecommendations: RankedScheme[] = [];
  const universalSchemes: RankedScheme[] = [];
  const likelyNotEligible: RankedScheme[] = [];

  for (const item of evaluated) {
    if (item.verdict.status === 'NOT_ELIGIBLE') {
      likelyNotEligible.push(item);
    } else if (item.scheme.eligibility.occupation === 'universal' || item.scheme.eligibility.occupation === 'any') {
      universalSchemes.push(item);
      if (topRecommendations.length < 4) {
        topRecommendations.push(item);
      }
    } else {
      topRecommendations.push(item);
    }
  }

  return {
    topRecommendations,
    universalSchemes,
    likelyNotEligible,
    unmatchedRawOccupation: isCustomOccupation && !hasAnyFuzzyMatch ? profile.occupation_raw : null
  };
}
