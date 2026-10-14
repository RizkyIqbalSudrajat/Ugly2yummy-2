import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  border?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverEffect = false,
  padding = 'md',
  border = true,
  ...props
}) => {
  const paddingStyles = {
    none: 'p-0',
    sm: 'p-4 sm:p-5',
    md: 'p-6 sm:p-7',
    lg: 'p-8 sm:p-10',
  }[padding];

  const borderStyles = border ? 'border border-[#E8E8ED]' : '';
  const hoverStyles = hoverEffect
    ? 'transition-all duration-300 hover:-translate-y-0.5 hover:border-[#2E7D4F]/30 shadow-none'
    : 'transition-colors duration-200 shadow-none';

  return (
    <div
      className={`bg-white rounded-2xl sm:rounded-3xl shadow-xs overflow-hidden ${borderStyles} ${paddingStyles} ${hoverStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
