'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/components/language-provider';
import { VERIFIED_SCHEMES } from '@/data/schemes';
import { DEMO_PERSONAS } from '@/data/taxonomy';
import { getActiveProfile, switchDemoPersona } from '@/lib/firebase/storage';
import { rankSchemesForUser } from '@/lib/rule-engine/ranking';
import { SchemeCard } from '@/components/scheme-card';
import {
  Search,
  ClipboardCheck,
  CheckCircle2,
  ArrowRight,
  Sprout,
  Users,
  Store,
  GraduationCap,
  Briefcase,
  Fish,
  HeartPulse,
  Accessibility,
  Shield,
  Landmark,
  Sparkles,
  Banknote,
  Languages,
  CheckCheck,
  QrCode
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { language, t, getCategory, getOccupation } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [activeProfile, setActiveProfile] = useState(DEMO_PERSONAS[0].profile);
  const [searchKeyword, setSearchKeyword] = useState('');

  useEffect(() => {
    setMounted(true);
    setActiveProfile(getActiveProfile());

    const handleProfileUpdate = () => {
      setActiveProfile(getActiveProfile());
    };
    window.addEventListener('scheme_navigator_profile_updated', handleProfileUpdate);
    window.addEventListener('scheme_navigator_auth_change', handleProfileUpdate);
    return () => {
      window.removeEventListener('scheme_navigator_profile_updated', handleProfileUpdate);
      window.removeEventListener('scheme_navigator_auth_change', handleProfileUpdate);
    };
  }, []);

  const rankings = rankSchemesForUser(activeProfile, VERIFIED_SCHEMES);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      router.push(`/dashboard?q=${encodeURIComponent(searchKeyword.trim())}`);
    } else {
      router.push('/dashboard');
    }
  };

  const handlePersonaSelect = (personaId: string) => {
    const updated = switchDemoPersona(personaId);
    setActiveProfile(updated);
    router.push('/dashboard');
  };

  return (
    <div className="w-full bg-white dark:bg-[#071324] transition-colors duration-200">
      {/* 1. myScheme Signature Hero Banner (Blended Seamlessly with Full Web Area) */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#E6F3FB] via-[#F2F8FD] to-white dark:from-[#061426] dark:via-[#091D38] dark:to-[#071324] border-b border-slate-200/80 dark:border-slate-800 py-8 lg:py-14">
        {/* Soft Ambient Background Glows matching Banner Artwork */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-200/20 dark:bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-10 w-96 h-96 bg-emerald-200/20 dark:bg-emerald-900/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left Column: Hero Content & Direct Action */}
            <div className="lg:col-span-6 xl:col-span-6 space-y-5">
              {/* Official Portal Ribbon */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1.5 font-mono text-xs font-black tracking-wider text-slate-600 dark:text-slate-300">
                  <span>{t('govSchemesTag')}</span>
                  <span>/</span>
                  <span className="text-[#1E40AF] dark:text-[#60A5FA]">{t('schemesForYouTag')}</span>
                </div>
                <span className="text-slate-300 dark:text-slate-700">|</span>
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/70 border border-blue-300 dark:border-blue-800 text-[#1E40AF] dark:text-blue-300 text-[11px] font-bold shadow-2xs">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{t('officialPortalBadge')}</span>
                </div>
              </div>

              {/* Headline */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-2xl font-black text-[#1E40AF] dark:text-[#60A5FA]">myScheme</span>
                  <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                    {t('portalMotto')}
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight text-slate-900 dark:text-white">
                  <span className="text-[#1E40AF] dark:text-[#60A5FA]">{t('heroHeadline1')} </span>
                  <br className="hidden sm:inline" />
                  <span className="text-[#EA580C]">{t('heroHeadline2')}</span>
                </h1>
              </div>

              {/* Citizen-Friendly Minimal Subtitle */}
              <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                {t('heroSubtitle')}
              </p>

              {/* Primary Call to Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link
                  href="/check-eligibility"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1E40AF] hover:bg-[#1D4ED8] text-white font-black text-xs sm:text-sm shadow-lg shadow-blue-700/25 transition-all hover:scale-102"
                >
                  <ClipboardCheck className="w-4 h-4" />
                  <span>{t('findSchemesBtn')}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white dark:bg-[#0D1E38] text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:border-[#1E40AF] font-bold text-xs sm:text-sm transition-colors shadow-2xs"
                >
                  <span>{t('browseAllBtn')}</span>
                </Link>

                <Link
                  href="/occupation-questions"
                  className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#1E40AF] dark:text-blue-300 border border-blue-200 dark:border-blue-900 font-bold text-xs hover:bg-blue-100 transition-colors"
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>{t('occupationQuestionsBtn')}</span>
                </Link>
              </div>

              {/* Clean Quick Search Container */}
              <form
                onSubmit={handleSearchSubmit}
                className="p-1.5 rounded-2xl bg-white dark:bg-[#0D1E38] border-2 border-slate-200 dark:border-slate-700 focus-within:border-[#1E40AF] dark:focus-within:border-blue-500 shadow-md flex items-center gap-2 transition-all max-w-xl"
              >
                <div className="pl-3 text-slate-400">
                  <Search className="w-4 h-4 text-[#1E40AF]" />
                </div>
                <input
                  type="text"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  placeholder={t('searchHeroPlaceholder')}
                  className="flex-1 px-2 py-1.5 text-xs sm:text-sm bg-transparent border-none focus:outline-none text-slate-900 dark:text-white font-medium placeholder:text-slate-400"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#1E40AF] hover:bg-[#1D4ED8] text-white font-bold text-xs transition-transform hover:scale-102 flex items-center gap-1 shrink-0 cursor-pointer"
                >
                  <span>{t('searchBtn')}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </form>

              {/* Quick Citizen Filter Pills */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs pt-0.5">
                <span className="text-slate-400 font-bold">{t('popularTag')}</span>
                {[
                  { label: t('farmerTag'), q: 'farmer' },
                  { label: t('studentTag'), q: 'student' },
                  { label: t('vendorTag'), q: 'vendor' },
                  { label: t('pensionTag'), q: 'pension' },
                  { label: t('healthTag'), q: 'health' }
                ].map((pill) => (
                  <button
                    key={pill.q}
                    type="button"
                    onClick={() => router.push(`/dashboard?q=${encodeURIComponent(pill.q)}`)}
                    className="px-2.5 py-0.5 rounded-full bg-white dark:bg-[#0D1E38] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-[#1E40AF] hover:text-[#1E40AF] font-medium text-[11px] transition-colors shadow-2xs cursor-pointer"
                  >
                    {pill.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column: Visual Hero Graphic (Seamlessly Blended with Web Area) */}
            <div className="lg:col-span-6 xl:col-span-6 relative flex justify-center items-center">
              {/* Outer Blended Card with subtle border and atmospheric depth */}
              <div className="relative w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl bg-white/60 dark:bg-[#0D1E38]/80 backdrop-blur-xs border border-blue-200/70 dark:border-blue-900/50 p-2 sm:p-3 transition-all duration-300 hover:shadow-blue-500/15">
                <div className="relative rounded-2xl overflow-hidden group">
                  <Image
                    src="/images/myscheme_hero_banner.png"
                    alt="myScheme Portal - Scheme.gov.in Aapke Liye. Hamesha. Farming, Education, Health, Housing"
                    width={972}
                    height={806}
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                    className="w-full h-auto object-contain rounded-2xl transition-transform duration-500 group-hover:scale-[1.015]"
                  />

                  {/* Interactive Hotspot for Direct "Check Now" Link */}
                  <Link
                    href="/check-eligibility"
                    className="absolute bottom-2.5 right-2.5 sm:bottom-4 sm:right-4 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-[#1E40AF] hover:bg-[#1D4ED8] text-white font-black text-xs sm:text-sm shadow-lg shadow-blue-900/40 transition-all hover:scale-105 flex items-center gap-1.5 z-20 cursor-pointer"
                  >
                    <span>{t('checkNowBtn')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Four Citizen Benefit Tiles (White & Blue High Contrast) */}
      <section className="border-b border-slate-200 dark:border-slate-800 bg-blue-50/40 dark:bg-[#071324] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Benefit 1 */}
            <div className="p-4 rounded-2xl bg-white dark:bg-[#0D1E38] border border-slate-200 dark:border-slate-800 shadow-xs flex items-start gap-3.5 hover:border-[#1E40AF] transition-colors">
              <div className="w-11 h-11 rounded-xl bg-blue-100 dark:bg-blue-950 text-[#1E40AF] dark:text-blue-400 flex items-center justify-center shrink-0">
                <Banknote className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{t('benefitDbtTitle')}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {t('benefitDbtDesc')}
                </p>
              </div>
            </div>

            {/* Benefit 2 */}
            <div className="p-4 rounded-2xl bg-white dark:bg-[#0D1E38] border border-slate-200 dark:border-slate-800 shadow-xs flex items-start gap-3.5 hover:border-[#1E40AF] transition-colors">
              <div className="w-11 h-11 rounded-xl bg-blue-100 dark:bg-blue-950 text-[#1E40AF] dark:text-blue-400 flex items-center justify-center shrink-0">
                <CheckCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{t('benefitFreeTitle')}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {t('benefitFreeDesc')}
                </p>
              </div>
            </div>

            {/* Benefit 3 */}
            <div className="p-4 rounded-2xl bg-white dark:bg-[#0D1E38] border border-slate-200 dark:border-slate-800 shadow-xs flex items-start gap-3.5 hover:border-[#1E40AF] transition-colors">
              <div className="w-11 h-11 rounded-xl bg-blue-100 dark:bg-blue-950 text-[#1E40AF] dark:text-blue-400 flex items-center justify-center shrink-0">
                <Languages className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{t('benefitLangTitle')}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {t('benefitLangDesc')}
                </p>
              </div>
            </div>

            {/* Benefit 4 */}
            <div className="p-4 rounded-2xl bg-white dark:bg-[#0D1E38] border border-slate-200 dark:border-slate-800 shadow-xs flex items-start gap-3.5 hover:border-[#1E40AF] transition-colors">
              <div className="w-11 h-11 rounded-xl bg-blue-100 dark:bg-blue-950 text-[#1E40AF] dark:text-blue-400 flex items-center justify-center shrink-0">
                <ClipboardCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{t('benefitRulesTitle')}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {t('benefitRulesDesc')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. "How It Works" (3 Simple Citizen Steps) */}
      <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-1.5">
          <span className="text-xs font-black uppercase tracking-wider text-[#1E40AF] dark:text-blue-400">
            {t('processBadge')}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {t('processTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {t('processDesc')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#0D1E38] border-2 border-slate-200 dark:border-slate-800 shadow-sm space-y-3 hover:border-[#1E40AF] transition-all">
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950 text-[#1E40AF] dark:text-blue-400 font-black text-xl flex items-center justify-center">
              1
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              {t('step1Title')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {t('step1Desc')}
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#0D1E38] border-2 border-slate-200 dark:border-slate-800 shadow-sm space-y-3 hover:border-[#1E40AF] transition-all">
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950 text-[#1E40AF] dark:text-blue-400 font-black text-xl flex items-center justify-center">
              2
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              {t('step2Title')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {t('step2Desc')}
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#0D1E38] border-2 border-slate-200 dark:border-slate-800 shadow-sm space-y-3 hover:border-[#1E40AF] transition-all">
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950 text-[#1E40AF] dark:text-blue-400 font-black text-xl flex items-center justify-center">
              3
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              {t('step3Title')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {t('step3Desc')}
            </p>
          </div>
        </div>
      </section>

      {/* 4. Schemes by Category Grid */}
      <section className="py-12 bg-slate-50 dark:bg-[#071324] border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-block bg-blue-100 dark:bg-blue-950 text-[#1E40AF] dark:text-blue-300 text-xs font-bold px-3 py-1 rounded-sm mb-2 uppercase tracking-wider">
                {t('categoriesBadge')}
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                {t('categoriesTitle')}
              </h2>
            </div>

            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#1E40AF] dark:text-blue-400 hover:underline"
            >
              <span>{t('viewAllSchemes')}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {[
              { id: 'Agriculture', icon: Sprout, count: 1 },
              { id: 'Fisheries & Marine', icon: Fish, count: 1 },
              { id: 'Education', icon: GraduationCap, count: 2 },
              { id: 'Business & MSME', icon: Briefcase, count: 2 },
              { id: 'Livelihood & Self-Employment', icon: Store, count: 1 },
              { id: 'Social Welfare & Pension', icon: Users, count: 2 },
              { id: 'Healthcare & Public Service', icon: HeartPulse, count: 2 },
              { id: 'Disability Welfare', icon: Accessibility, count: 1 },
              { id: 'Defence & Veterans', icon: Shield, count: 1 },
              { id: 'Universal Healthcare', icon: Landmark, count: 1 }
            ].map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => router.push(`/dashboard?category=${encodeURIComponent(cat.id)}`)}
                  className="p-4 rounded-2xl bg-white dark:bg-[#0D1E38] border border-slate-200 dark:border-slate-800 hover:border-[#1E40AF] dark:hover:border-blue-500 shadow-xs text-center flex flex-col items-center justify-center transition-all hover:scale-103 group cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#1E40AF] dark:text-blue-400 flex items-center justify-center mb-2 group-hover:bg-[#1E40AF] group-hover:text-white transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white line-clamp-1">
                    {getCategory(cat.id)}
                  </h4>
                  <span className="text-[11px] text-slate-400 mt-0.5">{cat.count} {t('schemesCount')}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Demo Personas Ribbon */}
      <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-5 rounded-2xl bg-blue-500/10 border border-blue-500/20">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
            <div>
              <div className="text-xs font-black uppercase text-[#1E40AF] dark:text-blue-400">
                {t('demoPersonasBadge')}
              </div>
              <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                {t('demoPersonasTitle')}
              </h3>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {t('demoPersonasDesc')}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {DEMO_PERSONAS.slice(0, 4).map((p) => {
              const isCurrent = mounted && activeProfile?.id === p.profile.id;
              return (
                <button
                  key={p.id}
                  onClick={() => handlePersonaSelect(p.id)}
                  className={`p-3 rounded-xl text-left border transition-all text-xs cursor-pointer ${
                    isCurrent
                      ? 'bg-[#1E40AF] text-white border-blue-800 shadow-sm font-bold'
                      : 'bg-white dark:bg-[#0D1E38] border-slate-200 dark:border-slate-700 hover:border-[#1E40AF] text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <div className="font-bold">{p.name}</div>
                  <div className={`mt-0.5 ${isCurrent ? 'text-white/90' : 'text-slate-500 dark:text-slate-400'}`}>
                    {p.subtitle}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. Recommended Sovereign Schemes */}
      <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-[#1E40AF] dark:text-blue-400">
              {t('recommendedBadge')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {t('recommendedTitle')}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {t('activeProfileLabel')} {mounted ? activeProfile.name : DEMO_PERSONAS[0].profile.name} ({getOccupation(mounted ? activeProfile.occupation : DEMO_PERSONAS[0].profile.occupation)})
            </p>
          </div>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#1E40AF] dark:text-blue-400 hover:underline"
          >
            <span>{t('viewAllSchemes')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rankings.topRecommendations.slice(0, 6).map((item) => (
            <SchemeCard
              key={item.scheme.id}
              scheme={item.scheme}
              verdict={item.verdict}
              isFuzzyMatch={item.isFuzzyMatch}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
