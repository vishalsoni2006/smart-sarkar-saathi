'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from '@/components/theme-provider';
import { useLanguage } from '@/components/language-provider';
import { SUPPORTED_LANGUAGES } from '@/lib/i18n/translations';
import { DemoPersonaSwitcher } from '@/components/demo-persona-switcher';
import { getSavedSchemeIds } from '@/lib/firebase/storage';
import { getAuthenticatedUser, logoutCitizen, UserAccount } from '@/lib/firebase/auth';
import {
  Landmark,
  Sun,
  Moon,
  Bookmark,
  Layers,
  Menu,
  X,
  ClipboardCheck,
  Search,
  CheckCircle2,
  Globe2,
  ArrowRight,
  User,
  LogIn,
  LogOut,
  HelpCircle
} from 'lucide-react';

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [savedCount, setSavedCount] = useState(2);
  const [authUser, setAuthUser] = useState<UserAccount | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setSavedCount(getSavedSchemeIds().length);
    setAuthUser(getAuthenticatedUser());

    const handleSavedUpdate = (e: any) => {
      setSavedCount(e.detail.length);
    };

    const handleAuthUpdate = (e: any) => {
      setAuthUser(e.detail);
    };

    window.addEventListener('scheme_navigator_saved_updated', handleSavedUpdate);
    window.addEventListener('scheme_navigator_auth_change', handleAuthUpdate);
    return () => {
      window.removeEventListener('scheme_navigator_saved_updated', handleSavedUpdate);
      window.removeEventListener('scheme_navigator_auth_change', handleAuthUpdate);
    };
  }, []);

  return (
    <>
      {/* Official Government of India Top Banner (Standard myScheme.gov.in header) */}
      <div className="w-full bg-[#0B1E36] text-[#E2E8F0] text-[11px] font-medium border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs">🇮🇳</span>
            <span className="tracking-wide">{t('goiTitle')}</span>
            <span className="hidden md:inline text-slate-400">| {t('nationalPortal')}</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Accessibility Quick Controls (A- / A / A+) */}
            <div className="hidden sm:flex items-center gap-1 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
              <button
                type="button"
                onClick={() => {
                  document.documentElement.classList.remove('font-size-large', 'font-size-larger');
                }}
                className="px-1.5 py-0.5 text-[10px] font-bold hover:text-green-400"
                title="Normal text size"
              >
                A-
              </button>
              <span className="text-slate-500">|</span>
              <button
                type="button"
                onClick={() => {
                  document.documentElement.classList.remove('font-size-large', 'font-size-larger');
                  document.documentElement.classList.add('font-size-large');
                }}
                className="px-1.5 py-0.5 text-[10px] font-bold hover:text-green-400"
                title="Medium text size"
              >
                A
              </button>
              <span className="text-slate-500">|</span>
              <button
                type="button"
                onClick={() => {
                  document.documentElement.classList.remove('font-size-large');
                  document.documentElement.classList.add('font-size-larger');
                }}
                className="px-1.5 py-0.5 text-[10px] font-bold hover:text-green-400"
                title="Large text size"
              >
                A+
              </button>
            </div>

            {/* Language Selector in GOI Bar */}
            <div className="flex items-center gap-1.5 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
              <span className="text-green-400 font-bold text-[10px]">अ/A</span>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="bg-transparent text-[#E2E8F0] text-[11px] font-bold border-none focus:outline-none cursor-pointer"
                title="Select Language"
              >
                {SUPPORTED_LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code} className="bg-[#0B1E36] text-white">
                    {l.nativeLabel} ({l.label})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main myScheme Navigation Header */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#071324] shadow-xs transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-3">
          {/* myScheme.gov.in Official Logo: Lion Capital + myScheme + Digital India */}
          <div className="flex items-center gap-3 shrink-0">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-[#1E40AF] dark:text-blue-300 shadow-xs transition-transform group-hover:scale-105">
                <Landmark className="w-5 h-5" />
              </div>
              <div className="hidden sm:block text-slate-300 dark:text-slate-600 font-light text-xl">|</div>
              <div>
                <div className="flex items-baseline leading-none">
                  <span className="text-xl sm:text-2xl font-black tracking-tight text-[#1E40AF] dark:text-[#60A5FA]">
                    Smart Sarkar
                  </span>
                  <span className="ml-1.5 text-xl sm:text-2xl font-black tracking-tight text-[#EA580C] dark:text-[#F97316]">
                    Saathi
                  </span>
                  <span className="ml-1.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 hidden sm:inline">
                    .gov.in
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wide mt-0.5 hidden sm:block">
                  {t('portalMotto')}
                </p>
              </div>
            </Link>

            <div className="hidden md:block text-slate-300 dark:text-slate-600 font-light text-xl">|</div>
            <div className="hidden md:flex flex-col text-[10px] font-black text-slate-600 dark:text-slate-300 leading-tight">
              <span className="text-[#EA580C] font-black">Digital India</span>
              <span className="text-[9px] text-slate-400 font-normal">Power to Empower</span>
            </div>
          </div>

          {/* Center Search Input */}
          <div className="hidden md:flex flex-1 max-w-md mx-2">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const q = (form.elements.namedItem('navSearch') as HTMLInputElement)?.value;
                if (q?.trim()) {
                  window.location.href = `/dashboard?q=${encodeURIComponent(q.trim())}`;
                } else {
                  window.location.href = '/dashboard';
                }
              }}
              className="w-full relative"
            >
              <input
                type="text"
                name="navSearch"
                placeholder={t('searchPlaceholderNav')}
                className="w-full pl-4 pr-10 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/70 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1E40AF] placeholder:text-slate-400"
              />
              <button
                type="submit"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#1E40AF]"
                title="Search"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Direct Link: Occupation Questions */}
            <Link
              href="/occupation-questions"
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-blue-500/30 bg-blue-50/80 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-[#1E40AF] dark:text-blue-300 font-bold text-xs transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5 text-[#1E40AF] dark:text-blue-400" />
              <span>{t('occupationQuestions')}</span>
            </Link>

            {/* Primary Action Button: "Find Schemes ->" (Royal Blue) */}
            <Link
              href="/check-eligibility"
              className="px-4 py-2 rounded-lg bg-[#1E40AF] hover:bg-[#1D4ED8] text-white font-bold text-xs sm:text-sm shadow-xs transition-all hover:scale-102 flex items-center gap-1.5"
            >
              <span>{t('findSchemesNav')}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            {/* Saved Schemes Icon Button */}
            <Link
              href="/saved"
              className="relative p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-[#1E40AF] hover:border-[#1E40AF] transition-colors"
              title={t('savedSchemes')}
            >
              <Bookmark className="w-4 h-4" />
              {savedCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#1E40AF] text-white text-[10px] font-bold flex items-center justify-center">
                  {savedCount}
                </span>
              )}
            </Link>

            {/* Citizen Auth Status or Login Button */}
            {authUser ? (
              <div className="hidden sm:flex items-center gap-1.5 pl-1">
                <Link
                  href="/occupation-questions"
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-blue-500/10 text-[#1E40AF] dark:text-blue-300 text-xs font-bold hover:bg-blue-500/20 transition-colors border border-blue-500/20"
                  title={`${t('loggedInAs')} ${authUser.name} (${authUser.occupation})`}
                >
                  <div className="w-5 h-5 rounded-full bg-[#1E40AF] text-white flex items-center justify-center text-[10px] font-bold">
                    {authUser.name.charAt(0)}
                  </div>
                  <span className="max-w-[90px] truncate">{authUser.name}</span>
                </Link>
                <button
                  type="button"
                  onClick={() => logoutCitizen()}
                  className="p-2 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
                  title={t('logout')}
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:border-[#1E40AF] text-[#1E40AF] dark:text-blue-300 text-xs font-bold shadow-xs transition-colors"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{t('loginRegister')}</span>
              </Link>
            )}

            {/* Fixed 1-Click Dark/Light Toggle */}
            <button
              id="theme-toggle-btn"
              type="button"
              onClick={toggleTheme}
              className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-amber-300 border border-slate-300 dark:border-slate-700 flex items-center justify-center transition-all hover:scale-105 shadow-xs cursor-pointer"
              title={`Currently ${theme === 'dark' ? 'Dark' : 'Light'} Mode. Click to switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode.`}
              aria-label="Toggle Dark and Light theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-amber-400 transition-transform duration-200" />
              ) : (
                <Moon className="w-5 h-5 text-[#1E40AF] transition-transform duration-200" />
              )}
            </button>



            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 cursor-pointer"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#071324] p-4 space-y-3">
            <div className="pb-2">
              <DemoPersonaSwitcher />
            </div>
            <nav className="flex flex-col gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
              <Link
                href="/check-eligibility"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-3 rounded-xl bg-[#1E40AF] hover:bg-[#1D4ED8] text-white flex items-center justify-center gap-2 font-black"
              >
                <ClipboardCheck className="w-4 h-4" />
                <span>{t('navCheckEligibility')}</span>
              </Link>
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {t('navHome')}
              </Link>
              <Link
                href="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between"
              >
                <span>{t('navSchemes')}</span>
                <span className="text-xs bg-blue-500/15 text-[#1E40AF] dark:text-blue-400 px-2 py-0.5 rounded-full font-bold">15</span>
              </Link>
              <Link
                href="/occupation-questions"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-[#1E40AF] dark:text-blue-300 font-bold flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4" />
                  <span>{t('occupationQuestions')}</span>
                </div>
              </Link>
              <Link
                href="/saved"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between"
              >
                <span>{t('navSaved')}</span>
                <span className="text-xs bg-[#1E40AF] text-white px-2 py-0.5 rounded-full font-bold">{savedCount}</span>
              </Link>
              <Link
                href="/onboarding"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {t('navProfile')}
              </Link>


              <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                {authUser ? (
                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-100 dark:bg-slate-800">
                    <div className="flex items-center gap-2 text-xs">
                      <User className="w-4 h-4 text-[#1E40AF]" />
                      <span className="font-bold">{authUser.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        logoutCitizen();
                        setIsMobileMenuOpen(false);
                      }}
                      className="text-xs text-rose-600 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>{t('logout')}</span>
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2.5 rounded-xl bg-[#1E40AF] text-white text-center font-bold text-xs flex items-center justify-center gap-2"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>{t('loginRegister')}</span>
                  </Link>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>

    </>
  );
}
