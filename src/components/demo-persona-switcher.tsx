'use client';

import React, { useState, useEffect } from 'react';
import { DEMO_PERSONAS } from '@/data/taxonomy';
import { getActiveProfile, switchDemoPersona } from '@/lib/firebase/storage';
import { useLanguage } from '@/components/language-provider';
import { UserProfile } from '@/types';
import { User, Users, ChevronDown, Check, Sparkles } from 'lucide-react';

interface DemoPersonaSwitcherProps {
  onPersonaChange?: (profile: UserProfile) => void;
}

export function DemoPersonaSwitcher({ onPersonaChange }: DemoPersonaSwitcherProps) {
  const { t } = useLanguage();
  const [activeProfile, setActiveProfileState] = useState<UserProfile | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setActiveProfileState(getActiveProfile());

    const handleProfileUpdate = (e: any) => {
      setActiveProfileState(e.detail);
    };

    window.addEventListener('scheme_navigator_profile_updated', handleProfileUpdate);
    return () => window.removeEventListener('scheme_navigator_profile_updated', handleProfileUpdate);
  }, []);

  const handleSelect = (personaId: string) => {
    const updated = switchDemoPersona(personaId);
    setActiveProfileState(updated);
    setIsOpen(false);
    if (onPersonaChange) onPersonaChange(updated);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-[#1E40AF] dark:text-blue-400 border border-blue-500/30 text-xs font-semibold transition-colors"
        title="Switch Demo Citizen Persona"
      >
        <Sparkles className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">{t('demoPersonaLabel', 'Demo Persona')}:</span>
        <span className="font-bold text-slate-900 dark:text-white">
          {activeProfile?.name || 'Ramesh Kumar'}
        </span>
        <ChevronDown className="w-3.5 h-3.5" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white dark:bg-[#0D1E38] border border-slate-200 dark:border-blue-900/40 shadow-xl z-50 p-2 space-y-1">
            <div className="px-3 py-2 border-b border-slate-100 dark:border-blue-900/30">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {t('oneClickPersonas', '1-Click Judge & Demo Personas')}
              </span>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {t('personaSubtitleHint', 'Instantly test different demographic profiles & eligibility rules')}
              </p>
            </div>

            <div className="max-h-80 overflow-y-auto space-y-1 py-1">
              {DEMO_PERSONAS.map((p) => {
                const isCurrent = activeProfile?.id === p.profile.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => handleSelect(p.id)}
                    className={`w-full text-left p-2.5 rounded-xl transition-colors flex items-start justify-between gap-2 text-xs ${
                      isCurrent
                        ? 'bg-blue-500/15 text-[#1E40AF] dark:text-blue-400 font-bold border border-blue-500/30'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">{p.name}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{p.subtitle}</div>
                    </div>
                    {isCurrent && <Check className="w-4 h-4 text-[#1E40AF] shrink-0 mt-0.5" />}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
