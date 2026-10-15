import React from 'react';
import { Bell } from 'lucide-react';
import { AdminPlaceholderView } from '../../../components/internal/AdminPlaceholderView';

export const AdminNotificationsPage: React.FC = () => {
  return (
    <AdminPlaceholderView
      title="Notifikasi Admin"
      description="Pusat pemberitahuan dan log aktivitas penting seputar persetujuan penawaran supplier, pesanan baru pelanggan, peringatan stok menipis, dan penyelesaian tugas tim dapur."
      icon={Bell}
      features={[
        'Filter notifikasi belum dibaca vs semua aktivitas',
        'Pemberitahuan instan saat mitra tani mengajukan bahan',
        'Tautan langsung ke modul penanganan terkait',
      ]}
    />
  );
};
