import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { AdminPlaceholderView } from '../../../components/internal/AdminPlaceholderView';

export const AdminOrdersPage: React.FC = () => {
  return (
    <AdminPlaceholderView
      title="Daftar Pesanan Pembeli"
      description="Pantau seluruh transaksi pembeli yang masuk: pesanan baru yang butuh konfirmasi pembayaran, pengemasan, hingga pesanan selesai."
      icon={ShoppingCart}
      features={[
        'Filter status pesanan (Baru, Diproses, Dikirim, Selesai)',
        'Cetak label pengiriman dan faktur pesanan belanja',
        'Pelacakan total pendapatan dan riwayat pembayaran pelanggan',
      ]}
    />
  );
};
