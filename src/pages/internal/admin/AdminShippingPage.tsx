import React from 'react';
import { Truck } from 'lucide-react';
import { AdminPlaceholderView } from '../../../components/internal/AdminPlaceholderView';

export const AdminShippingPage: React.FC = () => {
  return (
    <AdminPlaceholderView
      title="Pengiriman & Logistik"
      description="Koordinasi kurir logistik penjemputan paket produk olahan, status resi kurir (JNE, SiCepat, Gosend), dan pengawasan batas waktu pengiriman."
      icon={Truck}
      features={[
        'Daftar paket siap di-pickup oleh kurir ekspedisi',
        'Update nomor resi otomatis ke status pesanan pembeli',
        'Laporan ketepatan waktu pengiriman barang',
      ]}
    />
  );
};
