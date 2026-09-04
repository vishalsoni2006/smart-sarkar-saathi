import { Citation, Scheme, SchemeChunk } from '@/types';

export interface RetrievalResult {
  chunk: SchemeChunk;
  score: number;
  citation: Citation;
}

/**
 * Clean and tokenize text for vector/semantic comparison
 */
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s\u0900-\u097F]/g, ' ') // support English and Devanagari Unicode
    .split(/\s+/)
    .filter((w) => w.length > 2);
}

/**
 * Calculate term-frequency semantic overlap (BM25-inspired cosine similarity)
 */
function computeCosineScore(queryTokens: string[], docTokens: string[]): number {
  if (queryTokens.length === 0 || docTokens.length === 0) return 0;

  const queryFreq: Record<string, number> = {};
  for (const t of queryTokens) queryFreq[t] = (queryFreq[t] || 0) + 1;

  const docFreq: Record<string, number> = {};
  for (const t of docTokens) docFreq[t] = (docFreq[t] || 0) + 1;

  let dotProduct = 0;
  for (const term in queryFreq) {
    if (docFreq[term]) {
      dotProduct += queryFreq[term] * docFreq[term];
    }
  }

  const queryNorm = Math.sqrt(Object.values(queryFreq).reduce((sum, v) => sum + v * v, 0));
  const docNorm = Math.sqrt(Object.values(docFreq).reduce((sum, v) => sum + v * v, 0));

  if (queryNorm === 0 || docNorm === 0) return 0;
  return dotProduct / (queryNorm * docNorm);
}

/**
 * Retrieve top-k relevant chunks from a scheme's verified knowledge base
 */
export function retrieveRelevantChunks(
  query: string,
  scheme: Scheme,
  topK: number = 3,
  similarityThreshold: number = 0.15
): RetrievalResult[] {
  const queryTokens = tokenize(query);

  const results: RetrievalResult[] = scheme.chunks.map((chunk) => {
    const chunkTokens = tokenize(`${chunk.title} ${chunk.section} ${chunk.content}`);
    const score = computeCosineScore(queryTokens, chunkTokens);

    return {
      chunk,
      score,
      citation: {
        scheme_id: scheme.id,
        scheme_name: scheme.short_name,
        section: chunk.section,
        source_excerpt: chunk.content,
        citation_label: chunk.citation_tag
      }
    };
  });

  // Sort by relevance score descending
  results.sort((a, b) => b.score - a.score);

  // Filter by threshold
  const relevant = results.filter((r) => r.score >= similarityThreshold);

  // If specific chunks didn't hit threshold, but query mentions generic words (documents, eligibility, benefits, apply)
  if (relevant.length === 0) {
    const lowerQ = query.toLowerCase();
    const fallbackResults: RetrievalResult[] = [];

    if (lowerQ.includes('doc') || lowerQ.includes('paper') || lowerQ.includes('proof') || lowerQ.includes('दस्तावेज') || lowerQ.includes('कागजात')) {
      fallbackResults.push({
        chunk: {
          id: `${scheme.id}-docs`,
          title: 'Required Documents',
          section: 'Official Checklist',
          content: `Required Documents for ${scheme.short_name}: ${scheme.required_documents.join(', ')}.`,
          citation_tag: `${scheme.short_name} Official Documents List`
        },
        score: 0.8,
        citation: {
          scheme_id: scheme.id,
          scheme_name: scheme.short_name,
          section: 'Required Documents',
          source_excerpt: scheme.required_documents.join(', '),
          citation_label: `${scheme.short_name} Documents Checklist`
        }
      });
    }

    if (lowerQ.includes('benefit') || lowerQ.includes('money') || lowerQ.includes('amount') || lowerQ.includes('लाभ') || lowerQ.includes('पैसे')) {
      fallbackResults.push({
        chunk: {
          id: `${scheme.id}-benefits`,
          title: 'Scheme Benefits',
          section: 'Financial Entitlement',
          content: `${scheme.benefit_summary} Details: ${scheme.benefit_details.join(' ')}`,
          citation_tag: `${scheme.short_name} Benefits Framework`
        },
        score: 0.8,
        citation: {
          scheme_id: scheme.id,
          scheme_name: scheme.short_name,
          section: 'Financial Benefits',
          source_excerpt: scheme.benefit_summary,
          citation_label: `${scheme.short_name} Benefit Guidelines`
        }
      });
    }

    if (lowerQ.includes('apply') || lowerQ.includes('how to') || lowerQ.includes('portal') || lowerQ.includes('आवेदन') || lowerQ.includes('रजिस्ट्रेशन')) {
      fallbackResults.push({
        chunk: {
          id: `${scheme.id}-apply`,
          title: 'Application Procedure',
          section: 'How to Apply',
          content: `Official Apply Portal: ${scheme.official_apply_url}. Steps: ${(scheme.application_steps || []).join(' ')}`,
          citation_tag: `${scheme.short_name} Application Manual`
        },
        score: 0.85,
        citation: {
          scheme_id: scheme.id,
          scheme_name: scheme.short_name,
          section: 'Application Portal',
          source_excerpt: scheme.official_apply_url,
          citation_label: `${scheme.short_name} Official Portal`
        }
      });
    }

    if (fallbackResults.length > 0) {
      return fallbackResults.slice(0, topK);
    }
  }

  return relevant.slice(0, topK);
}
