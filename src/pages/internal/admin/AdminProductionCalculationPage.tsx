import React from 'react';
import { Calculator } from 'lucide-react';
import { AdminPlaceholderView } from '../../../components/internal/AdminPlaceholderView';

export const AdminProductionCalculationPage: React.FC = () => {
  return (
    <AdminPlaceholderView
      title="Kalkulasi Produksi"
      description="Simulasi resep konversi bahan baku menjadi produk jadi bernilai tambah tinggi, proyeksi biaya produksi, dan estimasi hasil batch."
      icon={Calculator}
      features={[
        'Simulasi rasio konversi bahan ke produk siap jual',
        'Optimasi batch berdasarkan ketersediaan stok bahan layak',
        'Analisis margin keuntungan dan efisiensi olahan',
      ]}
    />
  );
};
