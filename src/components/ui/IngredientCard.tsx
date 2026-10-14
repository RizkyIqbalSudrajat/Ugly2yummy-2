import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Ingredient } from '../../types';
import { SmartImage } from './SmartImage';
import { MapPin, User, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export interface IngredientCardProps {
  ingredient: Ingredient;
  className?: string;
  variant?: 'featured' | 'standard';
}

export const IngredientCard: React.FC<IngredientCardProps> = ({
  ingredient,
  className = '',
  variant = 'standard',
}) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/cerita-bahan/${ingredient.id}`);
  };

  const formattedSaved = ingredient.totalKgTerselamatkan.toLocaleString('id-ID');

  return (
    <div
      onClick={handleCardClick}
      className={`group relative bg-white rounded-2xl sm:rounded-3xl border border-[#E8E8ED] overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-0.5 hover:border-[#2E7D4F]/30 shadow-none hover:shadow-xs cursor-pointer ${className}`}
    >
      {/* Visual Image */}
      <div className="relative w-full overflow-hidden bg-[#F5F5F7]">
        <SmartImage
          src={ingredient.gambar}
          alt={ingredient.nama}
          fallbackEmoji={ingredient.emoji}
          aspectRatio={variant === 'featured' ? '16:9' : '4:3'}
          hoverZoom={true}
          containerClassName="w-full"
        />

        {/* Emoji Badge Overlay */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full border border-[#E8E8ED] shadow-xs">
          <span className="text-base leading-none">{ingredient.emoji}</span>
          <span className="text-xs font-semibold text-[#1D1D1F]">
            {ingredient.nama}
          </span>
        </div>

        {/* Saved Count */}
        <div className="absolute bottom-3 right-3 z-10 bg-[#141414]/80 backdrop-blur-sm text-white text-[11px] font-medium px-2.5 py-1 rounded-full">
          {formattedSaved} kg diselamatkan
        </div>
      </div>

      {/* Details */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Origin & Farmer meta */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-[#6E6E73] mb-3">
            <span className="inline-flex items-center gap-1 text-[#1D1D1F]/80">
              <MapPin className="w-3.5 h-3.5 text-[#2E7D4F]" />
              {ingredient.asal}
            </span>
            <span className="inline-flex items-center gap-1 text-[#6E6E73]">
              <User className="w-3.5 h-3.5 text-[#6E6E73]" />
              {ingredient.petani}
            </span>
          </div>

          {/* Reason considered 'ugly' */}
          <div className="bg-[#F5F5F7] border border-[#E8E8ED] rounded-xl p-3 mb-3">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#C86218] mb-1">
              Cap &quot;Tak Sempurna&quot;:
            </div>
            <p className="text-xs text-[#1D1D1F] leading-relaxed">
              {ingredient.alasanUgly}
            </p>
          </div>

          {/* Fact reassuring quality */}
          <div className="flex items-start gap-2 text-xs text-[#6E6E73] leading-relaxed">
            <CheckCircle2 className="w-4 h-4 text-[#2E7D4F] shrink-0 mt-0.5" />
            <span>{ingredient.fakta}</span>
          </div>
        </div>

        {/* Story link footer */}
        <div className="mt-5 pt-3 border-t border-[#E8E8ED]/60 flex items-center justify-between">
          <span className="text-xs text-[#6E6E73]">Baca kisah lengkap</span>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#2E7D4F] group-hover:translate-x-0.5 transition-transform">
            <span>Buka Cerita</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </div>
  );
};
