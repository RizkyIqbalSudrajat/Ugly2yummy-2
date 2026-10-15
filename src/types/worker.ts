export type IngredientCategory = 'Sayur' | 'Buah' | 'Umbi' | 'Rempah';

export type ReceivingCondition =
  | 'Bentuk tidak seragam'
  | 'Ukuran kecil'
  | 'Kulit bercak/tergores'
  | 'Terlalu matang'
  | 'Sebagian busuk';

export type ReceivingStatus = 'Menunggu Diseleksi' | 'Sudah Diseleksi';

export interface QCResult {
  layak: number; // kg
  tidakLayak: number; // kg
  dijadikanKompos: number; // kg
  dibuang: number; // kg
  catatan: string;
  tanggalSeleksi: string; // e.g. '13 Okt 2026'
  diseleksiOleh: string; // e.g. 'Dewi Lestari'
}

export interface MaterialReceiving {
  id: string; // TRM-2026-0031
  supplierAsal: string; // e.g. 'Pak Asep - Kelompok Tani Sukamaju'
  namaBahan: string; // e.g. 'Tomat Bengkok'
  jenis: IngredientCategory;
  beratAwal: number; // kg
  tanggalMasuk: string; // e.g. '14 Okt 2026'
  kondisi: ReceivingCondition[];
  catatan: string;
  foto: string;
  dicatatOleh: string;
  status: ReceivingStatus;
  hasilSeleksi?: QCResult;
}

export interface ConversionRecipe {
  id: string;
  namaProduk: string;
  productId?: string;
  namaBahan: string;
  rasioBahanKg: number; // e.g. 1 kg
  rasioHasilUnit: number; // e.g. 10 pcs
  satuanHasil: string; // e.g. 'pcs', 'botol', 'jar'
  catatan?: string;
}

export type BatchStatus = 'Sedang Diolah' | 'Sedang Dikemas' | 'Siap Dijual';

export interface BatchStatusHistory {
  tahap: BatchStatus;
  tanggal: string;
  jam: string;
  catatan?: string;
}

export interface ProductionBatch {
  id: string; // PRD-2026-0014
  produk: string;
  productId?: string;
  bahan: string;
  bahanDipakai: number; // kg
  targetHasil: number;
  hasilBerhasil: number;
  gagalReject: number;
  satuan: string; // pcs, botol, jar, bungkus
  tanggalMulai: string;
  status: BatchStatus;
  riwayatStatus: BatchStatusHistory[];
  catatan: string;
}

export interface ProductInventory {
  productId?: string;
  namaProduk: string;
  jumlah: number;
  satuan: string;
  statusKetersediaan: 'Tersedia' | 'Menipis' | 'Habis';
  lokasiPenyimpanan: string;
  terakhirDiperbarui: string;
}

export type TaskPriority = 'Tinggi' | 'Sedang' | 'Rendah';
export type TaskStatus = 'Belum Dikerjakan' | 'Sedang Dikerjakan' | 'Selesai';

export interface WorkerTask {
  id: string;
  judul: string;
  deskripsi: string;
  prioritas: TaskPriority;
  tenggat: string;
  terkait?: string; // e.g. 'TRM-2026-0031' or 'PRD-2026-0014'
  dari: string; // "Raka Pratama (Admin)"
  status: TaskStatus;
  dibuatPada: string;
}

export type StockMovementType = 'Masuk' | 'Keluar';
export type StockMovementSource = 'Seleksi' | 'Produksi' | 'Penyesuaian';

export interface StockMovementLog {
  id: string;
  tanggal: string;
  jam: string;
  item: string;
  kategoriItem: 'Bahan Baku' | 'Produk Jadi';
  tipe: StockMovementType;
  jumlah: number;
  satuan: string;
  sumber: StockMovementSource;
  alasan: string;
  staf: string;
}

