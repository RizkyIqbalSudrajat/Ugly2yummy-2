import React, { useState, useMemo } from 'react';
import { useWorkerData } from '../../../context/WorkerDataContext';
import { WorkerTask, TaskPriority, TaskStatus } from '../../../types/worker';
import { WORKER_STAFF_LIST } from '../../../data/workerDummy';
import {
  TaskFilterPanel,
  TaskFilterState,
} from '../../../components/ui/FilterPanel';
import {
  ListTodo,
  Plus,
  Clock,
  CheckCircle2,
  X,
  Edit2,
  Trash2,
  SlidersHorizontal,
  Sparkles,
  Link2,
  Search,
} from 'lucide-react';

type TaskSortOption = 'Tenggat Terdekat' | 'Prioritas Tertinggi' | 'Terbaru Dibuat';

const MONTH_MAP: Record<string, number> = {
  jan: 0,
  feb: 1,
  mar: 2,
  apr: 3,
  mei: 4,
  may: 4,
  jun: 5,
  jul: 6,
  agu: 7,
  ags: 7,
  aug: 7,
  sep: 8,
  okt: 9,
  oct: 9,
  nov: 10,
  des: 11,
  dec: 11,
};

function parseIndoDateTime(str: string): number {
  if (!str) return 0;
  const match = str.match(/(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})(?:,\s*(\d{1,2}):(\d{2}))?/);
  if (!match) return 0;
  const day = parseInt(match[1], 10);
  const monthKey = match[2].toLowerCase().slice(0, 3);
  const month = MONTH_MAP[monthKey] ?? 9;
  const year = parseInt(match[3], 10);
  const hour = match[4] ? parseInt(match[4], 10) : 12;
  const minute = match[5] ? parseInt(match[5], 10) : 0;
  return new Date(year, month, day, hour, minute).getTime();
}

const PRIORITY_RANK: Record<TaskPriority, number> = {
  Tinggi: 1,
  Normal: 2,
  Rendah: 3,
};

// Tanggal & waktu referensi simulasi sistem: 14 Okt 2026, 12:30 WIB
const SIMULATED_NOW_MS = new Date(2026, 9, 14, 12, 30).getTime();
const WEEK_START_MS = new Date(2026, 9, 12, 0, 0).getTime();
const WEEK_END_MS = new Date(2026, 9, 18, 23, 59).getTime();

export const AdminWorkerTasksPage: React.FC = () => {
  const { tasks, addTask, updateTask, deleteTask, updateTaskStatus, receivings, batches } = useWorkerData();

  // Search, Sort, Filter Panel State
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<TaskSortOption>('Tenggat Terdekat');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterState, setFilterState] = useState<TaskFilterState>({
    workers: [],
    statuses: [],
    priorities: [],
    deadline: 'Semua',
  });

  // Drawer / Side Panel Create or Edit Task
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<WorkerTask | null>(null);

  // Form Fields
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskWorkerName, setTaskWorkerName] = useState('Dewi Lestari');
  const [taskPriority, setTaskPriority] = useState<TaskPriority>('Normal');
  const [taskDeadlineDate, setTaskDeadlineDate] = useState('14 Okt 2026');
  const [taskDeadlineTime, setTaskDeadlineTime] = useState('16:00 WIB');
  const [taskReference, setTaskReference] = useState('');

  // Delete Confirmation Modal
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);

  // Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Reset all filters
  const handleResetFilters = () => {
    setFilterState({
      workers: [],
      statuses: [],
      priorities: [],
      deadline: 'Semua',
    });
  };

  // Total active filter count for badge
  const totalActiveFilterCount =
    filterState.workers.length +
    filterState.statuses.length +
    filterState.priorities.length +
    (filterState.deadline !== 'Semua' ? 1 : 0);

  // Shortcut toggle from worker progress card
  const handleToggleWorkerShortcut = (workerName: string) => {
    setFilterState((prev) => {
      const isSelected = prev.workers.includes(workerName);
      if (isSelected) {
        return {
          ...prev,
          workers: prev.workers.filter((w) => w !== workerName),
        };
      }
      return {
        ...prev,
        workers: [workerName],
      };
    });
  };

  // Open Drawer for Create
  const handleOpenCreateDrawer = () => {
    setEditingTask(null);
    setTaskTitle('');
    setTaskDesc('');
    setTaskWorkerName('Dewi Lestari');
    setTaskPriority('Normal');
    setTaskDeadlineDate('14 Okt 2026');
    setTaskDeadlineTime('16:00 WIB');
    setTaskReference('');
    setIsDrawerOpen(true);
  };

  // Open Drawer for Edit
  const handleOpenEditDrawer = (task: WorkerTask) => {
    setEditingTask(task);
    setTaskTitle(task.judul);
    setTaskDesc(task.deskripsi);
    setTaskWorkerName(task.pekerjaNama || 'Dewi Lestari');
    setTaskPriority(task.prioritas);
    const parts = task.tenggat.split(', ');
    setTaskDeadlineDate(parts[0] || '14 Okt 2026');
    setTaskDeadlineTime(parts[1] || '16:00 WIB');
    setTaskReference(task.terkait || '');
    setIsDrawerOpen(true);
  };

  // Save Task (Create or Update)
  const handleSubmitTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    const deadlineCombined = `${taskDeadlineDate}, ${taskDeadlineTime}`;

    if (editingTask) {
      updateTask(editingTask.id, {
        judul: taskTitle.trim(),
        deskripsi: taskDesc.trim(),
        prioritas: taskPriority,
        tenggat: deadlineCombined,
        terkait: taskReference || undefined,
        pekerjaNama: taskWorkerName,
      });
      showToast(`Tugas "${taskTitle}" berhasil diperbarui!`);
    } else {
      addTask({
        judul: taskTitle.trim(),
        deskripsi: taskDesc.trim(),
        prioritas: taskPriority,
        tenggat: deadlineCombined,
        terkait: taskReference || undefined,
        dari: 'Raka Pratama (Admin)',
        status: 'Belum Mulai',
        pekerjaNama: taskWorkerName,
      });
      showToast(`Tugas baru berhasil ditugaskan ke ${taskWorkerName}!`);
    }

    setIsDrawerOpen(false);
  };

  // Confirm Delete
  const handleConfirmDelete = () => {
    if (deletingTaskId) {
      deleteTask(deletingTaskId);
      setDeletingTaskId(null);
      showToast('Tugas telah berhasil dihapus.');
    }
  };

  // Calculate Overdue
  const isTaskOverdue = (task: WorkerTask) => {
    if (task.status === 'Selesai') return false;
    const dueMs = parseIndoDateTime(task.tenggat);
    if (dueMs > 0) {
      return dueMs <= SIMULATED_NOW_MS;
    }
    return false;
  };

  // Filtered and Sorted Tasks
  const filteredTasks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const filtered = tasks.filter((t) => {
      // 1. Search by title (and description/reference fallback)
      if (query !== '') {
        const matchTitle = t.judul.toLowerCase().includes(query);
        const matchDesc = t.deskripsi.toLowerCase().includes(query);
        const matchRef = t.terkait ? t.terkait.toLowerCase().includes(query) : false;
        if (!matchTitle && !matchDesc && !matchRef) {
          return false;
        }
      }

      // 2. Worker filter (multi-select)
      const workerName = t.pekerjaNama || 'Dewi Lestari';
      if (filterState.workers.length > 0 && !filterState.workers.includes(workerName)) {
        return false;
      }

      // 3. Status filter (multi-select)
      if (filterState.statuses.length > 0 && !filterState.statuses.includes(t.status)) {
        return false;
      }

      // 4. Priority filter (multi-select)
      if (filterState.priorities.length > 0 && !filterState.priorities.includes(t.prioritas)) {
        return false;
      }

      // 5. Deadline filter (single-select)
      if (filterState.deadline === 'Hari Ini') {
        if (!t.tenggat.includes('14 Okt 2026')) return false;
      } else if (filterState.deadline === 'Minggu Ini') {
        const dueMs = parseIndoDateTime(t.tenggat);
        if (dueMs < WEEK_START_MS || dueMs > WEEK_END_MS) return false;
      } else if (filterState.deadline === 'Terlambat') {
        if (!isTaskOverdue(t)) return false;
      }

      return true;
    });

    return filtered.sort((a, b) => {
      if (sortBy === 'Prioritas Tertinggi') {
        const diff = PRIORITY_RANK[a.prioritas] - PRIORITY_RANK[b.prioritas];
        if (diff !== 0) return diff;
        return parseIndoDateTime(a.tenggat) - parseIndoDateTime(b.tenggat);
      }
      if (sortBy === 'Terbaru Dibuat') {
        return parseIndoDateTime(b.dibuatPada) - parseIndoDateTime(a.dibuatPada);
      }
      // Tenggat Terdekat
      return parseIndoDateTime(a.tenggat) - parseIndoDateTime(b.tenggat);
    });
  }, [tasks, searchQuery, filterState, sortBy]);

  // Grouped by Status for Kanban
  const todoTasks = useMemo(
    () => filteredTasks.filter((t) => t.status === 'Belum Mulai'),
    [filteredTasks]
  );
  const inProgressTasks = useMemo(
    () => filteredTasks.filter((t) => t.status === 'Dalam Proses'),
    [filteredTasks]
  );
  const doneTasks = useMemo(
    () => filteredTasks.filter((t) => t.status === 'Selesai'),
    [filteredTasks]
  );

  // Worker Progress Cards
  const workerProgressStats = useMemo(() => {
    return WORKER_STAFF_LIST.map((worker) => {
      const workerTasks = tasks.filter((t) => (t.pekerjaNama || 'Dewi Lestari') === worker.nama);
      const total = workerTasks.length;
      const belumMulai = workerTasks.filter((t) => t.status === 'Belum Mulai').length;
      const dalamProses = workerTasks.filter((t) => t.status === 'Dalam Proses').length;
      const selesai = workerTasks.filter((t) => t.status === 'Selesai').length;
      const percent = total > 0 ? Math.round((selesai / total) * 100) : 0;

      return {
        ...worker,
        total,
        belumMulai,
        dalamProses,
        selesai,
        percent,
      };
    });
  }, [tasks]);

  const getPriorityBadgeClass = (priority: TaskPriority) => {
    switch (priority) {
      case 'Tinggi':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'Normal':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Rendah':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6 pb-14 animate-in fade-in duration-200">
      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#1D1D1F] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in slide-in-from-top duration-300">
          <CheckCircle2 className="w-5 h-5 text-[#2E7D4F]" />
          <p className="text-xs sm:text-sm font-semibold">{toastMessage}</p>
        </div>
      )}

      {/* Header Info */}
      <div className="bg-white rounded-3xl border border-[#E8E8ED] p-5 sm:p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#EBF4EE] text-[#2E7D4F] border border-[#2E7D4F]/20 inline-flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Delegasi &amp; Monitoring Tugas Dapur
          </span>
          <span className="text-xs text-[#6E6E73]">
            {tasks.length} tugas terdaftar
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1D1D1F]">
          Manajemen Tugas Pekerja
        </h1>
        <p className="text-xs sm:text-sm text-[#6E6E73] mt-1 max-w-2xl">
          Buat instruksi kerja dapur, pantau progres harian per staf, dan hubungkan tugas langsung ke penerimaan bahan baku atau batch olahan.
        </p>
      </div>

      {/* A. Kartu Pemantauan Progres Per Pekerja (Jalan Pintas Filter) */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#8E8E93]">
          Progres Beban Kerja Staf
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {workerProgressStats.map((w) => {
            const isActive = filterState.workers.includes(w.nama);
            return (
              <div
                key={w.id}
                onClick={() => handleToggleWorkerShortcut(w.nama)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleToggleWorkerShortcut(w.nama);
                  }
                }}
                className={`bg-white rounded-3xl border p-4 shadow-xs transition-all cursor-pointer select-none ${
                  isActive
                    ? 'border-[#2E7D4F] ring-2 ring-[#2E7D4F]/20'
                    : 'border-[#E8E8ED] hover:border-[#2E7D4F]/40'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#2E7D4F] text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-xs">
                    {w.avatar}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-[#1D1D1F] truncate">{w.nama}</h4>
                    <p className="text-[10px] text-[#6E6E73] truncate">{w.peran}</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5 mb-3">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#6E6E73]">Penyelesaian:</span>
                    <span className="font-bold text-[#2E7D4F]">{w.percent}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#F5F5F7] overflow-hidden">
                    <div
                      style={{ width: `${w.percent}%` }}
                      className="h-full bg-[#2E7D4F] rounded-full transition-all duration-500"
                    />
                  </div>
                </div>

                {/* Counts (Selalu pakai label lengkap) */}
                <div className="grid grid-cols-3 gap-1 text-center pt-2 border-t border-[#E8E8ED] text-[10px]">
                  <div>
                    <p className="text-[#6E6E73] leading-tight">Belum Mulai</p>
                    <p className="font-bold text-[#1D1D1F] mt-0.5">{w.belumMulai}</p>
                  </div>
                  <div>
                    <p className="text-amber-700 leading-tight">Dalam Proses</p>
                    <p className="font-bold text-amber-700 mt-0.5">{w.dalamProses}</p>
                  </div>
                  <div>
                    <p className="text-[#2E7D4F] leading-tight">Selesai</p>
                    <p className="font-bold text-[#2E7D4F] mt-0.5">{w.selesai}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          TOOLBAR POLA KATALOG: Cari Judul, Filter (FilterPanel), Urutkan, Buat Tugas
          ========================================================================= */}
      <div className="space-y-3">
        <div className="relative z-30">
          <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap lg:flex-nowrap">
            {/* 1. Kolom Pencarian "Cari judul tugas" */}
            <div className="relative flex-1 min-w-[200px] w-full sm:w-auto">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6E6E73]">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari judul tugas..."
                className="w-full pl-10 pr-4 py-2.5 rounded-full border border-[#E8E8ED] bg-white text-xs sm:text-sm text-[#1D1D1F] placeholder-[#6E6E73]/60 focus:border-[#2E7D4F] focus:ring-2 focus:ring-[#2E7D4F]/15 outline-none transition-all"
              />
            </div>

            {/* 2. Tombol Filter + Panel Filter (Melayang di desktop, bottom sheet di HP) */}
            <div className="relative shrink-0">
              <button
                type="button"
                aria-expanded={isFilterOpen}
                aria-controls="admin-task-filter-panel"
                onClick={() => setIsFilterOpen((prev) => !prev)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer border ${
                  isFilterOpen || totalActiveFilterCount > 0
                    ? 'bg-[#1D1D1F] text-white border-[#1D1D1F] shadow-xs'
                    : 'bg-white text-[#1D1D1F] border-[#E8E8ED] hover:bg-[#F5F5F7]'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filter</span>
                {totalActiveFilterCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-[#2E7D4F] text-white text-[11px] font-bold flex items-center justify-center">
                    {totalActiveFilterCount}
                  </span>
                )}
              </button>

              <TaskFilterPanel
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                filterState={filterState}
                onFilterChange={setFilterState}
                onReset={handleResetFilters}
                matchedCount={filteredTasks.length}
                workersList={WORKER_STAFF_LIST}
                panelId="admin-task-filter-panel"
              />
            </div>

            {/* 3. Dropdown Urutkan */}
            <div className="relative shrink-0">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as TaskSortOption)}
                aria-label="Urutkan tugas"
                className="px-3.5 py-2.5 rounded-full border border-[#E8E8ED] bg-white text-xs sm:text-sm font-medium text-[#1D1D1F] focus:border-[#2E7D4F] outline-none cursor-pointer hover:bg-[#F5F5F7] transition-colors"
              >
                <option value="Tenggat Terdekat">Urutkan: Tenggat Terdekat</option>
                <option value="Prioritas Tertinggi">Prioritas Tertinggi</option>
                <option value="Terbaru Dibuat">Terbaru Dibuat</option>
              </select>
            </div>

            {/* 4. Tombol Utama "Buat Tugas" di Kanan */}
            <button
              type="button"
              onClick={handleOpenCreateDrawer}
              className="px-4 py-2.5 rounded-full bg-[#2E7D4F] text-white text-xs sm:text-sm font-semibold hover:bg-[#256640] transition-colors shadow-xs cursor-pointer inline-flex items-center gap-2 shrink-0 ml-auto lg:ml-0"
            >
              <Plus className="w-4 h-4" />
              <span>Buat Tugas</span>
            </button>
          </div>
        </div>

        {/* Chip Filter Aktif Berlabel & Link Hapus Semua */}
        {totalActiveFilterCount > 0 && (
          <div className="flex items-center gap-2 flex-wrap text-xs">
            {/* Chip Pekerja */}
            {filterState.workers.map((workerName) => (
              <span
                key={`worker-${workerName}`}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E8E8ED] text-[#1D1D1F] font-medium"
              >
                <span>Pekerja: {workerName}</span>
                <button
                  type="button"
                  onClick={() =>
                    setFilterState({
                      ...filterState,
                      workers: filterState.workers.filter((w) => w !== workerName),
                    })
                  }
                  className="text-[#8E8E93] hover:text-[#1D1D1F] cursor-pointer"
                  aria-label={`Hapus filter pekerja ${workerName}`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}

            {/* Chip Status */}
            {filterState.statuses.map((status) => (
              <span
                key={`status-${status}`}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E8E8ED] text-[#1D1D1F] font-medium"
              >
                <span>Status: {status}</span>
                <button
                  type="button"
                  onClick={() =>
                    setFilterState({
                      ...filterState,
                      statuses: filterState.statuses.filter((s) => s !== status),
                    })
                  }
                  className="text-[#8E8E93] hover:text-[#1D1D1F] cursor-pointer"
                  aria-label={`Hapus filter status ${status}`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}

            {/* Chip Prioritas */}
            {filterState.priorities.map((priority) => (
              <span
                key={`priority-${priority}`}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E8E8ED] text-[#1D1D1F] font-medium"
              >
                <span>Prioritas: {priority}</span>
                <button
                  type="button"
                  onClick={() =>
                    setFilterState({
                      ...filterState,
                      priorities: filterState.priorities.filter((p) => p !== priority),
                    })
                  }
                  className="text-[#8E8E93] hover:text-[#1D1D1F] cursor-pointer"
                  aria-label={`Hapus filter prioritas ${priority}`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}

            {/* Chip Tenggat */}
            {filterState.deadline !== 'Semua' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E8E8ED] text-[#1D1D1F] font-medium">
                <span>Tenggat: {filterState.deadline}</span>
                <button
                  type="button"
                  onClick={() => setFilterState({ ...filterState, deadline: 'Semua' })}
                  className="text-[#8E8E93] hover:text-[#1D1D1F] cursor-pointer"
                  aria-label="Hapus filter tenggat"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}

            {/* Link Hapus Semua */}
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs font-semibold text-[#2E7D4F] hover:underline cursor-pointer ml-1"
            >
              Hapus semua
            </button>
          </div>
        )}

        {/* Teks Ringkasan "Menampilkan X dari Y tugas" */}
        <div className="flex items-center justify-between text-xs text-[#6E6E73] pb-2 border-b border-[#E8E8ED]">
          <span>
            Menampilkan {filteredTasks.length} dari {tasks.length} tugas
          </span>
        </div>
      </div>

      {/* B. Papan 3 Kolom Kanban (Belum Mulai, Dalam Proses, Selesai) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Kolom 1: Belum Mulai (Abu-abu) */}
        <div className="bg-[#FBFBFD] rounded-3xl border border-[#E8E8ED] p-4 flex flex-col space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-gray-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#1D1D1F]">
                Belum Mulai
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-gray-200 text-gray-800 text-[11px] font-bold">
              {todoTasks.length}
            </span>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto">
            {todoTasks.map((task) => renderTaskCard(task))}
            {todoTasks.length === 0 && (
              <div className="p-6 text-center text-xs text-[#8E8E93] border border-dashed border-[#E8E8ED] rounded-2xl">
                Tidak ada tugas Belum Mulai
              </div>
            )}
          </div>
        </div>

        {/* Kolom 2: Dalam Proses (Kuning) */}
        <div className="bg-[#FBFBFD] rounded-3xl border border-[#E8E8ED] p-4 flex flex-col space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#1D1D1F]">
                Dalam Proses
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold">
              {inProgressTasks.length}
            </span>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto">
            {inProgressTasks.map((task) => renderTaskCard(task))}
            {inProgressTasks.length === 0 && (
              <div className="p-6 text-center text-xs text-[#8E8E93] border border-dashed border-[#E8E8ED] rounded-2xl">
                Tidak ada tugas Dalam Proses
              </div>
            )}
          </div>
        </div>

        {/* Kolom 3: Selesai (Hijau) */}
        <div className="bg-[#FBFBFD] rounded-3xl border border-[#E8E8ED] p-4 flex flex-col space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2E7D4F]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#1D1D1F]">
                Selesai
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-[#EBF4EE] text-[#2E7D4F] text-[11px] font-bold">
              {doneTasks.length}
            </span>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto">
            {doneTasks.map((task) => renderTaskCard(task))}
            {doneTasks.length === 0 && (
              <div className="p-6 text-center text-xs text-[#8E8E93] border border-dashed border-[#E8E8ED] rounded-2xl">
                Belum ada tugas Selesai
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ================= DRAWER PANEL (SIDEBAR DI DESKTOP, FULL DI HP) ================= */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setIsDrawerOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative w-full sm:max-w-md bg-white h-full flex flex-col justify-between shadow-2xl z-10 animate-in slide-in-from-right duration-200">
            {/* Header */}
            <div className="p-5 border-b border-[#E8E8ED] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#EBF4EE] text-[#2E7D4F] flex items-center justify-center">
                  <ListTodo className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#1D1D1F]">
                    {editingTask ? 'Edit Instruksi Tugas' : 'Buat Tugas Pekerja Baru'}
                  </h3>
                  <p className="text-[11px] text-[#6E6E73]">
                    {editingTask ? `ID: ${editingTask.id}` : 'Delegasi ke staf operasional'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="p-1 rounded-full hover:bg-[#F5F5F7] text-[#8E8E93] hover:text-[#1D1D1F]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSubmitTask} className="p-5 space-y-4 flex-1 overflow-y-auto text-xs">
              {/* Judul */}
              <div>
                <label className="block font-semibold text-[#1D1D1F] mb-1">
                  Judul Tugas:
                </label>
                <input
                  type="text"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="Contoh: Sortir darurat 85 kg Tomat Bengkok"
                  required
                  className="w-full p-2.5 rounded-xl bg-[#F5F5F7] border-0 text-[#1D1D1F] font-medium"
                />
              </div>

              {/* Deskripsi */}
              <div>
                <label className="block font-semibold text-[#1D1D1F] mb-1">
                  Deskripsi &amp; Instruksi Kerja:
                </label>
                <textarea
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                  placeholder="Instruksi spesifik suhu, standar kelayakan, atau tahapan pengerjaan..."
                  rows={3}
                  required
                  className="w-full p-2.5 rounded-xl bg-[#F5F5F7] border-0 text-[#1D1D1F]"
                />
              </div>

              {/* Pilih Pekerja Dropdown (Avatar + Nama) */}
              <div>
                <label className="block font-semibold text-[#1D1D1F] mb-1">
                  Tugaskan Kepada (Staf Pekerja):
                </label>
                <select
                  value={taskWorkerName}
                  onChange={(e) => setTaskWorkerName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#F5F5F7] border-0 text-[#1D1D1F] font-semibold"
                >
                  {WORKER_STAFF_LIST.map((w) => (
                    <option key={w.id} value={w.nama}>
                      {w.nama} — {w.peran}
                    </option>
                  ))}
                </select>
              </div>

              {/* Prioritas */}
              <div>
                <label className="block font-semibold text-[#1D1D1F] mb-1">
                  Tingkat Prioritas:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Tinggi', 'Normal', 'Rendah'] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setTaskPriority(p)}
                      className={`p-2 rounded-xl font-semibold border transition-all cursor-pointer text-center ${
                        taskPriority === p
                          ? p === 'Tinggi'
                            ? 'bg-red-50 text-red-700 border-red-300'
                            : p === 'Normal'
                            ? 'bg-amber-50 text-amber-800 border-amber-300'
                            : 'bg-blue-50 text-blue-700 border-blue-300'
                          : 'bg-[#F5F5F7] text-[#6E6E73] border-transparent'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tenggat Waktu */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#1D1D1F] mb-1">
                    Tanggal Tenggat:
                  </label>
                  <input
                    type="text"
                    value={taskDeadlineDate}
                    onChange={(e) => setTaskDeadlineDate(e.target.value)}
                    placeholder="14 Okt 2026"
                    required
                    className="w-full p-2.5 rounded-xl bg-[#F5F5F7] border-0 text-[#1D1D1F]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#1D1D1F] mb-1">
                    Jam Selesai:
                  </label>
                  <input
                    type="text"
                    value={taskDeadlineTime}
                    onChange={(e) => setTaskDeadlineTime(e.target.value)}
                    placeholder="16:00 WIB"
                    required
                    className="w-full p-2.5 rounded-xl bg-[#F5F5F7] border-0 text-[#1D1D1F]"
                  />
                </div>
              </div>

              {/* Terkait Penerimaan atau Batch (Opsional) */}
              <div>
                <label className="block font-semibold text-[#1D1D1F] mb-1">
                  Tautan Bahan Masuk / Batch (Opsional):
                </label>
                <select
                  value={taskReference}
                  onChange={(e) => setTaskReference(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#F5F5F7] border-0 text-[#1D1D1F]"
                >
                  <option value="">-- Tidak terkait langsung --</option>
                  <optgroup label="Bahan Masuk (Penerimaan)">
                    {receivings.slice(0, 5).map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.id} - {r.namaBahan} ({r.beratAwal} kg)
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Batch Olahan (Produksi)">
                    {batches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.id} - {b.produk} ({b.status})
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              {/* Actions Bottom */}
              <div className="pt-4 border-t border-[#E8E8ED] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  className="px-4 py-2.5 rounded-full bg-[#F5F5F7] text-[#6E6E73] hover:text-[#1D1D1F] cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-full bg-[#2E7D4F] text-white hover:bg-[#256640] transition-colors shadow-xs cursor-pointer font-semibold"
                >
                  {editingTask ? 'Simpan Perubahan' : 'Tugaskan Sekarang'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL HAPUS KONFIRMASI ================= */}
      {deletingTaskId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-[#E8E8ED] animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#1D1D1F]">Hapus Tugas?</h3>
                <p className="text-xs text-[#6E6E73]">Tugas ini akan dihapus dari daftar pekerja.</p>
              </div>
            </div>

            <p className="text-xs text-[#6E6E73] leading-relaxed">
              Apakah Anda yakin ingin menghapus tugas ini? Tindakan ini tidak dapat dibatalkan.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingTaskId(null)}
                className="px-4 py-2 text-xs font-semibold rounded-full bg-[#F5F5F7] text-[#6E6E73] hover:text-[#1D1D1F] cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-xs font-semibold rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors shadow-xs cursor-pointer"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Helper render kartu tugas di papan Kanban
  function renderTaskCard(task: WorkerTask) {
    const overdue = isTaskOverdue(task);
    const assignedWorker = task.pekerjaNama || 'Dewi Lestari';
    const workerInitial = assignedWorker
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2);

    return (
      <div
        key={task.id}
        className="bg-white rounded-2xl border border-[#E8E8ED] p-4 shadow-xs space-y-2.5 hover:border-[#2E7D4F]/40 transition-all group"
      >
        <div className="flex items-start justify-between gap-2">
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getPriorityBadgeClass(
              task.prioritas
            )}`}
          >
            Prioritas {task.prioritas}
          </span>

          <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={() => handleOpenEditDrawer(task)}
              className="p-1 rounded-lg hover:bg-[#F5F5F7] text-[#8E8E93] hover:text-[#1D1D1F]"
              title="Edit tugas"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setDeletingTaskId(task.id)}
              className="p-1 rounded-lg hover:bg-red-50 text-[#8E8E93] hover:text-red-600"
              title="Hapus tugas"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold text-[#1D1D1F] leading-snug">
            {task.judul}
          </h4>
          <p className="text-[11px] text-[#6E6E73] mt-1 line-clamp-2 leading-relaxed">
            {task.deskripsi}
          </p>
        </div>

        {/* Assigned Worker + Reference */}
        <div className="flex items-center justify-between pt-1 border-t border-[#E8E8ED]/70 text-[11px]">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="w-5 h-5 rounded-full bg-[#EBF4EE] text-[#2E7D4F] font-bold text-[9px] flex items-center justify-center shrink-0">
              {workerInitial}
            </span>
            <span className="font-semibold text-[#1D1D1F] truncate text-[11px]">
              {assignedWorker}
            </span>
          </div>

          {task.terkait && (
            <span className="text-[10px] font-mono text-[#6E6E73] bg-[#F5F5F7] px-1.5 py-0.5 rounded-md inline-flex items-center gap-1 shrink-0">
              <Link2 className="w-2.5 h-2.5" />
              {task.terkait}
            </span>
          )}
        </div>

        {/* Tenggat Waktu & Quick Status Dropdown (Label Lengkap) */}
        <div className="flex items-center justify-between gap-2 text-[10px] pt-1">
          <span
            className={`flex items-center gap-1 font-medium ${
              overdue ? 'text-red-600 font-bold' : 'text-[#6E6E73]'
            }`}
          >
            <Clock className="w-3 h-3 shrink-0" />
            <span>
              {task.tenggat}
              {overdue && ' (Terlambat)'}
            </span>
          </span>

          <select
            value={task.status}
            onChange={(e) => updateTaskStatus(task.id, e.target.value as TaskStatus)}
            aria-label={`Ubah status tugas ${task.judul}`}
            className={`text-[10px] font-semibold py-0.5 px-2 rounded-lg border cursor-pointer shrink-0 ${
              task.status === 'Belum Mulai'
                ? 'bg-[#F5F5F7] border-[#E8E8ED] text-[#1D1D1F]'
                : task.status === 'Dalam Proses'
                ? 'bg-amber-50 border-amber-200 text-amber-800'
                : 'bg-[#EBF4EE] border-[#2E7D4F]/30 text-[#2E7D4F]'
            }`}
          >
            <option value="Belum Mulai">Belum Mulai</option>
            <option value="Dalam Proses">Dalam Proses</option>
            <option value="Selesai">Selesai</option>
          </select>
        </div>
      </div>
    );
  }
};
