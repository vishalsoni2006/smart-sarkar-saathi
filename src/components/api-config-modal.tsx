'use client';

import React, { useState, useEffect } from 'react';
import { isFirebaseConfigured } from '@/lib/firebase/config';
import { getActiveGeminiKey, testGeminiApiKey, saveGeminiKey, saveGroqKey } from '@/lib/llm/gemini-config';
import { Key, Database, Cpu, Check, AlertCircle, Shield, X, Sparkles, Loader2, ExternalLink } from 'lucide-react';

interface ApiConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ApiConfigModal({ isOpen, onClose }: ApiConfigModalProps) {
  const [geminiKey, setGeminiKey] = useState('');
  const [groqKey, setGroqKey] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [testingGemini, setTestingGemini] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const activeGemini = getActiveGeminiKey() || '';
      setGeminiKey(activeGemini);
      setGroqKey(localStorage.getItem('scheme_navigator_groq_key') || '');
      setTestResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTestGemini = async () => {
    if (!geminiKey.trim()) return;
    setTestingGemini(true);
    setTestResult(null);
    try {
      const res = await testGeminiApiKey(geminiKey.trim());
      setTestResult(res);
    } catch (err: any) {
      setTestResult({ success: false, message: err?.message || 'Connection test failed.' });
    } finally {
      setTestingGemini(false);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanGemini = geminiKey.trim();
    const cleanGroq = groqKey.trim();
    saveGeminiKey(cleanGemini);
    saveGroqKey(cleanGroq);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const isGeminiSet = Boolean(geminiKey.trim());

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-[#0D1E38] border border-slate-200 dark:border-blue-900/40 shadow-2xl p-6 text-slate-900 dark:text-white">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-[#1E40AF] dark:text-blue-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold">Google Gemini AI & Cloud Settings</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Configure live Google Gemini API or run in local verified mode
            </p>
          </div>
        </div>

        {/* System Health Indicators */}
        <div className="space-y-2.5 mb-5 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="font-semibold">Google Gemini 1.5:</span>
            </div>
            <span
              className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                isGeminiSet
                  ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {isGeminiSet ? 'Key Configured' : 'Optional / Not Configured'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-[#1E40AF] dark:text-blue-400" />
              <span className="font-semibold">Firebase Firestore:</span>
            </div>
            <span
              className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                isFirebaseConfigured
                  ? 'bg-blue-500/15 text-[#1E40AF] dark:text-blue-400 border border-blue-500/30'
                  : 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30'
              }`}
            >
              {isFirebaseConfigured ? 'Connected Cloud' : 'Local Verified Corpus'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#1E40AF] dark:text-blue-400" />
              <span className="font-semibold">RAG Synthesizer:</span>
            </div>
            <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-blue-500/15 text-[#1E40AF] dark:text-blue-400 border border-blue-500/30">
              Deterministic + LLM Hybrid
            </span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-4 text-xs sm:text-sm">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Google Gemini API Key</span>
              </label>
              {geminiKey.trim() && (
                <button
                  type="button"
                  onClick={handleTestGemini}
                  disabled={testingGemini}
                  className="text-[11px] font-bold text-[#1E40AF] dark:text-blue-400 hover:underline cursor-pointer flex items-center gap-1"
                >
                  {testingGemini ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" />
                      <span>Testing...</span>
                    </>
                  ) : (
                    'Test Connection'
                  )}
                </button>
              )}
            </div>
            <input
              type="password"
              value={geminiKey}
              onChange={(e) => {
                setGeminiKey(e.target.value);
                setTestResult(null);
              }}
              placeholder="AIzaSy..."
              className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1E40AF] text-slate-900 dark:text-white"
            />

            {/* Test Result Message */}
            {testResult && (
              <div
                className={`mt-2 p-2.5 rounded-xl border text-[11px] flex items-start gap-2 ${
                  testResult.success
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300'
                }`}
              >
                {testResult.success ? (
                  <Check className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                )}
                <span>{testResult.message}</span>
              </div>
            )}

            <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
              <span>Get a free key from Google AI Studio.</span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[#1E40AF] dark:text-blue-400 hover:underline font-semibold"
              >
                <span>Get API Key</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
              Groq API Key (Optional Fallback)
            </label>
            <input
              type="password"
              value={groqKey}
              onChange={(e) => setGroqKey(e.target.value)}
              placeholder="gsk_..."
              className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1E40AF] text-slate-900 dark:text-white"
            />
          </div>

          <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-[11px] text-blue-700 dark:text-blue-300 flex items-start gap-2">
            <Shield className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              You can set your key here or in <code className="font-mono font-bold">.env.local</code> as <code className="font-mono font-bold">NEXT_PUBLIC_GEMINI_API_KEY</code>. Even without external keys, Scheme Navigator will execute seamlessly using the verified 15-scheme deterministic engine.
            </span>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#1E40AF] hover:bg-[#1D4ED8] text-white font-bold text-xs shadow-md transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  Saved!
                </>
              ) : (
                'Save Settings'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
