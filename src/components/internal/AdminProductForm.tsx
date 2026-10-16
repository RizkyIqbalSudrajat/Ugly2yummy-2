import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAdminData } from '../../context/AdminDataContext';
import { useWorkerData } from '../../context/WorkerDataContext';
import { AdminProduct, ProductIngredientFormula } from '../../types/admin';
import { INGREDIENTS } from '../../data/dummy';
import { SmartImage } from '../ui/SmartImage';
import {
  ShoppingBag,
  ArrowLeft,
  Upload,
  Plus,
  Trash2,
  Check,
  CheckCircle2,
  AlertCircle,
  Star,
  Sparkles,
  Link as LinkIcon,
  HelpCircle,
  Eye,
  Package,
} from 'lucide-react';

interface AdminProductFormProps {
  initialProduct?: AdminProduct;
  isEdit?: boolean;
}

const CATEGORY_OPTIONS = [
  'Saus & Sambal',
  'Selai & Olesan',
  'Camilan',
  'Minuman',
  'Kue & Roti',
  'Olahan Fermentasi',
];

const UNIT_OPTIONS = ['botol', 'jar', 'bungkus', 'pcs', 'pouch', 'cup'];

export const AdminProductForm: React.FC<AdminProductFormProps> = ({
  initialProduct,
  isEdit = false,
}) => {
  const { addProduct, updateProduct, deleteProduct, addNotification } = useAdminData();
  const { inventory: productStocks } = useWorkerData();
  const navigate = useNavigate();

  // 1. Info Dasar
  const [nama, setNama] = useState(initialProduct?.nama || '');
  const [kategori, setKategori] = useState(initialProduct?.kategori || 'Saus & Sambal');
  const [deskripsi, setDeskripsi] = useState(
    initialProduct?.deskripsi ||
      'Produk olahan artisan alami dibuat dari bahan baku imperfect panen segar petani mitra.'
  );
  const [status, setStatus] = useState<'Aktif' | 'Draft'>(initialProduct?.status || 'Aktif');

  // 2. Foto Produk (Maksimal 5)
  const defaultPhotos = initialProduct?.galeriFoto && initialProduct.galeriFoto.length > 0
    ? initialProduct.galeriFoto
    : initialProduct?.gambar
    ? [initialProduct.gambar]
    : [
        'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?auto=format&fit=crop&w=800&q=80',
      ];

  const [photos, setPhotos] = useState<string[]>(defaultPhotos);
  const [primaryPhotoIndex, setPrimaryPhotoIndex] = useState(0);
  const [urlInput, setUrlInput] = useState('');

  // 3. Harga
  const [hargaJual, setHargaJual] = useState<number>(initialProduct?.harga || 35000);
  const [hargaPembanding, setHargaPembanding] = useState<number>(
    initialProduct?.hargaPembanding || 45000
  );

  // Otomatis hitung % Hemat
  const discountPct = useMemo(() => {
    if (hargaPembanding && hargaPembanding > hargaJual) {
      return Math.round(((hargaPembanding - hargaJual) / hargaPembanding) * 100);
    }
    return 0;
  }, [hargaJual, hargaPembanding]);

  // 4. Komposisi (Bahan + kg per unit)
  const [komposisi, setKomposisi] = useState<ProductIngredientFormula[]>(
    initialProduct?.komposisiDetail && initialProduct.komposisiDetail.length > 0
      ? initialProduct.komposisiDetail
      : [{ bahan: 'Tomat Bengkok', kgPerUnit: 0.25 }]
  );

  // 5. Stok
  const [stok, setStok] = useState<number>(initialProduct?.stok ?? 40);
  const [satuanStok, setSatuanStok] = useState<string>(
    initialProduct?.satuanStok || initialProduct?.ukuran?.split(' ')[1] || 'botol'
  );

  // Cari stok produk jadi dari Portal Pekerja
  const matchedWorkerStock = useMemo(() => {
    return productStocks.find(
      (ps) =>
        (initialProduct?.id && ps.productId === initialProduct.id) ||
        (nama.trim() && ps.namaProduk.toLowerCase() === nama.trim().toLowerCase())
    );
  }, [productStocks, initialProduct, nama]);

  // 6. Cerita Asal Bahan
  const [selectedBahanId, setSelectedBahanId] = useState<string>(
    initialProduct?.ceritaBahan?.bahanId || 'tomat-bengkok'
  );
  const [petaniAsal, setPetaniAsal] = useState<string>(
    initialProduct?.ceritaBahan?.petani || 'Pak Asep Sunarya (Lembang, Jawa Barat)'
  );
  const [ceritaSingkat, setCeritaSingkat] = useState<string>(
    initialProduct?.ceritaBahan?.cerita ||
      'Tomat matang pohon dengan kulit sedikit bergaris alami diselamatkan dan dipanggang lambat untuk mengeluarkan aroma umami murni.'
  );

  // Modal konfirmasi hapus
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Upload handler lokal
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    const newUrls = files.map((file) => URL.createObjectURL(file));

    setPhotos((prev) => {
      const combined = [...prev, ...newUrls].slice(0, 5);
      return combined;
    });

    e.target.value = '';
    showToast('Foto lokal berhasil diunggah.');
  };

  // Tempel link URL
  const handleAddUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    if (photos.length >= 5) {
      showToast('Maksimal 5 foto per produk.');
      return;
    }
    setPhotos((prev) => [...prev, urlInput.trim()]);
    setUrlInput('');
    showToast('Link gambar ditambahkan.');
  };

  const handleRemovePhoto = (index: number) => {
    if (photos.length <= 1) {
      showToast('Produk harus memiliki minimal 1 foto.');
      return;
    }
    setPhotos((prev) => prev.filter((_, i) => i !== index));
    if (primaryPhotoIndex >= index && primaryPhotoIndex > 0) {
      setPrimaryPhotoIndex((prev) => prev - 1);
    }
  };

  // Ganti pilihan bahan cerita
  const handleBahanStoryChange = (bId: string) => {
    setSelectedBahanId(bId);
    const found = INGREDIENTS.find((ing) => ing.id === bId);
    if (found) {
      setPetaniAsal(`${found.petani} (${found.asal})`);
      setCeritaSingkat(found.ceritaSingkat);
    }
  };

  // Tambah baris komposisi
  const handleAddKomposisiRow = () => {
    setKomposisi((prev) => [...prev, { bahan: 'Bahan Baru', kgPerUnit: 0.1 }]);
  };

  const handleRemoveKomposisiRow = (idx: number) => {
    if (komposisi.length <= 1) return;
    setKomposisi((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleUpdateKomposisiRow = (
    idx: number,
    field: 'bahan' | 'kgPerUnit',
    val: string | number
  ) => {
    setKomposisi((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, [field]: val } : item))
    );
  };

  // Simpan
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim()) {
      showToast('Nama produk wajib diisi.');
      return;
    }

    const primaryImage = photos[primaryPhotoIndex] || photos[0] || '';

    const payload = {
      nama: nama.trim(),
      kategori,
      harga: Number(hargaJual) || 0,
      hargaPembanding: Number(hargaPembanding) || undefined,
      ukuran: `${stok} ${satuanStok}`,
      bahanUtama: komposisi[0]?.bahan || 'Bahan Pilihan',
      komposisiDetail: komposisi,
      stok: Number(stok) || 0,
      satuanStok,
      status,
      gambar: primaryImage,
      galeriFoto: photos,
      deskripsi,
      ceritaBahan: {
        bahanId: selectedBahanId,
        bahanNama: INGREDIENTS.find((i) => i.id === selectedBahanId)?.nama || 'Bahan Alami',
        petani: petaniAsal,
        cerita: ceritaSingkat,
      },
      rating: initialProduct?.rating || 4.9,
      jumlahUlasan: initialProduct?.jumlahUlasan || 1,
    };

    if (isEdit && initialProduct) {
      updateProduct(initialProduct.id, payload);
      addNotification({
        tipe: 'Sistem',
        judul: `Produk Diperbarui: ${payload.nama}`,
        isi: `Perubahan data harga, stok (${payload.stok}), dan status (${payload.status}) telah disimpan.`,
        linkTujuan: '/internal/admin/produk',
      });
      showToast(`Produk "${payload.nama}" berhasil diperbarui!`);
    } else {
      addProduct(payload);
      addNotification({
        tipe: 'Sistem',
        judul: `Produk Baru Dibuat: ${payload.nama}`,
        isi: `Produk olahan baru telah ditambahkan ke katalog etalase toko.`,
        linkTujuan: '/internal/admin/produk',
      });
      showToast(`Produk baru "${payload.nama}" berhasil ditambahkan!`);
    }

    setTimeout(() => {
      navigate('/internal/admin/produk');
    }, 800);
  };

  const handleDelete = () => {
    if (!initialProduct) return;
    deleteProduct(initialProduct.id);
    addNotification({
      tipe: 'Sistem',
      judul: `Produk Dihapus: ${initialProduct.nama}`,
      isi: `Produk telah dihapus dari sistem portal admin.`,
      linkTujuan: '/internal/admin/produk',
    });
    showToast(`Produk "${initialProduct.nama}" berhasil dihapus.`);
    setShowDeleteModal(false);
    setTimeout(() => {
      navigate('/internal/admin/produk');
    }, 600);
  };

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-200">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#1D1D1F] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in slide-in-from-top duration-300">
          <CheckCircle2 className="w-5 h-5 text-[#2E7D4F]" />
          <p className="text-xs sm:text-sm font-semibold">{toastMessage}</p>
        </div>
      )}

      {/* Top Header Navigation */}
      <div className="flex items-center justify-between gap-4">
        <Link
          to="/internal/admin/produk"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#6E6E73] hover:text-[#1D1D1F] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Katalog Produk</span>
        </Link>

        {isEdit && (
          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Hapus Produk</span>
          </button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1D1D1F]">
            {isEdit ? `Edit Produk: ${initialProduct?.nama}` : 'Tambah Produk Olahan Baru'}
          </h1>
          <p className="text-xs sm:text-sm text-[#6E6E73] mt-1">
            Lengkapi spesifikasi olahan, unggah foto berkualitas, sesuaikan formula bahan, dan atur cerita petani.
          </p>
        </div>
      </div>

      {/* Grid: Left Form Cards (8 col) & Right Live Buyer Preview (4 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ================= FORM CARDS (8 Kolom) ================= */}
        <form onSubmit={handleSave} className="lg:col-span-7 xl:col-span-8 space-y-6">
          {/* Card A: Informasi Dasar */}
          <div className="bg-white rounded-3xl border border-[#E8E8ED] p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#E8E8ED] pb-3">
              <h3 className="text-sm font-bold text-[#1D1D1F] flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#EBF4EE] text-[#2E7D4F] flex items-center justify-center text-xs">
                  A
                </span>
                Informasi Dasar Produk
              </h3>
              <span className="text-[11px] text-[#8E8E93]">Wajib diisi</span>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-[#1D1D1F] mb-1">
                  Nama Produk Olahan:
                </label>
                <input
                  type="text"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Contoh: Saus Tomat Panggang Artisan"
                  required
                  className="w-full p-3 rounded-2xl bg-[#F5F5F7] border-0 text-[#1D1D1F] text-xs sm:text-sm focus:ring-2 focus:ring-[#2E7D4F]/30"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-semibold text-[#1D1D1F] mb-1">
                    Kategori:
                  </label>
                  <select
                    value={kategori}
                    onChange={(e) => setKategori(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#F5F5F7] border-0 text-[#1D1D1F]"
                  >
                    {CATEGORY_OPTIONS.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#1D1D1F] mb-1">
                    Status Publikasi:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['Aktif', 'Draft'] as const).map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setStatus(st)}
                        className={`p-2 rounded-xl font-semibold border transition-all cursor-pointer text-center ${
                          status === st
                            ? st === 'Aktif'
                              ? 'bg-[#EBF4EE] text-[#2E7D4F] border-[#2E7D4F]/30'
                              : 'bg-black/10 text-[#1D1D1F] border-black/20'
                            : 'bg-[#F5F5F7] text-[#6E6E73] border-transparent'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#1D1D1F] mb-1">
                  Deskripsi Singkat untuk Pembeli:
                </label>
                <textarea
                  value={deskripsi}
                  onChange={(e) => setDeskripsi(e.target.value)}
                  rows={3}
                  placeholder="Jelaskan aroma, cita rasa, dan keunggulan pembuatan produk olahan..."
                  className="w-full p-3 rounded-2xl bg-[#F5F5F7] border-0 text-[#1D1D1F] leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* Card B: Foto Produk (Maks 5, Upload + Tempel URL) */}
          <div className="bg-white rounded-3xl border border-[#E8E8ED] p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#E8E8ED] pb-3">
              <h3 className="text-sm font-bold text-[#1D1D1F] flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#EBF4EE] text-[#2E7D4F] flex items-center justify-center text-xs">
                  B
                </span>
                Foto Produk ({photos.length}/5)
              </h3>
              <span className="text-[11px] text-[#8E8E93]">Pilih 1 foto utama</span>
            </div>

            {/* Grid Thumbnail Preview */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {photos.map((url, idx) => {
                const isPrimary = idx === primaryPhotoIndex;
                return (
                  <div
                    key={idx}
                    className={`relative rounded-2xl overflow-hidden border transition-all aspect-square group bg-[#F5F5F7] ${
                      isPrimary ? 'ring-2 ring-[#2E7D4F] border-transparent shadow-xs' : 'border-[#E8E8ED]'
                    }`}
                  >
                    <SmartImage
                      src={url}
                      alt={`Foto produk ${idx + 1}`}
                      aspectRatio="1:1"
                      className="w-full h-full object-cover"
                    />

                    {/* Primary Badge */}
                    {isPrimary ? (
                      <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-[#2E7D4F] text-white">
                        Utama
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setPrimaryPhotoIndex(idx)}
                        className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-full text-[9px] font-semibold bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        Pilih Utama
                      </button>
                    )}

                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(idx)}
                      className="absolute top-1.5 right-1.5 p-1 rounded-full bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      title="Hapus foto ini"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}

              {/* Upload slot button */}
              {photos.length < 5 && (
                <label className="border-2 border-dashed border-[#E8E8ED] hover:border-[#2E7D4F]/40 rounded-2xl flex flex-col items-center justify-center p-3 text-center cursor-pointer transition-colors aspect-square bg-[#FBFBFD]">
                  <Upload className="w-5 h-5 text-[#8E8E93] mb-1" />
                  <span className="text-[10px] font-semibold text-[#6E6E73]">
                    Upload Foto
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Input Tempel URL Gambar */}
            <div className="pt-2 flex items-center gap-2">
              <div className="relative flex-1">
                <LinkIcon className="w-3.5 h-3.5 text-[#8E8E93] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="Atau tempel link URL gambar (Unsplash / CDN)..."
                  className="w-full pl-8 pr-3 py-2 text-xs rounded-xl bg-[#F5F5F7] border-0 text-[#1D1D1F]"
                />
              </div>
              <button
                type="button"
                onClick={handleAddUrl}
                disabled={!urlInput.trim() || photos.length >= 5}
                className="px-3.5 py-2 rounded-xl bg-[#1D1D1F] text-white text-xs font-semibold hover:bg-[#2E7D4F] disabled:opacity-40 transition-colors cursor-pointer shrink-0"
              >
                Tambah URL
              </button>
            </div>
          </div>

          {/* Card C: Harga & Diskon Otomatis */}
          <div className="bg-white rounded-3xl border border-[#E8E8ED] p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#E8E8ED] pb-3">
              <h3 className="text-sm font-bold text-[#1D1D1F] flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#EBF4EE] text-[#2E7D4F] flex items-center justify-center text-xs">
                  C
                </span>
                Penetapan Harga & Promo
              </h3>
              {discountPct > 0 && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EBF4EE] text-[#2E7D4F] border border-[#2E7D4F]/20">
                  Label Otomatis: Hemat {discountPct}%
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-[#1D1D1F] mb-1">
                  Harga Jual (Rp):
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-semibold text-[#8E8E93]">
                    Rp
                  </span>
                  <input
                    type="number"
                    value={hargaJual}
                    onChange={(e) => setHargaJual(Number(e.target.value))}
                    min={0}
                    step={1000}
                    required
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#F5F5F7] border-0 text-sm font-bold text-[#1D1D1F]"
                  />
                </div>
                <p className="text-[11px] text-[#6E6E73] mt-1">
                  Harga final yang dibayar pembeli.
                </p>
              </div>

              <div>
                <label className="block font-semibold text-[#1D1D1F] mb-1">
                  Harga Pembanding / Coret (Rp):
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-semibold text-[#8E8E93]">
                    Rp
                  </span>
                  <input
                    type="number"
                    value={hargaPembanding}
                    onChange={(e) => setHargaPembanding(Number(e.target.value))}
                    min={0}
                    step={1000}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#F5F5F7] border-0 text-sm font-medium text-[#6E6E73]"
                  />
                </div>
                <p className="text-[11px] text-[#6E6E73] mt-1">
                  Harga pasar reguler untuk menampilkan kalkulasi hemat.
                </p>
              </div>
            </div>
          </div>

          {/* Card D: Komposisi Formula Bahan */}
          <div className="bg-white rounded-3xl border border-[#E8E8ED] p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#E8E8ED] pb-3">
              <h3 className="text-sm font-bold text-[#1D1D1F] flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#EBF4EE] text-[#2E7D4F] flex items-center justify-center text-xs">
                  D
                </span>
                Komposisi & Formula Bahan Baku
              </h3>
              <button
                type="button"
                onClick={handleAddKomposisiRow}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#2E7D4F] hover:underline cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Tambah Bahan
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              {komposisi.map((row, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-[#FBFBFD] border border-[#E8E8ED]"
                >
                  <div className="flex-1">
                    <input
                      type="text"
                      value={row.bahan}
                      onChange={(e) =>
                        handleUpdateKomposisiRow(idx, 'bahan', e.target.value)
                      }
                      placeholder="Nama bahan imperfect (contoh: Tomat Bengkok)"
                      className="w-full p-2 rounded-xl bg-white border border-[#E8E8ED] text-xs font-medium text-[#1D1D1F]"
                    />
                  </div>

                  <div className="w-28 flex items-center gap-1.5">
                    <input
                      type="number"
                      step={0.01}
                      min={0.01}
                      value={row.kgPerUnit}
                      onChange={(e) =>
                        handleUpdateKomposisiRow(
                          idx,
                          'kgPerUnit',
                          Number(e.target.value)
                        )
                      }
                      className="w-full p-2 rounded-xl bg-white border border-[#E8E8ED] text-xs font-bold text-center text-[#1D1D1F]"
                    />
                    <span className="text-[#6E6E73] font-medium shrink-0">kg/unit</span>
                  </div>

                  {komposisi.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveKomposisiRow(idx)}
                      className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                      title="Hapus baris"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Card E: Stok & Satuan + Info Stok Pekerja */}
          <div className="bg-white rounded-3xl border border-[#E8E8ED] p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#E8E8ED] pb-3">
              <h3 className="text-sm font-bold text-[#1D1D1F] flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#EBF4EE] text-[#2E7D4F] flex items-center justify-center text-xs">
                  E
                </span>
                Inventori & Stok Etalase
              </h3>
              <span className="text-[11px] text-[#8E8E93]">Sinkronisasi Toko</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-[#1D1D1F] mb-1">
                  Jumlah Stok Toko:
                </label>
                <input
                  type="number"
                  value={stok}
                  onChange={(e) => setStok(Number(e.target.value))}
                  min={0}
                  required
                  className="w-full p-2.5 rounded-xl bg-[#F5F5F7] border-0 text-sm font-bold text-[#1D1D1F]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1D1D1F] mb-1">
                  Satuan Kemasan:
                </label>
                <select
                  value={satuanStok}
                  onChange={(e) => setSatuanStok(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#F5F5F7] border-0 text-[#1D1D1F]"
                >
                  {UNIT_OPTIONS.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Info Stok Riil dari Portal Pekerja */}
            <div className="p-3.5 rounded-2xl bg-[#F5FBF7] border border-[#2E7D4F]/20 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#EBF4EE] text-[#2E7D4F] flex items-center justify-center font-bold">
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-[#1D1D1F]">
                    Stok Produk Jadi (Portal Pekerja / Dapur)
                  </p>
                  <p className="text-[11px] text-[#6E6E73]">
                    Hasil olahan batch dapur yang siap dikemas.
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-sm font-bold text-[#2E7D4F]">
                  {matchedWorkerStock ? `${matchedWorkerStock.jumlah} ${matchedWorkerStock.satuan}` : '30 unit (estimasi)'}
                </span>
              </div>
            </div>
          </div>

          {/* Card F: Cerita Asal Bahan & Petani */}
          <div className="bg-white rounded-3xl border border-[#E8E8ED] p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#E8E8ED] pb-3">
              <h3 className="text-sm font-bold text-[#1D1D1F] flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#EBF4EE] text-[#2E7D4F] flex items-center justify-center text-xs">
                  F
                </span>
                Cerita Asal Bahan & Petani Mitra
              </h3>
              <span className="text-[11px] text-[#8E8E93]">Dampak Sosial</span>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-[#1D1D1F] mb-1">
                  Pilih Bahan Baku dari Daftar Petani (INGREDIENTS):
                </label>
                <select
                  value={selectedBahanId}
                  onChange={(e) => handleBahanStoryChange(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#F5F5F7] border-0 text-[#1D1D1F]"
                >
                  {INGREDIENTS.map((ing) => (
                    <option key={ing.id} value={ing.id}>
                      {ing.emoji} {ing.nama} · {ing.petani} ({ing.asal})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#1D1D1F] mb-1">
                  Petani Mitra & Daerah Asal:
                </label>
                <input
                  type="text"
                  value={petaniAsal}
                  onChange={(e) => setPetaniAsal(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#F5F5F7] border-0 text-[#1D1D1F]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1D1D1F] mb-1">
                  Teks Cerita Singkat Dampak:
                </label>
                <textarea
                  value={ceritaSingkat}
                  onChange={(e) => setCeritaSingkat(e.target.value)}
                  rows={2}
                  className="w-full p-2.5 rounded-xl bg-[#F5F5F7] border-0 text-[#1D1D1F] leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* Tombol Simpan */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Link
              to="/internal/admin/produk"
              className="px-5 py-2.5 rounded-full bg-[#F5F5F7] text-[#6E6E73] hover:text-[#1D1D1F] text-xs font-semibold transition-colors cursor-pointer"
            >
              Batal
            </Link>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-[#2E7D4F] text-white text-xs font-semibold hover:bg-[#256640] transition-colors shadow-xs cursor-pointer inline-flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>{isEdit ? 'Simpan Perubahan Produk' : 'Terbitkan Produk Baru'}</span>
            </button>
          </div>
        </form>

        {/* ================= RIGHT PREVIEW CARD (4 Kolom Sticky) ================= */}
        <div className="lg:col-span-5 xl:col-span-4 sticky top-6 space-y-4">
          <div className="bg-white rounded-3xl border border-[#E8E8ED] p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#E8E8ED] pb-3">
              <span className="text-xs font-bold text-[#1D1D1F] flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-[#2E7D4F]" />
                Preview Tampilan Pembeli
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EBF4EE] text-[#2E7D4F]">
                Live Preview
              </span>
            </div>

            {/* Simulated Buyer Product Card */}
            <div className="rounded-2xl border border-[#E8E8ED] overflow-hidden bg-white shadow-xs group">
              <div className="relative aspect-[4/3] bg-[#F5F5F7] overflow-hidden">
                <SmartImage
                  src={photos[primaryPhotoIndex] || photos[0]}
                  alt={nama || 'Nama Produk'}
                  aspectRatio="4:3"
                  className="w-full h-full object-cover"
                />

                {discountPct > 0 && (
                  <div className="absolute top-2.5 left-2.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EBF4EE] text-[#2E7D4F] border border-[#2E7D4F]/30 shadow-xs">
                      Hemat {discountPct}%
                    </span>
                  </div>
                )}

                <div className="absolute top-2.5 right-2.5">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/90 text-[#1D1D1F] backdrop-blur-xs">
                    {kategori}
                  </span>
                </div>
              </div>

              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-[#6E6E73]">
                  <span className="flex items-center gap-1 text-amber-600 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    4.9 (148 ulasan)
                  </span>
                  <span className="text-[10px] font-semibold text-[#2E7D4F] bg-[#EBF4EE] px-2 py-0.5 rounded-full">
                    {stok > 0 ? `Sisa ${stok} ${satuanStok}` : 'Habis'}
                  </span>
                </div>

                <h4 className="text-base font-bold text-[#1D1D1F] line-clamp-1">
                  {nama || 'Saus Tomat Panggang'}
                </h4>

                <p className="text-xs text-[#6E6E73] line-clamp-2 leading-relaxed">
                  {deskripsi}
                </p>

                {/* Harga */}
                <div className="pt-2 flex items-baseline gap-2">
                  <span className="text-lg font-bold text-[#1D1D1F]">
                    {formatRupiah(hargaJual)}
                  </span>
                  {hargaPembanding && hargaPembanding > hargaJual && (
                    <span className="text-xs text-[#8E8E93] line-through">
                      {formatRupiah(hargaPembanding)}
                    </span>
                  )}
                </div>

                {/* Cerita Petani Snippet */}
                {petaniAsal && (
                  <div className="mt-2 p-2.5 rounded-xl bg-[#FBFBFD] border border-[#E8E8ED] text-[11px] space-y-1">
                    <p className="font-bold text-[#1D1D1F] flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#2E7D4F]" />
                      Bahan dari {petaniAsal}
                    </p>
                    <p className="text-[#6E6E73] line-clamp-2 italic">
                      "{ceritaSingkat}"
                    </p>
                  </div>
                )}

                <button
                  type="button"
                  disabled
                  className="w-full mt-3 py-2 rounded-xl bg-[#2E7D4F] text-white text-xs font-semibold text-center opacity-90 cursor-default"
                >
                  + Tambah ke Keranjang
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL KONFIRMASI HAPUS */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-[#E8E8ED] animate-in zoom-in-95 duration-200">
            <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-5 h-5" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-[#1D1D1F]">Hapus Produk Ini?</h3>
              <p className="text-xs text-[#6E6E73]">
                Apakah Anda yakin ingin menghapus <strong>"{nama}"</strong>? Produk ini akan dihilangkan dari etalase.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2 rounded-full text-xs font-semibold bg-[#F5F5F7] text-[#6E6E73] hover:text-[#1D1D1F] cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="flex-1 py-2 rounded-full text-xs font-semibold bg-red-600 text-white hover:bg-red-700 shadow-xs cursor-pointer"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
