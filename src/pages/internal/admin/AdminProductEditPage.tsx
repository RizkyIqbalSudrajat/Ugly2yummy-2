import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAdminData } from '../../../context/AdminDataContext';
import { AdminProductForm } from '../../../components/internal/AdminProductForm';
import { ArrowLeft, AlertCircle } from 'lucide-react';

export const AdminProductEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { products } = useAdminData();

  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="bg-white rounded-3xl border border-[#E8E8ED] p-12 text-center max-w-lg mx-auto space-y-4 shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-[#F5F5F7] border border-[#E8E8ED] flex items-center justify-center mx-auto text-[#6E6E73]">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-[#1D1D1F]">Produk Tidak Ditemukan</h2>
        <p className="text-xs sm:text-sm text-[#6E6E73]">
          Produk dengan ID "{id}" tidak ditemukan dalam sistem katalog produk admin.
        </p>
        <Link
          to="/internal/admin/produk"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1D1D1F] text-white text-xs font-semibold hover:bg-[#2E7D4F] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Katalog Produk</span>
        </Link>
      </div>
    );
  }

  return <AdminProductForm initialProduct={product} isEdit={true} />;
};
