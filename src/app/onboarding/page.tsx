'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { OCCUPATIONS, INDIAN_STATES, SPECIAL_CONDITIONS, DEMO_PERSONAS } from '@/data/taxonomy';
import { getActiveProfile, setActiveProfile, logUnmatchedOccupation } from '@/lib/firebase/storage';
import { calculateOccupationFuzzyScore } from '@/lib/rule-engine/ranking';
import { VERIFIED_SCHEMES } from '@/data/schemes';
import { CategoryType, GenderType, OccupationType, UserProfile } from '@/types';
import { useLanguage } from '@/components/language-provider';
import { User, Check, ArrowRight, Sparkles, HelpCircle, Save, SlidersHorizontal } from 'lucide-react';

export default function OnboardingPage() {
  const { t, getOccupation } = useLanguage();
  const router = useRouter();

  const [name, setName] = useState('Ramesh Kumar');
  const [age, setAge] = useState<number | ''>(46);
  const [annualIncome, setAnnualIncome] = useState<number | ''>(140000);
  const [occupation, setOccupation] = useState<OccupationType>('farmer');
  const [occupationRaw, setOccupationRaw] = useState('');
  const [state, setState] = useState('Maharashtra');
  const [gender, setGender] = useState<GenderType>('male');
  const [category, setCategory] = useState<CategoryType>('obc');
  const [specialConditions, setSpecialConditions] = useState<string[]>(['has_land', 'savings_bank_account']);
  const [landHoldingAcres, setLandHoldingAcres] = useState<number | ''>(3);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const current = getActiveProfile();
    if (current) {
      setName(current.name || '');
      setAge(current.age ?? '');
      setAnnualIncome(current.annual_income ?? '');
      setOccupation(current.occupation || 'farmer');
      setOccupationRaw(current.occupation_raw || '');
      setState(current.state || 'Maharashtra');
      setGender(current.gender || 'male');
      setCategory(current.category || 'obc');
      setSpecialConditions(current.special_conditions || []);
      setLandHoldingAcres(current.land_holding_acres ?? '');
    }
  }, []);

  const handleConditionToggle = (id: string) => {
    if (specialConditions.includes(id)) {
      setSpecialConditions(specialConditions.filter((c) => c !== id));
      if (id === 'has_land') setLandHoldingAcres('');
    } else {
      setSpecialConditions([...specialConditions, id]);
    }
  };

  const handleQuickLoadPersona = (personaId: string) => {
    const p = DEMO_PERSONAS.find((d) => d.id === personaId)?.profile;
    if (!p) return;
    setName(p.name);
    setAge(p.age ?? '');
    setAnnualIncome(p.annual_income ?? '');
    setOccupation(p.occupation);
    setOccupationRaw(p.occupation_raw || '');
    setState(p.state);
    setGender(p.gender);
    setCategory(p.category);
    setSpecialConditions(p.special_conditions);
    setLandHoldingAcres(p.land_holding_acres ?? '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updatedProfile: UserProfile = {
      id: getActiveProfile()?.id || `user-${Date.now()}`,
      name: name.trim() || 'Citizen',
      age: age === '' ? null : Number(age),
      annual_income: annualIncome === '' ? null : Number(annualIncome),
      occupation,
      occupation_raw: occupation === 'other' ? occupationRaw.trim() : null,
      state,
      gender,
      category,
      special_conditions: specialConditions,
      land_holding_acres: landHoldingAcres === '' ? null : Number(landHoldingAcres),
      updated_at: new Date().toISOString()
    };

    // If "Other" occupation, check if any scheme fuzzy matches, otherwise log to backlog
    if (occupation === 'other' && occupationRaw.trim()) {
      let anyMatch = false;
      for (const s of VERIFIED_SCHEMES) {
        if (calculateOccupationFuzzyScore(occupationRaw, s.occupation_tags) >= 0.55) {
          anyMatch = true;
          break;
        }
      }
      if (!anyMatch) {
        await logUnmatchedOccupation(occupationRaw);
      }
    }

    await setActiveProfile(updatedProfile);
    setSavedSuccess(true);
    setTimeout(() => {
      router.push('/dashboard');
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-[#1E40AF] dark:text-blue-400 text-xs font-bold">
          <User className="w-3.5 h-3.5" />
          <span>{t('quickProfileBadge', 'Quick 8-Field Citizen Profile')}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
          {t('citizenProfileTitle', 'Citizen Eligibility Profile')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
          {t('citizenProfileSubtitle', 'We use these 8 core fields to evaluate your deterministic eligibility across all government welfare schemes. Specific extra details are collected conversationally per scheme!')}
        </p>
      </div>

      {/* Quick Fill Persona Ribbon for judges */}
      <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-xs">
        <div className="flex items-center gap-2 font-bold text-[#1E40AF] dark:text-blue-300 mb-2">
          <Sparkles className="w-4 h-4" />
          <span>{t('judgeFillTitle', 'Judge Quick Fill: Test Instant Personas')}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {DEMO_PERSONAS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => handleQuickLoadPersona(p.id)}
              className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-[#1E40AF] font-medium transition-colors"
            >
              {p.name} ({getOccupation(p.profile.occupation)})
            </button>
          ))}
        </div>
      </div>

      {/* Profile Form */}
      <form
        onSubmit={handleSubmit}
        className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0D1E38] border border-slate-200 dark:border-blue-900/40 shadow-xl space-y-6"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* 1. Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              1. Full Name / Name of Head of Family
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ramesh Kumar"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1E40AF] text-sm text-slate-900 dark:text-white"
            />
          </div>

          {/* 2. Age */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              2. Age (in completed years)
            </label>
            <input
              type="number"
              min="5"
              max="120"
              required
              value={age}
              onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="e.g. 46"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1E40AF] text-sm text-slate-900 dark:text-white"
            />
          </div>

          {/* 3. Occupation Selector */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              3. Primary Occupation (Fixed Taxonomy)
            </label>
            <select
              value={occupation}
              onChange={(e) => setOccupation(e.target.value as OccupationType)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1E40AF] text-sm text-slate-900 dark:text-white"
            >
              {OCCUPATIONS.map((occ) => (
                <option key={occ.id} value={occ.id}>
                  {occ.label} — {occ.description}
                </option>
              ))}
            </select>

            {/* "Other" Free-Text Reveal (Fuzzy Matching Spec §3.1) */}
            {occupation === 'other' && (
              <div className="mt-3 p-4 rounded-2xl bg-blue-500/10 border border-blue-500/30 space-y-2 animate-fadeIn">
                <label className="block text-xs font-bold text-[#1E40AF] dark:text-blue-300">
                  Type your custom occupation (e.g. Auto driver, Anganwadi worker, Handloom weaver):
                </label>
                <input
                  type="text"
                  required={occupation === 'other'}
                  value={occupationRaw}
                  onChange={(e) => setOccupationRaw(e.target.value)}
                  placeholder="e.g. Auto rickshaw driver, Anganwadi worker, Gig worker"
                  className="w-full px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-blue-500/40 focus:outline-none focus:ring-2 focus:ring-[#1E40AF] text-sm text-slate-900 dark:text-white"
                />
                <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                  <span>Quick picks:</span>
                  {['Auto rickshaw driver', 'Anganwadi worker', 'Construction mason', 'Tailor / Artisan'].map((pick) => (
                    <button
                      key={pick}
                      type="button"
                      onClick={() => setOccupationRaw(pick)}
                      className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:border-[#1E40AF]"
                    >
                      {pick}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Custom occupations are fuzzy matched against scheme synonym tags. If no direct match is found, your query is logged into the backlog and universal schemes will be surfaced.
                </p>
              </div>
            )}
          </div>

          {/* 4. Annual Household Income */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              4. Annual Household Income (₹ INR)
            </label>
            <input
              type="number"
              step="5000"
              required
              value={annualIncome}
              onChange={(e) => setAnnualIncome(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="e.g. 140000"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1E40AF] text-sm text-slate-900 dark:text-white"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Combined income of family from all sources.
            </p>
          </div>

          {/* 5. State / UT */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              5. State / Union Territory of Residence
            </label>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1E40AF] text-sm text-slate-900 dark:text-white"
            >
              {INDIAN_STATES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* 6. Gender */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              6. Gender
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value as GenderType)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1E40AF] text-sm text-slate-900 dark:text-white"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="transgender">Transgender</option>
            </select>
          </div>

          {/* 7. Social Category */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              7. Social Category / Caste
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as CategoryType)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1E40AF] text-sm text-slate-900 dark:text-white"
            >
              <option value="general">General</option>
              <option value="obc">OBC (Other Backward Classes)</option>
              <option value="sc">SC (Scheduled Caste)</option>
              <option value="st">ST (Scheduled Tribe)</option>
              <option value="ews">EWS (Economically Weaker Section)</option>
            </select>
          </div>
        </div>

        {/* 8. Special Conditions Checkboxes */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-3">
            8. Applicable Beneficiary Qualifications (Select all that apply)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {SPECIAL_CONDITIONS.map((cond) => {
              const checked = specialConditions.includes(cond.id);
              return (
                <label
                  key={cond.id}
                  className={`flex items-start gap-3 p-3 rounded-xl border text-xs cursor-pointer transition-colors ${
                    checked
                      ? 'bg-blue-500/10 border-[#1E40AF] text-slate-900 dark:text-white font-semibold'
                      : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => handleConditionToggle(cond.id)}
                    className="mt-0.5 rounded text-[#1E40AF] focus:ring-[#1E40AF]"
                  />
                  <span>{cond.label}</span>
                </label>
              );
            })}
          </div>

          {/* Conditional Land Holding Size Input (if user checked has_land) */}
          {specialConditions.includes('has_land') && (
            <div className="mt-4 p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 space-y-1.5 animate-fadeIn">
              <label className="block text-xs font-bold text-[#1E40AF] dark:text-blue-300">
                Cultivable Agricultural Landholding (in Acres):
              </label>
              <input
                type="number"
                step="0.5"
                min="0.1"
                max="50"
                value={landHoldingAcres}
                onChange={(e) => setLandHoldingAcres(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="e.g. 3"
                className="w-full sm:w-60 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-blue-500/40 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
              />
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Required for small and marginal farmer schemes like PM-KISAN (up to 5 acres / 2 hectares).
              </p>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-4 flex items-center justify-end gap-3">
          <button
            type="submit"
            className="px-8 py-3 rounded-2xl bg-[#1E40AF] hover:bg-[#1D4ED8] text-white font-bold text-sm shadow-md transition-all hover:scale-102 flex items-center gap-2"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>Saved! Redirecting...</span>
              </>
            ) : (
              <>
                <span>{t('saveProfileBtn', 'Save Profile & View Eligible Schemes')}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
