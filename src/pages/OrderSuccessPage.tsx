import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth, GuestInfo } from '../context/AuthContext';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';
import {
  Check,
  Sparkles,
  Package,
  ShoppingBag,
  Clock,
  MapPin,
  HeartHandshake,
  User,
  ArrowRight,
} from 'lucide-react';

interface OrderState {
  orderNumber?: string;
  items?: Array<{
    id: string;
    nama: string;
    harga: number;
    jumlah: number;
    estimasiKgTerselamatkan?: number;
    ukuran?: string;
  }>;
  grandTotal?: number;
  guestInfo?: GuestInfo | null;
  isGuest?: boolean;
  shippingMethod?: string;
  paymentMethod?: string;
}

export const OrderSuccessPage: React.FC = () => {
  const { user, guestInfo: contextGuestInfo, isGuest: contextIsGuest, isLoggedIn } = useAuth();
  const location = useLocation();
  const state = (location.state as OrderState) || null;

  const isGuestBuyer = Boolean(state?.isGuest || contextIsGuest || (!isLoggedIn && (state?.guestInfo || contextGuestInfo)));
  const guestData = state?.guestInfo || contextGuestInfo;

  // Nama pembeli
  const displayName = isGuestBuyer
    ? guestData?.namaLengkap ? guestData.namaLengkap.split(' ')[0] : 'Sahabat Baik'
    : user ? user.nama.split(' ')[0] : 'Nadia';

  const orderNumber = state?.orderNumber || 'ORD-2026-0142';
  const orderItems = state?.items || [
    {
      id: 'default-1',
      nama: 'Selai Mangga Mungil',
      harga: 38000,
      jumlah: 1,
      estimasiKgTerselamatkan: 0.5,
    },
  ];

  const totalKg = orderItems.reduce(
    (acc, it) => acc + (it.estimasiKgTerselamatkan || 0.4) * it.jumlah,
    0
  );

  return (
    <div className="py-14 sm:py-24">
      <Container size="narrow">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="bg-white rounded-3xl sm:rounded-[36px] border border-[#E8E8ED] p-6 sm:p-12 text-center shadow-none max-w-xl mx-auto space-y-7"
        >
          {/* Ikon Centang Besar dengan Animasi */}
          <div className="relative mx-auto w-18 h-18 sm:w-22 sm:h-22">
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
                <Check className="w-9 h-9 sm:w-11 sm:h-11 stroke-[2.5]" />
              </motion.div>
            </motion.div>
          </div>

          {/* Judul & Nomor Pesanan */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#2E7D4F] block">
              Pembayaran Berhasil (Simulasi)
            </span>
            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#1D1D1F]">
              Terima kasih, {displayName}!
            </h1>
            <p className="text-xs sm:text-sm text-[#6E6E73]">
              Nomor Pesanan:{' '}
              <strong className="font-mono text-[#1D1D1F] font-bold text-sm sm:text-base">
                {orderNumber}
              </strong>
            </p>
          </div>

          {/* Pesan Dampak Nyata */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#EBF4EE] border border-[#2E7D4F]/25 text-left space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-[#2E7D4F]">
              <Sparkles className="w-4 h-4 text-[#2E7D4F]" />
              <span>Dampak Pangan Anda Bertambah!</span>
            </div>
            <p className="text-xs sm:text-sm text-[#1D1D1F] leading-relaxed">
              Dengan pesanan ini, Anda telah menyelamatkan{' '}
              <strong className="font-bold text-[#2E7D4F]">
                {totalKg > 0 ? totalKg.toFixed(1) : '1,3'} kg
              </strong>{' '}
              buah &amp; sayur unik dari potensi limbah pangan, sekaligus mendukung kesejahteraan petani mitra lokal.
            </p>
          </div>

          {/* Ringkasan Item Pesanan */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#FBFBFD] border border-[#E8E8ED] text-left space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-[#1D1D1F] pb-2 border-b border-[#E8E8ED]">
              <span>Ringkasan Item</span>
              <span className="text-[#6E6E73] font-normal">
                {orderItems.reduce((acc, it) => acc + it.jumlah, 0)} produk
              </span>
            </div>

            <div className="space-y-2 text-xs">
              {orderItems.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-semibold text-[#1D1D1F] shrink-0">
                      {item.jumlah}x
                    </span>
                    <span className="text-[#6E6E73] truncate">
                      {item.nama}
                    </span>
                  </div>
                  <span className="font-semibold text-[#1D1D1F] tabular-nums shrink-0">
                    Rp{(item.harga * item.jumlah).toLocaleString('id-ID')}
                  </span>
                </div>
              ))}
            </div>

            {state?.grandTotal && (
              <div className="pt-2 border-t border-[#E8E8ED] flex items-center justify-between text-xs font-bold text-[#1D1D1F]">
                <span>Total Pesanan</span>
                <span className="tabular-nums text-sm text-[#2E7D4F]">
                  Rp{state.grandTotal.toLocaleString('id-ID')}
                </span>
              </div>
            )}
          </div>

          {/* Alamat Pengiriman & Detail Kurir */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#F5F5F7] border border-[#E8E8ED] text-xs text-[#6E6E73] space-y-2.5 text-left">
            <div className="flex items-start justify-between gap-3">
              <span className="flex items-center gap-1.5 shrink-0 text-[#1D1D1F] font-semibold">
                <MapPin className="w-3.5 h-3.5 text-[#2E7D4F]" />
                Alamat Kirim:
              </span>
              <div className="text-right text-[#1D1D1F] text-xs">
                {isGuestBuyer && guestData ? (
                  <>
                    <p className="font-bold">{guestData.namaLengkap} ({guestData.nomorWhatsapp})</p>
                    <p className="text-[#6E6E73] mt-0.5 leading-relaxed">
                      {guestData.alamatLengkap}, Kel. {guestData.kelurahanDesa}, Kec. {guestData.kecamatan}, {guestData.kotaKabupaten}, {guestData.provinsi} {guestData.kodePos}
                    </p>
                    {guestData.patokan && (
                      <p className="text-[11px] text-[#8E8E93] italic">
                        Patokan: {guestData.patokan}
                      </p>
                    )}
                  </>
                ) : (
                  <>
                    <p className="font-bold">Nadia Putri (+62 812-3456-7890)</p>
                    <p className="text-[#6E6E73] mt-0.5 leading-relaxed">
                      Jl. Gandaria Tengah II No. 14, RT 05 / RW 03, Kebayoran Baru, Jakarta Selatan 12130
                    </p>
                  </>
                )}
              </div>
            </div>

            <div className="pt-2 border-t border-[#E8E8ED] flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#2E7D4F]" />
                Estimasi Pengiriman:
              </span>
              <span className="font-bold text-[#1D1D1F]">
                {state?.shippingMethod === 'instan' ? 'Hari Ini (3–4 Jam, Instan)' : '2–3 Hari Kerja (Reguler)'}
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

          {/* Tombol Aksi: Untuk Tamu vs User */}
          {isGuestBuyer ? (
            /* AKSI UNTUK TAMU */
            <div className="space-y-4 pt-2">
              <Button
                to="/produk"
                variant="primary"
                size="lg"
                fullWidth
                icon={<ShoppingBag className="w-4 h-4" />}
                className="bg-[#2E7D4F] hover:bg-[#256640] text-white font-semibold"
              >
                Belanja Lagi
              </Button>

              {/* Ajakan kecil: Mau checkout lebih cepat lain kali? Buat akun */}
              <p className="text-xs text-[#6E6E73]">
                Mau checkout lebih cepat lain kali?{' '}
                <Link
                  to="/daftar"
                  className="font-bold text-[#2E7D4F] hover:text-[#256640] underline underline-offset-2"
                >
                  Buat akun
                </Link>
              </p>
            </div>
          ) : (
            /* AKSI UNTUK PENGGUNA TERDAFTAR */
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                to="/pesanan-saya"
                variant="primary"
                size="lg"
                icon={<Package className="w-4 h-4" />}
                className="bg-[#2E7D4F] hover:bg-[#256640] text-white"
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
          )}
        </motion.div>
      </Container>
    </div>
  );
};
