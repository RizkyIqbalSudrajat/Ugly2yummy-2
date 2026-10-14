import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Product } from '../../types';
import { SmartImage } from './SmartImage';
import { Sparkles, ArrowRight } from 'lucide-react';

export interface ProductCardProps {
  product: Product;
  className?: string;
  onAddToCart?: (product: Product, e: React.MouseEvent) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  className = '',
  onAddToCart,
}) => {
  const navigate = useNavigate();

  const formattedPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(product.harga);

  const formattedOriginalPrice = product.hargaPembanding
    ? new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
      }).format(product.hargaPembanding)
    : null;

  const diskonPersen =
    product.hargaPembanding && product.hargaPembanding > product.harga
      ? Math.round(((product.hargaPembanding - product.harga) / product.hargaPembanding) * 100)
      : 0;

  const formattedKg = product.estimasiKgTerselamatkan.toLocaleString('id-ID', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

  const handleCardClick = () => {
    navigate(`/produk/${product.id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className={`group relative bg-white rounded-2xl sm:rounded-3xl border border-[#E8E8ED] overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-0.5 hover:border-[#2E7D4F]/30 shadow-none hover:shadow-xs cursor-pointer ${className}`}
    >
      {/* Product Image Slot */}
      <div className="relative w-full overflow-hidden bg-[#F5F5F7]">
        <SmartImage
          src={product.gambar}
          alt={product.nama}
          fallbackEmoji={product.gambarEmojiFallback}
          aspectRatio="4:3"
          hoverZoom={true}
          containerClassName="w-full"
        />

        {/* Saved Food Tag */}
        <div className="absolute top-3 left-3 z-10">
          <span className="inline-flex items-center gap-1 bg-white/95 backdrop-blur-sm text-[#2E7D4F] text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-xs border border-[#2E7D4F]/15">
            <Sparkles className="w-3 h-3 text-[#2E7D4F]" />
            <span>{formattedKg} kg terselamatkan</span>
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Weight Metadata */}
          <div className="flex items-center justify-between text-xs text-[#6E6E73] mb-1.5">
            <span className="uppercase tracking-wider font-medium text-[11px]">
              {product.kategori}
            </span>
            <span>{product.ukuran}</span>
          </div>

          {/* Product Title */}
          <h3 className="font-semibold text-base sm:text-lg text-[#1D1D1F] group-hover:text-[#2E7D4F] transition-colors line-clamp-1">
            {product.nama}
          </h3>

          {/* Short description */}
          <p className="mt-1 text-xs sm:text-sm text-[#6E6E73] line-clamp-2 leading-relaxed">
            {product.deskripsiSingkat}
          </p>

          {/* Main Ingredient Origin Note */}
          <div className="mt-3 pt-3 border-t border-[#E8E8ED]/70 flex items-center gap-1.5 text-xs text-[#1D1D1F]/80">
            <span className="text-[#6E6E73]">Dari:</span>
            <span className="font-medium text-[#2E7D4F] bg-[#EBF4EE] px-2 py-0.5 rounded-full text-[11px]">
              {product.bahanUtama}
            </span>
          </div>
        </div>

        {/* Price & Action */}
        <div className="mt-5 pt-3 flex items-center justify-between gap-2">
          <div>
            <span className="text-[11px] text-[#6E6E73] block mb-0.5">Harga</span>
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="font-bold text-base sm:text-lg text-[#1D1D1F] tabular-nums tracking-tight">
                {formattedPrice}
              </span>
              {formattedOriginalPrice && (
                <span className="text-xs text-[#8E8E93] line-through tabular-nums">
                  {formattedOriginalPrice}
                </span>
              )}
            </div>
            {diskonPersen > 0 && (
              <span className="inline-block text-[10px] font-bold text-[#2E7D4F] bg-[#EBF4EE] px-1.5 py-0.5 rounded-md mt-0.5">
                Hemat {diskonPersen}%
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              to={`/produk/${product.id}`}
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#2E7D4F] hover:text-[#256640] px-3 py-1.5 rounded-full bg-[#EBF4EE] hover:bg-[#E0EFE5] transition-colors"
            >
              <span>Detail</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
