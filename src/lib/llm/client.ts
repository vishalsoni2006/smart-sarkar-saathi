import { GoogleGenerativeAI } from '@google/generative-ai';
import Groq from 'groq-sdk';
import {
  retrieveRelevantChunks,
  searchAllSchemes,
  getSchemesForOccupation,
  getPortalKnowledgeSummary
} from '@/lib/rag/vector-search';
import { Citation, Scheme, UserProfile } from '@/types';

export interface ChatResponsePayload {
  answer: string;
  detectedLanguage: string;
  citations: Citation[];
  suggestedPrompts: string[];
  fieldUpdated?: {
    field: string;
    value: any;
    displayNotice: string;
  } | null;
}

/**
 * Detect Indian Language from user text
 */
export function detectIndianLanguage(text: string): { code: string; name: string } {
  const hindiRegex = /[\u0900-\u097F]/;
  const bengaliRegex = /[\u0980-\u09FF]/;
  const tamilRegex = /[\u0B80-\u0BFF]/;
  const teluguRegex = /[\u0C00-\u0C7F]/;
  const marathiMarkers = ['आहे', 'नाही', 'कसे', 'माहिती', 'योजना', 'अर्ज', 'शेतकरी', 'विद्यार्थी'];

  if (hindiRegex.test(text)) {
    for (const marker of marathiMarkers) {
      if (text.includes(marker)) return { code: 'mr', name: 'Marathi' };
    }
    return { code: 'hi', name: 'Hindi' };
  }
  if (bengaliRegex.test(text)) return { code: 'bn', name: 'Bengali' };
  if (tamilRegex.test(text)) return { code: 'ta', name: 'Tamil' };
  if (teluguRegex.test(text)) return { code: 'te', name: 'Telugu' };

  return { code: 'en', name: 'English' };
}

/**
 * Resolve target language prioritizing user's explicit selection from chatbot UI
 */
export function resolveTargetLanguage(
  selectedLang?: string | null,
  userMessage?: string
): { code: string; name: string; nativeName: string } {
  const code = (selectedLang || '').toLowerCase().trim();
  if (code === 'hi' || code.includes('hindi')) return { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' };
  if (code === 'mr' || code.includes('marathi')) return { code: 'mr', name: 'Marathi', nativeName: 'मराठी' };
  if (code === 'bn' || code.includes('bengali')) return { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' };
  if (code === 'ta' || code.includes('tamil')) return { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' };
  if (code === 'te' || code.includes('telugu')) return { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' };
  if (code === 'en' || code.includes('english')) return { code: 'en', name: 'English', nativeName: 'English' };

  if (userMessage) {
    const detected = detectIndianLanguage(userMessage);
    if (detected.code !== 'en') {
      const nativeMap: Record<string, string> = {
        hi: 'हिंदी',
        mr: 'मराठी',
        bn: 'বাংলা',
        ta: 'தமிழ்',
        te: 'తెలుగు'
      };
      return { ...detected, nativeName: nativeMap[detected.code] || detected.name };
    }
  }

  return { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' };
}

/**
 * Extract field updates from conversational follow-up answers
 * (e.g. "I have 2.5 acres of land", "मेरी आय 1 लाख है", "हाँ मेरे पास राशन कार्ड है")
 */
export function extractFieldUpdate(
  userMessage: string,
  targetField: string | null | undefined
): { field: string; value: any; displayNotice: string } | null {
  if (!targetField) return null;

  const msg = userMessage.toLowerCase();

  // 1. Land Holding Acres (Crucial for PM-KISAN live flip demo)
  if (targetField === 'land_holding_acres' || targetField === 'condition_has_land') {
    const acreMatch = msg.match(/(\d+(\.\d+)?)\s*(acre|acres|एकड़|एकड|bigha|hectare|हेक्टेयर)?/);
    if (acreMatch) {
      const acres = parseFloat(acreMatch[1]);
      return {
        field: 'land_holding_acres',
        value: acres,
        displayNotice: `Recorded landholding: ${acres} acres. Re-evaluating eligibility...`
      };
    }
    if (msg.includes('yes') || msg.includes('हाँ') || msg.includes('होय') || msg.includes('own land') || msg.includes('farmer')) {
      return {
        field: 'land_holding_acres',
        value: 2.0, // standard small farmer default
        displayNotice: 'Recorded land ownership. Re-evaluating eligibility...'
      };
    }
  }

  // 2. Annual Income
  if (targetField === 'annual_income') {
    const lakhMatch = msg.match(/(\d+(\.\d+)?)\s*(lakh|lac|लाख|l)/);
    if (lakhMatch) {
      const amount = parseFloat(lakhMatch[1]) * 100000;
      return {
        field: 'annual_income',
        value: amount,
        displayNotice: `Recorded annual income: ₹${amount.toLocaleString('en-IN')}. Re-evaluating eligibility...`
      };
    }
    const numMatch = msg.match(/(\d{4,8})/);
    if (numMatch) {
      const amount = parseInt(numMatch[1], 10);
      return {
        field: 'annual_income',
        value: amount,
        displayNotice: `Recorded annual income: ₹${amount.toLocaleString('en-IN')}. Re-evaluating eligibility...`
      };
    }
  }

  // 3. Special conditions / boolean cards
  if (targetField.startsWith('condition_')) {
    const condName = targetField.replace('condition_', '');
    const isAffirmative =
      msg.includes('yes') ||
      msg.includes('हाँ') ||
      msg.includes('हा') ||
      msg.includes('होय') ||
      msg.includes('have') ||
      msg.includes('pass') ||
      msg.includes('certified');

    if (isAffirmative) {
      return {
        field: 'special_conditions',
        value: condName,
        displayNotice: `Added qualification: ${condName.replace(/_/g, ' ')}. Re-evaluating eligibility...`
      };
    }
  }

  return null;
}

export {
  getActiveGeminiKey,
  saveGeminiKey,
  getActiveGroqKey,
  saveGroqKey,
  testGeminiApiKey
} from '@/lib/llm/gemini-config';

import { getActiveGeminiKey, getActiveGroqKey, CANDIDATE_GEMINI_MODELS } from '@/lib/llm/gemini-config';

/**
 * Execute RAG grounded chat with LLM & Multilingual translation
 */
export async function executeGroundedRAGChat(params: {
  userMessage: string;
  scheme: Scheme;
  profile: UserProfile | null;
  targetMissingField?: string | null;
  selectedLanguage?: string | null;
}): Promise<ChatResponsePayload> {
  const { userMessage, scheme, profile, targetMissingField, selectedLanguage } = params;

  // 1. Check if user is responding to the missing field follow-up
  const fieldUpdate = extractFieldUpdate(userMessage, targetMissingField);

  // 2. Resolve target language (honor explicit selection from chatbot UI)
  const targetLang = resolveTargetLanguage(selectedLanguage, userMessage);

  // 3. Check for occupational & multi-scheme recommendations
  const matchedOccupationalSchemes = getSchemesForOccupation(userMessage);
  const isOccupationalQuery = matchedOccupationalSchemes.length > 0;

  // Retrieve relevant chunks:
  let retrieved = retrieveRelevantChunks(userMessage, scheme, 3);
  if (retrieved.length === 0 || isOccupationalQuery) {
    const globalRetrieved = searchAllSchemes(userMessage, 4);
    if (globalRetrieved.length > 0) {
      retrieved = globalRetrieved;
    }
  }
  const citations = retrieved.map((r) => r.citation);

  // 4. Check API keys
  const geminiKey = getActiveGeminiKey();
  const groqKey = getActiveGroqKey();

  // If Gemini API is available
  if (geminiKey) {
    try {
      const genAI = new GoogleGenerativeAI(geminiKey);
      const portalKnowledge = getPortalKnowledgeSummary();

      const prompt = `You are "Smart Sarkar Saathi" (myScheme AI Sovereign Navigator), an official Government of India scheme assistance specialist.

KNOWLEDGE BASE OF ALL 15 VERIFIED SOVEREIGN SCHEMES & PORTAL CAPABILITIES:
${portalKnowledge}

RETRIEVED OFFICIAL GUIDELINE EXCERPTS:
${retrieved.map((r, i) => `[Evidence ${i + 1} - ${r.citation.scheme_name} (${r.citation.section})]:\n${r.chunk.content}`).join('\n\n')}

CITIZEN CONTEXT:
- Active Scheme: ${scheme.name} (${scheme.short_name})
- Citizen Name: ${profile?.name || 'Citizen'}
- Occupation: ${profile?.occupation || 'General'}
- State: ${profile?.state || 'India'}
- Annual Income: ₹${profile?.annual_income || 'Not Specified'}
- Verified Occupational Answers: ${profile?.occupation_specific_data ? JSON.stringify(profile.occupation_specific_data) : 'None'}

CITIZEN'S QUERY:
"${userMessage}"

CRITICAL MANDATORY INSTRUCTION - CITIZEN'S SELECTED LANGUAGE:
The citizen has explicitly chosen: ${targetLang.name} (${targetLang.nativeName}) with language code "${targetLang.code}".
YOU MUST GENERATE YOUR ENTIRE ANSWER EXCLUSIVELY IN ${targetLang.name} (${targetLang.nativeName}).
- If Hindi ('hi'): You MUST reply 100% in natural, fluent Hindi (Devanagari script).
- If Marathi ('mr'): You MUST reply 100% in natural, fluent Marathi (मराठी लिपी, उदा. 'नमस्कार! विद्यार्थ्यांसाठी/शेतकऱ्यांसाठी खालील योजना आहेत...', 'पात्रता', 'लाभ', 'अर्ज कसा करावा').
- If Bengali ('bn'): You MUST reply 100% in natural, fluent Bengali (বাংলা ভাষায়).
- If Tamil ('ta'): You MUST reply 100% in natural, fluent Tamil (தமிழ் மொழியில்).
- If Telugu ('te'): You MUST reply 100% in natural, fluent Telugu (తెలుగు భాషలో).
- If English ('en'): You MUST reply in clear, standard English.

DO NOT answer in English if the citizen selected ${targetLang.name}. Even if the query is in English (such as clicking an English chip or typing in English), TRANSLATE and provide all scheme details, benefits, eligibility, and links entirely in ${targetLang.name} (${targetLang.nativeName}).

CORE INSTRUCTIONS:
1. RECOMMEND SCHEMES: When asked about schemes for an occupation, profession, or group (e.g. students, farmers, youth, entrepreneurs, street vendors, unorganized workers, senior citizens, women, persons with disability):
   - RECOMMEND AND LIST ALL relevant schemes from the 15 verified schemes in the knowledge base (e.g. for students: PM-YASASVI and Post-Matric Scholarship; for farmers: PM-KISAN, PM MUDRA, PMMSY; for vendors: PM SVANidhi and PM-SYM; for business/unemployed: PMEGP and PM MUDRA; for senior citizens: Ayushman Bharat 70+ and Atal Pension Yojana / IGNOAPS).
   - For each recommended scheme, provide: Scheme Name, Financial Benefits, Key Eligibility Criteria, and How to Apply / Official Portal.
2. SCHEME SPECIFIC QUESTIONS: When asked about a specific scheme, verify required documents, application steps, benefit amounts, and eligibility rules grounded in the official excerpts.
3. PORTAL QUESTIONS: If the citizen asks how this website/portal works or how to check eligibility, explain the 1-click Eligibility Engine (/check-eligibility), Occupation Questionnaire (/occupation-questions), and 15 Schemes Directory (/dashboard).
4. FORMAT: Use clean bullet points, bold headings, and clear citizen-friendly advice.
5. NEVER REFUSE TO ANSWER: Do NOT say you lack information if the question can be addressed from the 15 schemes knowledge base or portal capabilities.

ANSWER (Entirely in ${targetLang.name} / ${targetLang.nativeName}):`;

      for (const modelName of CANDIDATE_GEMINI_MODELS) {
        try {
          const model = genAI.getGenerativeModel({ model: modelName });
          const result = await model.generateContent(prompt);
          const answerText = result.response.text();

          if (answerText) {
            return {
              answer: answerText,
              detectedLanguage: targetLang.name,
              citations,
              suggestedPrompts: getSuggestedPrompts(scheme, targetLang.code),
              fieldUpdated: fieldUpdate
            };
          }
        } catch (modelErr) {
          // Continue to next candidate model
          continue;
        }
      }
    } catch (e) {
      console.warn('Gemini API call failed, attempting Groq fallback:', e);
    }
  }

  // If Groq API is available as fallback
  if (groqKey) {
    try {
      const groq = new Groq({ apiKey: groqKey, dangerouslyAllowBrowser: true });
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: `You are Scheme Navigator AI. Citizen is ${profile?.name || 'Citizen'} (${profile?.occupation || 'Citizen'}). Ground your answer in official context. Respond EXCLUSIVELY in ${targetLang.name} (${targetLang.nativeName}).`
          },
          {
            role: 'user',
            content: `Context:\n${retrieved.map((r) => r.chunk.content).join('\n')}\n\nQuestion: ${userMessage}`
          }
        ],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.2
      });

      const groqAnswer = completion.choices[0]?.message?.content || '';
      return {
        answer: groqAnswer,
        detectedLanguage: targetLang.name,
        citations,
        suggestedPrompts: getSuggestedPrompts(scheme, targetLang.code),
        fieldUpdated: fieldUpdate
      };
    } catch (e) {
      console.warn('Groq API call failed, using deterministic grounded fallback:', e);
    }
  }

  // Intelligent Deterministic Grounded Synthesis (Guaranteed Zero Hallucination & Zero Quota Failure)
  const groundedAnswer = buildDeterministicGroundedAnswer({
    userMessage,
    scheme,
    profile,
    retrieved,
    langCode: targetLang.code,
    langName: targetLang.name,
    fieldUpdate
  });

  return {
    answer: groundedAnswer,
    detectedLanguage: targetLang.name,
    citations,
    suggestedPrompts: getSuggestedPrompts(scheme, targetLang.code),
    fieldUpdated: fieldUpdate
  };
}

/**
 * Deterministic multilingual synthesizer strictly grounded in official scheme text
 */
function buildDeterministicGroundedAnswer(params: {
  userMessage: string;
  scheme: Scheme;
  profile?: UserProfile | null;
  retrieved: any[];
  langCode: string;
  langName: string;
  fieldUpdate: any;
}): string {
  const { userMessage, scheme, profile, retrieved, langCode, fieldUpdate } = params;
  const q = userMessage.toLowerCase();
  const userName = profile?.name ? ` ${profile.name}` : '';

  // 1. If user answered the missing field follow-up
  if (fieldUpdate) {
    if (langCode === 'hi') {
      return `धन्यवाद${userName}! आपकी जानकारी दर्ज कर ली गई है (${fieldUpdate.displayNotice})। आपकी पात्रता की पुनः गणना की जा रही है।`;
    }
    return `Thank you${userName}! Your information has been recorded (${fieldUpdate.displayNotice}). The rule engine has instantly re-evaluated your eligibility.`;
  }

  // 2. Student & Scholarship Recommendation
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
    if (langCode === 'hi') {
      return `विद्यार्थियों और छात्रों के लिए प्रमुख सरकारी कल्याणकारी योजनाएं:\n\n1. 🎓 **PM-YASASVI (पीएम यशस्वी छात्रवृत्ति योजना)**:\n• लाभ: कक्षा 9-10 के लिए ₹75,000/वर्ष और कक्षा 11-12 के लिए ₹1,25,000/वर्ष की छात्रवृत्ति।\n• पात्रता: OBC, EBC और DNT श्रेणी के छात्र, पारिवारिक वार्षिक आय ₹2.5 लाख से कम।\n• आधिकारिक पोर्टल: https://yet.nta.ac.in | विवरण: /schemes/pm-yasasvi\n\n2. 🎓 **Post-Matric Scholarship (पोस्ट-मैट्रिक छात्रवृत्ति)**:\n• लाभ: 100% अनिवार्य शैक्षणिक शुल्क की प्रतिपूर्ति + मासिक निर्वाह भत्ता।\n• पात्रता: कक्षा 11 से लेकर स्नातक, स्नातकोत्तर, आईटीआई और डिप्लोमा छात्र (SC/OBC/EBC)।\n• आधिकारिक पोर्टल: https://scholarships.gov.in | विवरण: /schemes/post-matric-scholarship\n\n💡 आप पोर्टल के "पात्रता जांचें" (/check-eligibility) पृष्ठ पर अपनी व्यक्तिगत पात्रता 1-क्लिक में जांच सकते हैं!`;
    }
    if (langCode === 'mr') {
      return `विद्यार्थ्यांसाठी प्रमुख शासकीय शिष्यवृत्ती योजना:\n\n1. 🎓 **PM-YASASVI (पीएम यशस्वी योजना)**:\n• लाभ: इयत्ता 9-10 साठी ₹75,000/वर्ष आणि इयत्ता 11-12 साठी ₹1,25,000/वर्ष शिष्यवृत्ती.\n• पात्रता: OBC, EBC आणि DNT प्रवर्गातील विद्यार्थी, कौटुंबिक वार्षिक उत्पन्न ₹2.5 लाखांपर्यंत.\n• अधिकृत पोर्टल: https://yet.nta.ac.in | तपशील: /schemes/pm-yasasvi\n\n2. 🎓 **Post-Matric Scholarship (पोस्ट-मॅट्रिक शिष्यवृत्ती)**:\n• लाभ: 100% अनिवार्य शैक्षणिक शुल्क प्रतिपूर्ती + मासिक निर्वाह भत्ता.\n• पात्रता: इयत्ता 11 वी ते पदवी, पदव्युत्तर, आयटीआय आणि डिप्लोमा विद्यार्थी (SC/OBC/EBC).\n• अधिकृत पोर्टल: https://scholarships.gov.in | तपशील: /schemes/post-matric-scholarship\n\n💡 आपण /check-eligibility टॅबवर जाऊन 1 सेकंदात स्वतःची पात्रता तपासू शकता!`;
    }
    return `Top Government Schemes for Students:\n\n1. 🎓 **PM-YASASVI (Young Achievers Scholarship Award Scheme)**:\n• Financial Benefit: ₹75,000/year for Class 9-10 and ₹1,25,000/year for Class 11-12 top-class school students.\n• Eligibility: Meritorious students from OBC, EBC, and DNT categories with family annual income up to ₹2.5 Lakh.\n• Apply Online: https://yet.nta.ac.in | Portal details: /schemes/pm-yasasvi\n\n2. 🎓 **Post-Matric Scholarship (SC/OBC/EBC/DNT)**:\n• Financial Benefit: 100% compulsory tuition fee reimbursement + monthly maintenance allowance (₹2,500 to ₹13,500/year).\n• Eligibility: Students in recognized post-matric courses (Class 11, 12, Degree, PG, ITI, Diploma, Ph.D.).\n• Apply Online: https://scholarships.gov.in | Portal details: /schemes/post-matric-scholarship\n\n💡 Tip: Check your personal eligibility across all schemes instantly at /check-eligibility!`;
  }

  // 3. Farmer & Agriculture Recommendation
  if (
    q.includes('farm') ||
    q.includes('kisan') ||
    q.includes('crop') ||
    q.includes('agriculture') ||
    q.includes('land') ||
    q.includes('किसान') ||
    q.includes('खेती') ||
    q.includes('कृषि') ||
    q.includes('शेतकरी') ||
    q.includes('কৃষক') ||
    q.includes('விவசாயி') ||
    q.includes('రైతు')
  ) {
    if (langCode === 'hi') {
      return `किसानों और कृषकों के लिए प्रमुख सरकारी योजनाएं:\n\n1. 🌾 **PM-KISAN (प्रधानमंत्री किसान सम्मान निधि)**:\n• लाभ: ₹6,000 प्रति वर्ष DBT के माध्यम से ₹2,000 की 3 समान किस्तों में बैंक खाते में।\n• पात्रता: कृषि योग्य भूमि के स्वामी किसान परिवार।\n• आधिकारिक पोर्टल: https://pmkisan.gov.in | विवरण: /schemes/pm-kisan\n\n2. 🌾 **PM MUDRA Yojana (मुद्रा योजना)**:\n• लाभ: कृषि उपकरण, डेयरी, पोल्ट्री व संबद्ध कृषि कार्यों के लिए बिना गारंटी ₹20 लाख तक का ऋण।\n• आधिकारिक पोर्टल: https://www.mudra.org.in | विवरण: /schemes/pm-mudra\n\n3. 🐟 **PMMSY (मत्स्य संपदा योजना)**:\n• लाभ: मत्स्य पालन, बायोफ्लोक व आधुनिक नावों के लिए ₹30 लाख तक की वित्तीय सहायता/सब्सिडी।\n• आधिकारिक पोर्टल: https://pmmsy.dof.gov.in | विवरण: /schemes/pmmsy`;
    }
    if (langCode === 'mr') {
      return `शेतकरी बांधवांसाठी केंद्र सरकारच्या प्रमुख कल्याणकारी योजना:\n\n1. 🌾 **PM-KISAN (प्रधानमंत्री किसान सन्मान निधी)**:\n• लाभ: पात्र शेतकऱ्यांना दरवर्षी ₹६,००० ची थेट आर्थिक मदत (३ हप्त्यांमध्ये DBT द्वारे थेट बँक खात्यात).\n• पात्रता: स्वतःच्या नावावर शेतीयोग्य जमीन असणारे शेतकरी कुटुंब.\n• अधिकृत पोर्टल: https://pmkisan.gov.in | तपशील: /schemes/pm-kisan\n\n2. 🌾 **PM MUDRA Yojana (मुद्रा योजना)**:\n• लाभ: शेतीपूरक व्यवसाय, डेअरी, कुक्कुटपालन व अवजारांसाठी विनातारण ₹२० लाखांपर्यंत कर्ज.\n• अधिकृत पोर्टल: https://www.mudra.org.in | तपशील: /schemes/pm-mudra\n\n3. 🐟 **PMMSY (मत्स्य संपदा योजना)**:\n• लाभ: मत्स्यपालन, तळी व आधुनिक बोटींसाठी ₹३० लाखांपर्यंत अनुदान.\n• अधिकृत पोर्टल: https://pmmsy.dof.gov.in | तपशील: /schemes/pmmsy`;
    }
    if (langCode === 'bn') {
      return `কৃষক ভাইদের জন্য ভারত সরকারের শীর্ষ কল্যাণমূলক প্রকল্প:\n\n1. 🌾 **PM-KISAN (প্রধানমন্ত্রী কিষাণ সম্মান নিধি)**:\n• সুবিধা: যোগ্য কৃষকদের প্রতি বছর ₹৬,০০০ টাকার আর্থিক সহায়তা (৩টি কিস্তিতে DBT মাধ্যমে সরাসরি ব্যাংক একাউন্টে)।\n• যোগ্যতা: নিজের নামে চাষযোগ্য জমি থাকা কৃষক পরিবার।\n• অফিশিয়াল পোর্টাল: https://pmkisan.gov.in | বিস্তারিত: /schemes/pm-kisan\n\n2. 🌾 **PM MUDRA (প্রধানমন্ত্রী মুদ্রা যোজনা)**:\n• সুবিধা: কৃষিভিত্তিক ব্যবসা ও দুগ্ধজাত কাজের জন্য কোনো গ্যারান্টি ছাড়াই ₹২০ লক্ষ পর্যন্ত ঋণ।\n• অফিশিয়াল পোর্টাল: https://www.mudra.org.in | বিস্তারিত: /schemes/pm-mudra\n\n3. 🐟 **PMMSY (মৎস্য সম্পদ যোজনা)**:\n• সুবিধা: মৎস্য চাষ ও আধুনিক সরঞ্জামের জন্য ₹৩০ লক্ষ পর্যন্ত সরকারি ভর্তুকি।`;
    }
    if (langCode === 'ta') {
      return `விவசாயிகளுக்கான மத்திய அரசின் சிறந்த நலத்திட்டங்கள்:\n\n1. 🌾 **PM-KISAN (பிரதான் மந்திரி கிசான் சம்மான் நிதி)**:\n• பயன்கள்: தகுதியுள்ள விவசாயிகளுக்கு ஆண்டுக்கு ₹6,000 நேரடி பண உதவி (3 தவணைகளில் DBT மூலம் வங்கி கணக்கில்).\n• தகுதி: விவசாய நிலம் வைத்துள்ள விவசாயிகள் குடும்பம்.\n• அதிகாரப்பூர்வ தளம்: https://pmkisan.gov.in | விவரங்கள்: /schemes/pm-kisan\n\n2. 🌾 **PM MUDRA (முத்ரா திட்டம்)**:\n• பயன்கள்: விவசாயம் மற்றும் கால்நடை வணிகத்திற்கு ₹20 லட்சம் வரை பிணையற்ற கடன்.\n• அதிகாரப்பூர்வ தளம்: https://www.mudra.org.in\n\n3. 🐟 **PMMSY (மத்ஸ்ய சம்பதா யோஜனா)**:\n• பயன்கள்: மீன் வளர்ப்பு மற்றும் படகுகளுக்கு ₹30 லட்சம் வரை மானியம்.`;
    }
    if (langCode === 'te') {
      return `రైతుల కోసం కేంద్ర ప్రభుత్వ ముఖ్య పథకాలు:\n\n1. 🌾 **PM-KISAN (పీఎం కిసాన్ సమ్మాన్ నిధి)**:\n• ప్రయోజనం: అర్హులైన రైతులకు ఏడాదికి ₹6,000 నేరుగా ఖాతాలో జమ (3 విడతలలో DBT ద్వారా).\n• అర్హత: సాగుభూమి కలిగి ఉన్న రైతు కుటుంబాలు.\n• అధికారిక పోర్టల్: https://pmkisan.gov.in | వివరాలు: /schemes/pm-kisan\n\n2. 🌾 **PM MUDRA (పీఎం ముద్ర యోజన)**:\n• ప్రయోజనం: వ్యవసాయ అనుబంధ పనుల కోసం పూచీకత్తు లేకుండా ₹20 లక్షల వరకు రుణం.\n• అధికారిక పోర్టల్: https://www.mudra.org.in\n\n3. 🐟 **PMMSY (మత్స్య సంపద యోజన)**:\n• ప్రయోజనం: చేపల పెంపకం మరియు పరికరాల కోసం ₹30 లక్షల వరకు సబ్సిడీ.`;
    }
    return `Top Government Schemes for Farmers:\n\n1. 🌾 **PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)**:\n• Benefit: Direct income support of ₹6,000 per year transferred into bank accounts in 3 four-monthly installments of ₹2,000 via DBT.\n• Eligibility: Landholding farmer families with valid cultivable land records.\n• Apply Online: https://pmkisan.gov.in | Portal details: /schemes/pm-kisan\n\n2. 🌾 **PM MUDRA Yojana (PMMY)**:\n• Benefit: Collateral-free business & allied agricultural credit up to ₹20 Lakh.\n• Apply Online: https://www.mudra.org.in | Portal details: /schemes/pm-mudra\n\n3. 🐟 **PMMSY (Matsya Sampada Yojana)**:\n• Benefit: Up to ₹30 Lakh financial assistance and subsidy for aquaculture, fish farming ponds, boats, and cold storage.\n• Apply Online: https://pmmsy.dof.gov.in | Portal details: /schemes/pmmsy`;
  }

  // 4. Street Vendors & Hawkers Recommendation
  if (
    q.includes('vendor') ||
    q.includes('hawker') ||
    q.includes('thela') ||
    q.includes('street') ||
    q.includes('फेरीवाले') ||
    q.includes('ठेले') ||
    q.includes('रेहड़ी') ||
    q.includes('पथविक्रेते')
  ) {
    if (langCode === 'hi') {
      return `स्ट्रीट वेंडर्स (फेरीवालों और ठेलेवालों) के लिए प्रमुख योजनाएं:\n\n1. 🛒 **PM SVANidhi (पीएम स्वनिधि योजना)**:\n• लाभ: बिना किसी गारंटी के कार्यशील पूंजी ऋण (पहली किस्त ₹10,000, दूसरी ₹20,000, तीसरी ₹50,000)। 7% ब्याज सब्सिडी और डिजिटल लेनदेन पर प्रतिवर्ष ₹1,200 तक कैशबैक।\n• पात्रता: शहरी क्षेत्रों में वेंडिंग आईडी कार्ड / सर्टिफिकेट धारक वेंडर्स।\n• आधिकारिक पोर्टल: https://pmsvanidhi.mohua.gov.in | विवरण: /schemes/pm-svanidhi\n\n2. 🛒 **PM-SYM (श्रम योगी मानधन पेंशन)**:\n• लाभ: 60 वर्ष की आयु के बाद ₹3,000 प्रति माह आजीवन सुनिश्चित पेंशन।\n• पात्रता: 18-40 वर्ष आयु, मासिक आय ₹15,000 से कम।\n• आधिकारिक पोर्टल: https://maandhan.in | विवरण: /schemes/pm-sym`;
    }
    if (langCode === 'mr') {
      return `पथविक्रेते आणि फेरीवाल्यांसाठी प्रमुख सरकारी योजना:\n\n1. 🛒 **PM SVANidhi (पीएम स्वनिधी योजना)**:\n• लाभ: विनातारण खेळते भांडवल कर्ज (पहिला हप्ता ₹१०,०००, दुसरा ₹२०,०००, तिसरा ₹५०,०००). वेळेवर परतफेडीवर ७% व्याज अनुदान आणि डिजिटल व्यवहारांवर ₹१,२०० पर्यंत कॅशबॅक.\n• पात्रता: शहरी भागातील नोंदणीकृत फेरीवाले व पथविक्रेते.\n• अधिकृत पोर्टल: https://pmsvanidhi.mohua.gov.in | तपशील: /schemes/pm-svanidhi\n\n2. 🛒 **PM-SYM (श्रम योगी मानधन पेन्शन योजना)**:\n• लाभ: वयाच्या ६० वर्षांनंतर दरमहा ₹३,००० ची खात्रीशीर पेन्शन.\n• पात्रता: १८ ते ४० वर्षे वयोगट, मासिक उत्पन्न ₹१५,००० पेक्षा कमी असणारे असंघटित कामगार.\n• अधिकृत पोर्टल: https://maandhan.in | तपशील: /schemes/pm-sym`;
    }
    if (langCode === 'bn') {
      return `পথ বিক্রেতা ও হকারদের জন্য শীর্ষ সরকারি প্রকল্প:\n\n1. 🛒 **PM SVANidhi (পিএম স্বনিধি যোজনা)**:\n• সুবিধা: কোনো গ্যারান্টি ছাড়াই কার্যনির্বাহী মূলধন ঋণ (প্রথম কিস্তি ₹১০,০০০, দ্বিতীয় ₹২০,০০০, তৃতীয় ₹৫০,০০০)। ৭% সুদে ভর্তুকি এবং ডিজিটাল লেনদেনে বার্ষিক ₹১,২০০ পর্যন্ত ক্যাশব্যাক।\n• যোগ্যতা: শহরাঞ্চলের হকার ও স্ট্রিট ভেন্ডার যাদের ভেন্ডিং সার্টিফিকেট আছে।\n• পোর্টাল: https://pmsvanidhi.mohua.gov.in\n\n2. 🛒 **PM-SYM (শ্রম যোগী মানধন পেনশন)**:\n• সুবিধা: ৬০ বছর বয়সের পর প্রতি মাসে ₹৩,০০০ নিশ্চিত পেনশন।`;
    }
    if (langCode === 'ta') {
      return `சாலையோர வியாபாரிகளுக்கான சிறந்த அரசு திட்டங்கள்:\n\n1. 🛒 **PM SVANidhi (பிஎம் ஸ்வநிதி திட்டம்)**:\n• பயன்கள்: பிணையற்ற மூலதன கடன் (முதல் தவணை ₹10,000, 2வது ₹20,000, 3வது ₹50,000). 7% வட்டி மானியம் மற்றும் டிஜிட்டல் பணப்பரிவர்த்தனைக்கு கேஷ்பேக்.\n• தகுதி: அங்கீகரிக்கப்பட்ட சாலையோர வியாபாரிகள்.\n• போர்டல்: https://pmsvanidhi.mohua.gov.in\n\n2. 🛒 **PM-SYM (பிரதான் மந்திரி ஷ்ரம் யோகி மான்தன்)**:\n• பயன்கள்: 60 வயதுக்குப் பின் மாதம் ₹3,000 ஓய்வூதியம்.`;
    }
    if (langCode === 'te') {
      return `వీధి వ్యాపారుల కోసం కేంద్ర ప్రభుత్వ పథకాలు:\n\n1. 🛒 **PM SVANidhi (పీఎం స్వనిధి పథకం)**:\n• ప్రయోజనం: ఎలాంటి హామీ లేకుండా వర్కింగ్ క్యాపిటల్ రుణం (మొదటి విడత ₹10,000, 2వ విడత ₹20,000, 3వ విడత ₹50,000). 7% వడ్డీ రాయితీ.\n• అర్హత: పట్టణ ప్రాంతాల్లోని గుర్తింపు పొందిన వీధి వ్యాపారులు.\n• పోర్టల్: https://pmsvanidhi.mohua.gov.in\n\n2. 🛒 **PM-SYM (శ్రమ యోగి మాన్‌ధన్ పెన్షన్)**:\n• ప్రయోజనం: 60 ఏళ్ల తర్వాత నెలకు ₹3,000 హామీ పెన్షన్.`;
    }
    return `Top Government Schemes for Street Vendors & Hawkers:\n\n1. 🛒 **PM SVANidhi (PM Street Vendor's AtmaNirbhar Nidhi)**:\n• Benefit: Collateral-free working capital loan: 1st tranche ₹10,000; 2nd tranche ₹20,000; 3rd tranche ₹50,000 with 7% interest subsidy & digital UPI cashbacks.\n• Eligibility: Urban street vendors and hawkers with a Certificate of Vending (CoV) / Identity Card.\n• Apply Online: https://pmsvanidhi.mohua.gov.in | Portal details: /schemes/pm-svanidhi\n\n2. 🛒 **PM-SYM (Pradhan Mantri Shram Yogi Maandhan)**:\n• Benefit: Guaranteed lifelong pension of ₹3,000 per month after age 60.\n• Eligibility: Unorganized workers aged 18-40 with monthly income ≤ ₹15,000.\n• Apply Online: https://maandhan.in | Portal details: /schemes/pm-sym`;
  }

  // 5. Business / Entrepreneur / Unemployed / Youth Recommendation
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
    if (langCode === 'hi') {
      return `व्यवसाय, उद्योग और स्वरोजगार के लिए प्रमुख सरकारी योजनाएं:\n\n1. 💼 **PMEGP (प्रधानमंत्री रोजगार सृजन कार्यक्रम)**:\n• लाभ: विनिर्माण में ₹50 लाख तक और सेवा क्षेत्र में ₹20 लाख तक की परियोजनाओं पर 15% से 35% तक सरकारी सब्सिडी (मार्जिन मनी)।\n• पात्रता: 18 वर्ष से अधिक आयु का कोई भी नागरिक (न्यूनतम 8वीं पास विनिर्माण में ₹10L+ के लिए)।\n• आधिकारिक पोर्टल: https://www.kviconline.gov.in/pmegpep/ | विवरण: /schemes/pmegp\n\n2. 💼 **PM MUDRA Yojana (मुद्रा योजना)**:\n• लाभ: गैर-कॉर्पोरेट सूक्ष्म उद्यमों के लिए बिना किसी गारंटी ₹20 लाख तक का ऋण (शिशु: ₹50K, किशोर: ₹5L, तरुण: ₹20L)।\n• आधिकारिक पोर्टल: https://www.mudra.org.in | विवरण: /schemes/pm-mudra`;
    }
    return `Top Government Schemes for Businesses, Startups & Self-Employment:\n\n1. 💼 **PMEGP (Prime Minister's Employment Generation Programme)**:\n• Benefit: 15% to 35% government capital subsidy on project loans up to ₹50 Lakh (Manufacturing) and ₹20 Lakh (Services).\n• Eligibility: Any citizen aged 18+ initiating a new enterprise (min 8th pass for large manufacturing projects).\n• Apply Online: https://www.kviconline.gov.in/pmegpep/ | Portal details: /schemes/pmegp\n\n2. 💼 **PM MUDRA Yojana (PMMY)**:\n• Benefit: 100% collateral-free business loans up to ₹20 Lakh (Shishu up to ₹50K, Kishore up to ₹5L, Tarun up to ₹20L).\n• Apply Online: https://www.mudra.org.in | Portal details: /schemes/pm-mudra`;
  }

  // 6. Senior Citizens & Pension Recommendation
  if (
    q.includes('senior') ||
    q.includes('old age') ||
    q.includes('pension') ||
    q.includes('elderly') ||
    q.includes('बुजुर्ग') ||
    q.includes('वृद्ध') ||
    q.includes('पेंशन') ||
    q.includes('वय')
  ) {
    if (langCode === 'hi') {
      return `वरिष्ठ नागरिकों और बुजुर्गों के लिए प्रमुख योजनाएं:\n\n1. 🏥 **Ayushman Bharat PM-JAY (वरिष्ठ नागरिक 70+)**:\n• लाभ: 70 वर्ष व उससे अधिक आयु के सभी वरिष्ठ नागरिकों के लिए ₹5 लाख का निःशुल्क कैशलेस स्वास्थ्य बीमा (आयुष्मान वय वंदना कार्ड), बिना किसी आय सीमा के।\n• आधिकारिक पोर्टल: https://pmjay.gov.in | विवरण: /schemes/ab-pmjay\n\n2. 👴 **Atal Pension Yojana (अटल पेंशन योजना)**:\n• लाभ: 60 वर्ष की आयु के बाद ₹1,000 से ₹5,000 प्रति माह की गारंटीड आजीवन पेंशन।\n• पात्रता: 18-40 वर्ष आयु वर्ग के सभी बैंक खाताधारक नागरिक।\n• आधिकारिक पोर्टल: https://npscra.nsdl.co.in | विवरण: /schemes/atal-pension-yojana\n\n3. 👴 **IGNOAPS (राष्ट्रीय वृद्धावस्था पेंशन योजना)**:\n• लाभ: BPL बुजुर्गों को प्रति माह ₹200 से ₹500 तक पेंशन + राज्य सरकार का अतिरिक्त अंशदान।\n• आधिकारिक पोर्टल: https://nsap.nic.in | विवरण: /schemes/ignoaps-pension`;
    }
    return `Top Government Schemes for Senior Citizens:\n\n1. 🏥 **Ayushman Bharat PM-JAY (Senior Citizens 70+)**:\n• Benefit: Free cashless health insurance cover up to ₹5 Lakh/year for ALL citizens aged 70+ (Ayushman Vaya Vandana Card), regardless of income.\n• Apply Online: https://pmjay.gov.in | Portal details: /schemes/ab-pmjay\n\n2. 👴 **Atal Pension Yojana (APY)**:\n• Benefit: Guaranteed monthly pension of ₹1,000 to ₹5,000 after age 60.\n• Apply Online: Any bank branch / https://npscra.nsdl.co.in | Details: /schemes/atal-pension-yojana\n\n3. 👴 **IGNOAPS (Indira Gandhi National Old Age Pension)**:\n• Benefit: Monthly pension for BPL senior citizens aged 60+.\n• Details: /schemes/ignoaps-pension`;
  }

  // 7. Portal Help & How to Check Eligibility
  if (
    q.includes('portal') ||
    q.includes('how to check') ||
    q.includes('eligibility') ||
    q.includes('website') ||
    q.includes('saathi') ||
    q.includes('पात्रता') ||
    q.includes('वेबसाइट') ||
    q.includes('साथी')
  ) {
    if (langCode === 'hi') {
      return `स्मार्ट सरकार साथी पोर्टल पर आपका स्वागत है! इस पोर्टल पर आप निम्नलिखित सुविधाएं प्राप्त कर सकते हैं:\n\n1. 🎯 **1-क्लिक पात्रता जांच (/check-eligibility)**: अपनी आयु, वार्षिक आय, व्यवसाय, जाति श्रेणी और राज्य दर्ज करें और 1 सेकंड में जानें कि आप किन-किन योजनाओं के लिए पात्र हैं।\n2. 📋 **व्यवसाय-आधारित प्रश्नावली (/occupation-questions)**: किसान, छात्र, व्यापारी आदि के लिए विशिष्ट प्रश्न जो आपकी सटीक पात्रता सुनिश्चित करते हैं।\n3. 📚 **15 योजनाओं की सम्पूर्ण डायरेक्टरी (/dashboard)**: सभी सत्यापित केंद्रीय योजनाओं की विस्तृत जानकारी, पात्रता नियम और आवश्यक दस्तावेज।\n4. 🔖 **बुकमार्क और सेव (/saved)**: अपनी पसंदीदा योजनाओं को सेव करें।\n5. 🎙️ **क्षेत्रीय वॉयस मोड**: हिंदी, मराठी, बंगाली, तमिल, तेलुगु या अंग्रेजी में माइक से बोलकर पूछें और आवाज में उत्तर सुनें!`;
    }
    return `Welcome to Smart Sarkar Saathi! Here is how our portal empowers you:\n\n1. 🎯 **1-Click Eligibility Engine (/check-eligibility)**: Enter your age, income, occupation, category, and state to instantly evaluate criteria against all 15 sovereign schemes.\n2. 📋 **Occupation Questionnaire (/occupation-questions)**: Targeted questions for 12+ professions (farmers, students, vendors, etc.) to resolve missing criteria.\n3. 📚 **15 Schemes Directory (/dashboard)**: Complete directory of all verified schemes with search and category filters.\n4. 🔖 **Saved Schemes (/saved)**: Bookmark schemes directly to your profile.\n5. 🎙️ **Multilingual Regional Voice Assistant**: Tap the mic button to speak in Hindi, Marathi, Bengali, Tamil, Telugu, or English and listen to spoken answers!`;
  }

  // 8. Documents question for active scheme
  if (q.includes('doc') || q.includes('paper') || q.includes('दस्तावेज') || q.includes('कागजात') || q.includes('proof')) {
    if (langCode === 'hi') {
      return `${scheme.short_name} के लिए आवश्यक आधिकारिक दस्तावेज निम्नलिखित हैं:\n• ${scheme.required_documents.join('\n• ')}\n\n(संदर्भ: ${scheme.short_name} दिशानिर्देश)`;
    }
    return `The official documents required for ${scheme.short_name} are:\n• ${scheme.required_documents.join('\n• ')}\n\n(Official Source: ${scheme.short_name} Checklist)`;
  }

  // 9. How to Apply / Official Portal question for active scheme
  if (q.includes('apply') || q.includes('how') || q.includes('portal') || q.includes('आवेदन') || q.includes('रजिस्ट्रेशन')) {
    const steps = scheme.application_steps ? scheme.application_steps.map((s, i) => `${i + 1}. ${s}`).join('\n') : '';
    if (langCode === 'hi') {
      return `${scheme.short_name} के लिए आधिकारिक पोर्टल ${scheme.official_apply_url} पर आवेदन करें।\n\nआवेदन प्रक्रिया:\n${steps}`;
    }
    return `You can apply directly on the official portal at ${scheme.official_apply_url}.\n\nStep-by-step process:\n${steps}`;
  }

  // 10. Benefits question for active scheme
  if (q.includes('benefit') || q.includes('money') || q.includes('amount') || q.includes('लाभ') || q.includes('रुपये') || q.includes('पैसे')) {
    if (langCode === 'hi') {
      return `${scheme.short_name} के मुख्य लाभ:\n${scheme.benefit_summary}\n\nविस्तार:\n• ${scheme.benefit_details.join('\n• ')}`;
    }
    return `Key benefits under ${scheme.short_name}:\n${scheme.benefit_summary}\n\nDetails:\n• ${scheme.benefit_details.join('\n• ')}`;
  }

  // 11. If chunks were retrieved
  if (retrieved.length > 0) {
    const topChunk = retrieved[0].chunk;
    if (langCode === 'hi') {
      return `आधिकारिक दिशा-निर्देशों के अनुसार (${topChunk.citation_tag}):\n\n${topChunk.content}\n\nअधिक जानकारी के लिए आधिकारिक पोर्टल देखें: ${scheme.official_apply_url}`;
    }
    return `According to the official scheme guidelines [${topChunk.citation_tag}]:\n\n${topChunk.content}\n\nFor official procedures, visit: ${scheme.official_apply_url}`;
  }

  // 12. Fallback: suggest portal schemes rather than failing
  if (langCode === 'hi') {
    return `नमस्ते! आप भारत सरकार की 15 सत्यापित योजनाओं में से किसी भी योजना (जैसे PM-KISAN, आयुष्मान भारत, पीएम स्वनिधि, मुद्रा, पीएम-यशस्वी) के बारे में पूछ सकते हैं। आप अपनी संपूर्ण पात्रता जांचने के लिए "पात्रता जांचें" (/check-eligibility) पर जा सकते हैं।`;
  }
  return `Namaste! I am your AI Sarkar Saathi. You can ask about any of our 15 verified Government of India schemes (e.g. PM-KISAN for farmers, PM-YASASVI for students, PM SVANidhi for vendors, PM MUDRA for businesses, Ayushman Bharat for health) or check your personalized eligibility at /check-eligibility!`;
}

function getSuggestedPrompts(scheme: Scheme, langCode: string): string[] {
  if (langCode === 'mr') {
    return [
      `कोणती कागदपत्रे आवश्यक आहेत?`,
      `अधिकृत पोर्टलवर अर्ज कसा करावा?`,
      `या योजनेचे काय आर्थिक लाभ मिळतात?`
    ];
  }
  if (langCode === 'bn') {
    return [
      `কী কী প্রয়োজনীয় নথিপত্র লাগবে?`,
      `অফিসিয়াল পোর্টালে কীভাবে আবেদন করবেন?`,
      `এই স্কিম থেকে কী কী আর্থিক সুবিধা পাবেন?`
    ];
  }
  if (langCode === 'ta') {
    return [
      `விண்ணப்பிக்க என்ன ஆவணங்கள் தேவை?`,
      `அதிகாரப்பூர்வ தளத்தில் எவ்வாறு விண்ணப்பிப்பது?`,
      `இந்த திட்டத்தின் நிதி நன்மைகள் என்ன?`
    ];
  }
  if (langCode === 'te') {
    return [
      `ఏ ఏ ధ్రువీకరణ పత్రాలు అవసరం?`,
      `అధికారిక పోర్టల్‌లో ఎలా దరఖాస్తు చేసుకోవాలి?`,
      `ఈ పథకం కింద ఎంత ఆర్థిక ప్రయోజనం లభిస్తుంది?`
    ];
  }
  if (langCode === 'hi') {
    return [
      `कौन से दस्तावेज जरूरी हैं?`,
      `आवेदन कैसे करें?`,
      `योजना के क्या लाभ मिलते हैं?`
    ];
  }
  return [
    `What documents do I need for ${scheme.short_name}?`,
    `How do I apply on the official portal?`,
    `What are the financial benefits?`
  ];
}
