import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useWorkerData } from '../../../context/WorkerDataContext';
import { WorkerStatusBadge } from '../../../components/internal/WorkerStatusBadge';
import { BatchStatus } from '../../../types/worker';
import {
  ArrowLeft,
  ChefHat,
  PackageCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  AlertCircle,
  FileText,
  Calendar,
  Layers,
  Check,
  Package,
} from 'lucide-react';

const STEPPER_STAGES = [
  'Menunggu Diseleksi',
  'Sudah Diseleksi',
  'Sedang Diolah',
  'Sedang Dikemas',
  'Siap Dijual',
] as const;

export const WorkerBatchDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { batches, updateBatchStatus } = useWorkerData();

  const batch = batches.find((b) => b.id === id);

  // Modal Dialog Konfirmasi
  const [showPackagingModal, setShowPackagingModal] = useState(false);
  const [showReadyModal, setShowReadyModal] = useState(false);

  // Form Siap Dijual
  const [hasilBerhasil, setHasilBerhasil] = useState<number | ''>(batch?.targetHasil || 0);
  const [gagalReject, setGagalReject] = useState<number | ''>(0);
  const [catatanRilis, setCatatanRilis] = useState('');
  const [modalError, setModalError] = useState('');

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!batch) {
    return (
      <div className="py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-[#1D1D1F]">Batch Produksi Tidak Ditemukan</h2>
        <p className="text-sm text-[#6E6E73]">
          Batch dengan ID "{id}" tidak tersedia di sistem dapur.
        </p>
        <Link
          to="/internal/pekerja/produksi"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#2E7D4F] text-white text-xs font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Daftar Produksi</span>
        </Link>
      </div>
    );
  }

  // Tentukan index tahap saat ini
  const getStageIndex = (status: string) => {
    switch (status) {
      case 'Sedang Diolah':
        return 2;
      case 'Sedang Dikemas':
        return 3;
      case 'Siap Dijual':
        return 4;
      default:
        return 2;
    }
  };

  const currentStageIndex = getStageIndex(batch.status);

  // Cari timestamp riwayat untuk masing-masing tahap
  const getTimestampForStage = (stageName: string) => {
    if (stageName === 'Menunggu Diseleksi') return '13 Okt 2026, 08:30 WIB';
    if (stageName === 'Sudah Diseleksi') return '13 Okt 2026, 11:15 WIB';

    const match = batch.riwayatStatus.find((r) => r.tahap === stageName);
    return match ? `${match.tanggal}, ${match.jam}` : null;
  };

  // Konfirmasi Pindah ke Sedang Dikemas
  const handleConfirmPackaging = () => {
    updateBatchStatus(
      batch.id,
      'Sedang Dikemas',
      'Proses memasak selesai. Batch dipindahkan ke meja sterilisasi & pengemasan.'
    );
    setShowPackagingModal(false);
    setToastMessage('Status batch diperbarui menjadi Sedang Dikemas');
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Konfirmasi Siap Dijual
  const handleConfirmReady = (e: React.FormEvent) => {
    e.preventDefault();
    if (hasilBerhasil === '' || Number(hasilBerhasil) < 0) {
      setModalError('Jumlah produk berhasil wajib diisi.');
      return;
    }
    if (gagalReject === '' || Number(gagalReject) < 0) {
      setModalError('Jumlah produk reject wajib diisi (minimal 0).');
      return;
    }

    const numBerhasil = Number(hasilBerhasil);
    const numReject = Number(gagalReject);

    updateBatchStatus(
      batch.id,
      'Siap Dijual',
      catatanRilis.trim() || `Selesai dikemas: ${numBerhasil} berhasil, ${numReject} reject. Lolos uji segel.`,
      {
        hasilBerhasil: numBerhasil,
        gagalReject: numReject,
      }
    );

    setShowReadyModal(false);
    setToastMessage('Produk siap dijual, stok diperbarui');
    setTimeout(() => setToastMessage(null), 3500);
  };

  const percentAchieved =
    batch.targetHasil > 0
      ? Math.min(100, Math.round((batch.hasilBerhasil / batch.targetHasil) * 100))
      : 0;

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

      {/* Back Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/internal/pekerja/produksi"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#6E6E73] hover:text-[#1D1D1F] transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>Kembali ke Daftar Batch Produksi</span>
        </Link>
        <span className="text-xs text-[#6E6E73]">ID: {batch.id}</span>
      </div>

      {/* Main Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-3xl border border-[#E8E8ED]">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="font-mono text-xs font-semibold text-[#6E6E73] bg-[#F5F5F7] px-2 py-0.5 rounded-md border border-[#E8E8ED]">
              {batch.id}
            </span>
            <WorkerStatusBadge status={batch.status} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1D1D1F]">
            {batch.produk}
          </h1>
          <p className="text-xs sm:text-sm text-[#6E6E73] mt-1">
            Bahan Baku Utama:{' '}
            <strong className="text-[#1D1D1F]">{batch.bahan}</strong> · {batch.bahanDipakai} kg terpakai
          </p>
        </div>

        {/* Action Button sesuai tahap */}
        <div className="flex items-center gap-2.5 shrink-0">
          {batch.status === 'Sedang Diolah' && (
            <button
              type="button"
              onClick={() => setShowPackagingModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1D1D1F] hover:bg-black text-white text-xs sm:text-sm font-semibold transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <Package className="w-4 h-4 text-[#8FE3AC]" />
              <span>Tandai Sedang Dikemas</span>
            </button>
          )}

          {batch.status === 'Sedang Dikemas' && (
            <button
              type="button"
              onClick={() => {
                setHasilBerhasil(batch.targetHasil);
                setGagalReject(0);
                setCatatanRilis('');
                setModalError('');
                setShowReadyModal(true);
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#2E7D4F] hover:bg-[#256640] text-white text-xs sm:text-sm font-semibold transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Tandai Siap Dijual</span>
            </button>
          )}

          {batch.status === 'Siap Dijual' && (
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#EBF4EE] text-[#2E7D4F] text-xs font-bold border border-[#2E7D4F]/20">
              <CheckCircle2 className="w-4 h-4" />
              <span>Produk Resmi Siap Dijual</span>
            </span>
          )}
        </div>
      </div>

      {/* =========================================================================
          STEPPER ALUR PRODUKSI (5 TAHAP)
          ========================================================================= */}
      <div className="bg-white rounded-3xl border border-[#E8E8ED] p-6 sm:p-8 space-y-6">
        <h2 className="text-xs uppercase font-bold tracking-wider text-[#6E6E73]">
          Tahapan Alur Kerja Dapur (Production Stepper)
        </h2>

        <div className="relative">
          {/* Horizontal Track Line */}
          <div className="hidden sm:block absolute top-4 left-6 right-6 h-0.5 bg-[#E8E8ED] z-0" />

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative z-10">
            {STEPPER_STAGES.map((stage, idx) => {
              const isPassed = idx <= currentStageIndex;
              const isCurrent = idx === currentStageIndex;
              const timestamp = getTimestampForStage(stage);

              return (
                <div key={stage} className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2">
                  {/* Step Bubble */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-all ${
                      isCurrent
                        ? 'bg-[#2E7D4F] text-white ring-4 ring-[#2E7D4F]/20 shadow-xs'
                        : isPassed
                        ? 'bg-[#EBF4EE] text-[#2E7D4F] border border-[#2E7D4F]/30'
                        : 'bg-[#F5F5F7] text-[#6E6E73] border border-[#E8E8ED]'
                    }`}
                  >
                    {isPassed && !isCurrent ? (
                      <Check className="w-4 h-4 stroke-[2.5]" />
                    ) : (
                      idx + 1
                    )}
                  </div>

                  <div className="min-w-0">
                    <p
                      className={`text-xs font-bold ${
                        isCurrent
                          ? 'text-[#2E7D4F]'
                          : isPassed
                          ? 'text-[#1D1D1F]'
                          : 'text-[#6E6E73]'
                      }`}
                    >
                      {stage}
                    </p>
                    {timestamp ? (
                      <p className="text-[10px] text-[#6E6E73] mt-0.5">{timestamp}</p>
                    ) : (
                      <p className="text-[10px] text-[#6E6E73]/60 mt-0.5">Menunggu</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grid 2 Kolom Info & Riwayat Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Kolom Kiri: Kartu Info Produksi (7 Kolom) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-[#E8E8ED] p-6 space-y-5">
          <h2 className="text-base font-bold text-[#1D1D1F]">Rincian Parameter Batch</h2>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-[#FBFBFD] border border-[#E8E8ED]">
              <span className="text-[10px] font-semibold text-[#6E6E73] block">Bahan Dipakai</span>
              <p className="text-xl font-extrabold text-[#1D1D1F] mt-0.5">
                {batch.bahanDipakai} <span className="text-xs font-normal text-[#6E6E73]">kg</span>
              </p>
              <span className="text-[10px] text-[#6E6E73]">{batch.bahan}</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#FBFBFD] border border-[#E8E8ED]">
              <span className="text-[10px] font-semibold text-[#6E6E73] block">Target Output</span>
              <p className="text-xl font-extrabold text-[#1D1D1F] mt-0.5">
                {batch.targetHasil} <span className="text-xs font-normal text-[#6E6E73]">{batch.satuan}</span>
              </p>
              <span className="text-[10px] text-[#6E6E73]">Formula standar</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#EBF4EE]/50 border border-[#2E7D4F]/20 col-span-2 sm:col-span-1">
              <span className="text-[10px] font-semibold text-[#2E7D4F] block">Hasil Berhasil</span>
              <p className="text-xl font-extrabold text-[#2E7D4F] mt-0.5">
                {batch.hasilBerhasil} <span className="text-xs font-normal text-[#2E7D4F]">{batch.satuan}</span>
              </p>
              <span className="text-[10px] text-[#6E6E73]">
                Reject: {batch.gagalReject} {batch.satuan}
              </span>
            </div>
          </div>

          {/* Progress Bar Capaian */}
          <div className="p-4 rounded-2xl bg-[#FBFBFD] border border-[#E8E8ED] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#1D1D1F]">Efisiensi Capaian Target:</span>
              <span className="font-bold text-[#2E7D4F]">{percentAchieved}%</span>
            </div>
            <div className="w-full h-2 bg-[#E8E8ED] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#2E7D4F] rounded-full transition-all duration-500"
                style={{ width: `${percentAchieved}%` }}
              />
            </div>
          </div>

          {/* Catatan Operasional */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-[#1D1D1F] block">Catatan Staf Dapur:</span>
            <p className="text-xs text-[#6E6E73] bg-[#FBFBFD] p-3.5 rounded-2xl border border-[#E8E8ED] leading-relaxed">
              {batch.catatan || 'Karakteristik adonan dan aroma buah sesuai standar dapur.'}
            </p>
          </div>
        </div>

        {/* Kolom Kanan: Timeline Riwayat Log Status (5 Kolom) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-[#E8E8ED] p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E8E8ED]">
            <h2 className="text-base font-bold text-[#1D1D1F]">Log Jejak Produksi</h2>
            <span className="text-xs text-[#6E6E73]">{batch.riwayatStatus.length} Catatan</span>
          </div>

          <div className="space-y-4">
            {batch.riwayatStatus.map((log, idx) => (
              <div key={idx} className="relative pl-6 pb-2 border-l border-[#E8E8ED] last:border-transparent">
                {/* Timeline Dot */}
                <div className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-[#2E7D4F] border-2 border-white" />

                <div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#1D1D1F]">{log.tahap}</span>
                    <span className="text-[10px] text-[#6E6E73]">{log.jam}</span>
                  </div>
                  <span className="text-[10px] text-[#6E6E73] block mb-1">{log.tanggal}</span>
                  {log.catatan && (
                    <p className="text-[11px] text-[#6E6E73] bg-[#FBFBFD] p-2.5 rounded-xl border border-[#E8E8ED] leading-normal">
                      {log.catatan}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* =========================================================================
          MODAL 1: KONFIRMASI SEDANG DIKEMAS
          ========================================================================= */}
      {showPackagingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setShowPackagingModal(false)}
          />
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl z-10 border border-[#E8E8ED] space-y-5 animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center mx-auto border border-purple-200/50">
              <Package className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-[#1D1D1F]">Lanjut ke Tahap Pengemasan?</h3>
              <p className="text-xs text-[#6E6E73] leading-relaxed">
                Proses pengolahan bahan <strong className="text-[#1D1D1F]">{batch.bahan}</strong> akan
                ditandai selesai dan dialihkan ke meja sterilisasi botol/kemasan.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowPackagingModal(false)}
                className="flex-1 py-2.5 rounded-full bg-[#F5F5F7] hover:bg-[#E8E8ED] text-[#1D1D1F] text-xs font-semibold transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmPackaging}
                className="flex-1 py-2.5 rounded-full bg-[#1D1D1F] hover:bg-black text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                Konfirmasi Pengemasan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: KONFIRMASI SIAP DIJUAL (WAJIB ISI JUMLAH BERHASIL & REJECT)
          ========================================================================= */}
      {showReadyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setShowReadyModal(false)}
          />
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl z-10 border border-[#E8E8ED] space-y-5 animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-[#EBF4EE] text-[#2E7D4F] flex items-center justify-center mx-auto border border-[#2E7D4F]/20">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-[#1D1D1F]">Selesaikan Batch: Siap Dijual</h3>
              <p className="text-xs text-[#6E6E73] leading-relaxed">
                Masukkan hasil inspeksi segel akhir. Stok produk jadi akan otomatis ditambahkan ke inventaris siap jual.
              </p>
            </div>

            {modalError && (
              <div className="p-3 rounded-2xl bg-red-50 text-red-700 text-xs border border-red-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleConfirmReady} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5 p-3.5 rounded-2xl bg-[#FBFBFD] border border-[#E8E8ED]">
                  <label className="text-xs font-bold text-[#1D1D1F] block">
                    Jumlah Berhasil ({batch.satuan})
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={hasilBerhasil}
                    onChange={(e) =>
                      setHasilBerhasil(e.target.value === '' ? '' : Number(e.target.value))
                    }
                    className="w-full py-1 text-lg font-extrabold text-[#2E7D4F] bg-transparent outline-none"
                    required
                  />
                  <span className="text-[10px] text-[#6E6E73] block">Target: {batch.targetHasil} {batch.satuan}</span>
                </div>

                <div className="space-y-1.5 p-3.5 rounded-2xl bg-[#FBFBFD] border border-[#E8E8ED]">
                  <label className="text-xs font-bold text-[#1D1D1F] block">
                    Gagal / Reject ({batch.satuan})
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={gagalReject}
                    onChange={(e) =>
                      setGagalReject(e.target.value === '' ? '' : Number(e.target.value))
                    }
                    className="w-full py-1 text-lg font-extrabold text-red-600 bg-transparent outline-none"
                    required
                  />
                  <span className="text-[10px] text-[#6E6E73] block">Cacat kemasan / bocor</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1D1D1F] block">
                  Catatan Rilis Akhir & Segel
                </label>
                <textarea
                  rows={2}
                  value={catatanRilis}
                  onChange={(e) => setCatatanRilis(e.target.value)}
                  placeholder="Contoh: Segel vakum rapat, tanggal kadaluarsa 6 bulan tertempel rapi..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E8ED] bg-[#F5F5F7] text-xs text-[#1D1D1F] focus:bg-white focus:border-[#2E7D4F] outline-none transition-all resize-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReadyModal(false)}
                  className="flex-1 py-2.5 rounded-full bg-[#F5F5F7] hover:bg-[#E8E8ED] text-[#1D1D1F] text-xs font-semibold transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-full bg-[#2E7D4F] hover:bg-[#256640] text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs"
                >
                  Simpan & Rilis ke Stok
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
