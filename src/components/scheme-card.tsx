'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { EligibilityVerdict, Scheme } from '@/types';
import { ConfidenceBadge } from '@/components/confidence-badge';
import { useLanguage } from '@/components/language-provider';
import { Bookmark, BookmarkCheck, ChevronRight, ExternalLink, Calendar, Building2, FileCheck2, Sparkles } from 'lucide-react';
import { toggleSaveScheme } from '@/lib/firebase/storage';

interface SchemeCardProps {
  scheme: Scheme;
  verdict: EligibilityVerdict;
  isSaved?: boolean;
  onToggleSave?: (schemeId: string, newState: boolean) => void;
  isFuzzyMatch?: boolean;
}

export function SchemeCard({ scheme, verdict, isSaved = false, onToggleSave, isFuzzyMatch }: SchemeCardProps) {
  const { t, getCategory, getSchemeName, getSchemeBenefit } = useLanguage();
  const [saved, setSaved] = useState(isSaved);

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newState = await toggleSaveScheme(scheme.id);
    setSaved(newState);
    if (onToggleSave) onToggleSave(scheme.id, newState);
  };

  const isEligible = verdict.status === 'ELIGIBLE';
  const isNeedsInfo = verdict.status === 'NEEDS_MORE_INFO';
  const isNotEligible = verdict.status === 'NOT_ELIGIBLE';

  const localizedName = getSchemeName(scheme.id, scheme.name);
  const localizedBenefit = getSchemeBenefit(scheme.id, scheme.benefit_summary);

  return (
    <div
      className={`group relative rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col justify-between ${
        isEligible
          ? 'bg-white dark:bg-[#0D1E38] border-slate-200 dark:border-slate-800 hover:border-[#1E40AF] dark:hover:border-blue-400 hover:shadow-lg'
          : isNeedsInfo
          ? 'bg-white dark:bg-[#0D1E38] border-amber-500/30 hover:border-amber-500 hover:shadow-lg'
          : 'bg-slate-50/70 dark:bg-[#081525] border-slate-200 dark:border-slate-800/80 opacity-85 hover:opacity-100 hover:shadow-md'
      }`}
    >
      {/* Top Banner Accent */}
      <div
        className={`h-1.5 w-full ${
          isEligible
            ? 'bg-gradient-to-r from-[#1E40AF] to-blue-500'
            : isNeedsInfo
            ? 'bg-gradient-to-r from-amber-500 to-orange-400'
            : 'bg-gradient-to-r from-rose-500 to-slate-400'
        }`}
      />

      <div className="p-5 flex-1 flex flex-col">
        {/* Category, Confidence & Save Header */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-semibold tracking-wide uppercase px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              {getCategory(scheme.category)}
            </span>

            {isFuzzyMatch && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                {t('possibleMatch')}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <ConfidenceBadge score={verdict.confidence_score} status={verdict.status} size="sm" />

            <button
              onClick={handleSave}
              className={`p-1.5 rounded-lg border transition-colors ${
                saved
                  ? 'bg-blue-50 dark:bg-blue-950/40 text-[#1E40AF] border-blue-500/30'
                  : 'text-slate-400 hover:text-[#1E40AF] border-transparent hover:border-slate-200 dark:hover:border-slate-700'
              }`}
              title={saved ? t('savedScheme') : t('saveForLater')}
            >
              {saved ? <BookmarkCheck className="w-4 h-4 fill-[#1E40AF] text-[#1E40AF]" /> : <Bookmark className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Scheme Title & Ministry */}
        <Link href={`/schemes/${scheme.id}`} className="block group-hover:text-[#1E40AF] dark:group-hover:text-blue-400 transition-colors mb-2">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
            {localizedName}
          </h3>
        </Link>

        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-3 line-clamp-1">
          <Building2 className="w-3.5 h-3.5 shrink-0" />
          <span>{scheme.ministry}</span>
        </div>

        {/* Benefit Summary Box */}
        <div className="p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/40 text-xs sm:text-sm text-slate-800 dark:text-slate-200 mb-4 font-medium leading-relaxed">
          {localizedBenefit}
        </div>

        {/* Required Documents Pill Preview */}
        <div className="mt-auto space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>{t('documentsLabel')}: {scheme.required_documents.slice(0, 2).join(', ')}{scheme.required_documents.length > 2 ? ` +${scheme.required_documents.length - 2} more` : ''}</span>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <Calendar className="w-3 h-3" />
            <span>{t('verifiedDateLabel')}: {scheme.last_verified}</span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-4 bg-slate-50 dark:bg-[#071324] border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-3">
        <div className="text-xs">
          {isEligible && (
            <span className="font-semibold text-blue-700 dark:text-blue-400">
              {t('eligibleBadge')} ({verdict.matched_criteria.length} {t('criteriaMet')})
            </span>
          )}
          {isNeedsInfo && (
            <span className="font-semibold text-amber-600 dark:text-amber-400">
              {t('needsInfoBadge')}
            </span>
          )}
          {isNotEligible && (
            <span className="font-semibold text-rose-600 dark:text-rose-400">
              {t('notEligibleBadge')}
            </span>
          )}
        </div>

        <Link
          href={`/schemes/${scheme.id}`}
          className="inline-flex items-center gap-1 px-4 py-2 rounded-md bg-[#1E40AF] hover:bg-[#1D4ED8] text-white font-bold text-xs shadow-xs transition-all hover:scale-102"
        >
          <span>{t('checkEligibilityBtn')}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
