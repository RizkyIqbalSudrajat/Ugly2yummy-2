import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from '../components/ui/Container';
import { SmartImage } from '../components/ui/SmartImage';
import { PRODUCTS, INGREDIENTS } from '../data/dummy';
import { Search, Sparkles, ArrowUpRight, SlidersHorizontal, X } from 'lucide-react';
import { FilterPanel, CatalogFilterState } from '../components/ui/FilterPanel';

type SortOption =
  | 'Paling Sesuai'
  | 'Harga Terendah'
  | 'Harga Tertinggi'
  | 'Rating Tertinggi'
  | 'Paling Banyak Menyelamatkan';

export const CatalogPage: React.FC = () => {
  const navigate = useNavigate();

  // Search query
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Sorting
  const [sortBy, setSortBy] = useState<SortOption>('Paling Sesuai');

  // Filter Panel open state
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Grouped Filter State
  const [filterState, setFilterState] = useState<CatalogFilterState>({
    jenisProduk: [],
    cocokUntuk: [],
    bahanAsal: [],
    hargaRange: '',
  });

  // Reset all filters
  const handleResetFilters = () => {
    setFilterState({
      jenisProduk: [],
      cocokUntuk: [],
      bahanAsal: [],
      hargaRange: '',
    });
  };

  // Total active filter count for badge
  const totalActiveFilterCount =
    filterState.jenisProduk.length +
    filterState.cocokUntuk.length +
    filterState.bahanAsal.length +
    (filterState.hargaRange ? 1 : 0);

  // List of ingredients for filter options
  const ingredientsOptions = useMemo(() => {
    return INGREDIENTS.map((ing) => ({
      id: ing.id,
      nama: ing.nama,
      emoji: ing.emoji,
    }));
  }, []);

  // Helper to format origin from ingredient
  const getProductOrigin = (ingredientId: string, bahanUtama: string) => {
    if (bahanUtama === 'Mangga + Pisang') return 'Indramayu & Lampung';
    const ing = INGREDIENTS.find((i) => i.id === ingredientId);
    if (!ing) return 'Jawa Barat';
    return ing.asal.split(',')[0].trim();
  };

  // Filtered and Sorted Products
  const filteredAndSortedProducts = useMemo(() => {
    const list = PRODUCTS.filter((product) => {
      // 1. Search filter
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchName = product.nama.toLowerCase().includes(q);
        const matchBahan = product.bahanUtama.toLowerCase().includes(q);
        const matchKat = product.kategori.toLowerCase().includes(q);
        const matchKebutuhan =
          product.kebutuhan &&
          product.kebutuhan.some((k) => k.toLowerCase().includes(q));
        if (!matchName && !matchBahan && !matchKat && !matchKebutuhan) {
          return false;
        }
      }

      // 2. Jenis Produk (multiple check)
      if (
        filterState.jenisProduk.length > 0 &&
        !filterState.jenisProduk.includes(product.kategori)
      ) {
        return false;
      }

      // 3. Cocok Untuk (multiple check)
      if (filterState.cocokUntuk.length > 0) {
        const matchesAnyKebutuhan =
          product.kebutuhan &&
          product.kebutuhan.some((k) => filterState.cocokUntuk.includes(k));
        if (!matchesAnyKebutuhan) {
          return false;
        }
      }

      // 4. Bahan Asal (multiple check)
      if (
        filterState.bahanAsal.length > 0 &&
        !filterState.bahanAsal.includes(product.ingredientId)
      ) {
        return false;
      }

      // 5. Kisaran Harga (single check)
      if (filterState.hargaRange === '<25000' && product.harga >= 25000) {
        return false;
      }
      if (
        filterState.hargaRange === '25000-40000' &&
        (product.harga < 25000 || product.harga > 40000)
      ) {
        return false;
      }
      if (filterState.hargaRange === '>40000' && product.harga <= 40000) {
        return false;
      }

      return true;
    });

    // Apply sorting
    return list.sort((a, b) => {
      if (sortBy === 'Harga Terendah') {
        return a.harga - b.harga;
      }
      if (sortBy === 'Harga Tertinggi') {
        return b.harga - a.harga;
      }
      if (sortBy === 'Rating Tertinggi') {
        return b.rating - a.rating;
      }
      if (sortBy === 'Paling Banyak Menyelamatkan') {
        return b.estimasiKgTerselamatkan - a.estimasiKgTerselamatkan;
      }
      return 0; // Paling Sesuai
    });
  }, [searchQuery, filterState, sortBy]);

  return (
    <div className="py-12 sm:py-20 md:py-24">
      <Container>
        {/* Header Section */}
        <div className="max-w-3xl mb-10 sm:mb-12">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#2E7D4F] block mb-2">
            Katalog Upcycled
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#1D1D1F]">
            Produk
          </h1>
          <p className="mt-3 text-sm sm:text-base text-[#6E6E73] leading-relaxed">
            Semua olahan lezat dari buah dan sayur unik yang diselamatkan dari petani lokal.
          </p>
        </div>

        {/* =========================================================================
            SATU BARIS TOOLBAR: Pencarian Lebar, Tombol Filter & Dropdown Urutkan
            ========================================================================= */}
        <div className="relative mb-5 z-30">
          <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap sm:flex-nowrap">
            {/* 1. Kolom Pencarian (Lebar di kiri) */}
            <div className="relative flex-1 min-w-[200px] w-full sm:w-auto">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6E6E73]">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari selai, saus, keripik, atau bahan..."
                className="w-full pl-10 pr-4 py-2.5 rounded-full border border-[#E8E8ED] bg-white text-xs sm:text-sm text-[#1D1D1F] placeholder-[#6E6E73]/60 focus:border-[#2E7D4F] focus:ring-2 focus:ring-[#2E7D4F]/15 outline-none transition-all"
              />
            </div>

            {/* 2. Tombol Filter dengan SlidersHorizontal & Badge Jumlah Filter */}
            <div className="relative shrink-0">
              <button
                type="button"
                aria-expanded={isFilterOpen}
                aria-controls="catalog-filter-panel"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer border ${
                  isFilterOpen || totalActiveFilterCount > 0
                    ? 'bg-[#1D1D1F] text-white border-[#1D1D1F] shadow-xs'
                    : 'bg-white text-[#1D1D1F] border-[#E8E8ED] hover:bg-[#F5F5F7]'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filter</span>
                {totalActiveFilterCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-[#2E7D4F] text-white text-[11px] font-bold flex items-center justify-center">
                    {totalActiveFilterCount}
                  </span>
                )}
              </button>

              {/* Panel Filter (Melayang di desktop, bottom sheet di HP) */}
              <FilterPanel
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                filterState={filterState}
                onFilterChange={setFilterState}
                onReset={handleResetFilters}
                matchedCount={filteredAndSortedProducts.length}
                ingredientsList={ingredientsOptions}
                panelId="catalog-filter-panel"
              />
            </div>

            {/* 3. Dropdown Kecil "Urutkan" */}
            <div className="relative shrink-0">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                aria-label="Urutkan produk"
                className="px-3.5 py-2.5 rounded-full border border-[#E8E8ED] bg-white text-xs sm:text-sm font-medium text-[#1D1D1F] focus:border-[#2E7D4F] outline-none cursor-pointer hover:bg-[#F5F5F7] transition-colors"
              >
                <option value="Paling Sesuai">Urutkan: Paling Sesuai</option>
                <option value="Harga Terendah">Harga Terendah</option>
                <option value="Harga Tertinggi">Harga Tertinggi</option>
                <option value="Rating Tertinggi">Rating Tertinggi</option>
                <option value="Paling Banyak Menyelamatkan">Paling Banyak Menyelamatkan</option>
              </select>
            </div>
          </div>
        </div>

        {/* =========================================================================
            CHIP FILTER AKTIF BERLABEL & LINK HAPUS SEMUA
            ========================================================================= */}
        {totalActiveFilterCount > 0 && (
          <div className="flex items-center gap-2 flex-wrap mb-4 text-xs">
            {/* Chip Jenis Produk */}
            {filterState.jenisProduk.map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5F5F7] border border-[#E8E8ED] text-[#1D1D1F] font-medium"
              >
                <span>Jenis: {item}</span>
                <button
                  type="button"
                  onClick={() =>
                    setFilterState({
                      ...filterState,
                      jenisProduk: filterState.jenisProduk.filter((j) => j !== item),
                    })
                  }
                  className="text-[#8E8E93] hover:text-[#1D1D1F] cursor-pointer"
                  title={`Hapus filter ${item}`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}

            {/* Chip Cocok Untuk */}
            {filterState.cocokUntuk.map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5F5F7] border border-[#E8E8ED] text-[#1D1D1F] font-medium"
              >
                <span>Cocok: {item}</span>
                <button
                  type="button"
                  onClick={() =>
                    setFilterState({
                      ...filterState,
                      cocokUntuk: filterState.cocokUntuk.filter((c) => c !== item),
                    })
                  }
                  className="text-[#8E8E93] hover:text-[#1D1D1F] cursor-pointer"
                  title={`Hapus filter ${item}`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}

            {/* Chip Bahan Asal */}
            {filterState.bahanAsal.map((ingId) => {
              const ing = INGREDIENTS.find((i) => i.id === ingId);
              return (
                <span
                  key={ingId}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5F5F7] border border-[#E8E8ED] text-[#1D1D1F] font-medium"
                >
                  <span>
                    Bahan: {ing?.emoji} {ing?.nama || ingId}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setFilterState({
                        ...filterState,
                        bahanAsal: filterState.bahanAsal.filter((b) => b !== ingId),
                      })
                    }
                    className="text-[#8E8E93] hover:text-[#1D1D1F] cursor-pointer"
                    title={`Hapus filter bahan`}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              );
            })}

            {/* Chip Harga */}
            {filterState.hargaRange && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5F5F7] border border-[#E8E8ED] text-[#1D1D1F] font-medium">
                <span>
                  Harga:{' '}
                  {filterState.hargaRange === '<25000'
                    ? 'Di bawah Rp25.000'
                    : filterState.hargaRange === '25000-40000'
                    ? 'Rp25.000–Rp40.000'
                    : 'Di atas Rp40.000'}
                </span>
                <button
                  type="button"
                  onClick={() => setFilterState({ ...filterState, hargaRange: '' })}
                  className="text-[#8E8E93] hover:text-[#1D1D1F] cursor-pointer"
                  title="Hapus filter harga"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}

            {/* Link Hapus Semua */}
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs font-semibold text-[#2E7D4F] hover:underline cursor-pointer ml-1"
            >
              Hapus semua
            </button>
          </div>
        )}

        {/* Teks Ringkasan "Menampilkan X dari Y produk" */}
        <div className="flex items-center justify-between text-xs text-[#6E6E73] mb-8 pb-3 border-b border-[#E8E8ED]">
          <span>
            Menampilkan {filteredAndSortedProducts.length} dari {PRODUCTS.length} produk
          </span>
        </div>

        {/* Grid Produk: 3 kolom di desktop, 2 di tablet, 1 di HP */}
        {filteredAndSortedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            {filteredAndSortedProducts.map((product) => {
              const origin = getProductOrigin(product.ingredientId, product.bahanUtama);
              const formattedPrice = new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                maximumFractionDigits: 0,
              }).format(product.harga);

              return (
                <div
                  key={product.id}
                  onClick={() => navigate(`/produk/${product.id}`)}
                  className="group bg-white rounded-3xl border border-[#E8E8ED] overflow-hidden flex flex-col justify-between shadow-none hover:shadow-xs hover:border-[#2E7D4F]/30 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
                >
                  {/* Foto Besar Rasio 4:5 dengan Hover Zoom */}
                  <div className="relative w-full overflow-hidden bg-[#F5F5F7]">
                    <SmartImage
                      src={product.gambar}
                      alt={product.nama}
                      fallbackEmoji={product.gambarEmojiFallback}
                      aspectRatio="4:5"
                      hoverZoom={true}
                      containerClassName="w-full"
                    />

                    {/* Label Kecil: "0,5 kg terselamatkan" */}
                    <div className="absolute top-4 left-4 z-10">
                      <span className="inline-flex items-center gap-1.5 bg-white/95 backdrop-blur-md text-[#2E7D4F] text-[11px] font-semibold px-3 py-1.5 rounded-full shadow-xs border border-[#2E7D4F]/15">
                        <Sparkles className="w-3 h-3 text-[#2E7D4F]" />
                        <span>{product.estimasiKgTerselamatkan} kg terselamatkan</span>
                      </span>
                    </div>

                    {/* Hover detail indicator */}
                    <div className="absolute bottom-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-[#1D1D1F] opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-xs">
                      <ArrowUpRight className="w-4 h-4 text-[#2E7D4F]" />
                    </div>
                  </div>

                  {/* Konten Kartu */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Asal Bahan: "Dari Tomat Bengkok · Lembang" */}
                      <p className="text-xs text-[#6E6E73] font-medium mb-1.5">
                        Dari {product.bahanUtama} · {origin}
                      </p>

                      {/* Nama Produk */}
                      <h3 className="text-lg sm:text-xl font-bold text-[#1D1D1F] group-hover:text-[#2E7D4F] transition-colors leading-snug">
                        {product.nama}
                      </h3>
                    </div>

                    {/* Harga Tabular & Ukuran */}
                    <div className="mt-5 pt-4 border-t border-[#E8E8ED]/70 flex items-center justify-between">
                      <div>
                        <span className="text-base sm:text-lg font-extrabold text-[#1D1D1F] tabular-nums tracking-tight">
                          {formattedPrice}
                        </span>
                        <span className="text-xs text-[#6E6E73] ml-1.5">
                          / {product.ukuran}
                        </span>
                      </div>

                      <span className="text-xs font-semibold text-[#2E7D4F] group-hover:underline">
                        Lihat Detail
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center bg-white rounded-3xl border border-[#E8E8ED] space-y-3">
            <p className="text-base font-bold text-[#1D1D1F]">
              Tidak ada produk yang cocok dengan kombinasi filter Anda.
            </p>
            <p className="text-xs text-[#6E6E73] max-w-sm mx-auto">
              Coba atur ulang beberapa pilihan filter atau hapus kata kunci pencarian untuk melihat produk lainnya.
            </p>
            <button
              onClick={() => {
                handleResetFilters();
                setSearchQuery('');
              }}
              className="mt-2 px-5 py-2.5 rounded-full bg-[#1D1D1F] hover:bg-[#2E7D4F] text-xs font-semibold text-white transition-colors cursor-pointer"
            >
              Reset Semua Filter
            </button>
          </div>
        )}
      </Container>
    </div>
  );
};
