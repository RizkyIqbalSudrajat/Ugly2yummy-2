import React from 'react';
import { FileText } from 'lucide-react';
import { AdminPlaceholderView } from '../../../components/internal/AdminPlaceholderView';

export const AdminSupplierOffersPage: React.FC = () => {
  return (
    <AdminPlaceholderView
      title="Penawaran Supplier"
      description="Daftar pengajuan pasokan komoditas buah dan sayur tidak sempurna dari mitra petani, kelompok tani, dan distributor bahan pangan."
      icon={FileText}
      features={[
        'Tabel kurasi penawaran bahan masuk',
        'Validasi kuota, harga penawaran, dan foto kondisi komoditas',
        'Aksi Terima Penawaran, Nego Harga, atau Tolak',
      ]}
    />
  );
};
