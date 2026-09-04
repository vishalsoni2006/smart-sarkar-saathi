/**
 * Gemini API Key & Cloud Configuration Helpers
 * Supports:
 * 1. process.env.NEXT_PUBLIC_GEMINI_API_KEY (Next.js client-side env)
 * 2. process.env.GEMINI_API_KEY (Server / Build time env)
 * 3. localStorage ('scheme_navigator_gemini_key') for in-browser user configuration
 */

export function getActiveGeminiKey(): string | null {
  if (typeof window !== 'undefined') {
    try {
      const local = localStorage.getItem('scheme_navigator_gemini_key');
      if (local && local.trim().length > 0) {
        return local.trim();
      }
    } catch (e) {
      // Ignore localStorage access errors
    }
  }
  return process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY || null;
}

export function saveGeminiKey(key: string): void {
  if (typeof window !== 'undefined') {
    const clean = key.trim();
    localStorage.setItem('scheme_navigator_gemini_key', clean);
    window.dispatchEvent(
      new CustomEvent('scheme_navigator_api_keys_changed', {
        detail: { geminiKey: clean }
      })
    );
  }
}

export function getActiveGroqKey(): string | null {
  if (typeof window !== 'undefined') {
    try {
      const local = localStorage.getItem('scheme_navigator_groq_key');
      if (local && local.trim().length > 0) {
        return local.trim();
      }
    } catch (e) {
      // Ignore localStorage access errors
    }
  }
  return process.env.NEXT_PUBLIC_GROQ_API_KEY || process.env.GROQ_API_KEY || null;
}

export function saveGroqKey(key: string): void {
  if (typeof window !== 'undefined') {
    const clean = key.trim();
    localStorage.setItem('scheme_navigator_groq_key', clean);
    window.dispatchEvent(
      new CustomEvent('scheme_navigator_api_keys_changed', {
        detail: { groqKey: clean }
      })
    );
  }
}

export const CANDIDATE_GEMINI_MODELS = [
  'gemini-3.6-flash',
  'gemini-flash-latest',
  'gemini-2.5-flash',
  'gemini-1.5-flash'
];

/**
 * Live test Gemini API key by making a minimal generateContent call
 */
export async function testGeminiApiKey(apiKey: string): Promise<{ success: boolean; message: string }> {
  try {
    const key = apiKey.trim();
    if (!key) {
      return { success: false, message: 'Please provide a valid Gemini API key.' };
    }

    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(key);

    let lastError: any = null;
    for (const modelName of CANDIDATE_GEMINI_MODELS) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent('Say OK');
        const response = await result.response;
        const text = response.text();

        if (text) {
          return {
            success: true,
            message: `Google Gemini (${modelName}) connected and verified successfully!`
          };
        }
      } catch (err: any) {
        lastError = err;
        continue;
      }
    }

    const msg = lastError?.message || 'Authentication failed. Please verify your Gemini API key.';
    return { success: false, message: msg };
  } catch (error: any) {
    const msg = error?.message || 'Authentication failed. Please verify your Gemini API key.';
    return { success: false, message: msg };
  }
}
