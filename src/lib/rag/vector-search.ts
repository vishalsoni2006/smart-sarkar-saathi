import { Citation, Scheme, SchemeChunk } from '@/types';
import { VERIFIED_SCHEMES } from '@/data/schemes';

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

/**
 * Retrieve top-k relevant chunks across ALL 15 verified sovereign schemes
 */
export function searchAllSchemes(query: string, topK: number = 6): RetrievalResult[] {
  const queryTokens = tokenize(query);
  const allResults: RetrievalResult[] = [];

  for (const scheme of VERIFIED_SCHEMES) {
    for (const chunk of scheme.chunks) {
      const chunkTokens = tokenize(
        `${scheme.short_name} ${scheme.name} ${scheme.category} ${scheme.benefit_summary} ${chunk.title} ${chunk.section} ${chunk.content}`
      );
      const score = computeCosineScore(queryTokens, chunkTokens);
      if (score > 0.05) {
        allResults.push({
          chunk,
          score,
          citation: {
            scheme_id: scheme.id,
            scheme_name: scheme.short_name,
            section: chunk.section,
            source_excerpt: chunk.content,
            citation_label: chunk.citation_tag
          }
        });
      }
    }
  }

  allResults.sort((a, b) => b.score - a.score);
  return allResults.slice(0, topK);
}

/**
 * Map user query to target occupational schemes
 */
export function getSchemesForOccupation(query: string): Scheme[] {
  const q = query.toLowerCase();

  // Student / Scholarship
  if (
    q.includes('student') ||
    q.includes('scholarship') ||
    q.includes('study') ||
    q.includes('college') ||
    q.includes('school') ||
    q.includes('छात्र') ||
    q.includes('विद्यार्थी') ||
    q.includes('पढ़ाई') ||
    q.includes('शिष्यवृत्ती')
  ) {
    return VERIFIED_SCHEMES.filter(
      (s) => s.id === 'pm-yasasvi' || s.id === 'post-matric-scholarship'
    );
  }

  // Farmer / Agriculture
  if (
    q.includes('farm') ||
    q.includes('kisan') ||
    q.includes('crop') ||
    q.includes('agriculture') ||
    q.includes('land') ||
    q.includes('किसान') ||
    q.includes('कृषि') ||
    q.includes('खेती') ||
    q.includes('शेतकरी')
  ) {
    return VERIFIED_SCHEMES.filter(
      (s) => s.id === 'pm-kisan' || s.id === 'pm-mudra' || s.id === 'pmmsy'
    );
  }

  // Street vendor / hawker
  if (
    q.includes('vendor') ||
    q.includes('hawker') ||
    q.includes('street') ||
    q.includes('फेरीवाले') ||
    q.includes('ठेले') ||
    q.includes('रेहड़ी') ||
    q.includes('पथविक्रेते')
  ) {
    return VERIFIED_SCHEMES.filter((s) => s.id === 'pm-svanidhi' || s.id === 'pm-sym');
  }

  // Business / Entrepreneur / Startup / Unemployed / Youth
  if (
    q.includes('business') ||
    q.includes('startup') ||
    q.includes('loan') ||
    q.includes('entrepreneur') ||
    q.includes('unemployed') ||
    q.includes('youth') ||
    q.includes('job') ||
    q.includes('व्यवसाय') ||
    q.includes('उद्योजक') ||
    q.includes('रोजगार') ||
    q.includes('बेरोजगार') ||
    q.includes('उद्योग')
  ) {
    return VERIFIED_SCHEMES.filter((s) => s.id === 'pmegp' || s.id === 'pm-mudra');
  }

  // Senior Citizens / Pension
  if (
    q.includes('pension') ||
    q.includes('senior') ||
    q.includes('old age') ||
    q.includes('elderly') ||
    q.includes('पेंशन') ||
    q.includes('बुजुर्ग') ||
    q.includes('वृद्ध') ||
    q.includes('वय') ||
    q.includes('निवृत्ती')
  ) {
    return VERIFIED_SCHEMES.filter(
      (s) =>
        s.id === 'ab-pmjay' ||
        s.id === 'atal-pension-yojana' ||
        s.id === 'ignoaps-pension' ||
        s.id === 'pm-sym'
    );
  }

  // Disability / Divyangjan
  if (
    q.includes('disab') ||
    q.includes('handicap') ||
    q.includes('divyang') ||
    q.includes('दिव्यांग') ||
    q.includes('अपंग')
  ) {
    return VERIFIED_SCHEMES.filter((s) => s.id === 'adip-divyangjan');
  }

  // Healthcare / Medical
  if (
    q.includes('health') ||
    q.includes('hospital') ||
    q.includes('medical') ||
    q.includes('treatment') ||
    q.includes('doctor') ||
    q.includes('स्वास्थ्य') ||
    q.includes('इलाज') ||
    q.includes('आरोग्य')
  ) {
    return VERIFIED_SCHEMES.filter(
      (s) => s.id === 'ab-pmjay' || s.id === 'cghs' || s.id === 'echs-defence'
    );
  }

  // Fishermen
  if (
    q.includes('fish') ||
    q.includes('matsya') ||
    q.includes('मछुआरे') ||
    q.includes('मच्छीमार')
  ) {
    return VERIFIED_SCHEMES.filter((s) => s.id === 'pmmsy');
  }

  // Defence / Ex-servicemen
  if (
    q.includes('defence') ||
    q.includes('army') ||
    q.includes('soldier') ||
    q.includes('ex-servicemen') ||
    q.includes('सैनिक') ||
    q.includes('फौज')
  ) {
    return VERIFIED_SCHEMES.filter((s) => s.id === 'echs-defence');
  }

  // Teachers
  if (
    q.includes('teacher') ||
    q.includes('school teacher') ||
    q.includes('शिक्षक') ||
    q.includes('गुरु')
  ) {
    return VERIFIED_SCHEMES.filter((s) => s.id === 'national-award-teachers');
  }

  // Default: check if query matches any occupation_tags in verified schemes
  const matches = VERIFIED_SCHEMES.filter((s) =>
    s.occupation_tags.some((tag) => q.includes(tag.toLowerCase()))
  );

  return matches;
}

/**
 * Complete official portal & scheme knowledge base overview
 */
export function getPortalKnowledgeSummary(): string {
  return `
PORTAL ARCHITECTURE & EXISTING CAPABILITIES:
- Portal Name: Smart Sarkar Saathi (myScheme AI Sovereign Navigator)
- Live Core Systems:
  1. Eligibility Engine (/check-eligibility): Instant 1-click deterministic verification of citizen criteria (age, annual income, occupation, category, state) against all 15 schemes.
  2. Occupation Questionnaire (/occupation-questions): Profession-tailored questions for farmers, students, street vendors, entrepreneurs, teachers, etc.
  3. Schemes Directory (/dashboard): 15 verified sovereign schemes directory with category filters.
  4. Grounded Chatbot: Available globally on every page and on individual scheme pages (/schemes/[id]) with Multilingual Regional Voice Mode (Microphone & Audio answers in Hindi, Marathi, Bengali, Tamil, Telugu, English).
  5. Saved Schemes (/saved): Personal bookmarking tray stored in Firebase Firestore and localStorage.
  6. Citizen Login (/login): Registration and secure authentication stored in Firebase Firestore.

ALL 15 VERIFIED SOVEREIGN SCHEMES KNOWLEDGE BASE:
1. PM-KISAN (Pradhan Mantri Kisan Samman Nidhi):
   - Occupation: Farmers
   - Financial Benefit: ₹6,000 per year directly transferred to bank accounts in 3 equal four-monthly installments of ₹2,000 via DBT.
   - Eligibility: Landholding farmer families owning cultivable land up to 5 acres with revenue land records. Excludes institutional landholders and income taxpayers.
   - Portal: https://pmkisan.gov.in | Details: /schemes/pm-kisan

2. PMMSY (Pradhan Mantri Matsya Sampada Yojana):
   - Occupation: Fishermen, Fish Farmers, Self Help Groups
   - Financial Benefit: Up to ₹30 Lakh financial assistance and subsidy for aquaculture, biofloc, cold water fisheries, motorized boats, safety kits, ice plants.
   - Portal: https://pmmsy.dof.gov.in | Details: /schemes/pmmsy

3. Post-Matric Scholarship for SC/OBC/EBC/DNT:
   - Occupation: Students (Class 11, 12, ITI, Diploma, Degree, PG, Ph.D.)
   - Financial Benefit: 100% compulsory tuition and academic fees reimbursement + monthly maintenance allowance (₹2,500 to ₹13,500 per year).
   - Eligibility: Recognized post-matric courses, annual parental income cap of ₹2.5 Lakh.
   - Portal: https://scholarships.gov.in | Details: /schemes/post-matric-scholarship

4. PM-YASASVI (PM Young Achievers Scholarship Award Scheme for Vibrant India):
   - Occupation: Students (OBC, EBC, DNT in Top Class Schools)
   - Financial Benefit: Class 9 & 10 scholarship of ₹75,000 per year; Class 11 & 12 scholarship of ₹1,25,000 per year covering school tuition and hostel fees.
   - Eligibility: Annual family income under ₹2.5 Lakh studying in shortlisted schools.
   - Portal: https://yet.nta.ac.in | Details: /schemes/pm-yasasvi

5. National Award to Teachers (NAT):
   - Occupation: School Teachers
   - Benefit: Silver medal, certificate, ₹50,000 cash prize, and national felicitations by the President of India on Teachers' Day.
   - Eligibility: Regular teachers in recognized primary/middle/secondary/higher secondary schools with at least 10 years of service.
   - Portal: https://nationalawardstoteachers.education.gov.in | Details: /schemes/national-award-teachers

6. CGHS (Central Government Health Scheme):
   - Occupation: Central Government Employees & Pensioners
   - Benefit: Comprehensive cashless inpatient (IPD) & outpatient (OPD) healthcare in wellness centres and empanelled private super-specialty hospitals.
   - Eligibility: Serving and retired Central Government civil employees and eligible dependents.
   - Portal: https://cghs.nic.in | Details: /schemes/cghs

7. PM SVANidhi (PM Street Vendor's AtmaNirbhar Nidhi):
   - Occupation: Urban Street Vendors, Hawkers, Thelawalas
   - Financial Benefit: Collateral-free working capital loan: 1st tranche ₹10,000; 2nd tranche ₹20,000; 3rd tranche ₹50,000. Features 7% interest subsidy and up to ₹1,200/year cashback on digital UPI transactions.
   - Eligibility: Urban vendors with Certificate of Vending (CoV) / Identity Card issued by ULB.
   - Portal: https://pmsvanidhi.mohua.gov.in | Details: /schemes/pm-svanidhi

8. PM MUDRA Yojana (PMMY):
   - Occupation: Micro-Entrepreneurs, Small Businesses, Artisans, Youth
   - Financial Benefit: Loans up to ₹20 Lakh with no collateral: Shishu (up to ₹50,000), Kishore (₹50,001 to ₹5 Lakh), Tarun (₹5 Lakh to ₹20 Lakh).
   - Eligibility: Non-farm, non-corporate micro/small enterprises.
   - Portal: https://www.mudra.org.in | Details: /schemes/pm-mudra

9. PM-SYM (Pradhan Mantri Shram Yogi Maandhan):
   - Occupation: Unorganized Workers (Domestic workers, drivers, construction workers, ragpickers, cobblers)
   - Financial Benefit: Guaranteed lifelong monthly pension of ₹3,000 after attaining age 60 with 50% family pension.
   - Eligibility: Age 18 to 40 years, monthly income ₹15,000 or less, possesses Aadhaar & Savings Bank Account.
   - Portal: https://maandhan.in | Details: /schemes/pm-sym

10. Atal Pension Yojana (APY):
    - Occupation: All Indian Citizens, Unorganized Sector
    - Financial Benefit: Guaranteed monthly pension of ₹1,000, ₹2,000, ₹3,000, ₹4,000, or ₹5,000 after age 60 depending on monthly contribution.
    - Eligibility: Indian citizen aged 18-40 with a bank savings account, not an income taxpayer.
    - Portal: https://npscra.nsdl.co.in | Details: /schemes/atal-pension-yojana

11. IGNOAPS (Indira Gandhi National Old Age Pension Scheme):
    - Occupation: Senior Citizens below poverty line (BPL)
    - Financial Benefit: Monthly pension of ₹200/month (age 60-79) and ₹500/month (age 80+) plus additional state government top-ups.
    - Eligibility: Age 60 years or above belonging to a verified BPL family.
    - Portal: https://nsap.nic.in | Details: /schemes/ignoaps-pension

12. ADIP Scheme (Assistance to Disabled Persons):
    - Occupation: Persons with Disabilities (Divyangjan)
    - Financial Benefit: 100% free modern assistive aids: motorized tricycles, wheelchairs, braille kits, behind-the-ear hearing aids, smart canes, and cochlear implants (up to ₹6 Lakh).
    - Eligibility: 40%+ benchmark disability certified by medical authority, monthly family income up to ₹30,000.
    - Portal: https://adip.alimbco.in | Details: /schemes/adip-divyangjan

13. PMEGP (Prime Minister's Employment Generation Programme):
    - Occupation: Unemployed Youth, Aspiring Entrepreneurs
    - Financial Benefit: Bank-financed capital subsidy: 15% to 35% margin money subsidy on projects up to ₹50 Lakh (Manufacturing) and up to ₹20 Lakh (Services).
    - Eligibility: Any individual aged 18+, at least 8th pass for projects above ₹10 Lakh in manufacturing.
    - Portal: https://www.kviconline.gov.in/pmegpep/ | Details: /schemes/pmegp

14. ECHS (Ex-Servicemen Contributory Health Scheme):
    - Occupation: Defence Ex-Servicemen & Veterans
    - Financial Benefit: Comprehensive cashless outpatient and inpatient medical care at military hospitals and nationwide empanelled private super-specialty hospitals.
    - Eligibility: Ex-servicemen drawing defence pension/disability pension and their legitimate dependents.
    - Portal: https://echs.gov.in | Details: /schemes/echs-defence

15. Ayushman Bharat PM-JAY (Pradhan Mantri Jan Arogya Yojana):
    - Occupation: Universal Health Cover for Low-Income Families & ALL Senior Citizens 70+
    - Financial Benefit: Cashless health assurance cover of ₹5 Lakh per family per year for secondary and tertiary care hospitalization across 27,000+ empanelled hospitals.
    - Special Expansion: Ayushman Vaya Vandana Card provides ₹5 Lakh free health cover to ALL senior citizens aged 70 and above, regardless of income.
    - Portal: https://pmjay.gov.in | Details: /schemes/ab-pmjay
`;
}
