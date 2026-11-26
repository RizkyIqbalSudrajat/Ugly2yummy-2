import React, { useState } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { INGREDIENTS, PRODUCTS } from '../data/dummy';
import { Container } from '../components/ui/Container';
import { SmartImage } from '../components/ui/SmartImage';
import {
  ArrowLeft,
  MapPin,
  User,
  Calendar,
  Sparkles,
  Quote,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sprout,
  Sun,
  XCircle,
  HeartHandshake,
  ChefHat,
  ChevronDown,
} from 'lucide-react';
import { CommentSection, CommentItem } from '../components/ui/CommentSection';

export const IngredientDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  // State navigasi dari halaman sebelumnya (misal dari ProductDetailPage)
  const navState = location.state as {
    from?: string;
    productId?: string;
    productName?: string;
  } | null;

  const shouldReduceMotion = useReducedMotion();

  const ingredient =
    INGREDIENTS.find((i) => i.id === id) || INGREDIENTS[0];

  // Cari produk olahan dari bahan ini
  const relatedProducts = PRODUCTS.filter((p) =>
    ingredient.produkOlahIds.includes(p.id)
  );

  const formattedSaved = ingredient.totalKgTerselamatkan.toLocaleString('id-ID');

  // Navigasi Kembali Cerdas
  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    if (navState?.from === 'produk' || location.key !== 'default') {
      navigate(-1);
    } else {
      navigate('/cerita-bahan');
    }
  };

  let backLabel = 'Kembali ke Semua Cerita Bahan';
  if (navState?.from === 'produk' && navState.productName) {
    backLabel = `Kembali ke ${navState.productName}`;
  } else if (location.key !== 'default') {
    backLabel = 'Kembali';
  }

  // 5 Tahap Proses Bertani
  const timelineSteps = [
    {
      no: '1',
      title: 'Ditanam',
      icon: Sprout,
      desc: `Dirawat dengan dedikasi oleh ${ingredient.petani} di tanah alami tanpa rekayasa bentuk.`,
    },
    {
      no: '2',
      title: 'Dipanen',
      icon: Sun,
      desc: 'Dipetik saat kematangan nutrisi dan aroma alami berada di puncak rasa terbaiknya.',
    },
    {
      no: '3',
      title: 'Ditolak Pasar',
      icon: XCircle,
      desc: 'Ditolak distributor ritel konvensional hanya karena ukuran atau lekukan tidak simetris.',
    },
    {
      no: '4',
      title: 'Diselamatkan',
      icon: HeartHandshake,
      desc: 'Ugly2Yummy membeli hasil panen ini dengan harga adil langsung dari tangan petani.',
    },
    {
      no: '5',
      title: 'Diolah',
      icon: ChefHat,
      desc: 'Diolah bersih di dapur artisan menjadi hidangan bergizi tinggi untuk keluarga Anda.',
    },
  ];

  // Accordion State: Default SEMUA TERTUTUP (false)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    proses: false,
    petani: false,
    cerita: false,
    kutipan: false,
  });

  const toggleSection = (sectionKey: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  const isAllOpen = Object.values(openSections).every(Boolean);

  const handleToggleAll = () => {
    const nextState = !isAllOpen;
    setOpenSections({
      proses: nextState,
      petani: nextState,
      cerita: nextState,
      kutipan: nextState,
    });
  };

  const ingredientComments: CommentItem[] = [
    {
      id: 'ing-c1',
      nama: 'Rizka Handayani',
      inisial: 'RH',
      tanggal: '4 hari lalu',
      isi: `Sangat menginspirasi membaca kisah ${ingredient.petani}. Selama ini sering mendengar istilah food waste, baru sadar dampaknya nyata sekali bagi petani lokal kita.`,
      badge: 'Sahabat Petani',
    },
    {
      id: 'ing-c2',
      nama: 'Hendra Wijaya',
      inisial: 'HW',
      tanggal: '1 minggu lalu',
      isi: `Tanah di daerah ${ingredient.asal.split(',')[0]} memang istimewa. Senang sekali ada brand yang menghargai cita rasa buah apa adanya tanpa diskriminasi visual.`,
      badge: 'Warga Komunitas',
    },
    {
      id: 'ing-c3',
      nama: 'Dewi Lestari',
      inisial: 'DL',
      tanggal: '2 minggu lalu',
      isi: `Rasa produk olahannya terbukti jauh lebih manis dan beraroma. Sukses terus untuk para petani mitra di ${ingredient.asal.split(',')[0]}!`,
    },
  ];

  return (
    <article className="py-10 sm:py-16 md:py-20 space-y-14 sm:space-y-20">
      {/* =========================================================================
          1. HERO FOTO LEBAR DENGAN JUDUL
          ========================================================================= */}
      <section>
        <Container>
          {/* Tombol Navigasi Kembali Cerdas */}
          <div className="mb-6 sm:mb-8">
            {navState?.from === 'produk' || location.key !== 'default' ? (
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6E6E73] hover:text-[#2E7D4F] transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{backLabel}</span>
              </button>
            ) : (
              <Link
                to="/cerita-bahan"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6E6E73] hover:text-[#2E7D4F] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali ke Semua Cerita Bahan</span>
              </Link>
            )}
          </div>

          {/* Hero Banner Container */}
          <div className="relative rounded-3xl sm:rounded-[36px] overflow-hidden bg-[#1D1D1F] border border-white/10 shadow-xs min-h-[380px] sm:min-h-[480px] lg:min-h-[540px] flex flex-col justify-end p-6 sm:p-12 lg:p-16">
            <div className="absolute inset-0 z-0">
              <SmartImage
                src={ingredient.gambar}
                alt={ingredient.altText || ingredient.nama}
                fallbackEmoji={ingredient.emoji}
                aspectRatio="16:9"
                containerClassName="w-full h-full"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/25" />
            </div>

            <div className="relative z-10 max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-semibold border border-white/25">
                <span className="text-sm">{ingredient.emoji}</span>
                <span>Kisah Bahan Asli Nusantara</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1] text-balance">
                {ingredient.nama} dari {ingredient.asal.split(',')[0]}
              </h1>

              <p className="text-base sm:text-lg text-white/80 max-w-xl leading-relaxed">
                Di balik bentuk yang dianggap tidak sempurna, ada dedikasi petani lokal dan cita
                rasa alami terbaik.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* =========================================================================
          2. BARIS FAKTA SINGKAT
          ========================================================================= */}
      <section>
        <Container>
          <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-[#E8E8ED] p-6 sm:p-8 shadow-none">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-5 md:divide-x md:divide-[#E8E8ED]">
              <div className="md:first:pl-0 md:px-4 space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#6E6E73] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#2E7D4F]" />
                  Asal Daerah
                </span>
                <p className="text-sm sm:text-base font-bold text-[#1D1D1F]">
                  {ingredient.asal}
                </p>
              </div>

              <div className="md:px-4 space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#6E6E73] flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#2E7D4F]" />
                  Petani Mitra
                </span>
                <p className="text-sm sm:text-base font-bold text-[#1D1D1F]">
                  {ingredient.petani}
                </p>
              </div>

              <div className="md:px-4 space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#6E6E73] flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#2E7D4F]" />
                  Musim Panen
                </span>
                <p className="text-sm sm:text-base font-bold text-[#1D1D1F]">
                  {ingredient.musimPanen || 'Sepanjang Tahun'}
                </p>
              </div>

              <div className="md:px-4 space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#6E6E73] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#2E7D4F]" />
                  Terselamatkan
                </span>
                <p className="text-sm sm:text-base font-bold text-[#2E7D4F] tabular-nums">
                  {formattedSaved} kg
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* =========================================================================
          KELOMPOK ACCORDION: KISAH LENGKAP BAHAN INI (BISA DIBUKA-TUTUP)
          Menggabungkan:
          1. Asal Bahan & Proses Bertani
          2. Profil Petani Mitra
          3. Cerita Perjalanan Bahan
          4. Kutipan Langsung Petani
          ========================================================================= */}
      <section>
        <Container>
          <div className="max-w-4xl mx-auto space-y-5">
            {/* Header Accordion & Tombol Buka/Tutup Semua */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-3 border-b border-[#E8E8ED]">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#2E7D4F] block mb-1">
                  Eksplorasi Mendalam
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1D1D1F]">
                  Kisah Lengkap Bahan Ini
                </h2>
              </div>

              <button
                type="button"
                onClick={handleToggleAll}
                className="text-xs sm:text-sm font-semibold text-[#2E7D4F] hover:text-[#256640] hover:underline cursor-pointer self-start sm:self-auto"
              >
                {isAllOpen ? 'Tutup semua' : 'Buka semua'}
              </button>
            </div>

            {/* List 4 Baris Accordion */}
            <div className="space-y-3.5">
              {/* 1. Asal Bahan & Proses Bertani */}
              <div className="bg-white rounded-3xl border border-[#E8E8ED] overflow-hidden shadow-xs transition-colors hover:border-[#2E7D4F]/30">
                <button
                  type="button"
                  aria-expanded={openSections.proses}
                  aria-controls="accordion-content-proses"
                  id="accordion-header-proses"
                  onClick={() => toggleSection('proses')}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2E7D4F]"
                >
                  <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#EBF4EE] text-[#1E432D] flex items-center justify-center shrink-0">
                      <Sprout className="w-5 h-5 stroke-[1.8]" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base sm:text-lg font-bold text-[#1D1D1F] tracking-tight">
                        Asal Bahan &amp; Proses Bertani
                      </h3>
                      <p className="text-xs sm:text-sm text-[#6E6E73] mt-0.5 truncate sm:text-wrap">
                        5 tahap transparan dari kebun sampai dapur olahan
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 text-[#8E8E93] ml-2">
                    <ChevronDown
                      className={`w-5 h-5 transition-transform duration-300 ${
                        openSections.proses ? 'rotate-180 text-[#2E7D4F]' : ''
                      }`}
                    />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {openSections.proses && (
                    <motion.div
                      id="accordion-content-proses"
                      role="region"
                      aria-labelledby="accordion-header-proses"
                      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
                      transition={{ duration: shouldReduceMotion ? 0 : 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-6 sm:px-8 sm:pb-8 pt-2 border-t border-[#E8E8ED]/70 space-y-6">
                        <div className="text-center max-w-xl mx-auto space-y-1.5 pt-2">
                          <span className="text-xs font-semibold uppercase tracking-wider text-[#2E7D4F] block">
                            Perjalanan Dari Ladang Ke Meja
                          </span>
                          <h4 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1D1D1F]">
                            Alur 5 Tahap Pengolahan
                          </h4>
                          <p className="text-xs sm:text-sm text-[#6E6E73]">
                            Setiap kilogram bahan melewati 5 tahap transparan sebelum tiba di dapur rumah Anda.
                          </p>
                        </div>

                        {/* Desktop Horizontal */}
                        <div className="hidden md:grid md:grid-cols-5 gap-4 relative pt-2">
                          <div className="absolute top-10 left-8 right-8 h-0.5 bg-[#E8E8ED] -z-0" />
                          {timelineSteps.map((step, idx) => {
                            const IconComponent = step.icon;
                            return (
                              <div
                                key={idx}
                                className="relative z-10 flex flex-col items-center text-center p-4 bg-[#FBFBFD] rounded-2xl border border-[#E8E8ED] shadow-none hover:border-[#2E7D4F]/30 transition-all duration-300"
                              >
                                <div className="w-12 h-12 rounded-full bg-[#EBF4EE] text-[#2E7D4F] flex items-center justify-center mb-3.5 border-2 border-white shadow-xs">
                                  <IconComponent className="w-5 h-5 stroke-[1.8]" />
                                </div>
                                <span className="text-[10px] font-bold text-[#2E7D4F] uppercase tracking-wider mb-1">
                                  Tahap {step.no}
                                </span>
                                <h5 className="text-sm font-bold text-[#1D1D1F] mb-1.5">
                                  {step.title}
                                </h5>
                                <p className="text-xs text-[#6E6E73] leading-relaxed">
                                  {step.desc}
                                </p>
                              </div>
                            );
                          })}
                        </div>

                        {/* Mobile Vertical */}
                        <div className="md:hidden space-y-4 relative pl-4 border-l-2 border-[#2E7D4F]/30 ml-3 pt-2">
                          {timelineSteps.map((step, idx) => {
                            const IconComponent = step.icon;
                            return (
                              <div
                                key={idx}
                                className="relative bg-[#FBFBFD] rounded-2xl border border-[#E8E8ED] p-4 shadow-none flex items-start gap-3.5"
                              >
                                <div className="absolute -left-[23px] top-5 w-3 h-3 rounded-full bg-[#2E7D4F] border-2 border-white" />
                                <div className="w-10 h-10 rounded-xl bg-[#EBF4EE] text-[#2E7D4F] flex items-center justify-center shrink-0">
                                  <IconComponent className="w-5 h-5 stroke-[1.8]" />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2 mb-0.5">
                                    <span className="text-[10px] font-bold text-[#2E7D4F] uppercase tracking-wider">
                                      Tahap {step.no}
                                    </span>
                                    <span className="text-xs font-bold text-[#1D1D1F]">
                                      {step.title}
                                    </span>
                                  </div>
                                  <p className="text-xs text-[#6E6E73] leading-relaxed">
                                    {step.desc}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 2. Profil Petani Mitra */}
              {ingredient.profilPetani && (
                <div className="bg-white rounded-3xl border border-[#E8E8ED] overflow-hidden shadow-xs transition-colors hover:border-[#2E7D4F]/30">
                  <button
                    type="button"
                    aria-expanded={openSections.petani}
                    aria-controls="accordion-content-petani"
                    id="accordion-header-petani"
                    onClick={() => toggleSection('petani')}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2E7D4F]"
                  >
                    <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                      <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#EBF4EE] text-[#1E432D] flex items-center justify-center shrink-0">
                        <User className="w-5 h-5 stroke-[1.8]" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-base sm:text-lg font-bold text-[#1D1D1F] tracking-tight">
                          Profil Petani: {ingredient.profilPetani.nama}
                        </h3>
                        <p className="text-xs sm:text-sm text-[#6E6E73] mt-0.5 truncate sm:text-wrap">
                          Kenalan dengan sosok petani yang merawat tanaman ini
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 text-[#8E8E93] ml-2">
                      <ChevronDown
                        className={`w-5 h-5 transition-transform duration-300 ${
                          openSections.petani ? 'rotate-180 text-[#2E7D4F]' : ''
                        }`}
                      />
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {openSections.petani && (
                      <motion.div
                        id="accordion-content-petani"
                        role="region"
                        aria-labelledby="accordion-header-petani"
                        initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
                        transition={{ duration: shouldReduceMotion ? 0 : 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-6 sm:px-8 sm:pb-8 pt-2 border-t border-[#E8E8ED]/70">
                          <div className="max-w-3xl mx-auto bg-[#FBFBFD] rounded-2xl border border-[#E8E8ED] p-6 sm:p-8">
                            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
                              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-[#F5F5F7] shrink-0 border-2 border-[#2E7D4F]/20 shadow-xs">
                                <img
                                  src={ingredient.profilPetani.fotoUrl}
                                  alt={ingredient.profilPetani.nama}
                                  className="w-full h-full object-cover"
                                />
                              </div>

                              <div className="space-y-4 flex-1 text-center sm:text-left">
                                <div>
                                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1.5">
                                    <span className="text-xs font-semibold uppercase tracking-wider text-[#2E7D4F]">
                                      Profil Petani Mitra
                                    </span>
                                    <span className="text-xs text-[#6E6E73]">·</span>
                                    <span className="text-xs font-semibold text-[#2E7D4F] bg-[#EBF4EE] px-2.5 py-0.5 rounded-full">
                                      {ingredient.profilPetani.lamaBertani}
                                    </span>
                                  </div>

                                  <h4 className="text-2xl font-bold text-[#1D1D1F]">
                                    {ingredient.profilPetani.nama}
                                  </h4>
                                  <p className="text-xs text-[#6E6E73] flex items-center justify-center sm:justify-start gap-1 mt-0.5">
                                    <MapPin className="w-3.5 h-3.5 text-[#2E7D4F]" />
                                    <span>{ingredient.profilPetani.daerah}</span>
                                  </p>
                                </div>

                                <div className="p-4 rounded-2xl bg-white border border-[#E8E8ED] text-xs text-[#1D1D1F] text-left">
                                  <span className="font-semibold block text-[#2E7D4F] mb-1">
                                    Cara Tanam &amp; Perawatan:
                                  </span>
                                  <p className="text-[#6E6E73] leading-relaxed">
                                    {ingredient.profilPetani.caraTanam}
                                  </p>
                                </div>

                                <blockquote className="font-['Instrument_Serif'] italic text-base sm:text-lg text-[#1D1D1F] leading-snug pt-1 border-l-2 border-[#2E7D4F]/40 pl-3.5 text-left">
                                  &ldquo;{ingredient.profilPetani.kutipan}&rdquo;
                                </blockquote>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* 3. Cerita Naratif Perjalanan Bahan */}
              <div className="bg-white rounded-3xl border border-[#E8E8ED] overflow-hidden shadow-xs transition-colors hover:border-[#2E7D4F]/30">
                <button
                  type="button"
                  aria-expanded={openSections.cerita}
                  aria-controls="accordion-content-cerita"
                  id="accordion-header-cerita"
                  onClick={() => toggleSection('cerita')}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2E7D4F]"
                >
                  <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#EBF4EE] text-[#1E432D] flex items-center justify-center shrink-0">
                      <Sparkles className="w-5 h-5 stroke-[1.8]" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base sm:text-lg font-bold text-[#1D1D1F] tracking-tight">
                        Kisah Lengkap Perjalanan {ingredient.nama}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#6E6E73] mt-0.5 truncate sm:text-wrap">
                        Cerita lengkap di balik panen dan dedikasi rasa alami
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 text-[#8E8E93] ml-2">
                    <ChevronDown
                      className={`w-5 h-5 transition-transform duration-300 ${
                        openSections.cerita ? 'rotate-180 text-[#2E7D4F]' : ''
                      }`}
                    />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {openSections.cerita && (
                    <motion.div
                      id="accordion-content-cerita"
                      role="region"
                      aria-labelledby="accordion-header-cerita"
                      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
                      transition={{ duration: shouldReduceMotion ? 0 : 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-6 sm:px-8 sm:pb-8 pt-2 border-t border-[#E8E8ED]/70">
                        <div className="max-w-2xl mx-auto space-y-5 text-[#1D1D1F] text-sm sm:text-base leading-[1.8] font-normal py-2">
                          {ingredient.ceritaPanjang && ingredient.ceritaPanjang.length > 0 ? (
                            ingredient.ceritaPanjang.map((paragraf, index) => (
                              <p key={index} className="text-balance">
                                {paragraf}
                              </p>
                            ))
                          ) : (
                            <>
                              <p className="text-balance">{ingredient.ceritaSingkat}</p>
                              <p className="text-balance">
                                Di tangan para petani yang tekun, buah dan sayur ini dirawat dengan sepenuh hati
                                tanpa memaksakan bentuk seragam pabrikan. Alam memiliki keindahannya sendiri yang
                                selalu mengejutkan indra pengecap kita.
                              </p>
                              <p className="text-balance">
                                Ketika pasar konvensional menutup pintu, Ugly2Yummy hadir merayakan setiap
                                lekukan unik dan bercak kematangan, mengubahnya menjadi produk artisan yang bernilai
                                tinggi.
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 4. Kutipan Besar Petani */}
              <div className="bg-white rounded-3xl border border-[#E8E8ED] overflow-hidden shadow-xs transition-colors hover:border-[#2E7D4F]/30">
                <button
                  type="button"
                  aria-expanded={openSections.kutipan}
                  aria-controls="accordion-content-kutipan"
                  id="accordion-header-kutipan"
                  onClick={() => toggleSection('kutipan')}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2E7D4F]"
                >
                  <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#EBF4EE] text-[#1E432D] flex items-center justify-center shrink-0">
                      <Quote className="w-5 h-5 stroke-[1.8]" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base sm:text-lg font-bold text-[#1D1D1F] tracking-tight">
                        Kutipan Langsung dari Petani Mitra
                      </h3>
                      <p className="text-xs sm:text-sm text-[#6E6E73] mt-0.5 truncate sm:text-wrap">
                        Ungkapan tulus tentang jerih payah dan cita rasa murni
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 text-[#8E8E93] ml-2">
                    <ChevronDown
                      className={`w-5 h-5 transition-transform duration-300 ${
                        openSections.kutipan ? 'rotate-180 text-[#2E7D4F]' : ''
                      }`}
                    />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {openSections.kutipan && (
                    <motion.div
                      id="accordion-content-kutipan"
                      role="region"
                      aria-labelledby="accordion-header-kutipan"
                      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
                      transition={{ duration: shouldReduceMotion ? 0 : 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-6 sm:px-8 sm:pb-8 pt-2 border-t border-[#E8E8ED]/70">
                        <div className="max-w-2xl mx-auto text-center space-y-4 py-4 bg-[#FBFBFD] rounded-2xl border border-[#E8E8ED] p-6">
                          <Quote className="w-10 h-10 text-[#2E7D4F]/30 mx-auto stroke-[1.2]" />
                          <blockquote className="font-['Instrument_Serif'] italic text-xl sm:text-2xl md:text-3xl text-[#1D1D1F] leading-snug">
                            &ldquo;
                            {ingredient.kutipanPetani?.teks ||
                              'Kami merawat hasil bumi dengan rasa cinta. Rasa manis dan aromanya tidak pernah berkurang hanya karena bentuknya tak biasa.'}
                            &rdquo;
                          </blockquote>
                          <div className="pt-2">
                            <p className="text-sm font-bold text-[#1D1D1F]">
                              {ingredient.kutipanPetani?.nama || ingredient.petani}
                            </p>
                            <p className="text-xs text-[#6E6E73] mt-0.5">
                              {ingredient.kutipanPetani?.peran || `Petani Mitra di ${ingredient.asal}`}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* =========================================================================
          7. DUA KARTU BERDAMPINGAN: "Kenapa dianggap ugly?" & "Faktanya"
          ========================================================================= */}
      <section>
        <Container size="narrow">
          <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl border border-[#E8E8ED] p-7 sm:p-8 flex flex-col justify-between shadow-none">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-[#FEF3E8] text-[#C86218] flex items-center justify-center mb-5">
                  <AlertCircle className="w-5 h-5 stroke-[1.7]" />
                </div>
                <h3 className="text-lg font-bold text-[#1D1D1F] mb-3">
                  Kenapa dianggap &quot;ugly&quot;?
                </h3>
                <p className="text-sm text-[#6E6E73] leading-relaxed">
                  {ingredient.alasanUgly}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#E8E8ED]/70 text-xs text-[#C86218] font-semibold">
                Standar Estetika Ritel Modern
              </div>
            </div>

            <div className="bg-[#EBF4EE] rounded-3xl border border-[#2E7D4F]/20 p-7 sm:p-8 flex flex-col justify-between shadow-none">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-white text-[#2E7D4F] flex items-center justify-center mb-5 shadow-xs">
                  <CheckCircle2 className="w-5 h-5 stroke-[1.7]" />
                </div>
                <h3 className="text-lg font-bold text-[#1D1D1F] mb-3">
                  Faktanya
                </h3>
                <p className="text-sm text-[#1D1D1F]/80 leading-relaxed font-medium">
                  {ingredient.fakta}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#2E7D4F]/20 text-xs text-[#2E7D4F] font-bold">
                100% Nutrisi &amp; Rasa Murni
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* =========================================================================
          8. "DIOLAH MENJADI": KARTU PRODUK YANG MEMAKAI BAHAN INI
          ========================================================================= */}
      <section className="bg-[#F5F5F7] py-16 sm:py-24">
        <Container>
          <div className="max-w-4xl mx-auto mb-10 text-center sm:text-left sm:flex sm:items-end sm:justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#2E7D4F] block mb-1">
                Karya Kuliner Upcycled
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1D1D1F]">
                Diolah Menjadi
              </h2>
              <p className="mt-1.5 text-sm text-[#6E6E73]">
                Produk artisan lezat yang dibuat langsung dari {ingredient.nama}.
              </p>
            </div>

            <Link
              to="/produk"
              className="mt-4 sm:mt-0 inline-flex items-center gap-1 text-xs font-semibold text-[#2E7D4F] hover:underline"
            >
              <span>Semua Produk</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
            {relatedProducts.map((product) => {
              const formattedPrice = new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                maximumFractionDigits: 0,
              }).format(product.harga);

              return (
                <div
                  key={product.id}
                  onClick={() => navigate(`/produk/${product.id}`)}
                  className="group bg-white rounded-3xl border border-[#E8E8ED] overflow-hidden flex flex-col justify-between shadow-none hover:shadow-xs hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
                >
                  <div className="relative w-full overflow-hidden bg-[#F5F5F7]">
                    <SmartImage
                      src={product.gambar}
                      alt={product.nama}
                      fallbackEmoji={product.gambarEmojiFallback}
                      aspectRatio="16:9"
                      hoverZoom={true}
                      containerClassName="w-full"
                    />
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-[#2E7D4F] shadow-none">
                      {product.estimasiKgTerselamatkan} kg diselamatkan
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-xs text-[#6E6E73] uppercase tracking-wider font-medium">
                        {product.kategori} · {product.ukuran}
                      </span>
                      <h3 className="text-lg sm:text-xl font-bold text-[#1D1D1F] group-hover:text-[#2E7D4F] transition-colors mt-1">
                        {product.nama}
                      </h3>
                      <p className="mt-2 text-xs sm:text-sm text-[#6E6E73] line-clamp-2 leading-relaxed">
                        {product.deskripsiSingkat}
                      </p>
                    </div>

                    <div className="mt-5 pt-4 border-t border-[#E8E8ED]/70 flex items-center justify-between">
                      <span className="text-base sm:text-lg font-bold text-[#1D1D1F] tabular-nums">
                        {formattedPrice}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#2E7D4F] group-hover:translate-x-0.5 transition-transform">
                        <span>Lihat Produk</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* =========================================================================
          9. KOLOM KOMENTAR DI BAGIAN BAWAH HALAMAN
          ========================================================================= */}
      <section className="border-t border-[#E8E8ED] pt-16 sm:pt-20">
        <Container>
          <div className="max-w-4xl mx-auto">
            <CommentSection
              title={`Diskusi & Komentar: ${ingredient.nama}`}
              subtitle={`Bagikan apresiasi, tanggapan, atau cerita Anda untuk ${ingredient.petani} dan pelestarian pangan lokal.`}
              initialComments={ingredientComments}
              allowRating={false}
              placeholderText={`Tulis pesan apresiasi untuk ${ingredient.petani}...`}
            />
          </div>
        </Container>
      </section>
    </article>
  );
};
