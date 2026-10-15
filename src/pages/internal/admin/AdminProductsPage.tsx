import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Plus } from 'lucide-react';
import { AdminPlaceholderView } from '../../../components/internal/AdminPlaceholderView';

export const AdminProductsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Link
          to="/internal/admin/produk/baru"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#2E7D4F] hover:bg-[#256640] text-white text-xs sm:text-sm font-semibold transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Produk Baru</span>
        </Link>
      </div>

      <AdminPlaceholderView
        title="Katalog Produk Olahan"
        description="Kelola seluruh produk olahan hasil penyelamatan buah dan sayur: harga jual, deskripsi nutrisi, stok siap kirim, dan status publikasi di katalog pembeli."
        icon={ShoppingBag}
        features={[
          'Manajemen harga normal vs harga diskon/promo',
          'Atur status stok (Tersedia, Terbatas, Habis)',
          'Tautkan produk ke batch produksi dapur internal',
        ]}
      />
    </div>
  );
};
