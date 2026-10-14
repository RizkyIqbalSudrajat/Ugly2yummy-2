import React from 'react';
import { Link } from 'react-router-dom';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'text' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  to?: string;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  to,
  fullWidth = false,
  icon,
  iconPosition = 'left',
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2E7D4F] focus-visible:ring-offset-2 active:scale-[0.98] select-none whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100';

  const sizeStyles = {
    sm: 'text-xs px-3.5 py-1.5 gap-1.5 min-h-[32px]',
    md: 'text-sm px-5 py-2.5 gap-2 min-h-[42px]',
    lg: 'text-base px-6 py-3.5 gap-2.5 min-h-[50px]',
  }[size];

  const variantStyles = {
    primary: 'bg-[#2E7D4F] hover:bg-[#256640] text-white shadow-xs',
    secondary: 'bg-[#F5F5F7] hover:bg-[#E8E8ED] text-[#1D1D1F] border border-[#E8E8ED]',
    outline: 'border border-[#2E7D4F] text-[#2E7D4F] hover:bg-[#2E7D4F]/10',
    text: 'text-[#1D1D1F] hover:text-[#2E7D4F] hover:bg-[#1D1D1F]/5',
    dark: 'bg-[#141414] hover:bg-black text-white shadow-xs',
  }[variant];

  const widthStyle = fullWidth ? 'w-full' : '';

  const combinedClasses = `${baseStyles} ${sizeStyles} ${variantStyles} ${widthStyle} ${className}`.trim();

  const content = (
    <>
      {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
      <span className="truncate">{children}</span>
      {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={combinedClasses}>
        {content}
      </Link>
    );
  }

  return (
    <button className={combinedClasses} disabled={disabled} {...props}>
      {content}
    </button>
  );
};
