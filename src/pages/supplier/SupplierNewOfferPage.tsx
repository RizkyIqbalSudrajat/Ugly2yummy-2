import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useSupplierAuth } from '../../context/SupplierAuthContext';
import { SupplierCommodityType } from '../../types/supplier';
import { Button } from '../../components/ui/Button';
import {
  ArrowLeft,
  UploadCloud,
  X,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Info,
  Calendar,
  MapPin,
  Tag,
  DollarSign,
  Package,
} from 'lucide-react';

const COMMODITY_TYPES: SupplierCommodityType[] = ['Sayur', 'Buah', 'Umbi', 'Rempah'];

const CONDITION_OPTIONS = [
  'Bentuk tidak seragam',
  'Ukuran kecil',
  'Kulit bercak/tergores',
  'Terlalu matang',
  'Lainnya',
];


export const SupplierNewOfferPage: React.FC = () => {
  const { addOffer, supplier } = useSupplierAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const prefill = (location.state as { prefillOffer?: any } | null)?.prefillOffer;

  // State Form (Mendukung Prefill dari Ajukan Ulang)
  const [namaBahan, setNamaBahan] = useState<string>(prefill?.namaBahan || '');
  const [jenisBahan, setJenisBahan] = useState<SupplierCommodityType>(prefill?.jenisBahan || 'Sayur');
  const [jumlahKg, setJumlahKg] = useState<number | ''>(prefill?.jumlahKg || '');
  const [selectedConditions, setSelectedConditions] = useState<string[]>(
    prefill?.kondisi || ['Bentuk tidak seragam']
  );
  const [catatanKondisi, setCatatanKondisi] = useState<string>(prefill?.catatanKondisi || '');
  const [hargaPerKg, setHargaPerKg] = useState<number | ''>(prefill?.hargaPerKg || '');
  const [tanggalPanen, setTanggalPanen] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().split('T')[0];
  });
  const [batasPenggunaan, setBatasPenggunaan] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  });
  const [alamat, setAlamat] = useState<string>(
    prefill?.lokasiPengambilan?.alamat || 'Kebun Blok Pasir Wangi No. 14, RT 02 / RW 07'
  );
  const [kota, setKota] = useState<string>(
    prefill?.lokasiPengambilan?.kota || 'Lembang, Bandung Barat'
  );
  const [pesanPenawaran, setPesanPenawaran] = useState<string>(prefill?.pesanPenawaran || '');


  // State Upload Foto
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  // State Validasi & Notifikasi
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Toggle Chip Kondisi
  const toggleCondition = (cond: string) => {
    setSelectedConditions((prev) =>
      prev.includes(cond) ? prev.filter((c) => c !== cond) : [...prev, cond]
    );
    if (errors.kondisi) {
      setErrors((prev) => ({ ...prev, kondisi: '' }));
    }
  };

  // Upload Foto Handler
  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const fileArray = Array.from(files);
    const availableSlots = 5 - uploadedPhotos.length;
    if (availableSlots <= 0) return;

    const newPhotoUrls: string[] = [];
    fileArray.slice(0, availableSlots).forEach((file) => {
      try {
        const url = URL.createObjectURL(file);
        newPhotoUrls.push(url);
      } catch {
        // fallback
      }
    });

    setUploadedPhotos((prev) => [...prev, ...newPhotoUrls]);
  };

  const removePhoto = (index: number) => {
    setUploadedPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  // Hitung total harga otomatis
  const numKg = typeof jumlahKg === 'number' ? jumlahKg : 0;
  const numHarga = typeof hargaPerKg === 'number' ? hargaPerKg : 0;
  const totalEstimasi = numKg * numHarga;

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Validasi Form
  const validate = () => {
    const errs: Record<string, string> = {};
    if (!namaBahan.trim()) {
      errs.namaBahan = 'Nama komoditas bahan wajib diisi.';
    }
    if (!jumlahKg || jumlahKg <= 0) {
      errs.jumlahKg = 'Jumlah panen minimal 1 kg.';
    }
    if (selectedConditions.length === 0) {
      errs.kondisi = 'Pilih minimal satu kondisi bahan.';
    }
    if (!hargaPerKg || hargaPerKg <= 0) {
      errs.hargaPerKg = 'Harga penawaran per kg wajib diisi.';
    }
    if (!tanggalPanen) {
      errs.tanggalPanen = 'Tanggal panen wajib ditentukan.';
    }
    if (!batasPenggunaan) {
      errs.batasPenggunaan = 'Batas penggunaan wajib ditentukan.';
    }
    if (!alamat.trim()) {
      errs.alamat = 'Alamat penjemputan kebun wajib diisi.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      window.scrollTo({ top: 120, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);

    // Siapkan foto: jika belum upload foto, gunakan foto sampel kebun
    const finalPhotos =
      uploadedPhotos.length > 0
        ? uploadedPhotos
        : [
            'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80',
          ];

    addOffer({
      namaBahan: namaBahan.trim(),
      jenisBahan,
      jumlahKg: Number(jumlahKg),
      kondisi: selectedConditions,
      catatanKondisi: catatanKondisi.trim() || 'Kondisi panen unik siap serap.',
      hargaPerKg: Number(hargaPerKg),
      tanggalPanen,
      batasPenggunaan,
      lokasiPengambilan: {
        alamat: alamat.trim(),
        kota: kota.trim() || 'Lembang, Bandung Barat',
      },
      foto: finalPhotos,
      pesanPenawaran:
        pesanPenawaran.trim() ||
        `Tersedia ${jumlahKg} kg ${namaBahan} panen segar lereng Lembang. Siap diserap tim Ugly2Yummy.`,
    });

    // Tampilkan Toast
    setToastMessage('Penawaran terkirim, menunggu persetujuan admin');

    // Redirect ke Penawaran Saya setelah jeda singkat
    setTimeout(() => {
      navigate('/supplier/penawaran-saya');
    }, 1200);
  };

  return (
    <div className="space-y-6 pb-24 lg:pb-12 animate-in fade-in duration-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-[#1D1D1F] text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 border border-white/10 animate-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="w-5 h-5 text-[#8FE3AC] shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex items-center gap-3">
        <Link
          to="/supplier/dashboard"
          className="p-2 rounded-full hover:bg-[#F5F5F7] text-[#6E6E73] hover:text-[#1D1D1F] transition-colors"
          aria-label="Kembali ke Ringkasan"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1D1D1F]">
            Ajukan Penawaran Bahan
          </h1>
          <p className="mt-0.5 text-xs sm:text-sm text-[#6E6E73]">
            Daftarkan hasil panen unik atau surplus kebun Anda untuk dihargai secara adil oleh Ugly2Yummy.
          </p>
        </div>
      </div>

      {/* Main Grid: Form di Kiri, Sticky Summary di Kanan */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* =====================================================================
            KOLOM KIRI: FORM SATU KOLOM YANG LEGA
            ===================================================================== */}
        <form onSubmit={handleSubmit} className="lg:col-span-8 space-y-6">
          {/* A. Informasi Bahan */}
          <div className="bg-white rounded-3xl border border-[#E8E8ED] p-6 sm:p-7 shadow-none space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-[#E8E8ED]/60">
              <Package className="w-4 h-4 text-[#2E7D4F]" />
              <h2 className="text-base font-bold text-[#1D1D1F]">
                A. Informasi Komoditas Bahan
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Nama Bahan */}
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-semibold text-[#1D1D1F] block">
                  Nama Bahan Panen <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={namaBahan}
                  onChange={(e) => {
                    setNamaBahan(e.target.value);
                    if (errors.namaBahan) setErrors((prev) => ({ ...prev, namaBahan: '' }));
                  }}
                  placeholder="Contoh: Tomat Bengkok, Wortel Bercabang, Kentang Mungil"
                  className="w-full px-4 py-2.5 rounded-2xl border border-[#E8E8ED] bg-[#F5F5F7] text-sm text-[#1D1D1F] placeholder-[#6E6E73]/50 focus:border-[#2E7D4F] focus:bg-white focus:ring-2 focus:ring-[#2E7D4F]/15 outline-none transition-all"
                />
                {errors.namaBahan && (
                  <p className="text-[11px] text-red-500 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.namaBahan}</span>
                  </p>
                )}
              </div>

              {/* Jenis Bahan */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1D1D1F] block">
                  Jenis Komoditas <span className="text-red-500">*</span>
                </label>
                <select
                  value={jenisBahan}
                  onChange={(e) => setJenisBahan(e.target.value as SupplierCommodityType)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-[#E8E8ED] bg-[#F5F5F7] text-sm text-[#1D1D1F] focus:border-[#2E7D4F] focus:bg-white focus:ring-2 focus:ring-[#2E7D4F]/15 outline-none transition-all cursor-pointer"
                >
                  {COMMODITY_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Jumlah (kg) */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1D1D1F] block">
                  Jumlah Panen (kg) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    value={jumlahKg}
                    onChange={(e) => {
                      const val = e.target.value === '' ? '' : Math.max(0, Number(e.target.value));
                      setJumlahKg(val);
                      if (errors.jumlahKg) setErrors((prev) => ({ ...prev, jumlahKg: '' }));
                    }}
                    placeholder="Contoh: 85"
                    className="w-full pl-4 pr-12 py-2.5 rounded-2xl border border-[#E8E8ED] bg-[#F5F5F7] text-sm text-[#1D1D1F] placeholder-[#6E6E73]/50 focus:border-[#2E7D4F] focus:bg-white focus:ring-2 focus:ring-[#2E7D4F]/15 outline-none transition-all"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-[#6E6E73] pointer-events-none">
                    kg
                  </span>
                </div>
                {errors.jumlahKg && (
                  <p className="text-[11px] text-red-500 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.jumlahKg}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* B. Kondisi Bahan */}
          <div className="bg-white rounded-3xl border border-[#E8E8ED] p-6 sm:p-7 shadow-none space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-[#E8E8ED]/60">
              <Tag className="w-4 h-4 text-[#2E7D4F]" />
              <div>
                <h2 className="text-base font-bold text-[#1D1D1F]">
                  B. Karakteristik & Kondisi Bahan
                </h2>
                <p className="text-[11px] text-[#6E6E73]">
                  Pilih semua ciri keunikan yang dimiliki komoditas ini.
                </p>
              </div>
            </div>

            {/* Chips Pilihan Ganda */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#1D1D1F] block">
                Kondisi Fisik Panen (bisa pilih lebih dari satu) <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {CONDITION_OPTIONS.map((cond) => {
                  const isSelected = selectedConditions.includes(cond);
                  return (
                    <button
                      key={cond}
                      type="button"
                      onClick={() => toggleCondition(cond)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#EBF4EE] text-[#2E7D4F] border-[#2E7D4F] font-semibold shadow-xs'
                          : 'bg-[#F5F5F7] text-[#6E6E73] border-[#E8E8ED] hover:text-[#1D1D1F] hover:bg-[#E8E8ED]/70'
                      }`}
                    >
                      {isSelected ? `✓ ${cond}` : `+ ${cond}`}
                    </button>
                  );
                })}
              </div>
              {errors.kondisi && (
                <p className="text-[11px] text-red-500 flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.kondisi}</span>
                </p>
              )}
            </div>

            {/* Textarea Catatan Kondisi */}
            <div className="space-y-1.5 pt-1">
              <label className="text-xs font-semibold text-[#1D1D1F] block">
                Catatan Rinci Kondisi Bahan (Opsional)
              </label>
              <textarea
                rows={2}
                value={catatanKondisi}
                onChange={(e) => setCatatanKondisi(e.target.value)}
                placeholder="Contoh: Bentuk melengkung karena angin lereng, daging buah padat manis dan tidak ada busuk basah."
                className="w-full px-4 py-2.5 rounded-2xl border border-[#E8E8ED] bg-[#F5F5F7] text-sm text-[#1D1D1F] placeholder-[#6E6E73]/50 focus:border-[#2E7D4F] focus:bg-white focus:ring-2 focus:ring-[#2E7D4F]/15 outline-none transition-all resize-none"
              />
            </div>
          </div>

          {/* C. Harga & Estimasi Total */}
          <div className="bg-white rounded-3xl border border-[#E8E8ED] p-6 sm:p-7 shadow-none space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-[#E8E8ED]/60">
              <DollarSign className="w-4 h-4 text-[#2E7D4F]" />
              <h2 className="text-base font-bold text-[#1D1D1F]">
                C. Kesepakatan Harga & Estimasi
              </h2>
            </div>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1D1D1F] block">
                  Harga Penawaran per kg (Rp) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#6E6E73]">
                    Rp
                  </span>
                  <input
                    type="number"
                    min="100"
                    step="100"
                    value={hargaPerKg}
                    onChange={(e) => {
                      const val = e.target.value === '' ? '' : Math.max(0, Number(e.target.value));
                      setHargaPerKg(val);
                      if (errors.hargaPerKg) setErrors((prev) => ({ ...prev, hargaPerKg: '' }));
                    }}
                    placeholder="8000"
                    className="w-full pl-11 pr-4 py-2.5 rounded-2xl border border-[#E8E8ED] bg-[#F5F5F7] text-sm text-[#1D1D1F] placeholder-[#6E6E73]/50 focus:border-[#2E7D4F] focus:bg-white focus:ring-2 focus:ring-[#2E7D4F]/15 outline-none transition-all"
                  />
                </div>
                {errors.hargaPerKg && (
                  <p className="text-[11px] text-red-500 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.hargaPerKg}</span>
                  </p>
                )}
              </div>

              {/* Tampilan Estimasi Total Otomatis */}
              <div className="p-4 rounded-2xl bg-[#F5F5F7] border border-[#E8E8ED] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-xs text-[#6E6E73] block">
                    Estimasi Total Penawaran Otomatis
                  </span>
                  <span className="text-[11px] text-[#6E6E73]">
                    {numKg > 0 && numHarga > 0
                      ? `${numKg} kg × ${formatRupiah(numHarga)}/kg`
                      : 'Masukkan jumlah kg dan harga untuk kalkulasi'}
                  </span>
                </div>
                <div className="text-xl sm:text-2xl font-bold tracking-tight text-[#2E7D4F]">
                  {formatRupiah(totalEstimasi)}
                </div>
              </div>
            </div>
          </div>

          {/* D. Waktu Panen & Batas Penggunaan */}
          <div className="bg-white rounded-3xl border border-[#E8E8ED] p-6 sm:p-7 shadow-none space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-[#E8E8ED]/60">
              <Calendar className="w-4 h-4 text-[#2E7D4F]" />
              <h2 className="text-base font-bold text-[#1D1D1F]">
                D. Waktu Panen & Masa Layak Simpan
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1D1D1F] block">
                  Tanggal Panen <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={tanggalPanen}
                  onChange={(e) => setTanggalPanen(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-[#E8E8ED] bg-[#F5F5F7] text-sm text-[#1D1D1F] focus:border-[#2E7D4F] focus:bg-white focus:ring-2 focus:ring-[#2E7D4F]/15 outline-none transition-all cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1D1D1F] block">
                  Batas Penggunaan Terbaik <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={batasPenggunaan}
                  onChange={(e) => setBatasPenggunaan(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-[#E8E8ED] bg-[#F5F5F7] text-sm text-[#1D1D1F] focus:border-[#2E7D4F] focus:bg-white focus:ring-2 focus:ring-[#2E7D4F]/15 outline-none transition-all cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* E. Lokasi Pengambilan */}
          <div className="bg-white rounded-3xl border border-[#E8E8ED] p-6 sm:p-7 shadow-none space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-[#E8E8ED]/60">
              <MapPin className="w-4 h-4 text-[#2E7D4F]" />
              <h2 className="text-base font-bold text-[#1D1D1F]">
                E. Lokasi Pengambilan Komoditas
              </h2>
            </div>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1D1D1F] block">
                  Alamat Lengkap Sentra / Kebun <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={2}
                  value={alamat}
                  onChange={(e) => {
                    setAlamat(e.target.value);
                    if (errors.alamat) setErrors((prev) => ({ ...prev, alamat: '' }));
                  }}
                  placeholder="Contoh: Kebun Blok Pasir Wangi No. 14, RT 02 / RW 07"
                  className="w-full px-4 py-2.5 rounded-2xl border border-[#E8E8ED] bg-[#F5F5F7] text-sm text-[#1D1D1F] placeholder-[#6E6E73]/50 focus:border-[#2E7D4F] focus:bg-white focus:ring-2 focus:ring-[#2E7D4F]/15 outline-none transition-all resize-none"
                />
                {errors.alamat && (
                  <p className="text-[11px] text-red-500 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.alamat}</span>
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1D1D1F] block">
                  Kota / Kabupaten
                </label>
                <input
                  type="text"
                  value={kota}
                  onChange={(e) => setKota(e.target.value)}
                  placeholder="Lembang, Bandung Barat"
                  className="w-full px-4 py-2.5 rounded-2xl border border-[#E8E8ED] bg-[#F5F5F7] text-sm text-[#1D1D1F] placeholder-[#6E6E73]/50 focus:border-[#2E7D4F] focus:bg-white focus:ring-2 focus:ring-[#2E7D4F]/15 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* F. Foto Bahan Panen (Drag & Drop + Preview) */}
          <div className="bg-white rounded-3xl border border-[#E8E8ED] p-6 sm:p-7 shadow-none space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#E8E8ED]/60">
              <div className="flex items-center gap-2">
                <UploadCloud className="w-4 h-4 text-[#2E7D4F]" />
                <h2 className="text-base font-bold text-[#1D1D1F]">
                  F. Foto Bahan Panen (Maksimal 5 Foto)
                </h2>
              </div>
              <span className="text-xs text-[#6E6E73] font-medium">
                {uploadedPhotos.length}/5 Foto
              </span>
            </div>

            {/* Teks Bantuan Edukatif */}
            <div className="p-3 rounded-2xl bg-[#EBF4EE] border border-[#2E7D4F]/20 flex items-start gap-2.5 text-xs text-[#1D1D1F]">
              <Info className="w-4 h-4 text-[#2E7D4F] shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <span className="font-semibold text-[#2E7D4F]">Foto apa adanya</span> — justru kami ingin melihat bentuk aslinya untuk menentukan kecocokan resep olahan artisan kami.
              </p>
            </div>

            {/* Drag & Drop Area */}
            {uploadedPhotos.length < 5 && (
              <label
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  handleFiles(e.dataTransfer.files);
                }}
                className={`border-2 border-dashed rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-[#2E7D4F] bg-[#EBF4EE]/50 scale-[0.99]'
                    : 'border-[#E8E8ED] bg-[#F5F5F7] hover:border-[#2E7D4F]/50 hover:bg-white'
                }`}
              >
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleFiles(e.target.files)}
                  className="hidden"
                />
                <div className="w-12 h-12 rounded-2xl bg-white border border-[#E8E8ED] text-[#2E7D4F] flex items-center justify-center mb-2 shadow-xs">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-[#1D1D1F]">
                  Klik atau geser foto bahan ke sini
                </p>
                <p className="text-xs text-[#6E6E73] mt-1">
                  Format JPG, PNG atau WebP (Maks. 5 MB per foto)
                </p>
              </label>
            )}

            {/* Preview Thumbnails */}
            {uploadedPhotos.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
                {uploadedPhotos.map((url, index) => (
                  <div
                    key={index}
                    className="relative group rounded-2xl overflow-hidden border border-[#E8E8ED] bg-[#F5F5F7] aspect-square"
                  >
                    <img
                      src={url}
                      alt={`Preview foto ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center transition-colors cursor-pointer shadow-xs"
                      aria-label="Hapus foto"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* G. Pesan Penawaran */}
          <div className="bg-white rounded-3xl border border-[#E8E8ED] p-6 sm:p-7 shadow-none space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-[#E8E8ED]/60">
              <Sparkles className="w-4 h-4 text-[#2E7D4F]" />
              <h2 className="text-base font-bold text-[#1D1D1F]">
                G. Pesan Penawaran Petani
              </h2>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#1D1D1F] block">
                Cerita Singkat Bahan / Pesan Tambahan
              </label>
              <textarea
                rows={3}
                value={pesanPenawaran}
                onChange={(e) => setPesanPenawaran(e.target.value)}
                placeholder="Tersedia 80 kg tomat yang masih layak konsumsi. Bentuknya kurang seragam sehingga ditolak pengepul. Kami tawarkan agar tidak terbuang."
                className="w-full px-4 py-2.5 rounded-2xl border border-[#E8E8ED] bg-[#F5F5F7] text-sm text-[#1D1D1F] placeholder-[#6E6E73]/50 focus:border-[#2E7D4F] focus:bg-white focus:ring-2 focus:ring-[#2E7D4F]/15 outline-none transition-all resize-none"
              />
            </div>
          </div>

          {/* Desktop Submit Button (also inside form) */}
          <div className="hidden lg:block pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Mengirim Penawaran...' : 'Kirim Penawaran'}
            </Button>
          </div>
        </form>

        {/* =====================================================================
            KOLOM KANAN (DESKTOP): STICKY SUMMARY CARD
            ===================================================================== */}
        <aside className="hidden lg:block lg:col-span-4 sticky top-6">
          <div className="bg-white rounded-3xl border border-[#E8E8ED] p-6 shadow-none space-y-5">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#2E7D4F] bg-[#EBF4EE] px-2 py-0.5 rounded-full border border-[#2E7D4F]/20">
                Pratinjau Langsung
              </span>
              <h3 className="text-lg font-bold tracking-tight text-[#1D1D1F] mt-1.5">
                Ringkasan Penawaran
              </h3>
              <p className="text-xs text-[#6E6E73]">
                Ditinjau oleh kurator tim Ugly2Yummy setelah dikirim.
              </p>
            </div>

            <div className="divide-y divide-[#E8E8ED]/70 text-xs">
              {/* Komoditas */}
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-[#6E6E73]">Bahan:</span>
                <span className="font-bold text-[#1D1D1F] text-right truncate max-w-[180px]">
                  {namaBahan.trim() || '—'}
                </span>
              </div>

              {/* Kategori */}
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-[#6E6E73]">Jenis:</span>
                <span className="font-semibold px-2 py-0.5 rounded-full bg-[#F5F5F7] text-[#1D1D1F]">
                  {jenisBahan}
                </span>
              </div>

              {/* Kuantitas */}
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-[#6E6E73]">Jumlah:</span>
                <span className="font-bold text-[#1D1D1F]">
                  {numKg > 0 ? `${numKg} kg` : '—'}
                </span>
              </div>

              {/* Harga per kg */}
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-[#6E6E73]">Harga / kg:</span>
                <span className="font-semibold text-[#1D1D1F]">
                  {numHarga > 0 ? formatRupiah(numHarga) : '—'}
                </span>
              </div>

              {/* Kondisi yang dipilih */}
              <div className="py-2.5 space-y-1.5">
                <span className="text-[#6E6E73] block">Karakter Fisik:</span>
                <div className="flex flex-wrap gap-1">
                  {selectedConditions.map((c) => (
                    <span
                      key={c}
                      className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#F5F5F7] text-[#1D1D1F] border border-[#E8E8ED]"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              {/* Lokasi */}
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-[#6E6E73]">Lokasi:</span>
                <span className="font-medium text-[#1D1D1F] text-right truncate max-w-[170px]">
                  {kota || 'Lembang'}
                </span>
              </div>

              {/* Estimasi Total Nilai Penawaran */}
              <div className="pt-3 pb-1 flex items-baseline justify-between">
                <span className="text-xs font-bold text-[#1D1D1F]">Total Estimasi:</span>
                <span className="text-xl font-extrabold text-[#2E7D4F]">
                  {formatRupiah(totalEstimasi)}
                </span>
              </div>
            </div>

            {/* Tombol Kirim di Sidebar Sticky Desktop */}
            <div className="pt-2 border-t border-[#E8E8ED]">
              <Button
                type="button"
                onClick={handleSubmit}
                variant="primary"
                size="md"
                fullWidth
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Mengirim...' : 'Kirim Penawaran'}
              </Button>
            </div>
          </div>
        </aside>
      </div>

      {/* =========================================================================
          HP / MOBILE: STICKY BOTTOM BAR (TOMBOL KIRIM MENEMPEL DI BAWAH LAYAR)
          ========================================================================= */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-[#E8E8ED] px-4 py-3 z-40 flex items-center justify-between gap-4 shadow-lg">
        <div>
          <span className="text-[10px] text-[#6E6E73] block">Total Estimasi</span>
          <span className="text-base font-bold text-[#2E7D4F]">
            {formatRupiah(totalEstimasi)}
          </span>
        </div>
        <div className="w-1/2">
          <Button
            type="button"
            onClick={handleSubmit}
            variant="primary"
            size="md"
            fullWidth
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Mengirim...' : 'Kirim'}
          </Button>
        </div>
      </div>
    </div>
  );
};
