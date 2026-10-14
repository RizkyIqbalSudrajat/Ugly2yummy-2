import React from 'react';
import { Link } from 'react-router-dom';
import { useSupplierAuth } from '../../context/SupplierAuthContext';
import { SupplierStatusBadge } from '../../components/supplier/SupplierStatusBadge';
import { Button } from '../../components/ui/Button';
import { SmartImage } from '../../components/ui/SmartImage';
import {
  PlusCircle,
  Clock,
  Leaf,
  Wallet,
  Activity,
  Calendar,
  Truck,
  ArrowRight,
  Phone,
  User,
  PackageCheck,
  ChevronRight,
} from 'lucide-react';

export const SupplierDashboardPage: React.FC = () => {
  const { supplier, offers } = useSupplierAuth();

  // Hitung metrik dinamis dari data penawaran
  const activeOffersCount = offers.filter(
    (o) => o.status !== 'Selesai & Dibayar' && o.status !== 'Ditolak'
  ).length;

  const pendingOffersCount = offers.filter(
    (o) => o.status === 'Menunggu Persetujuan'
  ).length;

  const completedOffers = offers.filter((o) => o.status === 'Selesai & Dibayar');
  const totalKgSaved = completedOffers.reduce((acc, o) => acc + o.jumlahKg, 0);
  const totalRevenue = completedOffers.reduce((acc, o) => acc + o.totalHarga, 0);

  // Cari jadwal terdekat dari penawaran berstatus 'Dijadwalkan' atau 'Dikirim/Dijemput'
  const upcomingScheduleOffer = offers.find(
    (o) => o.jadwal && (o.status === 'Dijadwalkan' || o.status === 'Dikirim/Dijemput')
  );

  // Ambil 4 penawaran terbaru
  const recentOffers = offers.slice(0, 4);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* =========================================================================
          1. HEADER SAPAAN & TOMBOL AJUKAN PENAWARAN
          ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#EBF4EE] text-[#2E7D4F] border border-[#2E7D4F]/20">
              {supplier?.kelompokTani || 'Kelompok Tani Sukamaju'}
            </span>
            <span className="text-xs text-[#6E6E73]">· Lembang, Jabar</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1D1D1F]">
            Halo, Pak Asep 👋
          </h1>
          <p className="mt-1 text-sm text-[#6E6E73] max-w-xl">
            Kelompok Tani Sukamaju terus aktif menyelamatkan panen buah & sayur unik berkualitas tinggi dari lereng Lembang.
          </p>
        </div>

        <div className="shrink-0">
          <Button
            to="/supplier/ajukan-penawaran"
            variant="primary"
            size="md"
            icon={<PlusCircle className="w-4 h-4" />}
          >
            Ajukan Penawaran
          </Button>
        </div>
      </div>

      {/* =========================================================================
          2. EMPAT KARTU STATISTIK (ANGKA DIHITUNG DINAMIS DARI DATA DUMMY)
          ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Kartu 1: Penawaran Aktif */}
        <div className="bg-white rounded-3xl border border-[#E8E8ED] p-5.5 hover:border-[#2E7D4F]/30 transition-colors shadow-none">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-[#6E6E73]">Penawaran Aktif</span>
            <div className="w-8 h-8 rounded-full bg-[#F5F5F7] text-[#1D1D1F] flex items-center justify-center">
              <Activity className="w-4 h-4 text-[#2E7D4F]" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1D1D1F]">
            {activeOffersCount}
          </div>
          <p className="text-[11px] text-[#6E6E73] mt-1.5">
            Sedang dalam alur penyerapan
          </p>
        </div>

        {/* Kartu 2: Menunggu Persetujuan */}
        <div className="bg-white rounded-3xl border border-[#E8E8ED] p-5.5 hover:border-[#FEDF89] transition-colors shadow-none">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-[#6E6E73]">Menunggu Persetujuan</span>
            <div className="w-8 h-8 rounded-full bg-[#FFF9EB] text-[#B54708] flex items-center justify-center border border-[#FEDF89]/50">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-[#B54708]">
            {pendingOffersCount}
          </div>
          <p className="text-[11px] text-[#6E6E73] mt-1.5">
            Dalam antrean kurasi mutu
          </p>
        </div>

        {/* Kartu 3: Bahan Terselamatkan (kg) */}
        <div className="bg-white rounded-3xl border border-[#E8E8ED] p-5.5 hover:border-[#2E7D4F]/30 transition-colors shadow-none">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-[#6E6E73]">Bahan Terselamatkan</span>
            <div className="w-8 h-8 rounded-full bg-[#EBF4EE] text-[#2E7D4F] flex items-center justify-center border border-[#2E7D4F]/20">
              <Leaf className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1D1D1F]">
            {totalKgSaved.toLocaleString('id-ID')} <span className="text-base font-semibold text-[#6E6E73]">kg</span>
          </div>
          <p className="text-[11px] text-[#2E7D4F] font-medium mt-1.5 flex items-center gap-1">
            <PackageCheck className="w-3.5 h-3.5" />
            <span>Hasil panen terserap penuh</span>
          </p>
        </div>

        {/* Kartu 4: Pendapatan Bulan Ini */}
        <div className="bg-white rounded-3xl border border-[#E8E8ED] p-5.5 hover:border-[#2E7D4F]/30 transition-colors shadow-none">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-[#6E6E73]">Pendapatan Terselesaikan</span>
            <div className="w-8 h-8 rounded-full bg-[#F5F5F7] text-[#1D1D1F] flex items-center justify-center">
              <Wallet className="w-4 h-4 text-[#2E7D4F]" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1D1D1F]">
            {formatRupiah(totalRevenue)}
          </div>
          <p className="text-[11px] text-[#6E6E73] mt-1.5">
            Tersalur ke BCA •••• 4821
          </p>
        </div>
      </div>

      {/* =========================================================================
          3. KARTU JADWAL TERDEKAT
          ========================================================================= */}
      {upcomingScheduleOffer?.jadwal && (
        <div className="bg-white rounded-3xl border border-[#E8E8ED] p-6 sm:p-7 shadow-none relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEF4FF] text-[#3538CD] text-xs font-semibold border border-[#C7D7FE]">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Jadwal Terdekat</span>
                </span>
                <span className="text-xs text-[#6E6E73]">
                  ID: {upcomingScheduleOffer.id}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1D1D1F]">
                  {upcomingScheduleOffer.namaBahan}
                </h2>
                <span className="text-sm font-semibold text-[#2E7D4F] bg-[#EBF4EE] px-2.5 py-0.5 rounded-full inline-block w-fit">
                  {upcomingScheduleOffer.jumlahKg} kg
                </span>
              </div>

              {/* Rincian Jadwal */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-1 text-xs text-[#1D1D1F]">
                <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-[#F5F5F7] border border-[#E8E8ED]/70">
                  <Calendar className="w-4 h-4 text-[#2E7D4F] shrink-0" />
                  <div>
                    <p className="text-[10px] text-[#6E6E73]">Waktu Serah Terima</p>
                    <p className="font-semibold">{upcomingScheduleOffer.jadwal.tanggal}, {upcomingScheduleOffer.jadwal.jam}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-[#F5F5F7] border border-[#E8E8ED]/70">
                  <Truck className="w-4 h-4 text-[#2E7D4F] shrink-0" />
                  <div>
                    <p className="text-[10px] text-[#6E6E73]">Metode Logistik</p>
                    <p className="font-semibold">{upcomingScheduleOffer.jadwal.metode}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-[#F5F5F7] border border-[#E8E8ED]/70">
                  <User className="w-4 h-4 text-[#2E7D4F] shrink-0" />
                  <div>
                    <p className="text-[10px] text-[#6E6E73]">Koordinator Tim</p>
                    <p className="font-semibold">{upcomingScheduleOffer.jadwal.petugas.nama}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tombol Menuju Jadwal */}
            <div className="shrink-0 flex items-center">
              <Button
                to="/supplier/jadwal"
                variant="secondary"
                size="md"
                icon={<ArrowRight className="w-4 h-4" />}
                iconPosition="right"
              >
                Lihat Jadwal Lengkap
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          4. SEKSI PENAWARAN TERBARU (4 ITEM DENGAN STATUS BADGE)
          ========================================================================= */}
      <div className="bg-white rounded-3xl border border-[#E8E8ED] p-6 sm:p-7 shadow-none space-y-5">
        <div className="flex items-center justify-between pb-2 border-b border-[#E8E8ED]/60">
          <div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-[#1D1D1F]">
              Penawaran Terbaru
            </h2>
            <p className="text-xs text-[#6E6E73] mt-0.5">
              Daftar penawaran bahan panen yang diajukan baru-baru ini.
            </p>
          </div>
          <Link
            to="/supplier/penawaran-saya"
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#2E7D4F] hover:underline"
          >
            <span>Lihat semua ({offers.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Daftar 4 Item Penawaran */}
        <div className="divide-y divide-[#E8E8ED]/70">
          {recentOffers.map((offer) => (
            <div
              key={offer.id}
              className="py-4 first:pt-1 last:pb-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#FBFBFD] -mx-2 px-2 rounded-2xl transition-colors"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                {/* Thumbnail Gambar */}
                <div className="w-13 h-13 rounded-2xl overflow-hidden bg-[#F5F5F7] border border-[#E8E8ED] shrink-0">
                  <SmartImage
                    src={offer.foto[0]}
                    alt={offer.namaBahan}
                    fallbackEmoji="🌱"
                    aspectRatio="1:1"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Detail Nama Bahan & Tanggal */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-bold text-[#1D1D1F] truncate">
                      {offer.namaBahan}
                    </p>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#F5F5F7] text-[#6E6E73] border border-[#E8E8ED]">
                      {offer.jenisBahan}
                    </span>
                  </div>
                  <p className="text-xs text-[#6E6E73] mt-0.5 flex items-center gap-2">
                    <span>{offer.id}</span>
                    <span>·</span>
                    <span>{offer.tanggalDiajukan}</span>
                  </p>
                </div>
              </div>

              {/* Detail Kuantitas, Total & Status Badge */}
              <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 shrink-0">
                <div className="text-left sm:text-right">
                  <p className="text-sm font-bold text-[#1D1D1F]">
                    {offer.jumlahKg} kg
                  </p>
                  <p className="text-xs text-[#6E6E73]">
                    {formatRupiah(offer.totalHarga)}
                  </p>
                </div>

                <div className="shrink-0">
                  <SupplierStatusBadge status={offer.status} size="sm" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
