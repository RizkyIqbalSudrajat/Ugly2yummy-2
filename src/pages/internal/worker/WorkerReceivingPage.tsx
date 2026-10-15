import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useWorkerData } from '../../../context/WorkerDataContext';
import {
  MaterialReceiving,
  IngredientCategory,
  ReceivingCondition,
  ReceivingStatus,
} from '../../../types/worker';
import { DUMMY_SUPPLIERS } from '../../../data/workerDummy';
import { SmartImage } from '../../../components/ui/SmartImage';
import { WorkerStatusBadge } from '../../../components/internal/WorkerStatusBadge';
import {
  PackageCheck,
  Plus,
  Search,
  Filter,
  X,
  Upload,
  Calendar,
  CheckCircle2,
  Clock,
  ChevronRight,
  AlertCircle,
  FileText,
  User,
  Scale,
  Camera,
  Layers,
  Sparkles,
} from 'lucide-react';

const CONDITION_OPTIONS: ReceivingCondition[] = [
  'Bentuk tidak seragam',
  'Ukuran kecil',
  'Kulit bercak/tergores',
  'Terlalu matang',
  'Sebagian busuk',
];

const PRESET_PHOTOS = [
  {
    label: 'Tomat Bengkok',
    url: 'https://images.unsplash.com/photo-1566842600175-97dca489844f?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Pisang Berbintik',
    url: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Mangga Mungil',
    url: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Wortel Bercabang',
    url: 'https://images.unsplash.com/photo-1447175008436-054170c2e979?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Stroberi Penyok',
    url: 'https://images.unsplash.com/photo-1587393855524-087f83d95bc9?auto=format&fit=crop&w=800&q=80',
  },
];

export const WorkerReceivingPage: React.FC = () => {
  const { receivings, addReceiving } = useWorkerData();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Tab Filter
  const [activeTab, setActiveTab] = useState<'Semua' | ReceivingStatus>('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  // Panel Drawer Form
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedReceiving, setSelectedReceiving] = useState<MaterialReceiving | null>(null);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [supplierAsal, setSupplierAsal] = useState(DUMMY_SUPPLIERS[0]);
  const [jenisBahan, setJenisBahan] = useState<IngredientCategory>('Buah');
  const [namaBahan, setNamaBahan] = useState('');
  const [beratAwal, setBeratAwal] = useState<number | ''>('');
  const [tanggalMasuk, setTanggalMasuk] = useState('14 Okt 2026');
  const [selectedConditions, setSelectedConditions] = useState<ReceivingCondition[]>([]);
  const [catatan, setCatatan] = useState('');
  const [fotoUrl, setFotoUrl] = useState(PRESET_PHOTOS[0].url);
  const [formError, setFormError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cek parameter ?tambah=true untuk auto-open form
  useEffect(() => {
    if (searchParams.get('tambah') === 'true') {
      setDrawerOpen(true);
      // Hapus param agar tidak memicu terus saat refresh
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  // Handle Photo Upload Local Preview
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const localUrl = URL.createObjectURL(file);
      setFotoUrl(localUrl);
    }
  };

  const toggleCondition = (condition: ReceivingCondition) => {
    setSelectedConditions((prev) =>
      prev.includes(condition)
        ? prev.filter((c) => c !== condition)
        : [...prev, condition]
    );
  };

  const handleResetForm = () => {
    setSupplierAsal(DUMMY_SUPPLIERS[0]);
    setJenisBahan('Buah');
    setNamaBahan('');
    setBeratAwal('');
    setTanggalMasuk('14 Okt 2026');
    setSelectedConditions([]);
    setCatatan('');
    setFotoUrl(PRESET_PHOTOS[0].url);
    setFormError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!namaBahan.trim()) {
      setFormError('Nama bahan baku wajib diisi.');
      return;
    }
    if (!beratAwal || Number(beratAwal) <= 0) {
      setFormError('Berat awal bahan harus lebih dari 0 kg.');
      return;
    }
    if (selectedConditions.length === 0) {
      setFormError('Pilih minimal satu kondisi bahan saat datang.');
      return;
    }

    addReceiving({
      supplierAsal,
      namaBahan: namaBahan.trim(),
      jenis: jenisBahan,
      beratAwal: Number(beratAwal),
      tanggalMasuk,
      kondisi: selectedConditions,
      catatan: catatan.trim() || 'Kondisi bahan telah diperiksa visual saat kedatangan.',
      foto: fotoUrl,
      dicatatOleh: 'Dewi Lestari',
    });

    handleResetForm();
    setDrawerOpen(false);

    // Tampilkan Toast
    setToastMessage('Bahan masuk tercatat, siap diseleksi');
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filter Data
  const filteredReceivings = receivings.filter((item) => {
    const matchTab = activeTab === 'Semua' || item.status === activeTab;
    const matchSearch =
      item.namaBahan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.supplierAsal.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchTab && matchSearch;
  });

  const countSemua = receivings.length;
  const countMenunggu = receivings.filter((r) => r.status === 'Menunggu Diseleksi').length;
  const countSudah = receivings.filter((r) => r.status === 'Sudah Diseleksi').length;

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
              Penerimaan Logistik
            </span>
            <span className="text-xs text-[#6E6E73]">· Dapur Ugly2Yummy</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1D1D1F]">
            Penerimaan Bahan Baku
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[#6E6E73] max-w-xl">
            Catat hasil penimbangan kiriman bahan tidak sempurna dari mitra tani sebelum masuk meja sortir seleksi mutu.
          </p>
        </div>

        {/* Tombol Buka Form */}
        <button
          type="button"
          onClick={() => {
            handleResetForm();
            setDrawerOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#2E7D4F] hover:bg-[#256640] text-white text-xs sm:text-sm font-semibold transition-all shadow-xs cursor-pointer active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Catat Bahan Masuk</span>
        </button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-2 sm:p-2.5 rounded-2xl border border-[#E8E8ED]">
        {/* Tab Selector */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('Semua')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'Semua'
                ? 'bg-[#1D1D1F] text-white shadow-xs'
                : 'text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-[#F5F5F7]'
            }`}
          >
            <span>Semua</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                activeTab === 'Semua' ? 'bg-white/20 text-white' : 'bg-[#E8E8ED] text-[#6E6E73]'
              }`}
            >
              {countSemua}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('Menunggu Diseleksi')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'Menunggu Diseleksi'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-[#F5F5F7]'
            }`}
          >
            <span>Menunggu Diseleksi</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                activeTab === 'Menunggu Diseleksi'
                  ? 'bg-white/20 text-white'
                  : 'bg-amber-100 text-amber-700'
              }`}
            >
              {countMenunggu}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('Sudah Diseleksi')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'Sudah Diseleksi'
                ? 'bg-[#2E7D4F] text-white shadow-xs'
                : 'text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-[#F5F5F7]'
            }`}
          >
            <span>Sudah Diseleksi</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                activeTab === 'Sudah Diseleksi'
                  ? 'bg-white/20 text-white'
                  : 'bg-[#EBF4EE] text-[#2E7D4F]'
              }`}
            >
              {countSudah}
            </span>
          </button>
        </div>

        {/* Input Pencarian */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6E6E73]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari bahan, supplier, ID..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#F5F5F7] border border-[#E8E8ED] text-xs text-[#1D1D1F] placeholder-[#6E6E73]/60 focus:bg-white focus:border-[#2E7D4F] outline-none transition-all"
          />
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-3xl border border-[#E8E8ED] overflow-hidden shadow-none">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#E8E8ED] bg-[#FBFBFD] text-[11px] font-semibold text-[#6E6E73] uppercase tracking-wider">
              <th className="py-3.5 px-4">ID Kiriman</th>
              <th className="py-3.5 px-4">Bahan Baku</th>
              <th className="py-3.5 px-4">Supplier Asal</th>
              <th className="py-3.5 px-4 text-right">Berat Awal</th>
              <th className="py-3.5 px-4">Tgl Masuk</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8E8ED] text-xs">
            {filteredReceivings.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-[#6E6E73]">
                  Tidak ada data penerimaan bahan yang sesuai.
                </td>
              </tr>
            ) : (
              filteredReceivings.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-[#FBFBFD] transition-colors group cursor-pointer"
                  onClick={() => setSelectedReceiving(item)}
                >
                  <td className="py-3.5 px-4 font-mono font-medium text-[#6E6E73]">
                    {item.id}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#F5F5F7] border border-[#E8E8ED] shrink-0">
                        <SmartImage
                          src={item.foto}
                          alt={item.namaBahan}
                          fallbackEmoji="🌱"
                          aspectRatio="1:1"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-bold text-[#1D1D1F] group-hover:text-[#2E7D4F] transition-colors">
                          {item.namaBahan}
                        </p>
                        <span className="text-[10px] text-[#6E6E73] px-1.5 py-0.5 rounded-md bg-[#F5F5F7] border border-[#E8E8ED]">
                          {item.jenis}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-[#1D1D1F]">
                    <p className="truncate max-w-[200px]">{item.supplierAsal.split('(')[0]}</p>
                    <p className="text-[10px] text-[#6E6E73]">
                      {item.supplierAsal.includes('(') ? `(${item.supplierAsal.split('(')[1]}` : ''}
                    </p>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="font-extrabold text-[#1D1D1F] text-sm">
                      {item.beratAwal}
                    </span>
                    <span className="text-[11px] text-[#6E6E73] ml-1">kg</span>
                  </td>
                  <td className="py-3.5 px-4 text-[#6E6E73]">{item.tanggalMasuk}</td>
                  <td className="py-3.5 px-4">
                    <WorkerStatusBadge status={item.status} size="sm" />
                  </td>
                  <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                    {item.status === 'Menunggu Diseleksi' ? (
                      <button
                        type="button"
                        onClick={() => navigate(`/internal/pekerja/seleksi?trmId=${item.id}`)}
                        className="px-3 py-1.5 rounded-full bg-[#EBF4EE] hover:bg-[#2E7D4F] text-[#2E7D4F] hover:text-white text-xs font-semibold border border-[#2E7D4F]/20 transition-all cursor-pointer"
                      >
                        Seleksi
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setSelectedReceiving(item)}
                        className="px-3 py-1.5 rounded-full bg-[#F5F5F7] hover:bg-[#E8E8ED] text-[#1D1D1F] text-xs font-medium transition-all cursor-pointer"
                      >
                        Detail
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {filteredReceivings.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E8E8ED] p-8 text-center text-xs text-[#6E6E73]">
            Tidak ada data penerimaan bahan.
          </div>
        ) : (
          filteredReceivings.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedReceiving(item)}
              className="bg-white rounded-2xl border border-[#E8E8ED] p-4 space-y-3 cursor-pointer active:bg-[#F5F5F7] transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#F5F5F7] border border-[#E8E8ED] shrink-0">
                    <SmartImage
                      src={item.foto}
                      alt={item.namaBahan}
                      fallbackEmoji="🌱"
                      aspectRatio="1:1"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-[#6E6E73]">{item.id}</span>
                    <h3 className="text-sm font-bold text-[#1D1D1F]">{item.namaBahan}</h3>
                    <p className="text-[11px] text-[#6E6E73] truncate">{item.supplierAsal.split('(')[0]}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-base font-extrabold text-[#1D1D1F]">
                    {item.beratAwal} <span className="text-xs font-normal text-[#6E6E73]">kg</span>
                  </p>
                  <span className="text-[10px] text-[#6E6E73]">{item.tanggalMasuk}</span>
                </div>
              </div>

              {/* Conditions chips */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {item.kondisi.map((c, i) => (
                  <span
                    key={i}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-[#F5F5F7] text-[#6E6E73] border border-[#E8E8ED]"
                  >
                    {c}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#E8E8ED]/60 text-xs">
                <WorkerStatusBadge status={item.status} size="sm" />

                {item.status === 'Menunggu Diseleksi' ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/internal/pekerja/seleksi?trmId=${item.id}`);
                    }}
                    className="px-3 py-1 rounded-full bg-[#2E7D4F] text-white text-xs font-semibold cursor-pointer"
                  >
                    Seleksi
                  </button>
                ) : (
                  <span className="text-[11px] text-[#6E6E73] flex items-center gap-0.5">
                    Detail <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* =========================================================================
          DRAWER / PANEL FORM: CATAT BAHAN MASUK
          ========================================================================= */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setDrawerOpen(false)}
          />

          {/* Side Drawer Panel */}
          <div className="relative w-full max-w-xl bg-[#FBFBFD] h-full shadow-2xl z-10 flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-200">
            {/* Header Drawer */}
            <div className="px-6 py-4 bg-white border-b border-[#E8E8ED] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#EBF4EE] text-[#2E7D4F] flex items-center justify-center">
                  <PackageCheck className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#1D1D1F]">Catat Bahan Masuk</h2>
                  <p className="text-[11px] text-[#6E6E73]">Input logistik bahan mentah dari mitra tani</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="p-1.5 rounded-full hover:bg-[#F5F5F7] text-[#6E6E73] hover:text-[#1D1D1F] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Fields Body (Scrollable) */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
              {formError && (
                <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* KARTU 1: Supplier Asal */}
              <div className="bg-white rounded-2xl border border-[#E8E8ED] p-4 sm:p-5 space-y-3">
                <label className="text-xs font-bold text-[#1D1D1F] flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-[#2E7D4F]" />
                  <span>a. Supplier Asal (Mitra Tani)</span>
                </label>
                <select
                  value={supplierAsal}
                  onChange={(e) => setSupplierAsal(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E8ED] bg-[#F5F5F7] text-xs sm:text-sm text-[#1D1D1F] focus:bg-white focus:border-[#2E7D4F] outline-none transition-all cursor-pointer"
                >
                  {DUMMY_SUPPLIERS.map((sup, idx) => (
                    <option key={idx} value={sup}>
                      {sup}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-[#6E6E73]">
                  Pilih mitra petani terdaftar atau kelompok tani pengirim.
                </p>
              </div>

              {/* KARTU 2: Jenis & Nama Bahan */}
              <div className="bg-white rounded-2xl border border-[#E8E8ED] p-4 sm:p-5 space-y-3.5">
                <label className="text-xs font-bold text-[#1D1D1F] flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-[#2E7D4F]" />
                  <span>b. Jenis & Nama Bahan Baku</span>
                </label>

                {/* Jenis Kategori Chips */}
                <div className="flex items-center gap-1.5">
                  {(['Buah', 'Sayur', 'Umbi', 'Rempah'] as IngredientCategory[]).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setJenisBahan(cat)}
                      className={`flex-1 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                        jenisBahan === cat
                          ? 'bg-[#EBF4EE] text-[#2E7D4F] border-[#2E7D4F]'
                          : 'bg-[#F5F5F7] text-[#6E6E73] border-transparent hover:text-[#1D1D1F]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Input Nama Bahan */}
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-[#6E6E73]">Nama Bahan Baku</span>
                  <input
                    type="text"
                    value={namaBahan}
                    onChange={(e) => setNamaBahan(e.target.value)}
                    placeholder="Contoh: Pisang Berbintik, Tomat Bengkok..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E8ED] bg-[#F5F5F7] text-xs sm:text-sm text-[#1D1D1F] focus:bg-white focus:border-[#2E7D4F] outline-none transition-all"
                    required
                  />
                </div>
              </div>

              {/* KARTU 3: Berat Awal & Tanggal */}
              <div className="bg-white rounded-2xl border border-[#E8E8ED] p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#1D1D1F] flex items-center gap-1.5">
                    <Scale className="w-3.5 h-3.5 text-[#2E7D4F]" />
                    <span>c. Berat Awal (kg)</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="any"
                      min="0.1"
                      value={beratAwal}
                      onChange={(e) => setBeratAwal(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="0"
                      className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-[#E8E8ED] bg-[#F5F5F7] text-sm font-bold text-[#1D1D1F] focus:bg-white focus:border-[#2E7D4F] outline-none transition-all"
                      required
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#6E6E73]">
                      kg
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#1D1D1F] flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#2E7D4F]" />
                    <span>d. Tanggal Masuk</span>
                  </label>
                  <input
                    type="text"
                    value={tanggalMasuk}
                    onChange={(e) => setTanggalMasuk(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E8ED] bg-[#F5F5F7] text-xs sm:text-sm text-[#1D1D1F] focus:bg-white focus:border-[#2E7D4F] outline-none transition-all"
                  />
                </div>
              </div>

              {/* KARTU 4: Kondisi Saat Datang (Multi-chip & Catatan) */}
              <div className="bg-white rounded-2xl border border-[#E8E8ED] p-4 sm:p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#1D1D1F] flex items-center gap-2">
                    <AlertCircle className="w-3.5 h-3.5 text-[#2E7D4F]" />
                    <span>e. Kondisi Saat Datang (Pilihan Ganda)</span>
                  </label>
                  <span className="text-[10px] text-[#6E6E73]">Pilih yang sesuai</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {CONDITION_OPTIONS.map((cond) => {
                    const isSelected = selectedConditions.includes(cond);
                    return (
                      <button
                        key={cond}
                        type="button"
                        onClick={() => toggleCondition(cond)}
                        className={`text-xs px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#EBF4EE] text-[#2E7D4F] border-[#2E7D4F] font-semibold shadow-2xs'
                            : 'bg-[#F5F5F7] text-[#6E6E73] border-[#E8E8ED] hover:border-[#2E7D4F]/40'
                        }`}
                      >
                        {isSelected && '✓ '}
                        {cond}
                      </button>
                    );
                  })}
                </div>

                <div className="pt-1 space-y-1">
                  <span className="text-[11px] font-semibold text-[#6E6E73]">Catatan Khusus Kedatangan</span>
                  <textarea
                    rows={2}
                    value={catatan}
                    onChange={(e) => setCatatan(e.target.value)}
                    placeholder="Contoh: Panen pagi, bintik cokelat merata, aroma manis karamel..."
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E8ED] bg-[#F5F5F7] text-xs text-[#1D1D1F] focus:bg-white focus:border-[#2E7D4F] outline-none transition-all resize-none"
                  />
                </div>
              </div>

              {/* KARTU 5: Foto Bahan Mentah (Opsional + Preview Lokal) */}
              <div className="bg-white rounded-2xl border border-[#E8E8ED] p-4 sm:p-5 space-y-3">
                <label className="text-xs font-bold text-[#1D1D1F] flex items-center gap-2">
                  <Camera className="w-3.5 h-3.5 text-[#2E7D4F]" />
                  <span>f. Foto Bahan (Opsional)</span>
                </label>

                {/* Preview Thumbnail */}
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-[#F5F5F7] border border-[#E8E8ED] shrink-0">
                    <SmartImage
                      src={fotoUrl}
                      alt="Preview Foto Bahan"
                      fallbackEmoji="📷"
                      aspectRatio="1:1"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-2 flex-1">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handlePhotoUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F5F5F7] hover:bg-[#E8E8ED] text-xs font-medium text-[#1D1D1F] border border-[#E8E8ED] transition-colors cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5 text-[#2E7D4F]" />
                      <span>Unggah Foto Lokal</span>
                    </button>
                    <p className="text-[10px] text-[#6E6E73]">
                      Pratinjau otomatis melalui URL object lokal.
                    </p>
                  </div>
                </div>

                {/* Preset Cepat */}
                <div className="pt-1">
                  <span className="text-[10px] font-semibold text-[#6E6E73] block mb-1.5">
                    Atau pilih foto contoh cepat:
                  </span>
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                    {PRESET_PHOTOS.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setFotoUrl(p.url)}
                        className={`text-[10px] px-2.5 py-1 rounded-lg border transition-colors shrink-0 ${
                          fotoUrl === p.url
                            ? 'bg-[#EBF4EE] text-[#2E7D4F] border-[#2E7D4F] font-semibold'
                            : 'bg-[#F5F5F7] text-[#6E6E73] border-[#E8E8ED]'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Submit Button Drawer */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-full bg-[#2E7D4F] hover:bg-[#256640] text-white text-sm font-semibold transition-all shadow-xs cursor-pointer active:scale-95 flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Simpan Penerimaan Bahan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL DETAIL PENERIMAAN BAHAN
          ========================================================================= */}
      {selectedReceiving && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setSelectedReceiving(null)}
          />

          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl z-10 overflow-hidden border border-[#E8E8ED] animate-in zoom-in-95 duration-200">
            {/* Modal Header with Image */}
            <div className="relative h-44 bg-[#F5F5F7] overflow-hidden">
              <SmartImage
                src={selectedReceiving.foto}
                alt={selectedReceiving.namaBahan}
                fallbackEmoji="🌱"
                aspectRatio="16:9"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              <button
                type="button"
                onClick={() => setSelectedReceiving(null)}
                className="absolute top-3.5 right-3.5 p-1.5 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="absolute bottom-3 left-4 right-4 text-white">
                <span className="text-[10px] font-mono uppercase bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/20">
                  {selectedReceiving.id}
                </span>
                <h2 className="text-xl font-bold mt-1 tracking-tight">
                  {selectedReceiving.namaBahan}
                </h2>
                <p className="text-xs text-white/80">{selectedReceiving.supplierAsal}</p>
              </div>
            </div>

            {/* Modal Body Info */}
            <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
              {/* Status & Berat Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-[#FBFBFD] rounded-2xl border border-[#E8E8ED]">
                  <span className="text-[10px] font-semibold text-[#6E6E73] block">Berat Awal Datang</span>
                  <p className="text-xl font-extrabold text-[#1D1D1F]">
                    {selectedReceiving.beratAwal} <span className="text-xs font-normal text-[#6E6E73]">kg</span>
                  </p>
                </div>

                <div className="p-3 bg-[#FBFBFD] rounded-2xl border border-[#E8E8ED]">
                  <span className="text-[10px] font-semibold text-[#6E6E73] block mb-1">Status Inspeksi</span>
                  <WorkerStatusBadge status={selectedReceiving.status} size="sm" />
                </div>
              </div>

              {/* Kondisi Visual */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-[#1D1D1F] block">Karakteristik Ketidaksempurnaan:</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedReceiving.kondisi.map((c, i) => (
                    <span
                      key={i}
                      className="text-xs px-2.5 py-1 rounded-xl bg-[#F5F5F7] text-[#1D1D1F] border border-[#E8E8ED]"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              {/* Catatan Logistik */}
              <div className="space-y-1">
                <span className="text-xs font-bold text-[#1D1D1F] block">Catatan Penerima:</span>
                <p className="text-xs text-[#6E6E73] leading-relaxed bg-[#FBFBFD] p-3 rounded-xl border border-[#E8E8ED]">
                  {selectedReceiving.catatan}
                </p>
              </div>

              {/* Hasil Seleksi Jika Sudah Diseleksi */}
              {selectedReceiving.hasilSeleksi ? (
                <div className="p-3.5 rounded-2xl bg-[#EBF4EE] border border-[#2E7D4F]/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#2E7D4F]">Hasil Seleksi Kendali Mutu</span>
                    <span className="text-[10px] text-[#6E6E73]">
                      {selectedReceiving.hasilSeleksi.tanggalSeleksi}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="bg-white p-2 rounded-xl border border-[#2E7D4F]/20">
                      <span className="text-[10px] text-[#6E6E73] block">Layak Olah</span>
                      <strong className="text-[#2E7D4F] text-sm">
                        {selectedReceiving.hasilSeleksi.layak} kg
                      </strong>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-[#E8E8ED]">
                      <span className="text-[10px] text-[#6E6E73] block">Kompos</span>
                      <strong className="text-amber-700 text-sm">
                        {selectedReceiving.hasilSeleksi.dijadikanKompos} kg
                      </strong>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-[#E8E8ED]">
                      <span className="text-[10px] text-[#6E6E73] block">Dibuang</span>
                      <strong className="text-red-600 text-sm">
                        {selectedReceiving.hasilSeleksi.dibuang} kg
                      </strong>
                    </div>
                  </div>
                  <p className="text-[11px] text-[#1D1D1F]/80 italic pt-1">
                    "{selectedReceiving.hasilSeleksi.catatan}"
                  </p>
                </div>
              ) : (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      const id = selectedReceiving.id;
                      setSelectedReceiving(null);
                      navigate(`/internal/pekerja/seleksi?trmId=${id}`);
                    }}
                    className="w-full py-2.5 rounded-full bg-[#2E7D4F] hover:bg-[#256640] text-white text-xs font-semibold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>Lakukan Seleksi Mutu Sekarang</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
