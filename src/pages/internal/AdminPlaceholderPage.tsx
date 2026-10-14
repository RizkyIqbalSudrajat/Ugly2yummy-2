import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStaffAuth } from '../../context/StaffAuthContext';
import { Button } from '../../components/ui/Button';
import { Container } from '../../components/ui/Container';
import {
  ShieldCheck,
  LogOut,
  Sparkles,
  ClipboardCheck,
  BarChart3,
  Users2,
  HardHat,
  ArrowRight,
} from 'lucide-react';

export const AdminPlaceholderPage: React.FC = () => {
  const { staff, logoutStaff, loginStaff } = useStaffAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutStaff();
    navigate('/internal/masuk');
  };

  const handleSwitchToWorker = () => {
    loginStaff('pekerja');
    navigate('/internal/pekerja/ringkasan');
  };

  return (
    <div className="min-h-screen bg-[#FBFBFD] flex flex-col justify-center py-12 px-4 selection:bg-[#2E7D4F]/20 selection:text-[#2E7D4F]">
      <Container size="narrow">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Header Bar */}
          <div className="flex items-center justify-between pb-4 border-b border-[#E8E8ED]">
            <div className="flex items-center gap-2 select-none">
              <span className="text-xl font-bold tracking-tight text-[#1D1D1F]">
                Ugly<span className="text-[#2E7D4F] font-extrabold">2</span>Yummy
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 bg-[#EBF4EE] text-[#2E7D4F] rounded-full border border-[#2E7D4F]/20">
                Portal Admin
              </span>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-full transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar</span>
            </button>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-3xl border border-[#E8E8ED] p-8 sm:p-12 text-center shadow-none relative overflow-hidden">
            {/* Soft background glow */}
            <div className="absolute top-0 right-1/2 translate-x-1/2 w-64 h-64 bg-[#2E7D4F]/5 rounded-full blur-3xl pointer-events-none" />

            {/* Central Icon */}
            <div className="relative z-10 w-16 h-16 rounded-2xl bg-[#EBF4EE] border border-[#2E7D4F]/20 text-[#2E7D4F] flex items-center justify-center mx-auto mb-6 shadow-xs">
              <ShieldCheck className="w-8 h-8 stroke-[1.75]" />
            </div>

            {/* Badge & Title */}
            <div className="relative z-10 space-y-2 mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5F5F7] text-[#6E6E73] text-xs font-medium border border-[#E8E8ED]">
                <Sparkles className="w-3 h-3 text-[#2E7D4F]" />
                Fase Perencanaan & Integrasi
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1D1D1F]">
                Portal Admin Segera Hadir
              </h1>
              <p className="text-sm text-[#6E6E73] max-w-lg mx-auto leading-relaxed">
                Modul administrasi operasional terpadu sedang disiapkan untuk menghubungkan data penawaran mitra tani, alur dapur produksi, dan laporan audit pangan.
              </p>
            </div>

            {/* Staff Profile Pill */}
            <div className="relative z-10 inline-flex items-center gap-3 p-2.5 pr-4 rounded-2xl bg-[#F5F5F7] border border-[#E8E8ED] text-left mb-8 max-w-md">
              <div className="w-10 h-10 rounded-full bg-[#2E7D4F] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                {staff?.inisial || 'RP'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-[#1D1D1F] truncate">
                  {staff?.nama || 'Raka Pratama'}
                </p>
                <p className="text-[11px] text-[#6E6E73] truncate">
                  {staff?.jabatan || 'Admin Operasional'} · {staff?.lokasi || 'Kantor Operasional Ugly2Yummy, Bandung'}
                </p>
              </div>
            </div>

            {/* Feature Teasers */}
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-3 text-left mb-8">
              <div className="p-4 rounded-2xl bg-[#FBFBFD] border border-[#E8E8ED]">
                <ClipboardCheck className="w-4 h-4 text-[#2E7D4F] mb-2" />
                <h4 className="text-xs font-bold text-[#1D1D1F]">Kurasi Penawaran</h4>
                <p className="text-[11px] text-[#6E6E73] mt-1 leading-normal">
                  Verifikasi & penetapan jadwal serah terima bahan dari supplier.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FBFBFD] border border-[#E8E8ED]">
                <BarChart3 className="w-4 h-4 text-[#2E7D4F] mb-2" />
                <h4 className="text-xs font-bold text-[#1D1D1F]">Metrik Produksi</h4>
                <p className="text-[11px] text-[#6E6E73] mt-1 leading-normal">
                  Audit susut bahan, efisiensi konversi yield, dan batch release.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FBFBFD] border border-[#E8E8ED]">
                <Users2 className="w-4 h-4 text-[#2E7D4F] mb-2" />
                <h4 className="text-xs font-bold text-[#1D1D1F]">Alokasi Tugas</h4>
                <p className="text-[11px] text-[#6E6E73] mt-1 leading-normal">
                  Delegasi kerja harian dan pantauan performa tim dapur.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                variant="secondary"
                size="md"
                onClick={handleSwitchToWorker}
                icon={<HardHat className="w-4 h-4 text-[#2E7D4F]" />}
              >
                Coba Beralih ke Portal Pekerja
              </Button>

              <Button
                variant="outline"
                size="md"
                onClick={handleLogout}
                icon={<LogOut className="w-4 h-4" />}
              >
                Keluar dari Sesi
              </Button>
            </div>
          </div>

          {/* Footer note */}
          <div className="text-center text-[11px] text-[#6E6E73]">
            Sistem Internal Ugly2Yummy · Dikelola oleh Tim Operasional Bandung
          </div>
        </div>
      </Container>
    </div>
  );
};
