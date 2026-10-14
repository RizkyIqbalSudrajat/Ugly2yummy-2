import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';
import {
  Check,
  Sparkles,
  Package,
  ShoppingBag,
  ArrowRight,
  Clock,
  MapPin,
  HeartHandshake,
} from 'lucide-react';

export const OrderSuccessPage: React.FC = () => {
  const { user } = useAuth();
  const userName = user ? user.nama.split(' ')[0] : 'Nadia';
  const orderNumber = '#UY-2026-94812';

  return (
    <div className="py-14 sm:py-24">
      <Container size="narrow">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="bg-white rounded-3xl sm:rounded-[36px] border border-[#E8E8ED] p-8 sm:p-14 text-center shadow-none max-w-xl mx-auto space-y-8"
        >
          {/* Ikon Centang Besar dengan Animasi Halus */}
          <div className="relative mx-auto w-20 h-20 sm:w-24 sm:h-24">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: 'spring',
                stiffness: 260,
                damping: 20,
                delay: 0.1,
              }}
              className="w-full h-full rounded-full bg-[#EBF4EE] border-4 border-[#2E7D4F]/20 flex items-center justify-center text-[#2E7D4F] shadow-none"
            >
              <motion.div
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <Check className="w-10 h-10 sm:w-12 sm:h-12 stroke-[2.5]" />
              </motion.div>
            </motion.div>
          </div>

          {/* Judul & Nomor Pesanan */}
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#2E7D4F] block">
              Pembayaran Berhasil (Simulasi)
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1D1D1F]">
              Terima kasih, {userName}!
            </h1>
            <p className="text-xs sm:text-sm text-[#6E6E73]">
              Nomor Pesanan:{' '}
              <strong className="font-mono text-[#1D1D1F] font-bold">
                {orderNumber}
              </strong>
            </p>
          </div>

          {/* Pesan Dampak Nyata */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#EBF4EE] border border-[#2E7D4F]/25 text-left space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#2E7D4F]">
              <Sparkles className="w-4 h-4 text-[#2E7D4F]" />
              <span>Dampak Pangan Anda Bertambah!</span>
            </div>
            <p className="text-xs sm:text-sm text-[#1D1D1F] leading-relaxed">
              Dengan pesanan ini, Anda telah menyelamatkan{' '}
              <strong className="font-bold text-[#2E7D4F]">1,3 kg</strong> buah & sayur unik dari
              potensi limbah pangan, sekaligus mendukung kesejahteraan petani mitra di Indramayu
              dan Wonosobo.
            </p>
          </div>

          {/* Ringkasan Singkat Pesanan */}
          <div className="p-4 rounded-2xl bg-[#F5F5F7] border border-[#E8E8ED] text-xs text-[#6E6E73] space-y-2 text-left">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#2E7D4F]" />
                Estimasi Pengiriman:
              </span>
              <span className="font-bold text-[#1D1D1F]">2–3 Hari Kerja (Reguler)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#2E7D4F]" />
                Tujuan Pengiriman:
              </span>
              <span className="font-bold text-[#1D1D1F] truncate max-w-[200px]">
                Kebayoran Baru, Jakarta Selatan
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <HeartHandshake className="w-3.5 h-3.5 text-[#2E7D4F]" />
                Kemasan:
              </span>
              <span className="font-bold text-[#1D1D1F]">Zero-Plastic Eco Box</span>
            </div>
          </div>

          {/* Tombol Aksi: Lihat Pesanan & Belanja Lagi */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              to="/pesanan-saya"
              variant="primary"
              size="lg"
              icon={<Package className="w-4 h-4" />}
            >
              Lihat Pesanan
            </Button>
            <Button
              to="/produk"
              variant="secondary"
              size="lg"
              icon={<ShoppingBag className="w-4 h-4" />}
            >
              Belanja Lagi
            </Button>
          </div>
        </motion.div>
      </Container>
    </div>
  );
};
