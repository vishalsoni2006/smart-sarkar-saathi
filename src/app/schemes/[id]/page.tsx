'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { VERIFIED_SCHEMES } from '@/data/schemes';
import { getActiveProfile, setActiveProfile, toggleSaveScheme, getSavedSchemeIds } from '@/lib/firebase/storage';
import { evaluateEligibility } from '@/lib/rule-engine/evaluator';
import { VerdictBanner } from '@/components/verdict-banner';
import { SchemeCompulsoryChecker } from '@/components/scheme-compulsory-checker';
import { RAGChat } from '@/components/rag-chat';
import { useLanguage } from '@/components/language-provider';
import { Scheme, UserProfile } from '@/types';
import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  Calendar,
  Building2,
  FileCheck,
  CheckCircle,
  Clock,
  PhoneCall,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

export default function SchemeDetailPage() {
  const { t, getCategory, getSchemeName, getSchemeBenefit } = useLanguage();
  const params = useParams();
  const router = useRouter();
  const schemeId = params?.id as string;

  const [scheme, setScheme] = useState<Scheme | null>(null);
  const [profile, setProfileState] = useState<UserProfile | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const found = VERIFIED_SCHEMES.find((s) => s.id === schemeId);
    if (found) {
      setScheme(found);
    }

    const currentProfile = getActiveProfile();
    setProfileState(currentProfile);

    const savedIds = getSavedSchemeIds();
    setIsSaved(savedIds.includes(schemeId));

    const handleProfileUpdate = (e: any) => {
      setProfileState(e.detail);
    };

    window.addEventListener('scheme_navigator_profile_updated', handleProfileUpdate);
    return () => window.removeEventListener('scheme_navigator_profile_updated', handleProfileUpdate);
  }, [schemeId]);

  if (!scheme) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t('schemeNotFound', 'Scheme Not Found')}</h2>
        <p className="text-slate-500">{t('schemeNotFoundDesc', 'The requested scheme was not found in the verified 15-scheme corpus.')}</p>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1E40AF] hover:bg-[#1D4ED8] text-white font-bold text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('backToDirectory', 'Back to Directory')}
        </Link>
      </div>
    );
  }

  // Calculate Deterministic Verdict
  const verdict = evaluateEligibility(scheme, profile);

  // Live callback when citizen provides missing info via chat!
  const handleProfileFieldUpdated = (field: string, value: any) => {
    if (!profile) return;

    let updated = { ...profile };

    if (field === 'land_holding_acres') {
      updated.land_holding_acres = value;
      if (!updated.special_conditions.includes('has_land')) {
        updated.special_conditions = [...updated.special_conditions, 'has_land'];
      }
    } else if (field === 'annual_income') {
      updated.annual_income = value;
    } else if (field === 'special_conditions') {
      if (!updated.special_conditions.includes(value)) {
        updated.special_conditions = [...updated.special_conditions, value];
      }
    }

    updated.updated_at = new Date().toISOString();
    setActiveProfile(updated);
    setProfileState(updated);
  };

  const handleSaveToggle = async () => {
    const newState = await toggleSaveScheme(scheme.id);
    setIsSaved(newState);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Navigation & Breadcrumbs */}
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-[#1E40AF] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('backToDashboard', 'Back to Schemes Directory')}</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSaveToggle}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border text-xs font-semibold transition-colors ${
              isSaved
                ? 'bg-blue-50 dark:bg-blue-950/40 text-[#1E40AF] dark:text-blue-400 border-blue-500/30'
                : 'bg-white dark:bg-[#0D1E38] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-blue-900/40 hover:border-[#1E40AF]/40'
            }`}
          >
            {isSaved ? <BookmarkCheck className="w-4 h-4 fill-[#1E40AF] text-[#1E40AF]" /> : <Bookmark className="w-4 h-4" />}
            <span>{isSaved ? t('savedScheme', 'Saved Scheme') : t('saveForLater', 'Save for Later')}</span>
          </button>

          <a
            href={scheme.official_apply_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-md bg-[#1E40AF] hover:bg-[#1D4ED8] text-white font-bold text-xs shadow-xs transition-colors"
          >
            <span>{t('officialPortal', 'Official Portal')}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Scheme Main Header Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#0D1E38] border border-slate-200 dark:border-blue-900/40 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-blue-500/15 text-[#1E40AF] dark:text-blue-400 border border-blue-500/30">
            {getCategory(scheme.category)}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {t('lastVerified', 'Last Verified')}: {scheme.last_verified}
          </span>
          <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            {t('gazetteGrounded', 'Official Gazette Grounded')}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          {getSchemeName(scheme.id, scheme.name)}
        </h1>

        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          <Building2 className="w-4 h-4 shrink-0 text-[#1E40AF] dark:text-blue-400" />
          <span>{scheme.ministry}</span>
        </div>
      </div>

      {/* CRITICAL PS-2 REQUIREMENT: Verdict Banner shown FIRST, above any chat */}
      <section className="space-y-2">
        <VerdictBanner
          verdict={verdict}
          schemeName={getSchemeName(scheme.id, scheme.short_name)}
          officialApplyUrl={scheme.official_apply_url}
        />
      </section>

      {/* COMPULSORY SCHEME QUESTIONS: Explicitly requested for scheme filling/eligibility */}
      <section className="space-y-2">
        <SchemeCompulsoryChecker
          scheme={scheme}
          profile={profile}
          onAllPassed={(updated) => {
            setActiveProfile(updated);
            setProfileState(updated);
          }}
        />
      </section>

      {/* Split Grid: Scheme Information (Left) + Multilingual RAG Chat (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Benefits, Documents & Steps */}
        <div className="lg:col-span-5 space-y-6">
          {/* Key Benefits */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0D1E38] border border-slate-200 dark:border-blue-900/40 space-y-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#1E40AF] dark:text-blue-400" />
              {t('keyBenefitsEntitlement', 'Key Benefits & Entitlements')}
            </h3>
            <p className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/40">
              {getSchemeBenefit(scheme.id, scheme.benefit_summary)}
            </p>
            <ul className="space-y-2 pt-2">
              {scheme.benefit_details.map((b, i) => (
                <li key={i} className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Required Documents Checklist */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0D1E38] border border-slate-200 dark:border-blue-900/40 space-y-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-[#1E40AF] dark:text-blue-400" />
              {t('requiredDocsChecklist', 'Required Documents Checklist')}
            </h3>
            <ul className="space-y-2">
              {scheme.required_documents.map((doc, i) => (
                <li
                  key={i}
                  className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-start gap-2"
                >
                  <span className="w-4 h-4 rounded-full bg-blue-500/15 text-[#1E40AF] dark:text-blue-400 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span>{doc}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Official Application Steps & Contact */}
          {scheme.application_steps && (
            <div className="p-6 rounded-3xl bg-white dark:bg-[#0D1E38] border border-slate-200 dark:border-blue-900/40 space-y-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#1E40AF] dark:text-blue-400" />
                {t('howToApply', 'How to Apply')}
              </h3>
              <ol className="space-y-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                {scheme.application_steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-md bg-blue-100 dark:bg-blue-950/60 text-[#1E40AF] dark:text-blue-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>

              {scheme.official_contact && (
                <div className="pt-3 border-t border-slate-200 dark:border-blue-900/30 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <PhoneCall className="w-3.5 h-3.5 text-[#1E40AF] dark:text-blue-400 shrink-0" />
                  <span>{scheme.official_contact}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Multilingual RAG Chat with Citation Tags & Live Re-evaluation */}
        <div className="lg:col-span-7">
          <div className="sticky top-24">
            <RAGChat
              scheme={scheme}
              profile={profile}
              targetMissingField={verdict.target_followup_field}
              targetMissingQuestion={verdict.target_followup_question}
              onProfileUpdated={handleProfileFieldUpdated}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
