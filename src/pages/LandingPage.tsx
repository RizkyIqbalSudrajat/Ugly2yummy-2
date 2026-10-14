import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';
import { SmartImage } from '../components/ui/SmartImage';
import { PRODUCTS, INGREDIENTS, LANDING_IMPACT } from '../data/dummy';
import {
  ArrowRight,
  Sparkles,
  Truck,
  CookingPot,
  HeartHandshake,
  Quote,
  MapPin,
} from 'lucide-react';

import { Variants } from 'framer-motion';

const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: 'easeOut',
    },
  },
};

// Foto latar belakang lahan pertanian untuk Hero
const HERO_FARM_IMAGE =
  'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=2000&q=80';

export const LandingPage: React.FC = () => {
  const { isLoggedIn, loginDemo } = useAuth();
  const navigate = useNavigate();
  const [bgImageError, setBgImageError] = React.useState(false);

  // Tomat Bengkok ingredient for section 5
  const tomatBengkok = INGREDIENTS.find((i) => i.id === 'tomat-bengkok') || INGREDIENTS[0];

  // Bento products (1 featured large + 3 secondary)
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
          1. HERO SECTION (Latar Foto Pertanian Full-Width + Overlay Gelap)
          ========================================================================= */}
      <section className="relative w-full min-h-[80vh] md:min-h-[85vh] lg:min-h-[90vh] flex items-center bg-gradient-to-br from-[#0a1c10] via-[#122e1b] to-[#07130a] overflow-hidden -mt-[52px] sm:-mt-14 pt-[80px] sm:pt-24 pb-14 sm:pb-20">
        {/* Foto Background Pertanian Full-Width */}
        {!bgImageError && (
          <img
            src={HERO_FARM_IMAGE}
            alt="Lahan pertanian tempat bahan Ugly2Yummy dipanen"
            onError={() => setBgImageError(true)}
            className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none"
          />
        )}

        {/* Overlay Gelap Gradasi untuk Aksesibilitas Kontras Teks (60%-85% ke 25%) */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/65 to-black/35 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />

        <Container className="relative z-10 w-full">
          <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-center">
            {/* Kolom Teks & Aksi Hero (Di HP cukup teks dan tombol saja) */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUpVariant}
              className="lg:col-span-7 xl:col-span-7 text-left max-w-2xl"
            >
              {/* Label Kecil: Toko Online Produk Upcycled */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-semibold uppercase tracking-wider mb-5 sm:mb-6 border border-white/20 shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80]" />
                <span>Toko Online Produk Upcycled</span>
              </div>

              {/* Judul Besar dengan Kata Aksen Hijau Muda */}
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-[1.08] text-balance">
                Tak sempurna di mata, <br className="hidden sm:inline" />
                <span className="font-['Instrument_Serif'] italic font-normal text-[#86EFAC] text-[1.12em] tracking-normal inline-block drop-shadow-sm">
                  sempurna di rasa.
                </span>
              </h1>

              {/* Subjudul Putih Jelas & Ramah */}
              <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-white/90 max-w-xl leading-relaxed text-balance font-normal">
                Belanja selai, saus, dan camilan dari bahan imperfect, dikirim langsung ke rumahmu.
              </p>

              {/* Tombol Aksi: Hijau Pill & Putih Transparan Blur */}
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
                <Link
                  to="/cerita-bahan"
                  className="inline-flex items-center justify-center font-medium transition-all duration-200 rounded-full text-sm sm:text-base px-6 py-3 min-h-[46px] sm:min-h-[50px] bg-white/15 hover:bg-white/25 text-white border border-white/30 backdrop-blur-md shadow-xs active:scale-[0.98]"
                >
                  Cerita Bahan
                </Link>
              </div>

              {/* Baris Info Kecil Pengiriman */}
              <p className="mt-4 sm:mt-5 text-xs sm:text-sm text-white/80 leading-relaxed">
                Kirim ke seluruh Indonesia · Bayar via transfer, e-wallet, atau COD
              </p>
            </motion.div>

            {/* Kolom Kanan: Kartu Kaca Produk Unggulan (Hanya tampil di Desktop, bersih & elegan) */}
            <motion.div
              initial={{ opacity: 0, x: 25 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
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
          2. MISI: SATU PARAGRAF BESAR YANG TENANG
          ========================================================================= */}
      <section className="py-14 sm:py-24 md:py-32 bg-[#F5F5F7]">
        <Container size="narrow">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeUpVariant}
            className="text-center sm:text-left space-y-6"
          >
            <span className="text-xs font-semibold uppercase tracking-wider text-[#2E7D4F] block">
              Misi Kami
            </span>

            <p className="text-2xl sm:text-3xl md:text-4xl text-[#1D1D1F] font-medium leading-[1.35] tracking-tight">
              Di perkebunan nusantara, ribuan ton tomat bengkok, wortel bercabang, dan pisang
              berbintik manis terbuang sia-sia setiap panen bukan karena rasa yang kurang,
              melainkan semata karena standar visual etalase ritel yang kaku. Kami hadir untuk
              menjembatani kebaikan itu — menghargai setiap tetes keringat petani dan mengubah
              apa yang dicap &quot;tak sempurna&quot; menjadi kemurnian rasa yang layak berada di
              meja makan keluarga Anda.
            </p>

            <div className="pt-4 flex items-center gap-3 text-sm text-[#6E6E73]">
              <span className="font-semibold text-[#1D1D1F]">Ugly2Yummy Manifesto</span>
              <span>·</span>
              <span>Gerakan Upcycled Food Indonesia</span>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* =========================================================================
          3. CARA KERJA: 3 LANGKAH BERJAJAR
          ========================================================================= */}
      <section className="py-14 sm:py-24 md:py-32">
        <Container>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeUpVariant}
            className="max-w-2xl mx-auto text-center mb-16 sm:mb-20"
          >
            <span className="text-xs font-semibold uppercase tracking-wider text-[#2E7D4F] block mb-2">
              Siklus Kebaikan
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1D1D1F]">
              Cara Kerja
            </h2>
            <p className="mt-3 text-base text-[#6E6E73]">
              Dari kebun petani hingga ke meja makan Anda melalui proses yang transparan dan terjaga.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {/* Step 1 */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={fadeUpVariant}
              className="bg-white rounded-3xl p-8 sm:p-10 border border-[#E8E8ED] flex flex-col justify-between shadow-none hover:border-[#2E7D4F]/30 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-[#EBF4EE] text-[#2E7D4F] flex items-center justify-center">
                    <Truck className="w-6 h-6 stroke-[1.5]" />
                  </div>
                  <span className="text-2xl font-bold text-[#E8E8ED] font-mono">01</span>
                </div>

                <h3 className="text-xl font-bold text-[#1D1D1F] tracking-tight mb-3">
                  Diselamatkan dari Petani
                </h3>
                <p className="text-sm text-[#6E6E73] leading-relaxed">
                  Kami membeli langsung hasil panen berkualitas yang ditolak pasar modern karena
                  bentuk melengkung, ukuran mini, atau kulit berbercak dengan harga yang adil.
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-[#E8E8ED]/60 text-xs text-[#2E7D4F] font-medium flex items-center gap-1.5">
                <HeartHandshake className="w-4 h-4" />
                <span>86 Petani Mitra Terhubung</span>
              </div>
            </motion.div>

            {/* Step 2 */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={fadeUpVariant}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl p-8 sm:p-10 border border-[#E8E8ED] flex flex-col justify-between shadow-none hover:border-[#2E7D4F]/30 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-[#EBF4EE] text-[#2E7D4F] flex items-center justify-center">
                    <CookingPot className="w-6 h-6 stroke-[1.5]" />
                  </div>
                  <span className="text-2xl font-bold text-[#E8E8ED] font-mono">02</span>
                </div>

                <h3 className="text-xl font-bold text-[#1D1D1F] tracking-tight mb-3">
                  Diseleksi dan Diolah
                </h3>
                <p className="text-sm text-[#6E6E73] leading-relaxed">
                  Buah dan sayur disortir higienis, memastikan nutrisi dan kesegarannya utuh.
                  Dimasak perlahan secara artisan tanpa bahan pengawet sintetik.
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-[#E8E8ED]/60 text-xs text-[#2E7D4F] font-medium flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>Resep Alami Tanpa Kimia</span>
              </div>
            </motion.div>

            {/* Step 3 */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={fadeUpVariant}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl p-8 sm:p-10 border border-[#E8E8ED] flex flex-col justify-between shadow-none hover:border-[#2E7D4F]/30 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-[#EBF4EE] text-[#2E7D4F] flex items-center justify-center">
                    <Sparkles className="w-6 h-6 stroke-[1.5]" />
                  </div>
                  <span className="text-2xl font-bold text-[#E8E8ED] font-mono">03</span>
                </div>

                <h3 className="text-xl font-bold text-[#1D1D1F] tracking-tight mb-3">
                  Sampai di Mejamu
                </h3>
                <p className="text-sm text-[#6E6E73] leading-relaxed">
                  Dikemas rapi dalam wadah kaca dan pouch ramah lingkungan. Siap Anda nikmati
                  sebagai sarapan, camilan sehat, atau bumbu masak keluarga.
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-[#E8E8ED]/60 text-xs text-[#2E7D4F] font-medium flex items-center gap-1.5">
                <span>Transparansi kg Diselamatkan</span>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* =========================================================================
          4. PRODUK UNGGULAN: BENTO GRID 4 PRODUK
          ========================================================================= */}
      <section className="py-14 sm:py-24 md:py-32 bg-[#F5F5F7]">
        <Container>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeUpVariant}
            className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12 sm:mb-16"
          >
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#2E7D4F] block mb-2">
                Pilihan Terbaik
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1D1D1F]">
                Produk Unggulan
              </h2>
              <p className="mt-2 text-sm sm:text-base text-[#6E6E73]">
                Dibuat segar dengan takaran bahan alami penuh cita rasa otentik.
              </p>
            </div>

            <Button
              to="/produk"
              variant="outline"
              size="md"
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
            >
              Lihat Semua Produk
            </Button>
          </motion.div>

          {/* Bento Grid: 1 Kartu Besar (kiri / 2 kolom), 3 Kartu Kecil (kanan / bertumpuk atau bersebelahan) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Kartu Besar (Bento Item 1) */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={fadeUpVariant}
              onClick={() => navigate(`/produk/${bentoProducts[0].id}`)}
              className="lg:col-span-7 group bg-white rounded-3xl border border-[#E8E8ED] p-6 sm:p-8 flex flex-col justify-between shadow-none hover:border-[#2E7D4F]/30 hover:shadow-xs transition-all duration-300 cursor-pointer"
            >
              <div>
                <div className="relative rounded-2xl overflow-hidden bg-[#F5F5F7] mb-6">
                  <SmartImage
                    src={bentoProducts[0].gambar}
                    alt={bentoProducts[0].nama}
                    fallbackEmoji={bentoProducts[0].gambarEmojiFallback}
                    aspectRatio="16:9"
                    hoverZoom={true}
                    containerClassName="w-full"
                  />
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-[#2E7D4F]">
                    {bentoProducts[0].estimasiKgTerselamatkan} kg Terselamatkan
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-xs text-[#6E6E73] uppercase tracking-wider font-medium">
                    {bentoProducts[0].kategori} · {bentoProducts[0].ukuran}
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-[#1D1D1F] group-hover:text-[#2E7D4F] transition-colors">
                    {bentoProducts[0].nama}
                  </h3>
                  <p className="text-sm text-[#6E6E73] leading-relaxed line-clamp-2">
                    {bentoProducts[0].deskripsiSingkat}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-[#E8E8ED]/70 flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#6E6E73] block">Asal Bahan:</span>
                  <span className="text-xs sm:text-sm font-semibold text-[#1D1D1F]">
                    {bentoProducts[0].bahanUtama} (Lembang, Jawa Barat)
                  </span>
                </div>
                <span className="text-base sm:text-lg font-bold text-[#1D1D1F] tabular-nums">
                  Rp{bentoProducts[0].harga.toLocaleString('id-ID')}
                </span>
              </div>
            </motion.div>

            {/* 3 Kartu Kecil (Bento Items 2, 3, 4) */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              {bentoProducts.slice(1, 4).map((product, idx) => (
                <motion.div
                  key={product.id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-60px' }}
                  variants={fadeUpVariant}
                  transition={{ delay: idx * 0.1 }}
                  onClick={() => navigate(`/produk/${product.id}`)}
                  className="group bg-white rounded-3xl border border-[#E8E8ED] p-5 sm:p-6 flex flex-col sm:flex-row items-center gap-5 shadow-none hover:border-[#2E7D4F]/30 hover:shadow-xs transition-all duration-300 cursor-pointer"
                >
                  <div className="w-full sm:w-32 h-32 shrink-0 rounded-2xl overflow-hidden bg-[#F5F5F7]">
                    <SmartImage
                      src={product.gambar}
                      alt={product.nama}
                      fallbackEmoji={product.gambarEmojiFallback}
                      aspectRatio="1:1"
                      hoverZoom={true}
                      containerClassName="w-full h-full"
                    />
                  </div>

                  <div className="flex-1 min-w-0 w-full flex flex-col justify-between h-full">
                    <div>
                      <div className="text-[11px] text-[#6E6E73] uppercase tracking-wider font-medium mb-1">
                        {product.kategori}
                      </div>
                      <h4 className="text-base font-bold text-[#1D1D1F] group-hover:text-[#2E7D4F] transition-colors line-clamp-1">
                        {product.nama}
                      </h4>
                      <p className="text-xs text-[#6E6E73] mt-1 line-clamp-1">
                        Bahan: {product.bahanUtama}
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-[#E8E8ED]/60 flex items-center justify-between">
                      <span className="text-xs font-bold text-[#1D1D1F] tabular-nums">
                        Rp{product.harga.toLocaleString('id-ID')}
                      </span>
                      <span className="text-[11px] font-semibold text-[#2E7D4F] bg-[#EBF4EE] px-2 py-0.5 rounded-full">
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
          5. CERITA BAHAN: SATU KARTU CERITA BESAR TOMAT BENGKOK LEMBANG
          ========================================================================= */}
      <section className="py-14 sm:py-24 md:py-32">
        <Container>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeUpVariant}
            className="max-w-5xl mx-auto bg-white rounded-3xl sm:rounded-[36px] border border-[#E8E8ED] overflow-hidden p-6 sm:p-10 md:p-12 shadow-none"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Foto Bahan Besar */}
              <div className="lg:col-span-5 rounded-2xl sm:rounded-3xl overflow-hidden bg-[#F5F5F7]">
                <SmartImage
                  src={tomatBengkok.gambar}
                  alt={tomatBengkok.altText || tomatBengkok.nama}
                  fallbackEmoji={tomatBengkok.emoji}
                  aspectRatio="4:3"
                  hoverZoom={true}
                  containerClassName="w-full"
                />
              </div>

              {/* Cerita & Kutipan */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#2E7D4F] uppercase tracking-wider bg-[#EBF4EE] px-3 py-1 rounded-full">
                      <span className="text-sm">{tomatBengkok.emoji}</span>
                      <span>Kisah Bahan Pilihan</span>
                    </span>
                    <span className="text-xs text-[#6E6E73] flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#2E7D4F]" />
                      {tomatBengkok.asal}
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#1D1D1F]">
                    Kisah {tomatBengkok.nama} & Pak Asep
                  </h2>
                </div>

                {/* Kutipan Pak Asep */}
                <div className="relative bg-[#F5F5F7] rounded-2xl p-5 sm:p-6 border border-[#E8E8ED]">
                  <Quote className="w-8 h-8 text-[#2E7D4F]/20 mb-2" />
                  <p className="text-sm sm:text-base text-[#1D1D1F] italic leading-relaxed">
                    &ldquo;Dulu, waktu tomat bentuknya bengkok sedikit atau kulitnya retak karena
                    hujan, tengkulak cuma mau beli sangat murah atau bahkan dibuang. Padahal kalau
                    dipanggang, air dan gulanya paling manis. Sekarang bersama Ugly2Yummy, hasil
                    kebun kami dihargai dengan layak.&rdquo;
                  </p>
                  <p className="mt-3 text-xs font-semibold text-[#6E6E73]">
                    — {tomatBengkok.petani}, Petani Tomat Lembang
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                  <div className="text-xs text-[#6E6E73]">
                    Total terselamatkan:{' '}
                    <strong className="text-[#1D1D1F] font-bold">
                      {tomatBengkok.totalKgTerselamatkan.toLocaleString('id-ID')} kg
                    </strong>
                  </div>

                  <Link
                    to={`/cerita-bahan/${tomatBengkok.id}`}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2E7D4F] hover:text-[#256640] transition-colors group"
                  >
                    <span>Baca ceritanya</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* =========================================================================
          6. DAMPAK: SECTION GELAP DENGAN 3 ANGKA BESAR
          ========================================================================= */}
      <section className="bg-[#141414] text-white py-24 sm:py-32">
        <Container>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeUpVariant}
            className="max-w-3xl mx-auto text-center mb-16 sm:mb-20"
          >
            <span className="text-xs font-semibold uppercase tracking-wider text-[#8FE3AC] block mb-3">
              DAMPAK NYATA BERSAMA
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
              Bukan Sekadar Makanan, Ini Perubahan Nyata.
            </h2>
            <p className="mt-4 text-base sm:text-lg text-white/70 max-w-xl mx-auto leading-relaxed">
              Tiap produk yang Anda cicipi langsung mengurangi jejak limbah pangan dan memberdayakan
              keluarga petani di pelosok negeri.
            </p>
          </motion.div>

          {/* 3 Angka Besar dari PRD */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-8 max-w-5xl mx-auto text-center divide-y sm:divide-y-0 sm:divide-x divide-white/10">
            {/* Stat 1 */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={fadeUpVariant}
              className="pt-8 sm:pt-0 sm:px-6"
            >
              <div className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white tabular-nums tracking-tight">
                {LANDING_IMPACT.totalKgPangan.toLocaleString('id-ID')}
                <span className="text-[#8FE3AC] text-2xl sm:text-3xl font-bold ml-1.5">kg</span>
              </div>
              <p className="mt-4 text-base text-white/90 font-medium">Pangan Terselamatkan</p>
              <p className="text-xs text-white/50 mt-1">Buah & sayur layak konsumsi dari limbah</p>
            </motion.div>

            {/* Stat 2 */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={fadeUpVariant}
              transition={{ delay: 0.1 }}
              className="pt-8 sm:pt-0 sm:px-6"
            >
              <div className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white tabular-nums tracking-tight">
                {LANDING_IMPACT.petaniMitra}
              </div>
              <p className="mt-4 text-base text-white/90 font-medium">Petani Mitra</p>
              <p className="text-xs text-white/50 mt-1">Didukung dengan skema beli harga adil</p>
            </motion.div>

            {/* Stat 3 */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={fadeUpVariant}
              transition={{ delay: 0.2 }}
              className="pt-8 sm:pt-0 sm:px-6"
            >
              <div className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white tabular-nums tracking-tight">
                {LANDING_IMPACT.totalPembeli.toLocaleString('id-ID')}
                <span className="text-[#8FE3AC] text-2xl sm:text-3xl font-bold ml-1.5">+</span>
              </div>
              <p className="mt-4 text-base text-white/90 font-medium">Pembeli Peduli</p>
              <p className="text-xs text-white/50 mt-1">
                Menikmati kelezatan rasa ramah lingkungan
              </p>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* =========================================================================
          7. PENUTUP / AJAKAN
          ========================================================================= */}
      <section className="py-24 sm:py-32 md:py-36">
        <Container size="narrow">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeUpVariant}
            className="bg-white rounded-3xl sm:rounded-[36px] border border-[#E8E8ED] p-10 sm:p-16 text-center shadow-none"
          >
            <div className="w-14 h-14 rounded-full bg-[#EBF4EE] text-[#2E7D4F] flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-7 h-7" />
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#1D1D1F]">
              Siap mencicipi yang tak sempurna?
            </h2>

            <p className="mt-4 text-base sm:text-lg text-[#6E6E73] max-w-md mx-auto leading-relaxed">
              Masuk sebagai pembeli untuk menjelajahi katalog, menyimpan keranjang, dan memantau
              langsung dampak kilogram pangan yang Anda selamatkan.
            </p>

            <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-4">
              <Button
                onClick={handleBuyerCta}
                variant="primary"
                size="lg"
                icon={<ArrowRight className="w-4 h-4" />}
                iconPosition="right"
              >
                Masuk sebagai Pembeli
              </Button>
              <Button to="/produk" variant="secondary" size="lg">
                Jelajahi Dulu
              </Button>
            </div>
          </motion.div>
        </Container>
      </section>
    </div>
  );
};
