'use client';

import React, { useState, useEffect } from 'react';
import { Scheme, UserProfile } from '@/types';
import { getSchemeCompulsoryQuestions, getLocalizedQuestion, CompulsoryQuestion } from '@/data/compulsory-questions';
import { useLanguage } from '@/components/language-provider';
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  ExternalLink,
  HelpCircle,
  FileCheck2,
  Sparkles,
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface SchemeCompulsoryCheckerProps {
  scheme: Scheme;
  profile: UserProfile | null;
  onAllPassed?: (updatedProfile: UserProfile) => void;
}

export function SchemeCompulsoryChecker({ scheme, profile, onAllPassed }: SchemeCompulsoryCheckerProps) {
  const { language, t, getSchemeName } = useLanguage();
  const questions = getSchemeCompulsoryQuestions(scheme.id);

  // Map of questionId -> user's answer (boolean)
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [completed, setCompleted] = useState(false);

  // Pre-fill answers if already known from profile
  useEffect(() => {
    if (!profile) return;
    const initial: Record<string, boolean> = {};

    questions.forEach((q) => {
      if (q.fieldMapped === 'has_land') {
        if (profile.special_conditions.includes('has_land') || (profile.land_holding_acres ?? 0) > 0) {
          initial[q.id] = true;
        }
      } else if (q.fieldMapped === 'land_holding_acres') {
        if (profile.land_holding_acres != null) {
          initial[q.id] = profile.land_holding_acres <= 5;
        }
      } else if (q.fieldMapped === 'savings_bank_account') {
        if (profile.special_conditions.includes('savings_bank_account')) {
          initial[q.id] = true;
        }
      } else if (q.fieldMapped === 'annual_income') {
        if (profile.annual_income != null) {
          initial[q.id] = profile.annual_income <= (scheme.eligibility.income_max || 250000);
        }
      } else if (q.fieldMapped === 'student_enrolled') {
        if (profile.occupation === 'student' || profile.special_conditions.includes('student_enrolled')) {
          initial[q.id] = true;
        }
      } else if (q.fieldMapped === 'bpl_card') {
        if (profile.special_conditions.includes('bpl_card')) {
          initial[q.id] = true;
        }
      } else if (q.fieldMapped === 'street_vendor') {
        if (profile.occupation === 'street_vendor') {
          initial[q.id] = true;
        }
      } else if (q.fieldMapped === 'unorganized_worker') {
        if (profile.occupation === 'unorganized_worker') {
          initial[q.id] = true;
        }
      }
    });

    setAnswers(initial);
  }, [scheme.id, profile]);

  const handleAnswer = (questionId: string, answer: boolean) => {
    const updated = { ...answers, [questionId]: answer };
    setAnswers(updated);

    // Check if all questions are answered
    const allAnswered = questions.every((q) => updated[q.id] !== undefined);
    if (allAnswered) {
      const allPassed = questions.every((q) => updated[q.id] === q.expectedAnswer);
      setCompleted(true);

      if (allPassed) {
        try {
          confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
        } catch {}

        if (profile && onAllPassed) {
          const updatedProfile = { ...profile };
          // Ensure mandatory fields are recorded
          if (scheme.id === 'pm-kisan') {
            if (!updatedProfile.special_conditions.includes('has_land')) {
              updatedProfile.special_conditions.push('has_land');
            }
            if (!updatedProfile.land_holding_acres) {
              updatedProfile.land_holding_acres = 2.5;
            }
          }
          onAllPassed(updatedProfile);
        }
      }
    }
  };

  const resetChecker = () => {
    setAnswers({});
    setCompleted(false);
  };

  // Evaluation stats
  const answeredCount = Object.keys(answers).length;
  const passedCount = questions.filter((q) => answers[q.id] === q.expectedAnswer).length;
  const failedQuestions = questions.filter((q) => answers[q.id] !== undefined && answers[q.id] !== q.expectedAnswer);
  const isFullyEligible = completed && failedQuestions.length === 0;

  return (
    <div className="rounded-3xl border-2 border-blue-600/30 bg-white dark:bg-[#0D1E38] shadow-xl p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/15 text-[#1E40AF] dark:text-blue-400 text-xs font-black tracking-wide uppercase mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('compulsoryEligibilityCheck')}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {`${getSchemeName(scheme.id, scheme.short_name)} ${t('compulsoryQuestionsFor')}`}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
            {t('compulsoryQuestionsDesc')}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <div className="text-right">
            <div className="text-xs font-bold text-slate-900 dark:text-white">
              {answeredCount} / {questions.length} {t('answeredCountOf')}
            </div>
            <div className="w-32 h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mt-1">
              <div
                className="h-full bg-[#1E40AF] transition-all duration-300"
                style={{ width: `${(answeredCount / questions.length) * 100}%` }}
              />
            </div>
          </div>

          {answeredCount > 0 && (
            <button
              onClick={resetChecker}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-800 cursor-pointer"
              title={t('resetQuestions')}
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {questions.map((q, idx) => {
          const userAnswer = answers[q.id];
          const hasAnswered = userAnswer !== undefined;
          const isPassed = hasAnswered && userAnswer === q.expectedAnswer;
          const isFailed = hasAnswered && userAnswer !== q.expectedAnswer;

          const localized = getLocalizedQuestion(q, language);
          const questionText = localized.question;
          const explanationText = localized.explanation;

          return (
            <div
              key={q.id}
              className={`p-4 sm:p-5 rounded-2xl border-2 transition-all duration-200 ${
                isPassed
                  ? 'bg-emerald-500/10 border-emerald-500/50'
                  : isFailed
                  ? 'bg-rose-500/10 border-rose-500/50'
                  : 'bg-slate-50 dark:bg-slate-900/70 border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-black flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
                      {questionText}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 pl-8">
                    {explanationText}
                  </p>
                </div>

                {/* Big Visual YES / NO Choice Buttons */}
                <div className="flex items-center gap-2.5 shrink-0 pl-8 sm:pl-0">
                  <button
                    type="button"
                    onClick={() => handleAnswer(q.id, true)}
                    className={`px-5 py-2.5 rounded-xl font-black text-sm flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                      userAnswer === true
                        ? 'bg-emerald-600 text-white scale-105 ring-2 ring-emerald-400'
                        : 'bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{t('yesOption')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAnswer(q.id, false)}
                    className={`px-5 py-2.5 rounded-xl font-black text-sm flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                      userAnswer === false
                        ? 'bg-rose-600 text-white scale-105 ring-2 ring-rose-400'
                        : 'bg-white dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700'
                    }`}
                  >
                    <XCircle className="w-4 h-4" />
                    <span>{t('noOption')}</span>
                  </button>
                </div>
              </div>

              {/* Status Message per question */}
              {isPassed && (
                <div className="mt-3 pl-8 text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{t('requirementVerified')}</span>
                </div>
              )}

              {isFailed && (
                <div className="mt-3 pl-8 text-xs font-bold text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
                  <XCircle className="w-4 h-4 text-rose-600" />
                  <span>{t('criterionUnmet')}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Final Outcome Banner */}
      {completed && (
        <div className="pt-4 animate-verdict-flip">
          {isFullyEligible ? (
            <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border-2 border-emerald-500 text-emerald-950 dark:text-emerald-100 space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-emerald-900 dark:text-white">
                    {t('congratsAllCriteriaMet')}
                  </h3>
                  <p className="text-xs sm:text-sm text-emerald-800 dark:text-emerald-200 mt-1">
                    {t('congratsAllCriteriaDesc')}
                  </p>
                </div>
              </div>

              {/* Direct Apply Button */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href={scheme.official_apply_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-sm sm:text-base shadow-lg transition-transform hover:scale-105 flex items-center gap-2"
                >
                  <span>{t('proceedToOfficialPortal')}</span>
                  <ExternalLink className="w-4 h-4" />
                </a>

                <div className="text-xs text-emerald-800 dark:text-emerald-300 font-semibold flex items-center gap-1.5">
                  <FileCheck2 className="w-4 h-4" />
                  <span>
                    {`${t('keepDocsReady')} ${scheme.required_documents.slice(0, 2).join(', ')}`}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-rose-500/15 border-2 border-rose-500/40 text-rose-950 dark:text-rose-100 space-y-3">
              <div className="flex items-start gap-3">
                <XCircle className="w-8 h-8 text-rose-600 dark:text-rose-400 shrink-0" />
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-rose-900 dark:text-white">
                    {t('mandatoryReqsNotMet')}
                  </h3>
                  <p className="text-xs sm:text-sm text-rose-800 dark:text-rose-200 mt-1">
                    {`${failedQuestions.length} ${t('mandatoryReqsNotMetDesc')}`}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
