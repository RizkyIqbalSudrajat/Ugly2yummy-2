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
  Minus,
  Plus,
  Zap,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AnimatePresence, motion } from 'framer-motion';
import { CommentSection, CommentItem } from '../components/ui/CommentSection';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart, setBuyNow } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [quantity, setQuantity] = useState(1);
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
    addToCart(product, quantity);
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

  const handleBuyNow = () => {
    setBuyNow(product, quantity);
    navigate('/checkout?mode=langsung');
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
    <div className="py-12 sm:py-16 pb-32 sm:pb-16">
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
                  state={{ from: 'produk', productId: product.id, productName: product.nama }}
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

            {/* Pemilih Jumlah & Action buttons */}
            <div className="pt-2 space-y-4">
              {/* Pemilih Jumlah (− 1 +), minimal 1 dan maksimal 10 */}
              <div className="flex items-center gap-3.5">
                <span className="text-xs font-semibold text-[#1D1D1F]">Jumlah:</span>
                <div className="inline-flex items-center rounded-full border border-[#E8E8ED] bg-[#F5F5F7] p-1 shadow-xs">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#1D1D1F] hover:bg-[#E8E8ED] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer shadow-xs"
                    aria-label="Kurangi jumlah"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center font-bold text-sm tabular-nums text-[#1D1D1F]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                    disabled={quantity >= 10}
                    className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#1D1D1F] hover:bg-[#E8E8ED] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer shadow-xs"
                    aria-label="Tambah jumlah"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="text-xs text-[#6E6E73]">
                  Subtotal:{' '}
                  <strong className="text-[#1D1D1F] tabular-nums font-bold">
                    {new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                      maximumFractionDigits: 0,
                    }).format(product.harga * quantity)}
                  </strong>
                </span>
              </div>

              {/* Dua tombol: Beli Sekarang (utama hijau) & Tambah ke Keranjang (outline) */}
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  onClick={handleBuyNow}
                  variant="primary"
                  size="lg"
                  className="bg-[#2E7D4F] hover:bg-[#256640] text-white font-semibold shadow-md"
                  icon={<Zap className="w-4 h-4 fill-current" />}
                >
                  Beli Sekarang
                </Button>
                <Button
                  onClick={handleAddToCart}
                  variant="secondary"
                  size="lg"
                  className="border-2 border-[#2E7D4F] text-[#2E7D4F] bg-transparent hover:bg-[#EBF4EE] font-semibold"
                  icon={<ShoppingBag className="w-4 h-4" />}
                >
                  {added ? 'Ditambahkan ke Keranjang!' : 'Tambah ke Keranjang'}
                </Button>
              </div>

              {/* Tombol "Lihat Cerita ..." diubah jadi link teks di bawahnya */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 pt-1 text-xs">
                <Link
                  to={`/cerita-bahan/${product.ingredientId}`}
                  state={{ from: 'produk', productId: product.id, productName: product.nama }}
                  className="inline-flex items-center gap-1.5 font-semibold text-[#2E7D4F] hover:underline"
                >
                  <span>Lihat Cerita {product.bahanUtama}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <span className="hidden sm:inline text-[#D2D2D7]">·</span>

                <a
                  href={`https://wa.me/6281234567890?text=${encodeURIComponent(
                    `Halo Ugly2Yummy, saya mau tanya tentang produk ${product.nama}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-[#6E6E73] hover:text-[#2E7D4F] transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                  <span>Tanya soal produk ini via WhatsApp</span>
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

      {/* HP: Bar yang menempel di bawah layar berisi total harga dan kedua tombol */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E8E8ED] px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-between gap-3 mb-2.5">
          <div>
            <span className="text-[10px] text-[#6E6E73] uppercase tracking-wider font-semibold block">
              Total ({quantity} item)
            </span>
            <span className="text-base font-extrabold text-[#1D1D1F] tabular-nums">
              {new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                maximumFractionDigits: 0,
              }).format(product.harga * quantity)}
            </span>
          </div>

          {/* Stepper jumlah mini untuk mobile */}
          <div className="inline-flex items-center rounded-full border border-[#E8E8ED] bg-[#F5F5F7] p-0.5">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-[#1D1D1F] disabled:opacity-30 disabled:cursor-not-allowed shadow-xs cursor-pointer"
              aria-label="Kurangi jumlah"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="w-7 text-center font-bold text-xs tabular-nums text-[#1D1D1F]">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.min(10, q + 1))}
              disabled={quantity >= 10}
              className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-[#1D1D1F] disabled:opacity-30 disabled:cursor-not-allowed shadow-xs cursor-pointer"
              aria-label="Tambah jumlah"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleAddToCart}
            className="w-full py-2.5 px-3 rounded-full border-2 border-[#2E7D4F] text-[#2E7D4F] bg-white font-semibold text-xs active:bg-[#EBF4EE] flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>+ Keranjang</span>
          </button>
          <button
            type="button"
            onClick={handleBuyNow}
            className="w-full py-2.5 px-3 rounded-full bg-[#2E7D4F] text-white font-semibold text-xs active:bg-[#256640] shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Beli Sekarang</span>
          </button>
        </div>
      </div>

      {/* Toast Notifikasi Tambah ke Keranjang (~4 Detik dengan Tombol X) */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed bottom-24 sm:bottom-5 right-4 left-4 sm:left-auto sm:right-6 sm:w-[420px] z-50 bg-white/95 backdrop-blur-md rounded-3xl border border-[#E8E8ED] shadow-[0_12px_36px_rgba(0,0,0,0.12)] p-4 space-y-3"
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
