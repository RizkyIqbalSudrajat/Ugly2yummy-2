import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import { AdminPlaceholderView } from '../../../components/internal/AdminPlaceholderView';

export const AdminOrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="space-y-4">
      <Link
        to="/internal/admin/pesanan"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6E6E73] hover:text-[#1D1D1F] transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Kembali ke Daftar Pesanan</span>
      </Link>

      <AdminPlaceholderView
        title={`Detail Pesanan: ${id || 'N/A'}`}
        description="Rincian lengkap item belanja pembeli, total pembayaran, alamat pengantaran, metode pembayaran, dan riwayat status pengiriman."
        icon={ShoppingCart}
        badge="Detail Pesanan"
        features={[
          'Daftar item belanja dan rincian kuantitas',
          'Alamat penerima dan nomor kontak WhatsApp pelanggan',
          'Ubah status pesanan ke Dikirim dengan nomor resi',
        ]}
      />
    </div>
  );
};
