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
  StockMovementLog,
} from '../types/worker';
import {
  INITIAL_RECEIVINGS,
  CONVERSION_RECIPES,
  INITIAL_BATCHES,
  INITIAL_TASKS,
  INITIAL_INVENTORY,
  INITIAL_STOCK_LOGS,
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
  addRecipe: (newRecipe: Omit<ConversionRecipe, 'id'>) => ConversionRecipe;
  updateRecipe: (id: string, patch: Partial<ConversionRecipe>) => void;
  deleteRecipe: (id: string) => void;

  // Batch Produksi
  batches: ProductionBatch[];
  addBatch: (newBatch: Omit<ProductionBatch, 'id' | 'riwayatStatus'>) => ProductionBatch;
  updateBatchStatus: (
    batchId: string,
    newStatus: BatchStatus,
    catatan?: string,
    finalResult?: { hasilBerhasil: number; gagalReject: number }
  ) => void;

  // Tugas
  tasks: WorkerTask[];
  addTask: (newTask: Omit<WorkerTask, 'id' | 'dibuatPada'>) => WorkerTask;
  updateTask: (taskId: string, patch: Partial<WorkerTask>) => void;
  deleteTask: (taskId: string) => void;
  updateTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
  pendingTasksCount: number;

  // Stok & Inventaris
  materialStocks: MaterialStockSummary[];
  inventory: ProductInventory[];
  stockLogs: StockMovementLog[];
  adjustMaterialStock: (
    namaBahan: string,
    tipe: 'Tambah' | 'Kurang',
    jumlahKg: number,
    alasan: string
  ) => void;
  adjustProductStock: (
    namaProduk: string,
    tipe: 'Tambah' | 'Kurang',
    jumlah: number,
    alasan: string
  ) => void;

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
  const [recipes, setRecipes] = useState<ConversionRecipe[]>(CONVERSION_RECIPES);
  const [batches, setBatches] = useState<ProductionBatch[]>(INITIAL_BATCHES);
  const [tasks, setTasks] = useState<WorkerTask[]>(INITIAL_TASKS);
  const [inventory, setInventory] = useState<ProductInventory[]>(INITIAL_INVENTORY);
  const [stockLogs, setStockLogs] = useState<StockMovementLog[]>(INITIAL_STOCK_LOGS);
  const [manualMaterialAdjustments, setManualMaterialAdjustments] = useState<Record<string, number>>({});

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
    const targetReceiving = receivings.find((r) => r.id === receivingId);

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

    // Catat log stok masuk dari seleksi
    if (targetReceiving && qcResult.layak > 0) {
      const now = new Date();
      const jam = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} WIB`;
      const newLog: StockMovementLog = {
        id: `LOG-${Date.now()}`,
        tanggal: '14 Okt 2026',
        jam,
        item: targetReceiving.namaBahan,
        kategoriItem: 'Bahan Baku',
        tipe: 'Masuk',
        jumlah: qcResult.layak,
        satuan: 'kg',
        sumber: 'Seleksi',
        alasan: `Hasil seleksi kiriman ${receivingId}`,
        staf: 'Dewi Lestari',
      };
      setStockLogs((prev) => [newLog, ...prev]);
    }
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

    // Log pergerakan bahan keluar ke produksi
    const newLog: StockMovementLog = {
      id: `LOG-${Date.now()}`,
      tanggal: input.tanggalMulai,
      jam,
      item: input.bahan,
      kategoriItem: 'Bahan Baku',
      tipe: 'Keluar',
      jumlah: input.bahanDipakai,
      satuan: 'kg',
      sumber: 'Produksi',
      alasan: `Digunakan untuk batch ${newId} (${input.produk})`,
      staf: 'Dewi Lestari',
    };
    setStockLogs((prev) => [newLog, ...prev]);

    return created;
  };

  // Update Status Batch Produksi & Stok Produk Jadi
  const updateBatchStatus = (
    batchId: string,
    newStatus: BatchStatus,
    catatan?: string,
    finalResult?: { hasilBerhasil: number; gagalReject: number }
  ) => {
    const now = new Date();
    const jam = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} WIB`;
    const tanggal = '14 Okt 2026';

    setBatches((prev) =>
      prev.map((b) => {
        if (b.id === batchId) {
          const updated: ProductionBatch = {
            ...b,
            status: newStatus,
            hasilBerhasil: finalResult !== undefined ? finalResult.hasilBerhasil : b.hasilBerhasil,
            gagalReject: finalResult !== undefined ? finalResult.gagalReject : b.gagalReject,
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

          // Jika status Siap Dijual, perbarui stok produk jadi
          if (newStatus === 'Siap Dijual' && finalResult) {
            setInventory((prevInv) => {
              const matched = prevInv.find(
                (inv) => inv.productId === b.productId || inv.namaProduk === b.produk
              );
              if (matched) {
                return prevInv.map((inv) =>
                  inv === matched
                    ? {
                        ...inv,
                        jumlah: inv.jumlah + finalResult.hasilBerhasil,
                        statusKetersediaan: 'Tersedia',
                        terakhirDiperbarui: '14 Okt 2026, baru saja',
                      }
                    : inv
                );
              }
              return [
                ...prevInv,
                {
                  productId: b.productId,
                  namaProduk: b.produk,
                  jumlah: finalResult.hasilBerhasil,
                  satuan: b.satuan,
                  statusKetersediaan: 'Tersedia',
                  lokasiPenyimpanan: 'Gudang Display A-1',
                  terakhirDiperbarui: '14 Okt 2026, baru saja',
                },
              ];
            });
          }

          return updated;
        }
        return b;
      })
    );
  };

  // Tambah Tugas Baru (dari Admin / Sistem)
  const addTask: WorkerDataContextType['addTask'] = (input) => {
    const nextId = `TSK-2026-00${tasks.length + 1}`;
    const created: WorkerTask = {
      ...input,
      id: nextId,
      dibuatPada: '14 Okt 2026',
    };
    setTasks((prev) => [created, ...prev]);
    return created;
  };

  // Update Data Tugas (Admin)
  const updateTask: WorkerDataContextType['updateTask'] = (taskId, patch) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, ...patch } : t))
    );
  };

  // Hapus Tugas (Admin)
  const deleteTask: WorkerDataContextType['deleteTask'] = (taskId) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  // Update Status Tugas (Pekerja / Admin)
  const updateTaskStatus = (taskId: string, newStatus: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
  };

  // Resep Konversi CRUD
  const addRecipe: WorkerDataContextType['addRecipe'] = (input) => {
    const nextId = `RCP-00${recipes.length + 1}`;
    const created: ConversionRecipe = {
      ...input,
      id: nextId,
    };
    setRecipes((prev) => [...prev, created]);
    return created;
  };

  const updateRecipe: WorkerDataContextType['updateRecipe'] = (id, patch) => {
    setRecipes((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...patch } : r))
    );
  };

  const deleteRecipe: WorkerDataContextType['deleteRecipe'] = (id) => {
    setRecipes((prev) => prev.filter((r) => r.id !== id));
  };

  // Penyesuaian Stok Bahan Baku Manual (Tambah / Kurang)
  const adjustMaterialStock = (
    namaBahan: string,
    tipe: 'Tambah' | 'Kurang',
    jumlahKg: number,
    alasan: string
  ) => {
    const delta = tipe === 'Tambah' ? jumlahKg : -jumlahKg;
    setManualMaterialAdjustments((prev) => ({
      ...prev,
      [namaBahan]: (prev[namaBahan] || 0) + delta,
    }));

    const now = new Date();
    const jam = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} WIB`;
    const newLog: StockMovementLog = {
      id: `LOG-${Date.now()}`,
      tanggal: '14 Okt 2026',
      jam,
      item: namaBahan,
      kategoriItem: 'Bahan Baku',
      tipe: tipe === 'Tambah' ? 'Masuk' : 'Keluar',
      jumlah: jumlahKg,
      satuan: 'kg',
      sumber: 'Penyesuaian',
      alasan,
      staf: 'Dewi Lestari',
    };
    setStockLogs((prev) => [newLog, ...prev]);
  };

  // Penyesuaian Stok Produk Jadi Manual (Tambah / Kurang)
  const adjustProductStock = (
    namaProduk: string,
    tipe: 'Tambah' | 'Kurang',
    jumlah: number,
    alasan: string
  ) => {
    const delta = tipe === 'Tambah' ? jumlah : -jumlah;
    let unitSatuan = 'pcs';

    setInventory((prev) =>
      prev.map((inv) => {
        if (inv.namaProduk === namaProduk) {
          unitSatuan = inv.satuan;
          const newQty = Math.max(0, inv.jumlah + delta);
          return {
            ...inv,
            jumlah: newQty,
            statusKetersediaan: newQty > 20 ? 'Tersedia' : newQty > 0 ? 'Menipis' : 'Habis',
            terakhirDiperbarui: '14 Okt 2026, baru saja',
          };
        }
        return inv;
      })
    );

    const now = new Date();
    const jam = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} WIB`;
    const newLog: StockMovementLog = {
      id: `LOG-${Date.now()}`,
      tanggal: '14 Okt 2026',
      jam,
      item: namaProduk,
      kategoriItem: 'Produk Jadi',
      tipe: tipe === 'Tambah' ? 'Masuk' : 'Keluar',
      jumlah: jumlah,
      satuan: unitSatuan,
      sumber: 'Penyesuaian',
      alasan,
      staf: 'Dewi Lestari',
    };
    setStockLogs((prev) => [newLog, ...prev]);
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

    // 3. Hitung sisa layak + penyesuaian manual
    const result: MaterialStockSummary[] = [];
    map.forEach((item) => {
      const adj = manualMaterialAdjustments[item.namaBahan] || 0;
      item.sisaLayakKg = Math.max(0, item.totalLayakKg - item.terpakaiProduksiKg + adj);
      result.push(item);
    });

    return result;
  }, [receivings, batches, manualMaterialAdjustments]);

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
        addRecipe,
        updateRecipe,
        deleteRecipe,
        batches,
        addBatch,
        updateBatchStatus,
        tasks,
        addTask,
        updateTask,
        deleteTask,
        updateTaskStatus,
        pendingTasksCount,
        materialStocks,
        inventory,
        stockLogs,
        adjustMaterialStock,
        adjustProductStock,
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
