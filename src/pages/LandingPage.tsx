import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useReducedMotion, Variants } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';
import { SmartImage } from '../components/ui/SmartImage';
import { PRODUCTS, INGREDIENTS, LANDING_IMPACT } from '../data/dummy';
import {
  ArrowRight,
  ArrowDown,
  Sparkles,
  Truck,
  CookingPot,
  UtensilsCrossed,
  HeartHandshake,
  Quote,
  MapPin,
  ShoppingBag,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

// ============================================================================
// SLOT LINK FOTO SESUAI INSTRUKSI (JANGAN GANTI SENDIRI JIKA MASIH TEMPEL LINK)
// ============================================================================
const BG_MISI_IMAGE = '[TEMPEL LINK FOTO 1]';
const BG_CARA_KERJA_IMAGE = '[TEMPEL LINK FOTO 2]';
const BG_PRODUK_IMAGE = '[TEMPEL LINK FOTO 6]';
const BG_CERITA_IMAGE = '[TEMPEL LINK FOTO 7]';
const BG_DAMPAK_IMAGE = '[TEMPEL LINK FOTO 8]';
const BG_PENUTUP_IMAGE = '[TEMPEL LINK FOTO 9]';

// Foto langkah Cara Kerja
const CARA_KERJA_FOTO_1 = '[TEMPEL LINK FOTO 3]';
const CARA_KERJA_FOTO_2 = '[TEMPEL LINK FOTO 4]';
const CARA_KERJA_FOTO_3 = '[TEMPEL LINK FOTO 5]';

// Foto Hero (tetap seperti semula)
const HERO_FARM_IMAGE =
  'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=2000&q=80';

// ============================================================================
// KOMPONEN SectionBackground
// ============================================================================
interface SectionBackgroundProps {
  imageSrc: string;
  gradientFallback: string;
  overlayClassName: string;
  altText?: string;
}

const SectionBackground: React.FC<SectionBackgroundProps> = ({
  imageSrc,
  gradientFallback,
  overlayClassName,
  altText = 'Latar belakang section',
}) => {
  const [loadError, setLoadError] = useState(false);

  // Jika slot masih placeholder [TEMPEL LINK ...] gunakan fallback gradasi warna section
  const isPlaceholder = !imageSrc || imageSrc.includes('[TEMPEL LINK');
  const isValidUrl =
    !isPlaceholder &&
    !loadError &&
    (imageSrc.startsWith('http://') ||
      imageSrc.startsWith('https://') ||
      imageSrc.startsWith('/'));

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none select-none z-0 ${gradientFallback}`}
      aria-hidden="true"
    >
      {isValidUrl && (
        <img
          src={imageSrc}
          alt={altText}
          loading="lazy"
          onError={() => setLoadError(true)}
          className="w-full h-full object-cover object-center"
        />
      )}
      {/* Overlay dengan opasitas adaptif kontras tinggi */}
      <div className={`absolute inset-0 ${overlayClassName}`} />
    </div>
  );
};

// ============================================================================
// KOMPONEN StepImageCard (Visualisasi Langkah Cara Kerja)
// ============================================================================
interface StepImageCardProps {
  imageSrc: string;
  stepNumber: string;
  icon: React.ReactNode;
  fallbackGradient: string;
  altText: string;
}

const StepImageCard: React.FC<StepImageCardProps> = ({
  imageSrc,
  stepNumber,
  icon,
  fallbackGradient,
  altText,
}) => {
  const [loadError, setLoadError] = useState(false);
  const isPlaceholder = !imageSrc || imageSrc.includes('[TEMPEL LINK');
  const isValidUrl =
    !isPlaceholder &&
    !loadError &&
    (imageSrc.startsWith('http://') ||
      imageSrc.startsWith('https://') ||
      imageSrc.startsWith('/'));

  return (
    <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden mb-6 bg-[#E8E8ED] shadow-xs">
      {isValidUrl ? (
        <img
          src={imageSrc}
          alt={altText}
          loading="lazy"
          onError={() => setLoadError(true)}
          className="w-full h-full object-cover object-center"
        />
      ) : (
        <div
          className={`w-full h-full flex items-center justify-center ${fallbackGradient}`}
        >
          <div className="text-[#1E432D]/40 scale-125">{icon}</div>
        </div>
      )}

      {/* Badge Nomor & Ikon di Atas Foto */}
      <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
        <span className="h-8 px-2.5 rounded-xl bg-white text-[#1E432D] font-mono font-extrabold text-xs flex items-center justify-center shadow-md">
          {stepNumber}
        </span>
        <span className="w-8 h-8 rounded-xl bg-[#1E432D] text-white flex items-center justify-center shadow-md">
          {icon}
        </span>
      </div>
    </div>
  );
};

// ============================================================================
// HELPER LABEL KEBUTUHAN PRODUK
// ============================================================================
const getProductUsageLabel = (product: typeof PRODUCTS[0]): string => {
  const kat = product.kategori.toLowerCase();
  const nama = product.nama.toLowerCase();

  if (kat.includes('saus') || kat.includes('sambal')) {
    return 'Masak harian, pasta & marinasi';
  }
  if (kat.includes('selai') || nama.includes('bread') || nama.includes('pisang')) {
    return 'Sarapan roti, pancake & kue';
  }
  if (kat.includes('camilan') || nama.includes('keripik')) {
    return 'Camilan santai renyah & sehat';
  }
  return 'Pelengkap makan & masak';
};

// ============================================================================
// HALAMAN UTAMA (LANDING PAGE)
// ============================================================================
export const LandingPage: React.FC = () => {
  const { isLoggedIn, loginDemo, startGuestMode } = useAuth();
  const navigate = useNavigate();
  const [bgHeroError, setBgHeroError] = useState(false);

  const handleGuestBuy = () => {
    startGuestMode();
    navigate('/produk', {
      state: {
        guestToast: 'Kamu belanja sebagai tamu. Data pengiriman diisi saat checkout.',
      },
    });
  };

  // Hormati prefers-reduced-motion
  const shouldReduceMotion = useReducedMotion();

  const fadeUpVariant: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.6,
        ease: 'easeOut',
      },
    },
  };

  // Tomat Bengkok untuk Cerita Bahan
  const tomatBengkok =
    INGREDIENTS.find((i) => i.id === 'tomat-bengkok') || INGREDIENTS[0];

  // Bento products
  const heroProduct = PRODUCTS[0]; // Saus Tomat Panggang
  const bentoProducts = [
    PRODUCTS[0], // Saus Tomat Panggang (Large card)
    PRODUCTS[3], // Banana Bread Pisang Bintik
    PRODUCTS[2], // Keripik Wortel Panggang
    PRODUCTS[6], // Selai Stroberi Ciwidey
  ];

  const handleBuyerCta = () => {
    if (!isLoggedIn) {
      loginDemo();
    }
    navigate('/beranda');
  };

  return (
    <div className="overflow-hidden">
      {/* =========================================================================
          1. HERO SECTION (TETAP SEPERTI ASLINYA - TOMBOL HERO TIDAK DIUBAH)
          ========================================================================= */}
      <section className="relative w-full min-h-[80vh] md:min-h-[85vh] lg:min-h-[90vh] flex items-center bg-gradient-to-br from-[#0a1c10] via-[#122e1b] to-[#07130a] overflow-hidden -mt-[52px] sm:-mt-14 pt-[80px] sm:pt-24 pb-14 sm:pb-20">
        {!bgHeroError && (
          <img
            src={HERO_FARM_IMAGE}
            alt="Lahan pertanian tempat bahan Ugly2Yummy dipanen"
            onError={() => setBgHeroError(true)}
            className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none"
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/65 to-black/35 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />

        <Container className="relative z-10 w-full">
          <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-center">
            {/* Kolom Teks & Aksi Hero */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUpVariant}
              className="lg:col-span-7 xl:col-span-7 text-left max-w-2xl"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-semibold uppercase tracking-wider mb-5 sm:mb-6 border border-white/20 shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80]" />
                <span>Toko Online Produk Upcycled</span>
              </div>

              <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-[1.08] text-balance">
                Tak sempurna di mata, <br className="hidden sm:inline" />
                <span className="font-['Instrument_Serif'] italic font-normal text-[#86EFAC] text-[1.12em] tracking-normal inline-block drop-shadow-sm">
                  sempurna di rasa.
                </span>
              </h1>

              <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-white/90 max-w-xl leading-relaxed text-balance font-normal">
                Belanja selai, saus, dan camilan dari bahan imperfect, dikirim langsung ke rumahmu.
              </p>

              {/* Tombol Hero */}
              <div className="mt-7 sm:mt-9 flex flex-wrap items-center gap-3 sm:gap-4">
                <Button
                  to="/produk"
                  variant="primary"
                  size="lg"
                  icon={<ArrowRight className="w-4 h-4" />}
                  iconPosition="right"
                  className="bg-[#2E7D4F] hover:bg-[#256640] text-white shadow-lg shadow-black/30 border-0"
                >
                  Belanja Sekarang
                </Button>
                {!isLoggedIn && (
                  <button
                    type="button"
                    onClick={handleGuestBuy}
                    className="inline-flex items-center justify-center font-medium transition-all duration-200 rounded-full text-sm sm:text-base px-6 py-3 min-h-[46px] sm:min-h-[50px] bg-white/15 hover:bg-white/25 text-white border border-white/30 backdrop-blur-md shadow-xs active:scale-[0.98] cursor-pointer"
                  >
                    Beli Tanpa Login
                  </button>
                )}
              </div>

              {/* Cerita Bahan dipindah jadi link teks kecil di bawah tombol */}
              <div className="mt-3.5">
                <Link
                  to="/cerita-bahan"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-white/80 hover:text-white hover:underline transition-colors"
                >
                  <span>Cerita Bahan</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <p className="mt-4 sm:mt-5 text-xs sm:text-sm text-white/80 leading-relaxed">
                Bisa beli tanpa daftar · Kirim ke seluruh Indonesia · Transfer, e-wallet, atau COD
              </p>
            </motion.div>

            {/* Kolom Kanan: Kartu Kaca Produk Unggulan */}
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, x: 25 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.8, delay: 0.2, ease: 'easeOut' }}
              className="hidden lg:flex lg:col-span-5 xl:col-span-5 justify-end"
            >
              <div className="w-full max-w-sm bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-5 text-white shadow-[0_20px_50px_rgba(0,0,0,0.35)] group hover:border-white/35 transition-all duration-300">
                <div className="relative rounded-2xl overflow-hidden aspect-4/3 bg-black/20 mb-4">
                  <SmartImage
                    src={heroProduct.gambar}
                    alt={heroProduct.nama}
                    fallbackEmoji={heroProduct.gambarEmojiFallback}
                    aspectRatio="4:3"
                    hoverZoom={true}
                    containerClassName="w-full h-full"
                  />
                  <div className="absolute top-3 left-3 z-10">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#2E7D4F]/95 text-white backdrop-blur-md shadow-xs">
                      <Sparkles className="w-3 h-3" />
                      <span>0,5 kg Terselamatkan</span>
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[11px] uppercase tracking-wider text-white/70 font-semibold block">
                    Pilihan Favorit
                  </span>
                  <h3 className="text-lg font-bold text-white leading-snug">
                    {heroProduct.nama}
                  </h3>
                  <p className="text-xs text-white/80 line-clamp-2 leading-relaxed">
                    {heroProduct.deskripsiSingkat}
                  </p>
                </div>

                <div className="mt-4 pt-3.5 border-t border-white/15 flex items-center justify-between">
                  <div>
                    <span className="text-base font-extrabold text-white tabular-nums">
                      Rp 35.000
                    </span>
                    <span className="text-xs text-white/70 ml-1">/ 250 ml</span>
                  </div>
                  <Link
                    to={`/produk/${heroProduct.id}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#86EFAC] hover:text-white transition-colors"
                  >
                    <span>Lihat Produk</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* =========================================================================
          2. MISI KAMI (TERANG): DIPERSINGKAT & DILENGKAPI 3 POIN SEBARIS
          ========================================================================= */}
      <section className="relative py-16 sm:py-24 md:py-28 overflow-hidden">
        {/* SectionBackground: Foto Terang dengan overlay putih ±85% + blur halus */}
        <SectionBackground
          imageSrc={BG_MISI_IMAGE}
          gradientFallback="bg-gradient-to-b from-[#FAF8F5] via-[#F4F6F4] to-[#EBF0EC]"
          overlayClassName="bg-white/90 sm:bg-white/85 backdrop-blur-[2px]"
          altText="Latar belakang Misi Kami"
        />

        <Container size="narrow" className="relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={fadeUpVariant}
            className="text-left space-y-6"
          >
            {/* Label Kecil */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF4EE] text-[#1E432D] text-xs font-bold uppercase tracking-wider border border-[#2E7D4F]/20">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D4F]" />
              Misi Kami
            </span>

            {/* Judul Sans Tebal Tegas */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#1D1D1F] tracking-tight leading-tight">
              Rasa tidak ditentukan oleh bentuk.
            </h2>

            {/* Paragraf Ukuran Sedang */}
            <p className="text-sm sm:text-base md:text-lg text-[#3A3A3C] leading-relaxed max-w-3xl font-normal">
              Setiap musim panen, banyak tomat bengkok, wortel bercabang, dan pisang
              berbintik tidak laku hanya karena bentuknya tidak sesuai standar pasar,
              padahal rasa dan gizinya sama baiknya. Ugly2Yummy membeli hasil panen itu
              langsung dari petani dengan harga adil, lalu mengolahnya jadi selai, saus,
              dan camilan yang enak dan aman dinikmati.
            </p>

            {/* 3 Poin Singkat Sebaris (Di HP Bertumpuk) */}
            <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4 border-t border-[#E8E8ED]">
              {/* Poin 1 */}
              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/80 border border-[#E8E8ED] shadow-xs">
                <div className="w-9 h-9 rounded-xl bg-[#EBF4EE] text-[#1E432D] flex items-center justify-center shrink-0">
                  <HeartHandshake className="w-4 h-4 stroke-[2]" />
                </div>
                <span className="text-xs sm:text-sm font-bold text-[#1D1D1F] leading-snug">
                  Petani dapat harga adil
                </span>
              </div>

              {/* Poin 2 */}
              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/80 border border-[#E8E8ED] shadow-xs">
                <div className="w-9 h-9 rounded-xl bg-[#EBF4EE] text-[#1E432D] flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 stroke-[2]" />
                </div>
                <span className="text-xs sm:text-sm font-bold text-[#1D1D1F] leading-snug">
                  Pangan tidak terbuang
                </span>
              </div>

              {/* Poin 3 */}
              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/80 border border-[#E8E8ED] shadow-xs">
                <div className="w-9 h-9 rounded-xl bg-[#EBF4EE] text-[#1E432D] flex items-center justify-center shrink-0">
                  <ShoppingBag className="w-4 h-4 stroke-[2]" />
                </div>
                <span className="text-xs sm:text-sm font-bold text-[#1D1D1F] leading-snug">
                  Kamu dapat produk enak dan terjangkau
                </span>
              </div>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* =========================================================================
          3. CARA KERJA (GELAP): 3 LANGKAH DENGAN FOTO, GARIS PUTUS-PUTUS & ALUR
          ========================================================================= */}
      <section className="relative py-16 sm:py-24 md:py-32 overflow-hidden text-white">
        {/* SectionBackground: Foto Gelap dengan overlay hijau tua/hitam ±75% */}
        <SectionBackground
          imageSrc={BG_CARA_KERJA_IMAGE}
          gradientFallback="bg-gradient-to-b from-[#0F2417] via-[#142E1E] to-[#0A1810]"
          overlayClassName="bg-[#0B1A10]/85 sm:bg-[#0B1A10]/75 backdrop-blur-[2px]"
          altText="Latar belakang Cara Kerja"
        />

        <Container className="relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={fadeUpVariant}
            className="max-w-2xl mx-auto text-center mb-12 sm:mb-16"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[#86EFAC] text-xs font-bold uppercase tracking-wider mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#86EFAC]" />
              Siklus Kebaikan
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              Cara Kerja
            </h2>
            <p className="mt-3 text-sm sm:text-base text-white/80 max-w-lg mx-auto">
              Dari kebun petani hingga ke mejamu melalui proses yang transparan dan terjaga.
            </p>
          </motion.div>

          {/* Grid 3 Kartu Langkah (Kartu Tetap Putih) */}
          <div className="relative">
            {/* Garis Alur Putus-putus Antar-Kartu (Desktop Only) */}
            <div className="hidden md:flex absolute top-[115px] left-0 right-0 justify-between px-[28%] pointer-events-none z-20">
              <div className="flex items-center gap-1 bg-[#1A3826] border border-white/20 px-2.5 py-1 rounded-full text-white/90 shadow-md">
                <span className="w-8 border-t-2 border-dashed border-[#86EFAC]/70" />
                <ArrowRight className="w-3.5 h-3.5 text-[#86EFAC]" />
              </div>
              <div className="flex items-center gap-1 bg-[#1A3826] border border-white/20 px-2.5 py-1 rounded-full text-white/90 shadow-md">
                <span className="w-8 border-t-2 border-dashed border-[#86EFAC]/70" />
                <ArrowRight className="w-3.5 h-3.5 text-[#86EFAC]" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
              {/* Langkah 1 */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                variants={fadeUpVariant}
                className="bg-white rounded-3xl p-6 sm:p-7 border border-white/20 flex flex-col justify-between shadow-xl text-[#1D1D1F]"
              >
                <div>
                  <StepImageCard
                    imageSrc={CARA_KERJA_FOTO_1}
                    stepNumber="01"
                    icon={<Truck className="w-4 h-4 stroke-[2]" />}
                    fallbackGradient="bg-gradient-to-br from-[#E2EBE4] via-[#D5E3D8] to-[#C3D9C8]"
                    altText="Langkah 1: Diselamatkan dari Petani"
                  />

                  <h3 className="text-lg sm:text-xl font-extrabold text-[#1D1D1F] tracking-tight mb-2">
                    Diselamatkan dari Petani
                  </h3>
                  <p className="text-xs sm:text-sm text-[#48484A] leading-relaxed">
                    Kami membeli hasil panen yang tidak lolos standar bentuk pasar modern langsung
                    dari kebun. Petani mendapatkan kepastian serapan panen dengan harga yang adil.
                  </p>
                </div>

                <div className="mt-6 pt-3.5 border-t border-[#E8E8ED] text-xs text-[#1E432D] font-bold flex items-center gap-1.5">
                  <HeartHandshake className="w-4 h-4 text-[#2E7D4F]" />
                  <span>86 Petani Mitra Terhubung</span>
                </div>
              </motion.div>

              {/* Garis Vertikal Antara Langkah 1 & 2 di HP */}
              <div className="md:hidden flex flex-col items-center justify-center -my-2 text-white/80">
                <div className="h-5 w-0 border-l-2 border-dashed border-[#86EFAC]/60" />
                <div className="w-6 h-6 rounded-full bg-[#1A3826] border border-[#86EFAC]/50 flex items-center justify-center text-[#86EFAC] my-0.5 shadow-sm">
                  <ArrowDown className="w-3.5 h-3.5" />
                </div>
                <div className="h-5 w-0 border-l-2 border-dashed border-[#86EFAC]/60" />
              </div>

              {/* Langkah 2 */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                variants={fadeUpVariant}
                transition={{ delay: shouldReduceMotion ? 0 : 0.15 }}
                className="bg-white rounded-3xl p-6 sm:p-7 border border-white/20 flex flex-col justify-between shadow-xl text-[#1D1D1F]"
              >
                <div>
                  <StepImageCard
                    imageSrc={CARA_KERJA_FOTO_2}
                    stepNumber="02"
                    icon={<CookingPot className="w-4 h-4 stroke-[2]" />}
                    fallbackGradient="bg-gradient-to-br from-[#EFE9DF] via-[#E4DCD0] to-[#D5C9B8]"
                    altText="Langkah 2: Diseleksi dan Diolah"
                  />

                  <h3 className="text-lg sm:text-xl font-extrabold text-[#1D1D1F] tracking-tight mb-2">
                    Diseleksi dan Diolah
                  </h3>
                  <p className="text-xs sm:text-sm text-[#48484A] leading-relaxed">
                    Bahan disortir ketat untuk memastikan nutrisi dan kesegarannya tetap prima.
                    Dimasak secara artisan tanpa bahan pengawet sintetis.
                  </p>
                </div>

                <div className="mt-6 pt-3.5 border-t border-[#E8E8ED] text-xs text-[#1E432D] font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#2E7D4F]" />
                  <span>Resep Alami Tanpa Kimia</span>
                </div>
              </motion.div>

              {/* Garis Vertikal Antara Langkah 2 & 3 di HP */}
              <div className="md:hidden flex flex-col items-center justify-center -my-2 text-white/80">
                <div className="h-5 w-0 border-l-2 border-dashed border-[#86EFAC]/60" />
                <div className="w-6 h-6 rounded-full bg-[#1A3826] border border-[#86EFAC]/50 flex items-center justify-center text-[#86EFAC] my-0.5 shadow-sm">
                  <ArrowDown className="w-3.5 h-3.5" />
                </div>
                <div className="h-5 w-0 border-l-2 border-dashed border-[#86EFAC]/60" />
              </div>

              {/* Langkah 3 */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                variants={fadeUpVariant}
                transition={{ delay: shouldReduceMotion ? 0 : 0.3 }}
                className="bg-white rounded-3xl p-6 sm:p-7 border border-white/20 flex flex-col justify-between shadow-xl text-[#1D1D1F]"
              >
                <div>
                  <StepImageCard
                    imageSrc={CARA_KERJA_FOTO_3}
                    stepNumber="03"
                    icon={<UtensilsCrossed className="w-4 h-4 stroke-[2]" />}
                    fallbackGradient="bg-gradient-to-br from-[#E1E8EC] via-[#D6E0E6] to-[#C3D2DB]"
                    altText="Langkah 3: Sampai di Mejamu"
                  />

                  <h3 className="text-lg sm:text-xl font-extrabold text-[#1D1D1F] tracking-tight mb-2">
                    Sampai di Mejamu
                  </h3>
                  <p className="text-xs sm:text-sm text-[#48484A] leading-relaxed">
                    Dikemas aman dalam wadah ramah lingkungan dan diantar langsung ke rumahmu.
                    Siap kamu santap untuk sarapan, bumbu masak, atau camilan santai.
                  </p>
                </div>

                <div className="mt-6 pt-3.5 border-t border-[#E8E8ED] text-xs text-[#1E432D] font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#2E7D4F]" />
                  <span>Transparansi kg Diselamatkan</span>
                </div>
              </motion.div>
            </div>
          </div>
        </Container>
      </section>

      {/* =========================================================================
          4. PRODUK UNGGULAN (TERANG): BENTO GRID DENGAN LABEL KEBUTUHAN
          ========================================================================= */}
      <section className="relative py-16 sm:py-24 md:py-28 overflow-hidden">
        {/* SectionBackground: Foto Terang dengan overlay #F5F5F7 ±88% */}
        <SectionBackground
          imageSrc={BG_PRODUK_IMAGE}
          gradientFallback="bg-gradient-to-b from-[#F7F5F0] via-[#F5F5F7] to-[#EDEFF2]"
          overlayClassName="bg-[#F5F5F7]/95 sm:bg-[#F5F5F7]/88 backdrop-blur-[2px]"
          altText="Latar belakang Produk Unggulan"
        />

        <Container className="relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={fadeUpVariant}
            className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10 sm:mb-14"
          >
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF4EE] text-[#1E432D] text-xs font-bold uppercase tracking-wider mb-2 border border-[#2E7D4F]/20">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D4F]" />
                Pilihan Terbaik
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#1D1D1F]">
                Produk Unggulan
              </h2>
              <p className="mt-2 text-xs sm:text-base text-[#6E6E73]">
                Dibuat segar dengan takaran bahan alami penuh cita rasa otentik.
              </p>
            </div>

            <Button
              to="/produk"
              variant="outline"
              size="md"
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
              className="self-start sm:self-auto bg-white border-[#E8E8ED] hover:bg-[#F5F5F7] text-[#1D1D1F] font-semibold text-xs sm:text-sm"
            >
              Lihat Semua Produk
            </Button>
          </motion.div>

          {/* Bento Grid: 1 Kartu Besar (kiri), 3 Kartu Kecil (kanan) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Kartu Besar (Bento Item 1) */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={fadeUpVariant}
              onClick={() => navigate(`/produk/${bentoProducts[0].id}`)}
              className="lg:col-span-7 group bg-white rounded-3xl border border-[#E8E8ED] p-6 sm:p-8 flex flex-col justify-between shadow-xs hover:border-[#2E7D4F]/40 hover:shadow-md transition-all duration-300 cursor-pointer"
            >
              <div>
                <div className="relative rounded-2xl overflow-hidden bg-[#F5F5F7] mb-5">
                  <SmartImage
                    src={bentoProducts[0].gambar}
                    alt={bentoProducts[0].nama}
                    fallbackEmoji={bentoProducts[0].gambarEmojiFallback}
                    aspectRatio="16:9"
                    hoverZoom={true}
                    containerClassName="w-full"
                  />
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-bold text-[#1E432D] shadow-xs">
                    {bentoProducts[0].estimasiKgTerselamatkan} kg Terselamatkan
                  </div>
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] text-[#6E6E73] uppercase tracking-wider font-bold">
                      {bentoProducts[0].kategori} · {bentoProducts[0].ukuran}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-extrabold text-[#1D1D1F] group-hover:text-[#2E7D4F] transition-colors">
                    {bentoProducts[0].nama}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#48484A] leading-relaxed line-clamp-2">
                    {bentoProducts[0].deskripsiSingkat}
                  </p>

                  {/* Label Kecil "Cocok untuk: ..." */}
                  <div className="pt-1">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#F5F5F7] border border-[#E8E8ED] text-xs font-medium text-[#48484A]">
                      <span className="text-[#1E432D] font-bold">Cocok untuk:</span>
                      <span>{getProductUsageLabel(bentoProducts[0])}</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#E8E8ED] flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-[#6E6E73] block">Asal Bahan:</span>
                  <span className="text-xs sm:text-sm font-bold text-[#1D1D1F]">
                    {bentoProducts[0].bahanUtama} (Lembang, Jawa Barat)
                  </span>
                </div>
                <span className="text-base sm:text-lg font-extrabold text-[#1D1D1F] tabular-nums">
                  Rp{bentoProducts[0].harga.toLocaleString('id-ID')}
                </span>
              </div>
            </motion.div>

            {/* 3 Kartu Kecil (Bento Items 2, 3, 4) */}
            <div className="lg:col-span-5 flex flex-col gap-5">
              {bentoProducts.slice(1, 4).map((product, idx) => (
                <motion.div
                  key={product.id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-50px' }}
                  variants={fadeUpVariant}
                  transition={{ delay: shouldReduceMotion ? 0 : idx * 0.1 }}
                  onClick={() => navigate(`/produk/${product.id}`)}
                  className="group bg-white rounded-3xl border border-[#E8E8ED] p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-4 shadow-xs hover:border-[#2E7D4F]/40 hover:shadow-md transition-all duration-300 cursor-pointer"
                >
                  <div className="w-full sm:w-28 h-28 shrink-0 rounded-2xl overflow-hidden bg-[#F5F5F7]">
                    <SmartImage
                      src={product.gambar}
                      alt={product.nama}
                      fallbackEmoji={product.gambarEmojiFallback}
                      aspectRatio="1:1"
                      hoverZoom={true}
                      containerClassName="w-full h-full"
                    />
                  </div>

                  <div className="flex-1 min-w-0 w-full flex flex-col justify-between h-full space-y-2">
                    <div>
                      <div className="text-[10px] text-[#6E6E73] uppercase tracking-wider font-bold mb-1">
                        {product.kategori}
                      </div>
                      <h4 className="text-sm sm:text-base font-extrabold text-[#1D1D1F] group-hover:text-[#2E7D4F] transition-colors line-clamp-1">
                        {product.nama}
                      </h4>

                      {/* Label Kecil "Cocok untuk: ..." */}
                      <p className="text-[11px] text-[#48484A] mt-1 line-clamp-1">
                        <strong className="text-[#1E432D] font-semibold">Cocok: </strong>
                        {getProductUsageLabel(product)}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[#E8E8ED]/70 flex items-center justify-between">
                      <span className="text-xs sm:text-sm font-extrabold text-[#1D1D1F] tabular-nums">
                        Rp{product.harga.toLocaleString('id-ID')}
                      </span>
                      <span className="text-[10px] font-bold text-[#1E432D] bg-[#EBF4EE] px-2.5 py-0.5 rounded-full border border-[#2E7D4F]/20">
                        {product.estimasiKgTerselamatkan} kg selamat
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* =========================================================================
          5. CERITA BAHAN (GELAP): KARTU CERITA PUTIH MENGAMBANG DENGAN BAYANGAN HALUS
          ========================================================================= */}
      <section className="relative py-16 sm:py-24 md:py-32 overflow-hidden text-[#1D1D1F]">
        {/* SectionBackground: Foto Gelap dengan overlay hitam ±70% */}
        <SectionBackground
          imageSrc={BG_CERITA_IMAGE}
          gradientFallback="bg-gradient-to-b from-[#111A13] via-[#17221A] to-[#0D150F]"
          overlayClassName="bg-black/80 sm:bg-black/70 backdrop-blur-[2px]"
          altText="Latar belakang Cerita Bahan"
        />

        <Container className="relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={fadeUpVariant}
            className="max-w-5xl mx-auto bg-white rounded-3xl sm:rounded-[36px] border border-white/30 overflow-hidden p-6 sm:p-10 md:p-12 shadow-[0_25px_60px_rgba(0,0,0,0.35)]"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Foto Bahan Besar */}
              <div className="lg:col-span-5 rounded-2xl sm:rounded-3xl overflow-hidden bg-[#F5F5F7] shadow-xs">
                <SmartImage
                  src={tomatBengkok.gambar}
                  alt={tomatBengkok.altText || tomatBengkok.nama}
                  fallbackEmoji={tomatBengkok.emoji}
                  aspectRatio="4:3"
                  hoverZoom={true}
                  containerClassName="w-full"
                />
              </div>

              {/* Cerita & Kutipan Petani */}
              <div className="lg:col-span-7 space-y-5">
                <div>
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-[#1E432D] uppercase tracking-wider bg-[#EBF4EE] px-3 py-1 rounded-full border border-[#2E7D4F]/20">
                      <span className="text-sm">{tomatBengkok.emoji}</span>
                      <span>Kisah Bahan Pilihan</span>
                    </span>
                    <span className="text-xs text-[#6E6E73] flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#2E7D4F]" />
                      {tomatBengkok.asal}
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[#1D1D1F]">
                    Kisah {tomatBengkok.nama} & Pak Asep
                  </h2>
                </div>

                {/* Kutipan Pak Asep */}
                <div className="relative bg-[#FBFBFD] rounded-2xl p-5 sm:p-6 border border-[#E8E8ED]">
                  <Quote className="w-7 h-7 text-[#2E7D4F]/25 mb-1" />
                  <p className="text-xs sm:text-sm text-[#3A3A3C] italic leading-relaxed">
                    &ldquo;Dulu, waktu tomat bentuknya bengkok sedikit atau kulitnya retak karena
                    hujan, pembeli borongan cuma mau beli sangat murah atau dibiarkan membusuk. Padahal
                    kalau dipanggang, air dan gulanya paling manis. Sekarang bersama Ugly2Yummy, hasil
                    kebun kami dihargai dengan layak.&rdquo;
                  </p>
                  <p className="mt-3 text-xs font-bold text-[#6E6E73]">
                    — {tomatBengkok.petani}, Petani Tomat Lembang
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                  <div className="text-xs text-[#6E6E73]">
                    Total terselamatkan:{' '}
                    <strong className="text-[#1D1D1F] font-bold">
                      {tomatBengkok.totalKgTerselamatkan.toLocaleString('id-ID')} kg
                    </strong>
                  </div>

                  <Link
                    to={`/cerita-bahan/${tomatBengkok.id}`}
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#1E432D] hover:text-[#2E7D4F] transition-colors group"
                  >
                    <span>Baca cerita selengkapnya</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* =========================================================================
          6. DAMPAK (TERANG): FOTO TERANG, OVERLAY PUTIH ±85%, ANGKA HIJAU TUA
          ========================================================================= */}
      <section className="relative py-16 sm:py-24 md:py-32 overflow-hidden text-[#1D1D1F]">
        {/* SectionBackground: Foto Terang dengan overlay putih ±85% */}
        <SectionBackground
          imageSrc={BG_DAMPAK_IMAGE}
          gradientFallback="bg-gradient-to-b from-[#F9F7F2] via-[#F4F7F3] to-[#EAEFEA]"
          overlayClassName="bg-white/90 sm:bg-white/85 backdrop-blur-[2px]"
          altText="Latar belakang Dampak"
        />

        <Container className="relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={fadeUpVariant}
            className="max-w-2xl mx-auto text-center mb-12 sm:mb-16"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF4EE] text-[#1E432D] text-xs font-bold uppercase tracking-wider mb-2 border border-[#2E7D4F]/20">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D4F]" />
              Dampak Nyata Bersama
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#1D1D1F]">
              Bukan Sekadar Makanan, Ini Perubahan Nyata.
            </h2>
            <p className="mt-3 text-xs sm:text-base text-[#48484A] max-w-lg mx-auto leading-relaxed">
              Tiap produk yang kamu nikmati langsung mengurangi jejak limbah pangan dan memberdayakan
              keluarga petani di pelosok negeri.
            </p>
          </motion.div>

          {/* 3 Angka Besar Hijau Tua */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto text-center">
            {/* Stat 1 */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              variants={fadeUpVariant}
              className="bg-white/90 rounded-3xl p-6 sm:p-8 border border-[#E8E8ED] shadow-sm"
            >
              <div className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#1E432D] tabular-nums tracking-tight">
                {LANDING_IMPACT.totalKgPangan.toLocaleString('id-ID')}
                <span className="text-[#2E7D4F] text-xl sm:text-2xl font-bold ml-1">kg</span>
              </div>
              <p className="mt-3 text-sm sm:text-base text-[#1D1D1F] font-bold">
                Pangan Terselamatkan
              </p>
              <p className="text-xs text-[#6E6E73] mt-1">
                Buah & sayur layak konsumsi dari limbah
              </p>
            </motion.div>

            {/* Stat 2 */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              variants={fadeUpVariant}
              transition={{ delay: shouldReduceMotion ? 0 : 0.1 }}
              className="bg-white/90 rounded-3xl p-6 sm:p-8 border border-[#E8E8ED] shadow-sm"
            >
              <div className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#1E432D] tabular-nums tracking-tight">
                {LANDING_IMPACT.petaniMitra}
              </div>
              <p className="mt-3 text-sm sm:text-base text-[#1D1D1F] font-bold">
                Petani Mitra
              </p>
              <p className="text-xs text-[#6E6E73] mt-1">
                Didukung dengan skema beli harga adil
              </p>
            </motion.div>

            {/* Stat 3 */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              variants={fadeUpVariant}
              transition={{ delay: shouldReduceMotion ? 0 : 0.2 }}
              className="bg-white/90 rounded-3xl p-6 sm:p-8 border border-[#E8E8ED] shadow-sm"
            >
              <div className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#1E432D] tabular-nums tracking-tight">
                {LANDING_IMPACT.totalPembeli.toLocaleString('id-ID')}
                <span className="text-[#2E7D4F] text-xl sm:text-2xl font-bold ml-1">+</span>
              </div>
              <p className="mt-3 text-sm sm:text-base text-[#1D1D1F] font-bold">
                Pembeli Peduli
              </p>
              <p className="text-xs text-[#6E6E73] mt-1">
                Menikmati kelezatan ramah lingkungan
              </p>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* =========================================================================
          7. PENUTUP (GELAP): FOTO GELAP, OVERLAY HIJAU TUA ±75%, KARTU AJAKAN PUTIH
          ========================================================================= */}
      <section className="relative py-16 sm:py-24 md:py-32 overflow-hidden text-[#1D1D1F]">
        {/* SectionBackground: Foto Gelap dengan overlay hijau tua ±75% */}
        <SectionBackground
          imageSrc={BG_PENUTUP_IMAGE}
          gradientFallback="bg-gradient-to-b from-[#142E1E] via-[#0E2316] to-[#09170E]"
          overlayClassName="bg-[#0F2618]/85 sm:bg-[#0F2618]/75 backdrop-blur-[2px]"
          altText="Latar belakang Ajakan Penutup"
        />

        <Container size="narrow" className="relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={fadeUpVariant}
            className="bg-white rounded-3xl sm:rounded-[36px] border border-white/20 p-8 sm:p-14 md:p-16 text-center shadow-2xl"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#EBF4EE] text-[#1E432D] flex items-center justify-center mx-auto mb-5 shadow-xs">
              <Sparkles className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>

            <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#1D1D1F]">
              Siap mencicipi yang tak sempurna?
            </h2>

            <p className="mt-3 sm:mt-4 text-xs sm:text-base text-[#48484A] max-w-md mx-auto leading-relaxed">
              Kamu bisa langsung berbelanja produk lezat ini tanpa perlu mendaftar, atau masuk ke akun demo untuk menyimpan keranjang dan memantau riwayat pesananmu.
            </p>

            <div className="mt-7 sm:mt-9 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              {isLoggedIn ? (
                <Button
                  to="/produk"
                  variant="primary"
                  size="lg"
                  icon={<ArrowRight className="w-4 h-4" />}
                  iconPosition="right"
                  className="bg-[#2E7D4F] hover:bg-[#256640] text-white shadow-md font-semibold text-xs sm:text-sm"
                >
                  Belanja Sekarang
                </Button>
              ) : (
                <>
                  <Button
                    onClick={handleBuyerCta}
                    variant="primary"
                    size="lg"
                    icon={<ArrowRight className="w-4 h-4" />}
                    iconPosition="right"
                    className="bg-[#2E7D4F] hover:bg-[#256640] text-white shadow-md font-semibold text-xs sm:text-sm"
                  >
                    Masuk sebagai Pembeli
                  </Button>
                  <button
                    type="button"
                    onClick={handleGuestBuy}
                    className="inline-flex items-center justify-center font-semibold transition-all duration-200 rounded-full text-xs sm:text-sm px-6 py-3 min-h-[46px] sm:min-h-[50px] bg-[#F5F5F7] hover:bg-[#E8E8ED] text-[#1D1D1F] border border-[#E8E8ED] active:scale-[0.98] cursor-pointer"
                  >
                    Beli Tanpa Login
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </Container>
      </section>
    </div>
  );
};
