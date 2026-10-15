import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft } from 'lucide-react';
import { AdminPlaceholderView } from '../../../components/internal/AdminPlaceholderView';

export const AdminProductEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="space-y-4">
      <Link
        to="/internal/admin/produk"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6E6E73] hover:text-[#1D1D1F] transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Kembali ke Katalog Produk</span>
      </Link>

      <AdminPlaceholderView
        title={`Edit Produk: ${id || 'N/A'}`}
        description="Perbarui informasi rincian produk olahan, ubah harga jual, status diskon, stok tersedia, atau arsipkan produk dari katalog pembeli."
        icon={ShoppingBag}
        badge="Edit Produk"
        features={[
          'Perubahan harga dan promo diskon kilat',
          'Penyesuaian stok aman dan batas peringatan stok menipis',
          'Pengaturan deskripsi, komposisi, dan tanggal kedaluwarsa',
        ]}
      />
    </div>
  );
};
