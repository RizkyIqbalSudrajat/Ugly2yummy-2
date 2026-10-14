import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStaffAuth, DEMO_PEKERJA, DEMO_ADMIN } from '../../context/StaffAuthContext';
import { StaffRole } from '../../types/staff';
import { Container } from '../../components/ui/Container';
import { Button } from '../../components/ui/Button';
import { SmartImage } from '../../components/ui/SmartImage';
import {
  ArrowLeft,
  ArrowRight,
  Lock,
  Mail,
  ShieldCheck,
  ChefHat,
  CheckCircle2,
  Building2,
  HardHat,
  ShieldAlert,
} from 'lucide-react';

export const StaffLoginPage: React.FC = () => {
  const { loginStaff, isStaffLoggedIn, role } = useStaffAuth();
  const navigate = useNavigate();

  // Role selector: default Pekerja
  const [selectedRole, setSelectedRole] = useState<StaffRole>('pekerja');
  const [email, setEmail] = useState<string>('pekerja@ugly2yummy.id');
  const [password, setPassword] = useState<string>('pekerja123');

  // If already logged in, redirect to respective dashboard
  useEffect(() => {
    if (isStaffLoggedIn) {
      if (role === 'admin') {
        navigate('/internal/admin', { replace: true });
      } else {
        navigate('/internal/pekerja/ringkasan', { replace: true });
      }
    }
  }, [isStaffLoggedIn, role, navigate]);

  const handleRoleChange = (newRole: StaffRole) => {
    setSelectedRole(newRole);
    if (newRole === 'pekerja') {
      setEmail('pekerja@ugly2yummy.id');
      setPassword('pekerja123');
    } else {
      setEmail('admin@ugly2yummy.id');
      setPassword('admin123');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginStaff(selectedRole);
    if (selectedRole === 'admin') {
      navigate('/internal/admin');
    } else {
      navigate('/internal/pekerja/ringkasan');
    }
  };

  const activeDemo = selectedRole === 'pekerja' ? DEMO_PEKERJA : DEMO_ADMIN;

  return (
    <div className="min-h-screen bg-[#FBFBFD] flex flex-col justify-center py-8 sm:py-12 md:py-16 selection:bg-[#2E7D4F]/20 selection:text-[#2E7D4F]">
      <Container size="wide">
        {/* Top Back Link */}
        <div className="max-w-5xl mx-auto mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-[#6E6E73] hover:text-[#1D1D1F] transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Kembali ke Beranda Utama</span>
          </Link>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* =========================================================================
              KOLOM KIRI (DESKTOP): FOTO DAPUR / GUDANG PRODUKSI
              "Dari bahan yang terselamatkan, jadi produk yang layak dinikmati."
              ========================================================================= */}
          <div className="hidden lg:flex lg:col-span-6 relative rounded-3xl overflow-hidden bg-[#1D1D1F] min-h-[600px] flex-col justify-between p-8 xl:p-10 border border-[#E8E8ED]/50 shadow-none">
            {/* Background Image: Dapur & Gudang Produksi with Scrim */}
            <div className="absolute inset-0 z-0">
              <SmartImage
                src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=80"
                alt="Dapur Produksi Ugly2Yummy"
                fallbackEmoji="🍳"
                aspectRatio="4:3"
                containerClassName="w-full h-full"
                className="w-full h-full object-cover scale-105"
              />
              {/* Scrim overlay for readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/35" />
            </div>

            {/* Top Brand Marker */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="inline-flex items-center gap-1 text-white font-bold tracking-tight text-xl">
                <span>Ugly</span>
                <span className="text-[#8FE3AC] font-extrabold">2</span>
                <span>Yummy</span>
              </div>
              <span className="text-[11px] font-semibold tracking-wide px-3 py-1 bg-white/20 text-white rounded-full backdrop-blur-md border border-white/20">
                Portal Internal
              </span>
            </div>

            {/* Bottom Statement: "Dari bahan yang terselamatkan, jadi produk yang layak dinikmati." */}
            <div className="relative z-10 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-medium border border-white/20">
                <ChefHat className="w-3.5 h-3.5 text-[#8FE3AC]" />
                <span>Dapur Produksi & Pengolahan Pangan</span>
              </div>

              <h2 className="text-3xl xl:text-4xl font-bold text-white tracking-tight leading-[1.25] text-balance">
                Dari bahan yang terselamatkan,{' '}
                <span className="font-['Instrument_Serif'] italic font-normal text-[#8FE3AC] text-[1.12em] block">
                  jadi produk yang layak dinikmati.
                </span>
              </h2>

              <p className="text-sm text-white/80 leading-relaxed max-w-sm">
                Sistem terpadu kendali mutu, presisi resep, dan eksekusi produksi harian untuk mewujudkan pangan bernilai tambah.
              </p>
            </div>
          </div>

          {/* =========================================================================
              KOLOM KANAN: KARTU FORM LOGIN INTERNAL
              ========================================================================= */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <div className="bg-white rounded-3xl border border-[#E8E8ED] p-6 sm:p-10 shadow-none max-w-lg mx-auto w-full">
              {/* Header Title */}
              <div className="mb-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF4EE] text-[#2E7D4F] text-xs font-semibold mb-3 border border-[#2E7D4F]/20">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Portal Staf & Manajemen</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1D1D1F]">
                  Masuk Internal
                </h1>
                <p className="mt-1.5 text-xs sm:text-sm text-[#6E6E73]">
                  Akses operasional dapur produksi, kendali mutu, dan manajemen kerja.
                </p>
              </div>

              {/* Segmented Control Role Selector */}
              <div className="mb-6">
                <label className="text-xs font-semibold text-[#1D1D1F] block mb-2">
                  Masuk sebagai:
                </label>
                <div className="p-1 bg-[#F5F5F7] rounded-2xl flex border border-[#E8E8ED]">
                  <button
                    type="button"
                    onClick={() => handleRoleChange('pekerja')}
                    className={`flex-1 py-2.5 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      selectedRole === 'pekerja'
                        ? 'bg-white text-[#1D1D1F] shadow-xs'
                        : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                    }`}
                  >
                    <HardHat className="w-3.5 h-3.5 text-[#2E7D4F]" />
                    <span>Pekerja</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRoleChange('admin')}
                    className={`flex-1 py-2.5 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      selectedRole === 'admin'
                        ? 'bg-white text-[#1D1D1F] shadow-xs'
                        : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-[#2E7D4F]" />
                    <span>Admin</span>
                  </button>
                </div>
              </div>

              {/* Form Input Fields */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Field Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#1D1D1F] block">
                    Alamat Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6E6E73]">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@ugly2yummy.id"
                      className="w-full pl-10 pr-4 py-3 rounded-2xl border border-[#E8E8ED] bg-[#F5F5F7] text-sm text-[#1D1D1F] placeholder-[#6E6E73]/50 focus:border-[#2E7D4F] focus:bg-white focus:ring-2 focus:ring-[#2E7D4F]/15 outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Field Kata Sandi */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-[#1D1D1F] block">
                      Kata Sandi
                    </label>
                    <span className="text-[11px] text-[#6E6E73]">Akun demo otomatis</span>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6E6E73]">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-3 rounded-2xl border border-[#E8E8ED] bg-[#F5F5F7] text-sm text-[#1D1D1F] placeholder-[#6E6E73]/50 focus:border-[#2E7D4F] focus:bg-white focus:ring-2 focus:ring-[#2E7D4F]/15 outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Info Card Demo User */}
                <div className="p-3.5 rounded-2xl bg-[#EBF4EE] border border-[#2E7D4F]/20 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#2E7D4F] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                    {activeDemo.inisial}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-[#1D1D1F]">
                        Demo: {activeDemo.nama}
                      </span>
                      <span className="bg-white text-[#2E7D4F] text-[10px] font-semibold px-2 py-0.5 rounded-full inline-flex items-center gap-1 border border-[#2E7D4F]/20">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        Siap Masuk
                      </span>
                    </div>
                    <p className="text-[11px] text-[#6E6E73] truncate">
                      {activeDemo.jabatan} · {activeDemo.lokasi}
                    </p>
                  </div>
                </div>

                {/* Tombol Utama Form */}
                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    icon={<ArrowRight className="w-4 h-4" />}
                    iconPosition="right"
                  >
                    Masuk sebagai {selectedRole === 'pekerja' ? 'Pekerja' : 'Admin'}
                  </Button>
                </div>
              </form>

              {/* Teks Kecil di Bawah Form */}
              <div className="mt-6 pt-5 border-t border-[#E8E8ED] text-center space-y-1.5">
                <p className="text-xs text-[#6E6E73] flex items-center justify-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-[#2E7D4F]" />
                  <span>Ini prototype — login hanya simulasi.</span>
                </p>
                <p className="text-[11px] text-[#6E6E73]/80">
                  Halaman khusus tim internal Ugly2Yummy.
                </p>
              </div>

              {/* Mobile Back Link in card */}
              <div className="mt-4 pt-3 text-center lg:hidden">
                <Link
                  to="/"
                  className="text-xs text-[#6E6E73] hover:text-[#1D1D1F] underline underline-offset-4"
                >
                  Kembali ke Beranda Utama
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};
