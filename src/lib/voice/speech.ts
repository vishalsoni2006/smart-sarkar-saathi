'use client';

/**
 * Multilingual Speech Recognition (Speech-to-Text) and Speech Synthesis (Text-to-Speech)
 * Dedicated to official Indian languages: Hindi, Marathi, Bengali, Tamil, Telugu, English.
 */

export const REGIONAL_SPEECH_LANGS: Record<string, { bcp47: string; name: string; nativeName: string }> = {
  hi: { bcp47: 'hi-IN', name: 'Hindi', nativeName: 'हिंदी' },
  mr: { bcp47: 'mr-IN', name: 'Marathi', nativeName: 'मराठी' },
  bn: { bcp47: 'bn-IN', name: 'Bengali', nativeName: 'বাংলা' },
  ta: { bcp47: 'ta-IN', name: 'Tamil', nativeName: 'தமிழ்' },
  te: { bcp47: 'te-IN', name: 'Telugu', nativeName: 'తెలుగు' },
  en: { bcp47: 'en-IN', name: 'English (India)', nativeName: 'English' }
};

/**
 * Check if Web Speech Recognition API is supported in user's browser
 */
export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return Boolean(
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition
  );
}

/**
 * Check if Web Speech Synthesis API is supported in user's browser
 */
export function isSpeechSynthesisSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return 'speechSynthesis' in window;
}

/**
 * Start speech-to-text recognition in a specific regional language
 */
export function startVoiceRecognition(options: {
  langCode?: string;
  onResult: (transcript: string, isFinal: boolean) => void;
  onError: (errorMsg: string) => void;
  onEnd: () => void;
  onStart?: () => void;
}): { stop: () => void } {
  if (!isSpeechRecognitionSupported()) {
    options.onError('Speech recognition is not supported in this browser. Please use Google Chrome, Edge, or Brave.');
    options.onEnd();
    return { stop: () => {} };
  }

  try {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    const targetBcp = options.langCode && REGIONAL_SPEECH_LANGS[options.langCode]
      ? REGIONAL_SPEECH_LANGS[options.langCode].bcp47
      : 'hi-IN';

    recognition.lang = targetBcp;
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    let finalTranscript = '';

    recognition.onstart = () => {
      if (options.onStart) options.onStart();
    };

    recognition.onresult = (event: any) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }
      const combined = finalTranscript || interim;
      options.onResult(combined, Boolean(finalTranscript));
    };

    recognition.onerror = (event: any) => {
      let msg = 'Voice recognition error.';
      if (event.error === 'not-allowed') {
        msg = 'Microphone permission denied. Please enable microphone access in your browser settings.';
      } else if (event.error === 'no-speech') {
        msg = 'No speech was detected. Please tap mic and speak clearly.';
      } else if (event.error === 'network') {
        msg = 'Network connection issue with speech recognition service.';
      }
      options.onError(msg);
    };

    recognition.onend = () => {
      options.onEnd();
    };

    recognition.start();

    return {
      stop: () => {
        try {
          recognition.stop();
        } catch (e) {
          // ignore already stopped
        }
      }
    };
  } catch (err: any) {
    options.onError(err?.message || 'Could not start voice recognition.');
    options.onEnd();
    return { stop: () => {} };
  }
}

/**
 * Clean up text for natural, crystal-clear speech:
 * - Strips all brackets (round, square, curly) so TTS NEVER speaks "bracket" or "parenthesis"
 * - Removes markdown formatting, hashes, asterisks, divider rules
 * - Removes emojis and pictorial icons so TTS never reads emoji names
 * - Removes standalone URLs and technical web paths
 * - Converts currency symbol ₹ into natural words (रुपये, টাকা, ரூபாய், రూపాయలు, Rupees)
 * - Removes internal number commas so numbers are pronounced as complete quantities
 * - Replaces colons, semicolons, and dashes with natural pauses
 */
export function cleanTextForSpeech(text: string, langCode?: string): string {
  if (!text) return '';

  let cleaned = text;

  // 1. Remove markdown links e.g. [myScheme](url) -> keep text only
  cleaned = cleaned.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

  // 2. Remove all URLs and web addresses (http, https, www, .gov.in, .nic.in, etc.)
  cleaned = cleaned.replace(/https?:\/\/\S+/gi, '');
  cleaned = cleaned.replace(/www\.[a-z0-9\-\.]+\.[a-z]{2,}/gi, '');
  cleaned = cleaned.replace(/\b[a-z0-9\-\.]+\.(gov|nic|org|ac|edu)\.in\S*/gi, '');

  // 3. Remove internal technical route paths e.g. /check-eligibility, /schemes/pm-kisan
  cleaned = cleaned.replace(/\/(check-eligibility|occupation-questions|dashboard|saved|schemes\/[a-z0-9\-]+|login|onboarding)\S*/gi, '');

  // 4. Remove citation tags e.g. [Excerpt 1 - ...], [संदर्भ: ...], [1], [2]
  cleaned = cleaned.replace(/\[(?:Excerpt|संदर्भ|Citation|Ref)[^\]]*\]/gi, '');
  cleaned = cleaned.replace(/\[\d+\]/g, '');

  // 5. Remove all square brackets [ and ], curly braces { and }
  cleaned = cleaned.replace(/[\[\]\{\}]/g, ' ');

  // 6. Remove parentheses ( and ) completely so TTS NEVER speaks "bracket" or "parenthesis"
  // e.g. (PM-KISAN) -> PM-KISAN, (DBT) -> DBT, (70+) -> 70+
  cleaned = cleaned.replace(/[\(\)]/g, ' ');

  // 7. Remove markdown headers, horizontal dividers and blockquotes
  cleaned = cleaned.replace(/^[#\>\-\=\*\s]{2,}\s*/gm, '\n');
  cleaned = cleaned.replace(/#{1,6}\s*/g, ' ');

  // 8. Remove bold/italic markdown asterisks, underscores, and backticks
  cleaned = cleaned.replace(/\*{1,3}([^*]+)\*{1,3}/g, '$1');
  cleaned = cleaned.replace(/_{1,3}([^_]+)_{1,3}/g, '$1');
  cleaned = cleaned.replace(/`{1,3}([^`]+)`{1,3}/g, '$1');

  // 9. Remove all emojis and miscellaneous pictographic symbols so TTS never reads them aloud
  cleaned = cleaned.replace(/[\u{1F300}-\u{1FAFF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F1E0}-\u{1F1FF}]/gu, ' ');

  // 10. Replace per-unit slashes before removing punctuation
  cleaned = cleaned.replace(/\/year\b/gi, ' per year');
  cleaned = cleaned.replace(/\/month\b/gi, ' per month');
  cleaned = cleaned.replace(/\/वर्ष\b/g, ' प्रति वर्ष');
  cleaned = cleaned.replace(/\/साल\b/g, ' प्रति साल');
  cleaned = cleaned.replace(/\/माह\b/g, ' प्रति माह');
  cleaned = cleaned.replace(/\/महिना\b/g, ' दरमहा');

  // 11. Handle currency symbol ₹ with scale words like "लाख" or standalone amounts
  const lang = (langCode || '').toLowerCase();
  let currencyWord = 'रुपये';
  if (lang === 'bn') currencyWord = 'টাকা';
  else if (lang === 'ta') currencyWord = 'ரூபாய்';
  else if (lang === 'te') currencyWord = 'రూపాయలు';
  else if (lang === 'en') currencyWord = 'Rupees';

  // Handle amounts like ₹2.5 Lakh or ₹२.५ लाख -> 2.5 लाख रुपये
  cleaned = cleaned.replace(
    /₹\s*([0-9०-९০-৯௦-౯௧-௯]+(?:\.[0-9०-९০-৯௦-౯௧-௯]+)?)\s*(लाख|करोड़|कोटी|हजार|হাজার|লাখ|லட்சம்|கோடி|లక్షల|కోట్ల|Lakh|Crore|Cr|k|M)(?=\s|[.,!?;)]|$)/gi,
    `$1 $2 ${currencyWord} `
  );

  // Handle standalone amounts like ₹75,000 or ₹७५,००० -> 75000 रुपये
  cleaned = cleaned.replace(/₹\s*([0-9०-९০-৯௦-౯௧-௯]+(?:[.,][0-9०-९০-৯௦-౯௧-௯]+)*)/g, (_, num) => {
    const cleanNum = num.replace(/,/g, '');
    return `${cleanNum} ${currencyWord} `;
  });
  cleaned = cleaned.replace(/₹/g, ` ${currencyWord} `);

  // 12. Remove commas inside numbers (e.g. 1,25,000 -> 125000, १,२५,००० -> १२५०००)
  cleaned = cleaned.replace(/([0-9०-९০-৯௦-౯௧-௯]+),([0-9०-९০-৯௦-౯௧-௯]+)/g, '$1$2');
  cleaned = cleaned.replace(/([0-9०-९০-৯௦-౯௧-௯]+),([0-9०-९০-৯௦-౯௧-௯]+)/g, '$1$2');

  // 13. Replace bullet point characters with natural sentence break
  cleaned = cleaned.replace(/[•·●○■▪▫◆◇✦★☆✓✔☑]/g, '. ');

  // 14. Turn hyphens inside words like PM-KISAN into space e.g. "PM KISAN" so TTS flows naturally
  cleaned = cleaned.replace(/([a-zA-Z\u0900-\u097F\u0980-\u09FF\u0B80-\u0BFF\u0C00-\u0C7F])-([a-zA-Z\u0900-\u097F\u0980-\u09FF\u0B80-\u0BFF\u0C00-\u0C7F])/g, '$1 $2');

  // 15. Clean punctuation symbols that TTS speaks aloud:
  cleaned = cleaned.replace(/[:;]\s*/g, ', ');
  cleaned = cleaned.replace(/[|\\\/~^%@+=<>«»"'"`]/g, ' ');
  cleaned = cleaned.replace(/[-–—]{2,}/g, '. ');
  cleaned = cleaned.replace(/\s*[-–—]\s*/g, ' ');

  // 16. Remove trailing dangling labels where URLs were stripped
  cleaned = cleaned.replace(/(?:अधिकृत पोर्टल|पोर्टल|आधिकारिक पोर्टल|ऑफिशियल पोर्टल|Official Portal|Apply Online|Website|विवरण|तपशील|Details at|Details)\s*[,.-]*\s*/gi, '');

  // 17. Normalize punctuation and whitespace:
  cleaned = cleaned.replace(/([^\d०-९০-৯௦-౯௧-௯\s])\s*\.+\s*/g, '$1. ');
  cleaned = cleaned.replace(/[,，\s]*,+/g, ', ');
  cleaned = cleaned.replace(/\s+/g, ' ');

  return cleaned.trim();
}

/**
 * Speak text aloud in the specified regional language
 */
export function speakText(
  text: string,
  options?: {
    langCode?: string;
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (err: any) => void;
  }
): void {
  if (!isSpeechSynthesisSupported()) {
    if (options?.onError) options.onError('Speech synthesis not supported in this browser.');
    return;
  }

  // Cancel any currently speaking audio
  window.speechSynthesis.cancel();

  const cleaned = cleanTextForSpeech(text, options?.langCode);
  if (!cleaned) return;

  const utterance = new SpeechSynthesisUtterance(cleaned);

  const targetBcp = options?.langCode && REGIONAL_SPEECH_LANGS[options.langCode]
    ? REGIONAL_SPEECH_LANGS[options.langCode].bcp47
    : options?.langCode && options.langCode.includes('-')
    ? options.langCode
    : 'hi-IN';

  utterance.lang = targetBcp;
  utterance.rate = 0.95; // slightly slower for clear government guidance
  utterance.pitch = 1.0;

  // Attempt to select a regional voice if available
  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    const langPrefix = targetBcp.split('-')[0].toLowerCase();
    const matchingVoice =
      voices.find((v) => v.lang.toLowerCase() === targetBcp.toLowerCase()) ||
      voices.find((v) => v.lang.toLowerCase().replace('_', '-').startsWith(targetBcp.toLowerCase())) ||
      voices.find((v) => v.lang.toLowerCase().startsWith(langPrefix)) ||
      voices.find((v) => v.lang.toLowerCase().includes(langPrefix)) ||
      voices.find((v) => v.lang.includes('IN')) ||
      voices[0];

    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }
  }

  if (options?.onStart) utterance.onstart = options.onStart;
  if (options?.onEnd) utterance.onend = options.onEnd;
  if (options?.onError) utterance.onerror = options.onError;

  window.speechSynthesis.speak(utterance);
}

/**
 * Stop any ongoing speech playback
 */
export function stopSpeaking(): void {
  if (isSpeechSynthesisSupported()) {
    window.speechSynthesis.cancel();
  }
}

/**
 * Check if speech playback is currently active
 */
export function isCurrentlySpeaking(): boolean {
  if (!isSpeechSynthesisSupported()) return false;
  return window.speechSynthesis.speaking;
}
