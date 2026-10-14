import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';
import { SmartImage } from '../components/ui/SmartImage';
import { Sparkles, ArrowRight, Lock, Mail, User, ShieldCheck } from 'lucide-react';

export const AuthDemoPage: React.FC = () => {
  const { loginDemo, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Mode: 'masuk' or 'daftar' based on route or local toggle
  const [mode, setMode] = useState<'masuk' | 'daftar'>(
    location.pathname === '/daftar' ? 'daftar' : 'masuk'
  );

  // Sync mode if user navigates back/forward between /masuk and /daftar
  useEffect(() => {
    if (location.pathname === '/daftar') {
      setMode('daftar');
    } else if (location.pathname === '/masuk') {
      setMode('masuk');
    }
  }, [location.pathname]);

  // Demo prefilled state
  const [name, setName] = useState<string>('Nadia Putri');
  const [email, setEmail] = useState<string>('nadia@example.com');
  const [password, setPassword] = useState<string>('demo2026!');

  // Already logged in redirect escape hatch
  useEffect(() => {
    if (isLoggedIn) {
      // User can still interact or choose to go straight to dashboard
    }
  }, [isLoggedIn]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginDemo();
    const returnUrl = (location.state as { returnUrl?: string } | null)?.returnUrl;
    if (returnUrl) {
      navigate(returnUrl);
    } else {
      navigate('/beranda');
    }
  };

  const handleToggle = (newMode: 'masuk' | 'daftar') => {
    setMode(newMode);
    window.history.replaceState(null, '', `#/${newMode}`);
  };

  return (
    <div className="py-12 sm:py-20 md:py-24">
      <Container size="wide">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* =========================================================================
              KOLOM KIRI (DESKTOP): FOTO BAHAN UGLY BESAR DENGAN KALIMAT
              "Setiap pembelianmu menyelamatkan pangan."
              ========================================================================= */}
          <div className="hidden lg:flex lg:col-span-6 relative rounded-3xl overflow-hidden bg-[#1D1D1F] min-h-[580px] flex-col justify-between p-8 xl:p-10 border border-[#E8E8ED]/50 shadow-none">
            {/* Background Image: Ugly Produce with Scrim */}
            <div className="absolute inset-0 z-0">
              <SmartImage
                src="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=1200&q=80"
                alt="Tomat Bengkok Organik Lembang"
                fallbackEmoji="🍅"
                aspectRatio="4:3"
                containerClassName="w-full h-full"
                className="w-full h-full object-cover scale-105"
              />
              {/* Measured contrast scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/25" />
            </div>

            {/* Top Brand Marker on Image */}
            <div className="relative z-10">
              <Link
                to="/"
                className="inline-flex items-center gap-1 text-white font-bold tracking-tight text-xl"
              >
                <span>Ugly</span>
                <span className="text-[#8FE3AC] font-extrabold">2</span>
                <span>Yummy</span>
              </Link>
            </div>

            {/* Bottom Statement: "Setiap pembelianmu menyelamatkan pangan." */}
            <div className="relative z-10 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-medium border border-white/20">
                <Sparkles className="w-3.5 h-3.5 text-[#8FE3AC]" />
                <span>Petani Lokal Terberdayakan</span>
              </div>

              <h2 className="text-3xl xl:text-4xl font-bold text-white tracking-tight leading-[1.2] text-balance">
                Setiap pembelianmu{' '}
                <span className="font-['Instrument_Serif'] italic font-normal text-[#8FE3AC] text-[1.12em]">
                  menyelamatkan pangan.
                </span>
              </h2>

              <p className="text-sm text-white/80 leading-relaxed max-w-sm">
                Dari Lembang hingga Dieng, mari nikmati sajian artisan buah & sayur unik yang diolah
                penuh cinta.
              </p>
            </div>
          </div>

          {/* =========================================================================
              KOLOM KANAN: KARTU FORM YANG BERSIH
              ========================================================================= */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <div className="bg-white rounded-3xl border border-[#E8E8ED] p-6 sm:p-10 shadow-none max-w-lg mx-auto w-full">
              {/* Toggle Segmented Control: "Masuk" dan "Daftar" */}
              <div className="p-1 bg-[#F5F5F7] rounded-full flex items-center mb-8 border border-[#E8E8ED]">
                <button
                  type="button"
                  onClick={() => handleToggle('masuk')}
                  className={`flex-1 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                    mode === 'masuk'
                      ? 'bg-white text-[#1D1D1F] shadow-xs'
                      : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                  }`}
                >
                  Masuk
                </button>
                <button
                  type="button"
                  onClick={() => handleToggle('daftar')}
                  className={`flex-1 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                    mode === 'daftar'
                      ? 'bg-white text-[#1D1D1F] shadow-xs'
                      : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                  }`}
                >
                  Daftar
                </button>
              </div>

              {/* Header Text */}
              <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1D1D1F]">
                  {mode === 'masuk' ? 'Selamat Datang Kembali' : 'Buat Akun Pembeli'}
                </h1>
                <p className="mt-1.5 text-xs sm:text-sm text-[#6E6E73]">
                  {mode === 'masuk'
                    ? 'Masuk untuk mengelola keranjang dan memantau dampak pangan Anda.'
                    : 'Bergabung bersama ribuan penikmat upcycled food di Indonesia.'}
                </p>
              </div>

              {/* Form Input Fields */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Field Nama Lengkap (Khusus Mode Daftar) */}
                {mode === 'daftar' && (
                  <div className="space-y-1.5 animate-in fade-in duration-200">
                    <label className="text-xs font-semibold text-[#1D1D1F] block">
                      Nama Lengkap
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6E6E73]">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Nadia Putri"
                        className="w-full pl-10 pr-4 py-3 rounded-2xl border border-[#E8E8ED] bg-[#F5F5F7] text-sm text-[#1D1D1F] placeholder-[#6E6E73]/50 focus:border-[#2E7D4F] focus:bg-white focus:ring-2 focus:ring-[#2E7D4F]/15 outline-none transition-all"
                      />
                    </div>
                  </div>
                )}

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
                      placeholder="nadia@example.com"
                      className="w-full pl-10 pr-4 py-3 rounded-2xl border border-[#E8E8ED] bg-[#F5F5F7] text-sm text-[#1D1D1F] placeholder-[#6E6E73]/50 focus:border-[#2E7D4F] focus:bg-white focus:ring-2 focus:ring-[#2E7D4F]/15 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Field Kata Sandi */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-[#1D1D1F] block">
                      Kata Sandi
                    </label>
                    {mode === 'masuk' && (
                      <span className="text-[11px] text-[#6E6E73]">Data demo otomatis</span>
                    )}
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
                    />
                  </div>
                </div>

                {/* Info Card Akun Demo Nadia */}
                <div className="p-3.5 rounded-2xl bg-[#EBF4EE] border border-[#2E7D4F]/20 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#2E7D4F] text-white flex items-center justify-center font-bold text-xs shrink-0">
                    NP
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-[#1D1D1F]">Akun Demo: Nadia Putri</span>
                      <span className="bg-white text-[#2E7D4F] text-[10px] font-semibold px-1.5 py-0.2 rounded-full">
                        Siap
                      </span>
                    </div>
                    <p className="text-[11px] text-[#6E6E73] truncate">
                      Telah menyelamatkan 3,2 kg pangan & 4 pesanan
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
                    {mode === 'masuk' ? 'Masuk' : 'Buat Akun'}
                  </Button>
                </div>
              </form>

              {/* Teks Kecil di Bawah Form */}
              <div className="mt-6 pt-5 border-t border-[#E8E8ED] text-center space-y-1">
                <p className="text-xs text-[#6E6E73] flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#2E7D4F]" />
                  <span>Ini prototype — login hanya simulasi.</span>
                </p>
                <p className="text-[11px] text-[#6E6E73]/70">
                  Langsung masuk tanpa validasi kata sandi.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};
