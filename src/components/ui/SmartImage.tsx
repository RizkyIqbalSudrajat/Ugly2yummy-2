import React, { useState } from 'react';

interface SmartImageProps {
  src?: string;
  alt: string;
  fallbackEmoji?: string;
  className?: string;
  containerClassName?: string;
  aspectRatio?: '1:1' | '4:3' | '16:9' | '3:2' | '3:4' | '4:5';
  hoverZoom?: boolean;
}

export const SmartImage: React.FC<SmartImageProps> = ({
  src,
  alt,
  fallbackEmoji = '🌱',
  className = '',
  containerClassName = '',
  aspectRatio = '4:3',
  hoverZoom = false,
}) => {
  const [hasError, setHasError] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const aspectClasses = {
    '1:1': 'aspect-square',
    '4:3': 'aspect-[4/3]',
    '16:9': 'aspect-[16/9]',
    '3:2': 'aspect-[3/2]',
    '3:4': 'aspect-[3/4]',
    '4:5': 'aspect-[4/5]',
  }[aspectRatio];

  const showFallback = !src || src.includes('[TEMPEL') || hasError;

  return (
    <div
      className={`relative overflow-hidden bg-[#F5F5F7] ${aspectClasses} ${containerClassName}`}
    >
      {/* Skeleton / placeholder state while image loads */}
      {!isLoaded && !showFallback && (
        <div className="absolute inset-0 bg-[#E8E8ED] animate-pulse" />
      )}

      {showFallback ? (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#F5F5F7] via-[#EFEFF2] to-[#E5E5EA] text-[#6E6E73] p-4 select-none"
          role="img"
          aria-label={alt}
        >
          <span className="text-4xl sm:text-5xl filter drop-shadow-sm mb-2 transform transition-transform hover:scale-110">
            {fallbackEmoji}
          </span>
          <span className="text-xs font-medium text-[#1D1D1F]/70 text-center line-clamp-1 max-w-[85%]">
            {alt}
          </span>
          <span className="text-[10px] text-[#2E7D4F] font-semibold mt-1">
            Ugly2Yummy
          </span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          referrerPolicy="no-referrer"
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={`w-full h-full object-cover transition-all duration-500 ease-out ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${hoverZoom ? 'group-hover:scale-105' : ''} ${className}`}
        />
      )}
    </div>
  );
};
