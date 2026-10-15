import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkerData } from '../../../context/WorkerDataContext';
import { ConversionRecipe } from '../../../types/worker';
import {
  Calculator,
  ChefHat,
  ArrowRight,
  Boxes,
  Sparkles,
  BookOpen,
  Scale,
  Package,
  Layers,
  CheckCircle2,
  Info,
  ChevronRight,
} from 'lucide-react';

export const WorkerCalculationPage: React.FC = () => {
  const { materialStocks, recipes } = useWorkerData();
  const navigate = useNavigate();

  // Bahan dengan stok layak > 0
  const availableMaterials = useMemo(
    () => materialStocks.filter((m) => m.sisaLayakKg > 0),
    [materialStocks]
  );

  // Pilihan kalkulator aktif
  const [selectedBahan, setSelectedBahan] = useState<string>(
    availableMaterials[0]?.namaBahan || (recipes[0]?.namaBahan ?? 'Pisang Berbintik')
  );

  // Resep yang cocok dengan bahan terpilih
  const matchingRecipes = useMemo(
    () => recipes.filter((r) => r.namaBahan === selectedBahan),
    [recipes, selectedBahan]
  );

  const [selectedRecipeId, setSelectedRecipeId] = useState<string>(
    matchingRecipes[0]?.id || (recipes[0]?.id ?? '')
  );

  // Resep aktif
  const currentRecipe = useMemo(() => {
    return (
      matchingRecipes.find((r) => r.id === selectedRecipeId) ||
      matchingRecipes[0] ||
      recipes[0]
    );
  }, [matchingRecipes, selectedRecipeId, recipes]);

  // Stok bahan yang sedang dipilih
  const currentMaterialStock = useMemo(() => {
    return materialStocks.find((m) => m.namaBahan === selectedBahan)?.sisaLayakKg || 0;
  }, [materialStocks, selectedBahan]);

  // Input kg kalkulator
  const [inputKg, setInputKg] = useState<number | ''>(
    currentMaterialStock > 0 ? currentMaterialStock : 10
  );

  // Saat bahan diganti, sesuaikan resep dan default input
  const handleSelectBahan = (namaBahan: string) => {
    setSelectedBahan(namaBahan);
    const matches = recipes.filter((r) => r.namaBahan === namaBahan);
    if (matches.length > 0) {
      setSelectedRecipeId(matches[0].id);
    }
    const stock = materialStocks.find((m) => m.namaBahan === namaBahan)?.sisaLayakKg || 0;
    setInputKg(stock > 0 ? stock : 10);
  };

  // Kalkulasi Hasil Berdasarkan Resep
  const calculationResult = useMemo(() => {
    if (!currentRecipe) return { batches: 0, totalUnits: 0, sisaKg: 0, bahanTerpakaiKg: 0 };

    const kg = typeof inputKg === 'number' ? inputKg : 0;
    const rasioKg = currentRecipe.rasioBahanKg;
    const rasioUnit = currentRecipe.rasioHasilUnit;

    const batches = Math.floor(kg / rasioKg);
    const totalUnits = batches * rasioUnit;
    const bahanTerpakaiKg = batches * rasioKg;
    const sisaKg = Math.round((kg - bahanTerpakaiKg) * 10) / 10;

    return {
      batches,
      totalUnits,
      sisaKg,
      bahanTerpakaiKg,
    };
  }, [inputKg, currentRecipe]);

  // Aksi Menuju Form Produksi dengan Data Terisi
  const handleMulaiProduksi = () => {
    if (!currentRecipe || calculationResult.totalUnits <= 0) return;
    const kg = calculationResult.bahanTerpakaiKg;
    const target = calculationResult.totalUnits;
    navigate(
      `/internal/pekerja/produksi?tambah=true&bahan=${encodeURIComponent(
        selectedBahan
      )}&produk=${encodeURIComponent(currentRecipe.namaProduk)}&kg=${kg}&target=${target}`
    );
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-200">
      {/* Header Halaman */}
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#EBF4EE] text-[#2E7D4F] border border-[#2E7D4F]/20">
            Formulasi & Rasio Pangan
          </span>
          <span className="text-xs text-[#6E6E73]">· Dapur Ugly2Yummy</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1D1D1F]">
          Kalkulasi Produksi
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-[#6E6E73] max-w-xl">
          Simulasikan estimasi output produk jadi dari ketersediaan stok bahan baku layak berdasarkan formula standar resep artisan.
        </p>
      </div>

      {/* =========================================================================
          BAGIAN 1: KALKULATOR INTERAKTIF
          ========================================================================= */}
      <div className="bg-white rounded-3xl border border-[#E8E8ED] p-6 sm:p-8 space-y-6 shadow-none">
        <div className="flex items-center justify-between pb-4 border-b border-[#E8E8ED]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#EBF4EE] text-[#2E7D4F] flex items-center justify-center">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1D1D1F]">Kalkulator Hasil Produksi</h2>
              <p className="text-xs text-[#6E6E73]">Hitung estimasi unit produk dari takaran kilogram</p>
            </div>
          </div>
          <span className="text-xs font-medium text-[#6E6E73]">Formula Realtime</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Kolom Kiri: Input Parameter (7 Kolom) */}
          <div className="lg:col-span-7 space-y-5">
            {/* 1. Pilih Bahan Baku */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#1D1D1F]">1. Pilih Bahan Baku</label>
                <span className="text-[11px] text-[#2E7D4F] font-semibold">
                  Stok Layak: {currentMaterialStock} kg
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {recipes
                  .map((r) => r.namaBahan)
                  .filter((v, i, a) => a.indexOf(v) === i)
                  .map((bahanName) => {
                    const isSelected = selectedBahan === bahanName;
                    const stock =
                      materialStocks.find((m) => m.namaBahan === bahanName)?.sisaLayakKg || 0;

                    return (
                      <button
                        key={bahanName}
                        type="button"
                        onClick={() => handleSelectBahan(bahanName)}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#EBF4EE] border-[#2E7D4F] text-[#2E7D4F] shadow-xs'
                            : 'bg-[#FBFBFD] border-[#E8E8ED] text-[#1D1D1F] hover:bg-[#F5F5F7]'
                        }`}
                      >
                        <p className="text-xs font-bold truncate">{bahanName}</p>
                        <p className="text-[10px] text-[#6E6E73] mt-0.5">{stock} kg layak</p>
                      </button>
                    );
                  })}
              </div>
            </div>

            {/* 2. Pilih Produk Jadi yang Dituju */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1D1D1F]">2. Produk Jadi yang Diolah</label>
              <div className="space-y-2">
                {matchingRecipes.map((recipe) => (
                  <button
                    key={recipe.id}
                    type="button"
                    onClick={() => setSelectedRecipeId(recipe.id)}
                    className={`w-full p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                      selectedRecipeId === recipe.id
                        ? 'bg-[#1D1D1F] text-white border-[#1D1D1F] shadow-xs'
                        : 'bg-[#FBFBFD] border-[#E8E8ED] text-[#1D1D1F] hover:bg-[#F5F5F7]'
                    }`}
                  >
                    <div>
                      <p className="text-xs sm:text-sm font-bold">{recipe.namaProduk}</p>
                      <p
                        className={`text-[11px] mt-0.5 ${
                          selectedRecipeId === recipe.id ? 'text-white/80' : 'text-[#6E6E73]'
                        }`}
                      >
                        Rasio: {recipe.rasioBahanKg} kg {recipe.namaBahan} → {recipe.rasioHasilUnit}{' '}
                        {recipe.satuanHasil}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        selectedRecipeId === recipe.id
                          ? 'bg-white/20 text-white'
                          : 'bg-[#EBF4EE] text-[#2E7D4F]'
                      }`}
                    >
                      Pilih
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Input Kilogram yang Hendak Diolah */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#1D1D1F]">
                  3. Berat Bahan yang Hendak Dipakai (kg)
                </label>
                {currentMaterialStock > 0 && (
                  <button
                    type="button"
                    onClick={() => setInputKg(currentMaterialStock)}
                    className="text-[11px] font-semibold text-[#2E7D4F] hover:underline cursor-pointer"
                  >
                    Gunakan Semua Stok ({currentMaterialStock} kg)
                  </button>
                )}
              </div>

              <div className="relative">
                <input
                  type="number"
                  step="any"
                  min="0"
                  value={inputKg}
                  onChange={(e) => setInputKg(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="0"
                  className="w-full px-4 py-3 pr-12 rounded-2xl border border-[#E8E8ED] bg-[#F5F5F7] text-lg font-extrabold text-[#1D1D1F] focus:bg-white focus:border-[#2E7D4F] outline-none transition-all"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[#6E6E73]">
                  kg
                </span>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Hasil Kalkulasi & Tombol Aksi (5 Kolom) */}
          <div className="lg:col-span-5 bg-[#FBFBFD] rounded-3xl border border-[#E8E8ED] p-6 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs uppercase font-bold tracking-wider text-[#6E6E73] block">
                Estimasi Output Produksi
              </span>

              {/* Big Result Box */}
              <div className="p-5 rounded-2xl bg-[#EBF4EE] border border-[#2E7D4F]/20 text-center space-y-1">
                <span className="text-xs text-[#2E7D4F] font-semibold">Total Target Hasil</span>
                <div className="flex items-baseline justify-center gap-1.5">
                  <span className="text-4xl sm:text-5xl font-extrabold text-[#2E7D4F] tracking-tight">
                    {calculationResult.totalUnits}
                  </span>
                  <span className="text-sm sm:text-base font-bold text-[#2E7D4F]">
                    {currentRecipe?.satuanHasil || 'pcs'}
                  </span>
                </div>
                <p className="text-[11px] text-[#2E7D4F]/80">
                  Dari {calculationResult.batches} batch formula standar
                </p>
              </div>

              {/* Rincian Konversi */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-[#E8E8ED]">
                  <span className="text-[#6E6E73]">Bahan Terpakai:</span>
                  <span className="font-bold text-[#1D1D1F]">
                    {calculationResult.bahanTerpakaiKg} kg
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-[#E8E8ED]">
                  <span className="text-[#6E6E73]">Sisa Tidak Cukup Kelipatan:</span>
                  <span
                    className={`font-bold ${
                      calculationResult.sisaKg > 0 ? 'text-amber-700' : 'text-[#6E6E73]'
                    }`}
                  >
                    {calculationResult.sisaKg} kg
                  </span>
                </div>

                {calculationResult.sisaKg > 0 && (
                  <p className="text-[11px] text-amber-700 bg-amber-50 p-2.5 rounded-xl border border-amber-200/60 leading-normal">
                    <Info className="w-3.5 h-3.5 inline mr-1 text-amber-600" />
                    Resep memerlukan kelipatan {currentRecipe.rasioBahanKg} kg. Sisa{' '}
                    {calculationResult.sisaKg} kg akan tetap tersimpan aman di stok bahan layak.
                  </p>
                )}
              </div>
            </div>

            {/* Tombol Aksi */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleMulaiProduksi}
                disabled={calculationResult.totalUnits <= 0}
                className="w-full py-3.5 rounded-full bg-[#2E7D4F] hover:bg-[#256640] disabled:bg-[#E8E8ED] disabled:text-[#6E6E73] disabled:cursor-not-allowed text-white text-xs sm:text-sm font-semibold transition-all shadow-xs cursor-pointer active:scale-95 flex items-center justify-center gap-2"
              >
                <span>Mulai Produksi dari Kalkulasi ini</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          BAGIAN 2: REKOMENDASI PRODUKSI HARI INI DARI STOK LAYAK
          ========================================================================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-[#1D1D1F]">
              Rekomendasi Produksi Hari Ini
            </h2>
            <p className="text-xs text-[#6E6E73]">
              Dihitung otomatis dari seluruh stok bahan layak yang siap olah di gudang
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-[#EBF4EE] text-[#2E7D4F] font-semibold border border-[#2E7D4F]/20">
            {availableMaterials.length} Bahan Tersedia
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableMaterials.map((mat) => {
            // Cari resep utama
            const rec = recipes.find((r) => r.namaBahan === mat.namaBahan);
            if (!rec) return null;

            const batches = Math.floor(mat.sisaLayakKg / rec.rasioBahanKg);
            const maxUnits = batches * rec.rasioHasilUnit;
            const sisa = Math.round((mat.sisaLayakKg - batches * rec.rasioBahanKg) * 10) / 10;

            return (
              <div
                key={mat.namaBahan}
                className="p-5 rounded-3xl bg-white border border-[#E8E8ED] space-y-3.5 hover:border-[#2E7D4F]/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#F5F5F7] text-[#6E6E73] border border-[#E8E8ED]">
                      {mat.jenis}
                    </span>
                    <span className="text-xs font-extrabold text-[#2E7D4F]">
                      {mat.sisaLayakKg} kg siap
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-[#1D1D1F]">{mat.namaBahan}</h3>
                  <p className="text-xs text-[#6E6E73] mt-1 leading-normal">
                    Stok <strong className="text-[#1D1D1F]">{mat.namaBahan}</strong> layak{' '}
                    <strong>{mat.sisaLayakKg} kg</strong> → maksimal{' '}
                    <strong className="text-[#2E7D4F]">
                      {maxUnits} {rec.satuanHasil} {rec.namaProduk}
                    </strong>
                    {sisa > 0 ? ` (sisa ${sisa} kg).` : '.'}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#E8E8ED] flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      handleSelectBahan(mat.namaBahan);
                      setInputKg(mat.sisaLayakKg);
                      window.scrollTo({ top: 120, behavior: 'smooth' });
                    }}
                    className="text-xs font-semibold text-[#2E7D4F] hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <span>Buka di Kalkulator</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      navigate(
                        `/internal/pekerja/produksi?tambah=true&bahan=${encodeURIComponent(
                          mat.namaBahan
                        )}&produk=${encodeURIComponent(rec.namaProduk)}&kg=${
                          batches * rec.rasioBahanKg
                        }&target=${maxUnits}`
                      );
                    }}
                    className="px-3 py-1.5 rounded-full bg-[#EBF4EE] hover:bg-[#2E7D4F] text-[#2E7D4F] hover:text-white text-xs font-semibold border border-[#2E7D4F]/20 transition-all cursor-pointer"
                  >
                    Olahan Penuh
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          BAGIAN 3: KARTU RESEP KONVERSI RESMI DAPUR
          ========================================================================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-[#1D1D1F]">
              Kamus Resep Konversi Dapur
            </h2>
            <p className="text-xs text-[#6E6E73]">
              Rasio standar konversi hasil olahan bahan terselamatkan menjadi produk kemasan
            </p>
          </div>
          <span className="text-xs text-[#6E6E73] flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5 text-[#2E7D4F]" />
            <span>{recipes.length} Formula Terdaftar</span>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {recipes.map((rec) => (
            <div
              key={rec.id}
              className="p-4 rounded-2xl bg-white border border-[#E8E8ED] space-y-2 hover:border-[#2E7D4F]/30 transition-all"
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-mono text-[10px] text-[#6E6E73]">{rec.id}</span>
                <span className="text-[10px] font-semibold text-[#2E7D4F] bg-[#EBF4EE] px-2 py-0.5 rounded-full">
                  1 : {rec.rasioHasilUnit / rec.rasioBahanKg}
                </span>
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-[#1D1D1F]">{rec.namaProduk}</h3>
              <p className="text-xs font-semibold text-[#2E7D4F]">
                {rec.rasioBahanKg} kg {rec.namaBahan} → {rec.rasioHasilUnit} {rec.satuanHasil}
              </p>
              {rec.catatan && (
                <p className="text-[11px] text-[#6E6E73] line-clamp-2 leading-relaxed">
                  {rec.catatan}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
