'use client';
import { ReactNode } from 'react';

interface StatsCardProps {
  title: string;
  amount: string | number;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export default function StatsCard({ title, amount, icon, trend }: StatsCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="typo-body_sr text-text_four uppercase tracking-wide">{title}</p>
          <p className="typo-heading_ms text-text_one mt-2">{amount}</p>
          {trend && (
            <div className="flex items-center mt-2">
              <span className={`typo-body_sr ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
              </span>
              <span className="typo-body_sr text-text_four ml-2">from last month</span>
            </div>
          )}
        </div>
        <div className="flex-shrink-0">
          <div className="p-3 bg-primary/10 rounded-lg">
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
}