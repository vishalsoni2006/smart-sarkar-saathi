'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  SupportedLanguage,
  TRANSLATIONS,
  SUPPORTED_LANGUAGES,
  getTranslatedCategory,
  getTranslatedOccupation,
  getTranslatedSchemeName,
  getTranslatedSchemeBenefit
} from '@/lib/i18n/translations';

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string, defaultText?: string) => string;
  getCategory: (category: string) => string;
  getOccupation: (occupation: string) => string;
  getSchemeName: (schemeId: string, defaultName: string) => string;
  getSchemeBenefit: (schemeId: string, defaultBenefit: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<SupportedLanguage>('en');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('scheme_navigator_lang') as SupportedLanguage | null;
      if (saved && TRANSLATIONS[saved]) {
        setLanguageState(saved);
      }
    }
  }, []);

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('scheme_navigator_lang', lang);
      window.dispatchEvent(new CustomEvent('scheme_navigator_lang_changed', { detail: lang }));
    }
  };

  const t = (key: string, defaultText?: string): string => {
    const langDict = TRANSLATIONS[language] || TRANSLATIONS.en;
    if (langDict && langDict[key]) {
      return langDict[key];
    }
    if (TRANSLATIONS.en && TRANSLATIONS.en[key]) {
      return TRANSLATIONS.en[key];
    }
    return defaultText || key;
  };

  const getCategory = (category: string): string => {
    return getTranslatedCategory(category, language);
  };

  const getOccupation = (occupation: string): string => {
    return getTranslatedOccupation(occupation, language);
  };

  const getSchemeName = (schemeId: string, defaultName: string): string => {
    return getTranslatedSchemeName(schemeId, defaultName, language);
  };

  const getSchemeBenefit = (schemeId: string, defaultBenefit: string): string => {
    return getTranslatedSchemeBenefit(schemeId, defaultBenefit, language);
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        getCategory,
        getOccupation,
        getSchemeName,
        getSchemeBenefit
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
