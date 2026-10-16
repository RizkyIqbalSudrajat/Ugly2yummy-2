import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAdminData } from '../../../context/AdminDataContext';
import {
  AdminShipping,
  ShippingCourier,
  ShippingStatus,
  AdminOrder,
} from '../../../types/admin';
import { AdminStatusBadge } from '../../../components/internal/AdminStatusBadge';
import {
  Truck,
  Search,
  Filter,
  Copy,
  Check,
  CheckCircle2,
  Package,
  Calendar,
  Clock,
  MapPin,
  ChevronRight,
  Plus,
  X,
  ExternalLink,
  ShieldCheck,
  Send,
} from 'lucide-react';

const SHIPPING_TABS: ('Semua' | ShippingStatus)[] = [
  'Semua',
  'Menunggu Kurir',
  'Dalam Perjalanan',
  'Terkirim',
];

const COURIER_OPTIONS: ShippingCourier[] = ['JNE', 'SiCepat', 'J&T', 'GoSend'];
const SERVICE_OPTIONS = ['Reguler', 'NextDay', 'Instant', 'SameDay', 'Kargo'];

export const AdminShippingPage: React.FC = () => {
  const { shippings, addShipping, updateShippingStatus, orders, updateOrderStatus, addNotification } = useAdminData();
  const [searchParams] = useSearchParams();

  const [activeTab, setActiveTab] = useState<'Semua' | ShippingStatus>('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal Atur Pengiriman
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string>('');
  const [selectedCourier, setSelectedCourier] = useState<ShippingCourier>('JNE');
  const [selectedService, setSelectedService] = useState<string>('Reguler');
  const [resiInput, setResiInput] = useState<string>('');

  // Riwayat Status Modal / Drawer
  const [selectedShippingDetail, setSelectedShippingDetail] = useState<AdminShipping | null>(null);

  // Copy feedbacks
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [copiedResiId, setCopiedResiId] = useState<string | null>(null);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Check URL query param for pesananId
  useEffect(() => {
    const pId = searchParams.get('pesananId');
    if (pId) {
      setSelectedOrderId(pId);
      const matchedOrder = orders.find((o) => o.id === pId);
      if (matchedOrder?.resiPengiriman) {
        setResiInput(matchedOrder.resiPengiriman);
      } else {
        setResiInput(`JNE${Date.now().toString().slice(-9)}`);
      }
      setShowConfigModal(true);
    }
  }, [searchParams, orders]);

  // Orders that are Dikemas (ready for shipping configuration)
  const readyOrders = useMemo(() => {
    return orders.filter(
      (o) => o.status === 'Dikemas' || o.id === selectedOrderId
    );
  }, [orders, selectedOrderId]);

  // Selected Order Object in modal
  const targetOrder = useMemo(() => {
    return orders.find((o) => o.id === selectedOrderId);
  }, [orders, selectedOrderId]);

  // Tab Counts
  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = { Semua: shippings.length };
    SHIPPING_TABS.forEach((tab) => {
      if (tab !== 'Semua') {
        counts[tab] = shippings.filter((s) => s.status === tab).length;
      }
    });
    return counts;
  }, [shippings]);

  // Filtered Shippings
  const filteredShippings = useMemo(() => {
    return shippings.filter((item) => {
      if (activeTab !== 'Semua' && item.status !== activeTab) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchPesanan = item.pesananId.toLowerCase().includes(q);
        const matchPembeli = item.namaPembeli.toLowerCase().includes(q);
        const matchResi = item.nomorResi.toLowerCase().includes(q);
        const matchKurir = item.kurir.toLowerCase().includes(q);
        const matchKota = item.tujuanKota.toLowerCase().includes(q);
        return matchPesanan || matchPembeli || matchResi || matchKurir || matchKota;
      }
      return true;
    });
  }, [shippings, activeTab, searchQuery]);

  // Copy full address helper
  const handleCopyAddress = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2500);
  };

  // Copy resi helper
  const handleCopyResi = (resi: string, id: string) => {
    navigator.clipboard.writeText(resi);
    setCopiedResiId(id);
    setTimeout(() => setCopiedResiId(null), 2500);
    showToast(`Nomor resi ${resi} disalin!`);
  };

  // Handle Save Atur Pengiriman
  const handleSaveShipping = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderId || !resiInput.trim()) {
      showToast('Harap pilih pesanan dan isi nomor resi.');
      return;
    }

    const ord = orders.find((o) => o.id === selectedOrderId);
    if (!ord) return;

    // Check if shipping already exists for this order
    const existing = shippings.find((s) => s.pesananId === selectedOrderId);
    if (existing) {
      updateShippingStatus(existing.id, 'Dalam Perjalanan', `Nomor resi ${resiInput.trim()} diperbarui.`);
      updateOrderStatus(ord.id, ord.status, resiInput.trim());
      showToast(`Pengiriman untuk ${ord.id} berhasil diperbarui!`);
    } else {
      addShipping({
        pesananId: ord.id,
        namaPembeli: ord.pembeli,
        kurir: selectedCourier,
        layanan: selectedService,
        nomorResi: resiInput.trim(),
        status: 'Menunggu Kurir',
        tanggalKirim: '14 Okt 2026',
        tujuanKota: ord.alamatLengkap.split(',')[1]?.trim() || 'Jakarta',
      });

      updateOrderStatus(ord.id, ord.status, resiInput.trim());

      addNotification({
        tipe: 'Pengiriman',
        judul: `Resi Diterbitkan: ${ord.id}`,
        isi: `${selectedCourier} (${selectedService}) - Resi: ${resiInput.trim()} untuk ${ord.pembeli}.`,
        linkTujuan: '/internal/admin/pengiriman',
      });

      showToast(`Pengiriman & nomor resi untuk ${ord.id} berhasil disimpan!`);
    }

    setShowConfigModal(false);
  };

  // Ubah status pengiriman: Menunggu Kurir -> Dalam Perjalanan -> Terkirim
  const handleStatusTransition = (
    shipping: AdminShipping,
    nextStatus: ShippingStatus
  ) => {
    updateShippingStatus(
      shipping.id,
      nextStatus,
      nextStatus === 'Terkirim'
        ? `Paket telah diterima oleh ${shipping.namaPembeli}. Transaksi diselesaikan otomatis.`
        : nextStatus === 'Dalam Perjalanan'
        ? `Paket di-pickup oleh kurir ${shipping.kurir} dan sedang menuju kota tujuan.`
        : undefined
    );

    addNotification({
      tipe: 'Pengiriman',
      judul: `Status Pengiriman ${shipping.pesananId}: ${nextStatus}`,
      isi: `Paket ${shipping.kurir} (${shipping.nomorResi}) sekarang berstatus ${nextStatus}.`,
      linkTujuan: '/internal/admin/pengiriman',
    });

    if (nextStatus === 'Terkirim') {
      showToast(`Paket ${shipping.pesananId} Terkirim! Status pesanan otomatis diselesaikan.`);
    } else {
      showToast(`Status pengiriman ${shipping.pesananId} diubah ke ${nextStatus}.`);
    }
  };

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
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 inline-flex items-center gap-1">
              <Truck className="w-3 h-3 text-amber-600" />
              Logistik & Ekspedisi Kurir
            </span>
            <span className="text-xs text-[#6E6E73]">
              {shippings.length} Paket Tercatat
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1D1D1F]">
            Manajemen Pengiriman Paket
          </h1>
          <p className="text-xs sm:text-sm text-[#6E6E73] mt-1 max-w-xl">
            Kelola penyerahan paket produk olahan ke kurir (JNE, SiCepat, J&T, GoSend), input nomor resi pengiriman, pantau transit, dan sinkronisasi otomatis status pesanan selesai.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setSelectedOrderId(readyOrders[0]?.id || '');
            setResiInput(`JNE${Date.now().toString().slice(-9)}`);
            setShowConfigModal(true);
          }}
          className="px-4 py-2.5 rounded-full bg-[#2E7D4F] text-white text-xs font-semibold hover:bg-[#256640] transition-colors shadow-xs cursor-pointer inline-flex items-center gap-2 self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Atur Pengiriman Baru</span>
        </button>
      </div>

      {/* Tab Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {SHIPPING_TABS.map((tab) => {
          const count = tabCounts[tab] || 0;
          const isActive = activeTab === tab;

          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
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

      {/* Search Toolbar */}
      <div className="bg-white rounded-3xl border border-[#E8E8ED] p-3.5 sm:p-4 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-[#8E8E93] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nomor resi, ID pesanan, nama pembeli, atau kota tujuan..."
            className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm rounded-full bg-[#F5F5F7] border-0 focus:ring-2 focus:ring-[#2E7D4F]/30 text-[#1D1D1F] placeholder:text-[#8E8E93]"
          />
        </div>
      </div>

      {/* Main Content: Desktop Table & Mobile Cards */}
      {filteredShippings.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#E8E8ED] p-12 text-center shadow-xs">
          <Truck className="w-10 h-10 text-[#8E8E93] mx-auto mb-3" />
          <h3 className="text-sm font-bold text-[#1D1D1F]">Tidak ada paket pengiriman</h3>
          <p className="text-xs text-[#6E6E73] mt-1">
            {searchQuery
              ? `Tidak ada resi atau pesanan yang cocok dengan "${searchQuery}".`
              : `Belum ada kiriman pada status "${activeTab}".`}
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
              Reset Filter
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-[#E8E8ED] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#E8E8ED] bg-[#FBFBFD] text-[#6E6E73] font-semibold">
                  <th className="py-3.5 px-4">ID Pesanan</th>
                  <th className="py-3.5 px-4">Pembeli & Tujuan</th>
                  <th className="py-3.5 px-4">Ekspedisi & Layanan</th>
                  <th className="py-3.5 px-4">Nomor Resi</th>
                  <th className="py-3.5 px-4">Tanggal Kirim</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Perbarui Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E8ED]/70">
                {filteredShippings.map((shp) => {
                  const isCopied = copiedResiId === shp.id;

                  return (
                    <tr key={shp.id} className="hover:bg-[#F5FBF7]/50 transition-colors">
                      <td className="py-3.5 px-4">
                        <Link
                          to={`/internal/admin/pesanan/${shp.pesananId}`}
                          className="font-mono font-semibold text-[#1D1D1F] hover:text-[#2E7D4F] hover:underline inline-flex items-center gap-1"
                        >
                          {shp.pesananId}
                          <ExternalLink className="w-3 h-3 text-[#8E8E93]" />
                        </Link>
                      </td>

                      <td className="py-3.5 px-4">
                        <p className="font-bold text-[#1D1D1F]">{shp.namaPembeli}</p>
                        <p className="text-[11px] text-[#6E6E73] flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-[#8E8E93]" />
                          {shp.tujuanKota}
                        </p>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-bold text-[#1D1D1F]">{shp.kurir}</span>
                        <span className="text-[11px] text-[#6E6E73] ml-1.5 bg-[#F5F5F7] px-2 py-0.5 rounded-full">
                          {shp.layanan}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-[#1D1D1F] bg-[#F5F5F7] px-2 py-1 rounded-lg">
                            {shp.nomorResi}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopyResi(shp.nomorResi, shp.id)}
                            className="p-1 rounded-lg hover:bg-[#E8E8ED] text-[#6E6E73] cursor-pointer"
                            title="Salin nomor resi"
                          >
                            {isCopied ? (
                              <Check className="w-3.5 h-3.5 text-[#2E7D4F]" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-[#6E6E73]">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-[#8E8E93]" />
                          {shp.tanggalKirim}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <AdminStatusBadge status={shp.status} size="sm" />
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {shp.status === 'Menunggu Kurir' && (
                            <button
                              type="button"
                              onClick={() => handleStatusTransition(shp, 'Dalam Perjalanan')}
                              className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors cursor-pointer"
                            >
                              Pickup Kurir
                            </button>
                          )}

                          {shp.status === 'Dalam Perjalanan' && (
                            <button
                              type="button"
                              onClick={() => handleStatusTransition(shp, 'Terkirim')}
                              className="px-3 py-1 rounded-full text-xs font-semibold bg-[#2E7D4F] text-white hover:bg-[#256640] transition-colors shadow-xs cursor-pointer inline-flex items-center gap-1"
                            >
                              <Check className="w-3 h-3" />
                              Tandai Terkirim
                            </button>
                          )}

                          {shp.status === 'Terkirim' && (
                            <span className="text-[11px] text-[#2E7D4F] font-semibold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Selesai
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={() => setSelectedShippingDetail(shp)}
                            className="p-1 text-[#8E8E93] hover:text-[#1D1D1F] rounded-lg ml-1"
                            title="Lihat riwayat status"
                          >
                            <Clock className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= MODAL ATUR PENGIRIMAN ================= */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-[#E8E8ED] animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E8E8ED] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <Truck className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-[#1D1D1F]">
                  Atur Pengiriman & Terbitkan Resi
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowConfigModal(false)}
                className="p-1 rounded-full hover:bg-[#F5F5F7] text-[#8E8E93] hover:text-[#1D1D1F]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveShipping} className="space-y-4 text-xs">
              {/* 1. Pilih Pesanan Dikemas */}
              <div>
                <label className="block font-semibold text-[#1D1D1F] mb-1">
                  Pilih Pesanan Siap Kirim (Dikemas):
                </label>
                <select
                  value={selectedOrderId}
                  onChange={(e) => setSelectedOrderId(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl bg-[#F5F5F7] border-0 text-[#1D1D1F] focus:ring-2 focus:ring-[#2E7D4F]/30"
                >
                  <option value="">-- Pilih pesanan pembeli --</option>
                  {readyOrders.map((ord) => (
                    <option key={ord.id} value={ord.id}>
                      {ord.id} - {ord.pembeli} ({ord.status})
                    </option>
                  ))}
                </select>
              </div>

              {/* 2. Alamat Lengkap Pembeli (Bisa Disalin) */}
              {targetOrder && (
                <div className="p-3.5 rounded-2xl bg-[#FBFBFD] border border-[#E8E8ED] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#1D1D1F] flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#2E7D4F]" />
                      Alamat Penerima Paket:
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyAddress(`${targetOrder.pembeli} (${targetOrder.noHp}) - ${targetOrder.alamatLengkap}`)}
                      className="px-2.5 py-1 rounded-lg bg-white border border-[#E8E8ED] hover:bg-[#F5F5F7] text-[#1D1D1F] font-semibold text-[10px] inline-flex items-center gap-1 cursor-pointer"
                    >
                      {copiedAddress ? (
                        <>
                          <Check className="w-3 h-3 text-[#2E7D4F]" />
                          <span>Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-[#8E8E93]" />
                          <span>Salin Alamat Lengkap</span>
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-xs text-[#1D1D1F] leading-relaxed">
                    <strong>{targetOrder.pembeli}</strong> ({targetOrder.noHp})<br />
                    {targetOrder.alamatLengkap}
                  </p>
                </div>
              )}

              {/* 3. Pilih Kurir & Layanan */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#1D1D1F] mb-1">
                    Kurir Ekspedisi:
                  </label>
                  <select
                    value={selectedCourier}
                    onChange={(e) => setSelectedCourier(e.target.value as ShippingCourier)}
                    className="w-full p-2.5 rounded-xl bg-[#F5F5F7] border-0 text-[#1D1D1F]"
                  >
                    {COURIER_OPTIONS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#1D1D1F] mb-1">
                    Layanan Pengiriman:
                  </label>
                  <select
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#F5F5F7] border-0 text-[#1D1D1F]"
                  >
                    {SERVICE_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 4. Input Nomor Resi & Tombol Salin */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-semibold text-[#1D1D1F]">
                    Nomor Resi / AWB:
                  </label>
                  <button
                    type="button"
                    onClick={() => setResiInput(`${selectedCourier.toUpperCase()}${Date.now().toString().slice(-9)}`)}
                    className="text-[11px] text-[#2E7D4F] hover:underline cursor-pointer"
                  >
                    Generate Resi Otomatis
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={resiInput}
                    onChange={(e) => setResiInput(e.target.value)}
                    placeholder="Contoh: JNE88291028301"
                    required
                    className="flex-1 p-2.5 rounded-xl bg-[#F5F5F7] border-0 font-mono text-xs font-bold text-[#1D1D1F]"
                  />
                  <button
                    type="button"
                    onClick={() => handleCopyResi(resiInput, 'modal')}
                    disabled={!resiInput}
                    className="px-3 py-2.5 rounded-xl bg-[#F5F5F7] hover:bg-[#E8E8ED] text-[#1D1D1F] font-semibold text-xs inline-flex items-center gap-1 cursor-pointer shrink-0 disabled:opacity-40"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin Resi</span>
                  </button>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E8E8ED]">
                <button
                  type="button"
                  onClick={() => setShowConfigModal(false)}
                  className="px-4 py-2 rounded-full bg-[#F5F5F7] text-[#6E6E73] hover:text-[#1D1D1F] cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={!selectedOrderId || !resiInput}
                  className="px-5 py-2 rounded-full bg-[#2E7D4F] text-white hover:bg-[#256640] disabled:opacity-50 transition-colors shadow-xs cursor-pointer font-semibold"
                >
                  Simpan & Terbitkan Resi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL DETAIL RIWAYAT STATUS PENGIRIMAN ================= */}
      {selectedShippingDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-[#E8E8ED] animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-[#E8E8ED] pb-3">
              <div>
                <h3 className="text-base font-bold text-[#1D1D1F]">
                  Riwayat Logistik Pengiriman
                </h3>
                <p className="text-xs text-[#6E6E73] font-mono mt-0.5">
                  {selectedShippingDetail.kurir} · {selectedShippingDetail.nomorResi}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedShippingDetail(null)}
                className="p-1 rounded-full hover:bg-[#F5F5F7] text-[#8E8E93] hover:text-[#1D1D1F]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Timeline */}
            <div className="space-y-3 text-xs max-h-60 overflow-y-auto pr-1">
              {selectedShippingDetail.riwayatStatus.map((log, i) => (
                <div key={i} className="flex items-start gap-3 relative pl-4 border-l-2 border-[#2E7D4F]">
                  <span className="w-2 h-2 rounded-full bg-[#2E7D4F] absolute -left-[5px] top-1" />
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#1D1D1F]">{log.status}</span>
                      <span className="text-[10px] text-[#8E8E93]">· {log.waktu}</span>
                    </div>
                    <p className="text-[#6E6E73] leading-relaxed">{log.catatan}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setSelectedShippingDetail(null)}
              className="w-full py-2.5 rounded-full bg-[#1D1D1F] text-white text-xs font-semibold hover:bg-[#2E7D4F] transition-colors"
            >
              Tutup Riwayat
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
