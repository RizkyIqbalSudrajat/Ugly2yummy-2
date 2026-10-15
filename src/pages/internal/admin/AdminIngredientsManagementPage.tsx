import React from 'react';
import { Package } from 'lucide-react';
import { AdminPlaceholderView } from '../../../components/internal/AdminPlaceholderView';

export const AdminIngredientsManagementPage: React.FC = () => {
  return (
    <AdminPlaceholderView
      title="Manajemen Bahan"
      description="Audit inventaris bahan baku segar, monitoring susut bobot saat penyimpanan, alokasi bahan layak olah, serta pelacakan residu kompos."
      icon={Package}
      features={[
        'Inventaris stok bahan layak per varietas (kg)',
        'Riwayat penyusutan dan penyesuaian stok bahan',
        'Analisis persentase bahan layak vs kompos per komoditas',
      ]}
    />
  );
};
