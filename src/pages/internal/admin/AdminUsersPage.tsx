import React from 'react';
import { Users } from 'lucide-react';
import { AdminPlaceholderView } from '../../../components/internal/AdminPlaceholderView';

export const AdminUsersPage: React.FC = () => {
  return (
    <AdminPlaceholderView
      title="Manajemen Pengguna"
      description="Manajemen akun dan hak akses portal internal: staf admin operasional, staf pekerja dapur, serta akun mitra petani/supplier terdaftar."
      icon={Users}
      features={[
        'Daftar akun staf pekerja dan penugasan lokasi dapur',
        'Verifikasi akun mitra tani yang baru mendaftar',
        'Atur status aktif/nonaktif dan reset kata sandi akun',
      ]}
    />
  );
};
