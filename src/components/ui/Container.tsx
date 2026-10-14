import React from 'react';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  size?: 'normal' | 'narrow' | 'wide';
}

export const Container: React.FC<ContainerProps> = ({
  children,
  className = '',
  size = 'normal',
  ...props
}) => {
  const sizeClasses = {
    narrow: 'max-w-[860px]',
    normal: 'max-w-[1200px]',
    wide: 'max-w-[1360px]',
  }[size];

  return (
    <div
      className={`w-full mx-auto px-4 sm:px-6 lg:px-8 ${sizeClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
