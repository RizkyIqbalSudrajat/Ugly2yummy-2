import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft } from 'lucide-react';
import { AdminPlaceholderView } from '../../../components/internal/AdminPlaceholderView';

export const AdminProductCreatePage: React.FC = () => {
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
        title="Tambah Produk Baru"
        description="Formulir pembuatan produk olahan baru untuk ditambahkan ke etalase toko Ugly2Yummy, lengkap dengan pemilihan bahan baku asal dan foto produk."
        icon={ShoppingBag}
        badge="Formulir Produk"
        features={[
          'Upload foto produk dan informasi nilai gizi',
          'Penetapan harga, berat kemasan, dan kategori olahan',
          'Otomatis terhubung dengan alur batch produksi dapur',
        ]}
      />
    </div>
  );
};
