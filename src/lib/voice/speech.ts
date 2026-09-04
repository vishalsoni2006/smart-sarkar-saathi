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
 * Clean up text for natural, pleasant speech (removes asterisks, markdown, citations, URLs)
 */
export function cleanTextForSpeech(text: string): string {
  return text
    // Remove markdown links e.g. [myScheme](url) -> myScheme
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove standalone URLs
    .replace(/https?:\/\/\S+/g, '')
    // Remove markdown citations e.g. [Excerpt 1 - ...]
    .replace(/\[Excerpt\s*\d+[^\]]*\]/gi, '')
    // Remove citation footnotes [1], [2]
    .replace(/\[\d+\]/g, '')
    // Remove bold and italic markdown asterisks
    .replace(/\*{1,3}([^*]+)\*{1,3}/g, '$1')
    // Remove backticks
    .replace(/`([^`]+)`/g, '$1')
    // Remove bullet points and headers
    .replace(/^[#\-\*\>]\s+/gm, '')
    // Remove excessive symbols
    .replace(/[~_=]/g, '')
    .trim();
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

  const cleaned = cleanTextForSpeech(text);
  if (!cleaned) return;

  const utterance = new SpeechSynthesisUtterance(cleaned);

  const targetBcp = options?.langCode && REGIONAL_SPEECH_LANGS[options.langCode]
    ? REGIONAL_SPEECH_LANGS[options.langCode].bcp47
    : 'hi-IN';

  utterance.lang = targetBcp;
  utterance.rate = 0.95; // slightly slower for clear government guidance
  utterance.pitch = 1.0;

  // Attempt to select a regional voice if available
  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    const matchingVoice =
      voices.find((v) => v.lang.toLowerCase() === targetBcp.toLowerCase()) ||
      voices.find((v) => v.lang.toLowerCase().startsWith(targetBcp.split('-')[0])) ||
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
