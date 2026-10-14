import React, { useState, useMemo } from 'react';
import { useSupplierAuth } from '../../context/SupplierAuthContext';
import { SupplierOffer } from '../../types/supplier';
import { Button } from '../../components/ui/Button';
import {
  Wallet,
  Clock,
  CreditCard,
  CheckCircle2,
  Download,
  X,
  FileCheck2,
  Building2,
  ArrowRight,
  ShieldCheck,
  Receipt,
  ExternalLink,
} from 'lucide-react';

export const SupplierPayoutsPage: React.FC = () => {
  const { offers } = useSupplierAuth();

  const [selectedReceipt, setSelectedReceipt] = useState<SupplierOffer | null>(null);
  const [showEditBankModal, setShowEditBankModal] = useState(false);
  const [downloadToast, setDownloadToast] = useState(false);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  // 1. Total Diterima (Lunas)
  const completedOffers = useMemo(() => {
    return offers.filter((o) => o.status === 'Selesai & Dibayar');
  }, [offers]);

  const totalDiterima = useMemo(() => {
    return completedOffers.reduce((acc, o) => acc + (o.pembayaran?.total || o.totalHarga), 0);
  }, [completedOffers]);

  // 2. Sedang Diproses
  const processingOffers = useMemo(() => {
    return offers.filter(
      (o) => o.status === 'Dikirim/Dijemput' || o.status === 'Dijadwalkan'
    );
  }, [offers]);

  const totalSedangDiproses = useMemo(() => {
    return processingOffers.reduce((acc, o) => acc + o.totalHarga, 0);
  }, [processingOffers]);

  // Gabungan daftar pembayaran
  const payoutList = useMemo(() => {
    return [...completedOffers, ...processingOffers];
  }, [completedOffers, processingOffers]);

  const handleDownload = () => {
    setDownloadToast(true);
    setTimeout(() => setDownloadToast(false), 2500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Toast Download */}
      {downloadToast && (
        <div className="fixed top-6 right-6 z-50 bg-[#1D1D1F] text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 border border-white/10 animate-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="w-5 h-5 text-[#8FE3AC] shrink-0" />
          <span className="text-sm font-medium">Bukti transfer PDF berhasil disiapkan untuk diunduh.</span>
        </div>
      )}

      {/* =====================================================================
          HEADER HALAMAN
          ===================================================================== */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1D1D1F]">
          Pembayaran & Rekening
        </h1>
        <p className="mt-1 text-sm text-[#6E6E73]">
          Transparansi pencairan dana hasil panen langsung ke rekening terdaftar kelompok tani.
        </p>
      </div>

      {/* =====================================================================
          3 KARTU RINGKASAN: TOTAL DITERIMA, SEDANG DIPROSES, REKENING TUJUAN
          ===================================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Kartu 1: Total Diterima */}
        <div className="bg-white rounded-3xl border border-[#E8E8ED] p-6 shadow-none hover:border-[#2E7D4F]/30 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-[#6E6E73]">Total Diterima</span>
            <div className="w-8 h-8 rounded-full bg-[#EBF4EE] text-[#2E7D4F] flex items-center justify-center border border-[#2E7D4F]/20">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1D1D1F]">
            {formatRupiah(totalDiterima)}
          </div>
          <p className="text-[11px] text-[#2E7D4F] font-medium mt-1.5 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Telah cair lunas ke rekening</span>
          </p>
        </div>

        {/* Kartu 2: Sedang Diproses */}
        <div className="bg-white rounded-3xl border border-[#E8E8ED] p-6 shadow-none hover:border-[#FEDF89] transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-[#6E6E73]">Sedang Diproses</span>
            <div className="w-8 h-8 rounded-full bg-[#FEFBE8] text-[#A15C07] flex items-center justify-center border border-[#FDE272]">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1D1D1F]">
            {formatRupiah(totalSedangDiproses)}
          </div>
          <p className="text-[11px] text-[#A15C07] font-medium mt-1.5 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Menunggu verifikasi timbang akhir</span>
          </p>
        </div>

        {/* Kartu 3: Rekening Tujuan */}
        <div className="bg-white rounded-3xl border border-[#E8E8ED] p-6 shadow-none flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-[#6E6E73]">Rekening Penerima</span>
              <button
                type="button"
                onClick={() => setShowEditBankModal(true)}
                className="text-xs font-semibold text-[#2E7D4F] hover:underline cursor-pointer"
              >
                Ubah
              </button>
            </div>
            <div className="flex items-center gap-2.5 mt-1">
              <div className="w-7 h-7 rounded-lg bg-[#00529C]/10 text-[#00529C] font-bold text-xs flex items-center justify-center shrink-0">
                BCA
              </div>
              <div>
                <p className="font-mono text-sm font-bold text-[#1D1D1F]">•••• 4821</p>
                <p className="text-xs text-[#6E6E73]">a.n. Asep Sutisna</p>
              </div>
            </div>
          </div>
          <div className="pt-2 border-t border-[#E8E8ED]/60 mt-3 flex items-center justify-between text-[11px] text-[#6E6E73]">
            <span>Kelompok Tani Sukamaju</span>
            <span className="text-[#2E7D4F] font-medium">Terverifikasi</span>
          </div>
        </div>
      </div>

      {/* =====================================================================
          DAFTAR TRANSAKSI PEMBAYARAN
          ===================================================================== */}
      <div className="bg-white rounded-3xl border border-[#E8E8ED] p-6 sm:p-7 shadow-none space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#E8E8ED]/60">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-[#1D1D1F]">
              Daftar Riwayat Pembayaran
            </h2>
            <p className="text-xs text-[#6E6E73] mt-0.5">
              Rincian komoditas dan status pencairan dana panen Anda.
            </p>
          </div>
          <span className="text-xs font-semibold text-[#6E6E73] bg-[#F5F5F7] px-2.5 py-1 rounded-full border border-[#E8E8ED]">
            {payoutList.length} Transaksi
          </span>
        </div>

        <div className="divide-y divide-[#E8E8ED]/70">
          {payoutList.map((offer) => {
            const isLunas = offer.status === 'Selesai & Dibayar';
            const nominal = offer.pembayaran?.total || offer.totalHarga;
            const tanggal = offer.pembayaran?.tanggalBayar || offer.jadwal?.tanggal || offer.tanggalDiajukan;
            const metode = offer.pembayaran?.metode || 'Transfer Bank Otomatis';

            return (
              <div
                key={offer.id}
                className="py-4 first:pt-1 last:pb-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#FBFBFD] -mx-2 px-2 rounded-2xl transition-colors"
              >
                {/* Kiri: Tanggal, Bahan, ID */}
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-[#6E6E73] bg-[#F5F5F7] px-2 py-0.5 rounded-full border border-[#E8E8ED]">
                      {offer.id}
                    </span>
                    <span className="text-xs text-[#6E6E73]">· {tanggal}</span>
                  </div>
                  <h3 className="text-sm font-bold text-[#1D1D1F]">
                    {offer.namaBahan}{' '}
                    <span className="text-xs font-normal text-[#6E6E73]">
                      ({offer.jumlahKg} kg)
                    </span>
                  </h3>
                  <p className="text-[11px] text-[#6E6E73] flex items-center gap-1.5">
                    <span>Metode: {metode}</span>
                    {offer.pembayaran?.nomorReferensi && (
                      <>
                        <span>·</span>
                        <span className="font-mono">Ref: {offer.pembayaran.nomorReferensi}</span>
                      </>
                    )}
                  </p>
                </div>

                {/* Kanan: Nominal, Badge & Tombol Lihat Bukti */}
                <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-5 shrink-0">
                  <div className="text-left sm:text-right">
                    <p className="text-base font-bold text-[#1D1D1F]">
                      {formatRupiah(nominal)}
                    </p>
                    <span
                      className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full border mt-0.5 ${
                        isLunas
                          ? 'bg-[#EBF4EE] text-[#2E7D4F] border-[#2E7D4F]/25'
                          : 'bg-[#FEFBE8] text-[#A15C07] border-[#FDE272]'
                      }`}
                    >
                      {isLunas ? 'Lunas' : 'Diproses'}
                    </span>
                  </div>

                  <div>
                    {isLunas ? (
                      <button
                        type="button"
                        onClick={() => setSelectedReceipt(offer)}
                        className="px-3 py-1.5 rounded-full text-xs font-semibold bg-[#F5F5F7] hover:bg-[#E8E8ED] text-[#1D1D1F] border border-[#E8E8ED] transition-colors cursor-pointer"
                      >
                        Lihat Bukti
                      </button>
                    ) : (
                      <span className="text-xs text-[#6E6E73] italic">
                        Menunggu Timbang
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* =====================================================================
          MODAL BUKTI PEMBAYARAN (RECEIPT MODAL)
          ===================================================================== */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in"
            onClick={() => setSelectedReceipt(null)}
          />

          {/* Modal Card */}
          <div className="relative bg-white rounded-3xl border border-[#E8E8ED] p-6 sm:p-8 max-w-lg w-full shadow-2xl z-10 space-y-6 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-[#E8E8ED]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#2E7D4F] bg-[#EBF4EE] px-2 py-0.5 rounded-full border border-[#2E7D4F]/20">
                  Bukti Transfer Resmi
                </span>
                <h3 className="text-xl font-bold tracking-tight text-[#1D1D1F] mt-1">
                  Bukti Pencairan Dana Petani
                </h3>
                <p className="text-xs text-[#6E6E73]">
                  PT Solusi Pangan Berkelanjutan (Ugly2Yummy)
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReceipt(null)}
                className="p-1 rounded-full text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-[#F5F5F7]"
                aria-label="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-4 text-xs">
              {/* Status & Ref */}
              <div className="p-3.5 bg-[#F5F5F7] rounded-2xl border border-[#E8E8ED] flex items-center justify-between">
                <div>
                  <span className="text-[#6E6E73] block">Nomor Referensi Transfer</span>
                  <span className="font-mono font-bold text-sm text-[#1D1D1F]">
                    {selectedReceipt.pembayaran?.nomorReferensi || 'TRX-PAY-2026-0992'}
                  </span>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#EBF4EE] text-[#2E7D4F] border border-[#2E7D4F]/25 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>LUNAS</span>
                </span>
              </div>

              {/* Rincian Transaksi */}
              <div className="space-y-2 py-1">
                <div className="flex justify-between">
                  <span className="text-[#6E6E73]">Waktu Pencairan:</span>
                  <span className="font-semibold text-[#1D1D1F]">
                    {selectedReceipt.pembayaran?.tanggalBayar || '02 Oktober 2026, 15:30 WIB'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6E6E73]">ID Penawaran:</span>
                  <span className="font-mono font-semibold text-[#1D1D1F]">
                    {selectedReceipt.id}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6E6E73]">Rekening Tujuan:</span>
                  <span className="font-semibold text-[#1D1D1F]">
                    BCA •••• 4821 (Asep Sutisna)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6E6E73]">Kelompok Tani:</span>
                  <span className="font-semibold text-[#1D1D1F]">
                    Kelompok Tani Sukamaju
                  </span>
                </div>
              </div>

              {/* Kalkulasi Rincian */}
              <div className="p-4 bg-[#FBFBFD] rounded-2xl border border-[#E8E8ED] space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#1D1D1F] font-semibold">
                    {selectedReceipt.namaBahan}
                  </span>
                  <span className="text-[#1D1D1F] font-semibold">
                    {formatRupiah(selectedReceipt.totalHarga)}
                  </span>
                </div>
                <div className="flex justify-between text-[#6E6E73] text-[11px]">
                  <span>
                    Rincian: {selectedReceipt.jumlahKg} kg × {formatRupiah(selectedReceipt.hargaPerKg)}/kg
                  </span>
                  <span>Timbangan Valid</span>
                </div>
                <div className="flex justify-between text-[#6E6E73] text-[11px] pt-1 border-t border-[#E8E8ED]/60">
                  <span>Biaya Operasional & Platform:</span>
                  <span className="text-[#2E7D4F] font-medium">Rp 0 (Bebas Biaya)</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#1D1D1F] pt-2 border-t border-[#E8E8ED]">
                  <span>Total Dana Diterima:</span>
                  <span className="text-base text-[#2E7D4F]">
                    {formatRupiah(selectedReceipt.pembayaran?.total || selectedReceipt.totalHarga)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-[#6E6E73] pt-1">
                <ShieldCheck className="w-4 h-4 text-[#2E7D4F] shrink-0" />
                <span>Transaksi ini telah diverifikasi melalui sistem kliring perbankan otomatis Ugly2Yummy.</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-2 border-t border-[#E8E8ED] flex items-center justify-end gap-3">
              <Button
                type="button"
                onClick={() => setSelectedReceipt(null)}
                variant="secondary"
                size="sm"
              >
                Tutup
              </Button>
              <Button
                type="button"
                onClick={handleDownload}
                variant="primary"
                size="sm"
                icon={<Download className="w-3.5 h-3.5" />}
              >
                Unduh Bukti (PDF)
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Ubah Rekening (Tampilan Saja) */}
      {showEditBankModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setShowEditBankModal(false)}
          />
          <div className="relative bg-white rounded-3xl border border-[#E8E8ED] p-6 sm:p-7 max-w-md w-full shadow-2xl z-10 space-y-4">
            <div className="flex items-start justify-between">
              <h3 className="text-base font-bold text-[#1D1D1F]">
                Perubahan Rekening Bank
              </h3>
              <button
                type="button"
                onClick={() => setShowEditBankModal(false)}
                className="text-[#6E6E73] hover:text-[#1D1D1F]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-[#6E6E73] leading-relaxed">
              Demi keamanan penyaluran dana kelompok tani, perubahan nomor rekening bank memerlukan verifikasi kartu identitas dan konfirmasi via koordinator lapangan.
            </p>
            <div className="p-3 bg-[#F5F5F7] rounded-2xl border border-[#E8E8ED] text-xs space-y-1">
              <p className="font-semibold text-[#1D1D1F]">Rekening Saat Ini:</p>
              <p className="text-[#6E6E73]">Bank BCA · No: •••• 4821</p>
              <p className="text-[#6E6E73]">a.n. Asep Sutisna (Kelompok Tani Sukamaju)</p>
            </div>
            <div className="pt-2 flex justify-end gap-2">
              <Button
                type="button"
                onClick={() => setShowEditBankModal(false)}
                variant="primary"
                size="sm"
              >
                Mengerti
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
