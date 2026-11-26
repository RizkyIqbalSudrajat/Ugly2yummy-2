import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link, useSearchParams, useLocation } from 'react-router-dom';
import { useAuth, GuestInfo } from '../context/AuthContext';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';
import { SmartImage } from '../components/ui/SmartImage';
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
  Minus,
  Plus,
  User,
  Phone,
  Mail,
  AlertCircle,
  LogIn,
  UserCheck,
  Info,
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const {
    cartItems,
    clearCart,
    buyNowItem,
    updateBuyNowQuantity,
    clearBuyNow,
    isLoggedIn,
    isGuest,
    startGuestMode,
    guestInfo,
    setGuestInfo,
  } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Mode Beli Langsung vs Keranjang
  const isDirectBuy = searchParams.get('mode') === 'langsung';

  // Shipping & Payment Method
  const [shippingMethod, setShippingMethod] = useState<'reguler' | 'instan'>('reguler');
  const [paymentMethod, setPaymentMethod] = useState<'transfer' | 'ewallet' | 'cod'>('transfer');

  // Logged-in demo address state
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [address, setAddress] = useState({
    recipient: 'Nadia Putri',
    phone: '+62 812-3456-7890',
    street: 'Jl. Gandaria Tengah II No. 14, RT 05 / RW 03',
    district: 'Kebayoran Baru, Jakarta Selatan',
    postalCode: '12130',
  });

  // Form Data Pembeli & Pengiriman (Mode Tamu)
  const [guestForm, setGuestForm] = useState<GuestInfo>({
    namaLengkap: guestInfo?.namaLengkap || '',
    nomorWhatsapp: guestInfo?.nomorWhatsapp || '',
    email: guestInfo?.email || '',
    provinsi: guestInfo?.provinsi || '',
    kotaKabupaten: guestInfo?.kotaKabupaten || '',
    kecamatan: guestInfo?.kecamatan || '',
    kelurahanDesa: guestInfo?.kelurahanDesa || '',
    kodePos: guestInfo?.kodePos || '',
    alamatLengkap: guestInfo?.alamatLengkap || '',
    patokan: guestInfo?.patokan || '',
    catatanKurir: guestInfo?.catatanKurir || '',
  });

  const [isDataConfirmed, setIsDataConfirmed] = useState(false);
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Sync guestForm into AuthContext when valid fields change
  useEffect(() => {
    if (guestForm.namaLengkap || guestForm.nomorWhatsapp || guestForm.alamatLengkap) {
      setGuestInfo(guestForm);
    }
  }, [guestForm, setGuestInfo]);

  // Validation helper
  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'namaLengkap':
        if (!value.trim()) return 'Nama lengkap wajib diisi.';
        if (value.trim().length < 3) return 'Nama minimal 3 karakter.';
        return '';
      case 'nomorWhatsapp': {
        const clean = value.replace(/[\s-]/g, '');
        if (!clean) return 'Nomor WhatsApp wajib diisi.';
        if (!/^(08|62|\+62)/.test(clean)) {
          return 'Nomor harus diawali 08 atau 62.';
        }
        const numeric = clean.replace(/^\+/, '');
        if (numeric.length < 10 || numeric.length > 13) {
          return 'Nomor WhatsApp harus 10–13 digit.';
        }
        return '';
      }
      case 'email':
        if (!value.trim()) return 'Email wajib diisi.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
          return 'Format email tidak valid.';
        }
        return '';
      case 'provinsi':
        if (!value.trim()) return 'Provinsi wajib diisi.';
        return '';
      case 'kotaKabupaten':
        if (!value.trim()) return 'Kota/Kabupaten wajib diisi.';
        return '';
      case 'kecamatan':
        if (!value.trim()) return 'Kecamatan wajib diisi.';
        return '';
      case 'kelurahanDesa':
        if (!value.trim()) return 'Kelurahan/Desa wajib diisi.';
        return '';
      case 'kodePos':
        if (!value.trim()) return 'Kode pos wajib diisi.';
        if (!/^[0-9]{5}$/.test(value.trim())) return 'Kode pos harus 5 angka.';
        return '';
      case 'alamatLengkap':
        if (!value.trim()) return 'Alamat lengkap wajib diisi.';
        if (value.trim().length < 10) return 'Tuliskan nama jalan, no. rumah, RT/RW dengan jelas.';
        return '';
      default:
        return '';
    }
  };

  const handleBlur = (field: keyof GuestInfo) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const errorMsg = validateField(field, guestForm[field] || '');
    setErrors((prev) => ({ ...prev, [field]: errorMsg }));
  };

  const handleInputChange = (field: keyof GuestInfo, val: string) => {
    setGuestForm((prev) => ({ ...prev, [field]: val }));
    if (touched[field]) {
      const errorMsg = validateField(field, val);
      setErrors((prev) => ({ ...prev, [field]: errorMsg }));
    }
  };

  // Check if all required guest fields are valid
  const isGuestFormValid = () => {
    const requiredFields: (keyof GuestInfo)[] = [
      'namaLengkap',
      'nomorWhatsapp',
      'email',
      'provinsi',
      'kotaKabupaten',
      'kecamatan',
      'kelurahanDesa',
      'kodePos',
      'alamatLengkap',
    ];

    for (const f of requiredFields) {
      if (validateField(f, guestForm[f] || '') !== '') return false;
    }
    return isDataConfirmed;
  };

  // Derive active items for checkout
  const checkoutItems = isDirectBuy && buyNowItem
    ? [
        {
          id: buyNowItem.product.id,
          nama: buyNowItem.product.nama,
          harga: buyNowItem.product.harga,
          jumlah: buyNowItem.jumlah,
          estimasiKgTerselamatkan: buyNowItem.product.estimasiKgTerselamatkan,
          gambar: buyNowItem.product.gambar,
          gambarEmojiFallback: buyNowItem.product.gambarEmojiFallback,
          ukuran: buyNowItem.product.ukuran,
        },
      ]
    : cartItems;

  // Calculate pricing
  const subtotal = checkoutItems.reduce(
    (acc, item) => acc + item.harga * item.jumlah,
    0
  );
  const totalKgSaved = checkoutItems.reduce(
    (acc, item) => acc + item.estimasiKgTerselamatkan * item.jumlah,
    0
  );
  const shippingCost = shippingMethod === 'instan' ? 25000 : 12000;
  const grandTotal = subtotal + shippingCost;

  // Pay Now Handler
  const handlePayNow = () => {
    // If in guest mode, perform strict validation and auto-scroll to first error
    if (isGuest) {
      const requiredFields: (keyof GuestInfo)[] = [
        'namaLengkap',
        'nomorWhatsapp',
        'email',
        'provinsi',
        'kotaKabupaten',
        'kecamatan',
        'kelurahanDesa',
        'kodePos',
        'alamatLengkap',
      ];

      const newErrors: { [key: string]: string } = {};
      const newTouched: { [key: string]: boolean } = {};
      let firstErrorKey: string | null = null;

      for (const field of requiredFields) {
        newTouched[field] = true;
        const msg = validateField(field, guestForm[field] || '');
        if (msg) {
          newErrors[field] = msg;
          if (!firstErrorKey) firstErrorKey = field;
        }
      }

      if (!isDataConfirmed) {
        newErrors['isDataConfirmed'] = 'Centang kotak ini untuk mengonfirmasi kebenaran data.';
        if (!firstErrorKey) firstErrorKey = 'isDataConfirmed';
      }

      setTouched((prev) => ({ ...prev, ...newTouched, isDataConfirmed: true }));
      setErrors(newErrors);

      if (firstErrorKey) {
        // Auto scroll ke field pertama yang salah
        const targetElement = document.getElementById(`guest-${firstErrorKey}`);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          if ('focus' in targetElement) {
            (targetElement as HTMLElement).focus();
          }
        }
        return;
      }
    }

    // Save final guest info
    if (isGuest) {
      setGuestInfo(guestForm);
    }

    // Clear buyNow or clearCart according to mode
    if (isDirectBuy) {
      clearBuyNow(); // Cart is not touched!
    } else {
      clearCart();
    }

    // Navigate to Order Success with order info
    navigate('/pesanan-berhasil', {
      state: {
        orderNumber: 'ORD-2026-0142',
        items: checkoutItems,
        grandTotal,
        guestInfo: isGuest ? guestForm : null,
        isGuest,
        shippingMethod,
        paymentMethod,
      },
    });
  };

  // If items empty and not direct buy
  if (checkoutItems.length === 0) {
    return (
      <div className="py-16 sm:py-24 text-center">
        <Container size="narrow">
          <div className="bg-white rounded-3xl border border-[#E8E8ED] p-8 sm:p-12 space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#EBF4EE] text-[#2E7D4F] flex items-center justify-center mx-auto">
              <ShoppingBagIcon className="w-6 h-6" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#1D1D1F]">
              {isDirectBuy ? 'Tidak Ada Produk Beli Langsung' : 'Keranjang Belanja Kosong'}
            </h2>
            <p className="text-xs sm:text-sm text-[#6E6E73] max-w-sm mx-auto">
              {isDirectBuy
                ? 'Silakan pilih produk yang ingin kamu beli langsung dari katalog kami.'
                : 'Pilih produk olahan lezat dari buah dan sayur unik di katalog untuk mulai checkout.'}
            </p>
            <div className="pt-2">
              <Button to="/produk" variant="primary" size="md">
                Jelajahi Produk
              </Button>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="py-10 sm:py-16 md:py-20">
      <Container>
        {/* Navigation Breadcrumb Back */}
        <div className="mb-6">
          <Link
            to={isDirectBuy ? `/produk/${buyNowItem?.product.id || ''}` : '/keranjang'}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6E6E73] hover:text-[#2E7D4F] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>
              {isDirectBuy ? 'Kembali ke Detail Produk' : 'Kembali ke Keranjang'}
            </span>
          </Link>
        </div>

        {/* Stepper Indikator Langkah */}
        <div className="max-w-xl mx-auto mb-8 sm:mb-12">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#E8E8ED] -translate-y-1/2 z-0" />
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-[#2E7D4F] text-white flex items-center justify-center text-xs font-bold shadow-xs">
                1
              </div>
              <span className="text-[11px] font-bold text-[#1D1D1F] mt-1.5 bg-[#FBFBFD] px-1">
                Data &amp; Alamat
              </span>
            </div>
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-[#2E7D4F] text-white flex items-center justify-center text-xs font-bold shadow-xs">
                2
              </div>
              <span className="text-[11px] font-bold text-[#1D1D1F] mt-1.5 bg-[#FBFBFD] px-1">
                Pengiriman
              </span>
            </div>
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

        {/* =========================================================================
            GERBANG CHECKOUT: JIKA BELUM LOGIN DAN BELUM MASUK MODE TAMU
            ========================================================================= */}
        {!isLoggedIn && !isGuest && (
          <div className="max-w-2xl mx-auto mb-10">
            <div className="bg-white rounded-3xl border-2 border-[#2E7D4F]/30 p-6 sm:p-8 shadow-sm text-center space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-[#EBF4EE] text-[#2E7D4F] flex items-center justify-center mx-auto">
                <UserCheck className="w-6 h-6" />
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#1D1D1F]">
                  Pilih Cara Checkout
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-[#6E6E73] max-w-md mx-auto">
                  Kamu bisa masuk ke akun demo untuk alamat otomatis, atau langsung belanja cepat tanpa perlu daftar.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                {/* Opsi 1: Masuk ke Akun */}
                <div className="p-5 rounded-2xl border border-[#E8E8ED] bg-[#FBFBFD] hover:border-[#2E7D4F]/40 transition-all flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-[#2E7D4F] font-bold text-sm">
                      <LogIn className="w-4 h-4" />
                      <span>Masuk ke Akun</span>
                    </div>
                    <p className="text-xs text-[#6E6E73] leading-relaxed">
                      Alamat demo otomatis terisi, histori pesanan tercatat, dan hitungan dampak lingkungan tersimpan.
                    </p>
                  </div>
                  <Button
                    to="/masuk"
                    state={{ returnUrl: location.pathname + location.search }}
                    variant="primary"
                    size="md"
                    className="w-full justify-center text-xs font-semibold"
                  >
                    Masuk Sekarang
                  </Button>
                </div>

                {/* Opsi 2: Lanjut Tanpa Login */}
                <div className="p-5 rounded-2xl border-2 border-[#2E7D4F] bg-[#EBF4EE]/40 flex flex-col justify-between space-y-4 shadow-xs">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-[#1E432D] font-bold text-sm">
                      <Zap className="w-4 h-4 fill-current text-[#2E7D4F]" />
                      <span>Lanjut Tanpa Login</span>
                    </div>
                    <p className="text-xs text-[#6E6E73] leading-relaxed">
                      Belanja instan sebagai tamu. Cukup isi nama dan alamat pengiriman di bawah tanpa kata sandi.
                    </p>
                  </div>
                  <Button
                    onClick={startGuestMode}
                    variant="secondary"
                    size="md"
                    className="w-full justify-center text-xs font-semibold bg-white border border-[#2E7D4F] text-[#2E7D4F] hover:bg-[#EBF4EE]"
                  >
                    Belanja sebagai Tamu
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* =========================================================================
              KOLOM KIRI: FORM CHECKOUT SECTIONS
              ========================================================================= */}
          <div className="lg:col-span-7 space-y-8">
            {/* Banner Mode Beli Langsung */}
            {isDirectBuy && (
              <div className="p-4 rounded-2xl bg-[#EBF4EE] border border-[#2E7D4F]/30 flex items-center justify-between gap-3 text-xs text-[#1E432D]">
                <div className="flex items-center gap-2.5">
                  <Zap className="w-4 h-4 text-[#2E7D4F] shrink-0 fill-current" />
                  <div>
                    <span className="font-bold block">Mode Beli Langsung</span>
                    <span className="text-[#2E7D4F] font-medium text-[11px]">
                      Beli langsung — isi keranjangmu tidak berubah.
                    </span>
                  </div>
                </div>
                <Link
                  to="/keranjang"
                  className="font-bold underline text-[#2E7D4F] hover:text-[#256640] shrink-0 text-[11px]"
                >
                  Cek Keranjang
                </Link>
              </div>
            )}

            {/* Banner Mode Tamu */}
            {isGuest && (
              <div className="p-3.5 rounded-2xl bg-[#F5F5F7] border border-[#E8E8ED] flex items-center gap-2.5 text-xs text-[#6E6E73]">
                <Info className="w-4 h-4 text-[#2E7D4F] shrink-0" />
                <span>
                  Kamu belanja sebagai tamu. Status pesanan dikirim lewat WhatsApp dan email.
                </span>
              </div>
            )}

            {/* =====================================================================
                SECTION 1: DATA PEMBELI & ALAMAT PENGIRIMAN
                ===================================================================== */}
            {isGuest ? (
              /* FORM DATA PEMBELI & PENGIRIMAN LENGKAP (MODE TAMU) */
              <div className="bg-white rounded-3xl border border-[#E8E8ED] p-6 sm:p-7 shadow-none space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#E8E8ED]/70">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[#2E7D4F]" />
                    <div>
                      <h2 className="text-base sm:text-lg font-bold text-[#1D1D1F]">
                        Data Pembeli &amp; Pengiriman
                      </h2>
                      <p className="text-[11px] text-[#6E6E73]">
                        Isi data berikut untuk keperluan kurir dan konfirmasi pesanan
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-[#2E7D4F] bg-[#EBF4EE] px-2.5 py-0.5 rounded-full">
                    Mode Tamu
                  </span>
                </div>

                {/* a. Data Pembeli */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#1D1D1F] flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#2E7D4F]" />
                    <span>Data Pembeli</span>
                  </h3>

                  <div className="space-y-3">
                    {/* Nama Lengkap */}
                    <div>
                      <label className="block text-xs font-semibold text-[#1D1D1F] mb-1">
                        Nama Lengkap <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="guest-namaLengkap"
                        type="text"
                        value={guestForm.namaLengkap}
                        onChange={(e) => handleInputChange('namaLengkap', e.target.value)}
                        onBlur={() => handleBlur('namaLengkap')}
                        placeholder="Contoh: Rian Prasetya"
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-xs text-[#1D1D1F] transition-all focus:outline-none focus:ring-2 focus:ring-[#2E7D4F]/30 ${
                          touched.namaLengkap && errors.namaLengkap
                            ? 'border-red-400 bg-red-50/30'
                            : 'border-[#E8E8ED] bg-[#F5F5F7] focus:bg-white'
                        }`}
                      />
                      {touched.namaLengkap && errors.namaLengkap && (
                        <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{errors.namaLengkap}</span>
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Nomor WhatsApp */}
                      <div>
                        <label className="block text-xs font-semibold text-[#1D1D1F] mb-1">
                          Nomor WhatsApp <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="guest-nomorWhatsapp"
                          type="tel"
                          value={guestForm.nomorWhatsapp}
                          onChange={(e) => handleInputChange('nomorWhatsapp', e.target.value)}
                          onBlur={() => handleBlur('nomorWhatsapp')}
                          placeholder="081234567890 atau 62812..."
                          className={`w-full px-3.5 py-2.5 rounded-xl border text-xs text-[#1D1D1F] transition-all focus:outline-none focus:ring-2 focus:ring-[#2E7D4F]/30 ${
                            touched.nomorWhatsapp && errors.nomorWhatsapp
                              ? 'border-red-400 bg-red-50/30'
                              : 'border-[#E8E8ED] bg-[#F5F5F7] focus:bg-white'
                          }`}
                        />
                        {touched.nomorWhatsapp && errors.nomorWhatsapp && (
                          <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            <span>{errors.nomorWhatsapp}</span>
                          </p>
                        )}
                        <p className="text-[10px] text-[#8E8E93] mt-0.5">
                          Diawali 08 atau 62 (10–13 digit)
                        </p>
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-xs font-semibold text-[#1D1D1F] mb-1">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="guest-email"
                          type="email"
                          value={guestForm.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          onBlur={() => handleBlur('email')}
                          placeholder="nama@email.com (bukti pesanan)"
                          className={`w-full px-3.5 py-2.5 rounded-xl border text-xs text-[#1D1D1F] transition-all focus:outline-none focus:ring-2 focus:ring-[#2E7D4F]/30 ${
                            touched.email && errors.email
                              ? 'border-red-400 bg-red-50/30'
                              : 'border-[#E8E8ED] bg-[#F5F5F7] focus:bg-white'
                          }`}
                        />
                        {touched.email && errors.email && (
                          <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            <span>{errors.email}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* b. Alamat Pengiriman */}
                <div className="space-y-4 pt-3 border-t border-[#E8E8ED]/70">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#1D1D1F] flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#2E7D4F]" />
                    <span>Alamat Pengiriman</span>
                  </h3>

                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Provinsi */}
                      <div>
                        <label className="block text-xs font-semibold text-[#1D1D1F] mb-1">
                          Provinsi <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="guest-provinsi"
                          type="text"
                          value={guestForm.provinsi}
                          onChange={(e) => handleInputChange('provinsi', e.target.value)}
                          onBlur={() => handleBlur('provinsi')}
                          placeholder="Contoh: Jawa Barat"
                          className={`w-full px-3.5 py-2.5 rounded-xl border text-xs text-[#1D1D1F] transition-all focus:outline-none focus:ring-2 focus:ring-[#2E7D4F]/30 ${
                            touched.provinsi && errors.provinsi
                              ? 'border-red-400 bg-red-50/30'
                              : 'border-[#E8E8ED] bg-[#F5F5F7] focus:bg-white'
                          }`}
                        />
                        {touched.provinsi && errors.provinsi && (
                          <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            <span>{errors.provinsi}</span>
                          </p>
                        )}
                      </div>

                      {/* Kota / Kabupaten */}
                      <div>
                        <label className="block text-xs font-semibold text-[#1D1D1F] mb-1">
                          Kota / Kabupaten <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="guest-kotaKabupaten"
                          type="text"
                          value={guestForm.kotaKabupaten}
                          onChange={(e) => handleInputChange('kotaKabupaten', e.target.value)}
                          onBlur={() => handleBlur('kotaKabupaten')}
                          placeholder="Contoh: Kota Bandung"
                          className={`w-full px-3.5 py-2.5 rounded-xl border text-xs text-[#1D1D1F] transition-all focus:outline-none focus:ring-2 focus:ring-[#2E7D4F]/30 ${
                            touched.kotaKabupaten && errors.kotaKabupaten
                              ? 'border-red-400 bg-red-50/30'
                              : 'border-[#E8E8ED] bg-[#F5F5F7] focus:bg-white'
                          }`}
                        />
                        {touched.kotaKabupaten && errors.kotaKabupaten && (
                          <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            <span>{errors.kotaKabupaten}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {/* Kecamatan */}
                      <div>
                        <label className="block text-xs font-semibold text-[#1D1D1F] mb-1">
                          Kecamatan <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="guest-kecamatan"
                          type="text"
                          value={guestForm.kecamatan}
                          onChange={(e) => handleInputChange('kecamatan', e.target.value)}
                          onBlur={() => handleBlur('kecamatan')}
                          placeholder="Contoh: Coblong"
                          className={`w-full px-3.5 py-2.5 rounded-xl border text-xs text-[#1D1D1F] transition-all focus:outline-none focus:ring-2 focus:ring-[#2E7D4F]/30 ${
                            touched.kecamatan && errors.kecamatan
                              ? 'border-red-400 bg-red-50/30'
                              : 'border-[#E8E8ED] bg-[#F5F5F7] focus:bg-white'
                          }`}
                        />
                        {touched.kecamatan && errors.kecamatan && (
                          <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            <span>{errors.kecamatan}</span>
                          </p>
                        )}
                      </div>

                      {/* Kelurahan / Desa */}
                      <div>
                        <label className="block text-xs font-semibold text-[#1D1D1F] mb-1">
                          Kelurahan / Desa <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="guest-kelurahanDesa"
                          type="text"
                          value={guestForm.kelurahanDesa}
                          onChange={(e) => handleInputChange('kelurahanDesa', e.target.value)}
                          onBlur={() => handleBlur('kelurahanDesa')}
                          placeholder="Contoh: Dago"
                          className={`w-full px-3.5 py-2.5 rounded-xl border text-xs text-[#1D1D1F] transition-all focus:outline-none focus:ring-2 focus:ring-[#2E7D4F]/30 ${
                            touched.kelurahanDesa && errors.kelurahanDesa
                              ? 'border-red-400 bg-red-50/30'
                              : 'border-[#E8E8ED] bg-[#F5F5F7] focus:bg-white'
                          }`}
                        />
                        {touched.kelurahanDesa && errors.kelurahanDesa && (
                          <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            <span>{errors.kelurahanDesa}</span>
                          </p>
                        )}
                      </div>

                      {/* Kode Pos */}
                      <div>
                        <label className="block text-xs font-semibold text-[#1D1D1F] mb-1">
                          Kode Pos <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="guest-kodePos"
                          type="text"
                          maxLength={5}
                          value={guestForm.kodePos}
                          onChange={(e) => handleInputChange('kodePos', e.target.value)}
                          onBlur={() => handleBlur('kodePos')}
                          placeholder="5 angka (40135)"
                          className={`w-full px-3.5 py-2.5 rounded-xl border text-xs text-[#1D1D1F] transition-all focus:outline-none focus:ring-2 focus:ring-[#2E7D4F]/30 ${
                            touched.kodePos && errors.kodePos
                              ? 'border-red-400 bg-red-50/30'
                              : 'border-[#E8E8ED] bg-[#F5F5F7] focus:bg-white'
                          }`}
                        />
                        {touched.kodePos && errors.kodePos && (
                          <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            <span>{errors.kodePos}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Alamat Lengkap */}
                    <div>
                      <label className="block text-xs font-semibold text-[#1D1D1F] mb-1">
                        Alamat Lengkap <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="guest-alamatLengkap"
                        rows={2}
                        value={guestForm.alamatLengkap}
                        onChange={(e) => handleInputChange('alamatLengkap', e.target.value)}
                        onBlur={() => handleBlur('alamatLengkap')}
                        placeholder="Nama jalan, nomor rumah, RT/RW, blok, atau gedung"
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-xs text-[#1D1D1F] transition-all focus:outline-none focus:ring-2 focus:ring-[#2E7D4F]/30 ${
                          touched.alamatLengkap && errors.alamatLengkap
                            ? 'border-red-400 bg-red-50/30'
                            : 'border-[#E8E8ED] bg-[#F5F5F7] focus:bg-white'
                        }`}
                      />
                      {touched.alamatLengkap && errors.alamatLengkap && (
                        <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{errors.alamatLengkap}</span>
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Patokan (Opsional) */}
                      <div>
                        <label className="block text-xs font-semibold text-[#1D1D1F] mb-1">
                          Patokan Lokasi <span className="text-[#8E8E93] font-normal">(Opsional)</span>
                        </label>
                        <input
                          type="text"
                          value={guestForm.patokan || ''}
                          onChange={(e) => handleInputChange('patokan', e.target.value)}
                          placeholder="Dekat masjid / seberang ruko..."
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E8ED] bg-[#F5F5F7] text-xs text-[#1D1D1F] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2E7D4F]/30"
                        />
                      </div>

                      {/* Catatan untuk Kurir (Opsional) */}
                      <div>
                        <label className="block text-xs font-semibold text-[#1D1D1F] mb-1">
                          Catatan untuk Kurir <span className="text-[#8E8E93] font-normal">(Opsional)</span>
                        </label>
                        <input
                          type="text"
                          value={guestForm.catatanKurir || ''}
                          onChange={(e) => handleInputChange('catatanKurir', e.target.value)}
                          placeholder="Titip satpam / pagar warna hitam..."
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E8ED] bg-[#F5F5F7] text-xs text-[#1D1D1F] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2E7D4F]/30"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* c. Checkbox Wajib "Data di atas sudah benar" */}
                <div className="pt-3 border-t border-[#E8E8ED]/70">
                  <label
                    id="guest-isDataConfirmed"
                    className="flex items-start gap-2.5 cursor-pointer select-none group"
                  >
                    <input
                      type="checkbox"
                      checked={isDataConfirmed}
                      onChange={(e) => {
                        setIsDataConfirmed(e.target.checked);
                        if (errors.isDataConfirmed && e.target.checked) {
                          setErrors((prev) => ({ ...prev, isDataConfirmed: '' }));
                        }
                      }}
                      className="mt-0.5 w-4 h-4 rounded text-[#2E7D4F] border-[#E8E8ED] focus:ring-[#2E7D4F] cursor-pointer"
                    />
                    <div className="text-xs text-[#1D1D1F]">
                      <span className="font-semibold group-hover:text-[#2E7D4F] transition-colors">
                        Data di atas sudah benar <span className="text-red-500">*</span>
                      </span>
                      <p className="text-[11px] text-[#6E6E73] mt-0.5">
                        Saya memastikan nama, nomor WhatsApp, dan alamat kirim sudah sesuai untuk proses kurir.
                      </p>
                    </div>
                  </label>
                  {touched.isDataConfirmed && errors.isDataConfirmed && (
                    <p className="text-[11px] text-red-500 mt-1.5 flex items-center gap-1 pl-6">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.isDataConfirmed}</span>
                    </p>
                  )}
                </div>
              </div>
            ) : (
              /* KARTU ALAMAT PENGIRIMAN AKUN TERDAFTAR / DEMO */
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
            )}

            {/* =====================================================================
                SECTION 2: PILIHAN PENGIRIMAN (KARTU RADIO)
                ===================================================================== */}
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

            {/* =====================================================================
                SECTION 3: METODE PEMBAYARAN (KARTU RADIO)
                ===================================================================== */}
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
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-[#1D1D1F]">Ringkasan Pesanan</h3>
                {isDirectBuy && (
                  <span className="text-[11px] font-bold text-[#2E7D4F] bg-[#EBF4EE] px-2.5 py-0.5 rounded-full">
                    Beli Langsung
                  </span>
                )}
              </div>

              {/* Items Mini List with Quantity Stepper for Buy Now Item */}
              <div className="space-y-3 pb-5 border-b border-[#E8E8ED]/70">
                {checkoutItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      {isDirectBuy ? (
                        <div className="inline-flex items-center rounded-lg border border-[#E8E8ED] bg-[#F5F5F7] p-0.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => updateBuyNowQuantity(-1)}
                            disabled={item.jumlah <= 1}
                            className="w-5 h-5 rounded flex items-center justify-center text-[#1D1D1F] hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed"
                            aria-label="Kurangi jumlah"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center font-bold text-xs tabular-nums text-[#1D1D1F]">
                            {item.jumlah}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateBuyNowQuantity(1)}
                            disabled={item.jumlah >= 10}
                            className="w-5 h-5 rounded flex items-center justify-center text-[#1D1D1F] hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed"
                            aria-label="Tambah jumlah"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <span className="font-semibold text-[#1D1D1F] shrink-0">
                          {item.jumlah}x
                        </span>
                      )}
                      <span className="text-[#6E6E73] truncate max-w-[170px]">
                        {item.nama}
                      </span>
                    </div>

                    <span className="font-bold text-[#1D1D1F] tabular-nums shrink-0">
                      Rp{(item.harga * item.jumlah).toLocaleString('id-ID')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Calculations */}
              <div className="space-y-2.5 text-xs sm:text-sm text-[#6E6E73] pb-5 border-b border-[#E8E8ED]/70">
                <div className="flex items-center justify-between">
                  <span>Subtotal ({checkoutItems.reduce((acc, i) => acc + i.jumlah, 0)} barang)</span>
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
              <div className="space-y-2">
                <Button
                  onClick={handlePayNow}
                  disabled={isGuest && !isGuestFormValid()}
                  variant="primary"
                  size="lg"
                  fullWidth
                  icon={<ArrowRight className="w-4 h-4" />}
                  iconPosition="right"
                  className={`font-semibold shadow-md ${
                    isGuest && !isGuestFormValid()
                      ? 'opacity-60 cursor-not-allowed bg-[#8E8E93]'
                      : 'bg-[#2E7D4F] hover:bg-[#256640] text-white'
                  }`}
                >
                  Bayar Sekarang (Simulasi)
                </Button>

                {isGuest && !isGuestFormValid() && (
                  <p className="text-center text-[11px] text-amber-700 font-medium">
                    Lengkapi semua kolom wajib bertanda bintang (*) dan centang konfirmasi untuk melanjutkan.
                  </p>
                )}
              </div>

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

// Inline ShoppingBagIcon fallback
function ShoppingBagIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
      />
    </svg>
  );
}
