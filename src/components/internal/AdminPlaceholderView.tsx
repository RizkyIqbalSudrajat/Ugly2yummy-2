import React from 'react';
import { LucideIcon, Sparkles } from 'lucide-react';

interface AdminPlaceholderViewProps {
  title: string;
  description: string;
  icon: LucideIcon;
  badge?: string;
  features?: string[];
}

export const AdminPlaceholderView: React.FC<AdminPlaceholderViewProps> = ({
  title,
  description,
  icon: Icon,
  badge = 'Segera Hadir',
  features,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-[#E8E8ED] p-8 sm:p-12 text-center relative overflow-hidden">
        {/* Soft radial background glow */}
        <div className="absolute top-0 right-1/2 translate-x-1/2 w-64 h-64 bg-[#2E7D4F]/5 rounded-full blur-3xl pointer-events-none" />

        {/* Central Icon */}
        <div className="relative z-10 w-16 h-16 rounded-2xl bg-[#EBF4EE] border border-[#2E7D4F]/20 text-[#2E7D4F] flex items-center justify-center mx-auto mb-6 shadow-xs">
          <Icon className="w-8 h-8 stroke-[1.75]" />
        </div>

        {/* Badge & Title */}
        <div className="relative z-10 space-y-2 mb-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5F5F7] text-[#6E6E73] text-xs font-medium border border-[#E8E8ED]">
            <Sparkles className="w-3 h-3 text-[#2E7D4F]" />
            {badge}
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1D1D1F]">
            {title}
          </h2>
          <p className="text-sm text-[#6E6E73] max-w-lg mx-auto leading-relaxed">
            {description}
          </p>
        </div>

        {/* Features Preview List if provided */}
        {features && features.length > 0 && (
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-3 text-left max-w-2xl mx-auto mt-6">
            {features.map((feat, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-[#FBFBFD] border border-[#E8E8ED]"
              >
                <div className="w-2 h-2 rounded-full bg-[#2E7D4F] mb-2" />
                <p className="text-xs text-[#1D1D1F] font-medium leading-relaxed">
                  {feat}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
