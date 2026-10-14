import React from 'react';
import { ChefHat, Sparkles, Clock } from 'lucide-react';

export const WorkerProductionPage: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Halaman */}
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#EBF4EE] text-[#2E7D4F] border border-[#2E7D4F]/20">
            Dapur Aktif
          </span>
          <span className="text-xs text-[#6E6E73]">· Pengolahan & Memasak</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1D1D1F]">
          Produksi
        </h1>
        <p className="mt-1 text-sm text-[#6E6E73] max-w-xl">
          Alur proses memasak, instruksi kerja batch harian, dan pencatatan parameter suhu & waktu olahan.
        </p>
      </div>

      {/* Placeholder Card */}
      <div className="bg-white rounded-3xl border border-[#E8E8ED] p-8 sm:p-10 text-center shadow-none relative overflow-hidden">
        <div className="w-14 h-14 rounded-2xl bg-[#EBF4EE] border border-[#2E7D4F]/20 text-[#2E7D4F] flex items-center justify-center mx-auto mb-5 shadow-xs">
          <ChefHat className="w-7 h-7 stroke-[1.75]" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5F5F7] text-[#6E6E73] text-xs font-medium border border-[#E8E8ED] mb-3">
          <Sparkles className="w-3 h-3 text-[#2E7D4F]" />
          <span>Fase Fondasi</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1D1D1F] mb-2">
          Modul Dapur Produksi Segera Hadir
        </h2>

        <p className="text-sm text-[#6E6E73] max-w-md mx-auto leading-relaxed mb-6">
          Timer batch otomatis, lembar kontrol Standar Operasional Prosedur (SOP) pengolahan, dan pencatatan nomor batch produk sebelum pengemasan.
        </p>

        <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#FBFBFD] border border-[#E8E8ED] text-xs text-[#6E6E73]">
          <Clock className="w-3.5 h-3.5 text-[#2E7D4F]" />
          <span>Sedang dikembangkan untuk tahap berikutnya</span>
        </div>
      </div>
    </div>
  );
};
