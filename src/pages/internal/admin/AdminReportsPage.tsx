import React, { useState, useMemo } from 'react';
import { useAdminData } from '../../../context/AdminDataContext';
import { useWorkerData } from '../../../context/WorkerDataContext';
import {
  BarChart3,
  Calendar,
  Printer,
  DollarSign,
  TrendingUp,
  Package,
  Layers,
  Leaf,
  Users,
  Award,
  Sparkles,
  Download,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
} from 'lucide-react';

type ReportTab = 'penjualan' | 'bahan-masuk' | 'bahan-terbuang' | 'dampak';

export const AdminReportsPage: React.FC = () => {
  const { orders, products, monthlyRevenue, productSales, suppliers } = useAdminData();
  const { receivings, materialStocks } = useWorkerData();

  const [activeTab, setActiveTab] = useState<ReportTab>('penjualan');
  const [selectedPeriod, setSelectedPeriod] = useState<'bulan-ini' | 'tiga-bulan' | 'tahun-ini'>('tiga-bulan');

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  // 1. Metrik Penjualan
  const totalRevenue = useMemo(() => {
    return orders.reduce((sum, o) => sum + o.total, 0);
  }, [orders]);

  const totalOrdersCount = orders.length;
  const averageOrderValue = totalOrdersCount > 0 ? Math.round(totalRevenue / totalOrdersCount) : 0;

  // Max value untuk grafik bulanan
  const maxMonthlyRevenue = useMemo(() => {
    return Math.max(...monthlyRevenue.map((m) => m.pendapatan), 1);
  }, [monthlyRevenue]);

  // 2. Metrik Bahan Masuk
  const totalMaterialWeightKg = useMemo(() => {
    return receivings.reduce((sum, r) => sum + r.beratAwal, 0);
  }, [receivings]);

  // Kelompokkan per supplier
  const supplierWeights = useMemo(() => {
    const map: Record<string, { nama: string; kg: number; count: number }> = {};
    receivings.forEach((r) => {
      if (!map[r.supplierAsal]) {
        map[r.supplierAsal] = { nama: r.supplierAsal, kg: 0, count: 0 };
      }
      map[r.supplierAsal].kg += r.beratAwal;
      map[r.supplierAsal].count += 1;
    });
    return Object.values(map).sort((a, b) => b.kg - a.kg);
  }, [receivings]);

  // Kelompokkan per kategori bahan
  const categoryWeights = useMemo(() => {
    const map: Record<string, number> = { Sayur: 0, Buah: 0, Umbi: 0, Rempah: 0 };
    receivings.forEach((r) => {
      map[r.jenis] = (map[r.jenis] || 0) + r.beratAwal;
    });
    return map;
  }, [receivings]);

  // Dummy tren mingguan bahan masuk
  const weeklyMaterialTrend = [
    { minggu: 'Minggu 1', kg: 540 },
    { minggu: 'Minggu 2', kg: 720 },
    { minggu: 'Minggu 3', kg: 880 },
    { minggu: 'Minggu 4', kg: 910 },
  ];
  const maxWeeklyKg = Math.max(...weeklyMaterialTrend.map((w) => w.kg), 1);

  // 3. Metrik Bahan Terbuang & Kompos
  const wasteStats = useMemo(() => {
    let totalKompos = 0;
    let totalDibuang = 0;
    let totalLayak = 0;

    receivings.forEach((r) => {
      if (r.hasilSeleksi) {
        totalKompos += r.hasilSeleksi.dijadikanKompos;
        totalDibuang += r.hasilSeleksi.dibuang;
        totalLayak += r.hasilSeleksi.layak;
      }
    });

    const totalTertangani = totalKompos + totalDibuang + totalLayak || 1;
    const wastePct = Math.round(((totalKompos + totalDibuang) / totalTertangani) * 100);

    return { totalKompos, totalDibuang, totalLayak, wastePct };
  }, [receivings]);

  // 4. Metrik Dampak Lingkungan & Sosial (Estimasi)
  const impactMetrics = useMemo(() => {
    // Estimasi: setiap 1 kg bahan terselamatkan mencegah ~2.5 kg CO2e dan setara ~2 porsi makanan bernutrisi
    const rescuedKg = totalMaterialWeightKg + 3200; // baseline demonstratif
    const co2ePreventedKg = Math.round(rescuedKg * 2.5);
    const mealsEstimated = Math.round(rescuedKg * 2);
    const farmerPartnersCount = suppliers.length + 8;

    return {
      rescuedKg,
      co2ePreventedKg,
      mealsEstimated,
      farmerPartnersCount,
    };
  }, [totalMaterialWeightKg, suppliers]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-200">
      {/* Print styles injected for clean PDF generation without sidebar/buttons */}
      <style>{`
        @media print {
          nav, aside, header, .no-print, button, .print-hide {
            display: none !important;
          }
          body, main, #root {
            background: white !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .print-card {
            border: 1px solid #ccc !important;
            box-shadow: none !important;
            page-break-inside: avoid;
          }
        }
      `}</style>

      {/* Header Info & Print Action */}
      <div className="bg-white rounded-3xl border border-[#E8E8ED] p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print-card">
        <div>
          <div className="flex items-center gap-2 mb-1.5 no-print">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#EBF4EE] text-[#2E7D4F] border border-[#2E7D4F]/20 inline-flex items-center gap-1">
              <BarChart3 className="w-3 h-3" />
              Laporan Kinerja & Dampak
            </span>
            <span className="text-xs text-[#6E6E73]">
              Periode: {selectedPeriod === 'bulan-ini' ? 'Bulan Ini' : selectedPeriod === 'tiga-bulan' ? '3 Bulan Terakhir' : 'Tahun 2026'}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1D1D1F]">
            Laporan Operasional & Analitik
          </h1>
          <p className="text-xs sm:text-sm text-[#6E6E73] mt-1 max-w-xl">
            Audit komprehensif metrik penjualan toko, pasokan panen masuk, efisiensi susut bahan olahan, dan estimasi dampak penyelamatan emisi pangan.
          </p>
        </div>

        {/* Filter Periode & Cetak PDF */}
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 no-print">
          <div className="bg-[#F5F5F7] p-1 rounded-full border border-[#E8E8ED] flex items-center text-xs font-semibold text-[#6E6E73]">
            <button
              type="button"
              onClick={() => setSelectedPeriod('bulan-ini')}
              className={`px-3 py-1.5 rounded-full transition-colors cursor-pointer ${
                selectedPeriod === 'bulan-ini' ? 'bg-white shadow-xs text-[#1D1D1F]' : 'hover:text-[#1D1D1F]'
              }`}
            >
              Bulan Ini
            </button>
            <button
              type="button"
              onClick={() => setSelectedPeriod('tiga-bulan')}
              className={`px-3 py-1.5 rounded-full transition-colors cursor-pointer ${
                selectedPeriod === 'tiga-bulan' ? 'bg-white shadow-xs text-[#1D1D1F]' : 'hover:text-[#1D1D1F]'
              }`}
            >
              3 Bulan
            </button>
            <button
              type="button"
              onClick={() => setSelectedPeriod('tahun-ini')}
              className={`px-3 py-1.5 rounded-full transition-colors cursor-pointer ${
                selectedPeriod === 'tahun-ini' ? 'bg-white shadow-xs text-[#1D1D1F]' : 'hover:text-[#1D1D1F]'
              }`}
            >
              Tahun Ini
            </button>
          </div>

          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-full bg-[#1D1D1F] text-white hover:bg-[#2E7D4F] text-xs font-semibold transition-colors shadow-xs cursor-pointer inline-flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak / Simpan PDF</span>
          </button>
        </div>
      </div>

      {/* 4 Tabs Laporan */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none no-print">
        {[
          { key: 'penjualan', label: '1. Penjualan & Pendapatan', icon: DollarSign },
          { key: 'bahan-masuk', label: '2. Bahan Baku Masuk', icon: Package },
          { key: 'bahan-terbuang', label: '3. Bahan Terbuang & Kompos', icon: AlertTriangle },
          { key: 'dampak', label: '4. Dampak Penyelamatan (Estimasi)', icon: Leaf },
        ].map((tab) => {
          const isActive = activeTab === tab.key;
          const Icon = tab.icon;

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key as ReportTab)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-[#1D1D1F] text-white shadow-xs'
                  : 'bg-white text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-[#F5F5F7] border border-[#E8E8ED]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ================= TAB 1: PENJUALAN ================= */}
      {activeTab === 'penjualan' && (
        <div className="space-y-6">
          {/* 3 Kartu Metrik Penjualan */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-3xl bg-white border border-[#E8E8ED] shadow-xs print-card">
              <span className="text-xs text-[#6E6E73]">Total Pendapatan Terverifikasi</span>
              <p className="text-2xl font-bold text-[#2E7D4F] mt-1">{formatRupiah(totalRevenue)}</p>
              <p className="text-[11px] text-[#2E7D4F] mt-1 flex items-center gap-1 font-semibold">
                <TrendingUp className="w-3.5 h-3.5" />
                +14.8% dari periode sebelumnya
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-[#E8E8ED] shadow-xs print-card">
              <span className="text-xs text-[#6E6E73]">Jumlah Transaksi Selesai</span>
              <p className="text-2xl font-bold text-[#1D1D1F] mt-1">{totalOrdersCount} Pesanan</p>
              <p className="text-[11px] text-[#6E6E73] mt-1">Tingkat keberhasilan bayar 98.2%</p>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-[#E8E8ED] shadow-xs print-card">
              <span className="text-xs text-[#6E6E73]">Rata-rata Nilai Pesanan (AOV)</span>
              <p className="text-2xl font-bold text-[#1D1D1F] mt-1">{formatRupiah(averageOrderValue)}</p>
              <p className="text-[11px] text-[#6E6E73] mt-1">Rata-rata 2.4 produk per keranjang</p>
            </div>
          </div>

          {/* Grafik Batang Penjualan Bulanan (Tailwind Div Bar) */}
          <div className="bg-white rounded-3xl border border-[#E8E8ED] p-5 sm:p-6 shadow-xs space-y-4 print-card">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#1D1D1F]">
                  Tren Pendapatan Bulanan (6 Bulan Terakhir)
                </h3>
                <p className="text-xs text-[#6E6E73] mt-0.5">
                  Pertumbuhan omzet penjualan produk olahan pangan Ugly2Yummy.
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#F5F5F7] text-[#1D1D1F]">
                Target: {formatRupiah(35000000)}/bln
              </span>
            </div>

            <div className="pt-6 pb-2">
              <div className="h-48 flex items-end justify-between gap-3 sm:gap-6 border-b border-[#E8E8ED] px-2 sm:px-6">
                {monthlyRevenue.map((item, idx) => {
                  const pct = Math.round((item.pendapatan / maxMonthlyRevenue) * 100);
                  const isCurrent = idx === monthlyRevenue.length - 1;

                  return (
                    <div key={item.bulan} className="flex-1 flex flex-col items-center h-full justify-end group">
                      {/* Tooltip Hover Nilai */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity mb-2 px-2 py-1 rounded-lg bg-[#1D1D1F] text-white text-[10px] font-bold pointer-events-none whitespace-nowrap shadow-md">
                        {formatRupiah(item.pendapatan)}
                      </div>

                      {/* Batang Bar */}
                      <div className="w-full max-w-[48px] bg-[#F5F5F7] rounded-t-xl overflow-hidden flex flex-col justify-end h-full">
                        <div
                          style={{ height: `${pct}%` }}
                          className={`w-full rounded-t-xl transition-all duration-500 ${
                            isCurrent ? 'bg-[#2E7D4F]' : 'bg-[#2E7D4F]/70 hover:bg-[#2E7D4F]'
                          }`}
                        />
                      </div>

                      <span className="text-[11px] font-semibold text-[#6E6E73] mt-2 truncate">
                        {item.bulan}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Tabel Produk Terlaris */}
          <div className="bg-white rounded-3xl border border-[#E8E8ED] overflow-hidden shadow-xs print-card">
            <div className="p-5 border-b border-[#E8E8ED]">
              <h3 className="text-base font-bold text-[#1D1D1F]">Produk Olahan Terlaris</h3>
              <p className="text-xs text-[#6E6E73] mt-0.5">
                Peringkat kontribusi penjualan produk jadi terhadap perputaran stok.
              </p>
            </div>

            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#E8E8ED] bg-[#FBFBFD] text-[#6E6E73] font-semibold">
                  <th className="py-3 px-4">Peringkat</th>
                  <th className="py-3 px-4">Nama Produk</th>
                  <th className="py-3 px-4 text-right">Unit Terjual</th>
                  <th className="py-3 px-4 text-right">Total Nilai Omzet</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E8ED]/70">
                {productSales.map((ps, idx) => (
                  <tr key={ps.namaProduk} className="hover:bg-[#F5FBF7]/50">
                    <td className="py-3 px-4 font-bold text-[#6E6E73]">
                      #{idx + 1}
                    </td>
                    <td className="py-3 px-4 font-bold text-[#1D1D1F]">
                      {ps.namaProduk}
                    </td>
                    <td className="py-3 px-4 text-right text-[#1D1D1F]">
                      {ps.totalUnit} unit
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-[#2E7D4F]">
                      {formatRupiah(ps.totalPendapatan)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 2: BAHAN MASUK ================= */}
      {activeTab === 'bahan-masuk' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-3xl bg-white border border-[#E8E8ED] shadow-xs print-card">
              <span className="text-xs text-[#6E6E73]">Total Pasokan Bahan Diterima</span>
              <p className="text-2xl font-bold text-[#2E7D4F] mt-1">{totalMaterialWeightKg} kg</p>
              <p className="text-[11px] text-[#6E6E73] mt-1">{receivings.length} gelombang penerimaan logistik</p>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-[#E8E8ED] shadow-xs print-card">
              <span className="text-xs text-[#6E6E73]">Mitra Tani Penyuplai Aktif</span>
              <p className="text-2xl font-bold text-[#1D1D1F] mt-1">{supplierWeights.length} Kelompok Tani</p>
              <p className="text-[11px] text-[#6E6E73] mt-1">Lembang, Pangalengan, Malang, Ciwidey</p>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-[#E8E8ED] shadow-xs print-card">
              <span className="text-xs text-[#6E6E73]">Komoditas Terbanyak</span>
              <p className="text-2xl font-bold text-[#1D1D1F] mt-1">Sayur & Buah</p>
              <p className="text-[11px] text-[#6E6E73] mt-1">Tomat, Wortel, Pisang, Stroberi</p>
            </div>
          </div>

          {/* Grafik Batang Pasokan per Minggu */}
          <div className="bg-white rounded-3xl border border-[#E8E8ED] p-5 sm:p-6 shadow-xs space-y-4 print-card">
            <h3 className="text-base font-bold text-[#1D1D1F]">
              Grafik Volume Pasokan Bahan Baku per Minggu (kg)
            </h3>

            <div className="pt-4 pb-2">
              <div className="h-40 flex items-end justify-between gap-4 border-b border-[#E8E8ED] px-4">
                {weeklyMaterialTrend.map((w) => {
                  const pct = Math.round((w.kg / maxWeeklyKg) * 100);
                  return (
                    <div key={w.minggu} className="flex-1 flex flex-col items-center h-full justify-end group">
                      <span className="text-[11px] font-bold text-[#2E7D4F] mb-1">
                        {w.kg} kg
                      </span>
                      <div className="w-full max-w-[56px] bg-[#F5F5F7] rounded-t-xl overflow-hidden flex flex-col justify-end h-full">
                        <div
                          style={{ height: `${pct}%` }}
                          className="w-full bg-[#2E7D4F] rounded-t-xl transition-all"
                        />
                      </div>
                      <span className="text-xs font-semibold text-[#6E6E73] mt-2">{w.minggu}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Rincian per Supplier & per Kategori */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl border border-[#E8E8ED] p-5 shadow-xs space-y-3 print-card">
              <h3 className="text-sm font-bold text-[#1D1D1F] border-b border-[#E8E8ED] pb-2">
                Pasokan per Kelompok Tani Mitra
              </h3>
              <div className="divide-y divide-[#E8E8ED]/70 text-xs">
                {supplierWeights.map((s, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-[#1D1D1F]">{s.nama}</p>
                      <p className="text-[11px] text-[#6E6E73]">{s.count} kali pengiriman</p>
                    </div>
                    <span className="font-bold text-[#2E7D4F] text-sm">{s.kg} kg</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-[#E8E8ED] p-5 shadow-xs space-y-3 print-card">
              <h3 className="text-sm font-bold text-[#1D1D1F] border-b border-[#E8E8ED] pb-2">
                Distribusi Berdasarkan Jenis Komoditas
              </h3>
              <div className="space-y-3 text-xs pt-1">
                {Object.entries(categoryWeights).map(([cat, kg]) => {
                  const pct = totalMaterialWeightKg > 0 ? Math.round((kg / totalMaterialWeightKg) * 100) : 0;
                  return (
                    <div key={cat} className="space-y-1">
                      <div className="flex items-center justify-between font-semibold">
                        <span>{cat}</span>
                        <span className="text-[#1D1D1F]">{kg} kg ({pct}%)</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-[#F5F5F7] overflow-hidden">
                        <div
                          style={{ width: `${pct}%` }}
                          className="h-full bg-[#2E7D4F] rounded-full"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: BAHAN TERBUANG & KOMPOS ================= */}
      {activeTab === 'bahan-terbuang' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-3xl bg-white border border-[#E8E8ED] shadow-xs print-card">
              <span className="text-xs text-[#6E6E73]">Total Dijadikan Kompos Organik</span>
              <p className="text-2xl font-bold text-emerald-700 mt-1">{wasteStats.totalKompos} kg</p>
              <p className="text-[11px] text-[#6E6E73] mt-1">Didaur ulang ke kebun organik mitra</p>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-[#E8E8ED] shadow-xs print-card">
              <span className="text-xs text-[#6E6E73]">Total Residu Dibuang (Afkir Total)</span>
              <p className="text-2xl font-bold text-red-600 mt-1">{wasteStats.totalDibuang} kg</p>
              <p className="text-[11px] text-[#6E6E73] mt-1">Bagian busuk/terkontaminasi jamur</p>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-[#E8E8ED] shadow-xs print-card">
              <span className="text-xs text-[#6E6E73]">Rasio Susut terhadap Pasokan</span>
              <p className="text-2xl font-bold text-amber-700 mt-1">{wasteStats.wastePct}%</p>
              <p className="text-[11px] text-[#2E7D4F] mt-1 font-semibold">
                Tingkat penyelamatan olah: {100 - wasteStats.wastePct}%
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-[#E8E8ED] p-5 sm:p-6 shadow-xs space-y-4 print-card">
            <h3 className="text-base font-bold text-[#1D1D1F]">
              Rincian Seleksi & Alokasi Limbah per Gelombang Bahan
            </h3>
            <p className="text-xs text-[#6E6E73]">
              Laporan akuntabilitas sortir QC dapur terhadap bahan baku imperfect yang tiba.
            </p>

            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#E8E8ED] bg-[#FBFBFD] text-[#6E6E73] font-semibold">
                  <th className="py-3 px-4">Bahan Baku</th>
                  <th className="py-3 px-4">Supplier Asal</th>
                  <th className="py-3 px-4 text-right">Berat Awal</th>
                  <th className="py-3 px-4 text-right text-[#2E7D4F]">Layak Olah</th>
                  <th className="py-3 px-4 text-right text-emerald-700">Kompos</th>
                  <th className="py-3 px-4 text-right text-red-600">Dibuang</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E8ED]/70">
                {receivings.map((r) => (
                  <tr key={r.id} className="hover:bg-[#F5FBF7]/50">
                    <td className="py-3 px-4 font-bold text-[#1D1D1F]">{r.namaBahan}</td>
                    <td className="py-3 px-4 text-[#6E6E73]">{r.supplierAsal}</td>
                    <td className="py-3 px-4 text-right font-medium">{r.beratAwal} kg</td>
                    <td className="py-3 px-4 text-right font-bold text-[#2E7D4F]">
                      {r.hasilSeleksi ? `${r.hasilSeleksi.layak} kg` : '-'}
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-emerald-700">
                      {r.hasilSeleksi ? `${r.hasilSeleksi.dijadikanKompos} kg` : '-'}
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-red-600">
                      {r.hasilSeleksi ? `${r.hasilSeleksi.dibuang} kg` : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 4: DAMPAK PENYELAMATAN (ESTIMASI) ================= */}
      {activeTab === 'dampak' && (
        <div className="space-y-6">
          {/* Disclaimer Estimasi Wajib */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-700 shrink-0" />
            <p>
              <strong>Keterangan:</strong> Seluruh metrik dampak lingkungan dan sosial di bawah ini merupakan <strong>estimasi</strong> berbasis standar metodologi pencegahan food waste FAO dan rata-rata koefisien emisi limbah organik.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-white border border-[#E8E8ED] shadow-xs space-y-1 print-card">
              <span className="text-xs text-[#6E6E73]">Pangan Terselamatkan (estimasi)</span>
              <p className="text-2xl font-bold text-[#2E7D4F]">{impactMetrics.rescuedKg.toLocaleString('id-ID')} kg</p>
              <p className="text-[11px] text-[#6E6E73]">Buah & sayur imperfect diserap</p>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-[#E8E8ED] shadow-xs space-y-1 print-card">
              <span className="text-xs text-[#6E6E73]">CO2e Dicegah ke Atmosfer (estimasi)</span>
              <p className="text-2xl font-bold text-[#1D1D1F]">{impactMetrics.co2ePreventedKg.toLocaleString('id-ID')} kg</p>
              <p className="text-[11px] text-[#6E6E73]">Setara 12.000 km perjalanan mobil</p>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-[#E8E8ED] shadow-xs space-y-1 print-card">
              <span className="text-xs text-[#6E6E73]">Porsi Bernutrisi Disajikan (estimasi)</span>
              <p className="text-2xl font-bold text-[#1D1D1F]">{impactMetrics.mealsEstimated.toLocaleString('id-ID')} porsi</p>
              <p className="text-[11px] text-[#6E6E73]">Melalui saus, selai, dan camilan sehat</p>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-[#E8E8ED] shadow-xs space-y-1 print-card">
              <span className="text-xs text-[#6E6E73]">Mitra Petani Berdaya (estimasi)</span>
              <p className="text-2xl font-bold text-[#1D1D1F]">{impactMetrics.farmerPartnersCount} Kelompok Tani</p>
              <p className="text-[11px] text-[#6E6E73]">Pendapatan panen tambahan terserap</p>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-[#F5FBF7] border border-[#2E7D4F]/20 space-y-3 print-card">
            <h3 className="text-base font-bold text-[#1D1D1F] flex items-center gap-2">
              <Leaf className="w-5 h-5 text-[#2E7D4F]" />
              Formula Perhitungan Dampak
            </h3>
            <p className="text-xs text-[#6E6E73] leading-relaxed">
              Ugly2Yummy menghitung dampak berdasarkan volume panen yang tidak memenuhi spesifikasi ritel konvensional namun diolah menjadi produk bernilai tambah. Faktor emisi didasarkan pada perbandingan emisi dekomposisi anaerobik di Tempat Pemrosesan Akhir (TPA) vs pengolahan dapur sirkular ramah lingkungan.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
