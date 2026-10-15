import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { FileText, ArrowLeft } from 'lucide-react';
import { AdminPlaceholderView } from '../../../components/internal/AdminPlaceholderView';

export const AdminSupplierOfferDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="space-y-4">
      <Link
        to="/internal/admin/penawaran"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6E6E73] hover:text-[#1D1D1F] transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Kembali ke Daftar Penawaran</span>
      </Link>

      <AdminPlaceholderView
        title={`Detail Penawaran: ${id || 'N/A'}`}
        description="Pemeriksaan mendalam dokumen penawaran bahan dari supplier, riwayat komunikasi, dan persetujuan jadwal penerimaan di gudang."
        icon={FileText}
        badge="Detail Penawaran"
        features={[
          'Rincian tonase, jenis kecacatan fisik, dan foto riil',
          'Penetapan jadwal kedatangan bahan ke dapur Ugly2Yummy',
          'Integrasi otomatis ke modul Jadwal Penerimaan',
        ]}
      />
    </div>
  );
};
