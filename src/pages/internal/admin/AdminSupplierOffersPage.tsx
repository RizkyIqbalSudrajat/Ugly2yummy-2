import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminData } from '../../../context/AdminDataContext';
import { SupplierOfferStatus } from '../../../types/admin';
import { AdminStatusBadge } from '../../../components/internal/AdminStatusBadge';
import { SmartImage } from '../../../components/ui/SmartImage';
import {
  Search,
  Filter,
  FileText,
  ChevronRight,
  TrendingUp,
  MapPin,
  Calendar,
  Sparkles,
} from 'lucide-react';

type TabStatusOption = 'Semua' | SupplierOfferStatus;

const TAB_OPTIONS: TabStatusOption[] = [
  'Semua',
  'Menunggu Persetujuan',
  'Negosiasi',
  'Disetujui',
  'Dijadwalkan',
  'Dikirim/Dijemput',
  'Selesai & Dibayar',
  'Ditolak',
];

export const AdminSupplierOffersPage: React.FC = () => {
  const { offers } = useAdminData();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<TabStatusOption>('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'Semua' | 'Sayur' | 'Buah' | 'Umbi' | 'Rempah'>('Semua');

  // Hitung jumlah item per tab
  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = { Semua: offers.length };
    TAB_OPTIONS.forEach((tab) => {
      if (tab !== 'Semua') {
        counts[tab] = offers.filter((o) => o.status === tab).length;
      }
    });
    return counts;
  }, [offers]);

  // Filter daftar penawaran
  const filteredOffers = useMemo(() => {
    return offers.filter((item) => {
      // Tab filter
      if (activeTab !== 'Semua' && item.status !== activeTab) {
        return false;
      }

      // Kategori filter
      if (categoryFilter !== 'Semua' && item.jenis !== categoryFilter) {
        return false;
      }

      // Pencarian kata kunci (nama bahan, supplier, kelompok tani, ID)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = item.namaBahan.toLowerCase().includes(q);
        const matchSupplier = item.supplierNama.toLowerCase().includes(q);
        const matchKelompok = item.kelompokTani.toLowerCase().includes(q);
        const matchId = item.id.toLowerCase().includes(q);
        const matchKota = item.kota.toLowerCase().includes(q);
        return matchName || matchSupplier || matchKelompok || matchId || matchKota;
      }

      return true;
    });
  }, [offers, activeTab, categoryFilter, searchQuery]);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const getTabLabel = (tab: TabStatusOption) => {
    switch (tab) {
      case 'Menunggu Persetujuan':
        return 'Menunggu';
      case 'Selesai & Dibayar':
        return 'Selesai';
      default:
        return tab;
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Header Info & Ringkasan */}
      <div className="bg-white rounded-3xl border border-[#E8E8ED] p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#EBF4EE] text-[#2E7D4F] border border-[#2E7D4F]/20 inline-flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Kurasi Bahan Baku Mitra Tani
            </span>
            <span className="text-xs text-[#6E6E73]">
              Total {offers.length} penawaran tercatat
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1D1D1F]">
            Penawaran Pasokan Bahan Baku
          </h1>
          <p className="text-xs sm:text-sm text-[#6E6E73] mt-1 max-w-2xl">
            Tinjau hasil panen imperfect dari kelompok tani mitra, lakukan persetujuan volume & harga, negosiasi, atau jadwalkan penjemputan logistik.
          </p>
        </div>

        {/* Quick stat card */}
        <div className="flex items-center gap-3 bg-[#F5F5F7] px-4 py-3 rounded-2xl border border-[#E8E8ED] self-start sm:self-auto shrink-0">
          <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm">
            {tabCounts['Menunggu Persetujuan'] || 0}
          </div>
          <div>
            <p className="text-xs font-bold text-[#1D1D1F]">Menunggu Peninjauan</p>
            <p className="text-[11px] text-[#6E6E73]">Butuh keputusan admin</p>
          </div>
        </div>
      </div>

      {/* Tabs Filter Bar (Horizontal scrollable on mobile) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {TAB_OPTIONS.map((tab) => {
          const count = tabCounts[tab] || 0;
          const isActive = activeTab === tab;

          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-[#1D1D1F] text-white shadow-xs'
                  : 'bg-white text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-[#F5F5F7] border border-[#E8E8ED]'
              }`}
            >
              <span>{getTabLabel(tab)}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-[#F5F5F7] text-[#6E6E73]'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search and Category Filter Toolbar */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#E8E8ED] p-3.5 sm:p-4 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#8E8E93] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari ID, bahan, atau nama supplier..."
            className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm rounded-xl sm:rounded-full bg-[#F5F5F7] border-0 focus:outline-hidden focus:ring-2 focus:ring-[#2E7D4F]/30 text-[#1D1D1F] placeholder:text-[#8E8E93]"
          />
        </div>

        {/* Category Pills Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-[11px] font-semibold text-[#8E8E93] mr-1 hidden sm:inline flex items-center gap-1">
            <Filter className="w-3 h-3" />
            Jenis:
          </span>
          {(['Semua', 'Sayur', 'Buah', 'Umbi', 'Rempah'] as const).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer shrink-0 ${
                categoryFilter === cat
                  ? 'bg-[#EBF4EE] text-[#2E7D4F] font-semibold border border-[#2E7D4F]/30'
                  : 'text-[#6E6E73] hover:bg-[#F5F5F7]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content: Desktop Table & Mobile Cards */}
      {filteredOffers.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#E8E8ED] p-12 text-center shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-[#F5F5F7] text-[#8E8E93] flex items-center justify-center mx-auto mb-3">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-[#1D1D1F]">Tidak ada penawaran ditemukan</h3>
          <p className="text-xs text-[#6E6E73] mt-1">
            {searchQuery
              ? `Tidak ada penawaran yang cocok dengan "${searchQuery}".`
              : 'Belum ada data penawaran pada kategori atau status ini.'}
          </p>
          {(searchQuery || categoryFilter !== 'Semua' || activeTab !== 'Semua') && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setCategoryFilter('Semua');
                setActiveTab('Semua');
              }}
              className="mt-4 px-4 py-2 text-xs font-semibold rounded-full bg-[#1D1D1F] text-white hover:bg-[#2E7D4F] transition-colors cursor-pointer"
            >
              Reset Filter
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Desktop Table View (Hidden on mobile) */}
          <div className="hidden md:block bg-white rounded-3xl border border-[#E8E8ED] overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#E8E8ED] bg-[#FBFBFD] text-[#6E6E73] font-semibold">
                  <th className="py-3.5 px-4">ID</th>
                  <th className="py-3.5 px-4">Bahan Baku</th>
                  <th className="py-3.5 px-4">Supplier & Kelompok</th>
                  <th className="py-3.5 px-4 text-right">Volume (kg)</th>
                  <th className="py-3.5 px-4 text-right">Harga / kg</th>
                  <th className="py-3.5 px-4 text-right">Total Nilai</th>
                  <th className="py-3.5 px-4">Tanggal Masuk</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E8ED]/70">
                {filteredOffers.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => navigate(`/internal/admin/penawaran/${item.id}`)}
                    className="hover:bg-[#F5FBF7]/60 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4 font-mono font-semibold text-[#1D1D1F] group-hover:text-[#2E7D4F]">
                      {item.id}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-[#E8E8ED] bg-[#F5F5F7]">
                          <SmartImage
                            src={item.foto}
                            alt={item.namaBahan}
                            aspectRatio="1:1"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-[#1D1D1F] group-hover:text-[#2E7D4F] transition-colors truncate">
                            {item.namaBahan}
                          </p>
                          <span className="text-[10px] text-[#8E8E93] bg-[#F5F5F7] px-2 py-0.5 rounded-full inline-block mt-0.5">
                            {item.jenis}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-[#1D1D1F]">{item.supplierNama}</p>
                      <p className="text-[11px] text-[#6E6E73] truncate">{item.kelompokTani}</p>
                      <p className="text-[10px] text-[#8E8E93] flex items-center gap-1 mt-0.5">
                        <MapPin className="w-2.5 h-2.5" />
                        {item.kota}
                      </p>
                    </td>

                    <td className="py-3.5 px-4 text-right font-bold text-[#1D1D1F]">
                      {item.beratTersediaKg} <span className="font-normal text-[#6E6E73]">kg</span>
                    </td>

                    <td className="py-3.5 px-4 text-right text-[#2E7D4F] font-semibold">
                      {formatRupiah(item.hargaKesepakatanPerKg || item.hargaTawarPerKg)}
                    </td>

                    <td className="py-3.5 px-4 text-right font-bold text-[#1D1D1F]">
                      {formatRupiah(
                        item.beratTersediaKg *
                          (item.hargaKesepakatanPerKg || item.hargaTawarPerKg)
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-[#6E6E73]">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#8E8E93]" />
                        {item.tanggalDiajukan}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <AdminStatusBadge status={item.status} size="sm" />
                    </td>

                    <td className="py-3.5 px-3 text-right">
                      <ChevronRight className="w-4 h-4 text-[#8E8E93] group-hover:text-[#2E7D4F] group-hover:translate-x-0.5 transition-all" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards View (Hidden on desktop) */}
          <div className="md:hidden space-y-3">
            {filteredOffers.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate(`/internal/admin/penawaran/${item.id}`)}
                className="bg-white rounded-2xl border border-[#E8E8ED] p-4 shadow-xs active:bg-[#F5FBF7] transition-colors cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="font-mono text-[11px] font-bold text-[#6E6E73]">
                    {item.id}
                  </span>
                  <AdminStatusBadge status={item.status} size="sm" />
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-[#E8E8ED] bg-[#F5F5F7]">
                    <SmartImage
                      src={item.foto}
                      alt={item.namaBahan}
                      aspectRatio="1:1"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-bold text-[#1D1D1F] truncate group-hover:text-[#2E7D4F]">
                      {item.namaBahan}
                    </h3>
                    <p className="text-xs text-[#6E6E73] truncate mt-0.5">
                      {item.supplierNama} · {item.kelompokTani}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5 text-xs">
                      <span className="font-bold text-[#1D1D1F]">
                        {item.beratTersediaKg} kg
                      </span>
                      <span className="text-[#8E8E93]">·</span>
                      <span className="font-bold text-[#2E7D4F]">
                        {formatRupiah(item.hargaKesepakatanPerKg || item.hargaTawarPerKg)}/kg
                      </span>
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-[#8E8E93] shrink-0" />
                </div>

                <div className="mt-3 pt-2.5 border-t border-[#E8E8ED] flex items-center justify-between text-[11px] text-[#6E6E73]">
                  <span>Total {formatRupiah(item.beratTersediaKg * (item.hargaKesepakatanPerKg || item.hargaTawarPerKg))}</span>
                  <span>{item.tanggalDiajukan}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
