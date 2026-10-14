import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSupplierAuth } from '../../context/SupplierAuthContext';
import { SupplierOfferStatus } from '../../types/supplier';
import { SupplierStatusBadge } from '../../components/supplier/SupplierStatusBadge';
import { SmartImage } from '../../components/ui/SmartImage';
import { Button } from '../../components/ui/Button';
import {
  ArrowLeft,
  Calendar,
  Clock,
  CheckCircle2,
  Truck,
  Building2,
  DollarSign,
  MapPin,
  Tag,
  AlertCircle,
  RotateCcw,
  Phone,
  MessageSquare,
  FileText,
  CreditCard,
  Check,
  ChevronRight,
} from 'lucide-react';

const STEPPER_STAGES: SupplierOfferStatus[] = [
  'Menunggu Persetujuan',
  'Disetujui',
  'Dijadwalkan',
  'Dikirim/Dijemput',
  'Selesai & Dibayar',
];

export const SupplierOfferDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { offers } = useSupplierAuth();
  const navigate = useNavigate();

  const offer = offers.find((o) => o.id === id);

  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  if (!offer) {
    return (
      <div className="bg-white rounded-3xl border border-[#E8E8ED] p-12 text-center max-w-lg mx-auto space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-[#F5F5F7] border border-[#E8E8ED] flex items-center justify-center mx-auto text-[#6E6E73]">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-[#1D1D1F]">Penawaran Tidak Ditemukan</h2>
        <p className="text-sm text-[#6E6E73]">
          Penawaran dengan ID {id} tidak ditemukan dalam basis data supplier.
        </p>
        <Button to="/supplier/penawaran-saya" variant="primary" size="md">
          Kembali ke Penawaran Saya
        </Button>
      </div>
    );
  }

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Cek indeks tahap saat ini
  const isRejected = offer.status === 'Ditolak';
  const currentStageIndex = STEPPER_STAGES.indexOf(offer.status);

  // Cari tanggal riwayat status
  const getStageDate = (stage: SupplierOfferStatus) => {
    const found = offer.riwayatStatus.find((r) => r.tahap === stage);
    return found ? found.tanggal : null;
  };

  const handleReapply = () => {
    navigate('/supplier/ajukan-penawaran', {
      state: {
        prefillOffer: {
          namaBahan: `${offer.namaBahan} (Pengajuan Ulang)`,
          jenisBahan: offer.jenisBahan,
          jumlahKg: offer.jumlahKg,
          kondisi: offer.kondisi,
          catatanKondisi: offer.catatanKondisi,
          hargaPerKg: offer.hargaPerKg,
          lokasiPengambilan: offer.lokasiPengambilan,
          pesanPenawaran: `Pengajuan ulang untuk komoditas ${offer.namaBahan} setelah penyortiran ulang kebun.`,
        },
      },
    });
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-200">
      {/* =====================================================================
          1. HEADER ATAS (TOMBOL KEMBALI, ID, NAMA, STATUS)
          ===================================================================== */}
      <div className="space-y-4">
        <Link
          to="/supplier/penawaran-saya"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#6E6E73] hover:text-[#1D1D1F] transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Kembali ke Penawaran Saya</span>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E8E8ED]/70">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="font-mono text-xs font-bold text-[#6E6E73] bg-[#F5F5F7] px-2.5 py-1 rounded-full border border-[#E8E8ED]">
                {offer.id}
              </span>
              <span className="text-xs text-[#6E6E73]">
                Diajukan pada {offer.tanggalDiajukan}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1D1D1F] mt-1.5">
              {offer.namaBahan}
            </h1>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <SupplierStatusBadge status={offer.status} size="md" />
          </div>
        </div>
      </div>

      {/* =====================================================================
          2. STEPPER STATUS PENAWARAN (HORIZONTAL DI DESKTOP / VERTIKAL DI HP)
             ATAU KARTU PENAWARAN DITOLAK
          ===================================================================== */}
      {isRejected ? (
        /* Tampilan Khusus Jika Ditolak */
        <div className="bg-[#FEF3F2] rounded-3xl border border-[#FECDCA] p-6 sm:p-8 space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-[#FEE4E2] text-[#B42318] flex items-center justify-center shrink-0 border border-[#FECDCA]">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="space-y-1.5 flex-1">
              <h2 className="text-base font-bold text-[#B42318]">
                Penawaran Tidak Dapat Disetujui
              </h2>
              <p className="text-xs sm:text-sm text-[#7A271A] leading-relaxed">
                {offer.alasanPenolakan ||
                  'Komoditas belum memenuhi batas toleransi mutu fisik aman untuk lini pengolahan artisan kami.'}
              </p>
              {offer.catatanAdmin && (
                <p className="text-xs text-[#7A271A]/80 italic mt-1">
                  Catatan Tim QC: "{offer.catatanAdmin}"
                </p>
              )}
            </div>
          </div>

          <div className="pt-2 border-t border-[#FECDCA]/60 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-[#7A271A]">
              Anda dapat melakukan sortir ulang hasil panen dan mengajukan kembali dengan foto kondisi terbaru.
            </p>
            <Button
              type="button"
              onClick={handleReapply}
              variant="primary"
              size="sm"
              icon={<RotateCcw className="w-3.5 h-3.5" />}
            >
              Ajukan Ulang Penawaran
            </Button>
          </div>
        </div>
      ) : (
        /* Stepper Tahap Normal */
        <div className="bg-white rounded-3xl border border-[#E8E8ED] p-6 sm:p-8 shadow-none space-y-6">
          <div className="flex items-center justify-between border-b border-[#E8E8ED]/60 pb-3">
            <div>
              <h2 className="text-sm font-bold text-[#1D1D1F]">
                Alur Tahapan Penawaran
              </h2>
              <p className="text-xs text-[#6E6E73]">
                Pelacakan langsung proses verifikasi hingga pencairan pembayaran.
              </p>
            </div>
            <span className="text-xs font-semibold text-[#2E7D4F] bg-[#EBF4EE] px-2.5 py-0.5 rounded-full border border-[#2E7D4F]/20">
              Tahap {currentStageIndex + 1} dari 5
            </span>
          </div>

          {/* Stepper Horizontal (Desktop) */}
          <div className="hidden lg:grid grid-cols-5 gap-3 relative">
            {STEPPER_STAGES.map((stage, idx) => {
              const isPast = idx < currentStageIndex;
              const isCurrent = idx === currentStageIndex;
              const stageDate = getStageDate(stage);

              return (
                <div key={stage} className="relative flex flex-col items-center text-center space-y-2">
                  {/* Step Connector Line */}
                  {idx > 0 && (
                    <div
                      className={`absolute top-4 -left-1/2 w-full h-[2px] -z-0 ${
                        idx <= currentStageIndex ? 'bg-[#2E7D4F]' : 'bg-[#E8E8ED]'
                      }`}
                    />
                  )}

                  {/* Step Circle Indicator */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold z-10 transition-colors shadow-xs ${
                      isPast
                        ? 'bg-[#2E7D4F] text-white ring-4 ring-[#EBF4EE]'
                        : isCurrent
                        ? 'bg-[#2E7D4F] text-white ring-4 ring-[#2E7D4F]/20 animate-pulse'
                        : 'bg-[#F5F5F7] text-[#6E6E73] border border-[#E8E8ED]'
                    }`}
                  >
                    {isPast ? <Check className="w-4 h-4 stroke-[2.5]" /> : idx + 1}
                  </div>

                  {/* Step Title & Date */}
                  <div>
                    <p
                      className={`text-xs font-semibold ${
                        isCurrent
                          ? 'text-[#2E7D4F]'
                          : isPast
                          ? 'text-[#1D1D1F]'
                          : 'text-[#6E6E73]'
                      }`}
                    >
                      {stage}
                    </p>
                    {stageDate && (
                      <p className="text-[10px] text-[#6E6E73] mt-0.5">{stageDate}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Stepper Vertikal (HP & Layar Kecil) */}
          <div className="lg:hidden space-y-4">
            {STEPPER_STAGES.map((stage, idx) => {
              const isPast = idx < currentStageIndex;
              const isCurrent = idx === currentStageIndex;
              const stageDate = getStageDate(stage);

              return (
                <div key={stage} className="flex items-start gap-3 relative">
                  {/* Vertical Connector Line */}
                  {idx < STEPPER_STAGES.length - 1 && (
                    <div
                      className={`absolute left-4 top-8 w-[2px] h-[calc(100%-8px)] ${
                        idx < currentStageIndex ? 'bg-[#2E7D4F]' : 'bg-[#E8E8ED]'
                      }`}
                    />
                  )}

                  {/* Step Indicator */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 z-10 ${
                      isPast
                        ? 'bg-[#2E7D4F] text-white'
                        : isCurrent
                        ? 'bg-[#2E7D4F] text-white ring-4 ring-[#2E7D4F]/20'
                        : 'bg-[#F5F5F7] text-[#6E6E73] border border-[#E8E8ED]'
                    }`}
                  >
                    {isPast ? <Check className="w-4 h-4 stroke-[2.5]" /> : idx + 1}
                  </div>

                  {/* Content */}
                  <div className="pt-1 min-w-0">
                    <p
                      className={`text-sm font-semibold ${
                        isCurrent
                          ? 'text-[#2E7D4F]'
                          : isPast
                          ? 'text-[#1D1D1F]'
                          : 'text-[#6E6E73]'
                      }`}
                    >
                      {stage}
                    </p>
                    {stageDate && (
                      <p className="text-xs text-[#6E6E73] mt-0.5">{stageDate}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =====================================================================
          3. GRID KONTEN UTAMA: GALERI FOTO & KARTU INFORMASI LENGKAP
          ===================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Kolom Kiri: Galeri Foto Bahan */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl border border-[#E8E8ED] p-4 shadow-none space-y-3">
            {/* Foto Utama */}
            <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-[#F5F5F7] border border-[#E8E8ED]">
              <SmartImage
                src={offer.foto[activePhotoIndex] || offer.foto[0]}
                alt={offer.namaBahan}
                fallbackEmoji="🌱"
                aspectRatio="4:3"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnail Carousel jika lebih dari 1 foto */}
            {offer.foto.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {offer.foto.map((url, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActivePhotoIndex(idx)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                      activePhotoIndex === idx
                        ? 'border-[#2E7D4F] ring-2 ring-[#2E7D4F]/20'
                        : 'border-[#E8E8ED] opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={url}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Pesan Penawaran & Catatan Admin */}
          <div className="bg-white rounded-3xl border border-[#E8E8ED] p-6 shadow-none space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-[#E8E8ED]/60">
              <MessageSquare className="w-4 h-4 text-[#2E7D4F]" />
              <h3 className="text-sm font-bold text-[#1D1D1F]">
                Pesan & Cerita Penawaran
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-[#1D1D1F] leading-relaxed italic bg-[#F5F5F7] p-4 rounded-2xl border border-[#E8E8ED]">
              "{offer.pesanPenawaran}"
            </p>

            {offer.catatanAdmin && (
              <div className="pt-2">
                <p className="text-xs font-semibold text-[#6E6E73] mb-1">
                  Catatan dari Tim Kurator:
                </p>
                <div className="p-3.5 rounded-2xl bg-[#EBF4EE] border border-[#2E7D4F]/20 text-xs text-[#1D1D1F]">
                  {offer.catatanAdmin}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Kolom Kanan: Rincian Lengkap & Modul Terjadwal/Pembayaran */}
        <div className="lg:col-span-7 space-y-6">
          {/* Kartu Informasi Komoditas */}
          <div className="bg-white rounded-3xl border border-[#E8E8ED] p-6 sm:p-7 shadow-none space-y-5">
            <div className="flex items-center justify-between pb-2 border-b border-[#E8E8ED]/60">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#2E7D4F]" />
                <h3 className="text-base font-bold text-[#1D1D1F]">
                  Rincian Informasi Komoditas
                </h3>
              </div>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#F5F5F7] text-[#1D1D1F] border border-[#E8E8ED]">
                {offer.jenisBahan}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Jumlah Panen */}
              <div className="p-3.5 rounded-2xl bg-[#F5F5F7] border border-[#E8E8ED]/70">
                <span className="text-[#6E6E73] block mb-0.5">Jumlah Panen:</span>
                <span className="text-base font-bold text-[#1D1D1F]">
                  {offer.jumlahKg} kg
                </span>
              </div>

              {/* Harga per kg */}
              <div className="p-3.5 rounded-2xl bg-[#F5F5F7] border border-[#E8E8ED]/70">
                <span className="text-[#6E6E73] block mb-0.5">Harga per kg:</span>
                <span className="text-base font-bold text-[#1D1D1F]">
                  {formatRupiah(offer.hargaPerKg)}
                </span>
              </div>

              {/* Total Nilai Penawaran */}
              <div className="sm:col-span-2 p-4 rounded-2xl bg-[#EBF4EE] border border-[#2E7D4F]/20 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-[#2E7D4F] block">
                    Total Nilai Penawaran
                  </span>
                  <span className="text-[11px] text-[#6E6E73]">
                    {offer.jumlahKg} kg × {formatRupiah(offer.hargaPerKg)}/kg
                  </span>
                </div>
                <div className="text-xl sm:text-2xl font-extrabold text-[#2E7D4F]">
                  {formatRupiah(offer.totalHarga)}
                </div>
              </div>

              {/* Tanggal Panen */}
              <div className="p-3.5 rounded-2xl bg-[#F5F5F7] border border-[#E8E8ED]/70">
                <span className="text-[#6E6E73] block mb-0.5">Tanggal Panen:</span>
                <span className="font-semibold text-[#1D1D1F]">{offer.tanggalPanen}</span>
              </div>

              {/* Batas Penggunaan */}
              <div className="p-3.5 rounded-2xl bg-[#F5F5F7] border border-[#E8E8ED]/70">
                <span className="text-[#6E6E73] block mb-0.5">Batas Penggunaan:</span>
                <span className="font-semibold text-[#1D1D1F]">{offer.batasPenggunaan}</span>
              </div>

              {/* Lokasi Pengambilan */}
              <div className="sm:col-span-2 p-3.5 rounded-2xl bg-[#F5F5F7] border border-[#E8E8ED]/70">
                <span className="text-[#6E6E73] block mb-0.5">Lokasi Pengambilan:</span>
                <span className="font-semibold text-[#1D1D1F] block">
                  {offer.lokasiPengambilan.alamat}
                </span>
                <span className="text-[11px] text-[#6E6E73]">
                  {offer.lokasiPengambilan.kota}
                </span>
              </div>
            </div>

            {/* Karakteristik Kondisi Fisik */}
            <div className="pt-2 border-t border-[#E8E8ED]/60 space-y-2">
              <span className="text-xs font-semibold text-[#1D1D1F] block">
                Kondisi Karakter Fisik:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {offer.kondisi.map((c) => (
                  <span
                    key={c}
                    className="text-xs font-medium px-3 py-1 rounded-full bg-[#F5F5F7] text-[#1D1D1F] border border-[#E8E8ED]"
                  >
                    ✓ {c}
                  </span>
                ))}
              </div>
              {offer.catatanKondisi && (
                <p className="text-xs text-[#6E6E73] leading-relaxed pt-1">
                  <span className="font-semibold text-[#1D1D1F]">Catatan Petani:</span>{' '}
                  {offer.catatanKondisi}
                </p>
              )}
            </div>
          </div>

          {/* Kartu Jadwal Serah Terima (Jika Ada) */}
          {offer.jadwal && (
            <div className="bg-white rounded-3xl border border-[#E8E8ED] p-6 shadow-none space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#E8E8ED]/60">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#2E7D4F]" />
                  <h3 className="text-base font-bold text-[#1D1D1F]">
                    Informasi Jadwal Logistik
                  </h3>
                </div>
                <span className="text-xs font-semibold text-[#3538CD] bg-[#EEF4FF] px-2.5 py-0.5 rounded-full border border-[#C7D7FE]">
                  Terjadwal
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-[#F5F5F7] rounded-2xl border border-[#E8E8ED]/70">
                  <span className="text-[#6E6E73] block mb-0.5">Waktu Serah Terima</span>
                  <span className="font-bold text-[#1D1D1F]">
                    {offer.jadwal.tanggal}, {offer.jadwal.jam}
                  </span>
                </div>

                <div className="p-3 bg-[#F5F5F7] rounded-2xl border border-[#E8E8ED]/70">
                  <span className="text-[#6E6E73] block mb-0.5">Metode</span>
                  <span className="font-bold text-[#1D1D1F]">
                    {offer.jadwal.metode}
                  </span>
                </div>

                <div className="sm:col-span-2 p-3 bg-[#F5F5F7] rounded-2xl border border-[#E8E8ED]/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[#6E6E73] block mb-0.5">Koordinator Lapangan</span>
                    <span className="font-bold text-[#1D1D1F]">
                      {offer.jadwal.petugas.nama} ({offer.jadwal.petugas.noHp})
                    </span>
                  </div>
                  <a
                    href={`https://wa.me/62${offer.jadwal.petugas.noHp.replace(/\D/g, '').replace(/^0/, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#EBF4EE] text-[#2E7D4F] hover:bg-[#2E7D4F] hover:text-white transition-colors text-xs font-semibold border border-[#2E7D4F]/30"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Hubungi Petugas</span>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Kartu Pembayaran (Jika Ada) */}
          {offer.pembayaran && (
            <div className="bg-white rounded-3xl border border-[#E8E8ED] p-6 shadow-none space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#E8E8ED]/60">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#2E7D4F]" />
                  <h3 className="text-base font-bold text-[#1D1D1F]">
                    Status Pembayaran
                  </h3>
                </div>
                <span
                  className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                    offer.pembayaran.status === 'Lunas'
                      ? 'bg-[#EBF4EE] text-[#2E7D4F] border-[#2E7D4F]/25'
                      : 'bg-[#FFF9EB] text-[#B54708] border-[#FEDF89]'
                  }`}
                >
                  {offer.pembayaran.status}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-[#F5F5F7] rounded-2xl border border-[#E8E8ED]/70">
                  <span className="text-[#6E6E73] block mb-0.5">Total Dicairkan:</span>
                  <span className="font-bold text-base text-[#2E7D4F]">
                    {formatRupiah(offer.pembayaran.total)}
                  </span>
                </div>

                <div className="p-3 bg-[#F5F5F7] rounded-2xl border border-[#E8E8ED]/70">
                  <span className="text-[#6E6E73] block mb-0.5">Metode Pencairan:</span>
                  <span className="font-bold text-[#1D1D1F]">
                    {offer.pembayaran.metode}
                  </span>
                </div>

                <div className="sm:col-span-2 p-3 bg-[#F5F5F7] rounded-2xl border border-[#E8E8ED]/70">
                  <span className="text-[#6E6E73] block mb-0.5">Rekening Tujuan:</span>
                  <span className="font-bold text-[#1D1D1F]">
                    {offer.pembayaran.rekeningTujuan}
                  </span>
                  {offer.pembayaran.nomorReferensi && (
                    <span className="text-[11px] text-[#6E6E73] block mt-1">
                      No. Referensi Bank: {offer.pembayaran.nomorReferensi} ·{' '}
                      {offer.pembayaran.tanggalBayar}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
