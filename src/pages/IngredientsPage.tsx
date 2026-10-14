import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from '../components/ui/Container';
import { SmartImage } from '../components/ui/SmartImage';
import { INGREDIENTS } from '../data/dummy';
import { MapPin, ArrowUpRight, Sparkles } from 'lucide-react';

export const IngredientsPage: React.FC = () => {
  const navigate = useNavigate();

  const featuredIngredient = INGREDIENTS[0]; // Tomat Bengkok
  const otherIngredients = INGREDIENTS.slice(1);

  return (
    <div className="py-12 sm:py-20 md:py-24">
      <Container>
        {/* Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#2E7D4F] block mb-2">
            Dari Kebun Mitra
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-[#1D1D1F]">
            Cerita di Balik Setiap Bahan
          </h1>
          <p className="mt-3 text-base sm:text-lg text-[#6E6E73] leading-relaxed">
            Mengenal buah dan sayur unik yang kerap disisihkan pasar, kisah para petani mitra, dan
            kebaikan rasa di baliknya.
          </p>
        </div>

        {/* Portfolio-Style Grid: Kartu Pertama Besar, Sisanya Sedang */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          {/* =========================================================================
              KARTU PERTAMA BESAR (BAHAN UNGGULAN: TOMAT BENGKOK)
              ========================================================================= */}
          <div
            onClick={() => navigate(`/cerita-bahan/${featuredIngredient.id}`)}
            className="md:col-span-2 lg:col-span-2 group bg-white rounded-3xl sm:rounded-[32px] border border-[#E8E8ED] overflow-hidden flex flex-col justify-between shadow-none hover:shadow-xs hover:border-[#2E7D4F]/30 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
          >
            {/* Foto Besar Rasio 16:9 / 16:10 */}
            <div className="relative w-full overflow-hidden bg-[#F5F5F7]">
              <SmartImage
                src={featuredIngredient.gambar}
                alt={featuredIngredient.altText || featuredIngredient.nama}
                fallbackEmoji={featuredIngredient.emoji}
                aspectRatio="16:9"
                hoverZoom={true}
                containerClassName="w-full"
              />

              {/* Badges */}
              <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 bg-white/95 backdrop-blur-md text-[#2E7D4F] text-xs font-semibold px-3 py-1.5 rounded-full shadow-xs border border-[#2E7D4F]/15">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Bahan Unggulan</span>
                </span>
                <span className="inline-flex items-center gap-1 bg-[#141414]/80 backdrop-blur-md text-white text-xs font-medium px-3 py-1.5 rounded-full">
                  {featuredIngredient.totalKgTerselamatkan.toLocaleString('id-ID')} kg diselamatkan
                </span>
              </div>

              {/* Hover indicator */}
              <div className="absolute bottom-4 right-4 z-10 w-10 h-10 rounded-full bg-white/95 backdrop-blur-md flex items-center justify-center text-[#1D1D1F] opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-xs">
                <ArrowUpRight className="w-5 h-5 text-[#2E7D4F]" />
              </div>
            </div>

            {/* Konten Kartu Besar */}
            <div className="p-7 sm:p-9 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-medium text-[#6E6E73] mb-2">
                  <span className="inline-flex items-center gap-1 text-[#2E7D4F]">
                    <MapPin className="w-3.5 h-3.5" />
                    {featuredIngredient.asal}
                  </span>
                  <span>·</span>
                  <span>{featuredIngredient.petani}</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-bold text-[#1D1D1F] group-hover:text-[#2E7D4F] transition-colors leading-tight">
                  {featuredIngredient.emoji} {featuredIngredient.nama}
                </h3>

                <p className="mt-3 text-sm sm:text-base text-[#6E6E73] leading-relaxed line-clamp-2">
                  {featuredIngredient.alasanUgly}
                </p>
              </div>

              <div className="mt-6 pt-5 border-t border-[#E8E8ED]/70 flex items-center justify-between text-xs sm:text-sm font-semibold text-[#2E7D4F]">
                <span>Baca kisah lengkap Pak Asep & Tomat Bengkok</span>
                <span className="inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Buka Cerita</span>
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </div>

          {/* =========================================================================
              KARTU SEDANG (5 BAHAN LAINNYA)
              ========================================================================= */}
          {otherIngredients.map((ingredient) => (
            <div
              key={ingredient.id}
              onClick={() => navigate(`/cerita-bahan/${ingredient.id}`)}
              className="group bg-white rounded-3xl border border-[#E8E8ED] overflow-hidden flex flex-col justify-between shadow-none hover:shadow-xs hover:border-[#2E7D4F]/30 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
            >
              {/* Foto Besar Rasio 4:3 */}
              <div className="relative w-full overflow-hidden bg-[#F5F5F7]">
                <SmartImage
                  src={ingredient.gambar}
                  alt={ingredient.altText || ingredient.nama}
                  fallbackEmoji={ingredient.emoji}
                  aspectRatio="4:3"
                  hoverZoom={true}
                  containerClassName="w-full"
                />

                <div className="absolute top-3.5 left-3.5 z-10">
                  <span className="inline-flex items-center gap-1 bg-white/95 backdrop-blur-md text-[#1D1D1F] text-xs font-semibold px-2.5 py-1 rounded-full shadow-xs border border-[#E8E8ED]">
                    <span>{ingredient.emoji}</span>
                    <span>{ingredient.nama}</span>
                  </span>
                </div>

                {/* Hover indicator */}
                <div className="absolute bottom-3.5 right-3.5 z-10 w-8 h-8 rounded-full bg-white/95 backdrop-blur-md flex items-center justify-center text-[#1D1D1F] opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-xs">
                  <ArrowUpRight className="w-4 h-4 text-[#2E7D4F]" />
                </div>
              </div>

              {/* Konten Kartu Sedang */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  {/* Asal Daerah */}
                  <p className="text-xs text-[#6E6E73] font-medium flex items-center gap-1 mb-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#2E7D4F]" />
                    <span>{ingredient.asal}</span>
                  </p>

                  {/* Nama Bahan */}
                  <h4 className="text-lg font-bold text-[#1D1D1F] group-hover:text-[#2E7D4F] transition-colors leading-snug">
                    {ingredient.nama}
                  </h4>

                  {/* Satu Kalimat Alasan Dianggap "Ugly" */}
                  <p className="mt-2 text-xs sm:text-sm text-[#6E6E73] leading-relaxed line-clamp-2">
                    {ingredient.alasanUgly}
                  </p>
                </div>

                {/* Footer link */}
                <div className="mt-5 pt-4 border-t border-[#E8E8ED]/70 flex items-center justify-between text-xs">
                  <span className="text-[#6E6E73]">
                    {ingredient.totalKgTerselamatkan.toLocaleString('id-ID')} kg selamat
                  </span>
                  <span className="font-semibold text-[#2E7D4F] group-hover:underline">
                    Baca Cerita
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
};
