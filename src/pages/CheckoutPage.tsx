import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';
import {
  MapPin,
  Truck,
  CreditCard,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Clock,
  Zap,
  Wallet,
  Building2,
  Banknote,
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const { cartItems, clearCart } = useAuth();
  const navigate = useNavigate();

  // State
  const [shippingMethod, setShippingMethod] = useState<'reguler' | 'instan'>('reguler');
  const [paymentMethod, setPaymentMethod] = useState<'transfer' | 'ewallet' | 'cod'>('transfer');
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [address, setAddress] = useState({
    recipient: 'Nadia Putri',
    phone: '+62 812-3456-7890',
    street: 'Jl. Gandaria Tengah II No. 14, RT 05 / RW 03',
    district: 'Kebayoran Baru, Jakarta Selatan',
    postalCode: '12130',
  });

  // Calculate pricing
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.harga * item.jumlah,
    0
  );
  const totalKgSaved = cartItems.reduce(
    (acc, item) => acc + item.estimasiKgTerselamatkan * item.jumlah,
    0
  );
  const shippingCost = shippingMethod === 'instan' ? 25000 : 12000;
  const grandTotal = subtotal + shippingCost;

  const handlePayNow = () => {
    // Clear cart or prepare order completion state
    clearCart();
    navigate('/pesanan-berhasil');
  };

  return (
    <div className="py-10 sm:py-16 md:py-20">
      <Container>
        {/* Navigation Breadcrumb Back */}
        <div className="mb-6">
          <Link
            to="/keranjang"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6E6E73] hover:text-[#2E7D4F] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Keranjang</span>
          </Link>
        </div>

        {/* =========================================================================
            1. INDIKATOR LANGKAH KECIL: Alamat → Pengiriman → Pembayaran
            ========================================================================= */}
        <div className="max-w-xl mx-auto mb-10 sm:mb-14">
          <div className="flex items-center justify-between relative">
            {/* Connecting Line */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#E8E8ED] -translate-y-1/2 z-0" />

            {/* Step 1 */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-[#2E7D4F] text-white flex items-center justify-center text-xs font-bold shadow-xs">
                1
              </div>
              <span className="text-[11px] font-bold text-[#1D1D1F] mt-1.5 bg-[#FBFBFD] px-1">
                Alamat
              </span>
            </div>

            {/* Step 2 */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-[#2E7D4F] text-white flex items-center justify-center text-xs font-bold shadow-xs">
                2
              </div>
              <span className="text-[11px] font-bold text-[#1D1D1F] mt-1.5 bg-[#FBFBFD] px-1">
                Pengiriman
              </span>
            </div>

            {/* Step 3 */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-[#2E7D4F] text-white flex items-center justify-center text-xs font-bold shadow-xs">
                3
              </div>
              <span className="text-[11px] font-bold text-[#1D1D1F] mt-1.5 bg-[#FBFBFD] px-1">
                Pembayaran
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* =========================================================================
              KOLOM KIRI: FORM CHECKOUT SECTIONS
              ========================================================================= */}
          <div className="lg:col-span-7 space-y-8">
            {/* 1. KARTU ALAMAT DUMMY YANG SUDAH TERISI */}
            <div className="bg-white rounded-3xl border border-[#E8E8ED] p-6 sm:p-7 shadow-none">
              <div className="flex items-center justify-between pb-4 border-b border-[#E8E8ED]/70 mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#2E7D4F]" />
                  <h2 className="text-base sm:text-lg font-bold text-[#1D1D1F]">
                    Alamat Pengiriman
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditingAddress(!isEditingAddress)}
                  className="text-xs font-semibold text-[#2E7D4F] hover:text-[#256640] hover:underline cursor-pointer"
                >
                  {isEditingAddress ? 'Simpan' : 'Ubah'}
                </button>
              </div>

              {!isEditingAddress ? (
                <div className="space-y-1.5 text-xs sm:text-sm text-[#1D1D1F]">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#1D1D1F]">{address.recipient}</span>
                    <span className="text-[#6E6E73]">({address.phone})</span>
                    <span className="bg-[#EBF4EE] text-[#2E7D4F] text-[10px] font-semibold px-2 py-0.5 rounded-full">
                      Utama
                    </span>
                  </div>
                  <p className="text-[#6E6E73] leading-relaxed">
                    {address.street}
                  </p>
                  <p className="text-[#6E6E73]">
                    {address.district}, {address.postalCode}
                  </p>
                </div>
              ) : (
                <div className="space-y-3 pt-2">
                  <input
                    type="text"
                    value={address.recipient}
                    onChange={(e) => setAddress({ ...address, recipient: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E8ED] bg-[#F5F5F7] text-xs text-[#1D1D1F]"
                    placeholder="Nama Penerima"
                  />
                  <input
                    type="text"
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E8ED] bg-[#F5F5F7] text-xs text-[#1D1D1F]"
                    placeholder="No. Telepon"
                  />
                  <input
                    type="text"
                    value={address.street}
                    onChange={(e) => setAddress({ ...address, street: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E8ED] bg-[#F5F5F7] text-xs text-[#1D1D1F]"
                    placeholder="Alamat Lengkap"
                  />
                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      onClick={() => setIsEditingAddress(false)}
                      className="px-4 py-1.5 bg-[#2E7D4F] text-white rounded-full text-xs font-semibold cursor-pointer"
                    >
                      Selesai
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 2. PILIHAN PENGIRIMAN (KARTU RADIO) */}
            <div className="bg-white rounded-3xl border border-[#E8E8ED] p-6 sm:p-7 shadow-none">
              <div className="flex items-center gap-2 pb-4 border-b border-[#E8E8ED]/70 mb-4">
                <Truck className="w-5 h-5 text-[#2E7D4F]" />
                <h2 className="text-base sm:text-lg font-bold text-[#1D1D1F]">
                  Pilihan Pengiriman
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Option 1: Reguler */}
                <label
                  onClick={() => setShippingMethod('reguler')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    shippingMethod === 'reguler'
                      ? 'border-[#2E7D4F] bg-[#EBF4EE]/30'
                      : 'border-[#E8E8ED] bg-white hover:border-[#2E7D4F]/40'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-[#2E7D4F]" />
                        <span className="text-sm font-bold text-[#1D1D1F]">Reguler</span>
                      </div>
                      <p className="text-xs text-[#6E6E73] mt-1">Estimasi 2–3 hari kerja</p>
                      <p className="text-[11px] text-[#2E7D4F] mt-1">Ekspedisi Ramah Lingkungan</p>
                    </div>
                    <span className="text-sm font-extrabold text-[#1D1D1F] tabular-nums">
                      Rp12.000
                    </span>
                  </div>
                </label>

                {/* Option 2: Instan */}
                <label
                  onClick={() => setShippingMethod('instan')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    shippingMethod === 'instan'
                      ? 'border-[#2E7D4F] bg-[#EBF4EE]/30'
                      : 'border-[#E8E8ED] bg-white hover:border-[#2E7D4F]/40'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <Zap className="w-4 h-4 text-[#C86218]" />
                        <span className="text-sm font-bold text-[#1D1D1F]">Instan</span>
                      </div>
                      <p className="text-xs text-[#6E6E73] mt-1">Tiba hari ini (3–4 jam)</p>
                      <p className="text-[11px] text-[#C86218] mt-1">Kurir Khusus Jabodetabek</p>
                    </div>
                    <span className="text-sm font-extrabold text-[#1D1D1F] tabular-nums">
                      Rp25.000
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* 3. METODE PEMBAYARAN (KARTU RADIO) */}
            <div className="bg-white rounded-3xl border border-[#E8E8ED] p-6 sm:p-7 shadow-none">
              <div className="flex items-center gap-2 pb-4 border-b border-[#E8E8ED]/70 mb-4">
                <CreditCard className="w-5 h-5 text-[#2E7D4F]" />
                <h2 className="text-base sm:text-lg font-bold text-[#1D1D1F]">
                  Metode Pembayaran (Simulasi)
                </h2>
              </div>

              <div className="space-y-3">
                {/* Method 1: Transfer Bank */}
                <label
                  onClick={() => setPaymentMethod('transfer')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    paymentMethod === 'transfer'
                      ? 'border-[#2E7D4F] bg-[#EBF4EE]/30'
                      : 'border-[#E8E8ED] bg-white hover:border-[#2E7D4F]/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#F5F5F7] border border-[#E8E8ED] flex items-center justify-center text-[#1D1D1F]">
                      <Building2 className="w-5 h-5 text-[#2E7D4F]" />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-[#1D1D1F] block">
                        Transfer Bank (Virtual Account)
                      </span>
                      <span className="text-xs text-[#6E6E73]">
                        BCA, Mandiri, BNI, BRI (Otomatis Terverifikasi)
                      </span>
                    </div>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === 'transfer' ? 'border-[#2E7D4F]' : 'border-[#E8E8ED]'
                    }`}
                  >
                    {paymentMethod === 'transfer' && (
                      <div className="w-2.5 h-2.5 rounded-full bg-[#2E7D4F]" />
                    )}
                  </div>
                </label>

                {/* Method 2: E-Wallet */}
                <label
                  onClick={() => setPaymentMethod('ewallet')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    paymentMethod === 'ewallet'
                      ? 'border-[#2E7D4F] bg-[#EBF4EE]/30'
                      : 'border-[#E8E8ED] bg-white hover:border-[#2E7D4F]/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#F5F5F7] border border-[#E8E8ED] flex items-center justify-center text-[#1D1D1F]">
                      <Wallet className="w-5 h-5 text-[#2E7D4F]" />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-[#1D1D1F] block">
                        E-Wallet / QRIS
                      </span>
                      <span className="text-xs text-[#6E6E73]">
                        GoPay, OVO, ShopeePay, DANA
                      </span>
                    </div>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === 'ewallet' ? 'border-[#2E7D4F]' : 'border-[#E8E8ED]'
                    }`}
                  >
                    {paymentMethod === 'ewallet' && (
                      <div className="w-2.5 h-2.5 rounded-full bg-[#2E7D4F]" />
                    )}
                  </div>
                </label>

                {/* Method 3: COD */}
                <label
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    paymentMethod === 'cod'
                      ? 'border-[#2E7D4F] bg-[#EBF4EE]/30'
                      : 'border-[#E8E8ED] bg-white hover:border-[#2E7D4F]/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#F5F5F7] border border-[#E8E8ED] flex items-center justify-center text-[#1D1D1F]">
                      <Banknote className="w-5 h-5 text-[#2E7D4F]" />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-[#1D1D1F] block">
                        COD (Bayar di Tempat)
                      </span>
                      <span className="text-xs text-[#6E6E73]">
                        Bayar tunai kepada kurir saat pesanan tiba
                      </span>
                    </div>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === 'cod' ? 'border-[#2E7D4F]' : 'border-[#E8E8ED]'
                    }`}
                  >
                    {paymentMethod === 'cod' && (
                      <div className="w-2.5 h-2.5 rounded-full bg-[#2E7D4F]" />
                    )}
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* =========================================================================
              KOLOM KANAN: RINGKASAN PESANAN & TOMBOL BAYAR SEKARANG
              ========================================================================= */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <div className="bg-white rounded-3xl border border-[#E8E8ED] p-6 sm:p-8 shadow-none space-y-6">
              <h3 className="text-lg font-bold text-[#1D1D1F]">Ringkasan Pesanan</h3>

              {/* Items Mini List */}
              <div className="space-y-3 pb-5 border-b border-[#E8E8ED]/70">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[#1D1D1F]">{item.jumlah}x</span>
                      <span className="text-[#6E6E73] truncate max-w-[180px]">{item.nama}</span>
                    </div>
                    <span className="font-medium text-[#1D1D1F] tabular-nums">
                      Rp{(item.harga * item.jumlah).toLocaleString('id-ID')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Calculations */}
              <div className="space-y-2.5 text-xs sm:text-sm text-[#6E6E73] pb-5 border-b border-[#E8E8ED]/70">
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span className="text-[#1D1D1F] font-semibold tabular-nums">
                    Rp{subtotal.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Biaya Pengiriman ({shippingMethod === 'instan' ? 'Instan' : 'Reguler'})</span>
                  <span className="text-[#1D1D1F] font-semibold tabular-nums">
                    Rp{shippingCost.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              {/* Total Final */}
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-sm font-semibold text-[#1D1D1F] block">
                    Total Pembayaran
                  </span>
                  <span className="text-xs text-[#6E6E73]">Simulasi checkout</span>
                </div>
                <span className="text-2xl font-extrabold text-[#1D1D1F] tabular-nums">
                  Rp{grandTotal.toLocaleString('id-ID')}
                </span>
              </div>

              {/* Impact Note */}
              <div className="p-3.5 rounded-2xl bg-[#EBF4EE] border border-[#2E7D4F]/20 flex items-center gap-2.5 text-xs text-[#2E7D4F] font-semibold">
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>
                  {totalKgSaved > 0 ? totalKgSaved.toFixed(1) : '1,3'} kg pangan lokal diselamatkan!
                </span>
              </div>

              {/* Tombol Bayar Sekarang (Simulasi) */}
              <Button
                onClick={handlePayNow}
                variant="primary"
                size="lg"
                fullWidth
                icon={<ArrowRight className="w-4 h-4" />}
                iconPosition="right"
              >
                Bayar Sekarang (Simulasi)
              </Button>

              <p className="text-center text-[11px] text-[#6E6E73]">
                Ini adalah prototype — tidak ada pemotongan saldo atau kartu kredit sungguhan.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};
