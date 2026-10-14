import React from 'react';
import { SupplierOfferStatus } from '../../types/supplier';
import { Clock, CheckCircle2, Calendar, Truck, Check, XCircle } from 'lucide-react';

interface SupplierStatusBadgeProps {
  status: SupplierOfferStatus;
  size?: 'sm' | 'md';
}

export const SupplierStatusBadge: React.FC<SupplierStatusBadgeProps> = ({
  status,
  size = 'md',
}) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px] gap-1' : 'px-2.5 py-1 text-xs gap-1.5';

  const config: Record<
    SupplierOfferStatus,
    { bg: string; text: string; border: string; icon: React.ReactNode }
  > = {
    'Menunggu Persetujuan': {
      bg: 'bg-[#F5F5F7]',
      text: 'text-[#48484A]',
      border: 'border-[#E8E8ED]',
      icon: <Clock className="w-3.5 h-3.5 shrink-0 text-[#6E6E73]" />,
    },
    Disetujui: {
      bg: 'bg-[#ECFDF3]',
      text: 'text-[#027A48]',
      border: 'border-[#A6F4C5]',
      icon: <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-[#12B76A]" />,
    },
    Dijadwalkan: {
      bg: 'bg-[#EFF8FF]',
      text: 'text-[#175CD3]',
      border: 'border-[#B2DDFF]',
      icon: <Calendar className="w-3.5 h-3.5 shrink-0 text-[#2E90FA]" />,
    },
    'Dikirim/Dijemput': {
      bg: 'bg-[#FEFBE8]',
      text: 'text-[#A15C07]',
      border: 'border-[#FDE272]',
      icon: <Truck className="w-3.5 h-3.5 shrink-0 text-[#EAAA08]" />,
    },
    'Selesai & Dibayar': {
      bg: 'bg-[#EBF4EE]',
      text: 'text-[#2E7D4F]',
      border: 'border-[#2E7D4F]/30',
      icon: <Check className="w-3.5 h-3.5 shrink-0 font-bold text-[#2E7D4F]" />,
    },
    Ditolak: {
      bg: 'bg-[#FEF3F2]',
      text: 'text-[#B42318]',
      border: 'border-[#FECDCA]',
      icon: <XCircle className="w-3.5 h-3.5 shrink-0 text-[#F04438]" />,
    },
  };

  const current = config[status] || {
    bg: 'bg-[#F5F5F7]',
    text: 'text-[#6E6E73]',
    border: 'border-[#E8E8ED]',
    icon: null,
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full ${sizeClasses} ${current.bg} ${current.text} ${current.border} border select-none transition-colors`}
    >
      {current.icon}
      <span>{status}</span>
    </span>
  );
};
