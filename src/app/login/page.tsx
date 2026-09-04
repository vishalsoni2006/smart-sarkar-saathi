'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  registerCitizen,
  loginCitizen,
  loginWithGoogle,
  getAuthenticatedUser,
  logoutCitizen
} from '@/lib/firebase/auth';
import { isFirebaseConfigured } from '@/lib/firebase/config';
import { OccupationType, GenderType, CategoryType } from '@/types';
import { OCCUPATIONS, INDIAN_STATES } from '@/data/taxonomy';
import { useLanguage } from '@/components/language-provider';
import {
  Landmark,
  ShieldCheck,
  UserCheck,
  Lock,
  Mail,
  User,
  Briefcase,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Database,
  Sparkles,
  Eye,
  EyeOff,
  LogOut
} from 'lucide-react';

function LoginContent() {
  const { t, getOccupation } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode = searchParams.get('tab') === 'register' ? 'register' : 'login';

  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [currentUser, setCurrentUser] = useState(getAuthenticatedUser());
  const [googleLoading, setGoogleLoading] = useState(false);

  // Login Form States
  const [loginId, setLoginId] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Registration Form States
  const [regName, setRegName] = useState('');
  const [regId, setRegId] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regOccupation, setRegOccupation] = useState<OccupationType>('farmer');
  const [regAge, setRegAge] = useState<number | ''>(42);
  const [regState, setRegState] = useState('Uttar Pradesh');
  const [regIncome, setRegIncome] = useState<number | ''>(120000);
  const [regCategory, setRegCategory] = useState<CategoryType>('obc');
  const [regGender, setRegGender] = useState<GenderType>('male');
  const [regLandHolding, setRegLandHolding] = useState<number | ''>(3.5);
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState<string | null>(null);

  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  useEffect(() => {
    setCurrentUser(getAuthenticatedUser());
  }, []);

  // Handle Login Submit
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginLoading(true);

    try {
      const res = await loginCitizen(loginId, loginPassword);
      if (!res.success) {
        setLoginError(
          res.error ||
            'Not registered or invalid credentials. Please register first to access your portal.'
        );
        setLoginLoading(false);
        return;
      }

      setSuccessBanner(`Logged in successfully as ${res.user?.name}!`);
      setCurrentUser(res.user || null);

      setTimeout(() => {
        router.push('/occupation-questions');
      }, 900);
    } catch (err: any) {
      setLoginError(err?.message || 'Login failed. Please check your credentials or register.');
    } finally {
      setLoginLoading(false);
    }
  };

  // Handle Google OAuth Sign-In
  const handleGoogleSignIn = async () => {
    setLoginError(null);
    setRegError(null);
    setGoogleLoading(true);
    try {
      const res = await loginWithGoogle();
      if (!res.success) {
        setLoginError(res.error || 'Google sign-in could not be completed.');
        setGoogleLoading(false);
        return;
      }

      setSuccessBanner(res.message || `Signed in with Google as ${res.user?.name}!`);
      setCurrentUser(res.user || null);

      setTimeout(() => {
        router.push('/occupation-questions');
      }, 900);
    } catch (err: any) {
      setLoginError(err?.message || 'Google sign-in failed. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  // Handle Register Submit
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);

    if (regPassword !== regConfirmPassword) {
      setRegError('Passwords do not match. Please re-enter your password.');
      return;
    }

    if (regPassword.length < 4) {
      setRegError('Password should be at least 4 characters long.');
      return;
    }

    setRegLoading(true);

    try {
      const res = await registerCitizen({
        identifier: regId,
        password: regPassword,
        name: regName,
        age: Number(regAge) || 35,
        gender: regGender,
        state: regState,
        occupation: regOccupation,
        annual_income: Number(regIncome) || 120000,
        category: regCategory,
        land_holding_acres: regOccupation === 'farmer' ? Number(regLandHolding) || 0 : 0
      });

      if (!res.success) {
        setRegError(res.error || 'Registration failed. Please try again.');
        setRegLoading(false);
        return;
      }

      setSuccessBanner(
        `Registration complete! Profile stored in Firebase Database. Welcome, ${res.user?.name}!`
      );
      setCurrentUser(res.user || null);

      setTimeout(() => {
        router.push('/occupation-questions');
      }, 1100);
    } catch (err: any) {
      setRegError(err?.message || 'An error occurred during registration.');
    } finally {
      setRegLoading(false);
    }
  };

  const handleLogout = () => {
    logoutCitizen();
    setCurrentUser(null);
    setSuccessBanner('You have been logged out.');
  };

  // Quick-fill for Judges / Testing
  const handleQuickDemoFill = (email: string, pass: string) => {
    setLoginId(email);
    setLoginPassword(pass);
    setLoginError(null);
  };

  return (
    <div className="min-h-[80vh] py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-6">
      {/* Portal Branding Banner */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 text-[#1E40AF] dark:text-blue-400 text-xs font-bold border border-blue-500/20">
          <Landmark className="w-3.5 h-3.5" />
          <span>{t('officialPortalBadge', 'Official National e-Governance Portal • MeitY & NeGD')}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          {t('portalTitleAuth', 'Citizen Access & Identity Portal')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
          {t('portalSubtitleAuth', 'Single Sign-On for all 15 Central & State Government Welfare Schemes. Registered citizen records are safely stored in Firebase Firestore.')}
        </p>

        {/* Database Status Pill */}
        <div className="flex items-center justify-center gap-2 pt-1 text-xs">
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-bold text-[11px] bg-blue-50 dark:bg-blue-950/60 text-[#1E40AF] dark:text-blue-300 border border-blue-200 dark:border-blue-900">
            <Database className="w-3.5 h-3.5" />
            <span>
              {isFirebaseConfigured
                ? t('dbConnected', 'Firebase Firestore Cloud: Connected')
                : 'Firebase Cloud DB Active (Auto-Sync & Local Storage)'}
            </span>
          </span>
        </div>
      </div>

      {/* Success Notification Banner */}
      {successBanner && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 flex items-center gap-2.5 text-xs sm:text-sm font-semibold animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successBanner}</span>
        </div>
      )}

      {/* If already logged in, show Current Session Card */}
      {currentUser && (
        <div className="p-5 rounded-2xl bg-blue-50/70 dark:bg-[#0D1E38] border-2 border-blue-200 dark:border-blue-900/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#1E40AF] text-white flex items-center justify-center font-black text-base shadow-xs">
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  {currentUser.name}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#1E40AF] text-white">
                  {currentUser.occupation}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Logged in as: <span className="font-semibold text-slate-700 dark:text-slate-300">{currentUser.identifier}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/occupation-questions"
              className="px-4 py-2 rounded-xl bg-[#1E40AF] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
            >
              <span>Go to Occupation Questions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <button
              onClick={handleLogout}
              className="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors flex items-center gap-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}

      {/* Mode Switcher Tabs (Login vs Register) */}
      <div className="flex rounded-xl bg-slate-100 dark:bg-slate-900 p-1 border border-slate-200 dark:border-slate-800 max-w-md mx-auto">
        <button
          type="button"
          onClick={() => {
            setMode('login');
            setLoginError(null);
          }}
          className={`flex-1 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all ${
            mode === 'login'
              ? 'bg-[#1E40AF] text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          {t('tabLogin', 'Citizen Login')}
        </button>

        <button
          type="button"
          onClick={() => {
            setMode('register');
            setRegError(null);
          }}
          className={`flex-1 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all ${
            mode === 'register'
              ? 'bg-[#1E40AF] text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          {t('tabRegister', 'New Citizen Register')}
        </button>
      </div>

      {/* MAIN CONTAINER */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0D1E38] border border-slate-200 dark:border-blue-900/40 shadow-xl transition-colors">
        {/* ======================= TAB 1: LOGIN FORM ======================= */}
        {mode === 'login' && (
          <div className="space-y-6">
            {/* Judge / Quick Demo testing banner */}
            <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-900 dark:text-blue-200">
              <div className="flex items-center gap-2 font-bold mb-1.5 text-[#1E40AF] dark:text-blue-300">
                <Sparkles className="w-4 h-4" />
                <span>Instant Demo Accounts (Click to auto-fill credentials):</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: 'Ramesh (Farmer)', id: 'ramesh@gov.in', pass: 'farmer123' },
                  { label: 'Priya (Student)', id: 'priya@gov.in', pass: 'student123' },
                  { label: 'Sunita (Vendor)', id: 'sunita@gov.in', pass: 'vendor123' }
                ].map((demo) => (
                  <button
                    key={demo.id}
                    type="button"
                    onClick={() => handleQuickDemoFill(demo.id, demo.pass)}
                    className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:border-[#1E40AF] font-medium text-[11px] transition-colors"
                  >
                    {demo.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Error Message with Register CTA */}
            {loginError && (
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-800 dark:text-rose-300 space-y-2 animate-fadeIn">
                <div className="flex items-center gap-2 font-bold text-xs sm:text-sm">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  <span>{loginError}</span>
                </div>
                <div className="pl-7">
                  <button
                    type="button"
                    onClick={() => {
                      setMode('register');
                      setLoginError(null);
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1E40AF] dark:text-blue-400 hover:underline"
                  >
                    <span>Click here to register your citizen account now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t('emailOrMobile', 'Email / Mobile Number / Citizen ID')}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={loginId}
                    onChange={(e) => setLoginId(e.target.value)}
                    placeholder="e.g. ramesh@gov.in or 9876543210"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1E40AF] text-sm text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t('password', 'Password')}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1E40AF] text-sm text-slate-900 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-3 rounded-xl bg-[#1E40AF] hover:bg-[#1D4ED8] disabled:opacity-60 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {loginLoading ? (
                  <span>Verifying Credentials...</span>
                ) : (
                  <>
                    <UserCheck className="w-4 h-4" />
                    <span>{t('loginButton', 'Login & Access Scheme Questions')}</span>
                  </>
                )}
              </button>

              {/* Google Sign-In Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={googleLoading}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 hover:border-[#1E40AF] dark:hover:border-blue-400 bg-white dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 font-bold text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center gap-2.5 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>{googleLoading ? 'Connecting to Google...' : t('googleSignIn', 'Sign in with Google')}</span>
              </button>
            </form>

            <div className="text-center pt-2 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500">
              <span>{t('firstTimeUser', 'First time using the portal?')} </span>
              <button
                type="button"
                onClick={() => setMode('register')}
                className="text-[#1E40AF] dark:text-blue-400 font-bold hover:underline"
              >
                {t('registerAsNew', 'Register as a New Citizen')}
              </button>
            </div>
          </div>
        )}

        {/* ======================= TAB 2: REGISTER FORM ======================= */}
        {mode === 'register' && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/40">
              <ShieldCheck className="w-4 h-4 text-[#1E40AF] shrink-0" />
              <span>
                Registering saves your citizen profile directly to Firebase Firestore. You can then log in anytime and answer questions tailored to your exact profession.
              </span>
            </div>

            {regError && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-800 dark:text-rose-300 flex items-center gap-2 text-xs font-bold animate-fadeIn">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{regError}</span>
              </div>
            )}

            <form onSubmit={handleRegisterSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    1. Full Name (पूरा नाम) *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1E40AF] text-xs sm:text-sm text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                {/* Email or Mobile (Identifier) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    2. Email or Mobile Number (लॉगिन पहचान) *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={regId}
                      onChange={(e) => setRegId(e.target.value)}
                      placeholder="e.g. ramesh@example.com / 9876543210"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1E40AF] text-xs sm:text-sm text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    3. Create Password (पासवर्ड) *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="password"
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="At least 4 characters"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1E40AF] text-xs sm:text-sm text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    4. Confirm Password (पुष्टि करें) *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="password"
                      required
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1E40AF] text-xs sm:text-sm text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                {/* Primary Occupation (Drives Occupation Questions Tab!) */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[#1E40AF] dark:text-blue-300 mb-1">
                    5. Primary Occupation (व्यवसाय) — Unlocks your specialized questions *
                  </label>
                  <div className="relative">
                    <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <select
                      value={regOccupation}
                      onChange={(e) => setRegOccupation(e.target.value as OccupationType)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-blue-500/40 focus:outline-none focus:ring-2 focus:ring-[#1E40AF] text-xs sm:text-sm text-slate-900 dark:text-white font-semibold"
                    >
                      {OCCUPATIONS.map((occ) => (
                        <option key={occ.id} value={occ.id}>
                          {occ.label} — {occ.description}
                        </option>
                      ))}
                    </select>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    Your questions tab will be uniquely customized based on this selection (e.g. Land size & e-KYC for Farmers, CoV for Vendors, Level for Students).
                  </p>
                </div>

                {/* Conditional Land Holding Size if Farmer */}
                {regOccupation === 'farmer' && (
                  <div className="sm:col-span-2 p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 space-y-1">
                    <label className="block text-xs font-bold text-[#1E40AF] dark:text-blue-300">
                      Cultivable Agricultural Landholding (in Acres):
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="0.1"
                      max="50"
                      value={regLandHolding}
                      onChange={(e) => setRegLandHolding(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="e.g. 3.0"
                      className="w-full sm:w-64 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-blue-500/40 text-xs sm:text-sm font-semibold"
                    />
                    <p className="text-[11px] text-slate-500">
                      PM-KISAN entitlement cap is up to 5 acres (2 hectares).
                    </p>
                  </div>
                )}

                {/* Age */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    6. Age (आयु) *
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="110"
                    required
                    value={regAge}
                    onChange={(e) => setRegAge(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1E40AF] text-xs sm:text-sm"
                  />
                </div>

                {/* State */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    7. State of Residence (राज्य) *
                  </label>
                  <select
                    value={regState}
                    onChange={(e) => setRegState(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1E40AF] text-xs sm:text-sm"
                  >
                    {INDIAN_STATES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Annual Income */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    8. Annual Household Income (₹ INR) *
                  </label>
                  <input
                    type="number"
                    step="5000"
                    required
                    value={regIncome}
                    onChange={(e) => setRegIncome(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1E40AF] text-xs sm:text-sm"
                  />
                </div>

                {/* Social Category */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    9. Social Category (सामाजिक वर्ग) *
                  </label>
                  <select
                    value={regCategory}
                    onChange={(e) => setRegCategory(e.target.value as CategoryType)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1E40AF] text-xs sm:text-sm"
                  >
                    <option value="general">General</option>
                    <option value="obc">OBC (Other Backward Classes)</option>
                    <option value="sc">SC (Scheduled Caste)</option>
                    <option value="st">ST (Scheduled Tribe)</option>
                    <option value="ews">EWS (Economically Weaker Section)</option>
                  </select>
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    10. Gender (लिंग) *
                  </label>
                  <select
                    value={regGender}
                    onChange={(e) => setRegGender(e.target.value as GenderType)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1E40AF] text-xs sm:text-sm"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="transgender">Transgender</option>
                  </select>
                </div>
              </div>

              {/* Submit Registration */}
              <button
                type="submit"
                disabled={regLoading}
                className="w-full py-3 rounded-xl bg-[#1E40AF] hover:bg-[#1D4ED8] disabled:opacity-60 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {regLoading ? (
                  <span>Writing Citizen Record to Database...</span>
                ) : (
                  <>
                    <Database className="w-4 h-4" />
                    <span>{t('registerButton', 'Save to Firebase & Start Occupation Questions')}</span>
                  </>
                )}
              </button>

              {/* Google Quick Register Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={googleLoading}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 hover:border-[#1E40AF] dark:hover:border-blue-400 bg-white dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 font-bold text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center gap-2.5 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>{googleLoading ? 'Connecting to Google...' : t('googleRegister', 'Quick Register with Google')}</span>
              </button>
            </form>

            <div className="text-center pt-2 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500">
              <span>{t('alreadyRegistered', 'Already registered?')} </span>
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-[#1E40AF] dark:text-blue-400 font-bold hover:underline"
              >
                {t('goToLogin', 'Go to Citizen Login')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400 animate-pulse">
            Loading Citizen Portal...
          </div>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
