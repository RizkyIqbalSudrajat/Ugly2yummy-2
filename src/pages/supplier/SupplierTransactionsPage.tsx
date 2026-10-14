import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSupplierAuth } from '../../context/SupplierAuthContext';
import { SupplierOfferStatus } from '../../types/supplier';
import { SupplierStatusBadge } from '../../components/supplier/SupplierStatusBadge';
import { SmartImage } from '../../components/ui/SmartImage';
import {
  Receipt,
  Search,
  X,
  Filter,
  Calendar,
  ChevronRight,
  TrendingUp,
  Package,
  DollarSign,
  ArrowUpDown,
} from 'lucide-react';

export const SupplierTransactionsPage: React.FC = () => {
  const { offers } = useSupplierAuth();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('Semua');
  const [selectedStatus, setSelectedStatus] = useState<string>('Semua');

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Helper untuk mendapatkan status pembayaran
  const getPaymentStatus = (offer: (typeof offers)[0]) => {
    if (offer.pembayaran?.status === 'Lunas' || offer.status === 'Selesai & Dibayar') {
      return { label: 'Lunas', color: 'bg-[#EBF4EE] text-[#2E7D4F] border-[#2E7D4F]/25' };
    }
    if (offer.status === 'Dikirim/Dijemput' || offer.status === 'Dijadwalkan') {
      return { label: 'Diproses', color: 'bg-[#FEFBE8] text-[#A15C07] border-[#FDE272]' };
    }
    if (offer.status === 'Ditolak') {
      return { label: 'Dibatalkan', color: 'bg-[#FEF3F2] text-[#B42318] border-[#FECDCA]' };
    }
    return { label: 'Menunggu', color: 'bg-[#F5F5F7] text-[#6E6E73] border-[#E8E8ED]' };
  };

  // Filter daftar transaksi
  const filteredOffers = useMemo(() => {
    return offers.filter((offer) => {
      // Filter status
      if (selectedStatus !== 'Semua' && offer.status !== selectedStatus) {
        return false;
      }

      // Filter bulan
      if (selectedMonth !== 'Semua') {
        const tgl = offer.tanggalDiajukan.toLowerCase();
        if (selectedMonth === 'Oktober 2026' && !tgl.includes('okt')) return false;
        if (selectedMonth === 'September 2026' && !tgl.includes('sep')) return false;
      }

      // Filter pencarian
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = offer.namaBahan.toLowerCase().includes(query);
        const matchId = offer.id.toLowerCase().includes(query);
        if (!matchName && !matchId) return false;
      }

      return true;
    });
  }, [offers, selectedMonth, selectedStatus, searchQuery]);

  // Ringkasan kecil di atas (dihitung dinamis)
  const totalPenawaran = filteredOffers.length;
  const totalKg = filteredOffers.reduce((acc, o) => acc + o.jumlahKg, 0);
  const totalNilai = filteredOffers.reduce((acc, o) => acc + o.totalHarga, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* =====================================================================
          HEADER HALAMAN
          ===================================================================== */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1D1D1F]">
          Riwayat Transaksi
        </h1>
        <p className="mt-1 text-sm text-[#6E6E73]">
          Rekapitulasi gabungan seluruh penawaran komoditas panen, serah terima, dan status pencairan dana.
        </p>
      </div>

      {/* =====================================================================
          RINGKASAN KECIL DI ATAS (TOTAL PENAWARAN, TOTAL KG, TOTAL NILAI)
          ===================================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-3xl border border-[#E8E8ED] p-5 shadow-none">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-[#6E6E73]">Total Penawaran</span>
            <div className="w-8 h-8 rounded-full bg-[#F5F5F7] flex items-center justify-center text-[#2E7D4F]">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold tracking-tight text-[#1D1D1F]">
            {totalPenawaran} <span className="text-xs font-normal text-[#6E6E73]">item</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-[#E8E8ED] p-5 shadow-none">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-[#6E6E73]">Total Volume Bahan</span>
            <div className="w-8 h-8 rounded-full bg-[#EBF4EE] flex items-center justify-center text-[#2E7D4F]">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold tracking-tight text-[#1D1D1F]">
            {totalKg.toLocaleString('id-ID')} <span className="text-xs font-normal text-[#6E6E73]">kg</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-[#E8E8ED] p-5 shadow-none">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-[#6E6E73]">Total Nilai Transaksi</span>
            <div className="w-8 h-8 rounded-full bg-[#F5F5F7] flex items-center justify-center text-[#2E7D4F]">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold tracking-tight text-[#2E7D4F]">
            {formatRupiah(totalNilai)}
          </div>
        </div>
      </div>

      {/* =====================================================================
          FILTER BULAN, STATUS & PENCARIAN
          ===================================================================== */}
      <div className="bg-white rounded-3xl border border-[#E8E8ED] p-4 sm:p-5 shadow-none space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Input Pencarian */}
          <div className="sm:col-span-6 relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6E6E73]">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari ID transaksi atau nama bahan..."
              className="w-full pl-10 pr-9 py-2 rounded-2xl border border-[#E8E8ED] bg-[#F5F5F7] text-xs sm:text-sm text-[#1D1D1F] placeholder-[#6E6E73]/60 focus:border-[#2E7D4F] focus:bg-white focus:ring-2 focus:ring-[#2E7D4F]/15 outline-none transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#6E6E73] hover:text-[#1D1D1F]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter Bulan */}
          <div className="sm:col-span-3">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full px-3 py-2 rounded-2xl border border-[#E8E8ED] bg-[#F5F5F7] text-xs font-semibold text-[#1D1D1F] focus:border-[#2E7D4F] focus:bg-white focus:ring-2 focus:ring-[#2E7D4F]/15 outline-none transition-all cursor-pointer"
            >
              <option value="Semua">Semua Bulan</option>
              <option value="Oktober 2026">Oktober 2026</option>
              <option value="September 2026">September 2026</option>
            </select>
          </div>

          {/* Filter Status */}
          <div className="sm:col-span-3">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-2xl border border-[#E8E8ED] bg-[#F5F5F7] text-xs font-semibold text-[#1D1D1F] focus:border-[#2E7D4F] focus:bg-white focus:ring-2 focus:ring-[#2E7D4F]/15 outline-none transition-all cursor-pointer"
            >
              <option value="Semua">Semua Status</option>
              <option value="Menunggu Persetujuan">Menunggu Persetujuan</option>
              <option value="Disetujui">Disetujui</option>
              <option value="Dijadwalkan">Dijadwalkan</option>
              <option value="Dikirim/Dijemput">Dikirim/Dijemput</option>
              <option value="Selesai & Dibayar">Selesai & Dibayar</option>
              <option value="Ditolak">Ditolak</option>
            </select>
          </div>
        </div>
      </div>

      {/* =====================================================================
          TABEL TRANSAKSI (DESKTOP) & KARTU (HP)
          ===================================================================== */}
      {filteredOffers.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#E8E8ED] p-12 text-center shadow-none">
          <p className="text-sm font-bold text-[#1D1D1F]">Tidak Ada Transaksi Sesuai Filter</p>
          <p className="text-xs text-[#6E6E73] mt-1">Coba sesuaikan kata kunci pencarian atau ubah filter status.</p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block bg-white rounded-3xl border border-[#E8E8ED] overflow-hidden shadow-none">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E8E8ED] bg-[#FBFBFD] text-[11px] uppercase tracking-wider text-[#6E6E73] font-semibold">
                  <th className="py-3.5 pl-6 pr-4">Tanggal</th>
                  <th className="py-3.5 px-4">ID Transaksi</th>
                  <th className="py-3.5 px-4">Bahan Panen</th>
                  <th className="py-3.5 px-4 text-right">Volume</th>
                  <th className="py-3.5 px-4 text-right">Total Nilai</th>
                  <th className="py-3.5 px-4">Status Penawaran</th>
                  <th className="py-3.5 px-4">Pembayaran</th>
                  <th className="py-3.5 pr-6 pl-2 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E8ED]/70 text-sm">
                {filteredOffers.map((offer) => {
                  const pay = getPaymentStatus(offer);
                  return (
                    <tr
                      key={offer.id}
                      onClick={() => navigate(`/supplier/penawaran/${offer.id}`)}
                      className="hover:bg-[#F5F5F7]/60 transition-colors cursor-pointer group"
                    >
                      <td className="py-4 pl-6 pr-4 text-xs text-[#6E6E73]">
                        {offer.tanggalDiajukan}
                      </td>
                      <td className="py-4 px-4 font-mono text-xs font-bold text-[#1D1D1F]">
                        {offer.id}
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-bold text-[#1D1D1F] block group-hover:text-[#2E7D4F] transition-colors">
                          {offer.namaBahan}
                        </span>
                        <span className="text-[11px] text-[#6E6E73]">{offer.jenisBahan}</span>
                      </td>
                      <td className="py-4 px-4 text-right font-semibold text-[#1D1D1F]">
                        {offer.jumlahKg} kg
                      </td>
                      <td className="py-4 px-4 text-right font-bold text-[#1D1D1F]">
                        {formatRupiah(offer.totalHarga)}
                      </td>
                      <td className="py-4 px-4">
                        <SupplierStatusBadge status={offer.status} size="sm" />
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${pay.color}`}
                        >
                          {pay.label}
                        </span>
                      </td>
                      <td className="py-4 pr-6 pl-2 text-right text-[#6E6E73] group-hover:text-[#2E7D4F]">
                        <ChevronRight className="w-4 h-4 inline-block group-hover:translate-x-0.5 transition-transform" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-3">
            {filteredOffers.map((offer) => {
              const pay = getPaymentStatus(offer);
              return (
                <div
                  key={offer.id}
                  onClick={() => navigate(`/supplier/penawaran/${offer.id}`)}
                  className="bg-white rounded-2xl border border-[#E8E8ED] p-4 space-y-3 active:scale-[0.99] transition-all cursor-pointer shadow-none"
                >
                  <div className="flex items-center justify-between gap-2 border-b border-[#E8E8ED]/60 pb-2">
                    <span className="font-mono text-xs font-bold text-[#1D1D1F]">
                      {offer.id}
                    </span>
                    <span className="text-xs text-[#6E6E73]">{offer.tanggalDiajukan}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-[#1D1D1F]">{offer.namaBahan}</h4>
                      <p className="text-xs text-[#6E6E73]">
                        {offer.jumlahKg} kg · {formatRupiah(offer.totalHarga)}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#6E6E73]" />
                  </div>

                  <div className="flex items-center justify-between pt-1 text-xs">
                    <SupplierStatusBadge status={offer.status} size="sm" />
                    <span
                      className={`font-semibold px-2 py-0.5 rounded-full border ${pay.color}`}
                    >
                      {pay.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
