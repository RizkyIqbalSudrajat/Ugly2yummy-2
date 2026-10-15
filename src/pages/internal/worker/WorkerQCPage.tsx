import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useWorkerData } from '../../../context/WorkerDataContext';
import { MaterialReceiving } from '../../../types/worker';
import { SmartImage } from '../../../components/ui/SmartImage';
import { WorkerStatusBadge } from '../../../components/internal/WorkerStatusBadge';
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Layers,
  Scale,
  FileText,
  User,
  ArrowRight,
  TrendingUp,
  History,
  Info,
  Calendar,
} from 'lucide-react';

export const WorkerQCPage: React.FC = () => {
  const { receivings, updateReceivingQC } = useWorkerData();
  const [searchParams, setSearchParams] = useSearchParams();

  // Tab: Antrean Aktif vs Riwayat
  const [activeTab, setActiveTab] = useState<'antrean' | 'riwayat'>('antrean');

  // Antrean Bahan Menunggu Seleksi
  const queueItems = useMemo(
    () => receivings.filter((r) => r.status === 'Menunggu Diseleksi'),
    [receivings]
  );

  // Riwayat Bahan Sudah Seleksi
  const historyItems = useMemo(
    () => receivings.filter((r) => r.status === 'Sudah Diseleksi'),
    [receivings]
  );

  // Item yang sedang aktif diseleksi di form
  const [selectedItem, setSelectedItem] = useState<MaterialReceiving | null>(null);

  // Form Fields
  const [layakKg, setLayakKg] = useState<number | ''>('');
  const [tidakLayakKg, setTidakLayakKg] = useState<number | ''>('');
  const [komposKg, setKomposKg] = useState<number | ''>('');
  const [dibuangKg, setDibuangKg] = useState<number | ''>('');
  const [catatanQC, setCatatanQC] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Auto-select item dari parameter ?trmId= atau item pertama di antrean
  useEffect(() => {
    const trmIdParam = searchParams.get('trmId');
    if (trmIdParam) {
      const match = receivings.find((r) => r.id === trmIdParam);
      if (match) {
        setSelectedItem(match);
        if (match.status === 'Sudah Diseleksi') {
          setActiveTab('riwayat');
        } else {
          setActiveTab('antrean');
        }
        return;
      }
    }

    if (!selectedItem && queueItems.length > 0) {
      setSelectedItem(queueItems[0]);
    }
  }, [searchParams, receivings, queueItems, selectedItem]);

  // Reset form saat berganti item
  const handleSelectItem = (item: MaterialReceiving) => {
    setSelectedItem(item);
    setErrorMessage('');

    if (item.hasilSeleksi) {
      setLayakKg(item.hasilSeleksi.layak);
      setTidakLayakKg(item.hasilSeleksi.tidakLayak);
      setKomposKg(item.hasilSeleksi.dijadikanKompos);
      setDibuangKg(item.hasilSeleksi.dibuang);
      setCatatanQC(item.hasilSeleksi.catatan);
    } else {
      setLayakKg('');
      setTidakLayakKg('');
      setKomposKg('');
      setDibuangKg('');
      setCatatanQC('');
    }
  };

  // Kalkulasi Realtime Komposisi
  const beratAwal = selectedItem?.beratAwal || 0;
  const numLayak = typeof layakKg === 'number' ? layakKg : 0;
  const numTidakLayak = typeof tidakLayakKg === 'number' ? tidakLayakKg : 0;
  const numKompos = typeof komposKg === 'number' ? komposKg : 0;
  const numDibuang = typeof dibuangKg === 'number' ? dibuangKg : 0;

  // Validasi Balance
  const totalDialokasikan = numLayak + numTidakLayak;
  const selisihBeratAwal = beratAwal - totalDialokasikan;
  const totalSubTidakLayak = numKompos + numDibuang;
  const selisihTidakLayak = numTidakLayak - totalSubTidakLayak;

  const isBalanced =
    beratAwal > 0 &&
    Math.abs(selisihBeratAwal) < 0.001 &&
    Math.abs(selisihTidakLayak) < 0.001 &&
    (layakKg !== '' || tidakLayakKg !== '');

  // Persentase untuk visual bar
  const pctLayak = beratAwal > 0 ? (numLayak / beratAwal) * 100 : 0;
  const pctKompos = beratAwal > 0 ? (numKompos / beratAwal) * 100 : 0;
  const pctDibuang = beratAwal > 0 ? (numDibuang / beratAwal) * 100 : 0;
  const pctSisa = Math.max(0, 100 - pctLayak - pctKompos - pctDibuang);

  // Shortcut otomatis pembagian
  const handleAutoFill = () => {
    if (!beratAwal) return;
    // Asumsi default realistis: 90% layak, 7% kompos, 3% dibuang
    const defaultLayak = Math.round(beratAwal * 0.9 * 10) / 10;
    const defaultTidakLayak = Math.round((beratAwal - defaultLayak) * 10) / 10;
    const defaultKompos = Math.round(defaultTidakLayak * 0.7 * 10) / 10;
    const defaultDibuang = Math.round((defaultTidakLayak - defaultKompos) * 10) / 10;

    setLayakKg(defaultLayak);
    setTidakLayakKg(defaultTidakLayak);
    setKomposKg(defaultKompos);
    setDibuangKg(defaultDibuang);
    setCatatanQC('Kondisi buah sangat baik, aroma manis segar. Bagian busuk kecil disisihkan untuk kompos.');
    setErrorMessage('');
  };

  const handleSimpanSeleksi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    if (layakKg === '' || tidakLayakKg === '') {
      setErrorMessage('Harap isi jumlah bahan layak dan tidak layak.');
      return;
    }

    if (Math.abs(selisihBeratAwal) >= 0.001) {
      setErrorMessage(
        `Total bobot belum seimbang! Berat awal adalah ${beratAwal} kg, saat ini dialokasikan ${totalDialokasikan} kg (selisih ${selisihBeratAwal > 0 ? `kurang ${selisihBeratAwal}` : `lebih ${Math.abs(selisihBeratAwal)}`} kg).`
      );
      return;
    }

    if (Math.abs(selisihTidakLayak) >= 0.001) {
      setErrorMessage(
        `Pembagian bahan tidak layak belum seimbang! Bahan tidak layak ${numTidakLayak} kg harus terbagi habis antara Kompos (${numKompos} kg) dan Dibuang (${numDibuang} kg).`
      );
      return;
    }

    updateReceivingQC(selectedItem.id, {
      layak: numLayak,
      tidakLayak: numTidakLayak,
      dijadikanKompos: numKompos,
      dibuang: numDibuang,
      catatan: catatanQC.trim() || 'Hasil seleksi mutu visual telah diverifikasi.',
      tanggalSeleksi: '14 Okt 2026',
      diseleksiOleh: 'Dewi Lestari',
    });

    setToastMessage('Hasil seleksi tersimpan');
    setTimeout(() => setToastMessage(null), 3500);

    // Buka item berikutnya di antrean jika ada
    const remainingInQueue = queueItems.filter((i) => i.id !== selectedItem.id);
    if (remainingInQueue.length > 0) {
      handleSelectItem(remainingInQueue[0]);
    } else {
      setSelectedItem(null);
    }
  };

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
              Meja Sortir & Inspeksi
            </span>
            <span className="text-xs text-[#6E6E73]">· Kendali Mutu Pangan</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1D1D1F]">
            Seleksi (QC) Bahan Baku
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[#6E6E73] max-w-xl">
            Pilah kiriman bahan menjadi porsi layak konsumsi untuk dapur, bahan kompos organik untuk mitra tani, atau residu afkir.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 bg-white rounded-2xl border border-[#E8E8ED] self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('antrean')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'antrean'
                ? 'bg-[#1D1D1F] text-white shadow-xs'
                : 'text-[#6E6E73] hover:text-[#1D1D1F]'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Antrean Seleksi</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                activeTab === 'antrean' ? 'bg-white/20 text-white' : 'bg-[#EBF4EE] text-[#2E7D4F]'
              }`}
            >
              {queueItems.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('riwayat')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'riwayat'
                ? 'bg-[#1D1D1F] text-white shadow-xs'
                : 'text-[#6E6E73] hover:text-[#1D1D1F]'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Riwayat Seleksi</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                activeTab === 'riwayat' ? 'bg-white/20 text-white' : 'bg-[#F5F5F7] text-[#6E6E73]'
              }`}
            >
              {historyItems.length}
            </span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          TAB 1: ANTREAN SELEKSI (SPLIT VIEW KIRI ANTREAN, KANAN FORM QC)
          ========================================================================= */}
      {activeTab === 'antrean' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Kolom Kiri: Antrean Bahan Menunggu (5 Kolom) */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-[#E8E8ED] p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E8ED]">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-[#1D1D1F]">Daftar Antrean</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-semibold border border-amber-200/60">
                  {queueItems.length} kiriman
                </span>
              </div>
              <span className="text-[11px] text-[#6E6E73]">Pilih untuk menginspeksi</span>
            </div>

            <div className="space-y-2.5 max-h-[640px] overflow-y-auto pr-1">
              {queueItems.length === 0 ? (
                <div className="py-12 text-center text-xs text-[#6E6E73]">
                  Semua kiriman bahan telah diseleksi! Meja QC bersih. ✨
                </div>
              ) : (
                queueItems.map((item) => {
                  const isSelected = selectedItem?.id === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleSelectItem(item)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                        isSelected
                          ? 'bg-[#EBF4EE]/50 border-[#2E7D4F] shadow-xs ring-1 ring-[#2E7D4F]/30'
                          : 'bg-[#FBFBFD] hover:bg-[#F5F5F7] border-[#E8E8ED]'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#F5F5F7] border border-[#E8E8ED] shrink-0">
                        <SmartImage
                          src={item.foto}
                          alt={item.namaBahan}
                          fallbackEmoji="🌱"
                          aspectRatio="1:1"
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-[10px] font-mono text-[#6E6E73]">{item.id}</span>
                          <span className="text-xs font-extrabold text-[#1D1D1F]">
                            {item.beratAwal} kg
                          </span>
                        </div>
                        <h3 className="text-xs font-bold text-[#1D1D1F] truncate">
                          {item.namaBahan}
                        </h3>
                        <p className="text-[11px] text-[#6E6E73] truncate">
                          {item.supplierAsal.split('(')[0]}
                        </p>

                        <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                          {item.kondisi.slice(0, 2).map((c, i) => (
                            <span
                              key={i}
                              className="text-[9px] px-1.5 py-0.2 rounded bg-white border border-[#E8E8ED] text-[#6E6E73]"
                            >
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Kolom Kanan: Form Seleksi QC (7 Kolom) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-[#E8E8ED] p-5 sm:p-7 space-y-6">
            {!selectedItem ? (
              <div className="py-20 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#F5F5F7] text-[#6E6E73] flex items-center justify-center mx-auto">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-[#1D1D1F]">Tidak Ada Item Terpilih</h3>
                <p className="text-xs text-[#6E6E73] max-w-xs mx-auto">
                  Silakan pilih salah satu kiriman bahan di kolom antrean untuk memulai proses kendali mutu.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSimpanSeleksi} className="space-y-6">
                {/* Header Info Item Terpilih */}
                <div className="p-4 rounded-2xl bg-[#FBFBFD] border border-[#E8E8ED] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden bg-[#F5F5F7] border border-[#E8E8ED] shrink-0">
                      <SmartImage
                        src={selectedItem.foto}
                        alt={selectedItem.namaBahan}
                        fallbackEmoji="🌱"
                        aspectRatio="1:1"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-[#6E6E73]">{selectedItem.id}</span>
                        <WorkerStatusBadge status={selectedItem.status} size="sm" />
                      </div>
                      <h2 className="text-base font-bold text-[#1D1D1F] mt-0.5">
                        {selectedItem.namaBahan}
                      </h2>
                      <p className="text-xs text-[#6E6E73]">{selectedItem.supplierAsal}</p>
                    </div>
                  </div>

                  <div className="text-left sm:text-right pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E8E8ED]">
                    <span className="text-[11px] text-[#6E6E73] block">Berat Awal Datang</span>
                    <span className="text-2xl font-extrabold text-[#1D1D1F]">
                      {selectedItem.beratAwal}{' '}
                      <span className="text-xs font-normal text-[#6E6E73]">kg</span>
                    </span>
                  </div>
                </div>

                {/* Kondisi Datang & Catatan Logistik */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-[#1D1D1F]">Karakteristik Saat Tiba:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedItem.kondisi.map((c, i) => (
                      <span
                        key={i}
                        className="text-xs px-2.5 py-1 rounded-xl bg-[#F5F5F7] text-[#1D1D1F] border border-[#E8E8ED]"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                  {selectedItem.catatan && (
                    <p className="text-xs text-[#6E6E73] italic bg-[#F5F5F7]/50 p-2.5 rounded-xl border border-[#E8E8ED]/70">
                      "{selectedItem.catatan}"
                    </p>
                  )}
                </div>

                {/* =====================================================================
                    BAR VISUAL KOMPOSISI REALTIME
                    ===================================================================== */}
                <div className="space-y-2 p-4 rounded-2xl bg-[#FBFBFD] border border-[#E8E8ED]">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#1D1D1F]">Distribusi Bobot Seleksi</span>
                    <button
                      type="button"
                      onClick={handleAutoFill}
                      className="text-[11px] font-semibold text-[#2E7D4F] hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Rekomendasi Cepat (90/7/3)</span>
                    </button>
                  </div>

                  {/* Multi-segment Progress Bar */}
                  <div className="w-full h-3 bg-[#E8E8ED] rounded-full overflow-hidden flex transition-all">
                    {/* Layak: Hijau */}
                    <div
                      className="bg-[#2E7D4F] h-full transition-all duration-300"
                      style={{ width: `${Math.max(0, Math.min(100, pctLayak))}%` }}
                      title={`Layak: ${numLayak} kg (${Math.round(pctLayak)}%)`}
                    />
                    {/* Kompos: Cokelat / Amber-700 */}
                    <div
                      className="bg-[#A3704C] h-full transition-all duration-300"
                      style={{ width: `${Math.max(0, Math.min(100, pctKompos))}%` }}
                      title={`Kompos: ${numKompos} kg (${Math.round(pctKompos)}%)`}
                    />
                    {/* Dibuang: Abu-abu Gelap */}
                    <div
                      className="bg-[#8E8E93] h-full transition-all duration-300"
                      style={{ width: `${Math.max(0, Math.min(100, pctDibuang))}%` }}
                      title={`Dibuang: ${numDibuang} kg (${Math.round(pctDibuang)}%)`}
                    />
                  </div>

                  {/* Legend & Persentase */}
                  <div className="grid grid-cols-3 gap-2 pt-1 text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#2E7D4F] shrink-0" />
                      <span className="text-[#1D1D1F] font-semibold truncate">
                        Layak: {numLayak} kg ({Math.round(pctLayak)}%)
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#A3704C] shrink-0" />
                      <span className="text-[#1D1D1F] font-semibold truncate">
                        Kompos: {numKompos} kg ({Math.round(pctKompos)}%)
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#8E8E93] shrink-0" />
                      <span className="text-[#1D1D1F] font-semibold truncate">
                        Dibuang: {numDibuang} kg ({Math.round(pctDibuang)}%)
                      </span>
                    </div>
                  </div>

                  {/* Status Keseimbangan */}
                  <div className="pt-2 border-t border-[#E8E8ED] flex items-center justify-between text-[11px]">
                    <span>
                      Total dialokasikan: <strong>{totalDialokasikan}</strong> / {beratAwal} kg
                    </span>
                    {Math.abs(selisihBeratAwal) < 0.001 ? (
                      <span className="text-[#2E7D4F] font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Bobot Pas Seimbang</span>
                      </span>
                    ) : (
                      <span className="text-amber-600 font-semibold flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>
                          {selisihBeratAwal > 0
                            ? `Sisa belum terbagi: ${selisihBeratAwal} kg`
                            : `Kelebihan: ${Math.abs(selisihBeratAwal)} kg`}
                        </span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Error Message Box */}
                {errorMessage && (
                  <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2 animate-in fade-in">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* INPUT TAHAP 1: Layak vs Tidak Layak */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5 p-3.5 rounded-2xl bg-white border border-[#E8E8ED] focus-within:border-[#2E7D4F] transition-all">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-[#1D1D1F]">1. Jumlah Layak (kg)</label>
                      <span className="text-[10px] text-[#2E7D4F] font-semibold">Siap Diolah</span>
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        step="any"
                        min="0"
                        max={beratAwal}
                        value={layakKg}
                        onChange={(e) => {
                          const val = e.target.value === '' ? '' : Number(e.target.value);
                          setLayakKg(val);
                          // Auto balance tidak layak jika layak diisi
                          if (val !== '' && typeof val === 'number') {
                            const remaining = Math.max(0, Math.round((beratAwal - val) * 10) / 10);
                            setTidakLayakKg(remaining);
                            setKomposKg(remaining);
                            setDibuangKg(0);
                          }
                          setErrorMessage('');
                        }}
                        placeholder="0"
                        className="w-full py-1.5 pr-8 text-base font-extrabold text-[#1D1D1F] outline-none bg-transparent"
                        required
                      />
                      <span className="absolute right-0 top-1/2 -translate-y-1/2 text-xs text-[#6E6E73] font-semibold">
                        kg
                      </span>
                    </div>
                    <p className="text-[10px] text-[#6E6E73]">
                      Daging buah/sayur utuh tanpa kebusukan patogen.
                    </p>
                  </div>

                  <div className="space-y-1.5 p-3.5 rounded-2xl bg-white border border-[#E8E8ED] focus-within:border-[#2E7D4F] transition-all">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-[#1D1D1F]">2. Tidak Layak (kg)</label>
                      <span className="text-[10px] text-amber-700 font-semibold">Kompos / Buang</span>
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        step="any"
                        min="0"
                        max={beratAwal}
                        value={tidakLayakKg}
                        onChange={(e) => {
                          const val = e.target.value === '' ? '' : Number(e.target.value);
                          setTidakLayakKg(val);
                          if (val !== '' && typeof val === 'number') {
                            setKomposKg(val);
                            setDibuangKg(0);
                          }
                          setErrorMessage('');
                        }}
                        placeholder="0"
                        className="w-full py-1.5 pr-8 text-base font-extrabold text-[#1D1D1F] outline-none bg-transparent"
                        required
                      />
                      <span className="absolute right-0 top-1/2 -translate-y-1/2 text-xs text-[#6E6E73] font-semibold">
                        kg
                      </span>
                    </div>
                    <p className="text-[10px] text-[#6E6E73]">
                      Bahan busuk berlebih, layu parah, atau cacat patogen.
                    </p>
                  </div>
                </div>

                {/* INPUT TAHAP 2: Rincian Tidak Layak (Kompos vs Dibuang) */}
                <div className="p-4 rounded-2xl bg-[#F5F5F7] border border-[#E8E8ED] space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#1D1D1F]">
                      Rincian Alokasi Bahan Tidak Layak ({numTidakLayak} kg):
                    </span>
                    {Math.abs(selisihTidakLayak) < 0.001 ? (
                      <span className="text-[10px] text-[#2E7D4F] font-semibold">
                        ✓ Pas {numTidakLayak} kg
                      </span>
                    ) : (
                      <span className="text-[10px] text-amber-700 font-semibold">
                        Sisa {selisihTidakLayak} kg belum terbagi
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1 bg-white p-3 rounded-xl border border-[#E8E8ED]">
                      <label className="text-[11px] font-semibold text-[#1D1D1F] block">
                        Dijadikan Kompos (kg)
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          step="any"
                          min="0"
                          value={komposKg}
                          onChange={(e) => {
                            const val = e.target.value === '' ? '' : Number(e.target.value);
                            setKomposKg(val);
                            if (val !== '' && typeof val === 'number') {
                              setDibuangKg(Math.max(0, Math.round((numTidakLayak - val) * 10) / 10));
                            }
                            setErrorMessage('');
                          }}
                          placeholder="0"
                          className="w-full py-1 pr-8 text-sm font-bold text-[#A3704C] outline-none"
                        />
                        <span className="absolute right-0 top-1/2 -translate-y-1/2 text-xs text-[#6E6E73]">
                          kg
                        </span>
                      </div>
                      <span className="text-[10px] text-[#6E6E73] block">
                        Untuk bak pengomposan mitra tani
                      </span>
                    </div>

                    <div className="space-y-1 bg-white p-3 rounded-xl border border-[#E8E8ED]">
                      <label className="text-[11px] font-semibold text-[#1D1D1F] block">
                        Dibuang / Residu (kg)
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          step="any"
                          min="0"
                          value={dibuangKg}
                          onChange={(e) => {
                            const val = e.target.value === '' ? '' : Number(e.target.value);
                            setDibuangKg(val);
                            setErrorMessage('');
                          }}
                          placeholder="0"
                          className="w-full py-1 pr-8 text-sm font-bold text-[#8E8E93] outline-none"
                        />
                        <span className="absolute right-0 top-1/2 -translate-y-1/2 text-xs text-[#6E6E73]">
                          kg
                        </span>
                      </div>
                      <span className="text-[10px] text-[#6E6E73] block">
                        Limbah yang tidak dapat dikompos
                      </span>
                    </div>
                  </div>
                </div>

                {/* Catatan Tambahan QC */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#1D1D1F] block">
                    Catatan Tim Kendali Mutu (QC)
                  </label>
                  <textarea
                    rows={2}
                    value={catatanQC}
                    onChange={(e) => setCatatanQC(e.target.value)}
                    placeholder="Contoh: Kualitas aroma manis tinggi, brix memuaskan. Sisa kulit tebal siap masuk tong kompos."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E8ED] bg-[#F5F5F7] text-xs text-[#1D1D1F] focus:bg-white focus:border-[#2E7D4F] outline-none transition-all resize-none"
                  />
                </div>

                {/* Tombol Simpan */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-full bg-[#2E7D4F] hover:bg-[#256640] text-white text-sm font-semibold transition-all shadow-xs cursor-pointer active:scale-95 flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Simpan & Verifikasi Hasil Seleksi</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: RIWAYAT HASIL SELEKSI
          ========================================================================= */}
      {activeTab === 'riwayat' && (
        <div className="bg-white rounded-3xl border border-[#E8E8ED] overflow-hidden shadow-none p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E8E8ED]">
            <div>
              <h2 className="text-base font-bold text-[#1D1D1F]">Riwayat Seleksi Bahan</h2>
              <p className="text-xs text-[#6E6E73]">
                Semua bahan yang telah melalui inspeksi sortir kendali mutu dapur Ugly2Yummy
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#EBF4EE] text-[#2E7D4F] border border-[#2E7D4F]/20">
              {historyItems.length} Kiriman Selesai
            </span>
          </div>

          <div className="space-y-3">
            {historyItems.map((item) => {
              const qc = item.hasilSeleksi;
              const yieldPct = qc ? Math.round((qc.layak / item.beratAwal) * 100) : 0;

              return (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-[#FBFBFD] border border-[#E8E8ED] hover:border-[#2E7D4F]/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#F5F5F7] border border-[#E8E8ED] shrink-0">
                      <SmartImage
                        src={item.foto}
                        alt={item.namaBahan}
                        fallbackEmoji="🌱"
                        aspectRatio="1:1"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] font-mono text-[#6E6E73]">{item.id}</span>
                        <WorkerStatusBadge status={item.status} size="sm" />
                      </div>
                      <h3 className="text-sm font-bold text-[#1D1D1F] truncate">{item.namaBahan}</h3>
                      <p className="text-[11px] text-[#6E6E73] truncate">{item.supplierAsal}</p>
                    </div>
                  </div>

                  {/* Metrik Hasil QC */}
                  {qc && (
                    <div className="flex items-center gap-4 sm:gap-6 shrink-0 text-xs">
                      <div className="text-center">
                        <span className="text-[10px] text-[#6E6E73] block">Berat Datang</span>
                        <span className="font-extrabold text-[#1D1D1F]">{item.beratAwal} kg</span>
                      </div>

                      <div className="text-center">
                        <span className="text-[10px] text-[#2E7D4F] block">Layak Olah</span>
                        <span className="font-extrabold text-[#2E7D4F]">
                          {qc.layak} kg ({yieldPct}%)
                        </span>
                      </div>

                      <div className="text-center">
                        <span className="text-[10px] text-[#A3704C] block">Kompos</span>
                        <span className="font-bold text-[#A3704C]">{qc.dijadikanKompos} kg</span>
                      </div>

                      <div className="text-center">
                        <span className="text-[10px] text-[#8E8E93] block">Dibuang</span>
                        <span className="font-bold text-[#8E8E93]">{qc.dibuang} kg</span>
                      </div>

                      <div className="text-right pl-2 border-l border-[#E8E8ED]">
                        <span className="text-[10px] text-[#6E6E73] block">Tanggal Seleksi</span>
                        <span className="text-[11px] font-medium text-[#1D1D1F]">
                          {qc.tanggalSeleksi}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
