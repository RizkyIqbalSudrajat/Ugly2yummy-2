import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useWorkerData } from '../../../context/WorkerDataContext';
import { WorkerStatusBadge } from '../../../components/internal/WorkerStatusBadge';
import { BatchStatus, ProductionBatch } from '../../../types/worker';
import {
  ChefHat,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Package,
  Layers,
  Scale,
  Sparkles,
  ArrowRight,
  ChevronRight,
  AlertCircle,
  X,
  FileText,
} from 'lucide-react';

export const WorkerProductionPage: React.FC = () => {
  const { batches, recipes, materialStocks, addBatch } = useWorkerData();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Tab Filter
  const [activeTab, setActiveTab] = useState<'Semua' | BatchStatus>('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal / Drawer Form Mulai Produksi
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Form Fields
  const availableBahanList = useMemo(
    () => materialStocks.filter((m) => m.sisaLayakKg > 0),
    [materialStocks]
  );

  const [selectedBahan, setSelectedBahan] = useState<string>(
    availableBahanList[0]?.namaBahan || 'Pisang Berbintik'
  );

  const matchingRecipes = useMemo(
    () => recipes.filter((r) => r.namaBahan === selectedBahan),
    [recipes, selectedBahan]
  );

  const [selectedProduk, setSelectedProduk] = useState<string>(
    matchingRecipes[0]?.namaProduk || 'Banana Bread Pisang Bintik'
  );

  const currentRecipe = useMemo(
    () => matchingRecipes.find((r) => r.namaProduk === selectedProduk) || matchingRecipes[0],
    [matchingRecipes, selectedProduk]
  );

  const activeStock = useMemo(
    () => materialStocks.find((m) => m.namaBahan === selectedBahan)?.sisaLayakKg || 0,
    [materialStocks, selectedBahan]
  );

  const [bahanDipakaiKg, setBahanDipakaiKg] = useState<number | ''>(
    activeStock > 0 ? Math.min(activeStock, 20) : 10
  );
  const [targetHasil, setTargetHasil] = useState<number | ''>(100);
  const [catatan, setCatatan] = useState('');
  const [formError, setFormError] = useState('');

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Tangani query param dari halaman kalkulasi atau link eksternal
  useEffect(() => {
    if (searchParams.get('tambah') === 'true') {
      const paramBahan = searchParams.get('bahan');
      const paramProduk = searchParams.get('produk');
      const paramKg = searchParams.get('kg');
      const paramTarget = searchParams.get('target');

      if (paramBahan) setSelectedBahan(paramBahan);
      if (paramProduk) setSelectedProduk(paramProduk);
      if (paramKg) setBahanDipakaiKg(Number(paramKg));
      if (paramTarget) setTargetHasil(Number(paramTarget));

      setIsFormOpen(true);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  // Saat bahan diganti di form, sesuaikan produk dan hitung ulang target default
  const handleBahanChange = (newBahan: string) => {
    setSelectedBahan(newBahan);
    const matches = recipes.filter((r) => r.namaBahan === newBahan);
    if (matches.length > 0) {
      setSelectedProduk(matches[0].namaProduk);
      const stock = materialStocks.find((m) => m.namaBahan === newBahan)?.sisaLayakKg || 0;
      const defaultKg = stock > 0 ? Math.min(stock, 20) : 10;
      setBahanDipakaiKg(defaultKg);

      const calculatedTarget =
        Math.floor(defaultKg / matches[0].rasioBahanKg) * matches[0].rasioHasilUnit;
      setTargetHasil(calculatedTarget);
    }
  };

  // Saat kg diganti, auto-update target hasil
  const handleKgChange = (val: number | '') => {
    setBahanDipakaiKg(val);
    if (currentRecipe && typeof val === 'number') {
      const calculatedTarget =
        Math.floor(val / currentRecipe.rasioBahanKg) * currentRecipe.rasioHasilUnit;
      setTargetHasil(calculatedTarget);
    }
  };

  const handleSubmitProduksi = (e: React.FormEvent) => {
    e.preventDefault();

    if (!bahanDipakaiKg || Number(bahanDipakaiKg) <= 0) {
      setFormError('Bahan baku yang digunakan harus lebih dari 0 kg.');
      return;
    }

    if (Number(bahanDipakaiKg) > activeStock) {
      setFormError(
        `Bahan digunakan (${bahanDipakaiKg} kg) melebihi sisa stok layak yang tersedia (${activeStock} kg).`
      );
      return;
    }

    if (!targetHasil || Number(targetHasil) <= 0) {
      setFormError('Target hasil produksi harus lebih dari 0 unit.');
      return;
    }

    const satuan = currentRecipe?.satuanHasil || 'pcs';
    const newBatch = addBatch({
      produk: selectedProduk,
      productId: currentRecipe?.productId,
      bahan: selectedBahan,
      bahanDipakai: Number(bahanDipakaiKg),
      targetHasil: Number(targetHasil),
      hasilBerhasil: 0,
      gagalReject: 0,
      satuan,
      tanggalMulai: '14 Okt 2026',
      status: 'Sedang Diolah',
      catatan: catatan.trim() || 'Batch produksi baru terdaftar di dapur.',
    });

    setIsFormOpen(false);
    setToastMessage(`Batch ${newBatch.id} dimulai, stok ${selectedBahan} berkurang.`);
    setTimeout(() => setToastMessage(null), 3500);

    // Navigasi langsung ke detail batch
    navigate(`/internal/pekerja/produksi/${newBatch.id}`);
  };

  // Filter Data
  const filteredBatches = batches.filter((b) => {
    const matchTab = activeTab === 'Semua' || b.status === activeTab;
    const matchSearch =
      b.produk.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.bahan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchTab && matchSearch;
  });

  const countSemua = batches.length;
  const countDiolah = batches.filter((b) => b.status === 'Sedang Diolah').length;
  const countDikemas = batches.filter((b) => b.status === 'Sedang Dikemas').length;
  const countSiap = batches.filter((b) => b.status === 'Siap Dijual').length;

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1D1D1F] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-white/10 animate-in slide-in-from-bottom-3 duration-200">
          <div className="w-6 h-6 rounded-full bg-[#2E7D4F] text-white flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <p className="text-xs sm:text-sm font-medium">{toastMessage}</p>
        </div>
      )}

      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#EBF4EE] text-[#2E7D4F] border border-[#2E7D4F]/20">
              Operasional Dapur
            </span>
            <span className="text-xs text-[#6E6E73]">· Batch Aktif</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1D1D1F]">
            Batch Produksi Pangan
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[#6E6E73] max-w-xl">
            Pantau dan kelola siklus batch pengolahan bahan terselamatkan menjadi produk bernilai tambah tinggi.
          </p>
        </div>

        {/* Tombol Mulai Produksi */}
        <button
          type="button"
          onClick={() => {
            setFormError('');
            setIsFormOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#2E7D4F] hover:bg-[#256640] text-white text-xs sm:text-sm font-semibold transition-all shadow-xs cursor-pointer active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Mulai Produksi</span>
        </button>
      </div>

      {/* Tab Filter & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-2 sm:p-2.5 rounded-2xl border border-[#E8E8ED]">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {(
            [
              { label: 'Semua', count: countSemua },
              { label: 'Sedang Diolah', count: countDiolah },
              { label: 'Sedang Dikemas', count: countDikemas },
              { label: 'Siap Dijual', count: countSiap },
            ] as const
          ).map((tab) => (
            <button
              key={tab.label}
              type="button"
              onClick={() => setActiveTab(tab.label)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeTab === tab.label
                  ? 'bg-[#1D1D1F] text-white shadow-xs'
                  : 'text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-[#F5F5F7]'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                  activeTab === tab.label
                    ? 'bg-white/20 text-white'
                    : 'bg-[#E8E8ED] text-[#6E6E73]'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6E6E73]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari batch, produk, bahan..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#F5F5F7] border border-[#E8E8ED] text-xs text-[#1D1D1F] placeholder-[#6E6E73]/60 focus:bg-white focus:border-[#2E7D4F] outline-none transition-all"
          />
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-3xl border border-[#E8E8ED] overflow-hidden shadow-none">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#E8E8ED] bg-[#FBFBFD] text-[11px] font-semibold text-[#6E6E73] uppercase tracking-wider">
              <th className="py-3.5 px-4">ID Batch</th>
              <th className="py-3.5 px-4">Produk & Bahan Baku</th>
              <th className="py-3.5 px-4 text-right">Bahan Dipakai</th>
              <th className="py-3.5 px-4">Target vs Hasil</th>
              <th className="py-3.5 px-4">Tgl Mulai</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8E8ED] text-xs">
            {filteredBatches.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-[#6E6E73]">
                  Tidak ada batch produksi yang sesuai filter.
                </td>
              </tr>
            ) : (
              filteredBatches.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => navigate(`/internal/pekerja/produksi/${item.id}`)}
                  className="hover:bg-[#FBFBFD] transition-colors group cursor-pointer"
                >
                  <td className="py-3.5 px-4 font-mono font-medium text-[#6E6E73]">
                    {item.id}
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-[#1D1D1F] group-hover:text-[#2E7D4F] transition-colors">
                      {item.produk}
                    </p>
                    <p className="text-[11px] text-[#6E6E73]">
                      Bahan: <span className="font-semibold text-[#1D1D1F]">{item.bahan}</span>
                    </p>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="font-extrabold text-[#1D1D1F] text-sm">
                      {item.bahanDipakai}
                    </span>
                    <span className="text-[11px] text-[#6E6E73] ml-1">kg</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-[#1D1D1F]">
                          {item.hasilBerhasil} / {item.targetHasil} {item.satuan}
                        </span>
                        <span className="text-[10px] text-[#6E6E73]">
                          {Math.round((item.hasilBerhasil / item.targetHasil) * 100)}%
                        </span>
                      </div>
                      <div className="w-28 h-1.5 bg-[#E8E8ED] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#2E7D4F] rounded-full"
                          style={{
                            width: `${Math.min(
                              100,
                              Math.round((item.hasilBerhasil / item.targetHasil) * 100)
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-[#6E6E73]">{item.tanggalMulai}</td>
                  <td className="py-3.5 px-4">
                    <WorkerStatusBadge status={item.status} size="sm" />
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#2E7D4F] group-hover:translate-x-0.5 transition-transform">
                      <span>Detail</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {filteredBatches.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E8E8ED] p-8 text-center text-xs text-[#6E6E73]">
            Tidak ada batch produksi.
          </div>
        ) : (
          filteredBatches.map((item) => (
            <div
              key={item.id}
              onClick={() => navigate(`/internal/pekerja/produksi/${item.id}`)}
              className="bg-white rounded-2xl border border-[#E8E8ED] p-4 space-y-3 cursor-pointer active:bg-[#F5F5F7] transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono text-[#6E6E73]">{item.id}</span>
                  <h3 className="text-sm font-bold text-[#1D1D1F]">{item.produk}</h3>
                  <p className="text-[11px] text-[#6E6E73]">
                    Bahan: <strong className="text-[#1D1D1F]">{item.bahan}</strong> ({item.bahanDipakai} kg)
                  </p>
                </div>
                <WorkerStatusBadge status={item.status} size="sm" />
              </div>

              <div className="space-y-1.5 pt-2 border-t border-[#E8E8ED]/70">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#6E6E73]">Hasil / Target:</span>
                  <span className="font-bold text-[#1D1D1F]">
                    {item.hasilBerhasil} / {item.targetHasil} {item.satuan}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-[#E8E8ED] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#2E7D4F] rounded-full"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.round((item.hasilBerhasil / item.targetHasil) * 100)
                      )}%`,
                    }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 text-[11px] text-[#6E6E73]">
                <span>Mulai: {item.tanggalMulai}</span>
                <span className="font-semibold text-[#2E7D4F] flex items-center gap-0.5">
                  Buka Stepper <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* =========================================================================
          DRAWER / MODAL: MULAI PRODUKSI BARU
          ========================================================================= */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setIsFormOpen(false)}
          />

          <div className="relative w-full max-w-lg bg-[#FBFBFD] h-full shadow-2xl z-10 flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-200">
            {/* Header Form */}
            <div className="px-6 py-4 bg-white border-b border-[#E8E8ED] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#EBF4EE] text-[#2E7D4F] flex items-center justify-center">
                  <ChefHat className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#1D1D1F]">Mulai Produksi Baru</h2>
                  <p className="text-[11px] text-[#6E6E73]">Inisiasi batch pengolahan bahan dapur</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="p-1.5 rounded-full hover:bg-[#F5F5F7] text-[#6E6E73] hover:text-[#1D1D1F] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSubmitProduksi} className="flex-1 overflow-y-auto p-6 space-y-4">
              {formError && (
                <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* 1. Pilih Bahan Baku */}
              <div className="bg-white rounded-2xl border border-[#E8E8ED] p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#1D1D1F]">Bahan Baku</label>
                  <span className="text-[11px] font-semibold text-[#2E7D4F]">
                    Stok Layak: {activeStock} kg
                  </span>
                </div>
                <select
                  value={selectedBahan}
                  onChange={(e) => handleBahanChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E8ED] bg-[#F5F5F7] text-xs font-medium text-[#1D1D1F] focus:bg-white focus:border-[#2E7D4F] outline-none cursor-pointer"
                >
                  {materialStocks.map((m) => (
                    <option key={m.namaBahan} value={m.namaBahan}>
                      {m.namaBahan} ({m.sisaLayakKg} kg layak tersedia)
                    </option>
                  ))}
                </select>
              </div>

              {/* 2. Pilih Produk */}
              <div className="bg-white rounded-2xl border border-[#E8E8ED] p-4 space-y-2">
                <label className="text-xs font-bold text-[#1D1D1F]">Produk yang Dihasilkan</label>
                <select
                  value={selectedProduk}
                  onChange={(e) => {
                    setSelectedProduk(e.target.value);
                    const match = recipes.find((r) => r.namaProduk === e.target.value);
                    if (match && typeof bahanDipakaiKg === 'number') {
                      setTargetHasil(
                        Math.floor(bahanDipakaiKg / match.rasioBahanKg) * match.rasioHasilUnit
                      );
                    }
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E8ED] bg-[#F5F5F7] text-xs font-medium text-[#1D1D1F] focus:bg-white focus:border-[#2E7D4F] outline-none cursor-pointer"
                >
                  {matchingRecipes.map((r) => (
                    <option key={r.id} value={r.namaProduk}>
                      {r.namaProduk} (Formula: {r.rasioBahanKg} kg → {r.rasioHasilUnit} {r.satuanHasil})
                    </option>
                  ))}
                </select>
              </div>

              {/* 3. Berat Bahan Dipakai & Target Hasil */}
              <div className="bg-white rounded-2xl border border-[#E8E8ED] p-4 grid grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#1D1D1F]">Bahan Dipakai</label>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      step="any"
                      min="0.5"
                      max={activeStock}
                      value={bahanDipakaiKg}
                      onChange={(e) =>
                        handleKgChange(e.target.value === '' ? '' : Number(e.target.value))
                      }
                      placeholder="0"
                      className="w-full py-2 pr-8 text-base font-extrabold text-[#1D1D1F] outline-none"
                      required
                    />
                    <span className="absolute right-0 top-1/2 -translate-y-1/2 text-xs text-[#6E6E73]">
                      kg
                    </span>
                  </div>
                  <span className="text-[10px] text-[#6E6E73]">Maks: {activeStock} kg</span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#1D1D1F]">Target Hasil</label>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      value={targetHasil}
                      onChange={(e) =>
                        setTargetHasil(e.target.value === '' ? '' : Number(e.target.value))
                      }
                      placeholder="0"
                      className="w-full py-2 pr-12 text-base font-extrabold text-[#2E7D4F] outline-none"
                      required
                    />
                    <span className="absolute right-0 top-1/2 -translate-y-1/2 text-xs text-[#6E6E73]">
                      {currentRecipe?.satuanHasil || 'pcs'}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#6E6E73]">Dihitung dari resep</span>
                </div>
              </div>

              {/* 4. Catatan Batch */}
              <div className="bg-white rounded-2xl border border-[#E8E8ED] p-4 space-y-2">
                <label className="text-xs font-bold text-[#1D1D1F]">Catatan Batch Produksi</label>
                <textarea
                  rows={2}
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                  placeholder="Contoh: Menggunakan oven suhu 160°C lambat, formula rempah kayu manis ekstra..."
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E8ED] bg-[#F5F5F7] text-xs text-[#1D1D1F] focus:bg-white focus:border-[#2E7D4F] outline-none resize-none"
                />
              </div>

              {/* Submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-full bg-[#2E7D4F] hover:bg-[#256640] text-white text-sm font-semibold transition-all shadow-xs cursor-pointer active:scale-95 flex items-center justify-center gap-2"
                >
                  <ChefHat className="w-4 h-4" />
                  <span>Daftarkan Batch & Mulai Olah</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
