import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStaffAuth } from '../../../context/StaffAuthContext';
import { useWorkerData } from '../../../context/WorkerDataContext';
import { useAdminData } from '../../../context/AdminDataContext';
import { SmartImage } from '../../../components/ui/SmartImage';
import { AdminStatusBadge } from '../../../components/internal/AdminStatusBadge';
import {
  Package,
  ShieldCheck,
  TrendingUp,
  ShoppingCart,
  AlertTriangle,
  ArrowRight,
  Calendar,
  ChevronRight,
  Clock,
  Truck,
  CheckCircle2,
  Sparkles,
  Layers,
  FileText,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

interface DailyChartData {
  tanggalLabel: string;
  hariLabel: string;
  penjualanRp: number;
  bahanMasukKg: number;
  highlight?: boolean;
}

const SEVEN_DAYS_DATA: DailyChartData[] = [
  { tanggalLabel: '08 Okt', hariLabel: 'Kam', penjualanRp: 2150000, bahanMasukKg: 90 },
  { tanggalLabel: '09 Okt', hariLabel: 'Jum', penjualanRp: 1850000, bahanMasukKg: 110 },
  { tanggalLabel: '10 Okt', hariLabel: 'Sab', penjualanRp: 2650000, bahanMasukKg: 85 },
  { tanggalLabel: '11 Okt', hariLabel: 'Min', penjualanRp: 3100000, bahanMasukKg: 140 },
  { tanggalLabel: '12 Okt', hariLabel: 'Sen', penjualanRp: 2400000, bahanMasukKg: 120 },
  { tanggalLabel: '13 Okt', hariLabel: 'Sel', penjualanRp: 3450000, bahanMasukKg: 95 },
  { tanggalLabel: '14 Okt', hariLabel: 'Rab (Hari ini)', penjualanRp: 2850000, bahanMasukKg: 145, highlight: true },
];

export const AdminDashboardPage: React.FC = () => {
  const { staff } = useStaffAuth();
  const { receivings, batches, materialStocks, inventory } = useWorkerData();
  const {
    offers,
    orders,
    shippings,
    products,
    pendingOffersCount,
    newOrdersCount,
  } = useAdminData();

  const navigate = useNavigate();
  const [chartTab, setChartTab] = useState<'penjualan' | 'bahan'>('penjualan');
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);

  const todayFormatted = 'Rabu, 14 Oktober 2026';

  // 1. Perhitungan Bahan Masuk & Efisiensi Seleksi (QC)
  const materialMetrics = useMemo(() => {
    const totalMasukKg = receivings.reduce((sum, r) => sum + r.beratAwal, 0);

    const evaluated = receivings.filter((r) => r.hasilSeleksi);
    const totalLayakKg = evaluated.reduce(
      (sum, r) => sum + (r.hasilSeleksi?.layak || 0),
      0
    );
    const totalKomposKg = evaluated.reduce(
      (sum, r) => sum + (r.hasilSeleksi?.dijadikanKompos || 0),
      0
    );
    const totalDibuangKg = evaluated.reduce(
      (sum, r) => sum + (r.hasilSeleksi?.dibuang || 0),
      0
    );
    const totalTerbuangKg = totalKomposKg + totalDibuangKg;
    const totalProcessed = totalLayakKg + totalTerbuangKg;

    const persentaseLayak =
      totalProcessed > 0
        ? Math.round((totalLayakKg / totalProcessed) * 1000) / 10
        : 88.5;

    return {
      totalMasukKg,
      totalLayakKg,
      totalTerbuangKg,
      persentaseLayak,
    };
  }, [receivings]);

  // 2. Pendapatan Minggu Ini & Total Transaksi
  const weeklyRevenue = useMemo(() => {
    return SEVEN_DAYS_DATA.reduce((sum, item) => sum + item.penjualanRp, 0);
  }, []);

  const totalWeeklyMaterialKg = useMemo(() => {
    return SEVEN_DAYS_DATA.reduce((sum, item) => sum + item.bahanMasukKg, 0);
  }, []);

  // 3. Stok Kritis: Bahan Baku (< 5 kg) & Produk Jadi (< 25 unit)
  const criticalMaterials = useMemo(() => {
    return materialStocks.filter((m) => m.sisaLayakKg < 5);
  }, [materialStocks]);

  const criticalProducts = useMemo(() => {
    return products.filter((p) => p.stok < 25);
  }, [products]);

  const totalCriticalStockCount = criticalMaterials.length + criticalProducts.length;

  // 4. Penawaran Supplier Terbaru (3-4 item)
  const latestOffers = useMemo(() => {
    return offers.slice(0, 4);
  }, [offers]);

  // 5. Timeline Aktivitas Operasional Terkini (Menggabungkan Worker + Admin Data)
  const operationalTimeline = useMemo(() => {
    const events: Array<{
      id: string;
      title: string;
      desc: string;
      time: string;
      type: 'penerimaan' | 'qc' | 'produksi' | 'pengiriman' | 'pesanan';
      badge?: string;
    }> = [
      {
        id: 'evt-1',
        title: 'Penerimaan Bahan Baru Tiba',
        desc: 'Tomat Bengkok (120 kg) dari Pak Asep Sunarya tiba di dapur penimbangan.',
        time: '15 menit yang lalu',
        type: 'penerimaan',
        badge: 'Gudang',
      },
      {
        id: 'evt-2',
        title: 'Seleksi QC Selesai',
        desc: 'Sortir Pisang Berbintik selesai: 100 kg layak olah, 10 kg dialihkan kompos.',
        time: '45 menit yang lalu',
        type: 'qc',
        badge: '88% Layak',
      },
      {
        id: 'evt-3',
        title: 'Batch Produksi Dikemas',
        desc: 'Batch PRD-2026-0014 Selai Stroberi selesai dikemas (50 jar siap didistribusikan).',
        time: '2 jam yang lalu',
        type: 'produksi',
        badge: 'Dapur Olahan',
      },
      {
        id: 'evt-4',
        title: 'Pesanan Dikirim Kurir',
        desc: 'Pesanan #ORD-2026-0109 untuk Tania Anindita dijemput kurir J&T Express.',
        time: '3 jam yang lalu',
        type: 'pengiriman',
        badge: 'Logistik',
      },
      {
        id: 'evt-5',
        title: 'Pesanan Baru Masuk',
        desc: 'Maya Sartika melakukan checkout Saus Tomat & Banana Bread (Rp 137.000).',
        time: '4 jam yang lalu',
        type: 'pesanan',
        badge: 'Toko Online',
      },
    ];
    return events;
  }, []);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const formatShortRupiah = (val: number) => {
    if (val >= 1000000) {
      return `Rp ${(val / 1000000).toFixed(1)} Jt`;
    }
    return `Rp ${(val / 1000).toFixed(0)} Rb`;
  };

  // Max value for 7-days chart scale
  const maxChartValue = useMemo(() => {
    if (chartTab === 'penjualan') {
      return Math.max(...SEVEN_DAYS_DATA.map((d) => d.penjualanRp)) * 1.15;
    }
    return Math.max(...SEVEN_DAYS_DATA.map((d) => d.bahanMasukKg)) * 1.2;
  }, [chartTab]);

  return (
    <div className="space-y-7 pb-12 animate-in fade-in duration-200">
      {/* 1. Header Sambutan */}
      <div className="bg-white rounded-3xl border border-[#E8E8ED] p-5 sm:p-6 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#EBF4EE] text-[#2E7D4F] border border-[#2E7D4F]/20 inline-flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#2E7D4F]" />
                Portal Operasional & Toko
              </span>
              <span className="text-xs text-[#6E6E73] flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#6E6E73]" />
                {todayFormatted}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1D1D1F]">
              Halo, {staff?.nama || 'Raka Pratama'} 👋
            </h1>

            <p className="mt-1.5 text-xs sm:text-sm text-[#6E6E73] leading-relaxed max-w-2xl">
              Toko aktif dengan <strong className="text-[#1D1D1F] font-semibold">{newOrdersCount} pesanan baru</strong> · Dapur mengolah <strong className="text-[#1D1D1F] font-semibold">{batches.length} batch produksi</strong> · <strong className="text-[#1D1D1F] font-semibold">{pendingOffersCount} penawaran supplier</strong> siap diverifikasi.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start md:self-auto shrink-0">
            <Link
              to="/internal/admin/penawaran"
              className="px-3.5 py-2 text-xs font-semibold rounded-full bg-[#F5F5F7] text-[#1D1D1F] hover:bg-[#E8E8ED] transition-colors border border-[#E8E8ED] cursor-pointer inline-flex items-center gap-1.5"
            >
              <span>Verifikasi Bahan</span>
              <span className="px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 text-[10px]">
                {pendingOffersCount}
              </span>
            </Link>
            <Link
              to="/internal/admin/pesanan"
              className="px-3.5 py-2 text-xs font-semibold rounded-full bg-[#2E7D4F] text-white hover:bg-[#256640] transition-colors shadow-xs cursor-pointer inline-flex items-center gap-1.5"
            >
              <span>Proses Pesanan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* 2. 4 Kartu KPI Utama */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI a: Pendapatan (Rp) + badge tren (+% vs minggu lalu) */}
        <div className="bg-white rounded-3xl border border-[#E8E8ED] p-5 shadow-xs flex flex-col justify-between hover:border-[#2E7D4F]/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-[#6E6E73]">Pendapatan Minggu Ini</span>
            <div className="w-8 h-8 rounded-2xl bg-[#EBF4EE] flex items-center justify-center text-[#2E7D4F]">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-[#1D1D1F]">
              {formatRupiah(weeklyRevenue)}
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#EBF4EE] text-[#2E7D4F]">
                +14.8%
              </span>
              <span className="text-[11px] text-[#6E6E73]">vs minggu lalu</span>
            </div>
          </div>
        </div>

        {/* KPI b: Pesanan Baru (jumlah) */}
        <Link
          to="/internal/admin/pesanan"
          className="bg-white rounded-3xl border border-[#E8E8ED] p-5 shadow-xs flex flex-col justify-between hover:border-blue-400/50 transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-[#6E6E73]">Pesanan Baru</span>
            <div className="w-8 h-8 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-105 transition-transform">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1D1D1F]">
                {newOrdersCount}
              </span>
              <span className="text-xs text-[#6E6E73] font-normal">pesanan</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px]">
              <span className="text-blue-700 font-semibold px-2 py-0.5 rounded-full bg-blue-50">
                Menunggu diproses
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-[#8E8E93] group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </Link>

        {/* KPI c: Bahan Masuk Minggu Ini (kg) */}
        <Link
          to="/internal/admin/bahan"
          className="bg-white rounded-3xl border border-[#E8E8ED] p-5 shadow-xs flex flex-col justify-between hover:border-[#2E7D4F]/40 transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-[#6E6E73]">Bahan Masuk 7 Hari</span>
            <div className="w-8 h-8 rounded-2xl bg-[#EBF4EE] flex items-center justify-center text-[#2E7D4F] group-hover:scale-105 transition-transform">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1D1D1F]">
                {totalWeeklyMaterialKg}
              </span>
              <span className="text-xs text-[#6E6E73] font-normal">kg disetor</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px]">
              <span className="text-[#2E7D4F] font-semibold px-2 py-0.5 rounded-full bg-[#EBF4EE]">
                {receivings.length} pengiriman mitra
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-[#8E8E93] group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </Link>

        {/* KPI d: Efisiensi Seleksi (% rata-rata layak dari seleksi QC) */}
        <Link
          to="/internal/admin/bahan"
          className="bg-white rounded-3xl border border-[#E8E8ED] p-5 shadow-xs flex flex-col justify-between hover:border-emerald-400/50 transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-[#6E6E73]">Efisiensi Seleksi QC</span>
            <div className="w-8 h-8 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-700 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold tracking-tight text-[#2E7D4F]">
                {materialMetrics.persentaseLayak}%
              </span>
              <span className="text-xs text-[#6E6E73] font-normal">layak olah</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px]">
              <span className="text-emerald-800 font-semibold px-2 py-0.5 rounded-full bg-emerald-50">
                Target dapur ≥ 85%
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-[#8E8E93] group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </Link>
      </div>

      {/* 3. Grafik Penjualan & Bahan Masuk 7 Hari Terakhir (Div Bar Chart murni) */}
      <div className="bg-white rounded-3xl border border-[#E8E8ED] p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2E7D4F]" />
              <h3 className="text-base font-bold text-[#1D1D1F]">
                Tren Performa 7 Hari Terakhir
              </h3>
            </div>
            <p className="text-xs text-[#6E6E73] mt-1">
              {chartTab === 'penjualan'
                ? 'Total omzet pesanan produk olahan per hari dari 08 Okt - 14 Okt 2026.'
                : 'Volume bahan baku pangan imperfect yang diterima dari para petani mitra.'}
            </p>
          </div>

          {/* Tab Toggle: Penjualan (Rp) vs Bahan Masuk (kg) */}
          <div className="inline-flex p-1 bg-[#F5F5F7] rounded-full border border-[#E8E8ED] self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setChartTab('penjualan')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
                chartTab === 'penjualan'
                  ? 'bg-white text-[#1D1D1F] shadow-xs'
                  : 'text-[#6E6E73] hover:text-[#1D1D1F]'
              }`}
            >
              Penjualan (Rp)
            </button>
            <button
              type="button"
              onClick={() => setChartTab('bahan')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
                chartTab === 'bahan'
                  ? 'bg-white text-[#1D1D1F] shadow-xs'
                  : 'text-[#6E6E73] hover:text-[#1D1D1F]'
              }`}
            >
              Bahan Masuk (kg)
            </button>
          </div>
        </div>

        {/* Div Bar Chart Canvas */}
        <div className="relative pt-8 pb-3">
          <div className="h-52 sm:h-60 flex items-end justify-between gap-2 sm:gap-6 border-b border-[#E8E8ED]/80 px-2 sm:px-6">
            {SEVEN_DAYS_DATA.map((item, idx) => {
              const value =
                chartTab === 'penjualan' ? item.penjualanRp : item.bahanMasukKg;
              const heightPercent = Math.min(
                100,
                Math.round((value / maxChartValue) * 100)
              );
              const isHovered = hoveredBarIndex === idx;

              return (
                <div
                  key={item.tanggalLabel}
                  className="flex-1 flex flex-col items-center h-full justify-end relative group cursor-pointer"
                  onMouseEnter={() => setHoveredBarIndex(idx)}
                  onMouseLeave={() => setHoveredBarIndex(null)}
                >
                  {/* Tooltip / Label Nilai saat Hover */}
                  <div
                    className={`absolute -top-7 px-2.5 py-1 rounded-lg bg-[#1D1D1F] text-white text-[11px] font-bold whitespace-nowrap shadow-md pointer-events-none transition-all duration-200 z-10 ${
                      isHovered
                        ? 'opacity-100 transform -translate-y-1'
                        : 'opacity-0 scale-95'
                    }`}
                  >
                    {chartTab === 'penjualan'
                      ? formatRupiah(item.penjualanRp)
                      : `${item.bahanMasukKg} kg bahan`}
                  </div>

                  {/* Nilai statis ringkas di atas bar (saat tidak hover) */}
                  <div className="text-[10px] font-semibold text-[#8E8E93] mb-1.5 transition-opacity group-hover:opacity-0">
                    {chartTab === 'penjualan'
                      ? formatShortRupiah(item.penjualanRp)
                      : `${item.bahanMasukKg} kg`}
                  </div>

                  {/* Batang Visual Bar */}
                  <div className="w-full max-w-[48px] bg-[#F5F5F7] rounded-t-xl overflow-hidden flex flex-col justify-end h-full">
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full rounded-t-xl transition-all duration-400 ease-out ${
                        item.highlight
                          ? chartTab === 'penjualan'
                            ? 'bg-[#2E7D4F] shadow-xs'
                            : 'bg-emerald-600 shadow-xs'
                          : chartTab === 'penjualan'
                          ? 'bg-[#D2E5D9] group-hover:bg-[#2E7D4F]/85'
                          : 'bg-[#BFE5CD] group-hover:bg-emerald-500'
                      }`}
                    />
                  </div>

                  {/* Label Hari & Tanggal */}
                  <div className="mt-2.5 text-center">
                    <p
                      className={`text-[11px] font-semibold transition-colors ${
                        item.highlight ? 'text-[#2E7D4F]' : 'text-[#1D1D1F]'
                      }`}
                    >
                      {item.tanggalLabel.split(' ')[0]}
                    </p>
                    <p className="text-[10px] text-[#8E8E93] hidden sm:block">
                      {item.hariLabel}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Rangkuman di Bawah Grafik */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-[#6E6E73] mt-4 pt-2 gap-2">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2E7D4F]" />
                Hari Berjalan: {chartTab === 'penjualan' ? formatRupiah(2850000) : '145 kg'}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D2E5D9]" />
                Hari Sebelumnya
              </span>
            </div>

            <div className="font-medium text-[#1D1D1F]">
              {chartTab === 'penjualan'
                ? `Akumulasi 7 hari: ${formatRupiah(weeklyRevenue)}`
                : `Akumulasi 7 hari: ${totalWeeklyMaterialKg} kg bahan pangan`}
            </div>
          </div>
        </div>
      </div>

      {/* 4. 2 Kolom di Bawah Grafik: Kiri & Kanan */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
        {/* ================= KOLOM KIRI (7 Kolom Desktop) ================= */}
        <div className="lg:col-span-7 space-y-7">
          {/* A. Perlu Tindakan Segera (Aksi Cepat) */}
          <div className="bg-white rounded-3xl border border-[#E8E8ED] p-5 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                <h3 className="text-base font-bold text-[#1D1D1F]">
                  Perlu Tindakan Segera
                </h3>
              </div>
              <span className="text-xs text-[#6E6E73] font-medium">Aksi Cepat Harian</span>
            </div>

            <div className="space-y-3">
              {/* Item 1: Penawaran Menunggu Persetujuan */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-[#FBFBFD] border border-[#E8E8ED] hover:border-[#2E7D4F]/40 hover:bg-[#F5FBF7]/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-xs sm:text-sm font-bold text-[#1D1D1F]">
                        {pendingOffersCount} Penawaran Supplier Menunggu
                      </h4>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                        Verifikasi
                      </span>
                    </div>
                    <p className="text-[11px] text-[#6E6E73] mt-0.5">
                      Tomat Bengkok (120 kg) & Stroberi Penyok (65 kg) menunggu persetujuan kurasi tim pangan.
                    </p>
                  </div>
                </div>

                <Link
                  to="/internal/admin/penawaran"
                  className="px-3 py-1.5 text-xs font-semibold rounded-full bg-[#1D1D1F] text-white hover:bg-[#2E7D4F] transition-colors self-end sm:self-auto shrink-0 cursor-pointer inline-flex items-center gap-1"
                >
                  <span>Tinjau</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              {/* Item 2: Pesanan Baru Belum Diproses */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-[#FBFBFD] border border-[#E8E8ED] hover:border-blue-400/40 hover:bg-blue-50/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                    <ShoppingCart className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-xs sm:text-sm font-bold text-[#1D1D1F]">
                        {newOrdersCount} Pesanan Baru Belum Diproses
                      </h4>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                        Perlu Konfirmasi
                      </span>
                    </div>
                    <p className="text-[11px] text-[#6E6E73] mt-0.5">
                      Pesanan dari Maya Sartika, Dimas Aditya, dan pembeli lainnya menunggu alokasi kemasan.
                    </p>
                  </div>
                </div>

                <Link
                  to="/internal/admin/pesanan"
                  className="px-3 py-1.5 text-xs font-semibold rounded-full bg-[#1D1D1F] text-white hover:bg-blue-600 transition-colors self-end sm:self-auto shrink-0 cursor-pointer inline-flex items-center gap-1"
                >
                  <span>Proses</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              {/* Item 3: Stok Menipis (Bahan / Produk) */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-[#FBFBFD] border border-[#E8E8ED] hover:border-amber-400/40 hover:bg-amber-50/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-xs sm:text-sm font-bold text-[#1D1D1F]">
                        {totalCriticalStockCount} Item Stok Mendekati Batas Kritis
                      </h4>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                        Restock
                      </span>
                    </div>
                    <p className="text-[11px] text-[#6E6E73] mt-0.5">
                      Bahan layak & produk kemasan (Selai Stroberi 22 unit, Wortel 3.5 kg) membutuhkan suplai tambahan.
                    </p>
                  </div>
                </div>

                <Link
                  to="/internal/admin/produk"
                  className="px-3 py-1.5 text-xs font-semibold rounded-full bg-[#1D1D1F] text-white hover:bg-amber-700 transition-colors self-end sm:self-auto shrink-0 cursor-pointer inline-flex items-center gap-1"
                >
                  <span>Cek Stok</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>

          {/* B. Penawaran Supplier Terbaru (3-4 item) */}
          <div className="bg-white rounded-3xl border border-[#E8E8ED] p-5 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2E7D4F]" />
                <h3 className="text-base font-bold text-[#1D1D1F]">
                  Penawaran Supplier Terbaru
                </h3>
              </div>
              <Link
                to="/internal/admin/penawaran"
                className="text-xs text-[#2E7D4F] font-semibold hover:underline inline-flex items-center gap-1"
              >
                Lihat Semua ({offers.length}) <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="divide-y divide-[#E8E8ED]/70">
              {latestOffers.map((offer) => (
                <div
                  key={offer.id}
                  className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Thumbnail Foto Bahan */}
                    <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-[#E8E8ED] bg-[#F5F5F7]">
                      <SmartImage
                        src={offer.foto}
                        alt={offer.namaBahan}
                        aspectRatio="1:1"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Link
                          to={`/internal/admin/penawaran/${offer.id}`}
                          className="text-xs sm:text-sm font-bold text-[#1D1D1F] group-hover:text-[#2E7D4F] transition-colors truncate"
                        >
                          {offer.namaBahan}
                        </Link>
                        <AdminStatusBadge status={offer.status} size="sm" />
                      </div>

                      <p className="text-[11px] text-[#6E6E73] mt-0.5 truncate">
                        {offer.supplierNama} · {offer.kelompokTani} ({offer.kota})
                      </p>

                      <div className="flex items-center gap-2 mt-1 text-[11px]">
                        <span className="font-semibold text-[#1D1D1F]">
                          {offer.beratTersediaKg} kg
                        </span>
                        <span className="text-[#8E8E93]">·</span>
                        <span className="text-[#2E7D4F] font-medium">
                          {formatRupiah(offer.hargaTawarPerKg)}/kg
                        </span>
                        <span className="text-[#8E8E93]">·</span>
                        <span className="text-[#6E6E73]">
                          Total {formatRupiah(offer.beratTersediaKg * offer.hargaTawarPerKg)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Link
                    to={`/internal/admin/penawaran/${offer.id}`}
                    className="p-2 rounded-full hover:bg-[#F5F5F7] text-[#8E8E93] hover:text-[#2E7D4F] transition-colors shrink-0"
                    title="Buka rincian penawaran"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ================= KOLOM KANAN (5 Kolom Desktop) ================= */}
        <div className="lg:col-span-5 space-y-7">
          {/* C. Aktivitas Operasional Terkini (Timeline) */}
          <div className="bg-white rounded-3xl border border-[#E8E8ED] p-5 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2E7D4F]" />
                <h3 className="text-base font-bold text-[#1D1D1F]">
                  Aktivitas Operasional Terkini
                </h3>
              </div>
              <span className="text-xs text-[#8E8E93] font-medium">Real-Time</span>
            </div>

            {/* Timeline List */}
            <div className="relative pl-6 space-y-4 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E8E8ED]">
              {operationalTimeline.map((item) => (
                <div key={item.id} className="relative group">
                  {/* Dot Marker */}
                  <span className="absolute -left-[19px] top-1.5 w-2 h-2 rounded-full bg-[#2E7D4F] ring-4 ring-white" />

                  <div className="bg-[#FBFBFD] p-3 rounded-2xl border border-[#E8E8ED]/80 hover:bg-[#F5FBF7]/50 hover:border-[#2E7D4F]/30 transition-all">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className="text-xs font-bold text-[#1D1D1F]">
                        {item.title}
                      </p>
                      {item.badge && (
                        <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-[#EBF4EE] text-[#2E7D4F]">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#6E6E73] leading-relaxed">
                      {item.desc}
                    </p>
                    <div className="flex items-center gap-1 mt-1.5 text-[10px] text-[#8E8E93]">
                      <Clock className="w-3 h-3 text-[#8E8E93]" />
                      <span>{item.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* D. Ringkasan Stok Kritis */}
          <div className="bg-white rounded-3xl border border-[#E8E8ED] p-5 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <h3 className="text-base font-bold text-[#1D1D1F]">
                  Ringkasan Stok Kritis
                </h3>
              </div>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                &lt; Batas Aman
              </span>
            </div>

            <p className="text-xs text-[#6E6E73] mb-4">
              Bahan baku sisa layak &lt; 5 kg atau produk kemasan jadi &lt; 25 unit.
            </p>

            <div className="space-y-2.5">
              {/* Bahan Baku Kritis */}
              {criticalMaterials.length > 0 ? (
                criticalMaterials.slice(0, 2).map((mat) => (
                  <div
                    key={mat.namaBahan}
                    className="p-3 rounded-2xl bg-[#FBFBFD] border border-amber-200/60 flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#1D1D1F]">
                          {mat.namaBahan}
                        </span>
                        <span className="text-[10px] text-[#6E6E73]">
                          ({mat.jenis})
                        </span>
                      </div>
                      <p className="text-[11px] text-amber-700 font-medium mt-0.5">
                        Tersisa {mat.sisaLayakKg} kg layak · Terpakai {mat.terpakaiProduksiKg} kg
                      </p>
                    </div>

                    <Link
                      to="/internal/admin/jadwal"
                      className="px-2.5 py-1 text-[11px] font-semibold rounded-full bg-amber-50 text-amber-800 hover:bg-amber-100 transition-colors shrink-0"
                    >
                      Jadwalkan
                    </Link>
                  </div>
                ))
              ) : (
                <div className="p-3 rounded-2xl bg-[#FBFBFD] border border-[#E8E8ED] text-xs text-[#6E6E73] text-center">
                  Stok semua bahan baku aman
                </div>
              )}

              {/* Produk Jadi Kritis */}
              {criticalProducts.slice(0, 2).map((prod) => (
                <div
                  key={prod.id}
                  className="p-3 rounded-2xl bg-[#FBFBFD] border border-red-200/60 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#1D1D1F] truncate">
                        {prod.nama}
                      </span>
                      <span className="text-[10px] text-[#6E6E73] shrink-0">
                        {prod.ukuran}
                      </span>
                    </div>
                    <p className="text-[11px] text-red-600 font-medium mt-0.5">
                      Sisa {prod.stok} unit (Batas aman: 25 unit)
                    </p>
                  </div>

                  <Link
                    to="/internal/admin/kalkulasi"
                    className="px-2.5 py-1 text-[11px] font-semibold rounded-full bg-red-50 text-red-700 hover:bg-red-100 transition-colors shrink-0"
                  >
                    Produksi
                  </Link>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-[#E8E8ED] flex items-center justify-between text-xs">
              <span className="text-[#6E6E73]">Perlu produksi tambahan?</span>
              <Link
                to="/internal/admin/kalkulasi"
                className="text-[#2E7D4F] font-semibold hover:underline inline-flex items-center gap-1"
              >
                Kalkulator Dapur <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
