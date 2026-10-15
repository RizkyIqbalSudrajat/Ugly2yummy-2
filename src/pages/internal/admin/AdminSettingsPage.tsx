import React from 'react';
import { Settings } from 'lucide-react';
import { AdminPlaceholderView } from '../../../components/internal/AdminPlaceholderView';

export const AdminSettingsPage: React.FC = () => {
  return (
    <AdminPlaceholderView
      title="Pengaturan Sistem"
      description="Konfigurasi parameter operasional toko, ambang batas peringatan stok menipis, jam kerja dapur penerimaan bahan, dan integrasi pengiriman."
      icon={Settings}
      features={[
        'Pengaturan profil operasional dan kontak darurat',
        'Parameter toleransi susut QC bahan (persentase)',
        'Konfigurasi notifikasi email dan WhatsApp internal',
      ]}
    />
  );
};
