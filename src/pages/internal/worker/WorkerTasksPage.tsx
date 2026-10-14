import React from 'react';
import { useStaffAuth } from '../../../context/StaffAuthContext';
import { ListTodo, Sparkles, Clock, CheckCircle2 } from 'lucide-react';

export const WorkerTasksPage: React.FC = () => {
  const { pendingTasksCount } = useStaffAuth();

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Halaman */}
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#EBF4EE] text-[#2E7D4F] border border-[#2E7D4F]/20">
            Daftar Penugasan
          </span>
          <span className="text-xs text-[#6E6E73]">· {pendingTasksCount} Tugas Menunggu</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1D1D1F]">
          Tugas Saya
        </h1>
        <p className="mt-1 text-sm text-[#6E6E73] max-w-xl">
          Daftar instruksi kerja prioritas, checklist sanitasi dapur, dan tugas produksi yang ditugaskan kepada Anda.
        </p>
      </div>

      {/* Placeholder Card */}
      <div className="bg-white rounded-3xl border border-[#E8E8ED] p-8 sm:p-10 text-center shadow-none relative overflow-hidden">
        <div className="w-14 h-14 rounded-2xl bg-[#EBF4EE] border border-[#2E7D4F]/20 text-[#2E7D4F] flex items-center justify-center mx-auto mb-5 shadow-xs">
          <ListTodo className="w-7 h-7 stroke-[1.75]" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5F5F7] text-[#6E6E73] text-xs font-medium border border-[#E8E8ED] mb-3">
          <Sparkles className="w-3 h-3 text-[#2E7D4F]" />
          <span>Fase Fondasi</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1D1D1F] mb-2">
          Modul Tugas Saya Segera Hadir
        </h2>

        <p className="text-sm text-[#6E6E73] max-w-md mx-auto leading-relaxed mb-6">
          Checklist interaktif dengan kemampuan menandai status selesai, upload foto bukti kerja, dan pengingat waktu giliran shift dapur.
        </p>

        <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#FBFBFD] border border-[#E8E8ED] text-xs text-[#6E6E73]">
          <Clock className="w-3.5 h-3.5 text-[#2E7D4F]" />
          <span>Sedang dikembangkan untuk tahap berikutnya</span>
        </div>
      </div>
    </div>
  );
};
