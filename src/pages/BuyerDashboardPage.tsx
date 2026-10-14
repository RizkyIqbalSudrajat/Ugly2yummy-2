import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Container } from '../components/ui/Container';
import { SmartImage } from '../components/ui/SmartImage';
import { PRODUCTS, INGREDIENTS } from '../data/dummy';
import {
  Sparkles,
  ArrowRight,
  Truck,
  Package,
  MapPin,
  Leaf,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';

export const BuyerDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const userName = user ? user.nama.split(' ')[0] : 'Nadia';
  const savedKg = user ? user.dampak.totalKgTerselamatkan : 3.2;

  // 4 recommended products
  const recommendedProducts = [
    PRODUCTS[0], // Saus Tomat Panggang
    PRODUCTS[3], // Banana Bread Pisang Bintik
    PRODUCTS[4], // Selai Mangga Mungil
    PRODUCTS[2], // Keripik Wortel Panggang
  ];

  // Origin helper
  const getProductOrigin = (ingredientId: string, bahanUtama: string) => {
    if (bahanUtama === 'Mangga + Pisang') return 'Indramayu & Lampung';
    const ing = INGREDIENTS.find((i) => i.id === ingredientId);
    if (!ing) return 'Jawa Barat';
    return ing.asal.split(',')[0].trim();
  };

  return (
    <div className="py-10 sm:py-16 md:py-20 space-y-16 sm:space-y-20">
      <Container>
        {/* =========================================================================
            1. SAPAAN BESAR & SATU KALIMAT PENDEK
            ========================================================================= */}
        <div className="max-w-3xl mb-8 sm:mb-12">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#2E7D4F] block mb-2">
            Beranda Pembeli
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#1D1D1F]">
            Halo, {userName} 👋
          </h1>
          <p className="mt-3 text-base sm:text-lg text-[#6E6E73] leading-relaxed">
            Selamat datang kembali di dapur kebaikan Ugly2Yummy.
          </p>
        </div>

        {/* =========================================================================
            2. KARTU RINGKASAN DAMPAK
            "Kamu sudah menyelamatkan 3,2 kg pangan" dengan link ke Dampak Saya
            ========================================================================= */}
        <div className="bg-[#EBF4EE] rounded-3xl border border-[#2E7D4F]/20 p-6 sm:p-10 shadow-xs mb-14 sm:mb-18">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 backdrop-blur-sm text-[#2E7D4F] text-xs font-semibold">
                <Leaf className="w-3.5 h-3.5" />
                <span>Pencapaian Berkelanjutan Anda</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1D1D1F] tracking-tight">
                Kamu sudah menyelamatkan{' '}
                <span className="text-[#2E7D4F]">{savedKg.toLocaleString('id-ID')} kg</span>{' '}
                pangan
              </h2>

              <p className="text-xs sm:text-sm text-[#1D1D1F]/75 leading-relaxed">
                Melalui 4 pesanan lezatmu, kamu telah mendukung 5 keluarga petani lokal dan
                mencegah sekitar 8 kg emisi CO₂e ke atmosfer.
              </p>
            </div>

            <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link
                to="/dampak-saya"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#2E7D4F] hover:bg-[#256640] text-white text-sm font-semibold transition-all duration-200 shadow-none whitespace-nowrap"
              >
                <span>Lihat Rincian Dampak Saya</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* =========================================================================
            3. PESANAN AKTIF (SATU KARTU PESANAN BERSTATUS "DIKIRIM")
            ========================================================================= */}
        <div className="mb-14 sm:mb-20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg sm:text-xl font-bold text-[#1D1D1F]">
              Pesanan Aktif
            </h3>
            <Link
              to="/pesanan-saya"
              className="text-xs font-semibold text-[#2E7D4F] hover:underline flex items-center gap-1"
            >
              <span>Semua Pesanan</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-white rounded-3xl border border-[#E8E8ED] p-6 sm:p-7 shadow-none">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#E8E8ED]/70">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#EBF4EE] text-[#2E7D4F] flex items-center justify-center shrink-0">
                  <Truck className="w-6 h-6 stroke-[1.7]" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-[#1D1D1F]">
                      Pesanan #UY-8241
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#EBF4EE] text-[#2E7D4F] text-[11px] font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D4F] animate-pulse" />
                      Dikirim
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#1D1D1F] font-medium">
                    2x Saus Tomat Panggang (250 ml), 1x Banana Bread Pisang Bintik (500 g)
                  </p>
                  <p className="text-xs text-[#6E6E73] mt-0.5">
                    Estimasi tiba: Hari ini, 15:00 - 18:00 WIB · Kurir Ramah Lingkungan
                  </p>
                </div>
              </div>

              <div className="text-left md:text-right shrink-0">
                <span className="text-xs text-[#6E6E73] block">Total Pembayaran</span>
                <span className="text-lg font-bold text-[#1D1D1F] tabular-nums">
                  Rp125.000
                </span>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#6E6E73]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#2E7D4F]" />
                <span>Pangan terselamatkan di pesanan ini: 1,6 kg</span>
              </div>

              <Link
                to="/pesanan-saya"
                className="font-semibold text-[#2E7D4F] hover:text-[#256640] flex items-center gap-1"
              >
                <span>Lihat di Pesanan Saya</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* =========================================================================
            4. BAHAN YANG DISELAMATKAN MINGGU INI (DERETAN HORIZONTAL BISA DIGESER)
            ========================================================================= */}
        <div className="mb-16 sm:mb-24">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#2E7D4F] block mb-1">
                Laporan Mingguan
              </span>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1D1D1F]">
                Bahan yang Diselamatkan Minggu Ini
              </h3>
            </div>
            <Link
              to="/cerita-bahan"
              className="text-xs font-semibold text-[#2E7D4F] hover:underline flex items-center gap-1"
            >
              <span>Lihat Semua Bahan</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Horizontal Scrollable Row */}
          <div className="flex gap-5 overflow-x-auto pb-4 pt-1 no-scrollbar snap-x snap-mandatory">
            {INGREDIENTS.map((ingredient) => (
              <div
                key={ingredient.id}
                onClick={() => navigate(`/cerita-bahan/${ingredient.id}`)}
                className="group shrink-0 w-[260px] sm:w-[280px] bg-white rounded-3xl border border-[#E8E8ED] p-4 flex flex-col justify-between shadow-none hover:shadow-xs hover:-translate-y-0.5 transition-all duration-300 cursor-pointer snap-start"
              >
                <div>
                  <div className="relative rounded-2xl overflow-hidden bg-[#F5F5F7] mb-3.5 aspect-[4/3]">
                    <SmartImage
                      src={ingredient.gambar}
                      alt={ingredient.altText || ingredient.nama}
                      fallbackEmoji={ingredient.emoji}
                      aspectRatio="4:3"
                      hoverZoom={true}
                      containerClassName="w-full h-full"
                    />
                    <div className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-semibold text-[#1D1D1F] flex items-center gap-1 shadow-none">
                      <span>{ingredient.emoji}</span>
                      <span>{ingredient.nama}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs text-[#6E6E73] flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#2E7D4F]" />
                      <span>{ingredient.asal.split(',')[0]}</span>
                    </p>
                    <p className="text-xs font-medium text-[#1D1D1F] line-clamp-2 leading-relaxed">
                      {ingredient.alasanUgly}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#E8E8ED]/70 flex items-center justify-between text-xs">
                  <span className="text-[#6E6E73]">Terselamatkan:</span>
                  <span className="font-bold text-[#2E7D4F]">
                    {ingredient.totalKgTerselamatkan.toLocaleString('id-ID')} kg
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* =========================================================================
            5. REKOMENDASI UNTUKMU (4 KARTU PRODUK)
            ========================================================================= */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#2E7D4F] block mb-1">
                Pilihan Khusus
              </span>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1D1D1F]">
                Rekomendasi untukmu
              </h3>
            </div>
            <Link
              to="/produk"
              className="text-xs font-semibold text-[#2E7D4F] hover:underline flex items-center gap-1"
            >
              <span>Buka Katalog Lengkap</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* 4 Kartu Produk Grid: 4 di desktop/tablet, responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendedProducts.map((product) => {
              const origin = getProductOrigin(product.ingredientId, product.bahanUtama);
              const formattedPrice = new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                maximumFractionDigits: 0,
              }).format(product.harga);

              return (
                <div
                  key={product.id}
                  onClick={() => navigate(`/produk/${product.id}`)}
                  className="group bg-white rounded-3xl border border-[#E8E8ED] overflow-hidden flex flex-col justify-between shadow-none hover:shadow-xs hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
                >
                  <div className="relative w-full overflow-hidden bg-[#F5F5F7]">
                    <SmartImage
                      src={product.gambar}
                      alt={product.nama}
                      fallbackEmoji={product.gambarEmojiFallback}
                      aspectRatio="4:5"
                      hoverZoom={true}
                      containerClassName="w-full"
                    />

                    <div className="absolute top-3 left-3 z-10">
                      <span className="inline-flex items-center gap-1 bg-white/95 backdrop-blur-md text-[#2E7D4F] text-[10px] font-bold px-2.5 py-1 rounded-full shadow-none border border-[#2E7D4F]/15">
                        <Sparkles className="w-2.5 h-2.5 text-[#2E7D4F]" />
                        <span>{product.estimasiKgTerselamatkan} kg selamat</span>
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-[11px] text-[#6E6E73] font-medium mb-1">
                        Dari {product.bahanUtama} · {origin}
                      </p>
                      <h4 className="text-base font-bold text-[#1D1D1F] group-hover:text-[#2E7D4F] transition-colors line-clamp-1">
                        {product.nama}
                      </h4>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#E8E8ED]/70 flex items-center justify-between">
                      <span className="text-sm font-bold text-[#1D1D1F] tabular-nums">
                        {formattedPrice}
                      </span>
                      <span className="text-xs font-semibold text-[#2E7D4F] group-hover:underline">
                        Detail
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </div>
  );
};
