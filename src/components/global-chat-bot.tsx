'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Bot, X, Send, Mic, Volume2, VolumeX, Sparkles, BookOpen, ExternalLink, Globe, Radio, Square, Layers, MessageSquare } from 'lucide-react';
import { VERIFIED_SCHEMES } from '@/data/schemes';
import { executeGroundedRAGChat } from '@/lib/llm/client';
import { getSchemesForOccupation } from '@/lib/rag/vector-search';
import { useLanguage } from '@/components/language-provider';
import {
  startVoiceRecognition,
  speakText,
  stopSpeaking,
  REGIONAL_SPEECH_LANGS
} from '@/lib/voice/speech';
import { ChatMessage, Citation, Scheme } from '@/types';

const WELCOME_MESSAGES: Record<string, { content: string; prompts: string[] }> = {
  hi: {
    content: 'नमस्ते! मैं आपका AI सरकार साथी हूँ। आप भारत सरकार की किसी भी योजना के बारे में हिंदी में पूछ सकते हैं या माइक से बोल सकते हैं! आपके सभी उत्तर हिंदी में मिलेंगे।',
    prompts: [
      'विद्यार्थियों के लिए कौन सी योजनाएं सबसे अच्छी हैं?',
      'किसान भाइयों के लिए कौनसी योजनाएं हैं?',
      'फेरीवालों (Street Vendors) के लिए योजनाएं',
      'स्वरोजगार और व्यापार के लिए योजनाएं',
      'वरिष्ठ नागरिकों (70+) के लिए स्वास्थ्य योजना'
    ]
  },
  mr: {
    content: 'नमस्कार! मी आपला AI सरकार साथी आहे. आपण केंद्र सरकारच्या कोणत्याही योजनेबद्दल मराठीत विचारू शकता किंवा माइकद्वारे बोलू शकता! आपली सर्व उत्तरे मराठीतच मिळतील.',
    prompts: [
      'विद्यार्थ्यांसाठी कोणत्या योजना सर्वात चांगल्या आहेत?',
      'शेतकऱ्यांसाठी कोणत्या योजना आहेत?',
      'फेरीवाले आणि पथविक्रेत्यांसाठी योजना',
      'व्यवसाय आणि तरुणांसाठी कर्ज योजना',
      '७० वर्षांवरील ज्येष्ठ नागरिकांसाठी आरोग्य योजना'
    ]
  },
  bn: {
    content: 'নমস্কার! আমি আপনার AI সরকার সাথী। ভারত সরকারের যেকোনো যোজনা সম্পর্কে বাংলায় প্রশ্ন করুন বা মাইকে বলুন! আপনার সমস্ত উত্তর বাংলায় দেওয়া হবে।',
    prompts: [
      'শিক্ষার্থীদের জন্য সেরা সরকারি যোজনা কী কী?',
      'কৃষকদের জন্য সেরা সরকারি প্রকল্পগুলি কী কী?',
      'হকার ও পথ বিক্রেতাদের জন্য কী কী স্কিম আছে?',
      'ব্যবসা ও যুবকদের জন্য স্বরোজগার ঋণ যোজনা',
      '৭০ বছরের বেশি প্রবীণদের জন্য স্বাস্থ্য প্রকল্প'
    ]
  },
  ta: {
    content: 'வணக்கம்! நான் உங்கள் AI அரசு தோழன் (Sarkar Saathi). மத்திய அரசு திட்டங்கள் பற்றி தமிழில் கேளுங்கள் அல்லது மைக்கில் பேசுங்கள்! உங்கள் பதில்கள் அனைத்தும் தமிழிலேயே வழங்கப்படும்.',
    prompts: [
      'மாணவர்களுக்கான சிறந்த திட்டங்கள் எவை?',
      'விவசாயிகளுக்கான சிறந்த அரசு திட்டங்கள் எவை?',
      'சாலையோர வியாபாரிகளுக்கான அரசு கடனுதவி',
      'தொழில் தொடங்க இளைஞர்களுக்கான முத்ரா கடன்',
      '70 வயதுக்கு மேற்பட்ட முதியவர்களுக்கான ஆயுஷ்மான் பாரத்'
    ]
  },
  te: {
    content: 'నమస్కారం! నేను మీ AI సర్కార్ సాథీని. భారత ప్రభుత్వ పథకాల గురించి తెలుగులో అడగండి లేదా మైక్‌లో మాట్లాడండి! మీ సమాధానాలన్నీ తెలుగులోనే లభిస్తాయి.',
    prompts: [
      'విద్యార్థుల కోసం ఉత్తమ పథకాలు ఏమిటి?',
      'రైతుల కోసం ఉత్తమ ప్రభుత్వ పథకాలు ఏమిటి?',
      'వీధి వ్యాపారుల కోసం పీఎం స్వనిధి పథకం',
      'యువత మరియు వ్యాపారం కోసం రుణాలు',
      '70 ఏళ్లు పైబడిన సీనియర్ సిటిజన్లకు ఆయుష్మాన్ భారత్'
    ]
  },
  en: {
    content: 'Namaste! I am your AI Sarkar Saathi. Ask me about any Government of India scheme or tap the mic to speak. Answers will be provided in your selected language!',
    prompts: [
      'What are the best yojnas for students?',
      'What schemes are for farmers?',
      'What schemes are for street vendors?',
      'What schemes are for business & startups?',
      'What schemes are available for senior citizens 70+?'
    ]
  }
};

const TOPIC_CHIPS: Record<string, { label: string; query: string }[]> = {
  hi: [
    { label: '🎓 विद्यार्थी (Scholarships)', query: 'विद्यार्थियों के लिए कौन सी योजनाएं सबसे अच्छी हैं?' },
    { label: '🌾 किसान (कृषि व DBT)', query: 'किसान भाइयों के लिए कौनसी योजनाएं सबसे अच्छी हैं?' },
    { label: '🛒 फेरीवाले (Street Vendors)', query: 'फेरीवालों और रेहड़ी-पटरी वालों के लिए कौनसी योजनाएं हैं?' },
    { label: '💼 स्वरोजगार व व्यापार', query: 'व्यापार, स्वरोजगार और युवाओं के लिए कौनसी योजनाएं हैं?' },
    { label: '👴 वरिष्ठ नागरिक 70+', query: '70 वर्ष से अधिक उम्र के बुजुर्गों और वरिष्ठ नागरिकों के लिए कौनसी योजनाएं हैं?' }
  ],
  mr: [
    { label: '🎓 विद्यार्थी (शिष्यवृत्ती)', query: 'विद्यार्थ्यांसाठी कोणत्या योजना सर्वात चांगल्या आहेत?' },
    { label: '🌾 शेतकरी (कृषी व DBT)', query: 'शेतकऱ्यांसाठी कोणत्या योजना सर्वात चांगल्या आहेत?' },
    { label: '🛒 पथविक्रेते (फेरीवाले)', query: 'फेरीवाले आणि पथविक्रेत्यांसाठी कोणत्या योजना आहेत?' },
    { label: '💼 व्यवसाय व तरुण', query: 'व्यवसाय, स्टार्टअप आणि तरुणांसाठी कोणत्या योजना आहेत?' },
    { label: '👴 ज्येष्ठ नागरिक 70+', query: '70 वर्षांवरील ज्येष्ठ नागरिकांसाठी कोणत्या योजना आहेत?' }
  ],
  bn: [
    { label: '🎓 শিক্ষার্থী (স্কলারশিপ)', query: 'শিক্ষার্থীদের জন্য সেরা সরকারি যোজনা কী কী?' },
    { label: '🌾 কৃষক (কৃষি সহায়তা)', query: 'কৃষকদের জন্য সেরা সরকারি যোজনাগুলি কী কী?' },
    { label: '🛒 হকার ও বিক্রেতা', query: 'হকার এবং পথ বিক্রেতাদের জন্য কী কী স্কিম আছে?' },
    { label: '💼 ব্যবসা ও কর্মসংস্থান', query: 'ব্যবসা ও যুবকদের জন্য সেরা স্কিম কী কী?' },
    { label: '👴 প্রবীণ নাগরিক 70+', query: '৭০ বছর বা তার বেশি বয়সী প্রবীণদের জন্য কী কী প্রকল্প আছে?' }
  ],
  ta: [
    { label: '🎓 மாணவர்கள் (கல்வி)', query: 'மாணவர்களுக்கான சிறந்த திட்டங்கள் எவை?' },
    { label: '🌾 விவசாயிகள் (விவசாயம்)', query: 'விவசாயிகளுக்கான சிறந்த அரசு திட்டங்கள் எவை?' },
    { label: '🛒 சாலையோர வியாபாரி', query: 'சாலையோர வியாபாரிகளுக்கான திட்டங்கள் எவை?' },
    { label: '💼 தொழில் & இளைஞர்', query: 'தொழில் மற்றும் இளைஞர்களுக்கான சிறந்த திட்டங்கள் எவை?' },
    { label: '👴 மூத்த குடிமக்கள் 70+', query: '70 வயதுக்கு மேற்பட்ட மூத்த குடிமக்களுக்கான திட்டங்கள் எவை?' }
  ],
  te: [
    { label: '🎓 విద్యార్థులు (చదువు)', query: 'విద్యార్థుల కోసం ఉత్తమ పథకాలు ఏమిటి?' },
    { label: '🌾 రైతులు (వ్యవసాయం)', query: 'రైతుల కోసం ఉత్తమ ప్రభుత్వ పథకాలు ఏమిటి?' },
    { label: '🛒 వీధి వ్యాపారులు', query: 'వీధి వ్యాపారుల కోసం ఏ పథకాలు ఉన్నాయి?' },
    { label: '💼 వ్యాపారం & యువత', query: 'వ్యాపారం మరియు యువత కోసం ఉత్తమ పథకాలు ఏవి?' },
    { label: '👴 సీనియర్ సిటిజన్లు 70+', query: '70 ఏళ్లు పైబడిన వృద్ధుల కోసం ఏ పథకాలు ఉన్నాయి?' }
  ],
  en: [
    { label: '🎓 Students (Scholarships)', query: 'What are the best yojnas for students?' },
    { label: '🌾 Farmers (Agriculture)', query: 'What are the best schemes for farmers?' },
    { label: '🛒 Street Vendors (Hawkers)', query: 'What schemes are for street vendors and hawkers?' },
    { label: '💼 Business & Youth', query: 'What schemes are for business, youth, and startups?' },
    { label: '👴 Senior Citizens 70+', query: 'What schemes are available for senior citizens aged 70+?' }
  ]
};

export function GlobalChatBot() {
  const { language, t, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSchemeId, setSelectedSchemeId] = useState<string>('all');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [voiceMode, setVoiceMode] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [activeSpeakingId, setActiveSpeakingId] = useState<string | null>(null);
  const [speechLang, setSpeechLang] = useState(language || 'hi');
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [selectedCitation, setSelectedCitation] = useState<Citation | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<{ stop: () => void } | null>(null);

  useEffect(() => {
    setSpeechLang(language || 'hi');
  }, [language]);


  const handleLanguageChange = (newLang: string) => {
    setSpeechLang(newLang as any);
    if (['hi', 'mr', 'bn', 'ta', 'te', 'en'].includes(newLang)) {
      setLanguage(newLang as any);
    }
    // Update welcome message if conversation is fresh
    if (messages.length <= 1) {
      const welcome = WELCOME_MESSAGES[newLang] || WELCOME_MESSAGES.hi;
      setMessages([
        {
          id: `welcome-${Date.now()}`,
          role: 'assistant',
          content: welcome.content,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggested_prompts: welcome.prompts
        }
      ]);
    }
  };

  // Initialize welcome message when opened
  useEffect(() => {
    if (messages.length === 0) {
      const welcome = WELCOME_MESSAGES[speechLang] || WELCOME_MESSAGES.hi;
      setMessages([
        {
          id: 'welcome-1',
          role: 'assistant',
          content: welcome.content,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggested_prompts: welcome.prompts
        }
      ]);
    }
  }, [messages.length, speechLang]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading, isOpen]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    setSpeechError(null);
    const recognition = startVoiceRecognition({
      langCode: speechLang,
      onStart: () => setIsListening(true),
      onResult: (transcript, isFinal) => {
        setInput(transcript);
      },
      onError: (err) => {
        setSpeechError(err);
        setIsListening(false);
      },
      onEnd: () => {
        setIsListening(false);
      }
    });
    recognitionRef.current = recognition;
  };

  const toggleSpeakMessage = (msgId: string, content: string) => {
    if (activeSpeakingId === msgId) {
      stopSpeaking();
      setActiveSpeakingId(null);
      return;
    }

    stopSpeaking();
    setActiveSpeakingId(msgId);
    speakText(content, {
      langCode: speechLang,
      onStart: () => setActiveSpeakingId(msgId),
      onEnd: () => setActiveSpeakingId(null),
      onError: () => setActiveSpeakingId(null)
    });
  };

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    // Pick target scheme context
    let targetScheme: Scheme;
    if (selectedSchemeId !== 'all') {
      targetScheme =
        VERIFIED_SCHEMES.find((s) => s.id === selectedSchemeId) || VERIFIED_SCHEMES[0];
    } else {
      // Check occupational match first so queries like "schemes for student" match student schemes
      const occupationalMatches = getSchemesForOccupation(query);
      if (occupationalMatches.length > 0) {
        targetScheme = occupationalMatches[0];
      } else {
        const q = query.toLowerCase();
        const match = VERIFIED_SCHEMES.find(
          (s) =>
            q.includes(s.short_name.toLowerCase()) ||
            q.includes(s.name.toLowerCase()) ||
            s.occupation_tags.some((tag) => q.includes(tag.toLowerCase()))
        );
        targetScheme = match || VERIFIED_SCHEMES[0];
      }
    }

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await executeGroundedRAGChat({
        userMessage: query,
        scheme: targetScheme,
        profile: null,
        selectedLanguage: speechLang
      });

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: response.answer,
        detected_language: response.detectedLanguage,
        citations: response.citations,
        suggested_prompts: response.suggestedPrompts,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botMsg]);

      if (voiceMode) {
        setActiveSpeakingId(botMsg.id);
        speakText(botMsg.content, {
          langCode: speechLang,
          onStart: () => setActiveSpeakingId(botMsg.id),
          onEnd: () => setActiveSpeakingId(null),
          onError: () => setActiveSpeakingId(null)
        });
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          role: 'assistant',
          content:
            speechLang === 'hi'
              ? 'नमस्ते! आप https://www.myscheme.gov.in पर आधिकारिक जानकारी देख सकते हैं।'
              : speechLang === 'mr'
              ? 'नमस्कार! आपण https://www.myscheme.gov.in वर अधिकृत माहिती पाहू शकता.'
              : 'Namaste! You can find verified guidelines at https://www.myscheme.gov.in',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button (Bottom-Right) */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#1E40AF] hover:bg-[#1D4ED8] text-white shadow-2xl transition-all duration-200 hover:scale-105 border-2 border-white/20 cursor-pointer animate-bounce group"
          title="Open AI Sarkar Saathi Chatbot with Regional Voice Input"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-amber-300" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-white animate-pulse" />
          </div>
          <span className="font-bold text-xs sm:text-sm tracking-wide">
            AI Saathi <span className="text-amber-200 text-xs">(साथी)</span>
          </span>
          <div className="hidden sm:flex items-center gap-1 bg-white/20 px-1.5 py-0.5 rounded-full text-[10px]">
            <Mic className="w-3 h-3 text-amber-200" />
            <span>Voice</span>
          </div>
        </button>
      )}

      {/* Floating Chat Drawer */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[95vw] sm:w-[440px] h-[600px] max-h-[90vh] rounded-3xl bg-white dark:bg-[#0B1E36] border border-slate-200 dark:border-blue-900/50 shadow-2xl flex flex-col overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="p-3.5 bg-[#0B1E36] text-white border-b border-blue-900/50 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-amber-400">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs sm:text-sm font-black text-white">AI Sarkar Saathi</h3>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 font-bold border border-amber-400/30">
                    साथी
                  </span>
                </div>
                <p className="text-[10px] text-slate-300 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-ping" />
                  <span>Official Multilingual Voice Assistant</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Voice Mode Toggle */}
              <button
                type="button"
                onClick={() => {
                  if (voiceMode) {
                    stopSpeaking();
                    setActiveSpeakingId(null);
                  }
                  setVoiceMode(!voiceMode);
                }}
                className={`p-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                  voiceMode
                    ? 'bg-blue-600 text-white border-blue-400'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                }`}
                title={voiceMode ? 'Voice Mode: ON (Answers spoken aloud)' : 'Enable Voice Mode'}
              >
                {voiceMode ? <Volume2 className="w-4 h-4 text-amber-300 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
              </button>



              {/* Close Button */}
              <button
                type="button"
                onClick={() => {
                  stopSpeaking();
                  setIsOpen(false);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Scheme Context & Language Bar */}
          <div className="px-3 py-2 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5 flex-1 min-w-0">
              <Layers className="w-3.5 h-3.5 text-[#1E40AF] dark:text-blue-400 shrink-0" />
              <select
                value={selectedSchemeId}
                onChange={(e) => setSelectedSchemeId(e.target.value)}
                className="w-full px-2 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate focus:outline-none"
              >
                <option value="all">🌟 All 15 Verified Schemes</option>
                {VERIFIED_SCHEMES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.short_name} — {s.name.slice(0, 22)}...
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <Globe className="w-3.5 h-3.5 text-blue-600 dark:text-amber-300 shrink-0" />
              <select
                value={speechLang}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="px-2 py-1 rounded-lg bg-white dark:bg-slate-800 border border-blue-400/50 dark:border-blue-700 text-[11px] font-black text-[#1E40AF] dark:text-amber-300 focus:outline-none cursor-pointer"
                title="Select language for chat and voice answers"
              >
                <option value="hi">🇮🇳 हिंदी</option>
                <option value="mr">🇮🇳 मराठी</option>
                <option value="bn">🇮🇳 বাংলা</option>
                <option value="ta">🇮🇳 தமிழ்</option>
                <option value="te">🇮🇳 తెలుగు</option>
                <option value="en">🇮🇳 English</option>
              </select>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-slate-50/50 dark:bg-[#071324]/50">
            {messages.map((msg) => {
              const isBot = msg.role === 'assistant';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${isBot ? 'items-start' : 'items-start flex-row-reverse'}`}
                >
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-[11px] font-bold ${
                      isBot ? 'bg-[#1E40AF] text-white' : 'bg-slate-800 text-white'
                    }`}
                  >
                    {isBot ? <Bot className="w-3.5 h-3.5" /> : 'You'}
                  </div>

                  <div className="max-w-[85%] space-y-1.5">
                    <div
                      className={`p-3 rounded-2xl text-xs leading-relaxed ${
                        isBot
                          ? 'bg-white dark:bg-[#0D1E38] text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-blue-900/40 rounded-tl-xs shadow-xs'
                          : 'bg-[#1E40AF] text-white rounded-tr-xs shadow-sm'
                      }`}
                    >
                      <p className="whitespace-pre-line">{msg.content}</p>
                    </div>

                    {/* Citations */}
                    {isBot && msg.citations && msg.citations.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {msg.citations.map((cit, idx) => (
                          <button
                            key={idx}
                            onClick={() => setSelectedCitation(cit)}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20 hover:bg-blue-500/20 transition-colors"
                          >
                            <BookOpen className="w-2.5 h-2.5" />
                            <span>[{cit.citation_label}]</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Suggested Prompts */}
                    {isBot && msg.suggested_prompts && msg.suggested_prompts.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-0.5">
                        {msg.suggested_prompts.map((prompt, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSend(prompt)}
                            className="text-left text-[10px] px-2 py-0.5 rounded-full bg-slate-200/80 dark:bg-slate-800 hover:bg-blue-500/20 text-slate-700 dark:text-slate-300 border border-slate-300/50 dark:border-slate-700 transition-colors"
                          >
                            {prompt}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Timestamp & Speaker Control */}
                    <div className="flex items-center justify-between text-[10px] text-slate-400 px-1">
                      <span>{msg.timestamp}</span>
                      {isBot && (
                        <button
                          type="button"
                          onClick={() =>
                            toggleSpeakMessage(msg.id, msg.content)
                          }
                          className={`flex items-center gap-1 font-semibold cursor-pointer ${
                            activeSpeakingId === msg.id
                              ? 'text-blue-600 dark:text-blue-400 animate-pulse'
                              : 'text-slate-400 hover:text-blue-600'
                          }`}
                        >
                          {activeSpeakingId === msg.id ? (
                            <>
                              <Square className="w-3 h-3 fill-current" />
                              <span>Stop</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-3 h-3" />
                              <span>Listen</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex items-center gap-2 text-xs text-slate-500 pl-8">
                <Sparkles className="w-4 h-4 text-[#1E40AF] animate-spin" />
                <span>Consulting official Government guidelines...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Source Excerpt Drawer */}
          {selectedCitation && (
            <div className="p-2.5 bg-blue-50 dark:bg-blue-950 border-t border-blue-200 dark:border-blue-900 text-xs flex items-start justify-between gap-2 animate-fadeIn">
              <div className="space-y-0.5">
                <span className="font-bold text-blue-900 dark:text-blue-200 flex items-center gap-1 text-[11px]">
                  <BookOpen className="w-3 h-3 text-blue-600" />
                  Verified Excerpt: {selectedCitation.citation_label}
                </span>
                <p className="text-blue-800 dark:text-blue-300 text-[11px] italic">
                  "{selectedCitation.source_excerpt}"
                </p>
              </div>
              <button
                onClick={() => setSelectedCitation(null)}
                className="text-blue-600 font-bold px-1"
              >
                ✕
              </button>
            </div>
          )}

          {/* Live Mic Listening Strip */}
          {isListening && (
            <div className="px-3 py-2 bg-rose-50 dark:bg-rose-950/50 border-t border-rose-200 dark:border-rose-900 flex items-center justify-between text-xs text-rose-700 dark:text-rose-300 animate-pulse">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
                <span className="font-bold text-[11px]">
                  Listening in {REGIONAL_SPEECH_LANGS[speechLang]?.name || 'Hindi'}... Speak now!
                </span>
              </div>
              <button
                type="button"
                onClick={toggleListening}
                className="text-xs font-bold underline cursor-pointer hover:text-rose-900"
              >
                Done
              </button>
            </div>
          )}

          {speechError && (
            <div className="px-3 py-1.5 bg-amber-50 dark:bg-amber-950/40 border-t border-amber-200 dark:border-amber-900 flex items-center justify-between text-[11px] text-amber-800 dark:text-amber-200">
              <span>{speechError}</span>
              <button onClick={() => setSpeechError(null)} className="font-bold ml-1">
                ✕
              </button>
            </div>
          )}

          {/* Quick Topic Chips for Students, Farmers, Vendors, Business */}
          <div className="px-3 pt-2 pb-1 bg-slate-50 dark:bg-[#0B1E36] border-t border-slate-200/60 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[11px]">
            {(TOPIC_CHIPS[speechLang] || TOPIC_CHIPS.hi).map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(chip.query)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-[#1E40AF] dark:text-blue-300 font-bold hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors cursor-pointer"
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Chat Input Bar with Mic */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1E36] flex items-center gap-2"
          >
            {/* Regional Voice Language Selector */}
            <select
              value={speechLang}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="text-[11px] font-bold px-1.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer focus:outline-none"
              title="Select chat and speech language"
            >
              <option value="hi">हिंदी</option>
              <option value="mr">मराठी</option>
              <option value="bn">বাংলা</option>
              <option value="ta">தமிழ்</option>
              <option value="te">తెలుగు</option>
              <option value="en">English</option>
            </select>

            {/* Mic Button */}
            <button
              type="button"
              onClick={toggleListening}
              className={`p-2 rounded-xl border transition-all cursor-pointer shrink-0 flex items-center justify-center ${
                isListening
                  ? 'bg-rose-600 text-white border-rose-600 animate-pulse shadow-md'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-[#1E40AF] dark:text-blue-400 border-slate-300 dark:border-slate-700'
              }`}
              title="Tap to speak in selected language"
            >
              {isListening ? (
                <Radio className="w-4 h-4 text-white animate-spin" />
              ) : (
                <Mic className="w-4 h-4" />
              )}
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                speechLang === 'hi'
                  ? 'योजना संबंधी प्रश्न पूछें या माइक दबाएं...'
                  : speechLang === 'mr'
                  ? 'योजनेबद्दल प्रश्न विचारा किंवा माइकवर बोला...'
                  : speechLang === 'bn'
                  ? 'যোজনা সম্পর্কে জিজ্ঞাসা করুন বা বলুন...'
                  : speechLang === 'ta'
                  ? 'திட்டம் பற்றி கேட்கவும் அல்லது பேசவும்...'
                  : speechLang === 'te'
                  ? 'పథకం గురించి అడగండి లేదా మాట్లాడండి...'
                  : 'Ask scheme question or tap mic to speak...'
              }
              className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1E40AF] text-slate-900 dark:text-white"
            />

            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2 rounded-xl bg-[#1E40AF] hover:bg-[#1D4ED8] disabled:opacity-50 text-white font-bold transition-all shrink-0 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

    </>
  );
}
