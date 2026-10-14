import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useStaffAuth } from '../../context/StaffAuthContext';
import {
  LayoutDashboard,
  PackageCheck,
  ShieldCheck,
  Calculator,
  ChefHat,
  Boxes,
  ListTodo,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

interface WorkerLayoutProps {
  children?: React.ReactNode;
}

interface WorkerNavItem {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  showBadge?: boolean;
}

const NAV_ITEMS: WorkerNavItem[] = [
  { to: '/internal/pekerja/ringkasan', label: 'Ringkasan', icon: LayoutDashboard },
  { to: '/internal/pekerja/penerimaan', label: 'Penerimaan Bahan', icon: PackageCheck },
  { to: '/internal/pekerja/seleksi', label: 'Seleksi (QC)', icon: ShieldCheck },
  { to: '/internal/pekerja/kalkulasi', label: 'Kalkulasi Produksi', icon: Calculator },
  { to: '/internal/pekerja/produksi', label: 'Produksi', icon: ChefHat },
  { to: '/internal/pekerja/stok', label: 'Stok', icon: Boxes },
  { to: '/internal/pekerja/tugas', label: 'Tugas Saya', icon: ListTodo, showBadge: true },
];

export const WorkerLayout: React.FC<WorkerLayoutProps> = ({ children }) => {
  const { staff, logoutStaff, pendingTasksCount } = useStaffAuth();
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

  // Find active item title for mobile header
  const currentItem =
    NAV_ITEMS.find((item) => location.pathname === item.to || location.pathname.startsWith(item.to)) ||
    NAV_ITEMS[0];

  const renderNavContent = () => (
    <div className="flex flex-col h-full justify-between">
      {/* Top Header & Navigation Links */}
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="px-3 pt-2">
          <Link
            to="/internal/pekerja/ringkasan"
            className="flex items-center gap-2 select-none group"
          >
            <span className="text-xl font-bold tracking-tight text-[#1D1D1F]">
              Ugly<span className="text-[#2E7D4F] font-extrabold group-hover:scale-105 inline-block transition-transform">2</span>Yummy
            </span>
            <span className="text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 bg-[#EBF4EE] text-[#2E7D4F] rounded-full border border-[#2E7D4F]/20">
              Pekerja
            </span>
          </Link>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isHighlighted =
              location.pathname === item.to ||
              (item.to !== '/internal/pekerja/ringkasan' && location.pathname.startsWith(item.to));

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${
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

                {item.showBadge && pendingTasksCount > 0 && (
                  <span
                    className={`ml-auto px-2 py-0.5 text-xs font-semibold rounded-full transition-colors ${
                      isHighlighted
                        ? 'bg-[#2E7D4F] text-white'
                        : 'bg-[#EBF4EE] text-[#2E7D4F] border border-[#2E7D4F]/20'
                    }`}
                  >
                    {pendingTasksCount}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Area: Profile Card & Logout */}
      <div className="pt-4 border-t border-[#E8E8ED] space-y-3">
        {/* Profile Card */}
        <div className="p-3 bg-[#F5F5F7] rounded-2xl border border-[#E8E8ED] flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#2E7D4F] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
            {staff?.inisial || 'DL'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-[#1D1D1F] truncate">
              {staff?.nama || 'Dewi Lestari'}
            </p>
            <p className="text-[11px] text-[#6E6E73] truncate">
              {staff?.jabatan || 'Staf Produksi'}
            </p>
            <p className="text-[10px] text-[#6E6E73]/80 truncate">
              {staff?.lokasi || 'Dapur Produksi Ugly2Yummy, Bandung'}
            </p>
          </div>
        </div>

        {/* Action Logout */}
        <div className="space-y-1">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-medium text-red-600 hover:bg-red-50 transition-colors text-left cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-red-500" />
            <span>Keluar</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FBFBFD] flex flex-col lg:flex-row text-[#1D1D1F]">
      {/* Mobile Top Bar */}
      <header className="lg:hidden sticky top-0 z-30 h-14 bg-white/90 backdrop-blur-md border-b border-[#E8E8ED] px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="p-1.5 rounded-full hover:bg-[#F5F5F7] text-[#1D1D1F] transition-colors cursor-pointer"
            aria-label="Buka menu navigasi pekerja"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-sm font-bold text-[#1D1D1F] tracking-tight">
              {currentItem.label}
            </h1>
            <p className="text-[10px] text-[#6E6E73]">Portal Pekerja</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#2E7D4F] text-white flex items-center justify-center font-bold text-xs shadow-xs">
            {staff?.inisial || 'DL'}
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Sidebar */}
          <div className="relative w-[280px] bg-white h-full p-4 flex flex-col justify-between shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E8ED] mb-3">
              <span className="text-sm font-bold text-[#1D1D1F]">Menu Pekerja</span>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-full hover:bg-[#F5F5F7] text-[#6E6E73] hover:text-[#1D1D1F] transition-colors cursor-pointer"
                aria-label="Tutup menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">{renderNavContent()}</div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar (Fixed left ~260px) */}
      <aside className="hidden lg:flex flex-col w-[260px] shrink-0 min-h-screen bg-white border-r border-[#E8E8ED] p-5 sticky top-0 h-screen overflow-y-auto">
        {renderNavContent()}
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-[1100px] mx-auto w-full">
          {children || <Outlet />}
        </div>
      </main>
    </div>
  );
};
