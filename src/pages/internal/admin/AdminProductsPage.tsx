import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAdminData } from '../../../context/AdminDataContext';
import { useWorkerData } from '../../../context/WorkerDataContext';
import { AdminProduct } from '../../../types/admin';
import { SmartImage } from '../../../components/ui/SmartImage';
import {
  ShoppingBag,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Star,
  Layers,
  LayoutGrid,
  List,
  Sparkles,
  ExternalLink,
  Package,
} from 'lucide-react';

export const AdminProductsPage: React.FC = () => {
  const { products, deleteProduct, addNotification } = useAdminData();
  const { inventory: productStocks } = useWorkerData();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Modal konfirmasi hapus
  const [productToDelete, setProductToDelete] = useState<AdminProduct | null>(null);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const categories = useMemo(() => {
    const cats = new Set<string>();
    products.forEach((p) => cats.add(p.kategori));
    return ['Semua', ...Array.from(cats)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (selectedCategory !== 'Semua' && p.kategori !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = p.nama.toLowerCase().includes(q);
        const matchKat = p.kategori.toLowerCase().includes(q);
        const matchBahan = p.bahanUtama.toLowerCase().includes(q);
        return matchName || matchKat || matchBahan;
      }
      return true;
    });
  }, [products, selectedCategory, searchQuery]);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleDeleteConfirm = () => {
    if (!productToDelete) return;
    deleteProduct(productToDelete.id);
    addNotification({
      tipe: 'Sistem',
      judul: `Produk Dihapus: ${productToDelete.nama}`,
      isi: `Produk ${productToDelete.nama} telah dinonaktifkan dan dihapus dari katalog admin.`,
      linkTujuan: '/internal/admin/produk',
    });
    showToast(`Produk "${productToDelete.nama}" berhasil dihapus.`);
    setProductToDelete(null);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#1D1D1F] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in slide-in-from-top duration-300">
          <CheckCircle2 className="w-5 h-5 text-[#2E7D4F]" />
          <p className="text-xs sm:text-sm font-semibold">{toastMessage}</p>
        </div>
      )}

      {/* Header Info & Action */}
      <div className="bg-white rounded-3xl border border-[#E8E8ED] p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#EBF4EE] text-[#2E7D4F] border border-[#2E7D4F]/20 inline-flex items-center gap-1">
              <ShoppingBag className="w-3 h-3" />
              Etalase Katalog Toko
            </span>
            <span className="text-xs text-[#6E6E73]">
              {products.length} Produk Terdaftar
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1D1D1F]">
            Manajemen Produk Olahan
          </h1>
          <p className="text-xs sm:text-sm text-[#6E6E73] mt-1 max-w-xl">
            Kelola seluruh produk olahan hasil penyelamatan imperfect produce: komposisi resep, stok etalase, penetapan diskon promo, dan cerita asal bahan petani.
          </p>
        </div>

        <Link
          to="/internal/admin/produk/baru"
          className="px-4 py-2.5 rounded-full bg-[#2E7D4F] text-white text-xs font-semibold hover:bg-[#256640] transition-colors shadow-xs cursor-pointer inline-flex items-center gap-2 self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Produk Baru</span>
        </Link>
      </div>

      {/* Toolbar: Search, Category Filters & View Mode Toggle */}
      <div className="bg-white rounded-3xl border border-[#E8E8ED] p-3.5 sm:p-4 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#8E8E93] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama produk, bahan baku, atau kategori..."
            className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm rounded-full bg-[#F5F5F7] border-0 focus:ring-2 focus:ring-[#2E7D4F]/30 text-[#1D1D1F] placeholder:text-[#8E8E93]"
          />
        </div>

        {/* Categories & View Switcher */}
        <div className="flex items-center gap-2 justify-between sm:justify-end overflow-x-auto pb-1 sm:pb-0">
          <div className="flex items-center gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#1D1D1F] text-white font-semibold'
                    : 'bg-[#F5F5F7] text-[#6E6E73] hover:text-[#1D1D1F]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="h-6 w-px bg-[#E8E8ED] hidden sm:block mx-1" />

          {/* Grid vs Table Toggle */}
          <div className="flex items-center bg-[#F5F5F7] p-1 rounded-full border border-[#E8E8ED] shrink-0">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-full cursor-pointer transition-colors ${
                viewMode === 'grid' ? 'bg-white shadow-xs text-[#1D1D1F]' : 'text-[#8E8E93]'
              }`}
              title="Tampilan Grid"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-full cursor-pointer transition-colors ${
                viewMode === 'table' ? 'bg-white shadow-xs text-[#1D1D1F]' : 'text-[#8E8E93]'
              }`}
              title="Tampilan Tabel"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#E8E8ED] p-12 text-center shadow-xs">
          <ShoppingBag className="w-10 h-10 text-[#8E8E93] mx-auto mb-3" />
          <h3 className="text-sm font-bold text-[#1D1D1F]">Tidak ada produk ditemukan</h3>
          <p className="text-xs text-[#6E6E73] mt-1">
            {searchQuery
              ? `Tidak ada hasil yang sesuai dengan kata kunci "${searchQuery}".`
              : 'Belum ada produk dalam kategori ini.'}
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('Semua');
            }}
            className="mt-4 px-4 py-2 text-xs font-semibold rounded-full bg-[#1D1D1F] text-white hover:bg-[#2E7D4F] transition-colors cursor-pointer"
          >
            Reset Filter
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map((p) => {
            const isLowStock = p.stok <= 25;
            const discountPct =
              p.hargaPembanding && p.hargaPembanding > p.harga
                ? Math.round(((p.hargaPembanding - p.harga) / p.hargaPembanding) * 100)
                : 0;

            // Worker stock comparison
            const matchedWorkerStock = productStocks.find(
              (ps) => ps.productId === p.id || ps.namaProduk.toLowerCase() === p.nama.toLowerCase()
            );

            return (
              <div
                key={p.id}
                className="bg-white rounded-3xl border border-[#E8E8ED] overflow-hidden shadow-xs hover:border-[#2E7D4F]/40 transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Gambar & Badges */}
                  <div className="relative aspect-[4/3] bg-[#F5F5F7] overflow-hidden">
                    <SmartImage
                      src={p.gambar}
                      alt={p.nama}
                      aspectRatio="4:3"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Top Badges */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          p.status === 'Aktif'
                            ? 'bg-white/90 text-[#2E7D4F] backdrop-blur-xs border border-[#2E7D4F]/20'
                            : 'bg-black/70 text-white backdrop-blur-xs'
                        }`}
                      >
                        {p.status}
                      </span>
                      {discountPct > 0 && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EBF4EE] text-[#2E7D4F] border border-[#2E7D4F]/30 shadow-xs">
                          Hemat {discountPct}%
                        </span>
                      )}
                    </div>

                    {/* Low Stock Warning */}
                    {isLowStock && (
                      <div className="absolute bottom-2.5 left-2.5">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white shadow-xs inline-flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          Stok menipis
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Body Info */}
                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-[#6E6E73]">
                      <span>{p.kategori}</span>
                      <span className="flex items-center gap-1 text-amber-600 font-bold">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        {p.rating} ({p.jumlahUlasan})
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-[#1D1D1F] line-clamp-1 group-hover:text-[#2E7D4F] transition-colors">
                      {p.nama}
                    </h3>

                    {/* Harga */}
                    <div className="flex items-baseline gap-2 pt-0.5">
                      <span className="text-base font-bold text-[#1D1D1F]">
                        {formatRupiah(p.harga)}
                      </span>
                      {p.hargaPembanding && p.hargaPembanding > p.harga && (
                        <span className="text-xs text-[#8E8E93] line-through">
                          {formatRupiah(p.hargaPembanding)}
                        </span>
                      )}
                    </div>

                    {/* Stok Info & Worker Inventory Sync */}
                    <div className="pt-2 border-t border-[#E8E8ED] flex items-center justify-between text-xs">
                      <span className="text-[#6E6E73]">Stok Toko:</span>
                      <span className={`font-bold ${isLowStock ? 'text-amber-700' : 'text-[#1D1D1F]'}`}>
                        {p.stok} {p.satuanStok || p.ukuran || 'unit'}
                      </span>
                    </div>

                    {matchedWorkerStock && (
                      <div className="text-[10px] text-[#6E6E73] bg-[#F5F5F7] px-2.5 py-1 rounded-xl flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <Package className="w-3 h-3 text-[#2E7D4F]" />
                          Gudang Olahan:
                        </span>
                        <span className="font-semibold text-[#1D1D1F]">
                          {matchedWorkerStock.jumlah} {matchedWorkerStock.satuan}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="p-3 bg-[#FBFBFD] border-t border-[#E8E8ED] flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => navigate(`/internal/admin/produk/${p.id}/edit`)}
                    className="flex-1 py-1.5 px-3 rounded-full text-xs font-semibold bg-white border border-[#E8E8ED] text-[#1D1D1F] hover:bg-[#F5F5F7] hover:border-[#2E7D4F]/40 transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-[#6E6E73]" />
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => setProductToDelete(p)}
                    className="p-1.5 rounded-full text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    title="Hapus Produk"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="bg-white rounded-3xl border border-[#E8E8ED] overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#E8E8ED] bg-[#FBFBFD] text-[#6E6E73] font-semibold">
                <th className="py-3.5 px-4">Produk</th>
                <th className="py-3.5 px-4">Kategori</th>
                <th className="py-3.5 px-4 text-right">Harga Jual</th>
                <th className="py-3.5 px-4 text-center">Stok Etalase</th>
                <th className="py-3.5 px-4 text-center">Gudang Dapur</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E8ED]/70">
              {filteredProducts.map((p) => {
                const isLowStock = p.stok <= 25;
                const matchedWorkerStock = productStocks.find(
                  (ps) => ps.productId === p.id || ps.namaProduk.toLowerCase() === p.nama.toLowerCase()
                );

                return (
                  <tr key={p.id} className="hover:bg-[#F5FBF7]/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-[#E8E8ED] bg-[#F5F5F7]">
                          <SmartImage
                            src={p.gambar}
                            alt={p.nama}
                            aspectRatio="1:1"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-[#1D1D1F] text-xs">{p.nama}</p>
                          <p className="text-[10px] text-[#8E8E93]">
                            Bahan: {p.bahanUtama}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-[#6E6E73]">{p.kategori}</td>

                    <td className="py-3 px-4 text-right font-bold text-[#1D1D1F]">
                      <div>{formatRupiah(p.harga)}</div>
                      {p.hargaPembanding && p.hargaPembanding > p.harga && (
                        <div className="text-[10px] text-[#8E8E93] line-through font-normal">
                          {formatRupiah(p.hargaPembanding)}
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <div className="inline-flex items-center gap-1.5">
                        <span className={`font-bold ${isLowStock ? 'text-amber-700' : 'text-[#1D1D1F]'}`}>
                          {p.stok}
                        </span>
                        {isLowStock && (
                          <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-amber-100 text-amber-800">
                            Stok menipis
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-center text-[#6E6E73]">
                      {matchedWorkerStock ? (
                        <span className="font-semibold text-[#2E7D4F]">
                          {matchedWorkerStock.jumlah} {matchedWorkerStock.satuan}
                        </span>
                      ) : (
                        <span className="text-[#8E8E93]">-</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          p.status === 'Aktif'
                            ? 'bg-[#EBF4EE] text-[#2E7D4F] border border-[#2E7D4F]/20'
                            : 'bg-[#F5F5F7] text-[#6E6E73] border border-[#E8E8ED]'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => navigate(`/internal/admin/produk/${p.id}/edit`)}
                          className="p-1.5 rounded-lg text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-[#F5F5F7] transition-colors cursor-pointer"
                          title="Edit Produk"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setProductToDelete(p)}
                          className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          title="Hapus Produk"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL KONFIRMASI HAPUS PRODUK */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-[#E8E8ED] animate-in zoom-in-95 duration-200">
            <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-5 h-5" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-[#1D1D1F]">
                Hapus Produk Ini?
              </h3>
              <p className="text-xs text-[#6E6E73]">
                Apakah Anda yakin ingin menghapus <strong>"{productToDelete.nama}"</strong> dari katalog etalase? Aksi ini tidak dapat dibatalkan.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                className="flex-1 py-2 rounded-full text-xs font-semibold bg-[#F5F5F7] text-[#6E6E73] hover:text-[#1D1D1F] transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="flex-1 py-2 rounded-full text-xs font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors shadow-xs cursor-pointer"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
