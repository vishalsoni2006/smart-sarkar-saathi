'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { VERIFIED_SCHEMES } from '@/data/schemes';
import { getSavedSchemeIds, getActiveProfile, toggleSaveScheme } from '@/lib/firebase/storage';
import { evaluateEligibility } from '@/lib/rule-engine/evaluator';
import { useLanguage } from '@/components/language-provider';
import { SchemeCard } from '@/components/scheme-card';
import { Bookmark, BookmarkX, ArrowRight, Layers } from 'lucide-react';

export default function SavedSchemesPage() {
  const { t } = useLanguage();
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [profile, setProfileState] = useState(() => getActiveProfile());

  useEffect(() => {
    setSavedIds(getSavedSchemeIds());

    const handleSavedUpdate = (e: any) => {
      setSavedIds(e.detail);
    };

    window.addEventListener('scheme_navigator_saved_updated', handleSavedUpdate);
    return () => window.removeEventListener('scheme_navigator_saved_updated', handleSavedUpdate);
  }, []);

  const savedSchemes = VERIFIED_SCHEMES.filter((s) => savedIds.includes(s.id)).map((scheme) => ({
    scheme,
    verdict: evaluateEligibility(scheme, profile)
  }));

  const handleToggleSave = (schemeId: string, newState: boolean) => {
    if (!newState) {
      setSavedIds((prev) => prev.filter((id) => id !== schemeId));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-blue-900/30 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-[#1E40AF] dark:text-blue-400 text-xs font-bold mb-2">
            <Bookmark className="w-3.5 h-3.5" />
            <span>{t('bookmarkedSchemesBadge', 'Bookmarked Schemes')}</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">
            {t('savedSchemesTitle', 'Saved Schemes')} ({savedSchemes.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t('savedSchemesSubtitle', 'Keep track of schemes you are interested in or preparing documents for.')}
          </p>
        </div>

        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-[#1E40AF] hover:bg-[#1D4ED8] text-white font-bold text-xs shadow-xs transition-colors self-start sm:self-center"
        >
          <Layers className="w-4 h-4" />
          <span>{t('browseAllSchemesBtn', 'Browse All Schemes')}</span>
        </Link>
      </div>

      {savedSchemes.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#0D1E38] border border-slate-200 dark:border-blue-900/40 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/15 text-[#1E40AF] dark:text-blue-400 flex items-center justify-center mx-auto">
            <BookmarkX className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t('noSavedSchemesTitle', 'No Saved Schemes Yet')}</h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
            {t('noSavedSchemesDesc', 'Click the bookmark icon on any scheme card in the directory to save it here for quick access.')}
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-[#1E40AF] hover:bg-[#1D4ED8] text-white font-bold text-xs"
          >
            <span>{t('exploreSchemesBtn', 'Explore Schemes')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedSchemes.map((item) => (
            <SchemeCard
              key={item.scheme.id}
              scheme={item.scheme}
              verdict={item.verdict}
              isSaved={true}
              onToggleSave={handleToggleSave}
            />
          ))}
        </div>
      )}
    </div>
  );
}
