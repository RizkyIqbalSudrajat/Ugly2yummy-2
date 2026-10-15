import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStaffAuth } from '../../../context/StaffAuthContext';
import { useWorkerData } from '../../../context/WorkerDataContext';
import { SmartImage } from '../../../components/ui/SmartImage';
import {
  PackageCheck,
  ShieldCheck,
  ChefHat,
  Boxes,
  ListTodo,
  ArrowRight,
  Plus,
  Clock,
  Sparkles,
  Calendar,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Truck,
  Timer,
} from 'lucide-react';

export const WorkerOverviewPage: React.FC = () => {
  const { staff } = useStaffAuth();
  const { stats, tasks, receivings, batches, updateTaskStatus } = useWorkerData();
  const navigate = useNavigate();

  // Tanggal Hari Ini yang Elegan
  const todayFormatted = 'Rabu, 14 Oktober 2026';

  // 3-4 Tugas Belum Selesai Prioritas
  const activeTasks = tasks
    .filter((t) => t.status !== 'Selesai')
    .slice(0, 4);

  // Antrean Seleksi (status: Menunggu Diseleksi)
  const pendingReceivings = receivings
    .filter((r) => r.status === 'Menunggu Diseleksi')
    .slice(0, 4);

  // Batch Berjalan (Sedang Diolah atau Sedang Dikemas)
  const activeBatches = batches
    .filter((b) => b.status === 'Sedang Diolah' || b.status === 'Sedang Dikemas');

  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case 'Tinggi':
        return 'bg-red-50 text-red-700 border-red-200/80';
      case 'Sedang':
        return 'bg-amber-50 text-amber-700 border-amber-200/80';
      default:
        return 'bg-[#F5F5F7] text-[#6E6E73] border-[#E8E8ED]';
    }
  };

  const getBatchBadgeClass = (status: string) => {
    switch (status) {
      case 'Sedang Diolah':
        return 'bg-[#EBF4EE] text-[#2E7D4F] border-[#2E7D4F]/20';
      case 'Sedang Dikemas':
        return 'bg-blue-50 text-blue-700 border-blue-200/80';
      default:
        return 'bg-[#F5F5F7] text-[#1D1D1F] border-[#E8E8ED]';
    }
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-200">
      {/* Header Halaman & Tombol Aksi Cepat */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#EBF4EE] text-[#2E7D4F] border border-[#2E7D4F]/20">
              Dapur Produksi
            </span>
            <span className="text-xs text-[#6E6E73] flex items-center gap-1">
              <Calendar className="w-3 h-3 text-[#6E6E73]" />
              {todayFormatted}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1D1D1F]">
            Halo, {staff?.nama?.split(' ')[0] || 'Dewi'} 👋
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[#6E6E73] max-w-xl">
            Semua alur kerja mulai dari penerimaan bahan mentah, kontrol kualitas, hingga pengolahan batch aktif di satu layar.
          </p>
        </div>

        {/* Tombol Aksi Cepat */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => navigate('/internal/pekerja/penerimaan?tambah=true')}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#2E7D4F] hover:bg-[#256640] text-white text-xs sm:text-sm font-semibold transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Catat Bahan Masuk</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/internal/pekerja/produksi')}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white hover:bg-[#F5F5F7] text-[#1D1D1F] border border-[#E8E8ED] text-xs sm:text-sm font-semibold transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <ChefHat className="w-4 h-4 text-[#2E7D4F]" />
            <span>Mulai Produksi</span>
          </button>
        </div>
      </div>

      {/* 4 Kartu Statistik */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Stat 1: Menunggu Diseleksi */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#E8E8ED] p-4 sm:p-5 relative overflow-hidden group hover:border-[#2E7D4F]/40 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#6E6E73]">Menunggu Diseleksi</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200/50">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1D1D1F]">
              {stats.menungguDiseleksiCount}
            </span>
            <span className="text-xs text-[#6E6E73] font-medium">kiriman</span>
          </div>
          <p className="mt-1 text-[11px] text-[#6E6E73]">Perlu inspeksi mutu di meja QC</p>
        </div>

        {/* Stat 2: Stok Bahan Layak */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#E8E8ED] p-4 sm:p-5 relative overflow-hidden group hover:border-[#2E7D4F]/40 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#6E6E73]">Stok Bahan Layak</span>
            <div className="w-8 h-8 rounded-xl bg-[#EBF4EE] text-[#2E7D4F] flex items-center justify-center border border-[#2E7D4F]/20">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#2E7D4F]">
              {stats.stokBahanLayakKg}
            </span>
            <span className="text-xs text-[#6E6E73] font-medium">kg siap olah</span>
          </div>
          <p className="mt-1 text-[11px] text-[#6E6E73]">Hasil sortir siap masuk produksi</p>
        </div>

        {/* Stat 3: Batch Sedang Berjalan */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#E8E8ED] p-4 sm:p-5 relative overflow-hidden group hover:border-[#2E7D4F]/40 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#6E6E73]">Batch Berjalan</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200/50">
              <ChefHat className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1D1D1F]">
              {stats.batchBerjalanCount}
            </span>
            <span className="text-xs text-[#6E6E73] font-medium">batch aktif</span>
          </div>
          <p className="mt-1 text-[11px] text-[#6E6E73]">Sedang diolah & dikemas</p>
        </div>

        {/* Stat 4: Siap Dijual Hari Ini */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#E8E8ED] p-4 sm:p-5 relative overflow-hidden group hover:border-[#2E7D4F]/40 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#6E6E73]">Siap Dijual Hari Ini</span>
            <div className="w-8 h-8 rounded-xl bg-[#EBF4EE] text-[#2E7D4F] flex items-center justify-center border border-[#2E7D4F]/20">
              <PackageCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1D1D1F]">
              {stats.siapDijualHariIniCount}
            </span>
            <span className="text-xs text-[#6E6E73] font-medium">unit produk</span>
          </div>
          <p className="mt-1 text-[11px] text-[#6E6E73]">Telah lolos inspeksi kemasan</p>
        </div>
      </div>

      {/* Grid 2 Kolom: Tugas Hari Ini & Antrean Seleksi */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Kolom Kiri: Tugas Hari Ini (7 Kolom) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-[#E8E8ED] p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E8E8ED]">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#EBF4EE] text-[#2E7D4F] flex items-center justify-center">
                <ListTodo className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-[#1D1D1F]">Tugas Hari Ini</h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#F5F5F7] text-[#6E6E73] font-medium border border-[#E8E8ED]">
                {activeTasks.length} Tertunda
              </span>
            </div>
            <Link
              to="/internal/pekerja/tugas"
              className="text-xs font-semibold text-[#2E7D4F] hover:text-[#256640] flex items-center gap-1 transition-colors"
            >
              <span>Lihat semua</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {activeTasks.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#6E6E73]">
                Semua tugas hari ini telah diselesaikan. Hebat! 🎉
              </div>
            ) : (
              activeTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-3.5 rounded-2xl bg-[#FBFBFD] hover:bg-[#F5F5F7] border border-[#E8E8ED] transition-all flex items-start gap-3 group"
                >
                  <button
                    type="button"
                    onClick={() => updateTaskStatus(task.id, 'Selesai')}
                    className="mt-0.5 w-5 h-5 rounded-lg border border-[#E8E8ED] bg-white group-hover:border-[#2E7D4F] flex items-center justify-center text-transparent hover:text-[#2E7D4F] transition-colors cursor-pointer shrink-0"
                    title="Tandai selesai"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getPriorityBadgeClass(
                          task.prioritas
                        )}`}
                      >
                        {task.prioritas}
                      </span>
                      <h3 className="text-xs sm:text-sm font-semibold text-[#1D1D1F] truncate">
                        {task.judul}
                      </h3>
                    </div>
                    <p className="text-[11px] text-[#6E6E73] line-clamp-1">{task.deskripsi}</p>
                    <div className="mt-2 flex items-center gap-3 text-[10px] text-[#6E6E73]">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#6E6E73]" />
                        {task.tenggat}
                      </span>
                      {task.terkait && (
                        <span className="px-1.5 py-0.5 rounded-md bg-white border border-[#E8E8ED] text-[10px]">
                          Terkait: {task.terkait}
                        </span>
                      )}
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-medium px-2 py-0.5 rounded-md shrink-0 ${
                      task.status === 'Sedang Dikerjakan'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200/60'
                        : 'bg-[#F5F5F7] text-[#6E6E73]'
                    }`}
                  >
                    {task.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Kolom Kanan: Antrean Seleksi Bahan (5 Kolom) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-[#E8E8ED] p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E8E8ED]">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-[#1D1D1F]">Antrean Seleksi</h2>
            </div>
            <Link
              to="/internal/pekerja/penerimaan"
              className="text-xs font-semibold text-[#2E7D4F] hover:text-[#256640] flex items-center gap-1 transition-colors"
            >
              <span>Semua kiriman</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {pendingReceivings.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#6E6E73]">
                Tidak ada antrean bahan yang menunggu seleksi saat ini.
              </div>
            ) : (
              pendingReceivings.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-2xl bg-[#FBFBFD] border border-[#E8E8ED] flex items-center justify-between gap-3 hover:border-[#2E7D4F]/30 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#F5F5F7] border border-[#E8E8ED] shrink-0">
                      <SmartImage
                        src={item.foto}
                        alt={item.namaBahan}
                        fallbackEmoji="🌱"
                        aspectRatio="1:1"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#1D1D1F] truncate">{item.namaBahan}</p>
                      <p className="text-[11px] text-[#2E7D4F] font-semibold">{item.beratAwal} kg</p>
                      <p className="text-[10px] text-[#6E6E73] truncate">{item.supplierAsal.split('(')[0]}</p>
                    </div>
                  </div>

                  <Link
                    to={`/internal/pekerja/seleksi?trmId=${item.id}`}
                    className="px-3 py-1.5 rounded-full bg-[#EBF4EE] hover:bg-[#2E7D4F] text-[#2E7D4F] hover:text-white border border-[#2E7D4F]/20 text-xs font-semibold transition-all shrink-0 cursor-pointer"
                  >
                    Seleksi
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Bagian Bawah: Produksi Berjalan */}
      <div className="bg-white rounded-3xl border border-[#E8E8ED] p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E8E8ED]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#EBF4EE] text-[#2E7D4F] flex items-center justify-center">
              <ChefHat className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1D1D1F]">Produksi Berjalan</h2>
              <p className="text-xs text-[#6E6E73]">Batch aktif yang sedang diolah atau dikemas di dapur</p>
            </div>
          </div>
          <Link
            to="/internal/pekerja/produksi"
            className="text-xs font-semibold text-[#2E7D4F] hover:text-[#256640] flex items-center gap-1 transition-colors"
          >
            <span>Buka modul produksi</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {activeBatches.map((batch) => {
            const progressPercent = Math.min(
              100,
              Math.round((batch.hasilBerhasil / batch.targetHasil) * 100)
            );

            return (
              <div
                key={batch.id}
                className="p-4 rounded-2xl bg-[#FBFBFD] border border-[#E8E8ED] space-y-3 hover:border-[#2E7D4F]/30 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono font-medium text-[#6E6E73] bg-white px-2 py-0.5 rounded-md border border-[#E8E8ED]">
                      {batch.id}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getBatchBadgeClass(
                        batch.status
                      )}`}
                    >
                      {batch.status}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-[#1D1D1F] line-clamp-1">{batch.produk}</h3>
                  <p className="text-[11px] text-[#6E6E73] mt-0.5">
                    Bahan: <strong className="text-[#1D1D1F]">{batch.bahan}</strong> ({batch.bahanDipakai} kg)
                  </p>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-[#E8E8ED]/70">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#6E6E73]">Target Produksi:</span>
                    <span className="font-semibold text-[#1D1D1F]">
                      {batch.hasilBerhasil} / {batch.targetHasil} {batch.satuan}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-[#E8E8ED] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#2E7D4F] rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-[#6E6E73]">
                    <span>Mulai: {batch.tanggalMulai}</span>
                    <span>{progressPercent}% target</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
