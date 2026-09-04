'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/components/language-provider';
import { getActiveProfile, setActiveProfile } from '@/lib/firebase/storage';
import { rankSchemesForUser } from '@/lib/rule-engine/ranking';
import { VERIFIED_SCHEMES } from '@/data/schemes';
import { OccupationType, UserProfile } from '@/types';
import { SchemeCard } from '@/components/scheme-card';
import {
  Sprout,
  Fish,
  GraduationCap,
  Store,
  HardHat,
  Briefcase,
  Users,
  Accessibility,
  Shield,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CheckEligibilityPage() {
  const { language, t, getOccupation } = useLanguage();
  const router = useRouter();

  // Wizard steps: 1 to 5
  const [currentStep, setCurrentStep] = useState(1);
  const [occupation, setOccupation] = useState<OccupationType>('farmer');
  const [ageGroup, setAgeGroup] = useState<number>(46);
  const [income, setIncome] = useState<number>(140000);
  const [hasLand, setHasLand] = useState<boolean>(true);
  const [hasBpl, setHasBpl] = useState<boolean>(false);
  const [state, setState] = useState<string>('Maharashtra');
  const [isEvaluated, setIsEvaluated] = useState(false);
  const [evaluatedProfile, setEvaluatedProfile] = useState<UserProfile | null>(null);

  const totalSteps = 5;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      finishQuestionnaire();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const finishQuestionnaire = () => {
    const special_conditions: string[] = ['savings_bank_account'];
    if (hasLand) special_conditions.push('has_land');
    if (hasBpl) special_conditions.push('bpl_card');
    if (occupation === 'student') special_conditions.push('student_enrolled');

    const newProfile: UserProfile = {
      id: getActiveProfile()?.id || `user-${Date.now()}`,
      name: occupation === 'farmer' ? 'Kisan Beneficiary' : 'Citizen Beneficiary',
      age: ageGroup,
      annual_income: income,
      occupation,
      occupation_raw: null,
      state,
      gender: 'any',
      category: 'obc',
      special_conditions,
      land_holding_acres: hasLand ? 3 : null,
      updated_at: new Date().toISOString()
    };

    setActiveProfile(newProfile);
    setEvaluatedProfile(newProfile);
    setIsEvaluated(true);

    try {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.5 } });
    } catch {}
  };

  const resetAll = () => {
    setCurrentStep(1);
    setIsEvaluated(false);
  };

  // If results are evaluated, show the suggested schemes
  if (isEvaluated && evaluatedProfile) {
    const rankings = rankSchemesForUser(evaluatedProfile, VERIFIED_SCHEMES);

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fadeIn">
        {/* Results Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-600/15 via-indigo-600/15 to-blue-600/15 border-2 border-[#1E40AF] shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1E40AF] text-white text-xs font-black uppercase tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('resultsReadyBadge', 'Eligibility Results Ready')}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {`${t('schemesFoundForProfile', 'Schemes Found for Your Profile')} (${rankings.topRecommendations.length})`}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              {`${t('primaryOccupation', 'Occupation')}: ${getOccupation(occupation)} • ${t('ageLabel', 'Age')}: ${ageGroup} • ${t('incomeLabel', 'Income')}: ₹${income.toLocaleString('en-IN')}`}
            </p>
          </div>

          <button
            type="button"
            onClick={resetAll}
            className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs hover:border-[#1E40AF] transition-colors flex items-center gap-1.5 shrink-0"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t('checkAgain', 'Check Again')}</span>
          </button>
        </div>

        {/* Top Eligible Schemes */}
        <div className="space-y-6">
          <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-[#1E40AF]" />
            <span>{t('topRecommendedSchemes', 'Top Recommended Schemes')}</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rankings.topRecommendations.map((item) => (
              <SchemeCard
                key={item.scheme.id}
                scheme={item.scheme}
                verdict={item.verdict}
              />
            ))}
          </div>
        </div>

        {/* Universal Schemes */}
        {rankings.universalSchemes.length > 0 && (
          <div className="space-y-6 pt-6 border-t border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-500" />
              <span>{t('universalWelfareSchemes', 'Universal Welfare Schemes')}</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rankings.universalSchemes.map((item) => (
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

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Top Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/15 text-[#1E40AF] dark:text-blue-400 text-xs font-black uppercase tracking-wide">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t('simpleCheckBadge', 'Simple Scheme Eligibility Check')}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
          {t('wizardTitle', 'Check Your Eligibility in 5 Simple Steps')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
          {t('wizardSubtitle', 'Answer 5 simple questions. We will instantly show you all government schemes you can benefit from.')}
        </p>

        {/* Step Progress Bar */}
        <div className="pt-4 max-w-xs mx-auto">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            <span>
              {t('step')} {currentStep} {t('of')} {totalSteps}
            </span>
            <span>{Math.round((currentStep / totalSteps) * 100)}%</span>
          </div>
          <div className="w-full h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#1E40AF] transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Wizard Form Container */}
      <div className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-[#0D1E38] border-2 border-slate-200 dark:border-slate-800 shadow-xl space-y-8">
        {/* STEP 1: Occupation */}
        {currentStep === 1 && (
          <div className="space-y-5 animate-fadeIn">
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
              {t('step1Heading', '1. What is your primary work or occupation?')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {t('wizardStep1Desc', 'Select your occupation from the visual cards below:')}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { id: 'farmer', emoji: '🌾', icon: Sprout },
                { id: 'fisherman', emoji: '🐟', icon: Fish },
                { id: 'student', emoji: '🎓', icon: GraduationCap },
                { id: 'street_vendor', emoji: '🛒', icon: Store },
                { id: 'unorganized_worker', emoji: '👷', icon: HardHat },
                { id: 'msme_owner', emoji: '💼', icon: Briefcase },
                { id: 'senior_citizen', emoji: '👵', icon: Users },
                { id: 'disabled_person', emoji: '♿', icon: Accessibility },
                { id: 'defence_personnel', emoji: '🎖️', icon: Shield }
              ].map((item) => {
                const isSelected = occupation === item.id;
                const Icon = item.icon;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setOccupation(item.id as OccupationType)}
                    className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center text-center transition-all ${
                      isSelected
                        ? 'border-[#1E40AF] bg-blue-500/10 text-[#1E40AF] dark:text-blue-400 scale-105 shadow-md'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 hover:border-[#1E40AF]'
                    }`}
                  >
                    <span className="text-2xl mb-1">{item.emoji}</span>
                    <span className="text-xs sm:text-sm font-black leading-tight">
                      {getOccupation(item.id)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2: Age Group */}
        {currentStep === 2 && (
          <div className="space-y-5 animate-fadeIn">
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
              {t('step2Heading', '2. What is your age group?')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {t('wizardStep2Desc', 'Select your age bracket:')}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { val: 17, label: t('ageUnder18', 'Under 18 years (School Student / Minor)') },
                { val: 24, label: t('age18To40', '18 to 40 years (Youth / Farmer / Worker)') },
                { val: 48, label: t('age41To59', '41 to 59 years (Middle-Aged Citizen)') },
                { val: 65, label: t('age60Plus', '60 years or above (Senior Citizen)') }
              ].map((item) => {
                const isSelected = ageGroup === item.val;
                return (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => setAgeGroup(item.val)}
                    className={`p-4 rounded-2xl border-2 text-left font-bold text-sm transition-all ${
                      isSelected
                        ? 'border-[#1E40AF] bg-blue-500/10 text-[#1E40AF] dark:text-blue-400 scale-102 shadow-md'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 hover:border-[#1E40AF]'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3: Income */}
        {currentStep === 3 && (
          <div className="space-y-5 animate-fadeIn">
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
              {t('step3Heading', '3. What is your approximate yearly family income?')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {t('wizardStep3Desc', 'Select your total family income bracket:')}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { val: 80000, label: t('incomeUnder1L', 'Under ₹1,00,000 (Extremely Low Income / BPL)') },
                { val: 180000, label: t('income1LTo25L', '₹1,00,000 to ₹2,50,000 (Low Income)') },
                { val: 350000, label: t('income25LTo5L', '₹2,50,000 to ₹5,00,000 (Middle Income)') },
                { val: 600000, label: t('incomeAbove5L', 'Above ₹5,00,000 (Above ₹5 Lakhs)') }
              ].map((item) => {
                const isSelected = income === item.val;
                return (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => setIncome(item.val)}
                    className={`p-4 rounded-2xl border-2 text-left font-bold text-sm transition-all ${
                      isSelected
                        ? 'border-[#1E40AF] bg-blue-500/10 text-[#1E40AF] dark:text-blue-400 scale-102 shadow-md'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 hover:border-[#1E40AF]'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 4: Farmland Ownership */}
        {currentStep === 4 && (
          <div className="space-y-5 animate-fadeIn">
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
              {t('step4Heading', '4. Does your family own cultivable agricultural land?')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {t('step4Desc', 'Important for agricultural welfare schemes like PM-KISAN:')}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setHasLand(true)}
                className={`p-5 rounded-2xl border-2 text-left font-bold text-sm transition-all flex items-center gap-3 ${
                  hasLand === true
                    ? 'border-[#1E40AF] bg-blue-500/10 text-[#1E40AF] dark:text-blue-300 scale-102 shadow-md'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300'
                }`}
              >
                <span className="text-2xl">🌾</span>
                <div>
                  <div className="text-base font-black">
                    {t('landYes', 'Yes, we own agricultural land')}
                  </div>
                  <div className="text-xs opacity-80 mt-0.5">
                    {t('smallLandholder', '5 Acres or less (Small/Marginal Farmer)')}
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setHasLand(false)}
                className={`p-5 rounded-2xl border-2 text-left font-bold text-sm transition-all flex items-center gap-3 ${
                  hasLand === false
                    ? 'border-slate-400 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 scale-102 shadow-md'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300'
                }`}
              >
                <span className="text-2xl">❌</span>
                <div>
                  <div className="text-base font-black">
                    {t('landNo', 'No, landless / other occupation')}
                  </div>
                  <div className="text-xs opacity-80 mt-0.5">
                    {t('landlessWorker', 'Landless or non-farming')}
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: Ration Card & State */}
        {currentStep === 5 && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
              {t('step5Heading', '5. Select your State & Ration Card status')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {t('step5Desc', 'Some schemes are tailored for specific states or BPL ration card holders:')}
            </p>

            <div className="space-y-3">
              <label className="block text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">
                {t('bplLabel', 'Do you possess a BPL / Antyodaya / Priority Ration Card?')}
              </label>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setHasBpl(true)}
                  className={`p-4 rounded-xl border-2 font-bold text-sm ${
                    hasBpl === true
                      ? 'border-[#1E40AF] bg-blue-500/10 text-[#1E40AF] dark:text-blue-400'
                      : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  {t('bplYes', 'Yes, we have a BPL / Antyodaya Card')}
                </button>

                <button
                  type="button"
                  onClick={() => setHasBpl(false)}
                  className={`p-4 rounded-xl border-2 font-bold text-sm ${
                    hasBpl === false
                      ? 'border-slate-400 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200'
                      : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  {t('bplNo', 'No, General / APL category')}
                </button>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <label className="block text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">
                {t('stateSelectLabel', 'State of Residence:')}
              </label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-sm text-slate-900 dark:text-white"
              >
                {[
                  'Maharashtra',
                  'Uttar Pradesh',
                  'Bihar',
                  'Madhya Pradesh',
                  'Rajasthan',
                  'West Bengal',
                  'Delhi',
                  'Gujarat',
                  'Tamil Nadu',
                  'Karnataka',
                  'Punjab',
                  'All India'
                ].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handlePrevious}
              className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-bold text-xs sm:text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('previous')}</span>
            </button>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={handleNext}
            className="px-7 py-3 rounded-xl bg-[#1E40AF] hover:bg-[#1D4ED8] text-white font-black text-sm sm:text-base shadow-lg shadow-blue-700/25 transition-transform hover:scale-102 flex items-center gap-2"
          >
            <span>{currentStep === totalSteps ? t('submitAnswers', 'Submit & Check Eligibility') : t('next', 'Next')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
