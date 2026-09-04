'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getActiveProfile, setActiveProfile } from '@/lib/firebase/storage';
import { getAuthenticatedUser } from '@/lib/firebase/auth';
import { OCCUPATION_QUESTION_SETS, getOccupationQuestionSet, OccupationQuestion } from '@/data/occupation-questions';
import { VERIFIED_SCHEMES } from '@/data/schemes';
import { evaluateEligibility } from '@/lib/rule-engine/evaluator';
import { SchemeCard } from '@/components/scheme-card';
import { UserProfile, OccupationType } from '@/types';
import { useLanguage } from '@/components/language-provider';
import {
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  User,
  Database,
  HelpCircle,
  Briefcase,
  AlertTriangle,
  RotateCcw,
  Bot
} from 'lucide-react';

export default function OccupationQuestionsPage() {
  const { language, t, getOccupation } = useLanguage();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [authUser, setAuthUser] = useState(getAuthenticatedUser());
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [matchingSchemes, setMatchingSchemes] = useState<Array<{ scheme: any; verdict: any }>>([]);

  useEffect(() => {
    const current = getActiveProfile();
    setProfile(current);
    setAuthUser(getAuthenticatedUser());

    // Pre-populate answers from profile or default values
    const initialAnswers: Record<string, any> = {
      ...(current.occupation_specific_data || {})
    };

    if (current.occupation === 'farmer' && current.land_holding_acres) {
      initialAnswers['land_holding_acres'] = current.land_holding_acres;
    }

    setAnswers(initialAnswers);
  }, []);

  const questionSet = getOccupationQuestionSet(profile?.occupation || 'farmer');

  // Handle Input Change
  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value
    }));
  };

  // Calculate Progress
  const totalQuestions = questionSet.questions.length;
  const answeredCount = questionSet.questions.filter(
    (q) => answers[q.id] !== undefined && answers[q.id] !== ''
  ).length;
  const progressPercent = Math.round((answeredCount / totalQuestions) * 100);

  // Submit and Save Answers to Database
  const handleSaveCriteria = async () => {
    if (!profile) return;

    let updatedConditions = [...profile.special_conditions];
    let updatedLandHolding = profile.land_holding_acres;

    // Process questions and map effects to special_conditions
    questionSet.questions.forEach((q) => {
      const ans = answers[q.id];
      if (ans === undefined) return;

      // Handle number fields like land holding
      if (q.id === 'land_holding_acres') {
        const val = Number(ans);
        updatedLandHolding = val;
        if (val > 0 && !updatedConditions.includes('has_land')) {
          updatedConditions.push('has_land');
        }
      }

      // Handle radio options with effects
      if (q.options) {
        const selectedOpt = q.options.find((o) => o.value === ans);
        if (selectedOpt) {
          if (selectedOpt.affectsSpecialConditions) {
            selectedOpt.affectsSpecialConditions.forEach((c) => {
              if (!updatedConditions.includes(c)) updatedConditions.push(c);
            });
          }
        }
      }

      if (q.specialConditionTag && ans && !updatedConditions.includes(q.specialConditionTag)) {
        updatedConditions.push(q.specialConditionTag);
      }
    });

    const updatedProfile: UserProfile = {
      ...profile,
      special_conditions: updatedConditions,
      land_holding_acres: updatedLandHolding,
      occupation_specific_data: answers,
      updated_at: new Date().toISOString()
    };

    setProfile(updatedProfile);
    await setActiveProfile(updatedProfile);

    // Calculate real-time matching schemes for this occupation
    const relevant = VERIFIED_SCHEMES.filter(
      (s) =>
        s.eligibility.occupation === 'universal' ||
        s.eligibility.occupation === profile.occupation ||
        questionSet.relevantSchemes.includes(s.id)
    );

    const matches = relevant.map((scheme) => ({
      scheme,
      verdict: evaluateEligibility(scheme, updatedProfile)
    }));

    // Sort so ELIGIBLE comes first
    matches.sort((a, b) => {
      if (a.verdict.status === 'ELIGIBLE' && b.verdict.status !== 'ELIGIBLE') return -1;
      if (b.verdict.status === 'ELIGIBLE' && a.verdict.status !== 'ELIGIBLE') return 1;
      return b.verdict.confidence_score - a.verdict.confidence_score;
    });

    setMatchingSchemes(matches);
    setSavedSuccess(true);

    // Auto scroll down to matches
    setTimeout(() => {
      const el = document.getElementById('matching-schemes-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Breadcrumb & User Context Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-blue-50/70 dark:bg-[#0D1E38] border border-blue-200 dark:border-blue-900/40">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#1E40AF] text-white flex items-center justify-center font-black text-lg shadow-xs shrink-0">
            {profile?.name?.charAt(0) || 'C'}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-black text-slate-900 dark:text-white">
                {profile?.name || 'Citizen User'}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#1E40AF] text-white">
                {getOccupation(profile?.occupation || 'farmer')}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                • {profile?.state} • {t('ageLabel', 'Age')} {profile?.age}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              {language === 'hi' ? questionSet.titleHindi : questionSet.title}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <Link
            href="/onboarding"
            className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:border-[#1E40AF] text-xs font-semibold transition-colors"
          >
            {t('editProfile', 'Edit Profile')}
          </Link>
          <Link
            href="/dashboard"
            className="px-3.5 py-1.5 rounded-xl bg-[#1E40AF] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-xs transition-colors"
          >
            {t('all15Schemes', 'All 15 Schemes')}
          </Link>
        </div>
      </div>

      {/* Hero Explainer & Progress Bar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-[#1E40AF] dark:text-blue-400 text-xs font-bold border border-blue-500/20 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{questionSet.badge}</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              {`${t('tailoredQuestionsFor', 'Tailored Criteria Questions for')} ${getOccupation(profile?.occupation || 'farmer')}`}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
              {questionSet.description}
            </p>
          </div>

          <div className="text-right shrink-0">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              {`${t('completedCount', 'Completed')}: ${answeredCount} ${t('of', 'of')} ${totalQuestions}`}
            </span>
            <div className="w-36 h-2.5 rounded-full bg-slate-200 dark:bg-slate-800 mt-1 overflow-hidden">
              <div
                className="h-full bg-[#1E40AF] transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* QUESTIONS CARDS LIST */}
      <div className="space-y-6">
        {questionSet.questions.map((q, idx) => {
          const currentAnswer = answers[q.id];

          return (
            <div
              key={q.id}
              className="p-6 rounded-3xl bg-white dark:bg-[#0D1E38] border border-slate-200 dark:border-blue-900/40 shadow-xs hover:border-[#1E40AF] transition-all space-y-4"
            >
              {/* Question Header */}
              <div className="space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {q.title}
                  </h3>
                  {currentAnswer !== undefined && currentAnswer !== '' && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3" />
                      {t('answered', 'Answered')}
                    </span>
                  )}
                </div>
                <p className="text-xs font-semibold text-[#1E40AF] dark:text-blue-400">
                  {q.titleHindi}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {q.description}
                </p>
              </div>

              {/* Question Input Controls */}
              {/* 1. Number Input */}
              {q.type === 'number' && (
                <div className="flex items-center gap-3 pt-1">
                  <div className="relative w-48">
                    <input
                      type="number"
                      min={q.min ?? 0}
                      max={q.max ?? 100}
                      step={q.step ?? 1}
                      value={currentAnswer ?? ''}
                      onChange={(e) =>
                        handleAnswerChange(
                          q.id,
                          e.target.value === '' ? '' : Number(e.target.value)
                        )
                      }
                      placeholder={q.placeholder || '0'}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1E40AF] text-sm font-bold text-slate-900 dark:text-white"
                    />
                  </div>
                  {q.unit && (
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                      {q.unit}
                    </span>
                  )}
                </div>
              )}

              {/* 2. Radio Options */}
              {q.type === 'radio' && q.options && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {q.options.map((opt) => {
                    const isSelected = currentAnswer === opt.value;
                    return (
                      <label
                        key={opt.value}
                        onClick={() => handleAnswerChange(q.id, opt.value)}
                        className={`p-4 rounded-2xl border text-xs cursor-pointer transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'bg-blue-500/10 border-[#1E40AF] text-slate-900 dark:text-white shadow-xs'
                            : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <input
                            type="radio"
                            name={q.id}
                            value={opt.value}
                            checked={isSelected}
                            onChange={() => handleAnswerChange(q.id, opt.value)}
                            className="mt-0.5 text-[#1E40AF] focus:ring-[#1E40AF]"
                          />
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white block">
                              {opt.label}
                            </span>
                            {opt.description && (
                              <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
                                {opt.description}
                              </span>
                            )}
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Save Button Bar */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#0D1E38] border border-slate-200 dark:border-blue-900/40 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-[#1E40AF] dark:text-blue-400 flex items-center justify-center">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              {t('readyToVerify', 'Ready to verify deterministic eligibility?')}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t('responsesSavedFirebase', 'Responses will be safely saved in Firebase and matched against verified government scheme rules.')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleSaveCriteria}
            className="w-full sm:w-auto px-7 py-3 rounded-xl bg-[#1E40AF] hover:bg-[#1D4ED8] text-white font-bold text-sm shadow-md transition-all hover:scale-102 flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{t('saveAnswersUnlock', 'Save Answers & Unlock Schemes')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* MATCHING SCHEMES SECTION (Rendered immediately after saving) */}
      {savedSuccess && (
        <section id="matching-schemes-section" className="space-y-6 pt-4 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{t('eligibilityEngineResults', 'Eligibility Engine Results')}</span>
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                {`${t('verifiedSchemesCount', 'Verified Schemes for Your Profile')} (${matchingSchemes.length})`}
              </h3>
            </div>

            <Link
              href="/dashboard"
              className="text-xs font-bold text-[#1E40AF] dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <span>{t('viewAll15Schemes', 'View All 15 Schemes')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matchingSchemes.map(({ scheme, verdict }) => (
              <SchemeCard
                key={scheme.id}
                scheme={scheme}
                verdict={verdict}
              />
            ))}
          </div>

          {/* RAG Bot Assistant prompt */}
          <div className="p-6 rounded-3xl bg-blue-50/80 dark:bg-[#071324] border border-blue-200 dark:border-blue-900/50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#1E40AF] text-white flex items-center justify-center shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {t('haveQuestionsDocs', 'Have questions about your documents or application steps?')}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {t('ragBotAssistance', 'Our Multilingual RAG Chatbot is grounded in official government gazettes and ready to assist you in English, Hindi, and regional languages.')}
                </p>
              </div>
            </div>

            <Link
              href={`/schemes/${matchingSchemes[0]?.scheme.id || 'pm-kisan'}`}
              className="px-5 py-2.5 rounded-xl bg-[#1E40AF] hover:bg-[#1D4ED8] text-white font-bold text-xs shadow-xs transition-colors shrink-0 flex items-center gap-1.5"
            >
              <span>{t('chatWithAssistant', 'Chat with Scheme Assistant')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
