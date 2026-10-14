import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from '../components/ui/Container';
import { SmartImage } from '../components/ui/SmartImage';
import { PRODUCTS, INGREDIENTS } from '../data/dummy';
import { Search, Sparkles, ArrowUpRight } from 'lucide-react';

export const CatalogPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [selectedKebutuhan, setSelectedKebutuhan] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    'Semua',
    'Selai',
    'Saus & Sambal',
    'Camilan',
    'Roti & Kue',
    'Minuman',
  ];

  const kebutuhanList = [
    'Semua',
    'Sarapan',
    'Camilan Sehat',
    'Masak Harian',
    'Oleh-oleh',
    'Hampers',
  ];

  // Helper to format origin from ingredient
  const getProductOrigin = (ingredientId: string, bahanUtama: string) => {
    if (bahanUtama === 'Mangga + Pisang') return 'Indramayu & Lampung';
    const ing = INGREDIENTS.find((i) => i.id === ingredientId);
    if (!ing) return 'Jawa Barat';
    return ing.asal.split(',')[0].trim();
  };

  // Filtered products list (kategori, kebutuhan, dan search)
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      const matchCategory =
        selectedCategory === 'Semua' || product.kategori === selectedCategory;
      const matchKebutuhan =
        selectedKebutuhan === 'Semua' ||
        (product.kebutuhan && product.kebutuhan.includes(selectedKebutuhan));
      const matchSearch =
        searchQuery.trim() === '' ||
        product.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.bahanUtama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.kategori.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.kebutuhan &&
          product.kebutuhan.some((k) =>
            k.toLowerCase().includes(searchQuery.toLowerCase())
          ));
      return matchCategory && matchKebutuhan && matchSearch;
    });
  }, [selectedCategory, selectedKebutuhan, searchQuery]);

  return (
    <div className="py-12 sm:py-20 md:py-24">
      <Container>
        {/* Header Section */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#2E7D4F] block mb-2">
            Katalog Upcycled
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-[#1D1D1F]">
            Produk
          </h1>
          <p className="mt-3 text-base sm:text-lg text-[#6E6E73] leading-relaxed">
            Semua olahan lezat dari buah dan sayur unik yang diselamatkan dari petani lokal.
          </p>
        </div>

        {/* Search Bar & Filter Chips Controls */}
        <div className="space-y-5 mb-12 sm:mb-16">
          {/* Search Bar */}
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#6E6E73]">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari selai, saus, keripik, atau bahan..."
              className="w-full pl-11 pr-4 py-3 rounded-full border border-[#E8E8ED] bg-white text-sm text-[#1D1D1F] placeholder-[#6E6E73]/60 focus:border-[#2E7D4F] focus:ring-2 focus:ring-[#2E7D4F]/15 outline-none transition-all shadow-none"
            />
          </div>

          {/* Baris 1: Kategori Produk */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-[#8E8E93] uppercase tracking-wider block">
              Kategori:
            </span>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap cursor-pointer select-none ${
                    selectedCategory === category
                      ? 'bg-[#1D1D1F] text-white shadow-none'
                      : 'bg-white text-[#6E6E73] border border-[#E8E8ED] hover:text-[#1D1D1F] hover:bg-[#F5F5F7]'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Baris 2: Filter Kebutuhan "Cocok untuk" */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-[#8E8E93] uppercase tracking-wider block">
              Cocok untuk:
            </span>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
              {kebutuhanList.map((item) => {
                const isActive = selectedKebutuhan === item;
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setSelectedKebutuhan(item)}
                    className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap cursor-pointer select-none ${
                      isActive
                        ? 'bg-[#2E7D4F] text-white shadow-none'
                        : 'bg-white text-[#6E6E73] border border-[#E8E8ED] hover:text-[#1D1D1F] hover:bg-[#F5F5F7]'
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Grid Produk: 3 kolom di desktop, 2 di tablet, 1 di HP */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            {filteredProducts.map((product) => {
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
          <div className="p-12 text-center bg-white rounded-3xl border border-[#E8E8ED]">
            <p className="text-base font-semibold text-[#1D1D1F]">
              Tidak ada produk yang cocok dengan pencarian Anda.
            </p>
            <p className="text-xs text-[#6E6E73] mt-1">
              Coba kata kunci lain atau pilih kategori &quot;Semua&quot;.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('Semua');
                setSelectedKebutuhan('Semua');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 rounded-full bg-[#F5F5F7] text-xs font-semibold text-[#1D1D1F] hover:bg-[#E8E8ED] transition-colors cursor-pointer"
            >
              Reset Semua Filter
            </button>
          </div>
        )}
      </Container>
    </div>
  );
};
