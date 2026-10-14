import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';
import { SmartImage } from '../components/ui/SmartImage';
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  Sparkles,
  ArrowLeft,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

export const CartPage: React.FC = () => {
  const { cartItems, updateQuantity, removeItem, resetDemoCart } = useAuth();
  const navigate = useNavigate();

  // Calculations
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.harga * item.jumlah,
    0
  );
  const totalKgSaved = cartItems.reduce(
    (acc, item) => acc + item.estimasiKgTerselamatkan * item.jumlah,
    0
  );
  const shippingFee = cartItems.length > 0 ? 12000 : 0;
  const grandTotal = subtotal + shippingFee;

  const formattedSubtotal = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(subtotal);

  const formattedShipping = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(shippingFee);

  const formattedGrandTotal = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(grandTotal);

  const formattedKg = totalKgSaved.toLocaleString('id-ID', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

  return (
    <div
      className={`pt-10 sm:pt-16 md:pt-20 ${
        cartItems.length > 0 ? 'pb-28 sm:pb-32 lg:pb-20' : 'pb-10 sm:pb-16 md:pb-20'
      }`}
    >
      <Container>
        {/* Back Link */}
        <div className="mb-6">
          <Link
            to="/produk"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6E6E73] hover:text-[#2E7D4F] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Lanjut Belanja Produk</span>
          </Link>
        </div>

        {/* Page Title */}
        <div className="max-w-2xl mb-10">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#2E7D4F] block mb-1">
            Dapur Kebaikan Anda
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1D1D1F]">
            Keranjang Belanja
          </h1>
          <p className="mt-2 text-sm sm:text-base text-[#6E6E73]">
            Periksa pilihan sajian upcycled Anda sebelum melanjutkan ke pengiriman.
          </p>
        </div>

        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* =========================================================================
                KOLOM KIRI: DAFTAR ITEM KERANJANG
                ========================================================================= */}
            <div className="lg:col-span-7 space-y-4">
              {cartItems.map((item) => {
                const itemTotal = item.harga * item.jumlah;
                const formattedItemPrice = new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                  maximumFractionDigits: 0,
                }).format(item.harga);

                const formattedItemTotal = new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                  maximumFractionDigits: 0,
                }).format(itemTotal);

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-3xl border border-[#E8E8ED] p-5 sm:p-6 flex flex-col sm:flex-row items-center gap-5 shadow-none"
                  >
                    {/* Thumbnail Foto */}
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-[#F5F5F7] shrink-0 border border-[#E8E8ED]/50">
                      <SmartImage
                        src={item.gambar}
                        alt={item.nama}
                        fallbackEmoji={item.gambarEmojiFallback}
                        aspectRatio="1:1"
                        containerClassName="w-full h-full"
                      />
                    </div>

                    {/* Informasi Produk */}
                    <div className="flex-1 min-w-0 w-full flex flex-col justify-between h-full space-y-3">
                      <div>
                        {/* Asal Bahan */}
                        <div className="flex items-center justify-between text-xs text-[#6E6E73] mb-1">
                          <span className="font-medium text-[11px] text-[#2E7D4F] bg-[#EBF4EE] px-2 py-0.5 rounded-full">
                            {item.asalBahan}
                          </span>
                          <span>{item.ukuran}</span>
                        </div>

                        {/* Nama Produk */}
                        <h3 className="text-base sm:text-lg font-bold text-[#1D1D1F] truncate">
                          {item.nama}
                        </h3>

                        {/* Harga Satuan */}
                        <p className="text-xs text-[#6E6E73] mt-0.5 tabular-nums">
                          {formattedItemPrice} / pcs
                        </p>
                      </div>

                      {/* Stepper Jumlah, Total per Item, dan Tombol Hapus */}
                      <div className="pt-2 border-t border-[#E8E8ED]/60 flex items-center justify-between gap-4">
                        {/* Stepper Jumlah */}
                        <div className="flex items-center gap-2 bg-[#FBFBFD] border border-[#E8E8ED] rounded-full p-1">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-7 h-7 rounded-full bg-white hover:bg-[#F5F5F7] text-[#1D1D1F] flex items-center justify-center transition-colors shadow-none cursor-pointer"
                            aria-label="Kurangi jumlah"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>

                          <span className="w-8 text-center text-xs font-bold text-[#1D1D1F] tabular-nums">
                            {item.jumlah}
                          </span>

                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-7 h-7 rounded-full bg-white hover:bg-[#F5F5F7] text-[#1D1D1F] flex items-center justify-center transition-colors shadow-none cursor-pointer"
                            aria-label="Tambah jumlah"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Total per Item & Hapus */}
                        <div className="flex items-center gap-3">
                          <span className="text-sm sm:text-base font-extrabold text-[#1D1D1F] tabular-nums">
                            {formattedItemTotal}
                          </span>

                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="p-2 rounded-full text-[#6E6E73] hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                            title="Hapus dari keranjang"
                            aria-label="Hapus item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* =========================================================================
                KOLOM KANAN: KARTU RINGKASAN (DI HP PINDAH KE BAWAH)
                ========================================================================= */}
            <div className="lg:col-span-5 lg:sticky lg:top-24">
              <div className="bg-white rounded-3xl border border-[#E8E8ED] p-6 sm:p-8 shadow-none space-y-6">
                <h2 className="text-lg font-bold text-[#1D1D1F] tracking-tight">
                  Ringkasan Belanja
                </h2>

                {/* Rincian Angka */}
                <div className="space-y-3 text-sm text-[#6E6E73] pb-6 border-b border-[#E8E8ED]/70">
                  <div className="flex items-center justify-between">
                    <span>Subtotal Produk</span>
                    <span className="text-[#1D1D1F] font-semibold tabular-nums">
                      {formattedSubtotal}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Biaya Pengiriman (Reguler)</span>
                    <span className="text-[#1D1D1F] font-semibold tabular-nums">
                      {formattedShipping}
                    </span>
                  </div>
                </div>

                {/* Total */}
                <div className="flex items-baseline justify-between pt-1">
                  <div>
                    <span className="text-sm font-semibold text-[#1D1D1F] block">
                      Total Tagihan
                    </span>
                    <span className="text-xs text-[#6E6E73]">Termasuk PPN</span>
                  </div>
                  <span className="text-2xl font-extrabold text-[#1D1D1F] tabular-nums">
                    {formattedGrandTotal}
                  </span>
                </div>

                {/* Kalimat Dampak Pangan */}
                <div className="p-4 rounded-2xl bg-[#EBF4EE] border border-[#2E7D4F]/20 flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-[#2E7D4F] shrink-0 mt-0.5" />
                  <div className="text-xs text-[#1D1D1F] leading-relaxed">
                    <strong className="text-[#2E7D4F] font-bold block">
                      Pesanan ini menyelamatkan {formattedKg} kg pangan
                    </strong>
                    Buah dan sayur berkualitas yang diolah secara higienis langsung dari kebun mitra.
                  </div>
                </div>

                {/* Tombol Lanjut ke Checkout */}
                <Button
                  to="/checkout"
                  variant="primary"
                  size="lg"
                  fullWidth
                  icon={<ArrowRight className="w-4 h-4" />}
                  iconPosition="right"
                >
                  Lanjut ke Checkout
                </Button>

                {/* Jaminan Kenyamanan */}
                <div className="pt-2 text-center text-xs text-[#6E6E73] flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#2E7D4F]" />
                  <span>Kemasan Kaca Higienis & Garansi Rasa Murni</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* =========================================================================
              TAMPILAN KERANJANG KOSONG YANG RAPI
              ========================================================================= */
          <div className="bg-white rounded-3xl border border-[#E8E8ED] p-10 sm:p-16 text-center max-w-lg mx-auto shadow-none">
            <div className="w-16 h-16 rounded-full bg-[#F5F5F7] text-[#6E6E73] flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-[#1D1D1F]">
              Keranjang belanjamu kosong
            </h2>

            <p className="mt-2 text-sm text-[#6E6E73] leading-relaxed max-w-sm mx-auto">
              Belum ada produk olahan upcycled pilihan di dalam keranjangmu saat ini.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                to="/produk"
                variant="primary"
                size="md"
                icon={<ArrowRight className="w-4 h-4" />}
                iconPosition="right"
              >
                Mulai Belanja
              </Button>
              <Button
                onClick={resetDemoCart}
                variant="secondary"
                size="md"
                icon={<RefreshCw className="w-3.5 h-3.5" />}
              >
                Muat Ulang Isi Demo (3 item)
              </Button>
            </div>
          </div>
        )}
      </Container>

      {/* Bar Sticky Checkout di Layar HP (di bawah breakpoint lg) */}
      {cartItems.length > 0 && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/85 backdrop-blur-md border-t border-[#E8E8ED] px-4 py-3 sm:px-6 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          <div className="max-w-lg mx-auto flex items-center justify-between gap-4">
            <div>
              <span className="text-[11px] text-[#6E6E73] block leading-tight">Total Tagihan</span>
              <span className="text-lg sm:text-xl font-extrabold text-[#1D1D1F] tabular-nums">
                {formattedGrandTotal}
              </span>
            </div>
            <Button
              to="/checkout"
              variant="primary"
              size="md"
              className="px-6 py-2.5 font-semibold"
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
            >
              Checkout
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
