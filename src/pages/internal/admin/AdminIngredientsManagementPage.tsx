import React, { useState, useMemo } from 'react';
import { useWorkerData } from '../../../context/WorkerDataContext';
import { AdminStatusBadge } from '../../../components/internal/AdminStatusBadge';
import { SmartImage } from '../../../components/ui/SmartImage';
import {
  Package,
  ShieldCheck,
  Trash2,
  Layers,
  Search,
  Filter,
  SlidersHorizontal,
  Plus,
  Minus,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Sparkles,
  User,
  ArrowRight,
  TrendingDown,
  X,
} from 'lucide-react';

type ManagementTab = 'masuk' | 'seleksi' | 'stok' | 'terbuang';

export const AdminIngredientsManagementPage: React.FC = () => {
  const { receivings, materialStocks, adjustMaterialStock } = useWorkerData();

  const [activeTab, setActiveTab] = useState<ManagementTab>('masuk');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Semua' | 'Menunggu Diseleksi' | 'Sudah Diseleksi'>('Semua');

  // Modal Penyesuaian Stok
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [adjustTargetMaterial, setAdjustTargetMaterial] = useState<string>('');
  const [adjustType, setAdjustType] = useState<'Tambah' | 'Kurang'>('Kurang');
  const [adjustAmount, setAdjustAmount] = useState<number>(2);
  const [adjustReason, setAdjustReason] = useState<string>('');

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Open modal adjust
  const handleOpenAdjust = (bahan: string) => {
    setAdjustTargetMaterial(bahan);
    setAdjustType('Kurang');
    setAdjustAmount(2);
    setAdjustReason('Susut alami selama penyimpanan pendingin');
    setShowAdjustModal(true);
  };

  const handleAdjustSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustTargetMaterial || !adjustAmount || !adjustReason.trim()) return;

    adjustMaterialStock(adjustTargetMaterial, adjustType, adjustAmount, adjustReason.trim());
    setShowAdjustModal(false);
    showToast(
      `Stok ${adjustTargetMaterial} berhasil ${
        adjustType === 'Tambah' ? 'ditambah' : 'dikurangi'
      } ${adjustAmount} kg.`
    );
  };

  // Tab A: Filtered Bahan Masuk
  const filteredReceivings = useMemo(() => {
    return receivings.filter((r) => {
      if (statusFilter !== 'Semua' && r.status !== statusFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          r.namaBahan.toLowerCase().includes(q) ||
          r.supplierAsal.toLowerCase().includes(q) ||
          r.id.toLowerCase().includes(q) ||
          r.dicatatOleh.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [receivings, statusFilter, searchQuery]);

  // Tab B: Penerimaan yang sudah diseleksi QC
  const qcReceivings = useMemo(() => {
    return receivings.filter((r) => r.hasilSeleksi);
  }, [receivings]);

  // Tab B: Rata-rata persentase layak per supplier
  const supplierQCStats = useMemo(() => {
    const map = new Map<string, { totalMasuk: number; totalLayak: number; count: number }>();

    qcReceivings.forEach((r) => {
      const sName = r.supplierAsal.split('(')[0].trim();
      const existing = map.get(sName) || { totalMasuk: 0, totalLayak: 0, count: 0 };
      existing.totalMasuk += r.beratAwal;
      existing.totalLayak += r.hasilSeleksi?.layak || 0;
      existing.count += 1;
      map.set(sName, existing);
    });

    return Array.from(map.entries()).map(([supplier, stat]) => {
      const percent = stat.totalMasuk > 0 ? Math.round((stat.totalLayak / stat.totalMasuk) * 100) : 0;
      return {
        supplier,
        totalMasuk: stat.totalMasuk,
        totalLayak: stat.totalLayak,
        count: stat.count,
        percent,
      };
    });
  }, [qcReceivings]);

  // Tab D: Rincian Bahan Terbuang (Kompos & Dibuang)
  const wasteMetrics = useMemo(() => {
    let totalKompos = 0;
    let totalDibuang = 0;
    const perBahanMap = new Map<string, { kompos: number; dibuang: number }>();

    qcReceivings.forEach((r) => {
      const k = r.hasilSeleksi?.dijadikanKompos || 0;
      const d = r.hasilSeleksi?.dibuang || 0;
      totalKompos += k;
      totalDibuang += d;

      const prev = perBahanMap.get(r.namaBahan) || { kompos: 0, dibuang: 0 };
      prev.kompos += k;
      prev.dibuang += d;
      perBahanMap.set(r.namaBahan, prev);
    });

    const perBahanList = Array.from(perBahanMap.entries()).map(([bahan, val]) => ({
      bahan,
      kompos: val.kompos,
      dibuang: val.dibuang,
      total: val.kompos + val.dibuang,
    }));

    return {
      totalKompos,
      totalDibuang,
      totalTerbuang: totalKompos + totalDibuang,
      perBahanList,
    };
  }, [qcReceivings]);

  const WEEKLY_WASTE_CHART = [
    { minggu: 'Minggu 1', kompos: 28, dibuang: 12 },
    { minggu: 'Minggu 2', kompos: 34, dibuang: 10 },
    { minggu: 'Minggu 3', kompos: 42, dibuang: 9 },
    { minggu: 'Minggu 4 (Kini)', kompos: 38, dibuang: 6 },
  ];

  return (
    <div className="space-y-6 pb-14 animate-in fade-in duration-200">
      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#1D1D1F] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in slide-in-from-top duration-300">
          <CheckCircle2 className="w-5 h-5 text-[#2E7D4F]" />
          <p className="text-xs sm:text-sm font-semibold">{toastMessage}</p>
        </div>
      )}

      {/* Header Info */}
      <div className="bg-white rounded-3xl border border-[#E8E8ED] p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#EBF4EE] text-[#2E7D4F] border border-[#2E7D4F]/20 inline-flex items-center gap-1">
              <Package className="w-3.5 h-3.5" />
              Inventaris Bahan Pangan Imperfect
            </span>
            <span className="text-xs text-[#6E6E73]">
              {materialStocks.length} varian bahan baku
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1D1D1F]">
            Manajemen Bahan Baku & Seleksi
          </h1>
          <p className="text-xs sm:text-sm text-[#6E6E73] mt-1 max-w-xl">
            Pantau arus penerimaan bahan segar, audit hasil seleksi QC dapur, penyesuaian stok layak, dan pengalihan residu ke kompos organik.
          </p>
        </div>

        {/* 4 Tabs Segmented Control */}
        <div className="inline-flex p-1 bg-[#F5F5F7] rounded-full border border-[#E8E8ED] self-start sm:self-auto overflow-x-auto max-w-full">
          {[
            { id: 'masuk', label: 'Bahan Masuk' },
            { id: 'seleksi', label: 'Hasil Seleksi (QC)' },
            { id: 'stok', label: 'Stok Layak' },
            { id: 'terbuang', label: 'Bahan Terbuang' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as ManagementTab)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-white text-[#1D1D1F] shadow-xs'
                  : 'text-[#6E6E73] hover:text-[#1D1D1F]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ================= TAB A: DATA BAHAN MASUK ================= */}
      {activeTab === 'masuk' && (
        <div className="space-y-4">
          {/* Search & Filter Toolbar */}
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#E8E8ED] p-3.5 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#8E8E93] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari ID, bahan, atau supplier pengirim..."
                className="w-full pl-9 pr-3.5 py-2 text-xs rounded-full bg-[#F5F5F7] border-0 text-[#1D1D1F]"
              />
            </div>

            <div className="flex items-center gap-1.5">
              {(['Semua', 'Menunggu Diseleksi', 'Sudah Diseleksi'] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    statusFilter === st
                      ? 'bg-[#1D1D1F] text-white shadow-xs'
                      : 'bg-[#F5F5F7] text-[#6E6E73] hover:text-[#1D1D1F]'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden sm:block bg-white rounded-3xl border border-[#E8E8ED] overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#E8E8ED] bg-[#FBFBFD] text-[#6E6E73] font-semibold">
                  <th className="py-3.5 px-4">ID</th>
                  <th className="py-3.5 px-4">Bahan Baku</th>
                  <th className="py-3.5 px-4">Supplier Asal</th>
                  <th className="py-3.5 px-4 text-right">Berat Awal</th>
                  <th className="py-3.5 px-4">Tanggal Masuk</th>
                  <th className="py-3.5 px-4">Dicatat Oleh</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E8ED]/70">
                {filteredReceivings.map((r) => (
                  <tr key={r.id} className="hover:bg-[#F5FBF7]/50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#1D1D1F]">{r.id}</td>
                    <td className="py-3 px-4 font-bold text-[#1D1D1F]">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-[#E8E8ED] bg-[#F5F5F7]">
                          <SmartImage
                            src={r.foto}
                            alt={r.namaBahan}
                            aspectRatio="1:1"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p>{r.namaBahan}</p>
                          <span className="text-[10px] text-[#8E8E93] bg-[#F5F5F7] px-1.5 py-0.2 rounded-md">
                            {r.jenis}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[#6E6E73] max-w-xs truncate">
                      {r.supplierAsal}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-[#1D1D1F]">
                      {r.beratAwal} <span className="font-normal text-[#6E6E73]">kg</span>
                    </td>
                    <td className="py-3 px-4 text-[#6E6E73]">{r.tanggalMasuk}</td>
                    <td className="py-3 px-4 text-[#1D1D1F] font-medium">{r.dicatatOleh}</td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                          r.status === 'Sudah Diseleksi'
                            ? 'bg-[#EBF4EE] text-[#2E7D4F] border-[#2E7D4F]/20'
                            : 'bg-[#F5F5F7] text-[#6E6E73] border-[#E8E8ED]'
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="sm:hidden space-y-3">
            {filteredReceivings.map((r) => (
              <div key={r.id} className="bg-white rounded-2xl border border-[#E8E8ED] p-4 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#1D1D1F]">{r.id}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      r.status === 'Sudah Diseleksi'
                        ? 'bg-[#EBF4EE] text-[#2E7D4F]'
                        : 'bg-[#F5F5F7] text-[#6E6E73]'
                    }`}
                  >
                    {r.status}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-[#1D1D1F]">{r.namaBahan}</h4>
                <p className="text-xs text-[#6E6E73]">{r.supplierAsal}</p>
                <div className="flex items-center justify-between pt-2 border-t border-[#E8E8ED] text-xs">
                  <span className="font-bold text-[#2E7D4F]">{r.beratAwal} kg</span>
                  <span className="text-[#8E8E93]">{r.tanggalMasuk}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB B: HASIL SELEKSI (QC) ================= */}
      {activeTab === 'seleksi' && (
        <div className="space-y-6">
          {/* Ringkasan Rata-rata Persentase Layak per Supplier */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#8E8E93]">
              Performa Kualitas Rata-rata Petani Mitra
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {supplierQCStats.map((item) => (
                <div
                  key={item.supplier}
                  className="bg-white rounded-3xl border border-[#E8E8ED] p-4 shadow-xs space-y-2"
                >
                  <p className="text-xs font-bold text-[#1D1D1F] truncate">{item.supplier}</p>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-bold text-[#2E7D4F]">{item.percent}%</span>
                    <span className="text-xs text-[#6E6E73]">{item.count} pengiriman</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[#F5F5F7] overflow-hidden">
                    <div
                      style={{ width: `${item.percent}%` }}
                      className="h-full bg-[#2E7D4F] rounded-full"
                    />
                  </div>
                  <p className="text-[10px] text-[#8E8E93] pt-1">
                    {item.totalLayak} kg layak dari total {item.totalMasuk} kg
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Rincian Hasil Seleksi per Penerimaan */}
          <div className="bg-white rounded-3xl border border-[#E8E8ED] overflow-hidden shadow-xs">
            <div className="p-4 border-b border-[#E8E8ED] flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#1D1D1F]">
                Daftar Hasil Uji & Sortir QC Dapur
              </h3>
              <span className="text-xs text-[#6E6E73]">{qcReceivings.length} hasil evaluasi</span>
            </div>

            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#E8E8ED] bg-[#FBFBFD] text-[#6E6E73] font-semibold">
                  <th className="py-3 px-4">Penerimaan</th>
                  <th className="py-3 px-4">Bahan Baku</th>
                  <th className="py-3 px-4 text-right">Layak Olah</th>
                  <th className="py-3 px-4 text-right">Kompos</th>
                  <th className="py-3 px-4 text-right">Dibuang</th>
                  <th className="py-3 px-4 text-center">Kelayakan</th>
                  <th className="py-3 px-4">Catatan Petugas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E8ED]/70">
                {qcReceivings.map((r) => {
                  const res = r.hasilSeleksi!;
                  const percent = Math.round((res.layak / r.beratAwal) * 100);

                  return (
                    <tr key={r.id} className="hover:bg-[#F5FBF7]/50 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-[#1D1D1F]">{r.id}</td>
                      <td className="py-3 px-4">
                        <p className="font-bold text-[#1D1D1F]">{r.namaBahan}</p>
                        <p className="text-[10px] text-[#6E6E73]">{r.supplierAsal.split('-')[0]}</p>
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-[#2E7D4F]">
                        {res.layak} kg
                      </td>
                      <td className="py-3 px-4 text-right text-amber-700">
                        {res.dijadikanKompos} kg
                      </td>
                      <td className="py-3 px-4 text-right text-gray-500">
                        {res.dibuang} kg
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full font-bold text-[11px] ${
                            percent >= 85
                              ? 'bg-[#EBF4EE] text-[#2E7D4F]'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {percent}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[#6E6E73] max-w-xs truncate">
                        {res.catatan || '-'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB C: STOK BAHAN BAKU ================= */}
      {activeTab === 'stok' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {materialStocks.map((m) => {
              const isLow = m.sisaLayakKg < 5;
              const maxScale = Math.max(m.totalLayakKg, 50);
              const percentLeft = Math.min(100, Math.round((m.sisaLayakKg / maxScale) * 100));

              return (
                <div
                  key={m.namaBahan}
                  className="bg-white rounded-3xl border border-[#E8E8ED] p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#2E7D4F]/40 transition-all"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <span className="text-[10px] text-[#8E8E93] bg-[#F5F5F7] px-2 py-0.5 rounded-full uppercase font-bold">
                          {m.jenis}
                        </span>
                        <h3 className="text-base font-bold text-[#1D1D1F] mt-1">
                          {m.namaBahan}
                        </h3>
                      </div>

                      {isLow && (
                        <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-bold inline-flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          Stok Menipis
                        </span>
                      )}
                    </div>

                    <div className="flex items-baseline gap-2 mt-3">
                      <span className="text-3xl font-bold tracking-tight text-[#1D1D1F]">
                        {m.sisaLayakKg}
                      </span>
                      <span className="text-xs text-[#6E6E73]">kg layak olah</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 rounded-full bg-[#F5F5F7] overflow-hidden my-3">
                      <div
                        style={{ width: `${percentLeft}%` }}
                        className={`h-full rounded-full transition-all duration-500 ${
                          isLow ? 'bg-red-500' : 'bg-[#2E7D4F]'
                        }`}
                      />
                    </div>

                    {/* Rincian Arus */}
                    <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-[#E8E8ED]">
                      <div>
                        <span className="text-[#6E6E73]">Total Layak QC:</span>
                        <p className="font-semibold text-[#1D1D1F]">{m.totalLayakKg} kg</p>
                      </div>
                      <div>
                        <span className="text-[#6E6E73]">Terpakai Dapur:</span>
                        <p className="font-semibold text-[#2E7D4F]">{m.terpakaiProduksiKg} kg</p>
                      </div>
                    </div>
                  </div>

                  {/* Tombol Sesuaikan Stok */}
                  <button
                    type="button"
                    onClick={() => handleOpenAdjust(m.namaBahan)}
                    className="w-full py-2 rounded-full bg-[#F5F5F7] text-[#1D1D1F] hover:bg-[#E8E8ED] text-xs font-semibold transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span>Sesuaikan Stok Fisik</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= TAB D: BAHAN TERBUANG ================= */}
      {activeTab === 'terbuang' && (
        <div className="space-y-6">
          {/* 3 Kartu Ringkasan Terbuang */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-3xl border border-[#E8E8ED] p-5 shadow-xs">
              <span className="text-xs text-[#6E6E73]">Total Residu Terpilah</span>
              <p className="text-2xl font-bold text-[#1D1D1F] mt-1">
                {wasteMetrics.totalTerbuang} <span className="text-sm font-normal text-[#6E6E73]">kg</span>
              </p>
              <p className="text-[11px] text-[#6E6E73] mt-1">
                Dari seluruh proses penerimaan bahan dapur
              </p>
            </div>

            <div className="bg-white rounded-3xl border border-[#E8E8ED] p-5 shadow-xs">
              <span className="text-xs text-[#6E6E73]">Difermentasi Jadi Kompos</span>
              <p className="text-2xl font-bold text-amber-800 mt-1">
                {wasteMetrics.totalKompos} <span className="text-sm font-normal text-[#6E6E73]">kg</span>
              </p>
              <p className="text-[11px] text-amber-700 mt-1">
                {Math.round((wasteMetrics.totalKompos / (wasteMetrics.totalTerbuang || 1)) * 100)}% dialihkan ke nutrisi organik
              </p>
            </div>

            <div className="bg-white rounded-3xl border border-[#E8E8ED] p-5 shadow-xs">
              <span className="text-xs text-[#6E6E73]">Dibuang / Residu Ekstrem</span>
              <p className="text-2xl font-bold text-gray-700 mt-1">
                {wasteMetrics.totalDibuang} <span className="text-sm font-normal text-[#6E6E73]">kg</span>
              </p>
              <p className="text-[11px] text-gray-500 mt-1">
                Busuk parah & kontaminasi fisik
              </p>
            </div>
          </div>

          {/* Grafik Batang Mingguan & Rincian per Bahan */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Grafik Batang Mingguan (Div Tailwind Murni) */}
            <div className="lg:col-span-6 bg-white rounded-3xl border border-[#E8E8ED] p-5 sm:p-6 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#1D1D1F] mb-1">
                  Tren Reduksi Residu & Kompos (4 Minggu)
                </h3>
                <p className="text-xs text-[#6E6E73] mb-6">
                  Peningkatan rasio pemanfaatan kompos organik vs residu yang dibuang.
                </p>

                <div className="h-44 flex items-end justify-between gap-4 pt-4 pb-2 border-b border-[#E8E8ED]">
                  {WEEKLY_WASTE_CHART.map((w) => {
                    const totalKg = w.kompos + w.dibuang;
                    const maxScale = 50;
                    const heightPercent = Math.min(100, Math.round((totalKg / maxScale) * 100));

                    return (
                      <div key={w.minggu} className="flex-1 flex flex-col items-center h-full justify-end group">
                        <span className="text-[10px] font-bold text-[#1D1D1F] mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {totalKg} kg
                        </span>

                        <div className="w-full max-w-[42px] bg-[#F5F5F7] rounded-t-xl overflow-hidden flex flex-col justify-end h-full">
                          <div
                            style={{ height: `${heightPercent}%` }}
                            className="w-full bg-[#A3704C] rounded-t-xl flex flex-col justify-end"
                          >
                            {/* Portion dibuang */}
                            <div
                              style={{ height: `${Math.round((w.dibuang / totalKg) * 100)}%` }}
                              className="w-full bg-[#8E8E93]"
                            />
                          </div>
                        </div>

                        <span className="mt-2 text-[10px] font-semibold text-[#6E6E73] text-center">
                          {w.minggu}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#6E6E73] pt-3">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#A3704C]" />
                    Kompos Organik (Subur)
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#8E8E93]" />
                    Dibuang (Afkir)
                  </span>
                </div>
              </div>
            </div>

            {/* Rincian per Bahan Baku */}
            <div className="lg:col-span-6 bg-white rounded-3xl border border-[#E8E8ED] p-5 sm:p-6 shadow-xs">
              <h3 className="text-sm font-bold text-[#1D1D1F] mb-3">
                Rincian Bahan Terbuang per Komoditas
              </h3>

              <div className="space-y-3">
                {wasteMetrics.perBahanList.map((item) => (
                  <div
                    key={item.bahan}
                    className="p-3 rounded-2xl bg-[#FBFBFD] border border-[#E8E8ED] flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <p className="font-bold text-[#1D1D1F]">{item.bahan}</p>
                      <p className="text-[11px] text-[#6E6E73]">
                        {item.kompos} kg kompos · {item.dibuang} kg afkir
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-amber-800">{item.total} kg</p>
                      <span className="text-[10px] text-[#8E8E93]">Total tersisih</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL SESUAIKAN STOK ================= */}
      {showAdjustModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-[#E8E8ED] animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-[#E8E8ED] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center">
                  <SlidersHorizontal className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-[#1D1D1F]">
                  Sesuaikan Stok: {adjustTargetMaterial}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAdjustModal(false)}
                className="p-1 rounded-full hover:bg-[#F5F5F7] text-[#8E8E93]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdjustSubmit} className="space-y-3 text-xs">
              {/* Tipe Tambah / Kurang */}
              <div>
                <label className="block font-semibold text-[#1D1D1F] mb-1">
                  Arah Penyesuaian:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAdjustType('Kurang')}
                    className={`p-2.5 rounded-xl font-semibold border flex items-center justify-center gap-1.5 cursor-pointer ${
                      adjustType === 'Kurang'
                        ? 'bg-amber-50 text-amber-800 border-amber-300'
                        : 'bg-[#F5F5F7] text-[#6E6E73] border-transparent'
                    }`}
                  >
                    <Minus className="w-3.5 h-3.5" />
                    <span>Kurangi Stok</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAdjustType('Tambah')}
                    className={`p-2.5 rounded-xl font-semibold border flex items-center justify-center gap-1.5 cursor-pointer ${
                      adjustType === 'Tambah'
                        ? 'bg-[#EBF4EE] text-[#2E7D4F] border-[#2E7D4F]/30'
                        : 'bg-[#F5F5F7] text-[#6E6E73] border-transparent'
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Stok</span>
                  </button>
                </div>
              </div>

              {/* Jumlah (kg) */}
              <div>
                <label className="block font-semibold text-[#1D1D1F] mb-1">
                  Jumlah Penyesuaian (kg):
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(Number(e.target.value))}
                  required
                  className="w-full p-2.5 rounded-xl bg-[#F5F5F7] border-0 text-[#1D1D1F] font-bold text-sm"
                />
              </div>

              {/* Alasan Wajib */}
              <div>
                <label className="block font-semibold text-[#1D1D1F] mb-1">
                  Alasan Wajib (Dicatat di Audit Log):
                </label>
                <textarea
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  placeholder="Contoh: Susut saat penyimpanan pendingin, koreksi timbangan fisik..."
                  rows={3}
                  required
                  className="w-full p-2.5 rounded-xl bg-[#F5F5F7] border-0 text-[#1D1D1F]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E8E8ED]">
                <button
                  type="button"
                  onClick={() => setShowAdjustModal(false)}
                  className="px-4 py-2 rounded-full bg-[#F5F5F7] text-[#6E6E73] hover:text-[#1D1D1F]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={!adjustAmount || !adjustReason.trim()}
                  className="px-5 py-2 rounded-full bg-[#2E7D4F] text-white hover:bg-[#256640] transition-colors font-semibold shadow-xs cursor-pointer disabled:opacity-50"
                >
                  Simpan Penyesuaian
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
