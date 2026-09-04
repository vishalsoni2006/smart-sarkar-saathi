'use client';

import React, { useEffect, useState } from 'react';
import { EligibilityVerdict } from '@/types';
import { ConfidenceBadge } from '@/components/confidence-badge';
import { CheckCircle2, AlertCircle, XCircle, ChevronDown, ChevronUp, ShieldCheck, Sparkles, ExternalLink } from 'lucide-react';
import { useLanguage } from '@/components/language-provider';
import confetti from 'canvas-confetti';

interface VerdictBannerProps {
  verdict: EligibilityVerdict;
  schemeName: string;
  officialApplyUrl?: string;
}

export function VerdictBanner({ verdict, schemeName, officialApplyUrl }: VerdictBannerProps) {
  const { t } = useLanguage();
  const [showDetails, setShowDetails] = useState(false);

  // Trigger celebration confetti on 100% Eligible status!
  useEffect(() => {
    if (verdict.status === 'ELIGIBLE' && verdict.confidence_score === 100) {
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch {}
    }
  }, [verdict.status, verdict.confidence_score]);

  const isEligible = verdict.status === 'ELIGIBLE';
  const isNeedsInfo = verdict.status === 'NEEDS_MORE_INFO';
  const isNotEligible = verdict.status === 'NOT_ELIGIBLE';

  const themeStyles = isEligible
    ? {
        border: 'border-emerald-500/40',
        bg: 'bg-emerald-50/90 dark:bg-emerald-950/30',
        text: 'text-emerald-900 dark:text-emerald-200',
        badge: 'bg-emerald-600 text-white',
        badgeLabel: t('badgeEligible', 'ELIGIBLE'),
        icon: <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400 shrink-0" />,
        title: t('statusEligible', 'Eligibility Status: You Are Eligible')
      }
    : isNeedsInfo
    ? {
        border: 'border-amber-500/40',
        bg: 'bg-amber-50/90 dark:bg-amber-950/30',
        text: 'text-amber-900 dark:text-amber-200',
        badge: 'bg-amber-600 text-white',
        badgeLabel: t('badgeNeedsDetail', 'NEEDS DETAIL'),
        icon: <AlertCircle className="w-8 h-8 text-amber-600 dark:text-amber-400 shrink-0" />,
        title: t('statusNeedsInfo', 'Eligibility Status: 1 Detail Needed to Confirm')
      }
    : {
        border: 'border-rose-500/40',
        bg: 'bg-rose-50/90 dark:bg-rose-950/30',
        text: 'text-rose-900 dark:text-rose-200',
        badge: 'bg-rose-600 text-white',
        badgeLabel: t('badgeIneligible', 'INELIGIBLE'),
        icon: <XCircle className="w-8 h-8 text-rose-600 dark:text-rose-400 shrink-0" />,
        title: t('statusNotEligible', 'Eligibility Status: Likely Ineligible')
      };

  return (
    <div
      className={`rounded-2xl border ${themeStyles.border} ${themeStyles.bg} p-5 md:p-6 shadow-md transition-all duration-300 animate-verdict-flip`}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          {themeStyles.icon}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className={`text-xs uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-full ${themeStyles.badge}`}>
                {themeStyles.badgeLabel}
              </span>
              <ConfidenceBadge score={verdict.confidence_score} status={verdict.status} size="sm" />
              {verdict.is_fuzzy_occupation_match && (
                <span className="text-xs bg-purple-600 text-white font-medium px-2 py-0.5 rounded-full">
                  {t('suggestedForProfession', 'Suggested for Your Profession')}
                </span>
              )}
            </div>

            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {themeStyles.title}
            </h2>

            <p className="text-sm md:text-base mt-1 text-slate-700 dark:text-slate-300">
              {verdict.summary_explanation}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start md:self-center">
          {officialApplyUrl && isEligible && (
            <a
              href={officialApplyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1E40AF] hover:bg-[#1D4ED8] text-white font-bold text-sm shadow-md transition-all hover:scale-105"
            >
              {t('applyOfficialPortal', 'Apply on Official Portal')}
              <ExternalLink className="w-4 h-4" />
            </a>
          )}

          <button
            onClick={() => setShowDetails(!showDetails)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors"
          >
            {showDetails ? t('hideBreakdown', 'Hide Criteria Breakdown') : t('viewBreakdown', 'View Criteria Breakdown')}
            {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Target Follow-up Notice for Needs More Info */}
      {isNeedsInfo && verdict.target_followup_question && (
        <div className="mt-4 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
          <div className="text-xs md:text-sm">
            <span className="font-bold">Chatbot Action Required:</span> {verdict.target_followup_question}{' '}
            <span className="underline decoration-amber-400">Answer in the chat below to finalize your verdict live!</span>
          </div>
        </div>
      )}

      {/* Criteria Breakdown Drawer */}
      {showDetails && (
        <div className="mt-5 pt-5 border-t border-slate-200 dark:border-slate-800/80 space-y-4 text-xs sm:text-sm">
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>
              All criteria evaluated deterministically against official gazette rules. No LLM hallucination.
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Matched Criteria */}
            <div className="p-3.5 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-emerald-500/20">
              <h4 className="font-bold text-emerald-700 dark:text-emerald-400 mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Matched Criteria ({verdict.matched_criteria.length})
              </h4>
              {verdict.matched_criteria.length === 0 ? (
                <p className="text-slate-500 italic">None evaluated as matched.</p>
              ) : (
                <ul className="space-y-2">
                  {verdict.matched_criteria.map((c, i) => (
                    <li key={i} className="text-slate-700 dark:text-slate-300">
                      <span className="font-semibold">{c.label}:</span> {c.reason}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Unmatched or Missing Criteria */}
            <div className="p-3.5 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
              {verdict.unmatched_criteria.length > 0 && (
                <div className="mb-3">
                  <h4 className="font-bold text-rose-700 dark:text-rose-400 mb-2 flex items-center gap-1.5">
                    <XCircle className="w-4 h-4" />
                    Unmatched Criteria ({verdict.unmatched_criteria.length})
                  </h4>
                  <ul className="space-y-2">
                    {verdict.unmatched_criteria.map((c, i) => (
                      <li key={i} className="text-slate-700 dark:text-slate-300">
                        <span className="font-semibold">{c.label}:</span> {c.reason}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {verdict.missing_criteria.length > 0 && (
                <div>
                  <h4 className="font-bold text-amber-700 dark:text-amber-400 mb-2 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4" />
                    Missing Verification ({verdict.missing_criteria.length})
                  </h4>
                  <ul className="space-y-2">
                    {verdict.missing_criteria.map((c, i) => (
                      <li key={i} className="text-slate-700 dark:text-slate-300">
                        <span className="font-semibold">{c.label}:</span> {c.reason}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
