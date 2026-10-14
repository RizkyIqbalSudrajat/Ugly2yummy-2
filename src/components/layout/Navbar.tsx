import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShoppingBag, Menu, X, ChevronDown, Sparkles, User, Package, LogOut } from 'lucide-react';
import { Button } from '../ui/Button';

export const Navbar: React.FC = () => {
  const { isLoggedIn, user, cartCount, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Deteksi posisi scroll di landing page untuk hero transparan
  const isLandingPage = location.pathname === '/';
  const [scrolledPastHero, setScrolledPastHero] = useState(!isLandingPage);

  useEffect(() => {
    if (!isLandingPage) {
      setScrolledPastHero(true);
      return;
    }

    const checkScroll = () => {
      // Ambang batas scroll melewati hero (sekitar 70% viewport height)
      const threshold = window.innerHeight * 0.7 - 56;
      setScrolledPastHero(window.scrollY > threshold);
    };

    checkScroll();
    window.addEventListener('scroll', checkScroll, { passive: true });
    return () => window.removeEventListener('scroll', checkScroll);
  }, [isLandingPage]);

  // Navbar transparan hanya jika di landing page, belum scroll melewati hero, dan mobile menu tertutup
  const isTransparentHero = isLandingPage && !scrolledPastHero && !mobileMenuOpen;

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  }, [location.pathname]);

  // Click outside to close profile dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [badgeBouncing, setBadgeBouncing] = useState(false);
  const prevCartCountRef = useRef(cartCount);

  // Animate badge whenever cartCount increases
  useEffect(() => {
    if (cartCount > prevCartCountRef.current) {
      setBadgeBouncing(true);
      const timer = setTimeout(() => setBadgeBouncing(false), 400);
      prevCartCountRef.current = cartCount;
      return () => clearTimeout(timer);
    }
    prevCartCountRef.current = cartCount;
  }, [cartCount]);

  const handleLogout = () => {
    logout();
    setProfileDropdownOpen(false);
    navigate('/');
  };

  const navLinkClasses = ({ isActive }: { isActive: boolean }) => {
    if (isTransparentHero) {
      return `text-sm font-medium transition-colors hover:text-white py-1 ${
        isActive ? 'text-white font-semibold' : 'text-white/80'
      }`;
    }
    return `text-sm font-medium transition-colors hover:text-[#2E7D4F] py-1 ${
      isActive ? 'text-[#2E7D4F] font-semibold' : 'text-[#6E6E73]'
    }`;
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isTransparentHero
          ? 'bg-transparent border-b border-transparent'
          : 'backdrop-blur-md bg-white/85 border-b border-[#E8E8ED]/70 shadow-xs'
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 h-[52px] sm:h-14 flex items-center justify-between gap-4">
        {/* Zone 1: Logo */}
        <Link
          to={isLoggedIn ? '/beranda' : '/'}
          className={`text-lg sm:text-xl font-bold tracking-tight select-none flex items-center gap-1 group transition-colors ${
            isTransparentHero ? 'text-white' : 'text-[#1D1D1F]'
          }`}
        >
          <span>Ugly</span>
          <span
            className={`font-extrabold group-hover:scale-105 transition-transform inline-block ${
              isTransparentHero ? 'text-[#4ADE80]' : 'text-[#2E7D4F]'
            }`}
          >
            2
          </span>
          <span>Yummy</span>
        </Link>

        {/* Zone 2: Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-7 lg:gap-8">
          {isLoggedIn ? (
            <>
              <NavLink to="/beranda" className={navLinkClasses}>
                Beranda
              </NavLink>
              <NavLink to="/produk" className={navLinkClasses}>
                Produk
              </NavLink>
              <NavLink to="/cerita-bahan" className={navLinkClasses}>
                Cerita Bahan
              </NavLink>
              <NavLink to="/pesanan-saya" className={navLinkClasses}>
                Pesanan
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to="/produk" className={navLinkClasses}>
                Produk
              </NavLink>
              <NavLink to="/cerita-bahan" className={navLinkClasses}>
                Cerita Bahan
              </NavLink>
            </>
          )}
        </nav>

        {/* Zone 3: Actions (Desktop) */}
        <div className="hidden md:flex items-center gap-2 lg:gap-3">
          {/* Link Portal Supplier (sebelum ikon keranjang & tombol masuk) */}
          <Link
            to="/supplier/masuk"
            className={`text-xs sm:text-sm font-medium transition-colors px-3 py-1.5 rounded-full ${
              isTransparentHero
                ? 'text-white/90 hover:text-white hover:bg-white/10'
                : 'text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-[#F5F5F7]'
            }`}
          >
            Portal Supplier
          </Link>

          {/* Shopping Bag Button with Badge (selalu tampil) */}
          <Link
            to="/keranjang"
            className={`relative p-2.5 rounded-full transition-colors flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2E7D4F] ${
              isTransparentHero
                ? 'text-white hover:bg-white/15'
                : 'text-[#1D1D1F] hover:bg-[#F5F5F7]'
            }`}
            aria-label="Keranjang belanja"
          >

            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span
                className={`absolute -top-1 -right-1 bg-[#2E7D4F] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-xs transition-transform duration-300 ease-out ${
                  badgeBouncing ? 'scale-125 ring-2 ring-[#2E7D4F]/30' : 'scale-100'
                }`}
              >
                {cartCount}
              </span>
            )}
          </Link>

          {isLoggedIn ? (
            /* Profile Avatar & Dropdown */
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className={`flex items-center gap-2 p-1.5 pl-2.5 rounded-full transition-colors text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2E7D4F] cursor-pointer ${
                  isTransparentHero
                    ? 'bg-white/15 text-white hover:bg-white/25 border border-white/20'
                    : 'bg-[#F5F5F7] hover:bg-[#E8E8ED] text-[#1D1D1F]'
                }`}
                aria-expanded={profileDropdownOpen}
              >
                <span className="max-w-[100px] truncate">{user?.nama.split(' ')[0]}</span>
                <div className="w-7 h-7 rounded-full bg-[#2E7D4F] text-white flex items-center justify-center font-semibold text-xs shadow-xs">
                  {user?.nama.charAt(0)}
                </div>
                <ChevronDown
                  className={`w-3.5 h-3.5 ${
                    isTransparentHero ? 'text-white/80' : 'text-[#6E6E73]'
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.06)] border border-[#E8E8ED] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-2.5 border-b border-[#E8E8ED]/70">
                    <p className="text-xs font-semibold text-[#1D1D1F]">{user?.nama}</p>
                    <p className="text-[11px] text-[#6E6E73] truncate">{user?.email}</p>
                    <div className="mt-1.5 flex items-center gap-1 text-[10px] font-medium text-[#2E7D4F]">
                      <Sparkles className="w-3 h-3" />
                      <span>3,2 kg diselamatkan</span>
                    </div>
                  </div>

                  <div className="py-1">
                    <Link
                      to="/dampak-saya"
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-[#1D1D1F] hover:bg-[#F5F5F7] transition-colors"
                    >
                      <Sparkles className="w-4 h-4 text-[#2E7D4F]" />
                      <span>Dampak Saya</span>
                    </Link>
                    <Link
                      to="/pesanan-saya"
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-[#1D1D1F] hover:bg-[#F5F5F7] transition-colors"
                    >
                      <Package className="w-4 h-4 text-[#6E6E73]" />
                      <span>Pesanan Saya</span>
                    </Link>
                    <Link
                      to="/profil"
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-[#1D1D1F] hover:bg-[#F5F5F7] transition-colors"
                    >
                      <User className="w-4 h-4 text-[#6E6E73]" />
                      <span>Profil Akun</span>
                    </Link>
                  </div>

                  <div className="pt-1 border-t border-[#E8E8ED]/70">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors text-left cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-red-500" />
                      <span>Keluar</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Button to="/masuk" variant="primary" size="sm">
              Masuk
            </Button>
          )}
        </div>

        {/* Mobile Action & Hamburger Button (selalu tampil keranjang di sebelah hamburger) */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            to="/keranjang"
            className={`relative p-2 rounded-full transition-colors ${
              isTransparentHero ? 'text-white hover:bg-white/15' : 'text-[#1D1D1F] hover:bg-[#F5F5F7]'
            }`}
            aria-label="Keranjang belanja"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span
                className={`absolute -top-1 -right-1 bg-[#2E7D4F] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center transition-transform duration-300 ease-out ${
                  badgeBouncing ? 'scale-125' : 'scale-100'
                }`}
              >
                {cartCount}
              </span>
            )}
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-2 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2E7D4F] cursor-pointer ${
              isTransparentHero ? 'text-white hover:bg-white/15' : 'text-[#1D1D1F] hover:bg-[#F5F5F7]'
            }`}
            aria-label={mobileMenuOpen ? 'Tutup menu' : 'Buka menu'}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E8E8ED]/70 bg-white/95 backdrop-blur-md px-5 py-6 space-y-4 shadow-sm animate-in slide-in-from-top-2 duration-200">
          {isLoggedIn && (
            <div className="p-3.5 bg-white rounded-2xl border border-[#E8E8ED] flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#2E7D4F] text-white flex items-center justify-center font-bold text-sm">
                {user?.nama.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#1D1D1F] truncate">{user?.nama}</p>
                <p className="text-xs text-[#6E6E73] truncate">{user?.email}</p>
              </div>
            </div>
          )}

          <nav className="flex flex-col space-y-1">
            {isLoggedIn ? (
              <>
                <Link
                  to="/beranda"
                  className="px-3 py-2.5 rounded-xl text-sm font-medium text-[#1D1D1F] hover:bg-[#F5F5F7]"
                >
                  Beranda
                </Link>
                <Link
                  to="/produk"
                  className="px-3 py-2.5 rounded-xl text-sm font-medium text-[#1D1D1F] hover:bg-[#F5F5F7]"
                >
                  Katalog Produk
                </Link>
                <Link
                  to="/cerita-bahan"
                  className="px-3 py-2.5 rounded-xl text-sm font-medium text-[#1D1D1F] hover:bg-[#F5F5F7]"
                >
                  Cerita Bahan
                </Link>
                <Link
                  to="/pesanan-saya"
                  className="px-3 py-2.5 rounded-xl text-sm font-medium text-[#1D1D1F] hover:bg-[#F5F5F7]"
                >
                  Pesanan Saya
                </Link>
                <Link
                  to="/dampak-saya"
                  className="px-3 py-2.5 rounded-xl text-sm font-medium text-[#1D1D1F] hover:bg-[#F5F5F7] flex items-center justify-between"
                >
                  <span>Dampak Saya</span>
                  <span className="text-xs font-semibold text-[#2E7D4F] bg-[#EBF4EE] px-2 py-0.5 rounded-full">
                    3,2 kg
                  </span>
                </Link>
                <Link
                  to="/profil"
                  className="px-3 py-2.5 rounded-xl text-sm font-medium text-[#1D1D1F] hover:bg-[#F5F5F7]"
                >
                  Profil Akun
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/produk"
                  className="px-3 py-2.5 rounded-xl text-sm font-medium text-[#1D1D1F] hover:bg-[#F5F5F7]"
                >
                  Katalog Produk
                </Link>
                <Link
                  to="/cerita-bahan"
                  className="px-3 py-2.5 rounded-xl text-sm font-medium text-[#1D1D1F] hover:bg-[#F5F5F7]"
                >
                  Cerita Bahan
                </Link>
              </>
            )}

            {/* Link Portal Supplier di Menu HP */}
            <div className="pt-2 mt-1 border-t border-[#E8E8ED]/60">
              <Link
                to="/supplier/masuk"
                className="px-3 py-2.5 rounded-xl text-sm font-medium text-[#2E7D4F] hover:bg-[#EBF4EE] flex items-center justify-between transition-colors"
              >
                <span>Portal Supplier</span>
                <span className="text-[11px] font-semibold text-[#2E7D4F] bg-[#EBF4EE] px-2 py-0.5 rounded-full border border-[#2E7D4F]/20">
                  Mitra Tani
                </span>
              </Link>
            </div>
          </nav>


          <div className="pt-3 border-t border-[#E8E8ED]">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="w-full py-2.5 text-center text-sm font-medium text-red-600 hover:bg-red-50 rounded-full transition-colors cursor-pointer"
              >
                Keluar dari Akun Demo
              </button>
            ) : (
              <Button to="/masuk" variant="primary" fullWidth size="md">
                Masuk (Demo)
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
