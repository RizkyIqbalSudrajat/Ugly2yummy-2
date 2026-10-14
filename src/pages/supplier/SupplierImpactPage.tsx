import React from 'react';
import { Link } from 'react-router-dom';
import { useSupplierAuth } from '../../context/SupplierAuthContext';
import { SmartImage } from '../../components/ui/SmartImage';
import { PRODUCTS } from '../../data/dummy';
import {
  Leaf,
  Sprout,
  Sparkles,
  TrendingUp,
  PackageCheck,
  Utensils,
  CloudSun,
  ArrowUpRight,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

export const SupplierImpactPage: React.FC = () => {
  const { supplier } = useSupplierAuth();

  // Data 6 bulan terakhir (kg)
  const monthlyData = [
    { month: 'Mei', fullMonth: 'Mei 2026', kg: 140, heightPercent: 44 },
    { month: 'Jun', fullMonth: 'Juni 2026', kg: 180, heightPercent: 56 },
    { month: 'Jul', fullMonth: 'Juli 2026', kg: 210, heightPercent: 66 },
    { month: 'Agu', fullMonth: 'Agustus 2026', kg: 260, heightPercent: 81 },
    { month: 'Sep', fullMonth: 'September 2026', kg: 320, heightPercent: 100 },
    { month: 'Okt', fullMonth: 'Oktober 2026', kg: 130, heightPercent: 41, isCurrent: true },
  ];

  // Data rincian per bahan
  const commodityImpact = [
    {
      nama: 'Tomat Bengkok',
      kg: 520,
      percent: 42,
      emoji: '🍅',
      keterangan: 'Diolah menjadi saus artisan & sambal roasted',
    },
    {
      nama: 'Ubi Jalar Melengkung',
      kg: 340,
      percent: 27,
      emoji: '🍠',
      keterangan: 'Diolah menjadi camilan madu panggang',
    },
    {
      nama: 'Wortel Bercabang',
      kg: 210,
      percent: 17,
      emoji: '🥕',
      keterangan: 'Diolah menjadi keripik sayur renyah',
    },
    {
      nama: 'Stroberi Mungil & Penyok',
      kg: 170,
      percent: 14,
      emoji: '🍓',
      keterangan: 'Diolah menjadi selai stroberi murni',
    },
  ];

  // Produk toko terkait yang diolah dari bahan supplier ini
  const relatedProductIds = [
    'saus-tomat-panggang',
    'sambal-tomat-roasted',
    'keripik-wortel-panggang',
    'selai-stroberi-ciwidey',
  ];

  const relatedProducts = PRODUCTS.filter((p) => relatedProductIds.includes(p.id));

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-200">
      {/* =====================================================================
          HEADER HALAMAN
          ===================================================================== */}
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#EBF4EE] text-[#2E7D4F] border border-[#2E7D4F]/20">
            {supplier?.kelompokTani || 'Kelompok Tani Sukamaju'}
          </span>
          <span className="text-xs text-[#6E6E73]">· Lembang, Jawa Barat</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1D1D1F]">
          Dampak Penyelamatan Pangan
        </h1>
        <p className="mt-1 text-sm text-[#6E6E73]">
          Laporan kontribusi nyata kebun Anda dalam mengurangi susut pangan (food loss) dan menurunkan jejak karbon.
        </p>
      </div>

      {/* =====================================================================
          1. ANGKA BESAR "1.240 kg BAHAN TERSELAMATKAN" SEBAGAI FOKUS UTAMA
          ===================================================================== */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#1D1D1F] via-[#141414] to-[#253B2D] p-8 sm:p-12 text-white border border-[#E8E8ED]/30 shadow-none">
        <div className="max-w-2xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-medium border border-white/20">
            <Sprout className="w-3.5 h-3.5 text-[#8FE3AC]" />
            <span>Akumulasi Kemitraan Berkelanjutan</span>
          </div>

          <div className="space-y-1">
            <div className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white flex items-baseline gap-3">
              <span>1.240</span>
              <span className="text-2xl sm:text-3xl font-bold text-[#8FE3AC]">kg</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Bahan Pangan Unik Berhasil Diselamatkan
            </h2>
          </div>

          <p className="text-sm text-white/80 leading-relaxed">
            Dari kebun perbukitan Lembang bersama Pak Asep & Kelompok Tani Sukamaju, setiap kilogram hasil panen yang awalnya terancam terbuang kini telah dihargai secara adil dan diserap menjadi sajian artisan lezat bagi ribuan konsumen.
          </p>
        </div>

        {/* Subtle Decorative Graphic */}
        <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-64 h-64 rounded-full bg-[#2E7D4F]/20 blur-3xl pointer-events-none" />
      </div>

      {/* =====================================================================
          2. TIGA STATISTIK KECIL (DENGAN KETERANGAN "ESTIMASI")
          ===================================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Stat 1: Penawaran Selesai */}
        <div className="bg-white rounded-3xl border border-[#E8E8ED] p-6 shadow-none">
          <div className="w-9 h-9 rounded-2xl bg-[#EBF4EE] text-[#2E7D4F] flex items-center justify-center mb-3 border border-[#2E7D4F]/20">
            <PackageCheck className="w-5 h-5" />
          </div>
          <div className="text-3xl font-bold tracking-tight text-[#1D1D1F]">
            14
          </div>
          <p className="text-sm font-semibold text-[#1D1D1F] mt-1">
            Penawaran Panen Selesai
          </p>
          <p className="text-[11px] text-[#6E6E73] mt-0.5">
            Terserap penuh & lunas dibayarkan
          </p>
        </div>

        {/* Stat 2: Estimasi CO2e Dicegah */}
        <div className="bg-white rounded-3xl border border-[#E8E8ED] p-6 shadow-none">
          <div className="w-9 h-9 rounded-2xl bg-[#EBF4EE] text-[#2E7D4F] flex items-center justify-center mb-3 border border-[#2E7D4F]/20">
            <CloudSun className="w-5 h-5" />
          </div>
          <div className="text-3xl font-bold tracking-tight text-[#1D1D1F]">
            3.100 <span className="text-base font-semibold text-[#6E6E73]">kg CO₂e</span>
          </div>
          <p className="text-sm font-semibold text-[#1D1D1F] mt-1">
            Reduksi Jejak Emisi Gas Rumah Kaca
          </p>
          <p className="text-[11px] text-[#6E6E73] mt-0.5">
            *Estimasi pencegahan pembusukan di TPA
          </p>
        </div>

        {/* Stat 3: Estimasi Porsi Makanan */}
        <div className="bg-white rounded-3xl border border-[#E8E8ED] p-6 shadow-none">
          <div className="w-9 h-9 rounded-2xl bg-[#EBF4EE] text-[#2E7D4F] flex items-center justify-center mb-3 border border-[#2E7D4F]/20">
            <Utensils className="w-5 h-5" />
          </div>
          <div className="text-3xl font-bold tracking-tight text-[#1D1D1F]">
            3.720 <span className="text-base font-semibold text-[#6E6E73]">porsi</span>
          </div>
          <p className="text-sm font-semibold text-[#1D1D1F] mt-1">
            Santapan Lezat Dihasilkan
          </p>
          <p className="text-[11px] text-[#6E6E73] mt-0.5">
            *Estimasi porsi sajian dari 1.240 kg bahan
          </p>
        </div>
      </div>

      {/* =====================================================================
          3. DIAGRAM BATANG SEDERHANA KG PER BULAN (6 BULAN TERAKHIR)
             MURNI DIBUAT DENGAN DIV & TAILWIND (TANPA LIBRARY CHART)
          ===================================================================== */}
      <div className="bg-white rounded-3xl border border-[#E8E8ED] p-6 sm:p-8 shadow-none space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E8E8ED]/60 pb-3">
          <div>
            <h3 className="text-base font-bold text-[#1D1D1F]">
              Tren Volume Penyerapan (6 Bulan Terakhir)
            </h3>
            <p className="text-xs text-[#6E6E73]">
              Jumlah kilogram bahan pangan unik yang diserap per bulan.
            </p>
          </div>
          <span className="text-xs font-semibold text-[#2E7D4F] bg-[#EBF4EE] px-3 py-1 rounded-full border border-[#2E7D4F]/20 w-fit">
            Puncak: September (320 kg)
          </span>
        </div>

        {/* Chart Area */}
        <div className="pt-4 pb-2">
          <div className="h-48 sm:h-56 flex items-end justify-between gap-2 sm:gap-6 border-b border-[#E8E8ED] pb-2">
            {monthlyData.map((item) => (
              <div
                key={item.month}
                className="flex-1 flex flex-col items-center justify-end h-full group relative"
              >
                {/* Nilai kg di atas bar */}
                <span className="text-[11px] sm:text-xs font-bold text-[#1D1D1F] mb-1.5 transition-transform group-hover:scale-110">
                  {item.kg} <span className="text-[9px] font-normal text-[#6E6E73]">kg</span>
                </span>

                {/* Bar Div */}
                <div
                  style={{ height: `${item.heightPercent}%` }}
                  className={`w-full max-w-[48px] rounded-t-xl transition-all duration-300 relative ${
                    item.isCurrent
                      ? 'bg-[#2E7D4F] ring-2 ring-[#2E7D4F]/30'
                      : 'bg-gradient-to-t from-[#2E7D4F]/80 to-[#4ADE80]/80 hover:from-[#2E7D4F] hover:to-[#4ADE80]'
                  }`}
                >
                  {/* Subtle highlight inner shine */}
                  <div className="absolute inset-x-0 top-0 h-1 bg-white/40 rounded-t-xl" />
                </div>

                {/* Nama Bulan */}
                <span
                  className={`text-xs mt-3 font-semibold ${
                    item.isCurrent ? 'text-[#2E7D4F]' : 'text-[#6E6E73]'
                  }`}
                >
                  {item.month}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#6E6E73] pt-3">
            <span>Mei 2026 (Awal Kemitraan)</span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2E7D4F]" />
              <span>Bulan Berjalan (Oktober 2026)</span>
            </span>
          </div>
        </div>
      </div>

      {/* =====================================================================
          4. DAFTAR PER BAHAN DENGAN PROGRESS BAR
          ===================================================================== */}
      <div className="bg-white rounded-3xl border border-[#E8E8ED] p-6 sm:p-8 shadow-none space-y-6">
        <div>
          <h3 className="text-base font-bold text-[#1D1D1F]">
            Distribusi Komoditas Bahan Terselamatkan
          </h3>
          <p className="text-xs text-[#6E6E73]">
            Rincian volume penyerapan berdasarkan jenis tanaman kebun Sukamaju.
          </p>
        </div>

        <div className="space-y-5">
          {commodityImpact.map((item) => (
            <div key={item.nama} className="space-y-2">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-base">{item.emoji}</span>
                  <span className="font-bold text-[#1D1D1F]">{item.nama}</span>
                  <span className="hidden sm:inline text-xs text-[#6E6E73]">
                    · {item.keterangan}
                  </span>
                </div>
                <div className="text-right font-bold text-[#1D1D1F]">
                  <span>{item.kg} kg</span>
                  <span className="text-xs font-semibold text-[#2E7D4F] ml-1.5">
                    ({item.percent}%)
                  </span>
                </div>
              </div>

              {/* Progress Bar Div */}
              <div className="w-full h-2.5 bg-[#F5F5F7] rounded-full overflow-hidden border border-[#E8E8ED]">
                <div
                  style={{ width: `${item.percent}%` }}
                  className="h-full bg-gradient-to-r from-[#2E7D4F] to-[#4ADE80] rounded-full transition-all duration-500"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* =====================================================================
          5. KARTU "DIOLAH MENJADI": PRODUK UGLY2YUMMY YANG MEMAKAI BAHAN INI
             LENGKAP DENGAN LINK KE DETAIL PRODUK DI TOKO
          ===================================================================== */}
      <div className="bg-white rounded-3xl border border-[#E8E8ED] p-6 sm:p-8 shadow-none space-y-6">
        <div className="flex items-center justify-between pb-2 border-b border-[#E8E8ED]/60">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-[#2E7D4F]" />
              <h3 className="text-base font-bold text-[#1D1D1F]">
                Diolah Menjadi Produk Artisan
              </h3>
            </div>
            <p className="text-xs text-[#6E6E73]">
              Dari kebun Anda, berikut olahan berkualitas tinggi yang kini dinikmati konsumen di katalog Ugly2Yummy.
            </p>
          </div>
          <Link
            to="/produk"
            className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-[#2E7D4F] hover:underline"
          >
            <span>Katalog Toko</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Grid Produk Olahan */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {relatedProducts.map((prod) => (
            <div
              key={prod.id}
              className="group bg-[#FBFBFD] rounded-2xl border border-[#E8E8ED] p-3.5 flex flex-col justify-between hover:border-[#2E7D4F]/40 transition-all hover:bg-white shadow-none"
            >
              <div className="space-y-3">
                {/* Thumbnail Gambar Produk */}
                <div className="w-full aspect-square rounded-xl overflow-hidden bg-white border border-[#E8E8ED] relative">
                  <SmartImage
                    src={prod.gambar}
                    alt={prod.nama}
                    fallbackEmoji={prod.gambarEmojiFallback}
                    aspectRatio="1:1"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-2 left-2 text-[10px] font-semibold bg-white/90 backdrop-blur-xs text-[#1D1D1F] px-2 py-0.5 rounded-full border border-[#E8E8ED]/60">
                    {prod.kategori}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-[#1D1D1F] group-hover:text-[#2E7D4F] transition-colors line-clamp-1">
                    {prod.nama}
                  </h4>
                  <p className="text-[11px] text-[#6E6E73] mt-0.5 line-clamp-1">
                    {prod.bahanUtama}
                  </p>
                </div>
              </div>

              {/* Link ke Detail Produk Toko */}
              <div className="pt-3 border-t border-[#E8E8ED]/60 mt-3 flex items-center justify-between">
                <span className="text-xs font-bold text-[#1D1D1F]">
                  Rp {prod.harga.toLocaleString('id-ID')}
                </span>
                <Link
                  to={`/produk/${prod.id}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#2E7D4F] group-hover:underline"
                >
                  <span>Lihat Produk</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
