'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/components/language-provider';
import { SUPPORTED_LANGUAGES } from '@/lib/i18n/translations';
import {
  Accessibility,
  Volume2,
  VolumeX,
  Type,
  SunMedium,
  RotateCcw,
  X,
  Check,
  Globe2
} from 'lucide-react';

export function AccessibilityWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'larger'>('normal');
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const savedSize = localStorage.getItem('scheme_font_size') as any;
    const savedContrast = localStorage.getItem('scheme_high_contrast') === 'true';

    if (savedSize) {
      setFontSize(savedSize);
      applyFontSize(savedSize);
    }
    if (savedContrast) {
      setIsHighContrast(true);
      document.documentElement.classList.add('high-contrast');
    }
  }, []);

  const applyFontSize = (size: 'normal' | 'large' | 'larger') => {
    const root = document.documentElement;
    root.classList.remove('font-size-large', 'font-size-larger');
    if (size === 'large') root.classList.add('font-size-large');
    if (size === 'larger') root.classList.add('font-size-larger');
  };

  const handleFontSizeChange = (size: 'normal' | 'large' | 'larger') => {
    setFontSize(size);
    localStorage.setItem('scheme_font_size', size);
    applyFontSize(size);
  };

  const handleToggleContrast = () => {
    const next = !isHighContrast;
    setIsHighContrast(next);
    localStorage.setItem('scheme_high_contrast', String(next));
    if (next) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  };

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported on this browser.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const text = document.querySelector('main')?.textContent || document.body.textContent || '';
    const cleanText = text.replace(/\s+/g, ' ').slice(0, 500);

    const utterance = new SpeechSynthesisUtterance(cleanText);
    const langMap: Record<string, string> = {
      en: 'en-IN',
      hi: 'hi-IN',
      mr: 'mr-IN',
      bn: 'bn-IN',
      ta: 'ta-IN',
      te: 'te-IN'
    };
    utterance.lang = langMap[language] || 'en-IN';
    utterance.rate = 0.9;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleReset = () => {
    handleFontSizeChange('normal');
    if (isHighContrast) handleToggleContrast();
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <>
      {/* Floating Official Accessibility Button (myScheme Right Edge) */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed right-0 top-1/2 -translate-y-1/2 z-50 bg-[#2563EB] hover:bg-[#1D4ED8] text-white p-2.5 rounded-l-xl shadow-lg border-y border-l border-blue-400/30 flex flex-col items-center justify-center gap-1 transition-all hover:pl-3 group cursor-pointer"
        title="Accessibility & Citizen Assistance"
        aria-label="Accessibility settings"
      >
        <Accessibility className="w-5 h-5 group-hover:scale-110 transition-transform" />
        <span className="text-[9px] font-bold uppercase tracking-wider writing-vertical hidden sm:block">
          Access
        </span>
      </button>

      {/* Accessibility Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white dark:bg-[#0D1E38] border-2 border-slate-200 dark:border-blue-900/40 rounded-2xl shadow-2xl max-w-sm w-full p-5 space-y-5 text-slate-900 dark:text-white">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-blue-900/30 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950 text-[#1E40AF] dark:text-blue-400 flex items-center justify-center">
                  <Accessibility className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">{t('accessibilityTitle')}</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{t('accessibilitySubtitle')}</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 1. Text Size (A- / A / A+) */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Type className="w-4 h-4 text-[#1E40AF] dark:text-blue-400" />
                <span>{t('textSizeLabel')}</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'normal', label: 'A', desc: 'Default' },
                  { id: 'large', label: 'A+', desc: 'Large' },
                  { id: 'larger', label: 'A++', desc: 'Largest' }
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => handleFontSizeChange(s.id as any)}
                    className={`py-2 px-3 rounded-xl border font-bold text-xs flex flex-col items-center transition-all cursor-pointer ${
                      fontSize === s.id
                        ? 'bg-[#1E40AF] text-white border-blue-800 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-[#1E40AF]'
                    }`}
                  >
                    <span className="text-sm">{s.label}</span>
                    <span className="text-[10px] font-normal opacity-80">{s.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. High Contrast */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <SunMedium className="w-4 h-4 text-amber-500" />
                <div>
                  <div className="text-xs font-bold">{t('highContrastLabel')}</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">{t('highContrastDesc')}</div>
                </div>
              </div>
              <button
                onClick={handleToggleContrast}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  isHighContrast
                    ? 'bg-[#1E40AF] text-white shadow-xs'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {isHighContrast ? 'ON' : 'OFF'}
              </button>
            </div>

            {/* 3. Screen Voice Reader */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2">
                {isSpeaking ? (
                  <VolumeX className="w-4 h-4 text-rose-500" />
                ) : (
                  <Volume2 className="w-4 h-4 text-blue-500" />
                )}
                <div>
                  <div className="text-xs font-bold">{t('voiceReaderLabel')}</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">{t('voiceReaderDesc')}</div>
                </div>
              </div>
              <button
                onClick={handleSpeak}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  isSpeaking
                    ? 'bg-rose-500 text-white animate-pulse'
                    : 'bg-[#1E40AF] hover:bg-[#1D4ED8] text-white shadow-xs'
                }`}
              >
                {isSpeaking ? t('voiceStop') : t('voiceListen')}
              </button>
            </div>

            {/* 4. Language Quick Select */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Globe2 className="w-4 h-4 text-[#1E40AF] dark:text-blue-400" />
                <span>{t('selectLanguageLabel')}</span>
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {SUPPORTED_LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => setLanguage(l.code as any)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                      language === l.code
                        ? 'bg-[#1E40AF] text-white border-blue-800'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-[#1E40AF]'
                    }`}
                  >
                    {l.nativeLabel}
                  </button>
                ))}
              </div>
            </div>

            {/* Reset & Done */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-blue-900/30">
              <button
                onClick={handleReset}
                className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-white flex items-center gap-1 font-medium cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t('resetAllSettings')}</span>
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-1.5 rounded-xl bg-[#1E40AF] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                {t('applyAndClose')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
