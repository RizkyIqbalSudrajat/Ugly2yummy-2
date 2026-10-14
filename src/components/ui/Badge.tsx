import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'green' | 'neutral' | 'orange' | 'dark' | 'outline';
  size?: 'sm' | 'md';
  className?: string;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'green',
  size = 'md',
  className = '',
  icon,
}) => {
  const sizeStyles = {
    sm: 'text-[11px] px-2.5 py-0.5 gap-1',
    md: 'text-xs px-3 py-1 gap-1.5',
  }[size];

  const variantStyles = {
    green: 'bg-[#EBF4EE] text-[#2E7D4F] border border-[#2E7D4F]/15 font-medium',
    neutral: 'bg-[#F5F5F7] text-[#1D1D1F] border border-[#E8E8ED] font-medium',
    orange: 'bg-[#FEF3E8] text-[#C86218] border border-[#F28C38]/20 font-medium',
    dark: 'bg-[#141414] text-white font-medium',
    outline: 'bg-transparent text-[#6E6E73] border border-[#E8E8ED] font-normal',
  }[variant];

  return (
    <span
      className={`inline-flex items-center rounded-full shrink-0 select-none ${sizeStyles} ${variantStyles} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span className="truncate">{children}</span>
    </span>
  );
};
