import { GoogleGenerativeAI } from '@google/generative-ai';
import Groq from 'groq-sdk';
import { retrieveRelevantChunks } from '@/lib/rag/vector-search';
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
  const marathiMarkers = ['आहे', 'नाही', 'कसे', 'माहिती', 'योजना', 'अर्ज'];

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

/**
 * Execute RAG grounded chat with LLM & Multilingual translation
 */
export async function executeGroundedRAGChat(params: {
  userMessage: string;
  scheme: Scheme;
  profile: UserProfile | null;
  targetMissingField?: string | null;
}): Promise<ChatResponsePayload> {
  const { userMessage, scheme, profile, targetMissingField } = params;

  // 1. Check if user is responding to the missing field follow-up
  const fieldUpdate = extractFieldUpdate(userMessage, targetMissingField);

  // 2. Detect language
  const detectedLang = detectIndianLanguage(userMessage);

  // 3. Retrieve relevant chunks from scheme official knowledge base
  const retrieved = retrieveRelevantChunks(userMessage, scheme, 3);
  const citations = retrieved.map((r) => r.citation);

  // 4. Check API keys
  const geminiKey = process.env.GEMINI_API_KEY || (typeof window !== 'undefined' ? localStorage.getItem('scheme_navigator_gemini_key') : null);
  const groqKey = process.env.GROQ_API_KEY || (typeof window !== 'undefined' ? localStorage.getItem('scheme_navigator_groq_key') : null);

  // If Gemini API is available
  if (geminiKey) {
    try {
      const genAI = new GoogleGenerativeAI(geminiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `You are "Scheme Navigator AI", an official Government of India scheme assistance specialist.
CRITICAL INSTRUCTIONS:
1. Ground your answer STRICTLY on the retrieved official scheme excerpt provided below.
2. If the user asks a question not addressed in the retrieved context, say clearly: "I don't have that information in the official scheme documentation for ${scheme.short_name}."
3. Never guess or hallucinate eligibility verdicts.
4. If the user message is in ${detectedLang.name} (or any other Indian language), respond naturally and accurately in the SAME language: ${detectedLang.name}.
5. Keep your answer helpful, empathetic, concise, and citizen-friendly.
6. Mention citation tag: "${citations.length > 0 ? citations[0].citation_label : scheme.short_name + ' Guidelines'}".

CITIZEN PROFILE:
- Name: ${profile?.name || 'Citizen'}
- Occupation: ${profile?.occupation || 'General'}
- Age: ${profile?.age || 'N/A'}
- State of Residence: ${profile?.state || 'India'}
- Annual Income: ₹${profile?.annual_income || 'N/A'}
- Verified Occupational Answers: ${profile?.occupation_specific_data ? JSON.stringify(profile.occupation_specific_data) : 'None'}

SCHEME NAME: ${scheme.name} (${scheme.short_name})
OFFICIAL APPLY URL: ${scheme.official_apply_url}
REQUIRED DOCUMENTS: ${scheme.required_documents.join(', ')}

RETRIEVED OFFICIAL CONTEXT:
${retrieved.map((r, i) => `[Excerpt ${i + 1} - ${r.citation.citation_label}]:\n${r.chunk.content}`).join('\n\n')}

CITIZEN'S QUESTION:
"${userMessage}"

ANSWER (in ${detectedLang.name}):`;

      const result = await model.generateContent(prompt);
      const answerText = result.response.text();

      return {
        answer: answerText,
        detectedLanguage: detectedLang.name,
        citations,
        suggestedPrompts: getSuggestedPrompts(scheme, detectedLang.code),
        fieldUpdated: fieldUpdate
      };
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
            content: `You are Scheme Navigator AI. Citizen is ${profile?.name || 'Citizen'} (${profile?.occupation || 'Citizen'}). Ground your answer ONLY in the official context for ${scheme.short_name}. Respond in ${detectedLang.name}.`
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
        detectedLanguage: detectedLang.name,
        citations,
        suggestedPrompts: getSuggestedPrompts(scheme, detectedLang.code),
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
    langCode: detectedLang.code,
    langName: detectedLang.name,
    fieldUpdate
  });

  return {
    answer: groundedAnswer,
    detectedLanguage: detectedLang.name,
    citations,
    suggestedPrompts: getSuggestedPrompts(scheme, detectedLang.code),
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

  // If user answered the missing field
  if (fieldUpdate) {
    if (langCode === 'hi') {
      return `धन्यवाद${userName}! आपकी जानकारी दर्ज कर ली गई है (${fieldUpdate.displayNotice})। आपकी पात्रता की पुनः गणना की जा रही है।`;
    }
    return `Thank you${userName}! Your information has been recorded (${fieldUpdate.displayNotice}). The rule engine has instantly re-evaluated your eligibility.`;
  }

  // Check for Documents question
  if (q.includes('doc') || q.includes('paper') || q.includes('दस्तावेज') || q.includes('कागजात') || q.includes('proof')) {
    if (langCode === 'hi') {
      return `${scheme.short_name} के लिए आवश्यक आधिकारिक दस्तावेज निम्नलिखित हैं:\n• ${scheme.required_documents.join('\n• ')}\n\n(संदर्भ: ${scheme.short_name} दिशानिर्देश)`;
    }
    return `The official documents required for ${scheme.short_name} are:\n• ${scheme.required_documents.join('\n• ')}\n\n(Official Source: ${scheme.short_name} Checklist)`;
  }

  // Check for How to Apply / Official Portal question
  if (q.includes('apply') || q.includes('how') || q.includes('portal') || q.includes('आवेदन') || q.includes('रजिस्ट्रेशन')) {
    const steps = scheme.application_steps ? scheme.application_steps.map((s, i) => `${i + 1}. ${s}`).join('\n') : '';
    if (langCode === 'hi') {
      return `${scheme.short_name} के लिए आधिकारिक पोर्टल ${scheme.official_apply_url} पर आवेदन करें।\n\nआवेदन प्रक्रिया:\n${steps}`;
    }
    return `You can apply directly on the official portal at ${scheme.official_apply_url}.\n\nStep-by-step process:\n${steps}`;
  }

  // Check for Benefits question
  if (q.includes('benefit') || q.includes('money') || q.includes('amount') || q.includes('लाभ') || q.includes('रुपये') || q.includes('पैसे')) {
    if (langCode === 'hi') {
      return `${scheme.short_name} के मुख्य लाभ:\n${scheme.benefit_summary}\n\nविस्तार:\n• ${scheme.benefit_details.join('\n• ')}`;
    }
    return `Key benefits under ${scheme.short_name}:\n${scheme.benefit_summary}\n\nDetails:\n• ${scheme.benefit_details.join('\n• ')}`;
  }

  // If chunks were retrieved
  if (retrieved.length > 0) {
    const topChunk = retrieved[0].chunk;
    if (langCode === 'hi') {
      return `आधिकारिक दिशा-निर्देशों के अनुसार (${topChunk.citation_tag}):\n\n${topChunk.content}\n\nअधिक जानकारी के लिए आधिकारिक पोर्टल देखें: ${scheme.official_apply_url}`;
    }
    return `According to the official scheme guidelines [${topChunk.citation_tag}]:\n\n${topChunk.content}\n\nFor official procedures, visit: ${scheme.official_apply_url}`;
  }

  // Fallback: strictly avoid hallucination
  if (langCode === 'hi') {
    return `मुझे ${scheme.short_name} के आधिकारिक दस्तावेजों में इस प्रश्न की पुष्टि नहीं मिली। कृपया आधिकारिक हेल्पलाइन (${scheme.official_contact || '1800 हेल्पलाइन'}) अथवा आधिकारिक पोर्टल (${scheme.official_apply_url}) पर संपर्क करें।`;
  }
  return `I don't have that specific information in the official scheme documentation for ${scheme.short_name}. Please refer directly to the official portal: ${scheme.official_apply_url} or contact ${scheme.official_contact || 'the respective ministry'}.`;
}

function getSuggestedPrompts(scheme: Scheme, langCode: string): string[] {
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
