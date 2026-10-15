export type SupplierOfferStatus =
  | 'Menunggu Persetujuan'
  | 'Negosiasi'
  | 'Disetujui'
  | 'Ditolak'
  | 'Dijadwalkan'
  | 'Dikirim/Dijemput'
  | 'Selesai & Dibayar';

export interface NegotiationHistory {
  pihak: 'Admin' | 'Supplier';
  hargaTawar: number;
  pesan: string;
  tanggal: string;
}

export interface SupplierOffer {
  id: string; // PNW-2026-001
  supplierId: string;
  supplierNama: string;
  kelompokTani: string;
  kota: string;
  noHp: string;
  namaBahan: string;
  jenis: 'Sayur' | 'Buah' | 'Umbi' | 'Rempah';
  beratTersediaKg: number;
  hargaTawarPerKg: number;
  hargaKesepakatanPerKg?: number;
  foto: string;
  kondisiDatang: string[];
  tanggalDiajukan: string;
  catatanSupplier: string;
  riwayatNegosiasi: NegotiationHistory[];
  status: SupplierOfferStatus;
  jadwalId?: string;
}

export interface SupplierDirectoryItem {
  id: string;
  nama: string;
  kelompokTani: string;
  kota: string;
  noHp: string;
  rekening: string;
  totalKgDisetor: number;
  ratingKualitas: number; // Persentase rata-rata layak olah e.g. 92%
}

export type ReceivingScheduleType = 'Diantar Supplier' | 'Dijemput Tim';
export type ReceivingScheduleStatus = 'Terjadwal' | 'Dalam Perjalanan' | 'Diterima' | 'Dibatalkan';

export interface ReceivingSchedule {
  id: string; // JDW-2026-001
  penawaranId: string;
  namaBahan: string;
  supplierNama: string;
  kelompokTani: string;
  beratKg: number;
  tipe: ReceivingScheduleType;
  tanggal: string;
  jam: string;
  petugas: string;
  kendaraan: string;
  status: ReceivingScheduleStatus;
  catatan?: string;
}

export type OrderStatus = 'Pesanan Baru' | 'Diproses' | 'Dikemas' | 'Selesai';

export interface OrderItemDetail {
  produkId: string;
  namaProduk: string;
  gambar?: string;
  jumlah: number;
  harga: number;
  subtotal: number;
}

export interface AdminOrder {
  id: string; // ORD-2026-0101
  pembeli: string;
  noHp: string;
  alamatLengkap: string;
  item: OrderItemDetail[];
  ongkir: number;
  total: number;
  metodeBayar: string;
  tanggal: string;
  status: OrderStatus;
  resiPengiriman?: string;
}

export type ShippingCourier = 'JNE' | 'J&T' | 'SiCepat' | 'GoSend';
export type ShippingStatus = 'Menunggu Kurir' | 'Dalam Perjalanan' | 'Terkirim';

export interface ShippingHistoryLog {
  status: string;
  waktu: string;
  catatan: string;
}

export interface AdminShipping {
  id: string; // SHP-2026-001
  pesananId: string;
  namaPembeli: string;
  kurir: ShippingCourier;
  layanan: string;
  nomorResi: string;
  status: ShippingStatus;
  tanggalKirim: string;
  tujuanKota: string;
  riwayatStatus: ShippingHistoryLog[];
}

export interface ProductIngredientFormula {
  bahan: string;
  kgPerUnit: number;
}

export interface AdminProduct {
  id: string;
  nama: string;
  kategori: string;
  harga: number;
  hargaPembanding?: number;
  ukuran: string;
  bahanUtama: string;
  komposisiDetail: ProductIngredientFormula[];
  stok: number;
  status: 'Aktif' | 'Draft';
  gambar: string;
  rating: number;
  jumlahUlasan: number;
}

export interface AdminReview {
  id: string;
  produkId: string;
  namaProduk: string;
  pembeli: string;
  rating: number; // 1-5
  isi: string;
  tanggal: string;
  status: 'Tampil' | 'Disembunyikan';
  balasanAdmin?: string;
}

export type AdminUserRole = 'Pembeli' | 'Supplier' | 'Pekerja' | 'Admin';

export interface AdminUser {
  id: string;
  nama: string;
  email: string;
  role: AdminUserRole;
  status: 'Aktif' | 'Nonaktif';
  tanggalBergabung: string;
}

export type AdminNotificationType = 'Penawaran' | 'Pesanan' | 'Stok' | 'Tugas' | 'Ulasan';

export interface AdminNotification {
  id: string;
  tipe: AdminNotificationType;
  judul: string;
  isi: string;
  waktu: string;
  sudahDibaca: boolean;
  linkTujuan: string;
}

export interface MonthlyRevenueData {
  bulan: string;
  pendapatan: number;
  target: number;
}

export interface ProductSalesStat {
  namaProduk: string;
  totalUnit: number;
  totalPendapatan: number;
}
