import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Compass } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const { isLoggedIn } = useAuth();

  return (
    <div className="py-20 sm:py-32">
      <Container size="narrow">
        <div className="bg-white rounded-3xl sm:rounded-[36px] border border-[#E8E8ED] p-10 sm:p-16 text-center max-w-lg mx-auto shadow-none space-y-6">
          <div className="w-16 h-16 rounded-full bg-[#F5F5F7] text-[#2E7D4F] flex items-center justify-center mx-auto">
            <Compass className="w-8 h-8 stroke-[1.5]" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#2E7D4F] block">
              Halaman Tidak Ditemukan
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1D1D1F]">
              404
            </h1>
            <p className="text-sm sm:text-base text-[#6E6E73] leading-relaxed">
              Maaf, halaman yang Anda cari mungkin telah dipindahkan atau belum tersedia.
            </p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              to={isLoggedIn ? '/beranda' : '/'}
              variant="primary"
              size="md"
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
            >
              {isLoggedIn ? 'Kembali ke Beranda' : 'Ke Halaman Utama'}
            </Button>
            <Button to="/produk" variant="secondary" size="md">
              Katalog Produk
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
};
