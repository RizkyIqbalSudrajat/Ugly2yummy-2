import React, { useEffect, useRef } from 'react';
import { X, Check, RotateCcw } from 'lucide-react';
import { TaskPriority, TaskStatus } from '../../types/worker';
import { StaffWorkerOption } from '../../data/workerDummy';

export interface CatalogFilterState {
  jenisProduk: string[];
  cocokUntuk: string[];
  bahanAsal: string[];
  hargaRange: string; // '' | '<25000' | '25000-40000' | '>40000'
}

export interface IngredientOption {
  id: string;
  nama: string;
  emoji: string;
}

export interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  filterState: CatalogFilterState;
  onFilterChange: (next: CatalogFilterState) => void;
  onReset: () => void;
  matchedCount: number;
  ingredientsList: IngredientOption[];
  panelId?: string;
}

const JENIS_PRODUK_OPTIONS = [
  'Selai',
  'Saus & Sambal',
  'Camilan',
  'Roti & Kue',
  'Minuman',
];

const COCOK_UNTUK_OPTIONS = [
  'Sarapan',
  'Camilan Sehat',
  'Masak Harian',
  'Oleh-oleh',
  'Hampers',
];

const HARGA_OPTIONS = [
  { id: '<25000', label: 'Di bawah Rp25.000' },
  { id: '25000-40000', label: 'Rp25.000–Rp40.000' },
  { id: '>40000', label: 'Di atas Rp40.000' },
];

export const FilterPanel: React.FC<FilterPanelProps> = ({
  isOpen,
  onClose,
  filterState,
  onFilterChange,
  onReset,
  matchedCount,
  ingredientsList,
  panelId = 'filter-panel',
}) => {
  const panelRef = useRef<HTMLDivElement>(null);

  // Keyboard accessibility: Tekan Esc untuk menutup panel
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    panelRef.current?.focus();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Klik di luar panel pada mode desktop
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest(`[aria-controls="${panelId}"]`)) return;
      if (panelRef.current && !panelRef.current.contains(target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, panelId]);

  if (!isOpen) return null;

  // Toggle helpers
  const handleToggleJenis = (item: string) => {
    const exists = filterState.jenisProduk.includes(item);
    const next = exists
      ? filterState.jenisProduk.filter((i) => i !== item)
      : [...filterState.jenisProduk, item];
    onFilterChange({ ...filterState, jenisProduk: next });
  };

  const handleToggleCocok = (item: string) => {
    const exists = filterState.cocokUntuk.includes(item);
    const next = exists
      ? filterState.cocokUntuk.filter((i) => i !== item)
      : [...filterState.cocokUntuk, item];
    onFilterChange({ ...filterState, cocokUntuk: next });
  };

  const handleToggleBahan = (ingredientId: string) => {
    const exists = filterState.bahanAsal.includes(ingredientId);
    const next = exists
      ? filterState.bahanAsal.filter((i) => i !== ingredientId)
      : [...filterState.bahanAsal, ingredientId];
    onFilterChange({ ...filterState, bahanAsal: next });
  };

  const handleSelectHarga = (rangeId: string) => {
    const next = filterState.hargaRange === rangeId ? '' : rangeId;
    onFilterChange({ ...filterState, hargaRange: next });
  };

  const hasAnyFilterActive =
    filterState.jenisProduk.length > 0 ||
    filterState.cocokUntuk.length > 0 ||
    filterState.bahanAsal.length > 0 ||
    filterState.hargaRange !== '';

  return (
    <>
      {/* Backdrop Gelap Transparan di Mobile (HP) */}
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs sm:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Container Panel: Bottom Sheet di HP, Floating Card di Desktop */}
      <div
        id={panelId}
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Filter Produk"
        tabIndex={-1}
        className="
          fixed bottom-0 left-0 right-0 z-50 max-h-[85vh] bg-white rounded-t-3xl border-t border-[#E8E8ED] shadow-2xl flex flex-col outline-none
          sm:absolute sm:bottom-auto sm:top-full sm:right-0 sm:left-auto sm:w-[380px] sm:max-h-[580px] sm:mt-2.5 sm:rounded-3xl sm:border sm:border-[#E8E8ED] sm:shadow-2xl sm:z-40
        "
      >
        {/* Header Panel */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#E8E8ED] shrink-0">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-[#1D1D1F]">Filter Produk</h3>
            {hasAnyFilterActive && (
              <span className="w-2 h-2 rounded-full bg-[#2E7D4F]" />
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-[#8E8E93] hover:text-[#1D1D1F] hover:bg-[#F5F5F7] transition-colors cursor-pointer"
            aria-label="Tutup panel filter"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Konten Scrollable Kelompok Filter */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-6 flex-1 text-left text-xs">
          {/* a. Jenis Produk */}
          <div className="space-y-2">
            <div>
              <h4 className="text-sm font-bold text-[#1D1D1F]">Jenis Produk</h4>
              <p className="text-[11px] text-[#6E6E73] mt-0.5">Bentuk olahannya</p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {JENIS_PRODUK_OPTIONS.map((item) => {
                const isSelected = filterState.jenisProduk.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => handleToggleJenis(item)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#1D1D1F] text-white font-semibold'
                        : 'bg-[#F5F5F7] text-[#48484A] hover:bg-[#E8E8ED] border border-transparent'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                    <span>{item}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* b. Cocok Untuk */}
          <div className="space-y-2 pt-3 border-t border-[#E8E8ED]/70">
            <div>
              <h4 className="text-sm font-bold text-[#1D1D1F]">Cocok Untuk</h4>
              <p className="text-[11px] text-[#6E6E73] mt-0.5">Kapan produk ini dipakai</p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {COCOK_UNTUK_OPTIONS.map((item) => {
                const isSelected = filterState.cocokUntuk.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => handleToggleCocok(item)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#1D1D1F] text-white font-semibold'
                        : 'bg-[#F5F5F7] text-[#48484A] hover:bg-[#E8E8ED] border border-transparent'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                    <span>{item}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* c. Bahan Asal */}
          <div className="space-y-2 pt-3 border-t border-[#E8E8ED]/70">
            <div>
              <h4 className="text-sm font-bold text-[#1D1D1F]">Bahan Asal</h4>
              <p className="text-[11px] text-[#6E6E73] mt-0.5">
                Dibuat dari buah atau sayur apa
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {ingredientsList.map((ing) => {
                const isSelected = filterState.bahanAsal.includes(ing.id);
                return (
                  <button
                    key={ing.id}
                    type="button"
                    onClick={() => handleToggleBahan(ing.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#1D1D1F] text-white font-semibold'
                        : 'bg-[#F5F5F7] text-[#48484A] hover:bg-[#E8E8ED] border border-transparent'
                    }`}
                  >
                    {isSelected ? (
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    ) : (
                      <span className="text-xs">{ing.emoji}</span>
                    )}
                    <span>{ing.nama}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* d. Kisaran Harga */}
          <div className="space-y-2 pt-3 border-t border-[#E8E8ED]/70">
            <div>
              <h4 className="text-sm font-bold text-[#1D1D1F]">Harga</h4>
              <p className="text-[11px] text-[#6E6E73] mt-0.5">
                Kisaran harga per produk
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {HARGA_OPTIONS.map((opt) => {
                const isSelected = filterState.hargaRange === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleSelectHarga(opt.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#2E7D4F] text-white font-semibold shadow-xs'
                        : 'bg-[#F5F5F7] text-[#48484A] hover:bg-[#E8E8ED] border border-transparent'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Panel: Tombol Reset & Tampilkan X Produk */}
        <div className="p-4 sm:p-5 border-t border-[#E8E8ED] flex items-center justify-between gap-3 bg-[#FBFBFD] shrink-0 rounded-b-3xl">
          <button
            type="button"
            onClick={onReset}
            disabled={!hasAnyFilterActive}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#6E6E73] hover:text-[#1D1D1F] disabled:opacity-40 disabled:hover:text-[#6E6E73] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-full bg-[#2E7D4F] hover:bg-[#256640] text-white text-xs font-bold transition-all shadow-xs cursor-pointer text-center"
          >
            Tampilkan {matchedCount} produk
          </button>
        </div>
      </div>
    </>
  );
};

// ============================================================================
// PANEL FILTER TUGAS PEKERJA (PORTAL ADMIN)
// ============================================================================
export type TaskDeadlineFilter = 'Semua' | 'Hari Ini' | 'Minggu Ini' | 'Terlambat';

export interface TaskFilterState {
  workers: string[];
  statuses: TaskStatus[];
  priorities: TaskPriority[];
  deadline: TaskDeadlineFilter;
}

export interface TaskFilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  filterState: TaskFilterState;
  onFilterChange: (next: TaskFilterState) => void;
  onReset: () => void;
  matchedCount: number;
  workersList: StaffWorkerOption[];
  panelId?: string;
}

const TASK_STATUS_OPTIONS: Array<{
  value: TaskStatus;
  dotClass: string;
}> = [
  { value: 'Belum Mulai', dotClass: 'bg-gray-400' },
  { value: 'Dalam Proses', dotClass: 'bg-amber-500' },
  { value: 'Selesai', dotClass: 'bg-[#2E7D4F]' },
];

const TASK_PRIORITY_OPTIONS: TaskPriority[] = ['Tinggi', 'Normal', 'Rendah'];

const TASK_DEADLINE_OPTIONS: TaskDeadlineFilter[] = [
  'Semua',
  'Hari Ini',
  'Minggu Ini',
  'Terlambat',
];

export const TaskFilterPanel: React.FC<TaskFilterPanelProps> = ({
  isOpen,
  onClose,
  filterState,
  onFilterChange,
  onReset,
  matchedCount,
  workersList,
  panelId = 'task-filter-panel',
}) => {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    panelRef.current?.focus();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest(`[aria-controls="${panelId}"]`)) return;
      if (panelRef.current && !panelRef.current.contains(target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, panelId]);

  if (!isOpen) return null;

  const toggleWorker = (nama: string) => {
    const exists = filterState.workers.includes(nama);
    const next = exists
      ? filterState.workers.filter((w) => w !== nama)
      : [...filterState.workers, nama];
    onFilterChange({ ...filterState, workers: next });
  };

  const toggleStatus = (status: TaskStatus) => {
    const exists = filterState.statuses.includes(status);
    const next = exists
      ? filterState.statuses.filter((s) => s !== status)
      : [...filterState.statuses, status];
    onFilterChange({ ...filterState, statuses: next });
  };

  const togglePriority = (priority: TaskPriority) => {
    const exists = filterState.priorities.includes(priority);
    const next = exists
      ? filterState.priorities.filter((p) => p !== priority)
      : [...filterState.priorities, priority];
    onFilterChange({ ...filterState, priorities: next });
  };

  const selectDeadline = (deadline: TaskDeadlineFilter) => {
    onFilterChange({ ...filterState, deadline });
  };

  const hasAnyFilterActive =
    filterState.workers.length > 0 ||
    filterState.statuses.length > 0 ||
    filterState.priorities.length > 0 ||
    filterState.deadline !== 'Semua';

  return (
    <>
      {/* Backdrop Gelap Transparan di Mobile (HP) */}
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs sm:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Container Panel: Bottom Sheet di HP, Floating Card di Desktop */}
      <div
        id={panelId}
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Filter Tugas Pekerja"
        tabIndex={-1}
        className="
          fixed bottom-0 left-0 right-0 z-50 max-h-[85vh] bg-white rounded-t-3xl border-t border-[#E8E8ED] shadow-2xl flex flex-col outline-none
          sm:absolute sm:bottom-auto sm:top-full sm:left-0 sm:right-auto lg:right-0 lg:left-auto sm:w-[400px] sm:max-h-[600px] sm:mt-2.5 sm:rounded-3xl sm:border sm:border-[#E8E8ED] sm:shadow-2xl sm:z-40
        "
      >
        {/* Header Panel */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#E8E8ED] shrink-0">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-[#1D1D1F]">Filter Tugas</h3>
            {hasAnyFilterActive && (
              <span className="w-2 h-2 rounded-full bg-[#2E7D4F]" />
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-[#8E8E93] hover:text-[#1D1D1F] hover:bg-[#F5F5F7] transition-colors cursor-pointer"
            aria-label="Tutup panel filter"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Konten Scrollable Kelompok Filter */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-5 flex-1 text-left text-xs">
          {/* a. Pekerja */}
          <div className="space-y-2.5">
            <div>
              <h4 className="text-sm font-bold text-[#1D1D1F]">Pekerja</h4>
              <p className="text-[11px] text-[#6E6E73] mt-0.5">Tugas milik siapa</p>
            </div>
            <div className="space-y-1.5">
              {workersList.map((worker) => {
                const isSelected = filterState.workers.includes(worker.nama);
                return (
                  <button
                    key={worker.id}
                    type="button"
                    onClick={() => toggleWorker(worker.nama)}
                    className={`w-full flex items-center justify-between gap-3 p-2.5 rounded-2xl border text-left transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#EBF4EE]/60 border-[#2E7D4F] text-[#1D1D1F]'
                        : 'bg-[#F5F5F7]/70 border-transparent hover:bg-[#F5F5F7] text-[#1D1D1F]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className={`w-8 h-8 rounded-xl font-bold text-[11px] flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'bg-[#2E7D4F] text-white'
                            : 'bg-white text-[#2E7D4F] border border-[#E8E8ED]'
                        }`}
                      >
                        {worker.avatar}
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[#1D1D1F] truncate">
                          {worker.nama}
                        </p>
                        <p className="text-[11px] text-[#6E6E73] truncate">
                          {worker.peran}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border transition-colors ${
                        isSelected
                          ? 'bg-[#2E7D4F] border-[#2E7D4F] text-white'
                          : 'bg-white border-[#D2D2D7]'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* b. Status */}
          <div className="space-y-2 pt-3 border-t border-[#E8E8ED]/70">
            <div>
              <h4 className="text-sm font-bold text-[#1D1D1F]">Status</h4>
              <p className="text-[11px] text-[#6E6E73] mt-0.5">
                Tahap pengerjaan tugas saat ini
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {TASK_STATUS_OPTIONS.map((opt) => {
                const isSelected = filterState.statuses.includes(opt.value);
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => toggleStatus(opt.value)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#1D1D1F] text-white font-semibold'
                        : 'bg-[#F5F5F7] text-[#48484A] hover:bg-[#E8E8ED] border border-transparent'
                    }`}
                  >
                    {isSelected ? (
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    ) : (
                      <span className={`w-2 h-2 rounded-full ${opt.dotClass}`} />
                    )}
                    <span>{opt.value}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* c. Prioritas */}
          <div className="space-y-2 pt-3 border-t border-[#E8E8ED]/70">
            <div>
              <h4 className="text-sm font-bold text-[#1D1D1F]">Prioritas</h4>
              <p className="text-[11px] text-[#6E6E73] mt-0.5">
                Tingkat urgensi pengerjaan
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {TASK_PRIORITY_OPTIONS.map((priority) => {
                const isSelected = filterState.priorities.includes(priority);
                return (
                  <button
                    key={priority}
                    type="button"
                    onClick={() => togglePriority(priority)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#1D1D1F] text-white font-semibold'
                        : 'bg-[#F5F5F7] text-[#48484A] hover:bg-[#E8E8ED] border border-transparent'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                    <span>{priority}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* d. Tenggat */}
          <div className="space-y-2 pt-3 border-t border-[#E8E8ED]/70">
            <div>
              <h4 className="text-sm font-bold text-[#1D1D1F]">Tenggat</h4>
              <p className="text-[11px] text-[#6E6E73] mt-0.5">
                Batas waktu penyelesaian tugas
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {TASK_DEADLINE_OPTIONS.map((opt) => {
                const isSelected = filterState.deadline === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => selectDeadline(opt)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#2E7D4F] text-white font-semibold shadow-xs'
                        : 'bg-[#F5F5F7] text-[#48484A] hover:bg-[#E8E8ED] border border-transparent'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Panel: Tombol Reset & Tampilkan X tugas */}
        <div className="p-4 sm:p-5 border-t border-[#E8E8ED] flex items-center justify-between gap-3 bg-[#FBFBFD] shrink-0 rounded-b-3xl">
          <button
            type="button"
            onClick={onReset}
            disabled={!hasAnyFilterActive}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#6E6E73] hover:text-[#1D1D1F] disabled:opacity-40 disabled:hover:text-[#6E6E73] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-full bg-[#2E7D4F] hover:bg-[#256640] text-white text-xs font-bold transition-all shadow-xs cursor-pointer text-center"
          >
            Tampilkan {matchedCount} tugas
          </button>
        </div>
      </div>
    </>
  );
};
