'use client';

import React from 'react';
import Link from 'next/link';
import { Landmark, ShieldCheck, ExternalLink } from 'lucide-react';
import { useLanguage } from '@/components/language-provider';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-[#0B1E36] text-[#CBD5E1] pt-12 pb-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand & Portal Authority */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-blue-400">
                <Landmark className="w-6 h-6" />
              </div>
              <div className="flex items-baseline">
                <span className="text-2xl font-black text-white">my</span>
                <span className="text-2xl font-black text-blue-400">Scheme</span>
                <span className="ml-2 text-xs font-bold px-2 py-0.5 rounded-sm bg-white/10 text-slate-200">
                  AI Navigator
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm leading-relaxed text-slate-300 max-w-md">
              {t('footerDesc', 'myScheme is an official National Platform providing an innovative, citizen-centric service to discover government welfare schemes and financial support based on your eligibility.')}
            </p>

            <div className="flex items-center gap-2 text-xs font-bold text-blue-300">
              <ShieldCheck className="w-4 h-4" />
              <span>{t('officialGovPortal15', 'Official Government Portal • 15 Verified National Schemes')}</span>
            </div>
          </div>

          {/* Government Initiatives & Portals */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-white mb-3">
              {t('goiPortalsTitle', 'Government of India Portals')}
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <a
                  href="https://www.myscheme.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-300 flex items-center gap-1.5 transition-colors"
                >
                  <span>myScheme Portal (MeitY/NeGD)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.india.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-300 flex items-center gap-1.5 transition-colors"
                >
                  <span>{t('nationalPortalOfIndia', 'National Portal of India')}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://data.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-300 flex items-center gap-1.5 transition-colors"
                >
                  <span>{t('openGovData', 'Open Government Data (data.gov.in)')}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.digitalindia.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-300 flex items-center gap-1.5 transition-colors"
                >
                  <span>{t('digitalIndia', 'Digital India')}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-white mb-3">
              {t('quickNavTitle', 'Quick Navigation')}
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <Link href="/check-eligibility" className="hover:text-blue-200 transition-colors font-bold text-blue-300">
                  {t('findSchemesEligibility', 'Find Schemes For You (Eligibility Check)')}
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-blue-300 transition-colors">
                  {t('allSchemesDirectory', 'All 15 Schemes Directory')}
                </Link>
              </li>
              <li>
                <Link href="/onboarding" className="hover:text-blue-300 transition-colors">
                  {t('citizenProfileOccupation', 'Citizen Profile & Occupation')}
                </Link>
              </li>
              <li>
                <Link href="/saved" className="hover:text-blue-300 transition-colors">
                  {t('bookmarkedSchemes', 'Bookmarked Schemes')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* National e-Governance Division Footer Strip */}
        <div className="pt-6 border-t border-slate-700/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <p>{t('footerCopyright', '© 2026 Government Scheme Discovery & Eligibility Portal • Origin Hackathon PS-2')}</p>
          <p className="flex items-center gap-2">
            <span>{t('footerMeity', 'Aligned with MeitY / Digital India e-Governance Guidelines')}</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
