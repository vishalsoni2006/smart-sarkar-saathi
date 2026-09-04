'use client';

import React from 'react';
import { useLanguage } from '@/components/language-provider';
import {
  LayoutGrid,
  Sprout,
  Fish,
  GraduationCap,
  Briefcase,
  Store,
  ShieldCheck,
  HeartPulse,
  Accessibility,
  Shield
} from 'lucide-react';

interface CategoryStripProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const SCHEME_CATEGORIES = [
  { id: 'all', label: 'All Schemes', icon: LayoutGrid, count: 15 },
  { id: 'Agriculture', label: 'Agriculture & Farmers', icon: Sprout, count: 1 },
  { id: 'Fisheries & Marine', label: 'Fisheries & Marine', icon: Fish, count: 1 },
  { id: 'Education', label: 'Education & Students', icon: GraduationCap, count: 2 },
  { id: 'Business & MSME', label: 'Business & MSME', icon: Briefcase, count: 2 },
  { id: 'Livelihood & Self-Employment', label: 'Street Vendors', icon: Store, count: 1 },
  { id: 'Social Welfare & Pension', label: 'Social Security', icon: ShieldCheck, count: 2 },
  { id: 'Healthcare & Public Service', label: 'Healthcare & CGHS', icon: HeartPulse, count: 2 },
  { id: 'Disability Welfare', label: 'Disability (Divyangjan)', icon: Accessibility, count: 1 },
  { id: 'Defence & Veterans', label: 'Defence Veterans', icon: Shield, count: 1 }
];

export function CategoryStrip({ selectedCategory, onSelectCategory }: CategoryStripProps) {
  const { t, getCategory } = useLanguage();

  return (
    <div className="w-full overflow-x-auto pb-3 pt-1 scrollbar-none">
      <div className="flex items-center gap-3 min-w-max px-1">
        {SCHEME_CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;
          const displayName = cat.id === 'all' ? t('allSchemes') : getCategory(cat.id);

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex flex-col items-center justify-center p-3.5 rounded-2xl transition-all duration-200 min-w-[110px] text-center border-2 group cursor-pointer ${
                isSelected
                  ? 'bg-[#1E40AF] text-white border-blue-800 shadow-md scale-105 font-bold'
                  : 'bg-white dark:bg-[#0D1E38] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-[#1E40AF] hover:shadow-xs'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center mb-1.5 transition-transform group-hover:scale-110 ${
                  isSelected
                    ? 'bg-white/20 text-white'
                    : 'bg-blue-100 dark:bg-blue-950/60 text-[#1E40AF] dark:text-blue-400'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold tracking-tight line-clamp-1">{displayName}</span>
              <span
                className={`text-[10px] mt-0.5 font-medium ${
                  isSelected ? 'text-white/80' : 'text-slate-400'
                }`}
              >
                {cat.count} {cat.count === 1 ? t('schemeCountSingular') : t('schemeCountPlural')}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
