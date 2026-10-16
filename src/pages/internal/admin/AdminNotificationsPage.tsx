import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminData } from '../../../context/AdminDataContext';
import { AdminNotification, AdminNotificationType } from '../../../types/admin';
import {
  Bell,
  CheckCheck,
  Filter,
  Package,
  ShoppingCart,
  Truck,
  AlertTriangle,
  ClipboardList,
  Star,
  Sparkles,
  ChevronRight,
  Clock,
  CheckCircle2,
} from 'lucide-react';

const NOTIF_TYPES: ('Semua' | AdminNotificationType)[] = [
  'Semua',
  'Penawaran',
  'Pesanan',
  'Pengiriman',
  'Stok',
  'Tugas',
  'Ulasan',
  'Sistem',
];

export const AdminNotificationsPage: React.FC = () => {
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    unreadNotificationsCount,
  } = useAdminData();
  const navigate = useNavigate();

  const [activeFilter, setActiveFilter] = useState<'Semua' | AdminNotificationType>('Semua');

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filtered Notifications
  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      if (activeFilter !== 'Semua' && n.tipe !== activeFilter) {
        return false;
      }
      return true;
    });
  }, [notifications, activeFilter]);

  // Grouped by: Hari ini / Kemarin / Lebih lama
  const groupedNotifications = useMemo(() => {
    const hariIni: AdminNotification[] = [];
    const kemarin: AdminNotification[] = [];
    const lebihLama: AdminNotification[] = [];

    filteredNotifications.forEach((n) => {
      const w = n.waktu.toLowerCase();
      if (
        w.includes('baru saja') ||
        w.includes('menit') ||
        w.includes('jam') ||
        w.includes('hari ini') ||
        w.includes('14 okt')
      ) {
        hariIni.push(n);
      } else if (w.includes('kemarin') || w.includes('13 okt')) {
        kemarin.push(n);
      } else {
        lebihLama.push(n);
      }
    });

    return { hariIni, kemarin, lebihLama };
  }, [filteredNotifications]);

  const handleNotificationClick = (notif: AdminNotification) => {
    if (!notif.sudahDibaca) {
      markNotificationAsRead(notif.id);
    }
    if (notif.linkTujuan) {
      navigate(notif.linkTujuan);
    }
  };

  const handleMarkAllRead = () => {
    markAllNotificationsAsRead();
    showToast('Seluruh notifikasi ditandai telah dibaca.');
  };

  const getNotifIcon = (tipe: AdminNotificationType) => {
    switch (tipe) {
      case 'Penawaran':
        return <Sparkles className="w-4 h-4 text-amber-600" />;
      case 'Pesanan':
        return <ShoppingCart className="w-4 h-4 text-blue-600" />;
      case 'Pengiriman':
        return <Truck className="w-4 h-4 text-emerald-600" />;
      case 'Stok':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'Tugas':
        return <ClipboardList className="w-4 h-4 text-indigo-600" />;
      case 'Ulasan':
        return <Star className="w-4 h-4 text-amber-500 fill-amber-400" />;
      case 'Sistem':
      default:
        return <Bell className="w-4 h-4 text-[#2E7D4F]" />;
    }
  };

  const getNotifBadgeColor = (tipe: AdminNotificationType) => {
    switch (tipe) {
      case 'Penawaran':
        return 'bg-amber-100 text-amber-800';
      case 'Pesanan':
        return 'bg-blue-100 text-blue-800';
      case 'Pengiriman':
        return 'bg-emerald-100 text-emerald-800';
      case 'Stok':
        return 'bg-red-100 text-red-700';
      case 'Tugas':
        return 'bg-indigo-100 text-indigo-800';
      case 'Ulasan':
        return 'bg-amber-50 text-amber-700';
      case 'Sistem':
      default:
        return 'bg-[#EBF4EE] text-[#2E7D4F]';
    }
  };

  const renderSection = (title: string, list: AdminNotification[]) => {
    if (list.length === 0) return null;

    return (
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-[#8E8E93] uppercase tracking-wider px-2">
          {title} ({list.length})
        </h3>

        <div className="bg-white rounded-3xl border border-[#E8E8ED] overflow-hidden divide-y divide-[#E8E8ED]/70 shadow-xs">
          {list.map((n) => (
            <div
              key={n.id}
              onClick={() => handleNotificationClick(n)}
              className={`p-4 sm:p-5 flex items-start gap-3.5 hover:bg-[#F5FBF7]/60 transition-colors cursor-pointer group ${
                !n.sudahDibaca ? 'bg-[#FBFBFD]' : ''
              }`}
            >
              {/* Ikon Tipe */}
              <div
                className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 border border-black/5 ${getNotifBadgeColor(
                  n.tipe
                )}`}
              >
                {getNotifIcon(n.tipe)}
              </div>

              {/* Konten Notifikasi */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.2 rounded-full ${getNotifBadgeColor(
                      n.tipe
                    )}`}
                  >
                    {n.tipe}
                  </span>
                  <span className="text-[11px] text-[#8E8E93] flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {n.waktu}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-[#1D1D1F] group-hover:text-[#2E7D4F] transition-colors">
                  {n.judul}
                </h4>
                <p className="text-xs text-[#6E6E73] mt-0.5 leading-relaxed">
                  {n.isi}
                </p>
              </div>

              {/* Titik Hijau jika belum dibaca */}
              <div className="flex items-center gap-2 self-center shrink-0">
                {!n.sudahDibaca && (
                  <span
                    className="w-2.5 h-2.5 rounded-full bg-[#2E7D4F] ring-4 ring-[#EBF4EE]"
                    title="Belum dibaca"
                  />
                )}
                <ChevronRight className="w-4 h-4 text-[#8E8E93] group-hover:text-[#2E7D4F] group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
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

      {/* Header Info */}
      <div className="bg-white rounded-3xl border border-[#E8E8ED] p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#EBF4EE] text-[#2E7D4F] border border-[#2E7D4F]/20 inline-flex items-center gap-1">
              <Bell className="w-3 h-3" />
              Pusat Notifikasi & Aktivitas
            </span>
            {unreadNotificationsCount > 0 ? (
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                {unreadNotificationsCount} Belum Dibaca
              </span>
            ) : (
              <span className="text-xs text-[#6E6E73]">Semua telah dibaca</span>
            )}
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1D1D1F]">
            Notifikasi Sistem Portal Admin
          </h1>
          <p className="text-xs sm:text-sm text-[#6E6E73] mt-1 max-w-xl">
            Pemberitahuan real-time terkait penawaran bahan mitra baru, orderan pelanggan yang masuk, batas kritis stok dapur, serta tugas pekerja.
          </p>
        </div>

        {unreadNotificationsCount > 0 && (
          <button
            type="button"
            onClick={handleMarkAllRead}
            className="px-4 py-2.5 rounded-full bg-[#F5F5F7] text-[#1D1D1F] hover:bg-[#E8E8ED] text-xs font-semibold transition-colors shadow-xs cursor-pointer inline-flex items-center gap-2 self-start sm:self-auto shrink-0"
          >
            <CheckCheck className="w-4 h-4 text-[#2E7D4F]" />
            <span>Tandai Semua Sudah Dibaca</span>
          </button>
        )}
      </div>

      {/* Filter Tabs per Tipe */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {NOTIF_TYPES.map((t) => {
          const isActive = activeFilter === t;
          const count =
            t === 'Semua'
              ? notifications.length
              : notifications.filter((n) => n.tipe === t).length;

          return (
            <button
              key={t}
              type="button"
              onClick={() => setActiveFilter(t)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-[#1D1D1F] text-white shadow-xs'
                  : 'bg-white text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-[#F5F5F7] border border-[#E8E8ED]'
              }`}
            >
              <span>{t}</span>
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

      {/* Daftar Notifikasi yang Dikelompokkan */}
      {filteredNotifications.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#E8E8ED] p-12 text-center shadow-xs">
          <Bell className="w-10 h-10 text-[#8E8E93] mx-auto mb-3" />
          <h3 className="text-sm font-bold text-[#1D1D1F]">Tidak ada notifikasi</h3>
          <p className="text-xs text-[#6E6E73] mt-1">
            Belum ada pemberitahuan baru pada kategori "{activeFilter}".
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {renderSection('Hari Ini', groupedNotifications.hariIni)}
          {renderSection('Kemarin', groupedNotifications.kemarin)}
          {renderSection('Lebih Lama', groupedNotifications.lebihLama)}
        </div>
      )}
    </div>
  );
};
