'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { VERIFIED_SCHEMES } from '@/data/schemes';
import { getActiveProfile } from '@/lib/firebase/storage';
import { rankSchemesForUser } from '@/lib/rule-engine/ranking';
import { SchemeCard } from '@/components/scheme-card';
import { CategoryStrip } from '@/components/category-strip';
import { UserProfile } from '@/types';
import { Search, Filter, Sparkles, AlertCircle, CheckCircle2, XCircle, User, SlidersHorizontal } from 'lucide-react';
import Link from 'next/link';

import { useLanguage } from '@/components/language-provider';

function DashboardContent() {
  const { t, getCategory, getOccupation } = useLanguage();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';

  const [activeProfile, setActiveProfile] = useState<UserProfile | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [statusFilter, setStatusFilter] = useState<'all' | 'ELIGIBLE' | 'NEEDS_MORE_INFO' | 'NOT_ELIGIBLE'>('all');

  useEffect(() => {
    setActiveProfile(getActiveProfile());

    const handleProfileUpdate = (e: any) => {
      setActiveProfile(e.detail);
    };

    window.addEventListener('scheme_navigator_profile_updated', handleProfileUpdate);
    return () => window.removeEventListener('scheme_navigator_profile_updated', handleProfileUpdate);
  }, []);

  const rankings = rankSchemesForUser(activeProfile, VERIFIED_SCHEMES);

  // Filter schemes
  const filterList = (items: typeof rankings.topRecommendations) => {
    return items.filter((item) => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = item.scheme.name.toLowerCase().includes(q);
        const matchShort = item.scheme.short_name.toLowerCase().includes(q);
        const matchMinistry = item.scheme.ministry.toLowerCase().includes(q);
        const matchCategory = item.scheme.category.toLowerCase().includes(q);
        const matchBenefit = item.scheme.benefit_summary.toLowerCase().includes(q);
        if (!matchName && !matchShort && !matchMinistry && !matchCategory && !matchBenefit) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory !== 'all' && item.scheme.category !== selectedCategory) {
        return false;
      }

      // Status filter
      if (statusFilter !== 'all' && item.verdict.status !== statusFilter) {
        return false;
      }

      return true;
    });
  };

  const filteredTop = filterList(rankings.topRecommendations);
  const filteredUniversal = filterList(rankings.universalSchemes);
  const filteredIneligible = filterList(rankings.likelyNotEligible);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Active Profile Status Strip */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0D1E38] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-[#1E40AF] dark:text-blue-400 shrink-0">
            <User className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                {t('activeProfileLabel')} {activeProfile?.name || 'Citizen'}
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/15 text-[#1E40AF] dark:text-blue-400 font-bold border border-blue-500/30">
                {activeProfile?.occupation ? getOccupation(activeProfile.occupation) : ''}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t('ageLabel')}: {activeProfile?.age || '—'} • {t('stateLabel')}: {activeProfile?.state || 'All India'} • {t('incomeLabel')}:{' '}
              {activeProfile?.annual_income ? `₹${activeProfile.annual_income.toLocaleString('en-IN')}` : '—'}
              {activeProfile?.land_holding_acres ? ` • Land: ${activeProfile.land_holding_acres} acres` : ''}
            </p>
          </div>
        </div>

        <Link
          href="/onboarding"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-[#1E40AF] hover:text-white text-slate-700 dark:text-slate-300 transition-colors self-start sm:self-center"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>{t('editProfile')}</span>
        </Link>
      </div>

      {/* Unmatched Free-Text Occupation Notice (Backlog Logging) */}
      {rankings.unmatchedRawOccupation && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-amber-900 dark:text-amber-200 text-xs sm:text-sm">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">{t('unmatchedOccupationLogged')}</span> {rankings.unmatchedRawOccupation}. {t('unmatchedOccupationDesc')}
          </div>
        </div>
      )}

      {/* Category Ribbon */}
      <div>
        <CategoryStrip
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => setSelectedCategory(cat)}
        />
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('searchSchemesInput')}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-[#0D1E38] border border-slate-200 dark:border-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#1E40AF] text-slate-900 dark:text-white"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: t('allStatuses') },
            { id: 'ELIGIBLE', label: t('onlyEligible') },
            { id: 'NEEDS_MORE_INFO', label: t('onlyNeedsInfo') },
            { id: 'NOT_ELIGIBLE', label: t('notEligibleBadge') }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id as any)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors border cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-[#1E40AF] text-white border-blue-800 shadow-xs'
                  : 'bg-white dark:bg-[#0D1E38] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-[#1E40AF]/40'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 1. Top Recommended & Occupation-Matched Schemes */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#1E40AF]" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {t('recommendedTitle')}
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/15 text-[#1E40AF] dark:text-blue-400 font-bold">
              {filteredTop.length}
            </span>
          </div>
          <span className="text-xs text-slate-500">{t('showingMatching')}</span>
        </div>

        {filteredTop.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 text-sm">
            {t('noMatchingSchemesFound')}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTop.map((item) => (
              <SchemeCard
                key={item.scheme.id}
                scheme={item.scheme}
                verdict={item.verdict}
                isFuzzyMatch={item.isFuzzyMatch}
              />
            ))}
          </div>
        )}
      </div>

      {/* 2. Universal & Broad Welfare Schemes */}
      {filteredUniversal.length > 0 && (
        <div className="space-y-4 pt-6">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {t('universalWelfareSchemes')}
              </h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-600 dark:text-blue-400 font-bold">
                {filteredUniversal.length}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUniversal.map((item) => (
              <SchemeCard
                key={item.scheme.id}
                scheme={item.scheme}
                verdict={item.verdict}
              />
            ))}
          </div>
        </div>
      )}

      {/* 3. Transparent Ineligible Schemes (Never Hidden) */}
      {filteredIneligible.length > 0 && (
        <div className="space-y-4 pt-6">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-rose-500" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {t('notEligibleBadge')}
              </h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 font-bold">
                {filteredIneligible.length}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIneligible.map((item) => (
              <SchemeCard
                key={item.scheme.id}
                scheme={item.scheme}
                verdict={item.verdict}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-500">Loading Schemes Directory...</div>}>
      <DashboardContent />
    </Suspense>
  );
}

