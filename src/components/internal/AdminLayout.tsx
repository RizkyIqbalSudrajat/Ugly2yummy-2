import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useStaffAuth } from '../../context/StaffAuthContext';
import { useAdminData } from '../../context/AdminDataContext';
import {
  LayoutDashboard,
  Bell,
  FileText,
  Calendar,
  ListTodo,
  Package,
  Calculator,
  ShoppingBag,
  ShoppingCart,
  Truck,
  Star,
  BarChart3,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

interface AdminNavItem {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badgeKey?: 'notifikasi' | 'penawaran' | 'pesanan';
}

interface AdminNavGroup {
  title: string;
  items: AdminNavItem[];
}

const NAV_GROUPS: AdminNavGroup[] = [
  {
    title: 'UTAMA',
    items: [
      { to: '/internal/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/internal/admin/notifikasi', label: 'Notifikasi', icon: Bell, badgeKey: 'notifikasi' },
    ],
  },
  {
    title: 'OPERASIONAL',
    items: [
      { to: '/internal/admin/penawaran', label: 'Penawaran Supplier', icon: FileText, badgeKey: 'penawaran' },
      { to: '/internal/admin/jadwal', label: 'Jadwal Penerimaan', icon: Calendar },
      { to: '/internal/admin/tugas', label: 'Tugas Pekerja', icon: ListTodo },
      { to: '/internal/admin/bahan', label: 'Manajemen Bahan', icon: Package },
      { to: '/internal/admin/kalkulasi', label: 'Kalkulasi Produksi', icon: Calculator },
    ],
  },
  {
    title: 'TOKO',
    items: [
      { to: '/internal/admin/produk', label: 'Produk', icon: ShoppingBag },
      { to: '/internal/admin/pesanan', label: 'Pesanan', icon: ShoppingCart, badgeKey: 'pesanan' },
      { to: '/internal/admin/pengiriman', label: 'Pengiriman', icon: Truck },
      { to: '/internal/admin/ulasan', label: 'Ulasan Pembeli', icon: Star },
    ],
  },
  {
    title: 'SISTEM',
    items: [
      { to: '/internal/admin/laporan', label: 'Laporan', icon: BarChart3 },
      { to: '/internal/admin/pengguna', label: 'Pengguna', icon: Users },
      { to: '/internal/admin/pengaturan', label: 'Pengaturan', icon: Settings },
    ],
  },
];

interface RouteInfo {
  title: string;
  subtitle: string;
}

const ROUTE_INFO_MAP: Record<string, RouteInfo> = {
  '/internal/admin/dashboard': {
    title: 'Dashboard Admin',
    subtitle: 'Ringkasan performa operasional, pengolahan bahan, dan penjualan Ugly2Yummy.',
  },
  '/internal/admin/notifikasi': {
    title: 'Notifikasi',
    subtitle: 'Pemberitahuan aktivitas operasional, pengajuan supplier, dan pesanan baru.',
  },
  '/internal/admin/penawaran': {
    title: 'Penawaran Supplier',
    subtitle: 'Kelola dan verifikasi penawaran bahan baku dari mitra petani.',
  },
  '/internal/admin/jadwal': {
    title: 'Jadwal Penerimaan',
    subtitle: 'Jadwal pengiriman dan kedatangan bahan baku di dapur operasional.',
  },
  '/internal/admin/tugas': {
    title: 'Tugas Pekerja',
    subtitle: 'Delegasi dan pantau tugas harian tim operasional & staf dapur.',
  },
  '/internal/admin/bahan': {
    title: 'Manajemen Bahan',
    subtitle: 'Monitoring ketersediaan bahan mentah, susut, dan stok terpilah.',
  },
  '/internal/admin/kalkulasi': {
    title: 'Kalkulasi Produksi',
    subtitle: 'Simulasi resep konversi dan perencanaan kapasitas produksi olahan.',
  },
  '/internal/admin/produk': {
    title: 'Produk Olahan',
    subtitle: 'Kelola katalog produk jadi, harga, deskripsi, dan ketersediaan stok.',
  },
  '/internal/admin/produk/baru': {
    title: 'Tambah Produk Baru',
    subtitle: 'Buat produk olahan baru untuk dipublikasikan ke katalog pembeli.',
  },
  '/internal/admin/pesanan': {
    title: 'Pesanan Pembeli',
    subtitle: 'Pantau dan proses pesanan masuk dari pembeli.',
  },
  '/internal/admin/pengiriman': {
    title: 'Pengiriman & Logistik',
    subtitle: 'Atur logistik, kurir penjemputan, dan resi pengiriman ke pembeli.',
  },
  '/internal/admin/ulasan': {
    title: 'Ulasan Pembeli',
    subtitle: 'Umpan balik, rating, dan testimoni kepuasan pelanggan.',
  },
  '/internal/admin/laporan': {
    title: 'Laporan & Analitik',
    subtitle: 'Analisis dampak food waste, efisiensi konversi, dan laporan keuangan.',
  },
  '/internal/admin/pengguna': {
    title: 'Manajemen Pengguna',
    subtitle: 'Kelola hak akses admin, staf pekerja dapur, dan akun supplier.',
  },
  '/internal/admin/pengaturan': {
    title: 'Pengaturan Sistem',
    subtitle: 'Konfigurasi toko, jam operasional, dan parameter sistem Ugly2Yummy.',
  },
};

export const AdminLayout: React.FC = () => {
  const { staff, logoutStaff } = useStaffAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logoutStaff();
    navigate('/internal/masuk');
  };

  // Determine current page title and subtitle
  const getPageInfo = (): RouteInfo => {
    const path = location.pathname;

    if (ROUTE_INFO_MAP[path]) {
      return ROUTE_INFO_MAP[path];
    }

    if (path.startsWith('/internal/admin/penawaran/')) {
      return {
        title: 'Detail Penawaran Supplier',
        subtitle: 'Tinjau rincian penawaran bahan baku dari mitra petani.',
      };
    }

    if (path.startsWith('/internal/admin/produk/') && path.endsWith('/edit')) {
      return {
        title: 'Edit Produk Olahan',
        subtitle: 'Perbarui informasi produk, harga, dan ketersediaan stok.',
      };
    }

    if (path.startsWith('/internal/admin/pesanan/')) {
      return {
        title: 'Detail Pesanan Pembeli',
        subtitle: 'Informasi lengkap transaksi pembeli, alamat, dan status pembayaran.',
      };
    }

    return {
      title: 'Portal Admin',
      subtitle: 'Sistem manajemen operasional Ugly2Yummy.',
    };
  };

  const pageInfo = getPageInfo();

  const {
    unreadNotificationsCount,
    pendingOffersCount,
    newOrdersCount,
  } = useAdminData();

  const getBadgeValue = (badgeKey?: 'notifikasi' | 'penawaran' | 'pesanan') => {
    if (!badgeKey) return 0;
    if (badgeKey === 'notifikasi') return unreadNotificationsCount;
    if (badgeKey === 'penawaran') return pendingOffersCount;
    if (badgeKey === 'pesanan') return newOrdersCount;
    return 0;
  };

  const renderNavMenu = () => (
    <div className="space-y-6">
      {NAV_GROUPS.map((group) => (
        <div key={group.title} className="space-y-1">
          {/* Section Group Header */}
          <div className="px-3.5 text-[11px] font-semibold tracking-wider text-[#8E8E93] uppercase">
            {group.title}
          </div>

          {/* Group Items */}
          <div className="space-y-0.5">
            {group.items.map((item) => {
              const Icon = item.icon;
              const isHighlighted =
                location.pathname === item.to ||
                (item.to !== '/internal/admin/dashboard' && location.pathname.startsWith(item.to));
              const badgeNum = getBadgeValue(item.badgeKey);

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-3 px-3.5 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
                    isHighlighted
                      ? 'bg-[#F5F5F7] text-[#2E7D4F] font-semibold shadow-xs'
                      : 'text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-[#F5F5F7]/60'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isHighlighted ? 'text-[#2E7D4F]' : 'text-[#6E6E73]'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>

                  {badgeNum > 0 && (
                    <span
                      className={`ml-auto px-2 py-0.5 text-[11px] font-semibold rounded-full transition-colors ${
                        isHighlighted
                          ? 'bg-[#2E7D4F] text-white'
                          : 'bg-[#EBF4EE] text-[#2E7D4F] border border-[#2E7D4F]/20'
                      }`}
                    >
                      {badgeNum}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );

  const renderProfileAndLogout = () => (
    <div className="space-y-3">
      {/* Profile Card */}
      <div className="p-3 bg-[#F5F5F7] rounded-2xl border border-[#E8E8ED] flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-[#2E7D4F] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
          {staff?.inisial || 'RP'}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold text-[#1D1D1F] truncate">
            {staff?.nama || 'Raka Pratama'}
          </p>
          <p className="text-[11px] text-[#6E6E73] truncate">
            {staff?.jabatan || 'Admin Operasional'}
          </p>
          <p className="text-[10px] text-[#6E6E73]/80 truncate">
            {staff?.lokasi || 'Kantor Pusat Ugly2Yummy, Bandung'}
          </p>
        </div>
      </div>

      {/* Logout Button */}
      <button
        type="button"
        onClick={handleLogout}
        className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-medium text-red-600 hover:bg-red-50 transition-colors text-left cursor-pointer"
      >
        <LogOut className="w-4 h-4 text-red-500" />
        <span>Keluar</span>
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FBFBFD] flex flex-col lg:flex-row text-[#1D1D1F]">
      {/* Mobile Top Bar */}
      <header className="lg:hidden sticky top-0 z-30 h-14 bg-white/95 backdrop-blur-md border-b border-[#E8E8ED] px-4 flex items-center justify-between no-print">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="p-1.5 rounded-full hover:bg-[#F5F5F7] text-[#1D1D1F] transition-colors cursor-pointer"
            aria-label="Buka menu navigasi admin"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="min-w-0">
            <h1 className="text-sm font-bold text-[#1D1D1F] tracking-tight truncate">
              {pageInfo.title}
            </h1>
            <p className="text-[10px] text-[#6E6E73]">Portal Admin</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Bell Icon with Red Dot */}
          <Link
            to="/internal/admin/notifikasi"
            className="relative p-2 rounded-full hover:bg-[#F5F5F7] text-[#6E6E73] hover:text-[#1D1D1F] transition-colors cursor-pointer"
            aria-label="Notifikasi admin"
          >
            <Bell className="w-5 h-5" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
            )}
          </Link>

          {/* Initial Avatar */}
          <div className="w-7 h-7 rounded-full bg-[#2E7D4F] text-white flex items-center justify-center font-bold text-xs shadow-xs">
            {staff?.inisial || 'RP'}
          </div>
        </div>
      </header>

      {/* Mobile Drawer (from left) */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative w-[280px] bg-white h-full flex flex-col justify-between shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {/* Header Drawer */}
            <div className="p-4 border-b border-[#E8E8ED] flex items-center justify-between shrink-0">
              <Link
                to="/internal/admin/dashboard"
                className="flex items-center gap-2 select-none group"
              >
                <span className="text-lg font-bold tracking-tight text-[#1D1D1F]">
                  Ugly<span className="text-[#2E7D4F] font-extrabold">2</span>Yummy
                </span>
                <span className="text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 bg-[#EBF4EE] text-[#2E7D4F] rounded-full border border-[#2E7D4F]/20">
                  Admin
                </span>
              </Link>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-full hover:bg-[#F5F5F7] text-[#6E6E73] hover:text-[#1D1D1F] transition-colors cursor-pointer"
                aria-label="Tutup menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Nav Menu */}
            <div className="flex-1 overflow-y-auto p-4">{renderNavMenu()}</div>

            {/* Footer Profile & Logout */}
            <div className="p-4 border-t border-[#E8E8ED] bg-[#FBFBFD] shrink-0">
              {renderProfileAndLogout()}
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar (Fixed left ~260px) */}
      <aside className="hidden lg:flex flex-col w-[260px] shrink-0 h-screen sticky top-0 bg-white border-r border-[#E8E8ED] no-print">
        {/* Brand Header */}
        <div className="p-5 pb-4 shrink-0">
          <Link
            to="/internal/admin/dashboard"
            className="flex items-center gap-2 select-none group"
          >
            <span className="text-xl font-bold tracking-tight text-[#1D1D1F]">
              Ugly<span className="text-[#2E7D4F] font-extrabold group-hover:scale-105 inline-block transition-transform">2</span>Yummy
            </span>
            <span className="text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 bg-[#EBF4EE] text-[#2E7D4F] rounded-full border border-[#2E7D4F]/20">
              Admin
            </span>
          </Link>
        </div>

        {/* Scrollable Navigation Groups */}
        <div className="flex-1 overflow-y-auto px-4 py-2">
          {renderNavMenu()}
        </div>

        {/* Bottom Profile Card & Logout - Fixed at bottom */}
        <div className="p-4 border-t border-[#E8E8ED] shrink-0 bg-white">
          {renderProfileAndLogout()}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-[1200px] mx-auto w-full">
          {/* Desktop Content Header */}
          <div className="hidden lg:flex items-start justify-between gap-4 mb-8 pb-5 border-b border-[#E8E8ED] no-print">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[#1D1D1F]">
                {pageInfo.title}
              </h1>
              <p className="mt-1 text-sm text-[#6E6E73]">
                {pageInfo.subtitle}
              </p>
            </div>

            {/* Top Right Bell Icon with Red Dot */}
            <div className="flex items-center gap-3 shrink-0">
              <Link
                to="/internal/admin/notifikasi"
                className="relative p-2.5 rounded-full bg-white hover:bg-[#F5F5F7] border border-[#E8E8ED] text-[#1D1D1F] transition-all hover:shadow-xs group cursor-pointer"
                title="Notifikasi Admin"
              >
                <Bell className="w-5 h-5 text-[#6E6E73] group-hover:text-[#1D1D1F] transition-colors" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
                )}
              </Link>
            </div>
          </div>

          {/* Child Page Content */}
          <Outlet />
        </div>
      </main>
    </div>
  );
};
