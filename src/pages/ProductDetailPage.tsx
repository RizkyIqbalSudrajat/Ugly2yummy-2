import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { PRODUCTS, INGREDIENTS } from '../data/dummy';
import { Container } from '../components/ui/Container';
import { SmartImage } from '../components/ui/SmartImage';
import { Button } from '../components/ui/Button';
import {
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  ShoppingBag,
  X,
  MessageCircle,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AnimatePresence, motion } from 'framer-motion';
import { CommentSection, CommentItem } from '../components/ui/CommentSection';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [added, setAdded] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);

  const product = PRODUCTS.find((p) => p.id === id) || PRODUCTS[0];
  const ingredient =
    INGREDIENTS.find((i) => i.id === product.ingredientId) || INGREDIENTS[0];

  const formattedPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(product.harga);

  const formattedOriginalPrice = product.hargaPembanding
    ? new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
      }).format(product.hargaPembanding)
    : null;

  const diskonPersen =
    product.hargaPembanding && product.hargaPembanding > product.harga
      ? Math.round(((product.hargaPembanding - product.harga) / product.hargaPembanding) * 100)
      : 0;

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      navigate('/masuk', { state: { returnUrl: location.pathname } });
      return;
    }

    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);

    // Tampilkan toast selama 4 detik
    setShowToast(true);
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = setTimeout(() => {
      setShowToast(false);
    }, 4000);
  };

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const dummyReviews: CommentItem[] = [
    {
      id: 'rev-1',
      nama: 'Alya Ramadhani',
      inisial: 'AR',
      tanggal: '3 hari lalu',
      rating: 5,
      isi: `Rasa ${product.nama} ini bener-bener kaya dan berkarakter! Teksturnya kerasa asli tanpa bahan pengental aneh. Nggak nyangka bahan yang dibilang imperfect bisa seenak ini.`,
      badge: 'Pembeli Terverifikasi',
    },
    {
      id: 'rev-2',
      nama: 'Budi Santoso',
      inisial: 'BS',
      tanggal: '1 minggu lalu',
      rating: 5,
      isi: 'Suka banget sama konsep zero-food-waste-nya. Kemasannya aman dan rapi, aromanya segar alami. Sudah pesen kedua kalinya untuk stok sarapan di rumah.',
      badge: 'Pembeli Terverifikasi',
    },
    {
      id: 'rev-3',
      nama: 'Dina Kusuma',
      inisial: 'DK',
      tanggal: '2 minggu lalu',
      rating: 4,
      isi: 'Kualitas rasa bintang lima! Harganya juga masuk akal apalagi lebih hemat dibanding produk artisan serupa. Senang bisa ikut dukung petani lokal.',
      badge: 'Pembeli Terverifikasi',
    },
  ];

  return (
    <div className="py-12 sm:py-16">
      <Container>
        <div className="mb-6">
          <Link
            to="/produk"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6E6E73] hover:text-[#2E7D4F] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Katalog Produk</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Gallery Col */}
          <div className="lg:col-span-6 bg-white rounded-3xl border border-[#E8E8ED] overflow-hidden p-3 sm:p-4 shadow-none">
            <SmartImage
              src={product.gambar}
              alt={product.nama}
              fallbackEmoji={product.gambarEmojiFallback}
              aspectRatio="4:3"
              containerClassName="rounded-2xl overflow-hidden"
            />
          </div>

          {/* Purchasing & Story Col */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="flex items-center gap-2.5 mb-2 text-xs text-[#6E6E73]">
                <span className="uppercase tracking-wider font-semibold">
                  {product.kategori}
                </span>
                <span>·</span>
                <span className="inline-flex items-center gap-1 font-semibold text-[#2E7D4F]">
                  <Sparkles className="w-3.5 h-3.5" />
                  {product.estimasiKgTerselamatkan} kg Terselamatkan
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#1D1D1F]">
                {product.nama}
              </h1>

              {/* Harga Utama, Harga Pembanding Dicoret, Label Hemat, & Keterangan */}
              <div className="mt-3 space-y-1">
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="text-2xl sm:text-3xl font-extrabold text-[#1D1D1F] tabular-nums">
                    {formattedPrice}
                  </span>
                  {formattedOriginalPrice && (
                    <span className="text-base sm:text-lg text-[#8E8E93] line-through tabular-nums">
                      {formattedOriginalPrice}
                    </span>
                  )}
                  {diskonPersen > 0 && (
                    <span className="text-xs font-bold text-[#2E7D4F] bg-[#EBF4EE] px-2.5 py-1 rounded-full">
                      Hemat {diskonPersen}%
                    </span>
                  )}
                  <span className="text-sm text-[#6E6E73]">/ {product.ukuran}</span>
                </div>
                {product.hargaPembanding && (
                  <p className="text-xs text-[#8E8E93]">
                    Dibanding produk serupa dari bahan standar.
                  </p>
                )}
              </div>
            </div>

            <p className="text-sm sm:text-base text-[#6E6E73] leading-relaxed">
              {product.deskripsiLengkap || product.deskripsiSingkat}
            </p>

            {/* Ingredients list */}
            <div className="p-4 rounded-2xl bg-[#F5F5F7] border border-[#E8E8ED]">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#1D1D1F] mb-2">
                Komposisi Bersih & Alami:
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#1D1D1F]">
                {product.komposisi.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D4F] shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Ringkasan Cerita Bahan & Kartu Petani Versi Kecil */}
            <div className="p-5 rounded-2xl bg-[#FBFBFD] border border-[#E8E8ED] space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#2E7D4F] flex items-center gap-1.5">
                  <span className="text-sm">{ingredient.emoji}</span>
                  <span>Bahan Asal: {ingredient.nama}</span>
                </span>
                <Link
                  to={`/cerita-bahan/${ingredient.id}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#2E7D4F] hover:underline"
                >
                  <span>Baca cerita lengkap</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <p className="text-xs text-[#6E6E73] leading-relaxed">
                {ingredient.ceritaSingkat}
              </p>

              {ingredient.profilPetani && (
                <div className="pt-3 border-t border-[#E8E8ED] flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-[#E8E8ED] shrink-0 border border-white shadow-xs">
                    <img
                      src={ingredient.profilPetani.fotoUrl}
                      alt={ingredient.profilPetani.nama}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h5 className="text-xs font-bold text-[#1D1D1F] truncate">
                        {ingredient.profilPetani.nama}
                      </h5>
                      <span className="text-[10px] text-[#2E7D4F] font-medium bg-[#EBF4EE] px-1.5 py-0.5 rounded-md">
                        {ingredient.profilPetani.lamaBertani}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#6E6E73] truncate">
                      {ingredient.profilPetani.daerah}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Action buttons & WhatsApp Inquiry Link */}
            <div className="pt-2 space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  onClick={handleAddToCart}
                  variant="primary"
                  size="lg"
                  icon={<ShoppingBag className="w-4 h-4" />}
                >
                  {added ? 'Ditambahkan ke Keranjang!' : 'Tambah ke Keranjang'}
                </Button>
                <Button to={`/cerita-bahan/${product.ingredientId}`} variant="secondary" size="lg">
                  Lihat Cerita {product.bahanUtama}
                </Button>
              </div>

              {/* Link teks kecil ke WhatsApp */}
              <div className="flex items-center gap-2 pt-1">
                <a
                  href={`https://wa.me/6281234567890?text=${encodeURIComponent(
                    `Halo Ugly2Yummy, saya mau tanya tentang produk ${product.nama}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-[#2E7D4F] hover:text-[#256640] hover:underline"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                  <span>Tanya soal produk ini</span>
                </a>
              </div>
            </div>

            <div className="text-xs text-[#6E6E73] flex items-center gap-2 pt-1">
              <span className="w-2 h-2 rounded-full bg-[#2E7D4F]" />
              <span>Stok tersedia langsung dari dapur upcycling kami.</span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            9. SEBELUM & SESUDAH: TRANSFORMASI BAHAN IMPERFECT MENJADI PRODUK JADI
            ========================================================================= */}
        <div className="mt-16 sm:mt-20 pt-12 border-t border-[#E8E8ED]">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#2E7D4F] block mb-2">
              Transformasi Rasa
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1D1D1F]">
              Sebelum &amp; Sesudah
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#6E6E73]">
              Bagaimana bahan yang kerap disia-siakan disulap menjadi santapan istimewa di mejamu.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* Foto Kiri: SEBELUM */}
            <div className="group bg-white rounded-3xl border border-[#E8E8ED] overflow-hidden p-4 sm:p-5 flex flex-col justify-between hover:border-[#2E7D4F]/30 transition-all duration-300">
              <div className="relative rounded-2xl overflow-hidden bg-[#F5F5F7] mb-4">
                <SmartImage
                  src={ingredient.gambar}
                  alt={ingredient.altText || `Bahan mentah ${ingredient.nama}`}
                  fallbackEmoji={ingredient.emoji}
                  aspectRatio="4:3"
                  hoverZoom={true}
                  containerClassName="w-full"
                />
                <div className="absolute top-3 left-3 z-10">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/95 backdrop-blur-md text-[#8E8E93] border border-[#E8E8ED] shadow-xs">
                    Sebelum
                  </span>
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-bold text-[#1D1D1F]">
                  {ingredient.nama}
                </h3>
                <p className="text-xs sm:text-sm text-[#6E6E73] leading-relaxed">
                  Bahan mentah berkualitas rasa prima yang ditolak pasar tradisional karena alasan fisik semata.
                </p>
              </div>
            </div>

            {/* Foto Kanan: SESUDAH */}
            <div className="group bg-white rounded-3xl border border-[#2E7D4F]/25 bg-gradient-to-b from-[#2E7D4F]/[0.02] to-transparent overflow-hidden p-4 sm:p-5 flex flex-col justify-between hover:border-[#2E7D4F]/40 transition-all duration-300">
              <div className="relative rounded-2xl overflow-hidden bg-[#F5F5F7] mb-4">
                <SmartImage
                  src={product.gambar}
                  alt={`Produk jadi ${product.nama}`}
                  fallbackEmoji={product.gambarEmojiFallback}
                  aspectRatio="4:3"
                  hoverZoom={true}
                  containerClassName="w-full"
                />
                <div className="absolute top-3 left-3 z-10">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#2E7D4F] text-white shadow-xs">
                    Sesudah
                  </span>
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-bold text-[#1D1D1F]">
                  {product.nama}
                </h3>
                <p className="text-xs sm:text-sm text-[#6E6E73] leading-relaxed">
                  Diolah higienis menjadi {product.kategori.toLowerCase()} artisan yang bernutrisi dan siap santap.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            SECTION ULASAN DENGAN RATING SUMMARY, 3 ULASAN DUMMY, & FORM BINTANG
            ========================================================================= */}
        <div className="mt-16 sm:mt-24 pt-12 border-t border-[#E8E8ED]">
          <CommentSection
            title="Ulasan Pembeli"
            subtitle={`Pendapat jujur dari mereka yang sudah mencicipi nikmatnya ${product.nama}.`}
            initialComments={dummyReviews}
            allowRating={true}
            ratingSummary={{
              rating: product.rating,
              totalCount: product.jumlahUlasan,
            }}
            placeholderText="Ceritakan rasa, tekstur, atau pengalaman Anda mencicipi produk ini..."
          />
        </div>
      </Container>

      {/* Toast Notifikasi Tambah ke Keranjang (~4 Detik dengan Tombol X) */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed bottom-5 right-4 left-4 sm:left-auto sm:right-6 sm:w-[420px] z-50 bg-white/95 backdrop-blur-md rounded-3xl border border-[#E8E8ED] shadow-[0_12px_36px_rgba(0,0,0,0.12)] p-4 space-y-3"
          >
            {/* Header: Thumbnail + Teks + Tombol Tutup X */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl overflow-hidden bg-[#F5F5F7] shrink-0 border border-[#E8E8ED]">
                <SmartImage
                  src={product.gambar}
                  alt={product.nama}
                  fallbackEmoji={product.gambarEmojiFallback}
                  aspectRatio="1:1"
                  containerClassName="w-full h-full"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#2E7D4F]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Ditambahkan ke keranjang</span>
                </div>
                <p className="text-xs font-bold text-[#1D1D1F] truncate mt-0.5">
                  {product.nama}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowToast(false)}
                className="p-1.5 rounded-full text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-[#F5F5F7] transition-colors cursor-pointer"
                aria-label="Tutup notifikasi"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Action Buttons: Lihat Keranjang & Checkout */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <Button
                to="/keranjang"
                variant="secondary"
                size="sm"
                className="w-full justify-center text-xs"
              >
                Lihat Keranjang
              </Button>
              <Button
                to="/checkout"
                variant="primary"
                size="sm"
                className="w-full justify-center text-xs"
              >
                Checkout
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
