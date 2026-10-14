import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';
import { ArrowLeft, Sparkles, Compass } from 'lucide-react';

interface PlaceholderPageProps {
  title: string;
  category?: string;
  description?: string;
  backTo?: string;
  backLabel?: string;
}

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({
  title,
  category = 'Halaman Pembeli',
  description = 'Halaman ini sedang disiapkan dan akan diimplementasikan penuh pada tahap selanjutnya sesuai alur PRD.',
  backTo = '/',
  backLabel = 'Kembali ke Beranda',
}) => {
  return (
    <div className="py-20 sm:py-28 min-h-[60vh] flex items-center">
      <Container size="narrow">
        <div className="bg-white rounded-3xl border border-[#E8E8ED] p-8 sm:p-12 text-center shadow-none">
          <div className="w-12 h-12 rounded-full bg-[#EBF4EE] text-[#2E7D4F] flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-6 h-6" />
          </div>

          <span className="text-xs font-semibold uppercase tracking-wider text-[#2E7D4F] block mb-2">
            {category}
          </span>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1D1D1F] mb-4">
            {title}
          </h1>

          <div className="inline-block px-3 py-1 rounded-full bg-[#F5F5F7] text-xs font-medium text-[#6E6E73] mb-6">
            Segera hadir di langkah berikutnya
          </div>

          <p className="text-sm sm:text-base text-[#6E6E73] max-w-lg mx-auto leading-relaxed mb-8">
            {description}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button to={backTo} variant="primary" size="md" icon={<ArrowLeft className="w-4 h-4" />}>
              {backLabel}
            </Button>
            <Button to="/" variant="secondary" size="md" icon={<Compass className="w-4 h-4" />}>
              Lihat Design System
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
};
