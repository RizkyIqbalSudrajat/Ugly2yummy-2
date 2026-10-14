export interface Product {
  id: string;
  nama: string;
  kategori: string;
  kebutuhan?: string[];
  harga: number;
  hargaPembanding?: number;
  ukuran: string;
  deskripsiSingkat: string;
  deskripsiLengkap?: string;
  bahanUtama: string;
  komposisi: string[];
  estimasiKgTerselamatkan: number;
  rating: number;
  jumlahUlasan: number;
  gambar: string;
  gambarEmojiFallback: string;
  ingredientId: string;
  tersedia: boolean;
}

export interface FarmerProfile {
  nama: string;
  daerah: string;
  lamaBertani: string;
  caraTanam: string;
  kutipan: string;
  fotoUrl?: string;
}

export interface Ingredient {
  id: string;
  nama: string;
  emoji: string;
  asal: string;
  petani: string;
  musimPanen?: string;
  alasanUgly: string;
  fakta: string;
  ceritaSingkat: string;
  ceritaPanjang?: string[];
  kutipanPetani?: {
    teks: string;
    nama: string;
    peran: string;
  };
  profilPetani?: FarmerProfile;
  totalKgTerselamatkan: number;
  gambar: string;
  altText?: string;
  produkOlahIds: string[];
}

export interface CartItem {
  id: string;
  nama: string;
  kategori: string;
  harga: number;
  ukuran: string;
  jumlah: number;
  bahanUtama: string;
  asalBahan: string;
  estimasiKgTerselamatkan: number;
  gambar: string;
  gambarEmojiFallback: string;
}

export interface UserProfile {
  nama: string;
  email: string;
  avatarUrl?: string;
  kota: string;
  bergabungSejak: string;
  dampak: {
    totalKgTerselamatkan: number;
    pesananSelesai: number;
    petaniDidukung: number;
    emisiCo2eKg: number;
  };
}

export interface ImpactStats {
  totalKgPangan: number;
  petaniMitra: number;
  totalPembeli: number;
  co2eKgTerselamatkan: number;
}

export interface SupplierProfile {
  nama: string;
  email: string;
  kelompokTani: string;
  lokasi: string;
  inisial: string;
  komoditasUtama?: string;
  bergabungSejak?: string;
  avatarUrl?: string;
}

export * from './supplier';
export * from './staff';


