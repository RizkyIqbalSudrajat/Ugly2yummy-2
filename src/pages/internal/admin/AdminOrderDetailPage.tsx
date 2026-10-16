import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAdminData } from '../../../context/AdminDataContext';
import { AdminStatusBadge } from '../../../components/internal/AdminStatusBadge';
import { SmartImage } from '../../../components/ui/SmartImage';
import {
  ArrowLeft,
  CheckCircle2,
  Package,
  Truck,
  CreditCard,
  User,
  MapPin,
  Phone,
  Calendar,
  AlertCircle,
  Clock,
  Check,
  Send,
  ExternalLink,
} from 'lucide-react';

const ORDER_STAGES = ['Pesanan Baru', 'Diproses', 'Dikemas', 'Selesai'];

export const AdminOrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { orders, updateOrderStatus, shippings, addNotification } = useAdminData();
  const navigate = useNavigate();

  const order = orders.find((o) => o.id === id);

  // Cari data pengiriman jika ada
  const matchedShipping = shippings.find((s) => s.pesananId === id);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  if (!order) {
    return (
      <div className="bg-white rounded-3xl border border-[#E8E8ED] p-12 text-center max-w-lg mx-auto space-y-4 shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-[#F5F5F7] border border-[#E8E8ED] flex items-center justify-center mx-auto text-[#6E6E73]">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-[#1D1D1F]">Pesanan Tidak Ditemukan</h2>
        <p className="text-xs sm:text-sm text-[#6E6E73]">
          Pesanan dengan ID "{id}" tidak ditemukan dalam sistem portal admin.
        </p>
        <Link
          to="/internal/admin/pesanan"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1D1D1F] text-white text-xs font-semibold hover:bg-[#2E7D4F] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar Pesanan</span>
        </Link>
      </div>
    );
  }

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  const cleanPhone = (phone: string) => {
    return phone.replace(/[^0-9]/g, '').replace(/^0/, '62');
  };

  const currentStageIndex = ORDER_STAGES.indexOf(order.status);

  // Handler Tombol Satu Langkah
  const handleNextStep = () => {
    if (order.status === 'Pesanan Baru') {
      updateOrderStatus(order.id, 'Diproses');
      addNotification({
        tipe: 'Pesanan',
        judul: `Pesanan ${order.id} Diproses`,
        isi: `Verifikasi pembayaran selesai. Pesanan diteruskan ke tim pengemasan dapur.`,
        linkTujuan: `/internal/admin/pesanan/${order.id}`,
      });
      showToast(`Pesanan ${order.id} berhasil diubah ke status Diproses!`);
    } else if (order.status === 'Diproses') {
      updateOrderStatus(order.id, 'Dikemas');
      addNotification({
        tipe: 'Pesanan',
        judul: `Pesanan ${order.id} Telah Dikemas`,
        isi: `Paket siap di meja pickup. Stok produk telah dikurangi otomatis.`,
        linkTujuan: `/internal/admin/pesanan/${order.id}`,
      });
      showToast(`Pesanan ${order.id} telah dikemas & stok produk berhasil disesuaikan!`);
    }
  };

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-200">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#1D1D1F] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in slide-in-from-top duration-300">
          <CheckCircle2 className="w-5 h-5 text-[#2E7D4F]" />
          <p className="text-xs sm:text-sm font-semibold">{toastMessage}</p>
        </div>
      )}

      {/* Header Navigation */}
      <div className="flex items-center justify-between gap-4">
        <Link
          to="/internal/admin/pesanan"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#6E6E73] hover:text-[#1D1D1F] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar Pesanan</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-[#6E6E73]">{order.id}</span>
          <AdminStatusBadge status={order.status} size="sm" />
        </div>
      </div>

      {/* Stepper Status Transaksi */}
      <div className="bg-white rounded-3xl border border-[#E8E8ED] p-5 sm:p-6 shadow-xs">
        <h3 className="text-xs font-bold tracking-wider text-[#8E8E93] uppercase mb-4">
          Status Progres Transaksi
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {ORDER_STAGES.map((stage, idx) => {
            const isPast = currentStageIndex > idx;
            const isCurrent = currentStageIndex === idx;

            return (
              <div
                key={stage}
                className={`p-3.5 rounded-2xl border transition-all ${
                  isCurrent
                    ? 'bg-[#EBF4EE] border-[#2E7D4F]/30 text-[#2E7D4F]'
                    : isPast
                    ? 'bg-[#FBFBFD] border-[#E8E8ED] text-[#1D1D1F]'
                    : 'bg-[#F5F5F7]/50 border-transparent text-[#8E8E93]'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isCurrent || isPast ? 'bg-[#2E7D4F] text-white' : 'bg-[#E8E8ED] text-[#8E8E93]'
                    }`}
                  >
                    {isPast ? <Check className="w-2.5 h-2.5" /> : idx + 1}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider">
                    {isCurrent ? 'Tahap Ini' : isPast ? 'Selesai' : 'Berikutnya'}
                  </span>
                </div>
                <p className="text-xs font-bold">{stage}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Detail Pesanan (8 col) & Ringkasan / Aksi (4 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ================= KOLOM KIRI (8 Kolom) ================= */}
        <div className="lg:col-span-8 space-y-6">
          {/* 1. Item Belanja */}
          <div className="bg-white rounded-3xl border border-[#E8E8ED] p-5 sm:p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-[#1D1D1F] border-b border-[#E8E8ED] pb-3 flex items-center justify-between">
              <span>Item Produk yang Dipesan</span>
              <span className="text-xs font-normal text-[#6E6E73]">
                {order.item.reduce((s, it) => s + it.jumlah, 0)} Total Unit
              </span>
            </h3>

            <div className="divide-y divide-[#E8E8ED]/70">
              {order.item.map((it, idx) => (
                <div key={idx} className="py-3.5 flex items-center gap-3.5 first:pt-0 last:pb-0">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0 border border-[#E8E8ED] bg-[#F5F5F7]">
                    <SmartImage
                      src={it.gambar || 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?auto=format&fit=crop&w=400&q=80'}
                      alt={it.namaProduk}
                      aspectRatio="1:1"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-[#1D1D1F] truncate">
                      {it.namaProduk}
                    </h4>
                    <p className="text-xs text-[#6E6E73] mt-0.5">
                      {formatRupiah(it.harga)} × {it.jumlah} unit
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-bold text-[#1D1D1F]">
                      {formatRupiah(it.subtotal || it.harga * it.jumlah)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Rincian Finansial Belanja */}
            <div className="pt-4 border-t border-[#E8E8ED] space-y-2 text-xs">
              <div className="flex items-center justify-between text-[#6E6E73]">
                <span>Subtotal Produk:</span>
                <span>
                  {formatRupiah(order.item.reduce((sum, i) => sum + (i.subtotal || i.harga * i.jumlah), 0))}
                </span>
              </div>
              <div className="flex items-center justify-between text-[#6E6E73]">
                <span>Biaya Ongkos Kirim:</span>
                <span>{formatRupiah(order.ongkir)}</span>
              </div>
              <div className="flex items-center justify-between text-sm font-bold text-[#1D1D1F] pt-2 border-t border-[#E8E8ED]">
                <span>Total Pembayaran:</span>
                <span className="text-[#2E7D4F] text-base">{formatRupiah(order.total)}</span>
              </div>
            </div>
          </div>

          {/* 2. Informasi Pembeli & Alamat Pengiriman */}
          <div className="bg-white rounded-3xl border border-[#E8E8ED] p-5 sm:p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-[#1D1D1F] border-b border-[#E8E8ED] pb-3">
              Informasi Pelanggan & Alamat
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Kontak */}
              <div className="p-4 rounded-2xl bg-[#FBFBFD] border border-[#E8E8ED] space-y-2.5">
                <div className="flex items-center gap-2 text-[#2E7D4F] font-bold">
                  <User className="w-4 h-4" />
                  <span>Data Pelanggan</span>
                </div>
                <p className="font-bold text-[#1D1D1F] text-sm">{order.pembeli}</p>
                <p className="text-[#6E6E73]">{order.noHp}</p>
                <a
                  href={`https://wa.me/${cleanPhone(order.noHp)}?text=Halo%20${encodeURIComponent(
                    order.pembeli
                  )},%20kami%20dari%20admin%20Ugly2Yummy%20mengenai%20pesanan%20${order.id}.`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#EBF4EE] text-[#2E7D4F] font-semibold hover:bg-[#d8edd0] transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Chat WhatsApp</span>
                </a>
              </div>

              {/* Alamat */}
              <div className="p-4 rounded-2xl bg-[#FBFBFD] border border-[#E8E8ED] space-y-2.5">
                <div className="flex items-center gap-2 text-[#2E7D4F] font-bold">
                  <MapPin className="w-4 h-4" />
                  <span>Alamat Pengiriman</span>
                </div>
                <p className="text-[#1D1D1F] leading-relaxed font-medium">
                  {order.alamatLengkap}
                </p>
                <div className="pt-1 text-[11px] text-[#8E8E93] flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Dipesan pada: {order.tanggal}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= KOLOM KANAN (Sticky Panel Aksi & Ekspedisi) ================= */}
        <div className="lg:col-span-4 sticky top-6 space-y-4">
          <div className="bg-white rounded-3xl border border-[#E8E8ED] p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#1D1D1F] border-b border-[#E8E8ED] pb-3">
              Tindakan Status Pesanan
            </h3>

            {/* Metode Bayar */}
            <div className="p-3.5 rounded-2xl bg-[#FBFBFD] border border-[#E8E8ED] space-y-1 text-xs">
              <span className="text-[#6E6E73]">Metode Pembayaran:</span>
              <p className="font-bold text-[#1D1D1F] flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-[#2E7D4F]" />
                {order.metodeBayar}
              </p>
            </div>

            {/* Tombol Satu Langkah & Info Pengiriman */}
            {order.status === 'Pesanan Baru' && (
              <div className="space-y-2.5">
                <p className="text-xs text-[#6E6E73]">
                  Pembeli telah menyelesaikan pembayaran. Proses pesanan untuk mulai disiapkan tim dapur.
                </p>
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="w-full py-2.5 px-4 rounded-full bg-[#1D1D1F] text-white text-xs font-semibold hover:bg-[#2E7D4F] transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-2"
                >
                  <Package className="w-4 h-4" />
                  <span>Proses Pesanan Ini</span>
                </button>
              </div>
            )}

            {order.status === 'Diproses' && (
              <div className="space-y-2.5">
                <p className="text-xs text-[#6E6E73]">
                  Produk sedang dikemas di gudang dapur. Tandai telah dikemas agar stok otomatis berkurang.
                </p>
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="w-full py-2.5 px-4 rounded-full bg-[#2E7D4F] text-white text-xs font-semibold hover:bg-[#256640] transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Tandai Selesai Dikemas</span>
                </button>
              </div>
            )}

            {order.status === 'Dikemas' && (
              <div className="space-y-3">
                <div className="p-3 rounded-2xl bg-[#ECFDF3] border border-[#A6F4C5] text-xs text-[#027A48]">
                  Pesanan telah selesai dikemas. Stok produk etalase telah dikurangi. Silakan atur penjemputan kurir.
                </div>

                <Link
                  to={`/internal/admin/pengiriman?pesananId=${order.id}`}
                  className="w-full py-2.5 px-4 rounded-full bg-[#2E7D4F] text-white text-xs font-semibold hover:bg-[#256640] transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-2 text-center"
                >
                  <Truck className="w-4 h-4" />
                  <span>Atur Pengiriman & Resi</span>
                </Link>
              </div>
            )}

            {order.status === 'Selesai' && (
              <div className="space-y-2">
                <div className="p-3.5 rounded-2xl bg-[#EBF4EE] border border-[#2E7D4F]/30 text-xs text-[#2E7D4F] space-y-1">
                  <p className="font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    Transaksi Selesai & Terkirim
                  </p>
                  <p className="text-[11px] text-[#2E7D4F]/90">
                    Paket telah berhasil diserahkan dan diterima oleh pelanggan.
                  </p>
                </div>

                {order.resiPengiriman && (
                  <div className="p-3 rounded-2xl bg-[#F5F5F7] border border-[#E8E8ED] text-xs">
                    <span className="text-[#8E8E93]">Nomor Resi:</span>
                    <p className="font-mono font-bold text-[#1D1D1F] mt-0.5">
                      {order.resiPengiriman}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Riwayat Pengiriman jika sudah ada */}
            {matchedShipping && (
              <div className="pt-3 border-t border-[#E8E8ED] space-y-2 text-xs">
                <span className="font-semibold text-[#1D1D1F] flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-[#2E7D4F]" />
                  Logistik Ekspedisi
                </span>
                <div className="p-3 rounded-2xl bg-[#FBFBFD] border border-[#E8E8ED] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[#6E6E73]">Kurir:</span>
                    <span className="font-bold text-[#1D1D1F]">
                      {matchedShipping.kurir} ({matchedShipping.layanan})
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#6E6E73]">No. Resi:</span>
                    <span className="font-mono font-bold text-[#2E7D4F]">
                      {matchedShipping.nomorResi}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#6E6E73]">Status Kirim:</span>
                    <span className="font-semibold text-[#1D1D1F]">
                      {matchedShipping.status}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
