import React, { useState, useMemo } from 'react';
import { useWorkerData } from '../../../context/WorkerDataContext';
import { SmartImage } from '../../../components/ui/SmartImage';
import { MaterialStockSummary } from '../../../context/WorkerDataContext';
import { ProductInventory } from '../../../types/worker';
import { PRODUCT_CUSTOM_LINKS, UGLY_INGREDIENT_LINKS } from '../../../data/dummy';
import {
  Boxes,
  Layers,
  Package,
  Plus,
  Minus,
  AlertCircle,
  CheckCircle2,
  SlidersHorizontal,
  History,
  TrendingDown,
  TrendingUp,
  X,
  Search,
  Scale,
  Calendar,
  Warehouse,
  ArrowDownRight,
  ArrowUpRight,
} from 'lucide-react';

export const WorkerInventoryPage: React.FC = () => {
  const {
    materialStocks,
    inventory,
    stockLogs,
    adjustMaterialStock,
    adjustProductStock,
    batches,
  } = useWorkerData();

  // Tab Utama: Bahan Baku vs Produk Jadi
  const [activeTab, setActiveTab] = useState<'bahan' | 'produk'>('bahan');
  const [logFilter, setLogFilter] = useState<'Semua' | 'Bahan Baku' | 'Produk Jadi'>('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal Penyesuaian Stok
  const [modalItem, setModalItem] = useState<{
    kategori: 'Bahan Baku' | 'Produk Jadi';
    nama: string;
    satuan: string;
    stokSekarang: number;
  } | null>(null);

  const [adjustType, setAdjustType] = useState<'Tambah' | 'Kurang'>('Kurang');
  const [adjustAmount, setAdjustAmount] = useState<number | ''>('');
  const [adjustReason, setAdjustReason] = useState('');
  const [modalError, setModalError] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Cari batch terakhir untuk produk jadi
  const getLastBatchForProduct = (productName: string) => {
    const match = batches
      .filter((b) => b.produk === productName && b.status === 'Siap Dijual')
      .slice(-1)[0];
    return match ? match.id : 'PRD-2026-0010';
  };

  // Thumbnail fallback untuk produk / bahan
  const getItemThumbnail = (name: string, isProduct: boolean) => {
    if (isProduct) {
      if (name.includes('Tomat')) return PRODUCT_CUSTOM_LINKS['saus-tomat-panggang'];
      if (name.includes('Mangga')) return UGLY_INGREDIENT_LINKS['mangga-mungil'];
      if (name.includes('Pisang')) return UGLY_INGREDIENT_LINKS['pisang-berbintik'];
      if (name.includes('Wortel')) return UGLY_INGREDIENT_LINKS['wortel-bercabang'];
      if (name.includes('Stroberi')) return UGLY_INGREDIENT_LINKS['stroberi-penyok'];
      return 'https://images.unsplash.com/photo-1546548970-71785318a17b?auto=format&fit=crop&w=400&q=80';
    } else {
      if (name.includes('Tomat')) return UGLY_INGREDIENT_LINKS['tomat-bengkok'];
      if (name.includes('Pisang')) return UGLY_INGREDIENT_LINKS['pisang-berbintik'];
      if (name.includes('Mangga')) return UGLY_INGREDIENT_LINKS['mangga-mungil'];
      if (name.includes('Wortel')) return UGLY_INGREDIENT_LINKS['wortel-bercabang'];
      if (name.includes('Stroberi')) return UGLY_INGREDIENT_LINKS['stroberi-penyok'];
      if (name.includes('Apel')) return UGLY_INGREDIENT_LINKS['apel-mungil'];
      return 'https://images.unsplash.com/photo-1566842600175-97dca489844f?auto=format&fit=crop&w=400&q=80';
    }
  };

  const handleOpenAdjustModal = (
    kategori: 'Bahan Baku' | 'Produk Jadi',
    nama: string,
    satuan: string,
    stokSekarang: number
  ) => {
    setModalItem({ kategori, nama, satuan, stokSekarang });
    setAdjustType('Kurang');
    setAdjustAmount('');
    setAdjustReason('Susut saat penyimpanan chiller');
    setModalError('');
  };

  const handleSaveAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalItem) return;

    if (!adjustAmount || Number(adjustAmount) <= 0) {
      setModalError('Jumlah penyesuaian harus lebih dari 0.');
      return;
    }

    if (!adjustReason.trim()) {
      setModalError('Alasan penyesuaian wajib diisi.');
      return;
    }

    const numAmount = Number(adjustAmount);

    if (adjustType === 'Kurang' && numAmount > modalItem.stokSekarang) {
      setModalError(
        `Jumlah pengurangan (${numAmount} ${modalItem.satuan}) tidak boleh melebihi stok yang ada (${modalItem.stokSekarang} ${modalItem.satuan}).`
      );
      return;
    }

    if (modalItem.kategori === 'Bahan Baku') {
      adjustMaterialStock(modalItem.nama, adjustType, numAmount, adjustReason.trim());
    } else {
      adjustProductStock(modalItem.nama, adjustType, numAmount, adjustReason.trim());
    }

    setToastMessage(
      `Stok ${modalItem.nama} berhasil disesuaikan (${adjustType === 'Tambah' ? '+' : '-'}${numAmount} ${
        modalItem.satuan
      })`
    );
    setTimeout(() => setToastMessage(null), 3500);
    setModalItem(null);
  };

  // Filter Log Pergerakan Stok
  const filteredLogs = useMemo(() => {
    return stockLogs.filter((log) => {
      const matchCat = logFilter === 'Semua' || log.kategoriItem === logFilter;
      const matchSearch =
        log.item.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.alasan.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.sumber.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [stockLogs, logFilter, searchQuery]);

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-200">
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
              Gudang & Inventaris
            </span>
            <span className="text-xs text-[#6E6E73]">· Dapur Ugly2Yummy</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1D1D1F]">
            Stok Bahan & Produk Jadi
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[#6E6E73] max-w-xl">
            Monitoring ketersediaan bahan layak hasil seleksi dan stok produk jadi yang tersimpan di gudang siap kirim.
          </p>
        </div>

        {/* Tab Switcher Utama */}
        <div className="flex items-center p-1 bg-white rounded-2xl border border-[#E8E8ED] self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('bahan')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'bahan'
                ? 'bg-[#1D1D1F] text-white shadow-xs'
                : 'text-[#6E6E73] hover:text-[#1D1D1F]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Bahan Baku ({materialStocks.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('produk')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'produk'
                ? 'bg-[#1D1D1F] text-white shadow-xs'
                : 'text-[#6E6E73] hover:text-[#1D1D1F]'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Produk Jadi ({inventory.length})</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          TAB 1: BAHAN BAKU
          ========================================================================= */}
      {activeTab === 'bahan' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {materialStocks.map((item) => {
              const isLowStock = item.sisaLayakKg < 5;
              const usedPercent =
                item.totalLayakKg > 0
                  ? Math.min(100, Math.round((item.terpakaiProduksiKg / item.totalLayakKg) * 100))
                  : 0;

              return (
                <div
                  key={item.namaBahan}
                  className="bg-white rounded-3xl border border-[#E8E8ED] p-5 space-y-4 hover:border-[#2E7D4F]/30 transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Header Card */}
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl overflow-hidden bg-[#F5F5F7] border border-[#E8E8ED] shrink-0">
                          <SmartImage
                            src={getItemThumbnail(item.namaBahan, false)}
                            alt={item.namaBahan}
                            fallbackEmoji="🌱"
                            aspectRatio="1:1"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <span className="text-[10px] font-semibold text-[#6E6E73] px-2 py-0.5 rounded-full bg-[#F5F5F7] border border-[#E8E8ED]">
                            {item.jenis}
                          </span>
                          <h3 className="text-sm font-bold text-[#1D1D1F] mt-1">{item.namaBahan}</h3>
                        </div>
                      </div>

                      {/* Badge Low Stock */}
                      {isLowStock ? (
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 shrink-0 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>Stok menipis</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#EBF4EE] text-[#2E7D4F] border border-[#2E7D4F]/20">
                          Tersedia
                        </span>
                      )}
                    </div>

                    {/* Stock Big Number */}
                    <div className="p-3.5 rounded-2xl bg-[#FBFBFD] border border-[#E8E8ED] my-3">
                      <span className="text-[10px] font-semibold text-[#6E6E73] block">
                        Stok Layak Siap Olah
                      </span>
                      <div className="flex items-baseline gap-1.5 mt-0.5">
                        <span
                          className={`text-3xl font-extrabold tracking-tight ${
                            isLowStock ? 'text-red-600' : 'text-[#2E7D4F]'
                          }`}
                        >
                          {item.sisaLayakKg}
                        </span>
                        <span className="text-xs font-semibold text-[#6E6E73]">kg</span>
                      </div>
                    </div>

                    {/* Progress Bar & Sub-metrics */}
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between text-[11px] text-[#6E6E73]">
                        <span>Terpakai Produksi:</span>
                        <span className="font-semibold text-[#1D1D1F]">
                          {item.terpakaiProduksiKg} / {item.totalLayakKg} kg ({usedPercent}%)
                        </span>
                      </div>
                      <div className="w-full h-2 bg-[#E8E8ED] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#2E7D4F] rounded-full transition-all duration-300"
                          style={{ width: `${usedPercent}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-[#6E6E73] pt-1">
                        <span>Total Masuk: {item.totalMasukKg} kg</span>
                        <span>Kompos: {item.totalKomposKg} kg</span>
                      </div>
                    </div>
                  </div>

                  {/* Tombol Sesuaikan Stok */}
                  <div className="pt-2 border-t border-[#E8E8ED]">
                    <button
                      type="button"
                      onClick={() =>
                        handleOpenAdjustModal('Bahan Baku', item.namaBahan, 'kg', item.sisaLayakKg)
                      }
                      className="w-full py-2.5 rounded-xl bg-[#F5F5F7] hover:bg-[#E8E8ED] text-[#1D1D1F] text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5 text-[#6E6E73]" />
                      <span>Sesuaikan Stok</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: PRODUK JADI
          ========================================================================= */}
      {activeTab === 'produk' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {inventory.map((item) => {
              const isLowStock = item.jumlah < 10;
              const lastBatchId = getLastBatchForProduct(item.namaProduk);

              return (
                <div
                  key={item.namaProduk}
                  className="bg-white rounded-3xl border border-[#E8E8ED] p-5 space-y-4 hover:border-[#2E7D4F]/30 transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Header Card */}
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl overflow-hidden bg-[#F5F5F7] border border-[#E8E8ED] shrink-0">
                          <SmartImage
                            src={getItemThumbnail(item.namaProduk, true)}
                            alt={item.namaProduk}
                            fallbackEmoji="📦"
                            aspectRatio="1:1"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <span className="text-[10px] font-mono text-[#6E6E73] bg-[#F5F5F7] px-2 py-0.5 rounded-md border border-[#E8E8ED]">
                            Batch {lastBatchId}
                          </span>
                          <h3 className="text-sm font-bold text-[#1D1D1F] mt-1">{item.namaProduk}</h3>
                        </div>
                      </div>

                      {isLowStock ? (
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 shrink-0 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>Stok menipis</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#EBF4EE] text-[#2E7D4F] border border-[#2E7D4F]/20">
                          Tersedia
                        </span>
                      )}
                    </div>

                    {/* Stock Big Number */}
                    <div className="p-3.5 rounded-2xl bg-[#FBFBFD] border border-[#E8E8ED] my-3">
                      <span className="text-[10px] font-semibold text-[#6E6E73] block">
                        Ketersediaan Siap Jual
                      </span>
                      <div className="flex items-baseline gap-1.5 mt-0.5">
                        <span
                          className={`text-3xl font-extrabold tracking-tight ${
                            isLowStock ? 'text-red-600' : 'text-[#1D1D1F]'
                          }`}
                        >
                          {item.jumlah}
                        </span>
                        <span className="text-xs font-semibold text-[#6E6E73]">{item.satuan}</span>
                      </div>
                    </div>

                    {/* Storage Info */}
                    <div className="space-y-1.5 text-xs text-[#6E6E73]">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <Warehouse className="w-3 h-3 text-[#6E6E73]" />
                          Lokasi:
                        </span>
                        <span className="font-semibold text-[#1D1D1F] truncate max-w-[170px]">
                          {item.lokasiPenyimpanan}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span>Pembaruan:</span>
                        <span>{item.terakhirDiperbarui}</span>
                      </div>
                    </div>
                  </div>

                  {/* Tombol Sesuaikan Stok */}
                  <div className="pt-2 border-t border-[#E8E8ED]">
                    <button
                      type="button"
                      onClick={() =>
                        handleOpenAdjustModal('Produk Jadi', item.namaProduk, item.satuan, item.jumlah)
                      }
                      className="w-full py-2.5 rounded-xl bg-[#F5F5F7] hover:bg-[#E8E8ED] text-[#1D1D1F] text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5 text-[#6E6E73]" />
                      <span>Sesuaikan Stok</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          BAGIAN 2: RIWAYAT PERGERAKAN STOK (AUDIT TRAIL)
          ========================================================================= */}
      <div className="bg-white rounded-3xl border border-[#E8E8ED] p-5 sm:p-7 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E8ED]">
          <div>
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-[#2E7D4F]" />
              <h2 className="text-base font-bold text-[#1D1D1F]">Riwayat Pergerakan Stok</h2>
            </div>
            <p className="text-xs text-[#6E6E73] mt-0.5">
              Jejak audit alokasi masuk dari seleksi, konsumsi produksi, dan penyesuaian manual
            </p>
          </div>

          {/* Sub-Filter Log */}
          <div className="flex items-center gap-2">
            <div className="flex items-center p-1 bg-[#F5F5F7] rounded-xl border border-[#E8E8ED]">
              {(['Semua', 'Bahan Baku', 'Produk Jadi'] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setLogFilter(cat)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    logFilter === cat
                      ? 'bg-white text-[#1D1D1F] shadow-xs'
                      : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative w-44">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#6E6E73]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari item/alasan..."
                className="w-full pl-8 pr-2.5 py-1 text-xs rounded-xl bg-[#F5F5F7] border border-[#E8E8ED] outline-none"
              />
            </div>
          </div>
        </div>

        {/* Tabel Riwayat */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#E8E8ED] bg-[#FBFBFD] text-[10px] font-semibold text-[#6E6E73] uppercase tracking-wider">
                <th className="py-3 px-3">Waktu</th>
                <th className="py-3 px-3">Item / Komoditas</th>
                <th className="py-3 px-3">Tipe</th>
                <th className="py-3 px-3 text-right">Jumlah</th>
                <th className="py-3 px-3">Sumber</th>
                <th className="py-3 px-3">Alasan / Catatan</th>
                <th className="py-3 px-3">Staf</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E8ED]">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[#6E6E73]">
                    Tidak ada catatan pergerakan stok.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#FBFBFD] transition-colors">
                    <td className="py-3 px-3 whitespace-nowrap text-[#6E6E73]">
                      <span>{log.tanggal}</span>
                      <span className="block text-[10px] text-[#6E6E73]/70">{log.jam}</span>
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-bold text-[#1D1D1F]">{log.item}</p>
                      <span className="text-[10px] text-[#6E6E73]">{log.kategoriItem}</span>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          log.tipe === 'Masuk'
                            ? 'bg-[#EBF4EE] text-[#2E7D4F] border-[#2E7D4F]/20'
                            : 'bg-red-50 text-red-700 border-red-200'
                        }`}
                      >
                        {log.tipe === 'Masuk' ? (
                          <ArrowDownRight className="w-3 h-3" />
                        ) : (
                          <ArrowUpRight className="w-3 h-3" />
                        )}
                        <span>{log.tipe}</span>
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right whitespace-nowrap font-extrabold text-[#1D1D1F]">
                      <span className={log.tipe === 'Masuk' ? 'text-[#2E7D4F]' : 'text-red-600'}>
                        {log.tipe === 'Masuk' ? '+' : '-'}
                        {log.jumlah} {log.satuan}
                      </span>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#F5F5F7] border border-[#E8E8ED] text-[#1D1D1F]">
                        {log.sumber}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[#6E6E73] max-w-xs">{log.alasan}</td>
                    <td className="py-3 px-3 text-[#6E6E73] whitespace-nowrap">{log.staf}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* =========================================================================
          MODAL: SESUAIKAN STOK
          ========================================================================= */}
      {modalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setModalItem(null)}
          />

          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl z-10 border border-[#E8E8ED] space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E8ED]">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#2E7D4F]" />
                <h3 className="text-base font-bold text-[#1D1D1F]">Sesuaikan Stok Fisik</h3>
              </div>
              <button
                type="button"
                onClick={() => setModalItem(null)}
                className="p-1 rounded-full hover:bg-[#F5F5F7] text-[#6E6E73] hover:text-[#1D1D1F] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Info Item */}
            <div className="p-3.5 rounded-2xl bg-[#FBFBFD] border border-[#E8E8ED] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-semibold text-[#6E6E73] block">
                  {modalItem.kategori}
                </span>
                <p className="text-sm font-bold text-[#1D1D1F]">{modalItem.nama}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-[#6E6E73] block">Stok Sekarang</span>
                <p className="text-base font-extrabold text-[#1D1D1F]">
                  {modalItem.stokSekarang} {modalItem.satuan}
                </p>
              </div>
            </div>

            {modalError && (
              <div className="p-3 rounded-2xl bg-red-50 text-red-700 text-xs border border-red-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleSaveAdjustment} className="space-y-4">
              {/* Tipe Penyesuaian: Tambah / Kurang */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1D1D1F] block">Jenis Aksi</label>
                <div className="p-1 bg-[#F5F5F7] rounded-2xl flex border border-[#E8E8ED]">
                  <button
                    type="button"
                    onClick={() => setAdjustType('Kurang')}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      adjustType === 'Kurang'
                        ? 'bg-white text-red-600 shadow-xs'
                        : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                    }`}
                  >
                    <Minus className="w-3.5 h-3.5" />
                    <span>Kurangi (-)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAdjustType('Tambah')}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      adjustType === 'Tambah'
                        ? 'bg-white text-[#2E7D4F] shadow-xs'
                        : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah (+)</span>
                  </button>
                </div>
              </div>

              {/* Jumlah Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1D1D1F] block">
                  Jumlah Penyesuaian ({modalItem.satuan})
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="any"
                    min="0.1"
                    value={adjustAmount}
                    onChange={(e) =>
                      setAdjustAmount(e.target.value === '' ? '' : Number(e.target.value))
                    }
                    placeholder="0"
                    className="w-full px-3.5 py-2.5 pr-12 rounded-xl border border-[#E8E8ED] bg-[#F5F5F7] text-sm font-bold text-[#1D1D1F] focus:bg-white focus:border-[#2E7D4F] outline-none"
                    required
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#6E6E73] font-semibold">
                    {modalItem.satuan}
                  </span>
                </div>
              </div>

              {/* Alasan Wajib */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#1D1D1F] block">
                    Alasan Penyesuaian (Wajib)
                  </label>
                  <span className="text-[10px] text-[#6E6E73]">Untuk jejak audit</span>
                </div>
                <input
                  type="text"
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  placeholder="Contoh: Susut saat penyimpanan, koreksi fisik timbangan..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E8ED] bg-[#F5F5F7] text-xs text-[#1D1D1F] focus:bg-white focus:border-[#2E7D4F] outline-none"
                  required
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalItem(null)}
                  className="flex-1 py-2.5 rounded-full bg-[#F5F5F7] hover:bg-[#E8E8ED] text-[#1D1D1F] text-xs font-semibold transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-full bg-[#2E7D4F] hover:bg-[#256640] text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
