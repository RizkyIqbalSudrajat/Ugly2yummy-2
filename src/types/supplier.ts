export type SupplierOfferStatus =
  | 'Menunggu Persetujuan'
  | 'Disetujui'
  | 'Ditolak'
  | 'Dijadwalkan'
  | 'Dikirim/Dijemput'
  | 'Selesai & Dibayar';

export type SupplierCommodityType = 'Sayur' | 'Buah' | 'Umbi' | 'Rempah';

export type SupplierOfferCondition =
  | 'Bentuk tidak seragam'
  | 'Ukuran kecil'
  | 'Kulit bercak/tergores'
  | 'Terlalu matang'
  | 'Lainnya';

export interface OfferHistoryStep {
  tahap: SupplierOfferStatus;
  tanggal: string;
  catatan?: string;
}

export interface OfferSchedule {
  tanggal: string;
  jam: string;
  metode: 'Dijemput tim Ugly2Yummy' | 'Diantar ke gudang';
  petugas: {
    nama: string;
    noHp: string;
  };
}

export interface OfferPayout {
  total: number;
  metode: string;
  rekeningTujuan: string;
  status: 'Diproses' | 'Lunas';
  tanggalBayar?: string;
  nomorReferensi?: string;
}

export interface SupplierOffer {
  id: string;
  tanggalDiajukan: string;
  namaBahan: string;
  jenisBahan: SupplierCommodityType;
  jumlahKg: number;
  kondisi: string[];
  catatanKondisi: string;
  hargaPerKg: number;
  totalHarga: number;
  tanggalPanen: string;
  batasPenggunaan: string;
  lokasiPengambilan: {
    alamat: string;
    kota: string;
  };
  foto: string[];
  pesanPenawaran: string;
  status: SupplierOfferStatus;
  riwayatStatus: OfferHistoryStep[];
  catatanAdmin?: string;
  alasanPenolakan?: string;
  jadwal?: OfferSchedule;
  pembayaran?: OfferPayout;
}

export interface NewOfferPayload {
  namaBahan: string;
  jenisBahan: SupplierCommodityType;
  jumlahKg: number;
  kondisi: string[];
  catatanKondisi: string;
  hargaPerKg: number;
  tanggalPanen: string;
  batasPenggunaan: string;
  lokasiPengambilan: {
    alamat: string;
    kota: string;
  };
  foto: string[];
  pesanPenawaran: string;
}
