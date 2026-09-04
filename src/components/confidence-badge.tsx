'use client';

import React from 'react';
import { useLanguage } from '@/components/language-provider';

interface ConfidenceBadgeProps {
  score: number;
  status: 'ELIGIBLE' | 'NOT_ELIGIBLE' | 'NEEDS_MORE_INFO';
  size?: 'sm' | 'md' | 'lg';
}

export function ConfidenceBadge({ score, status, size = 'md' }: ConfidenceBadgeProps) {
  const { t } = useLanguage();
  let colorClasses = 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
  let dotColor = 'bg-emerald-500';

  if (status === 'NOT_ELIGIBLE' || score < 50) {
    colorClasses = 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30';
    dotColor = 'bg-rose-500';
  } else if (status === 'NEEDS_MORE_INFO' || score < 80) {
    colorClasses = 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30';
    dotColor = 'bg-amber-500';
  }

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs font-semibold',
    md: 'px-2.5 py-1 text-xs sm:text-sm font-semibold',
    lg: 'px-3.5 py-1.5 text-sm sm:text-base font-bold'
  }[size];

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full border ${colorClasses} ${sizeClasses} shadow-sm backdrop-blur-xs`}
    >
      <span className={`w-2 h-2 rounded-full ${dotColor}`} />
      <span>
        {status === 'ELIGIBLE'
          ? t('badgeEligible')
          : status === 'NEEDS_MORE_INFO'
          ? t('badgeNeedsDetail')
          : t('badgeIneligible')}
      </span>
    </div>
  );
}
