import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useWorkerData } from '../../../context/WorkerDataContext';
import { WorkerTask, TaskPriority, TaskStatus } from '../../../types/worker';
import {
  ListTodo,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Filter,
  ArrowUpDown,
  Search,
  ExternalLink,
  User,
  Sparkles,
  Calendar,
} from 'lucide-react';

const PRIORITY_ORDER: Record<TaskPriority, number> = {
  Tinggi: 1,
  Sedang: 2,
  Rendah: 3,
};

export const WorkerTasksPage: React.FC = () => {
  const { tasks, updateTaskStatus } = useWorkerData();

  // Mobile Active Tab
  const [mobileTab, setMobileTab] = useState<TaskStatus>('Belum Dikerjakan');

  // Filters
  const [priorityFilter, setPriorityFilter] = useState<'Semua' | TaskPriority>('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'tenggat' | 'prioritas'>('tenggat');

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    updateTaskStatus(taskId, newStatus);
    setToastMessage(`Status tugas diperbarui menjadi "${newStatus}"`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filter & Sort Tasks
  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        const matchPriority = priorityFilter === 'Semua' || task.prioritas === priorityFilter;
        const matchSearch =
          task.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.deskripsi.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (task.terkait && task.terkait.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchPriority && matchSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'prioritas') {
          return PRIORITY_ORDER[a.prioritas] - PRIORITY_ORDER[b.prioritas];
        }
        // default tenggat
        return a.tenggat.localeCompare(b.tenggat);
      });
  }, [tasks, priorityFilter, searchQuery, sortBy]);

  // Group by Column
  const belumDikerjakan = useMemo(
    () => filteredTasks.filter((t) => t.status === 'Belum Dikerjakan'),
    [filteredTasks]
  );
  const sedangDikerjakan = useMemo(
    () => filteredTasks.filter((t) => t.status === 'Sedang Dikerjakan'),
    [filteredTasks]
  );
  const selesai = useMemo(
    () => filteredTasks.filter((t) => t.status === 'Selesai'),
    [filteredTasks]
  );

  const getPriorityBadgeClass = (priority: TaskPriority) => {
    switch (priority) {
      case 'Tinggi':
        return 'bg-red-50 text-red-700 border-red-200/80';
      case 'Sedang':
        return 'bg-amber-50 text-amber-700 border-amber-200/80';
      default:
        return 'bg-[#F5F5F7] text-[#6E6E73] border-[#E8E8ED]';
    }
  };

  // Render Single Task Card
  const renderTaskCard = (task: WorkerTask) => {
    const isLate = task.tenggat.includes('12:00') || task.tenggat.includes('13:00');
    const isTrm = task.terkait?.startsWith('TRM');
    const isPrd = task.terkait?.startsWith('PRD');

    let relatedLink = '';
    if (isTrm) relatedLink = `/internal/pekerja/seleksi?trmId=${task.terkait}`;
    if (isPrd) relatedLink = `/internal/pekerja/produksi/${task.terkait}`;

    return (
      <div
        key={task.id}
        className="bg-white rounded-2xl sm:rounded-3xl border border-[#E8E8ED] p-4 sm:p-5 space-y-3.5 hover:border-[#2E7D4F]/30 hover:shadow-xs transition-all"
      >
        {/* Top Header Card */}
        <div className="flex items-start justify-between gap-2">
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getPriorityBadgeClass(
              task.prioritas
            )}`}
          >
            Prioritas {task.prioritas}
          </span>
          <span className="text-[10px] font-mono text-[#6E6E73]">{task.id}</span>
        </div>

        {/* Title & Description */}
        <div>
          <h3 className="text-sm font-bold text-[#1D1D1F] leading-snug">{task.judul}</h3>
          <p className="text-xs text-[#6E6E73] mt-1 line-clamp-2 leading-relaxed">
            {task.deskripsi}
          </p>
        </div>

        {/* Due Date & Related Target */}
        <div className="space-y-1.5 pt-1 text-xs">
          <div className="flex items-center justify-between">
            <span
              className={`flex items-center gap-1 font-medium ${
                isLate && task.status !== 'Selesai'
                  ? 'text-red-600 font-semibold'
                  : 'text-[#6E6E73]'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{task.tenggat}</span>
            </span>

            {isLate && task.status !== 'Selesai' && (
              <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                Mendesak
              </span>
            )}
          </div>

          {task.terkait && relatedLink && (
            <div className="pt-0.5">
              <Link
                to={relatedLink}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#2E7D4F] hover:underline"
              >
                <span>Lihat Alur Terkait ({task.terkait})</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          )}

          <p className="text-[10px] text-[#6E6E73] pt-0.5 flex items-center gap-1">
            <User className="w-3 h-3 text-[#6E6E73]" />
            <span>Dari: {task.dari}</span>
          </p>
        </div>

        {/* Segmented Control Status Switcher */}
        <div className="pt-2 border-t border-[#E8E8ED]">
          <span className="text-[10px] font-bold text-[#6E6E73] uppercase tracking-wider block mb-1.5">
            Ubah Status Tugas:
          </span>
          <div className="p-0.5 bg-[#F5F5F7] rounded-xl flex border border-[#E8E8ED] text-[11px]">
            <button
              type="button"
              onClick={() => handleStatusChange(task.id, 'Belum Dikerjakan')}
              className={`flex-1 py-1 text-center rounded-lg font-semibold transition-all cursor-pointer ${
                task.status === 'Belum Dikerjakan'
                  ? 'bg-white text-[#1D1D1F] shadow-2xs'
                  : 'text-[#6E6E73] hover:text-[#1D1D1F]'
              }`}
            >
              Belum
            </button>
            <button
              type="button"
              onClick={() => handleStatusChange(task.id, 'Sedang Dikerjakan')}
              className={`flex-1 py-1 text-center rounded-lg font-semibold transition-all cursor-pointer ${
                task.status === 'Sedang Dikerjakan'
                  ? 'bg-white text-blue-700 shadow-2xs'
                  : 'text-[#6E6E73] hover:text-[#1D1D1F]'
              }`}
            >
              Sedang
            </button>
            <button
              type="button"
              onClick={() => handleStatusChange(task.id, 'Selesai')}
              className={`flex-1 py-1 text-center rounded-lg font-semibold transition-all cursor-pointer ${
                task.status === 'Selesai'
                  ? 'bg-white text-[#2E7D4F] shadow-2xs'
                  : 'text-[#6E6E73] hover:text-[#1D1D1F]'
              }`}
            >
              Selesai
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1D1D1F] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-white/10 animate-in slide-in-from-bottom-3 duration-200">
          <div className="w-6 h-6 rounded-full bg-[#2E7D4F] text-white flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <p className="text-xs sm:text-sm font-medium">{toastMessage}</p>
        </div>
      )}

      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#EBF4EE] text-[#2E7D4F] border border-[#2E7D4F]/20">
              Manajemen Kerja Dapur
            </span>
            <span className="text-xs text-[#6E6E73]">· Delegasi Admin</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1D1D1F]">
            Tugas Operasional Saya
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[#6E6E73] max-w-xl">
            Pantau instruksi kerja, target harian, dan prioritas inspeksi mutu dari manajemen operasional.
          </p>
        </div>

        {/* Counter Info */}
        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-full bg-white border border-[#E8E8ED] text-[#6E6E73]">
            Total: <strong className="text-[#1D1D1F]">{tasks.length} Tugas</strong>
          </span>
          <span className="px-3 py-1.5 rounded-full bg-[#EBF4EE] border border-[#2E7D4F]/20 text-[#2E7D4F] font-semibold">
            {belumDikerjakan.length + sedangDikerjakan.length} Belum Selesai
          </span>
        </div>
      </div>

      {/* Filter Bar & Sorting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-2 sm:p-2.5 rounded-2xl border border-[#E8E8ED]">
        {/* Filter Prioritas */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {(['Semua', 'Tinggi', 'Sedang', 'Rendah'] as const).map((pri) => (
            <button
              key={pri}
              type="button"
              onClick={() => setPriorityFilter(pri)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0 ${
                priorityFilter === pri
                  ? 'bg-[#1D1D1F] text-white shadow-xs'
                  : 'text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-[#F5F5F7]'
              }`}
            >
              {pri === 'Semua' ? 'Semua Prioritas' : pri}
            </button>
          ))}
        </div>

        {/* Search & Sort */}
        <div className="flex items-center gap-2">
          {/* Sort Selector */}
          <button
            type="button"
            onClick={() => setSortBy(sortBy === 'tenggat' ? 'prioritas' : 'tenggat')}
            className="px-3 py-1.5 rounded-xl bg-[#F5F5F7] border border-[#E8E8ED] text-xs font-medium text-[#1D1D1F] flex items-center gap-1.5 hover:bg-[#E8E8ED] transition-colors shrink-0 cursor-pointer"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-[#6E6E73]" />
            <span>Urut: {sortBy === 'tenggat' ? 'Tenggat' : 'Prioritas'}</span>
          </button>

          {/* Search Box */}
          <div className="relative w-full sm:w-56">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#6E6E73]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari tugas..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[#F5F5F7] border border-[#E8E8ED] text-xs text-[#1D1D1F] outline-none"
            />
          </div>
        </div>
      </div>

      {/* =========================================================================
          HP: VIEW TAB 3 KOLOM
          ========================================================================= */}
      <div className="block lg:hidden space-y-4">
        {/* Tab Header HP */}
        <div className="flex items-center p-1 bg-[#F5F5F7] rounded-2xl border border-[#E8E8ED]">
          {(
            [
              { label: 'Belum Dikerjakan', list: belumDikerjakan },
              { label: 'Sedang Dikerjakan', list: sedangDikerjakan },
              { label: 'Selesai', list: selesai },
            ] as const
          ).map((col) => (
            <button
              key={col.label}
              type="button"
              onClick={() => setMobileTab(col.label)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                mobileTab === col.label
                  ? 'bg-white text-[#1D1D1F] shadow-xs'
                  : 'text-[#6E6E73] hover:text-[#1D1D1F]'
              }`}
            >
              <span>{col.label.split(' ')[0]}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                  mobileTab === col.label
                    ? 'bg-[#1D1D1F] text-white'
                    : 'bg-[#E8E8ED] text-[#6E6E73]'
                }`}
              >
                {col.list.length}
              </span>
            </button>
          ))}
        </div>

        {/* Task Cards in Active Mobile Tab */}
        <div className="space-y-3">
          {mobileTab === 'Belum Dikerjakan' &&
            (belumDikerjakan.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#E8E8ED] p-8 text-center text-xs text-[#6E6E73]">
                Tidak ada tugas di kolom Belum Dikerjakan.
              </div>
            ) : (
              belumDikerjakan.map(renderTaskCard)
            ))}

          {mobileTab === 'Sedang Dikerjakan' &&
            (sedangDikerjakan.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#E8E8ED] p-8 text-center text-xs text-[#6E6E73]">
                Tidak ada tugas yang sedang berlangsung.
              </div>
            ) : (
              sedangDikerjakan.map(renderTaskCard)
            ))}

          {mobileTab === 'Selesai' &&
            (selesai.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#E8E8ED] p-8 text-center text-xs text-[#6E6E73]">
                Belum ada tugas yang diselesaikan.
              </div>
            ) : (
              selesai.map(renderTaskCard)
            ))}
        </div>
      </div>

      {/* =========================================================================
          DESKTOP: PAPAN KANBAN 3 KOLOM
          ========================================================================= */}
      <div className="hidden lg:grid grid-cols-3 gap-5 items-start">
        {/* Kolom 1: Belum Dikerjakan */}
        <div className="bg-[#F5F5F7]/80 rounded-3xl p-4 border border-[#E8E8ED] space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#E8E8ED]">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <h2 className="text-xs font-bold text-[#1D1D1F] uppercase tracking-wider">
                Belum Dikerjakan
              </h2>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white text-[#1D1D1F] border border-[#E8E8ED]">
              {belumDikerjakan.length}
            </span>
          </div>

          <div className="space-y-3">
            {belumDikerjakan.length === 0 ? (
              <div className="py-12 text-center text-xs text-[#6E6E73]">
                Tidak ada tugas pending.
              </div>
            ) : (
              belumDikerjakan.map(renderTaskCard)
            )}
          </div>
        </div>

        {/* Kolom 2: Sedang Dikerjakan */}
        <div className="bg-[#F5F5F7]/80 rounded-3xl p-4 border border-[#E8E8ED] space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#E8E8ED]">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <h2 className="text-xs font-bold text-[#1D1D1F] uppercase tracking-wider">
                Sedang Dikerjakan
              </h2>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white text-[#1D1D1F] border border-[#E8E8ED]">
              {sedangDikerjakan.length}
            </span>
          </div>

          <div className="space-y-3">
            {sedangDikerjakan.length === 0 ? (
              <div className="py-12 text-center text-xs text-[#6E6E73]">
                Tidak ada tugas aktif di dapur.
              </div>
            ) : (
              sedangDikerjakan.map(renderTaskCard)
            )}
          </div>
        </div>

        {/* Kolom 3: Selesai */}
        <div className="bg-[#F5F5F7]/80 rounded-3xl p-4 border border-[#E8E8ED] space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#E8E8ED]">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#2E7D4F]" />
              <h2 className="text-xs font-bold text-[#1D1D1F] uppercase tracking-wider">
                Selesai
              </h2>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white text-[#1D1D1F] border border-[#E8E8ED]">
              {selesai.length}
            </span>
          </div>

          <div className="space-y-3">
            {selesai.length === 0 ? (
              <div className="py-12 text-center text-xs text-[#6E6E73]">
                Belum ada tugas terselesaikan.
              </div>
            ) : (
              selesai.map(renderTaskCard)
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
