import React from 'react';

export interface SectionHeadingProps {
  kicker?: string;
  title: React.ReactNode;
  subtitle?: string;
  align?: 'left' | 'center';
  dark?: boolean;
  action?: React.ReactNode;
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  kicker,
  title,
  subtitle,
  align = 'center',
  dark = false,
  action,
  className = '',
}) => {
  const isCenter = align === 'center';

  return (
    <div
      className={`mb-10 sm:mb-14 ${
        isCenter ? 'text-center flex flex-col items-center' : 'text-left'
      } ${className}`}
    >
      <div className={`w-full ${action && !isCenter ? 'flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4' : ''}`}>
        <div className={isCenter ? 'max-w-3xl flex flex-col items-center' : 'max-w-2xl'}>
          {kicker && (
            <div className="mb-2 sm:mb-3">
              <span
                className={`text-xs font-semibold tracking-wider uppercase ${
                  dark ? 'text-[#8FE3AC]' : 'text-[#2E7D4F]'
                }`}
              >
                {kicker}
              </span>
            </div>
          )}

          <h2
            className={`text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-bold tracking-tight leading-[1.15] text-balance ${
              dark ? 'text-white' : 'text-[#1D1D1F]'
            }`}
          >
            {title}
          </h2>

          {subtitle && (
            <p
              className={`mt-3 sm:mt-4 text-base sm:text-lg leading-relaxed text-balance ${
                dark ? 'text-white/70' : 'text-[#6E6E73]'
              }`}
            >
              {subtitle}
            </p>
          )}
        </div>

        {action && !isCenter && <div className="shrink-0 mt-3 sm:mt-0">{action}</div>}
      </div>

      {action && isCenter && <div className="mt-6">{action}</div>}
    </div>
  );
};
