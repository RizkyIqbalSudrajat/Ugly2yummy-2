import React from 'react';
import {
  Clock,
  CheckCircle2,
  ChefHat,
  Package,
  Sparkles,
} from 'lucide-react';

export type WorkerStatusType =
  | 'Menunggu Diseleksi'
  | 'Sudah Diseleksi'
  | 'Sedang Diolah'
  | 'Sedang Dikemas'
  | 'Siap Dijual';

interface WorkerStatusBadgeProps {
  status: WorkerStatusType | string;
  size?: 'sm' | 'md';
  showIcon?: boolean;
  className?: string;
}

export const WorkerStatusBadge: React.FC<WorkerStatusBadgeProps> = ({
  status,
  size = 'md',
  showIcon = true,
  className = '',
}) => {
  let badgeClasses = 'bg-[#F5F5F7] text-[#6E6E73] border-[#E8E8ED]';
  let Icon = Clock;

  switch (status) {
    case 'Menunggu Diseleksi':
      // Abu-abu lembut
      badgeClasses = 'bg-[#F5F5F7] text-[#6E6E73] border-[#E8E8ED]';
      Icon = Clock;
      break;

    case 'Sudah Diseleksi':
      // Biru muda lembut
      badgeClasses = 'bg-sky-50 text-sky-800 border-sky-200/80';
      Icon = CheckCircle2;
      break;

    case 'Sedang Diolah':
      // Kuning / amber muda lembut
      badgeClasses = 'bg-amber-50 text-amber-800 border-amber-200/80';
      Icon = ChefHat;
      break;

    case 'Sedang Dikemas':
      // Ungu muda lembut
      badgeClasses = 'bg-purple-50 text-purple-800 border-purple-200/80';
      Icon = Package;
      break;

    case 'Siap Dijual':
      // Hijau aksen lembut
      badgeClasses = 'bg-[#EBF4EE] text-[#2E7D4F] border-[#2E7D4F]/25';
      Icon = Sparkles;
      break;

    default:
      badgeClasses = 'bg-[#F5F5F7] text-[#1D1D1F] border-[#E8E8ED]';
      Icon = Clock;
  }

  const sizeClasses =
    size === 'sm'
      ? 'text-[10px] px-2 py-0.5 gap-1'
      : 'text-xs px-2.5 py-1 gap-1.5 font-semibold';

  return (
    <span
      className={`inline-flex items-center rounded-full border transition-colors select-none ${sizeClasses} ${badgeClasses} ${className}`}
    >
      {showIcon && <Icon className={size === 'sm' ? 'w-3 h-3 shrink-0' : 'w-3.5 h-3.5 shrink-0'} />}
      <span className="truncate">{status}</span>
    </span>
  );
};
