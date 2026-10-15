import React from 'react';
import { ListTodo } from 'lucide-react';
import { AdminPlaceholderView } from '../../../components/internal/AdminPlaceholderView';

export const AdminWorkerTasksPage: React.FC = () => {
  return (
    <AdminPlaceholderView
      title="Tugas Pekerja"
      description="Manajemen penugasan operasional kerja harian untuk tim staf dapur: sortir QC bahan masuk, pembersihan, pengolahan batch, dan pengemasan."
      icon={ListTodo}
      features={[
        'Buat dan delegasikan tugas langsung ke akun staf pekerja',
        'Pantau status pengerjaan (Belum, Sedang, Selesai) secara live',
        'Penetapan tingkat prioritas dan tenggat waktu kerja',
      ]}
    />
  );
};
