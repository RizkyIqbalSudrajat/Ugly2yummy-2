import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupplierAuth } from '../../context/SupplierAuthContext';
import { SupplierOfferStatus } from '../../types/supplier';
import { SupplierStatusBadge } from '../../components/supplier/SupplierStatusBadge';
import { SmartImage } from '../../components/ui/SmartImage';
import { Button } from '../../components/ui/Button';
import {
  Search,
  X,
  PlusCircle,
  PackageSearch,
  ChevronRight,
  Filter,
} from 'lucide-react';

type TabFilter =
  | 'Semua'
  | 'Menunggu'
  | 'Disetujui'
  | 'Dijadwalkan'
  | 'Dikirim/Dijemput'
  | 'Selesai'
  | 'Ditolak';

export const SupplierMyOffersPage: React.FC = () => {
  const { offers } = useSupplierAuth();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<TabFilter>('Semua');

  // Mapping tab filter ke SupplierOfferStatus
  const tabStatusMap: Record<TabFilter, SupplierOfferStatus | null> = {
    Semua: null,
    Menunggu: 'Menunggu Persetujuan',
    Disetujui: 'Disetujui',
    Dijadwalkan: 'Dijadwalkan',
    'Dikirim/Dijemput': 'Dikirim/Dijemput',
    Selesai: 'Selesai & Dibayar',
    Ditolak: 'Ditolak',
  };

  // Hitung jumlah item tiap tab
  const tabCounts = useMemo(() => {
    return {
      Semua: offers.length,
      Menunggu: offers.filter((o) => o.status === 'Menunggu Persetujuan').length,
      Disetujui: offers.filter((o) => o.status === 'Disetujui').length,
      Dijadwalkan: offers.filter((o) => o.status === 'Dijadwalkan').length,
      'Dikirim/Dijemput': offers.filter((o) => o.status === 'Dikirim/Dijemput').length,
      Selesai: offers.filter((o) => o.status === 'Selesai & Dibayar').length,
      Ditolak: offers.filter((o) => o.status === 'Ditolak').length,
    };
  }, [offers]);

  // Filter hasil penawaran berdasarkan tab dan search query
  const filteredOffers = useMemo(() => {
    return offers.filter((offer) => {
      // Filter status
      const targetStatus = tabStatusMap[activeTab];
      if (targetStatus && offer.status !== targetStatus) {
        return false;
      }

      // Filter nama bahan / ID
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = offer.namaBahan.toLowerCase().includes(query);
        const matchId = offer.id.toLowerCase().includes(query);
        const matchType = offer.jenisBahan.toLowerCase().includes(query);
        if (!matchName && !matchId && !matchType) {
          return false;
        }
      }

      return true;
    });
  }, [offers, activeTab, searchQuery]);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const tabs: TabFilter[] = [
    'Semua',
    'Menunggu',
    'Disetujui',
    'Dijadwalkan',
    'Dikirim/Dijemput',
    'Selesai',
    'Ditolak',
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* =====================================================================
          HEADER HALAMAN & TOMBOL AJUKAN PENAWARAN
          ===================================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1D1D1F]">
            Penawaran Saya
          </h1>
          <p className="mt-1 text-sm text-[#6E6E73]">
            Pantau dan kelola seluruh komoditas bahan yang diajukan beserta status verifikasi kurasi.
          </p>
        </div>

        <div className="shrink-0">
          <Button
            to="/supplier/ajukan-penawaran"
            variant="primary"
            size="md"
            icon={<PlusCircle className="w-4 h-4" />}
          >
            Ajukan Penawaran Baru
          </Button>
        </div>
      </div>

      {/* =====================================================================
          KOLOM PENCARIAN & TAB FILTER SEGMENTED CONTROL
          ===================================================================== */}
      <div className="space-y-4">
        {/* Kolom Pencarian */}
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6E6E73]">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama bahan atau ID (contoh: Tomat, PNW-2026)..."
            className="w-full pl-10 pr-9 py-2.5 rounded-2xl border border-[#E8E8ED] bg-white text-sm text-[#1D1D1F] placeholder-[#6E6E73]/60 focus:border-[#2E7D4F] focus:ring-2 focus:ring-[#2E7D4F]/15 outline-none transition-all shadow-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#6E6E73] hover:text-[#1D1D1F] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Tab / Segmented Control */}
        <div className="overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="inline-flex items-center gap-1.5 p-1.5 bg-[#F5F5F7] rounded-full border border-[#E8E8ED] min-w-max">
            {tabs.map((tab) => {
              const count = tabCounts[tab];
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white text-[#1D1D1F] shadow-xs'
                      : 'text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-white/50'
                  }`}
                >
                  <span>{tab}</span>
                  <span
                    className={`text-[11px] px-1.5 py-0.2 rounded-full ${
                      isActive
                        ? 'bg-[#EBF4EE] text-[#2E7D4F]'
                        : 'bg-[#E8E8ED]/70 text-[#6E6E73]'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* =====================================================================
          KONTEN PENAWARAN: TABEL DESKTOP & DAFTAR KARTU HP
          ===================================================================== */}
      {filteredOffers.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-3xl border border-[#E8E8ED] p-12 text-center shadow-none">
          <div className="max-w-sm mx-auto space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#F5F5F7] border border-[#E8E8ED] text-[#6E6E73] flex items-center justify-center mx-auto">
              <PackageSearch className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#1D1D1F]">
              Tidak Ada Penawaran Ditemukan
            </h3>
            <p className="text-xs text-[#6E6E73] leading-relaxed">
              {searchQuery
                ? `Tidak ditemukan hasil yang cocok dengan kata kunci "${searchQuery}".`
                : `Belum ada penawaran dengan status "${activeTab}".`}
            </p>
            {(searchQuery || activeTab !== 'Semua') && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setActiveTab('Semua');
                }}
                className="mt-2 text-xs font-semibold text-[#2E7D4F] hover:underline cursor-pointer"
              >
                Reset Pencarian & Filter
              </button>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block bg-white rounded-3xl border border-[#E8E8ED] overflow-hidden shadow-none">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E8E8ED] bg-[#FBFBFD] text-[11px] uppercase tracking-wider text-[#6E6E73] font-semibold">
                  <th className="py-3.5 pl-6 pr-4">ID Penawaran</th>
                  <th className="py-3.5 px-4">Bahan Panen</th>
                  <th className="py-3.5 px-4 text-right">Jumlah</th>
                  <th className="py-3.5 px-4 text-right">Total Estimasi</th>
                  <th className="py-3.5 px-4">Diajukan</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 pr-6 pl-2 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E8ED]/70 text-sm">
                {filteredOffers.map((offer) => (
                  <tr
                    key={offer.id}
                    onClick={() => navigate(`/supplier/penawaran/${offer.id}`)}
                    className="hover:bg-[#F5F5F7]/60 transition-colors cursor-pointer group"
                  >
                    {/* ID */}
                    <td className="py-4 pl-6 pr-4 font-mono text-xs font-semibold text-[#1D1D1F]">
                      {offer.id}
                    </td>

                    {/* Bahan + Thumbnail */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#F5F5F7] border border-[#E8E8ED] shrink-0">
                          <SmartImage
                            src={offer.foto[0]}
                            alt={offer.namaBahan}
                            fallbackEmoji="🌱"
                            aspectRatio="1:1"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-[#1D1D1F] truncate group-hover:text-[#2E7D4F] transition-colors">
                            {offer.namaBahan}
                          </p>
                          <span className="text-[11px] text-[#6E6E73]">
                            {offer.jenisBahan}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Jumlah (kg) */}
                    <td className="py-4 px-4 text-right font-semibold text-[#1D1D1F]">
                      {offer.jumlahKg} kg
                    </td>

                    {/* Total (Rp) */}
                    <td className="py-4 px-4 text-right font-bold text-[#1D1D1F]">
                      {formatRupiah(offer.totalHarga)}
                    </td>

                    {/* Tanggal Diajukan */}
                    <td className="py-4 px-4 text-xs text-[#6E6E73]">
                      {offer.tanggalDiajukan}
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-4">
                      <SupplierStatusBadge status={offer.status} size="sm" />
                    </td>

                    {/* Arrow Action */}
                    <td className="py-4 pr-6 pl-2 text-right text-[#6E6E73] group-hover:text-[#2E7D4F] transition-colors">
                      <ChevronRight className="w-4 h-4 inline-block group-hover:translate-x-0.5 transition-transform" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List View */}
          <div className="md:hidden space-y-3">
            {filteredOffers.map((offer) => (
              <div
                key={offer.id}
                onClick={() => navigate(`/supplier/penawaran/${offer.id}`)}
                className="bg-white rounded-2xl border border-[#E8E8ED] p-4 space-y-3 hover:border-[#2E7D4F]/40 active:scale-[0.99] transition-all cursor-pointer shadow-none"
              >
                {/* Header Card: ID, Tanggal & Status */}
                <div className="flex items-center justify-between gap-2 border-b border-[#E8E8ED]/60 pb-2.5">
                  <div className="flex items-center gap-1.5 text-xs text-[#6E6E73]">
                    <span className="font-mono font-bold text-[#1D1D1F]">{offer.id}</span>
                    <span>·</span>
                    <span>{offer.tanggalDiajukan}</span>
                  </div>
                  <SupplierStatusBadge status={offer.status} size="sm" />
                </div>

                {/* Body Card: Thumbnail, Nama Bahan, Total */}
                <div className="flex items-center gap-3">
                  <div className="w-13 h-13 rounded-xl overflow-hidden bg-[#F5F5F7] border border-[#E8E8ED] shrink-0">
                    <SmartImage
                      src={offer.foto[0]}
                      alt={offer.namaBahan}
                      fallbackEmoji="🌱"
                      aspectRatio="1:1"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-[#1D1D1F] truncate">
                        {offer.namaBahan}
                      </h3>
                      <ChevronRight className="w-4 h-4 text-[#6E6E73] shrink-0" />
                    </div>
                    <span className="text-[11px] text-[#6E6E73]">{offer.jenisBahan}</span>
                    <div className="flex items-center justify-between mt-1 text-xs">
                      <span className="text-[#6E6E73]">{offer.jumlahKg} kg</span>
                      <span className="font-bold text-[#2E7D4F]">
                        {formatRupiah(offer.totalHarga)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
