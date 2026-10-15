import React, { createContext, useContext, useState, useMemo } from 'react';
import {
  MaterialReceiving,
  QCResult,
  ConversionRecipe,
  ProductionBatch,
  BatchStatus,
  WorkerTask,
  TaskStatus,
  ProductInventory,
  IngredientCategory,
} from '../types/worker';
import {
  INITIAL_RECEIVINGS,
  CONVERSION_RECIPES,
  INITIAL_BATCHES,
  INITIAL_TASKS,
  INITIAL_INVENTORY,
} from '../data/workerDummy';

export interface MaterialStockSummary {
  namaBahan: string;
  jenis: IngredientCategory;
  totalMasukKg: number;
  totalLayakKg: number;
  totalTidakLayakKg: number;
  totalKomposKg: number;
  terpakaiProduksiKg: number;
  sisaLayakKg: number;
}

export interface WorkerDataContextType {
  // Penerimaan
  receivings: MaterialReceiving[];
  addReceiving: (
    newReceiving: Omit<MaterialReceiving, 'id' | 'status' | 'dicatatOleh'> & {
      dicatatOleh?: string;
    }
  ) => MaterialReceiving;
  updateReceivingQC: (receivingId: string, qcResult: QCResult) => void;

  // Resep Konversi
  recipes: ConversionRecipe[];

  // Batch Produksi
  batches: ProductionBatch[];
  addBatch: (newBatch: Omit<ProductionBatch, 'id' | 'riwayatStatus'>) => ProductionBatch;
  updateBatchStatus: (batchId: string, newStatus: BatchStatus, catatan?: string) => void;

  // Tugas
  tasks: WorkerTask[];
  updateTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
  pendingTasksCount: number;

  // Stok & Inventaris
  materialStocks: MaterialStockSummary[];
  inventory: ProductInventory[];

  // Statistik Ringkasan
  stats: {
    menungguDiseleksiCount: number;
    stokBahanLayakKg: number;
    batchBerjalanCount: number;
    siapDijualHariIniCount: number;
  };
}

const WorkerDataContext = createContext<WorkerDataContextType | undefined>(undefined);

export const WorkerDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [receivings, setReceivings] = useState<MaterialReceiving[]>(INITIAL_RECEIVINGS);
  const [recipes] = useState<ConversionRecipe[]>(CONVERSION_RECIPES);
  const [batches, setBatches] = useState<ProductionBatch[]>(INITIAL_BATCHES);
  const [tasks, setTasks] = useState<WorkerTask[]>(INITIAL_TASKS);
  const [inventory] = useState<ProductInventory[]>(INITIAL_INVENTORY);

  // Tambah Penerimaan Bahan Baru
  const addReceiving: WorkerDataContextType['addReceiving'] = (input) => {
    // Generate next TRM ID
    const nextNum = receivings.length + 32;
    const newId = `TRM-2026-00${nextNum}`;

    const created: MaterialReceiving = {
      ...input,
      id: newId,
      status: 'Menunggu Diseleksi',
      dicatatOleh: input.dicatatOleh || 'Dewi Lestari',
    };

    setReceivings((prev) => [created, ...prev]);
    return created;
  };

  // Update Hasil Seleksi (QC)
  const updateReceivingQC = (receivingId: string, qcResult: QCResult) => {
    setReceivings((prev) =>
      prev.map((rec) => {
        if (rec.id === receivingId) {
          return {
            ...rec,
            status: 'Sudah Diseleksi',
            hasilSeleksi: qcResult,
          };
        }
        return rec;
      })
    );
  };

  // Tambah Batch Produksi Baru
  const addBatch: WorkerDataContextType['addBatch'] = (input) => {
    const nextNum = batches.length + 15;
    const newId = `PRD-2026-00${nextNum}`;
    const now = new Date();
    const jam = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} WIB`;

    const created: ProductionBatch = {
      ...input,
      id: newId,
      riwayatStatus: [
        {
          tahap: input.status,
          tanggal: input.tanggalMulai,
          jam,
          catatan: input.catatan || 'Batch baru didaftarkan ke sistem dapur.',
        },
      ],
    };

    setBatches((prev) => [created, ...prev]);
    return created;
  };

  // Update Status Batch Produksi
  const updateBatchStatus = (batchId: string, newStatus: BatchStatus, catatan?: string) => {
    const now = new Date();
    const jam = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} WIB`;
    const tanggal = '14 Okt 2026';

    setBatches((prev) =>
      prev.map((b) => {
        if (b.id === batchId) {
          return {
            ...b,
            status: newStatus,
            riwayatStatus: [
              ...b.riwayatStatus,
              {
                tahap: newStatus,
                tanggal,
                jam,
                catatan: catatan || `Status batch diperbarui menjadi ${newStatus}.`,
              },
            ],
          };
        }
        return b;
      })
    );
  };

  // Update Status Tugas
  const updateTaskStatus = (taskId: string, newStatus: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
  };

  // Perhitungan Stok Bahan Baku Layak secara realtime
  const materialStocks = useMemo(() => {
    const map = new Map<string, MaterialStockSummary>();

    // 1. Kumpulkan dari penerimaan
    receivings.forEach((rec) => {
      const existing = map.get(rec.namaBahan) || {
        namaBahan: rec.namaBahan,
        jenis: rec.jenis,
        totalMasukKg: 0,
        totalLayakKg: 0,
        totalTidakLayakKg: 0,
        totalKomposKg: 0,
        terpakaiProduksiKg: 0,
        sisaLayakKg: 0,
      };

      existing.totalMasukKg += rec.beratAwal;
      if (rec.hasilSeleksi) {
        existing.totalLayakKg += rec.hasilSeleksi.layak;
        existing.totalTidakLayakKg += rec.hasilSeleksi.tidakLayak;
        existing.totalKomposKg += rec.hasilSeleksi.dijadikanKompos;
      }
      map.set(rec.namaBahan, existing);
    });

    // 2. Kurangi dengan bahan terpakai di produksi batch
    batches.forEach((b) => {
      const existing = map.get(b.bahan);
      if (existing) {
        existing.terpakaiProduksiKg += b.bahanDipakai;
      }
    });

    // 3. Hitung sisa layak
    const result: MaterialStockSummary[] = [];
    map.forEach((item) => {
      item.sisaLayakKg = Math.max(0, item.totalLayakKg - item.terpakaiProduksiKg);
      result.push(item);
    });

    return result;
  }, [receivings, batches]);

  // Statistik Realtime
  const stats = useMemo(() => {
    // 1. Menunggu Diseleksi
    const menungguDiseleksiCount = receivings.filter(
      (r) => r.status === 'Menunggu Diseleksi'
    ).length;

    // 2. Stok Bahan Layak (kg)
    const stokBahanLayakKg = materialStocks.reduce(
      (acc, curr) => acc + curr.sisaLayakKg,
      0
    );

    // 3. Batch Sedang Berjalan (Sedang Diolah + Sedang Dikemas)
    const batchBerjalanCount = batches.filter(
      (b) => b.status === 'Sedang Diolah' || b.status === 'Sedang Dikemas'
    ).length;

    // 4. Siap Dijual Hari Ini (total produk siap dijual)
    const readyBatches = batches.filter((b) => b.status === 'Siap Dijual');
    const siapDijualHariIniCount = readyBatches.reduce(
      (acc, curr) => acc + curr.hasilBerhasil,
      0
    );

    return {
      menungguDiseleksiCount,
      stokBahanLayakKg,
      batchBerjalanCount,
      siapDijualHariIniCount,
    };
  }, [receivings, materialStocks, batches]);

  // Jumlah tugas tertunda
  const pendingTasksCount = useMemo(() => {
    return tasks.filter((t) => t.status !== 'Selesai').length;
  }, [tasks]);

  return (
    <WorkerDataContext.Provider
      value={{
        receivings,
        addReceiving,
        updateReceivingQC,
        recipes,
        batches,
        addBatch,
        updateBatchStatus,
        tasks,
        updateTaskStatus,
        pendingTasksCount,
        materialStocks,
        inventory,
        stats,
      }}
    >
      {children}
    </WorkerDataContext.Provider>
  );
};

export const useWorkerData = (): WorkerDataContextType => {
  const context = useContext(WorkerDataContext);
  if (!context) {
    throw new Error('useWorkerData must be used within a WorkerDataProvider');
  }
  return context;
};
