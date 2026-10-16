import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkerData } from '../../../context/WorkerDataContext';
import { ConversionRecipe } from '../../../types/worker';
import {
  Calculator,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Package,
  Layers,
  ArrowRight,
  Sparkles,
  Scale,
  ListTodo,
  X,
  Check,
} from 'lucide-react';

export const AdminProductionCalculationPage: React.FC = () => {
  const { recipes, addRecipe, updateRecipe, deleteRecipe, materialStocks, addTask } = useWorkerData();
  const navigate = useNavigate();

  // Section 2: Kebutuhan Bahan (Target Calculator)
  const [selectedRecipeId, setSelectedRecipeId] = useState<string>(recipes[0]?.id || '');
  const [targetUnits, setTargetUnits] = useState<number>(100);

  // Modal Recipe (Add / Edit)
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<ConversionRecipe | null>(null);
  const [recipeBahan, setRecipeBahan] = useState('Tomat Bengkok');
  const [recipeProduk, setRecipeProduk] = useState('Saus Tomat Panggang');
  const [recipeKg, setRecipeKg] = useState<number>(2);
  const [recipeHasil, setRecipeHasil] = useState<number>(8);
  const [recipeSatuan, setRecipeSatuan] = useState('botol');
  const [recipeNote, setRecipeNote] = useState('');

  // Delete Recipe Confirmation Modal
  const [deletingRecipeId, setDeletingRecipeId] = useState<string | null>(null);

  // Quick Task Drawer / Creation confirmation
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Target Recipe Object
  const currentRecipe = useMemo(() => {
    return recipes.find((r) => r.id === selectedRecipeId) || recipes[0];
  }, [recipes, selectedRecipeId]);

  // Target Calculation Logic
  const calculationResult = useMemo(() => {
    if (!currentRecipe || targetUnits <= 0) return null;

    // e.g. 1 kg bahan -> 10 pcs kue => 0.1 kg per pcs
    const kgPerUnit = currentRecipe.rasioBahanKg / currentRecipe.rasioHasilUnit;
    const requiredKg = Math.round(targetUnits * kgPerUnit * 10) / 10;

    // Cari stok bahan layak saat ini
    const stockSummary = materialStocks.find(
      (m) => m.namaBahan.toLowerCase().includes(currentRecipe.namaBahan.toLowerCase()) ||
        currentRecipe.namaBahan.toLowerCase().includes(m.namaBahan.toLowerCase())
    );

    const availableKg = stockSummary?.sisaLayakKg || 0;
    const deficitKg = requiredKg > availableKg ? Math.round((requiredKg - availableKg) * 10) / 10 : 0;
    const isSufficient = availableKg >= requiredKg;

    return {
      requiredKg,
      availableKg,
      deficitKg,
      isSufficient,
      namaBahan: currentRecipe.namaBahan,
      namaProduk: currentRecipe.namaProduk,
      satuan: currentRecipe.satuanHasil,
    };
  }, [currentRecipe, targetUnits, materialStocks]);

  // Section 3: Jumlah Maksimal Hasil Produk dari Stok Saat Ini
  const maxProductCapacities = useMemo(() => {
    return recipes.map((recipe) => {
      const stockSummary = materialStocks.find(
        (m) =>
          m.namaBahan.toLowerCase().includes(recipe.namaBahan.toLowerCase()) ||
          recipe.namaBahan.toLowerCase().includes(m.namaBahan.toLowerCase())
      );

      const availableKg = stockSummary?.sisaLayakKg || 0;
      const batchesPossible = Math.floor(availableKg / recipe.rasioBahanKg);
      const maxUnits = batchesPossible * recipe.rasioHasilUnit;
      const leftoverKg = Math.round((availableKg - batchesPossible * recipe.rasioBahanKg) * 10) / 10;

      return {
        recipe,
        availableKg,
        batchesPossible,
        maxUnits,
        leftoverKg,
      };
    });
  }, [recipes, materialStocks]);

  // Open Modal Add Recipe
  const handleOpenAddRecipe = () => {
    setEditingRecipe(null);
    setRecipeBahan('Pisang Berbintik');
    setRecipeProduk('Kue Pisang Artisan');
    setRecipeKg(1);
    setRecipeHasil(10);
    setRecipeSatuan('pcs');
    setRecipeNote('Rasio standar dapur Ugly2Yummy');
    setShowRecipeModal(true);
  };

  // Open Modal Edit Recipe
  const handleOpenEditRecipe = (recipe: ConversionRecipe) => {
    setEditingRecipe(recipe);
    setRecipeBahan(recipe.namaBahan);
    setRecipeProduk(recipe.namaProduk);
    setRecipeKg(recipe.rasioBahanKg);
    setRecipeHasil(recipe.rasioHasilUnit);
    setRecipeSatuan(recipe.satuanHasil);
    setRecipeNote(recipe.catatan || '');
    setShowRecipeModal(true);
  };

  // Handle Save Recipe
  const handleSaveRecipeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipeBahan || !recipeProduk || recipeKg <= 0 || recipeHasil <= 0) return;

    if (editingRecipe) {
      updateRecipe(editingRecipe.id, {
        namaBahan: recipeBahan,
        namaProduk: recipeProduk,
        rasioBahanKg: recipeKg,
        rasioHasilUnit: recipeHasil,
        satuanHasil: recipeSatuan,
        catatan: recipeNote,
      });
      showToast(`Resep "${recipeProduk}" berhasil diperbarui!`);
    } else {
      addRecipe({
        namaBahan: recipeBahan,
        namaProduk: recipeProduk,
        rasioBahanKg: recipeKg,
        rasioHasilUnit: recipeHasil,
        satuanHasil: recipeSatuan,
        catatan: recipeNote,
      });
      showToast(`Resep baru "${recipeProduk}" berhasil ditambahkan.`);
    }

    setShowRecipeModal(false);
  };

  // Confirm Delete Recipe
  const handleConfirmDeleteRecipe = () => {
    if (deletingRecipeId) {
      deleteRecipe(deletingRecipeId);
      setDeletingRecipeId(null);
      showToast('Resep telah dihapus.');
    }
  };

  // Buat Tugas Produksi Langsung
  const handleCreateProductionTask = () => {
    if (!calculationResult) return;

    addTask({
      judul: `Produksi ${targetUnits} ${calculationResult.satuan} ${calculationResult.namaProduk}`,
      deskripsi: `Siapkan ${calculationResult.requiredKg} kg ${calculationResult.namaBahan} layak olah. Jalankan proses produksi batch sesuai standar sanitasi dapur.`,
      prioritas: 'Tinggi',
      tenggat: '14 Okt 2026, 17:00 WIB',
      dari: 'Raka Pratama (Admin)',
      status: 'Belum Dikerjakan',
      pekerjaNama: 'Siti Rahma',
    });

    showToast(
      `Tugas produksi ${calculationResult.namaProduk} berhasil dibuat dan didelegasikan ke Siti Rahma!`
    );
  };

  return (
    <div className="space-y-8 pb-16 animate-in fade-in duration-200">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#1D1D1F] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in slide-in-from-top duration-300">
          <CheckCircle2 className="w-5 h-5 text-[#2E7D4F]" />
          <p className="text-xs sm:text-sm font-semibold">{toastMessage}</p>
        </div>
      )}

      {/* Header Info */}
      <div className="bg-white rounded-3xl border border-[#E8E8ED] p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#EBF4EE] text-[#2E7D4F] border border-[#2E7D4F]/20 inline-flex items-center gap-1">
              <Calculator className="w-3.5 h-3.5" />
              Formula Konversi & Simulasi Produksi
            </span>
            <span className="text-xs text-[#6E6E73]">{recipes.length} formula aktif</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1D1D1F]">
            Kalkulasi & Perencanaan Dapur Olahan
          </h1>
          <p className="text-xs sm:text-sm text-[#6E6E73] mt-1 max-w-xl">
            Atur formula resep konversi bahan baku imperfect menjadi produk siap jual, hitung kebutuhan stok, dan delegasikan perintah produksi ke tim dapur.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAddRecipe}
          className="px-4 py-2.5 rounded-full bg-[#2E7D4F] text-white text-xs font-semibold hover:bg-[#256640] transition-colors shadow-xs cursor-pointer inline-flex items-center gap-2 self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Resep Baru</span>
        </button>
      </div>

      {/* ================= BAGIAN A: PENGATURAN RESEP KONVERSI ================= */}
      <div className="bg-white rounded-3xl border border-[#E8E8ED] p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#1D1D1F]">
              Pengaturan Resep Konversi Dapur
            </h3>
            <p className="text-xs text-[#6E6E73] mt-0.5">
              Formula ini otomatis dipakai di modul perhitungan pekerja dan simulasi kebutuhan bahan.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
          {recipes.map((rcp) => (
            <div
              key={rcp.id}
              className="p-4 rounded-2xl bg-[#FBFBFD] border border-[#E8E8ED] flex flex-col justify-between space-y-3 hover:border-[#2E7D4F]/40 transition-all group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <h4 className="text-xs sm:text-sm font-bold text-[#1D1D1F]">
                    {rcp.namaProduk}
                  </h4>
                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => handleOpenEditRecipe(rcp)}
                      className="p-1 rounded-lg hover:bg-white text-[#8E8E93] hover:text-[#1D1D1F]"
                      title="Edit resep"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingRecipeId(rcp.id)}
                      className="p-1 rounded-lg hover:bg-red-50 text-[#8E8E93] hover:text-red-600"
                      title="Hapus resep"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Formula Highlight */}
                <div className="p-2.5 rounded-xl bg-white border border-[#E8E8ED] flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#1D1D1F]">
                    {rcp.rasioBahanKg} kg {rcp.namaBahan}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#2E7D4F]" />
                  <span className="font-bold text-[#2E7D4F]">
                    {rcp.rasioHasilUnit} {rcp.satuanHasil}
                  </span>
                </div>

                {rcp.catatan && (
                  <p className="text-[11px] text-[#6E6E73] mt-2 italic">
                    "{rcp.catatan}"
                  </p>
                )}
              </div>

              <div className="pt-2 border-t border-[#E8E8ED] flex items-center justify-between text-[10px] text-[#8E8E93]">
                <span>ID: {rcp.id}</span>
                <span className="text-[#2E7D4F] font-semibold">Tersinkronisasi ke Pekerja</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= BAGIAN B & C (2 KOLOM): KEBUTUHAN BAHAN & JUMLAH HASIL ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
        {/* Kolom Kiri (7 Kolom): Kebutuhan Bahan (Target Calculator) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-[#E8E8ED] p-5 sm:p-6 shadow-xs space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2E7D4F]" />
              <h3 className="text-base font-bold text-[#1D1D1F]">
                Kalkulator Kebutuhan Bahan
              </h3>
            </div>
            <p className="text-xs text-[#6E6E73] mb-5">
              Tentukan target jumlah kemasan yang ingin diproduksi untuk melihat analisis kecukupan stok bahan layak saat ini.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              {/* Dropdown Produk */}
              <div>
                <label className="block text-xs font-semibold text-[#1D1D1F] mb-1">
                  Pilih Produk Target:
                </label>
                <select
                  value={selectedRecipeId}
                  onChange={(e) => setSelectedRecipeId(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#F5F5F7] border-0 text-xs font-bold text-[#1D1D1F]"
                >
                  {recipes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.namaProduk} ({r.namaBahan})
                    </option>
                  ))}
                </select>
              </div>

              {/* Input Target Unit */}
              <div>
                <label className="block text-xs font-semibold text-[#1D1D1F] mb-1">
                  Target Jumlah ({currentRecipe?.satuanHasil || 'unit'}):
                </label>
                <input
                  type="number"
                  min="1"
                  step="10"
                  value={targetUnits}
                  onChange={(e) => setTargetUnits(Math.max(1, Number(e.target.value)))}
                  className="w-full p-2.5 rounded-xl bg-[#F5F5F7] border-0 text-sm font-bold text-[#1D1D1F]"
                />
              </div>
            </div>

            {/* Hasil Analisis Kebutuhan */}
            {calculationResult && (
              <div
                className={`p-4 rounded-2xl border transition-all ${
                  calculationResult.isSufficient
                    ? 'bg-[#EBF4EE]/50 border-[#2E7D4F]/30'
                    : 'bg-red-50/50 border-red-200'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#6E6E73]">
                      Bahan Baku Diperlukan:
                    </span>
                    <h4 className="text-sm font-bold text-[#1D1D1F]">
                      {calculationResult.namaBahan}
                    </h4>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      calculationResult.isSufficient
                        ? 'bg-[#EBF4EE] text-[#2E7D4F]'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {calculationResult.isSufficient ? 'Stok Mencukupi' : 'Kekurangan Bahan'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs pt-2 border-t border-black/5">
                  <div className="p-2 bg-white rounded-xl">
                    <p className="text-[10px] text-[#6E6E73]">Kebutuhan</p>
                    <p className="font-bold text-[#1D1D1F] mt-0.5">
                      {calculationResult.requiredKg} kg
                    </p>
                  </div>

                  <div className="p-2 bg-white rounded-xl">
                    <p className="text-[10px] text-[#6E6E73]">Stok Tersedia</p>
                    <p className="font-bold text-[#2E7D4F] mt-0.5">
                      {calculationResult.availableKg} kg
                    </p>
                  </div>

                  <div className="p-2 bg-white rounded-xl">
                    <p className="text-[10px] text-[#6E6E73]">
                      {calculationResult.isSufficient ? 'Sisa Stok' : 'Kekurangan'}
                    </p>
                    <p
                      className={`font-bold mt-0.5 ${
                        calculationResult.isSufficient ? 'text-[#2E7D4F]' : 'text-red-600'
                      }`}
                    >
                      {calculationResult.isSufficient
                        ? `+${Math.round((calculationResult.availableKg - calculationResult.requiredKg) * 10) / 10} kg`
                        : `-${calculationResult.deficitKg} kg`}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Tombol Buat Tugas Produksi */}
          <div className="pt-4 border-t border-[#E8E8ED] flex items-center justify-between">
            <span className="text-xs text-[#6E6E73]">
              Siap memproses batch di dapur?
            </span>
            <button
              type="button"
              onClick={handleCreateProductionTask}
              className="px-4 py-2 rounded-full bg-[#1D1D1F] text-white hover:bg-[#2E7D4F] transition-colors text-xs font-semibold shadow-xs cursor-pointer inline-flex items-center gap-1.5"
            >
              <ListTodo className="w-3.5 h-3.5" />
              <span>Buat Tugas Produksi</span>
            </button>
          </div>
        </div>

        {/* Kolom Kanan (5 Kolom): Jumlah Maksimal Hasil Produk dari Stok Saat Ini */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-[#E8E8ED] p-5 sm:p-6 shadow-xs space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              <h3 className="text-base font-bold text-[#1D1D1F]">
                Kapasitas Maksimal Hari Ini
              </h3>
            </div>
            <p className="text-xs text-[#6E6E73]">
              Estimasi unit produk yang dapat dihasilkan penuh dari sisa stok layak saat ini.
            </p>
          </div>

          <div className="space-y-3">
            {maxProductCapacities.map((item) => (
              <div
                key={item.recipe.id}
                className="p-3.5 rounded-2xl bg-[#FBFBFD] border border-[#E8E8ED] space-y-2 hover:bg-[#F5FBF7]/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-bold text-[#1D1D1F]">
                      {item.recipe.namaProduk}
                    </h4>
                    <p className="text-[11px] text-[#6E6E73]">
                      Bahan: {item.availableKg} kg {item.recipe.namaBahan}
                    </p>
                  </div>

                  <span className="px-2 py-0.5 rounded-full bg-[#EBF4EE] text-[#2E7D4F] text-xs font-bold">
                    Maks {item.maxUnits} {item.recipe.satuanHasil}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-[#E8E8ED]/70 text-[#6E6E73]">
                  <span>{item.batchesPossible} kelipatan batch</span>
                  <span>Sisa tak terpakai: {item.leftoverKg} kg</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================= MODAL TAMBAH / EDIT RESEP ================= */}
      {showRecipeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-[#E8E8ED] animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-[#E8E8ED] pb-3">
              <h3 className="text-base font-bold text-[#1D1D1F]">
                {editingRecipe ? 'Edit Formula Resep' : 'Tambah Resep Konversi Baru'}
              </h3>
              <button
                type="button"
                onClick={() => setShowRecipeModal(false)}
                className="p-1 rounded-full hover:bg-[#F5F5F7] text-[#8E8E93]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRecipeSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#1D1D1F] mb-1">
                  Nama Produk Hasil:
                </label>
                <input
                  type="text"
                  value={recipeProduk}
                  onChange={(e) => setRecipeProduk(e.target.value)}
                  placeholder="Contoh: Saus Tomat Panggang"
                  required
                  className="w-full p-2.5 rounded-xl bg-[#F5F5F7] border-0 text-[#1D1D1F] font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1D1D1F] mb-1">
                  Nama Bahan Baku Imperfect:
                </label>
                <input
                  type="text"
                  value={recipeBahan}
                  onChange={(e) => setRecipeBahan(e.target.value)}
                  placeholder="Contoh: Tomat Bengkok"
                  required
                  className="w-full p-2.5 rounded-xl bg-[#F5F5F7] border-0 text-[#1D1D1F]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#1D1D1F] mb-1">
                    Kebutuhan Bahan (kg):
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    value={recipeKg}
                    onChange={(e) => setRecipeKg(Number(e.target.value))}
                    required
                    className="w-full p-2.5 rounded-xl bg-[#F5F5F7] border-0 text-[#1D1D1F]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#1D1D1F] mb-1">
                    Hasil Unit:
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={recipeHasil}
                    onChange={(e) => setRecipeHasil(Number(e.target.value))}
                    required
                    className="w-full p-2.5 rounded-xl bg-[#F5F5F7] border-0 text-[#1D1D1F]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#1D1D1F] mb-1">
                  Satuan Kemasan:
                </label>
                <input
                  type="text"
                  value={recipeSatuan}
                  onChange={(e) => setRecipeSatuan(e.target.value)}
                  placeholder="botol / pcs / jar / bungkus"
                  required
                  className="w-full p-2.5 rounded-xl bg-[#F5F5F7] border-0 text-[#1D1D1F]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1D1D1F] mb-1">
                  Catatan Formula (Opsional):
                </label>
                <textarea
                  value={recipeNote}
                  onChange={(e) => setRecipeNote(e.target.value)}
                  placeholder="Instruksi tambahan per batch..."
                  rows={2}
                  className="w-full p-2.5 rounded-xl bg-[#F5F5F7] border-0 text-[#1D1D1F]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E8E8ED]">
                <button
                  type="button"
                  onClick={() => setShowRecipeModal(false)}
                  className="px-4 py-2 rounded-full bg-[#F5F5F7] text-[#6E6E73] hover:text-[#1D1D1F]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#2E7D4F] text-white hover:bg-[#256640] transition-colors font-semibold shadow-xs cursor-pointer"
                >
                  Simpan Formula
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL KONFIRMASI HAPUS RESEP ================= */}
      {deletingRecipeId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-[#E8E8ED] animate-in zoom-in-95 duration-200">
            <h3 className="text-base font-bold text-[#1D1D1F]">Hapus Formula Resep?</h3>
            <p className="text-xs text-[#6E6E73] leading-relaxed">
              Formula ini akan dihapus dari sistem dan tidak dapat digunakan lagi dalam modul kalkulasi dapur.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingRecipeId(null)}
                className="px-4 py-2 text-xs font-semibold rounded-full bg-[#F5F5F7] text-[#6E6E73] hover:text-[#1D1D1F]"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteRecipe}
                className="px-4 py-2 text-xs font-semibold rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors shadow-xs"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
