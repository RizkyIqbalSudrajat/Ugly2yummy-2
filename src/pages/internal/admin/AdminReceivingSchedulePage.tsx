import React from 'react';
import { Calendar } from 'lucide-react';
import { AdminPlaceholderView } from '../../../components/internal/AdminPlaceholderView';

export const AdminReceivingSchedulePage: React.FC = () => {
  return (
    <AdminPlaceholderView
      title="Jadwal Penerimaan"
      description="Kalender logistik dan timeline rencana bongkar muatan bahan baku dari supplier mitra di fasilitas dapur pengolahan Ugly2Yummy."
      icon={Calendar}
      features={[
        'Kalender kedatangan armada pengangkut bahan pangan',
        'Alokasi ruang pendingin dan tim penerima staf dapur',
        'Sinkronisasi langsung dengan modul Penerimaan Staf Pekerja',
      ]}
    />
  );
};
