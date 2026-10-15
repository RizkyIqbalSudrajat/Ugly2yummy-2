import React from 'react';
import { BarChart3 } from 'lucide-react';
import { AdminPlaceholderView } from '../../../components/internal/AdminPlaceholderView';

export const AdminReportsPage: React.FC = () => {
  return (
    <AdminPlaceholderView
      title="Laporan & Analitik"
      description="Laporan dampak penyelamatan pangan, konversi bahan baku ke produk olahan, pendapatan bersih, dan audit jejak karbon Ugly2Yummy."
      icon={BarChart3}
      features={[
        'Total kilogram bahan pangan imperfect terselamatkan dari TPA',
        'Efisiensi produksi dan rasio susut per kelompok komoditas',
        'Ekspor ringkasan laporan operasional dan finansial',
      ]}
    />
  );
};
