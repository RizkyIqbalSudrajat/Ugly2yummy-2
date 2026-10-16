import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminData } from '../../../context/AdminDataContext';
import { OrderStatus, AdminOrder } from '../../../types/admin';
import { AdminStatusBadge } from '../../../components/internal/AdminStatusBadge';
import { SmartImage } from '../../../components/ui/SmartImage';
import {
  ShoppingCart,
  Search,
  Filter,
  CheckCircle2,
  ChevronRight,
  Package,
  Clock,
  CheckSquare,
  Square,
  ArrowRight,
  Calendar,
  CreditCard,
  Truck,
} from 'lucide-react';

type OrderTabOption = 'Semua' | OrderStatus;

const ORDER_TABS: OrderTabOption[] = [
  'Pesanan Baru',
  'Diproses',
  'Dikemas',
  'Selesai',
  'Semua',
];

export const AdminOrdersPage: React.FC = () => {
  const { orders, updateOrderStatus, addNotification } = useAdminData();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<OrderTabOption>('Pesanan Baru');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Tab Counts
  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = { Semua: orders.length };
    ORDER_TABS.forEach((tab) => {
      if (tab !== 'Semua') {
        counts[tab] = orders.filter((o) => o.status === tab).length;
      }
    });
    return counts;
  }, [orders]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (activeTab !== 'Semua' && o.status !== activeTab) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchId = o.id.toLowerCase().includes(q);
        const matchBuyer = o.pembeli.toLowerCase().includes(q);
        const matchCity = o.alamatLengkap.toLowerCase().includes(q);
        return matchId || matchBuyer || matchCity;
      }
      return true;
    });
  }, [orders, activeTab, searchQuery]);

  // Toggle selection
  const handleToggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedOrderIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    const selectable = filteredOrders.filter((o) => o.status === 'Pesanan Baru');
    if (selectedOrderIds.length === selectable.length && selectable.length > 0) {
      setSelectedOrderIds([]);
    } else {
      setSelectedOrderIds(selectable.map((o) => o.id));
    }
  };

  // Bulk action: Proses pesanan terpilih
  const handleBulkProcess = () => {
    if (selectedOrderIds.length === 0) return;

    let processedCount = 0;
    selectedOrderIds.forEach((id) => {
      const ord = orders.find((o) => o.id === id);
      if (ord && ord.status === 'Pesanan Baru') {
        updateOrderStatus(id, 'Diproses');
        processedCount++;
      }
    });

    addNotification({
      tipe: 'Pesanan',
      judul: `${processedCount} Pesanan Diproses Bersama`,
      isi: `Status pembayaran diverifikasi dan pesanan diteruskan ke tim pengemasan gudang.`,
      linkTujuan: '/internal/admin/pesanan',
    });

    showToast(`${processedCount} pesanan berhasil diproses ke tahap pengemasan!`);
    setSelectedOrderIds([]);
  };

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  const newOrdersCount = tabCounts['Pesanan Baru'] || 0;

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#1D1D1F] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in slide-in-from-top duration-300">
          <CheckCircle2 className="w-5 h-5 text-[#2E7D4F]" />
          <p className="text-xs sm:text-sm font-semibold">{toastMessage}</p>
        </div>
      )}

      {/* Header Info */}
      <div className="bg-white rounded-3xl border border-[#E8E8ED] p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60 inline-flex items-center gap-1">
              <ShoppingCart className="w-3 h-3" />
              Transaksi Belanja Pelanggan
            </span>
            <span className="text-xs text-[#6E6E73]">
              Total {orders.length} Transaksi Tercatat
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1D1D1F]">
            Manajemen Pesanan Pembeli
          </h1>
          <p className="text-xs sm:text-sm text-[#6E6E73] mt-1 max-w-xl">
            Pantau pesanan yang baru masuk, verifikasi konfirmasi pembayaran, siapkan paket pengemasan dapur, dan atur penyerahan ke kurir logistik.
          </p>
        </div>

        {/* Quick Stat Counter */}
        <div className="flex items-center gap-3 bg-[#F5F5F7] px-4 py-3 rounded-2xl border border-[#E8E8ED] self-start sm:self-auto shrink-0">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
            {newOrdersCount}
          </div>
          <div>
            <p className="text-xs font-bold text-[#1D1D1F]">Pesanan Baru</p>
            <p className="text-[11px] text-[#6E6E73]">Menunggu diproses admin</p>
          </div>
        </div>
      </div>

      {/* Tab Filter Bar (Scrollable on mobile) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {ORDER_TABS.map((tab) => {
          const count = tabCounts[tab] || 0;
          const isActive = activeTab === tab;

          return (
            <button
              key={tab}
              type="button"
              onClick={() => {
                setActiveTab(tab);
                setSelectedOrderIds([]);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-[#1D1D1F] text-white shadow-xs'
                  : 'bg-white text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-[#F5F5F7] border border-[#E8E8ED]'
              }`}
            >
              <span>{tab}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-[#F5F5F7] text-[#6E6E73]'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Toolbar: Search & Bulk Action */}
      <div className="bg-white rounded-3xl border border-[#E8E8ED] p-3.5 sm:p-4 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#8E8E93] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari ID pesanan, nama pembeli, atau kota tujuan..."
            className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm rounded-full bg-[#F5F5F7] border-0 focus:ring-2 focus:ring-[#2E7D4F]/30 text-[#1D1D1F] placeholder:text-[#8E8E93]"
          />
        </div>

        {/* Checkbox Aksi Massal */}
        {activeTab === 'Pesanan Baru' && (
          <div className="flex items-center gap-2 justify-between sm:justify-end">
            <button
              type="button"
              onClick={handleSelectAll}
              className="px-3 py-1.5 rounded-full text-xs font-semibold text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-[#F5F5F7] transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              {selectedOrderIds.length > 0 &&
              selectedOrderIds.length === filteredOrders.filter((o) => o.status === 'Pesanan Baru').length ? (
                <CheckSquare className="w-4 h-4 text-[#2E7D4F]" />
              ) : (
                <Square className="w-4 h-4 text-[#8E8E93]" />
              )}
              <span>Pilih Semua Baru</span>
            </button>

            <button
              type="button"
              onClick={handleBulkProcess}
              disabled={selectedOrderIds.length === 0}
              className="px-4 py-2 rounded-full bg-[#1D1D1F] hover:bg-[#2E7D4F] text-white text-xs font-semibold disabled:opacity-40 transition-colors shadow-xs cursor-pointer inline-flex items-center gap-1.5"
            >
              <span>Proses Pesanan Terpilih ({selectedOrderIds.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Main Content: Desktop Table & Mobile Cards */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#E8E8ED] p-12 text-center shadow-xs">
          <ShoppingCart className="w-10 h-10 text-[#8E8E93] mx-auto mb-3" />
          <h3 className="text-sm font-bold text-[#1D1D1F]">Tidak ada pesanan ditemukan</h3>
          <p className="text-xs text-[#6E6E73] mt-1">
            {searchQuery
              ? `Tidak ada transaksi yang cocok dengan pencarian "${searchQuery}".`
              : `Belum ada pesanan pada status "${activeTab}".`}
          </p>
          {(searchQuery || activeTab !== 'Semua') && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setActiveTab('Semua');
              }}
              className="mt-4 px-4 py-2 text-xs font-semibold rounded-full bg-[#1D1D1F] text-white hover:bg-[#2E7D4F] transition-colors cursor-pointer"
            >
              Tampilkan Semua Pesanan
            </button>
          )}
        </div>
      ) : (
        <>
          {/* DESKTOP TABLE */}
          <div className="hidden md:block bg-white rounded-3xl border border-[#E8E8ED] overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#E8E8ED] bg-[#FBFBFD] text-[#6E6E73] font-semibold">
                  <th className="py-3.5 px-4 w-10"></th>
                  <th className="py-3.5 px-4">ID Pesanan</th>
                  <th className="py-3.5 px-4">Pembeli & Kontak</th>
                  <th className="py-3.5 px-4">Ringkasan Produk</th>
                  <th className="py-3.5 px-4 text-right">Ongkir</th>
                  <th className="py-3.5 px-4 text-right">Total Transaksi</th>
                  <th className="py-3.5 px-4">Metode Bayar</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E8ED]/70">
                {filteredOrders.map((ord) => {
                  const isSelected = selectedOrderIds.includes(ord.id);
                  const isNew = ord.status === 'Pesanan Baru';

                  return (
                    <tr
                      key={ord.id}
                      onClick={() => navigate(`/internal/admin/pesanan/${ord.id}`)}
                      className={`hover:bg-[#F5FBF7]/60 transition-colors cursor-pointer group ${
                        isSelected ? 'bg-[#F5FBF7]' : ''
                      }`}
                    >
                      {/* Checkbox (hanya jika pesanan baru) */}
                      <td className="py-3.5 px-4">
                        {isNew ? (
                          <button
                            type="button"
                            onClick={(e) => handleToggleSelect(ord.id, e)}
                            className="p-1 rounded cursor-pointer text-[#8E8E93] hover:text-[#1D1D1F]"
                          >
                            {isSelected ? (
                              <CheckSquare className="w-4 h-4 text-[#2E7D4F]" />
                            ) : (
                              <Square className="w-4 h-4" />
                            )}
                          </button>
                        ) : (
                          <div className="w-4 h-4" />
                        )}
                      </td>

                      <td className="py-3.5 px-4 font-mono font-semibold text-[#1D1D1F] group-hover:text-[#2E7D4F]">
                        {ord.id}
                      </td>

                      <td className="py-3.5 px-4">
                        <p className="font-bold text-[#1D1D1F]">{ord.pembeli}</p>
                        <p className="text-[11px] text-[#6E6E73]">{ord.noHp}</p>
                        <p className="text-[10px] text-[#8E8E93] truncate max-w-xs mt-0.5">
                          {ord.alamatLengkap}
                        </p>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          {ord.item.slice(0, 2).map((it, idx) => (
                            <p key={idx} className="text-xs text-[#1D1D1F] truncate max-w-xs">
                              {it.jumlah}x {it.namaProduk}
                            </p>
                          ))}
                          {ord.item.length > 2 && (
                            <span className="text-[10px] text-[#8E8E93]">
                              +{ord.item.length - 2} produk lainnya
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right text-[#6E6E73]">
                        {formatRupiah(ord.ongkir)}
                      </td>

                      <td className="py-3.5 px-4 text-right font-bold text-[#1D1D1F]">
                        {formatRupiah(ord.total)}
                      </td>

                      <td className="py-3.5 px-4 text-[#6E6E73]">
                        <span className="px-2 py-0.5 rounded-full bg-[#F5F5F7] text-[10px] font-semibold text-[#48484A]">
                          {ord.metodeBayar}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <AdminStatusBadge status={ord.status} size="sm" />
                      </td>

                      <td className="py-3.5 px-3 text-right">
                        <ChevronRight className="w-4 h-4 text-[#8E8E93] group-hover:text-[#2E7D4F] group-hover:translate-x-0.5 transition-all" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* MOBILE CARDS */}
          <div className="md:hidden space-y-3">
            {filteredOrders.map((ord) => {
              const isSelected = selectedOrderIds.includes(ord.id);
              const isNew = ord.status === 'Pesanan Baru';

              return (
                <div
                  key={ord.id}
                  onClick={() => navigate(`/internal/admin/pesanan/${ord.id}`)}
                  className={`bg-white rounded-2xl border p-4 shadow-xs transition-all cursor-pointer ${
                    isSelected ? 'border-[#2E7D4F] bg-[#F5FBF7]/50' : 'border-[#E8E8ED]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      {isNew && (
                        <button
                          type="button"
                          onClick={(e) => handleToggleSelect(ord.id, e)}
                          className="p-1 rounded cursor-pointer"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-[#2E7D4F]" />
                          ) : (
                            <Square className="w-4 h-4 text-[#8E8E93]" />
                          )}
                        </button>
                      )}
                      <span className="font-mono text-xs font-bold text-[#1D1D1F]">
                        {ord.id}
                      </span>
                    </div>

                    <AdminStatusBadge status={ord.status} size="sm" />
                  </div>

                  <div className="space-y-1 my-2">
                    <h4 className="text-sm font-bold text-[#1D1D1F]">{ord.pembeli}</h4>
                    <p className="text-xs text-[#6E6E73] truncate">{ord.alamatLengkap}</p>
                    <div className="pt-1 text-xs text-[#1D1D1F]">
                      {ord.item.map((it, i) => (
                        <span key={i} className="inline-block mr-2">
                          {it.jumlah}x {it.namaProduk}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2.5 border-t border-[#E8E8ED] flex items-center justify-between text-xs">
                    <span className="font-bold text-[#1D1D1F]">
                      {formatRupiah(ord.total)}
                    </span>
                    <span className="text-[11px] text-[#6E6E73] flex items-center gap-1">
                      {ord.metodeBayar}
                      <ChevronRight className="w-3.5 h-3.5 text-[#8E8E93]" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
