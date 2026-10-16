import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAdminData } from '../../../context/AdminDataContext';
import { AdminStatusBadge } from '../../../components/internal/AdminStatusBadge';
import { SmartImage } from '../../../components/ui/SmartImage';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Calendar,
  Truck,
  MapPin,
  Clock,
  Sparkles,
  Check,
  Send,
  AlertCircle,
  Phone,
  Building,
  User,
  Scale,
  DollarSign,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

const STEPPER_STAGES = [
  'Menunggu Persetujuan',
  'Disetujui',
  'Dijadwalkan',
  'Dikirim/Dijemput',
  'Selesai & Dibayar',
];

export const AdminSupplierOfferDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { offers, suppliers, updateOfferStatus, addNegotiationMessage, addNotification } = useAdminData();
  const navigate = useNavigate();

  const offer = offers.find((o) => o.id === id);

  // Supplier directory detail
  const supplierInfo = useMemo(() => {
    if (!offer) return null;
    return (
      suppliers.find((s) => s.id === offer.supplierId || s.nama === offer.supplierNama) || {
        id: offer.supplierId,
        nama: offer.supplierNama,
        kelompokTani: offer.kelompokTani,
        kota: offer.kota,
        noHp: offer.noHp,
        rekening: 'BCA 1390-4821-99 a.n. Mitra Tani',
        totalKgDisetor: 3450,
        ratingKualitas: 94,
      }
    );
  }, [offer, suppliers]);

  // Modal states
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [approveNote, setApproveNote] = useState('');
  const [showSchedulePrompt, setShowSchedulePrompt] = useState(false);

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('Kualitas tidak sesuai');
  const [rejectNote, setRejectNote] = useState('');

  const [showNegotiateModal, setShowNegotiateModal] = useState(false);
  const [negoPrice, setNegoPrice] = useState(offer?.hargaTawarPerKg ? offer.hargaTawarPerKg - 1000 : 7000);
  const [negoMessage, setNegoMessage] = useState('');

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  if (!offer) {
    return (
      <div className="bg-white rounded-3xl border border-[#E8E8ED] p-12 text-center max-w-lg mx-auto space-y-4 shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-[#F5F5F7] border border-[#E8E8ED] flex items-center justify-center mx-auto text-[#6E6E73]">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-[#1D1D1F]">Penawaran Tidak Ditemukan</h2>
        <p className="text-sm text-[#6E6E73]">
          Penawaran dengan ID {id} tidak ditemukan dalam sistem portal admin.
        </p>
        <Link
          to="/internal/admin/penawaran"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1D1D1F] text-white text-xs font-semibold hover:bg-[#2E7D4F] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Daftar Penawaran
        </Link>
      </div>
    );
  }

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const cleanPhone = (phone: string) => {
    return phone.replace(/[^0-9]/g, '').replace(/^0/, '62');
  };

  // Actions
  const handleApprove = () => {
    updateOfferStatus(offer.id, 'Disetujui', {
      hargaKesepakatanPerKg: offer.hargaKesepakatanPerKg || offer.hargaTawarPerKg,
    });
    addNotification({
      tipe: 'Penawaran',
      judul: `Penawaran ${offer.namaBahan} Disetujui`,
      isi: `Penawaran ID ${offer.id} (${offer.beratTersediaKg} kg) dari ${offer.supplierNama} telah disetujui.`,
      linkTujuan: `/internal/admin/penawaran/${offer.id}`,
    });
    setShowApproveModal(false);
    showToast(`Penawaran ${offer.id} berhasil disetujui!`);
    setShowSchedulePrompt(true);
  };

  const handleReject = () => {
    updateOfferStatus(offer.id, 'Ditolak');
    addNotification({
      tipe: 'Penawaran',
      judul: `Penawaran ${offer.namaBahan} Ditolak`,
      isi: `Alasan: ${rejectReason}${rejectNote ? ` - ${rejectNote}` : ''}`,
      linkTujuan: `/internal/admin/penawaran/${offer.id}`,
    });
    setShowRejectModal(false);
    showToast(`Penawaran ${offer.id} telah ditolak.`);
  };

  const handleNegotiate = () => {
    if (!negoPrice || !negoMessage.trim()) return;

    addNegotiationMessage(offer.id, {
      pihak: 'Admin',
      hargaTawar: negoPrice,
      pesan: negoMessage.trim(),
    });

    updateOfferStatus(offer.id, 'Negosiasi', {
      hargaKesepakatanPerKg: negoPrice,
    });

    addNotification({
      tipe: 'Penawaran',
      judul: `Negosiasi Terkirim: ${offer.namaBahan}`,
      isi: `Admin mengajukan penawaran harga Rp ${negoPrice.toLocaleString('id-ID')}/kg ke ${offer.supplierNama}.`,
      linkTujuan: `/internal/admin/penawaran/${offer.id}`,
    });

    setShowNegotiateModal(false);
    showToast(`Negosiasi harga Rp ${negoPrice.toLocaleString('id-ID')}/kg berhasil dikirim!`);
  };

  // Demo: Simulasikan balasan supplier
  const handleSimulateSupplierReply = () => {
    const agreedPrice = offer.hargaKesepakatanPerKg || offer.hargaTawarPerKg;
    addNegotiationMessage(offer.id, {
      pihak: 'Supplier',
      hargaTawar: agreedPrice,
      pesan: `Baik Admin Ugly2Yummy, kelompok tani kami menyepakati harga tawar Rp ${agreedPrice.toLocaleString('id-ID')}/kg. Kami siap atur waktu pengiriman/penjemputan.`,
    });

    // Kembalikan status ke Menunggu Persetujuan agar admin bisa langsung menyetujui
    updateOfferStatus(offer.id, 'Menunggu Persetujuan', {
      hargaKesepakatanPerKg: agreedPrice,
    });

    addNotification({
      tipe: 'Penawaran',
      judul: `Supplier Menyetujui Negosiasi: ${offer.namaBahan}`,
      isi: `${offer.supplierNama} menerima tawaran harga Rp ${agreedPrice.toLocaleString('id-ID')}/kg. Siap disetujui.`,
      linkTujuan: `/internal/admin/penawaran/${offer.id}`,
    });

    showToast(`Supplier ${offer.supplierNama} menerima penawaran harga! Status kini siap disetujui.`);
  };

  // Stepper logic
  const isRejected = offer.status === 'Ditolak';
  const isNego = offer.status === 'Negosiasi';
  const currentStageIndex = STEPPER_STAGES.indexOf(offer.status);

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-200">
      {/* Toast floating banner */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#1D1D1F] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in slide-in-from-top duration-300">
          <CheckCircle2 className="w-5 h-5 text-[#2E7D4F]" />
          <p className="text-xs sm:text-sm font-semibold">{toastMessage}</p>
        </div>
      )}

      {/* Navigation Header */}
      <div className="flex items-center justify-between gap-4">
        <Link
          to="/internal/admin/penawaran"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#6E6E73] hover:text-[#1D1D1F] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Daftar Penawaran
        </Link>

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-[#6E6E73]">{offer.id}</span>
          <AdminStatusBadge status={offer.status} size="sm" />
        </div>
      </div>

      {/* Stepper Progress Status (Apple Minimalist) */}
      <div className="bg-white rounded-3xl border border-[#E8E8ED] p-5 sm:p-6 shadow-xs">
        <h3 className="text-xs font-bold tracking-wider text-[#8E8E93] uppercase mb-4">
          Tahapan Status Penawaran
        </h3>

        {isRejected ? (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200/80 flex items-center gap-3">
            <XCircle className="w-5 h-5 text-red-600 shrink-0" />
            <div>
              <p className="text-xs sm:text-sm font-bold text-red-900">
                Penawaran Telah Ditolak
              </p>
              <p className="text-xs text-red-700 mt-0.5">
                Bahan tidak memenuhi kriteria dapur olahan saat ini atau kapasitas gudang penuh.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 relative">
            {STEPPER_STAGES.map((stage, idx) => {
              const isPast = currentStageIndex > idx;
              const isCurrent = currentStageIndex === idx || (isNego && idx === 0);

              return (
                <div
                  key={stage}
                  className={`p-3 rounded-2xl border transition-all ${
                    isCurrent
                      ? isNego
                        ? 'bg-amber-50 border-amber-200 text-amber-900'
                        : 'bg-[#EBF4EE] border-[#2E7D4F]/30 text-[#2E7D4F]'
                      : isPast
                      ? 'bg-[#FBFBFD] border-[#E8E8ED] text-[#1D1D1F]'
                      : 'bg-[#F5F5F7]/50 border-transparent text-[#8E8E93]'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <span
                      className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        isCurrent
                          ? isNego
                            ? 'bg-amber-600 text-white'
                            : 'bg-[#2E7D4F] text-white'
                          : isPast
                          ? 'bg-[#2E7D4F] text-white'
                          : 'bg-[#E8E8ED] text-[#8E8E93]'
                      }`}
                    >
                      {isPast ? <Check className="w-2.5 h-2.5" /> : idx + 1}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                      {isCurrent ? (isNego ? 'Negosiasi' : 'Aktif') : isPast ? 'Selesai' : 'Antrean'}
                    </span>
                  </div>
                  <p className="text-xs font-bold truncate">
                    {stage}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Main Grid: Info Bahan & Right Sticky Action Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ================= KOLOM KIRI (8 Kolom Desktop) ================= */}
        <div className="lg:col-span-8 space-y-6">
          {/* 1. Galeri Foto & Rincian Bahan Utama */}
          <div className="bg-white rounded-3xl border border-[#E8E8ED] p-5 sm:p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#F5F5F7] text-[#6E6E73] border border-[#E8E8ED] inline-block mb-2">
                  Kategori {offer.jenis}
                </span>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1D1D1F]">
                  {offer.namaBahan}
                </h1>
                <p className="text-xs sm:text-sm text-[#6E6E73] mt-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#8E8E93]" />
                  {offer.kota} · Diajukan pada {offer.tanggalDiajukan}
                </p>
              </div>

              <div className="text-left sm:text-right bg-[#FBFBFD] sm:bg-transparent p-3 sm:p-0 rounded-2xl border sm:border-0 border-[#E8E8ED]">
                <p className="text-xs text-[#6E6E73]">Total Nilai Penawaran</p>
                <p className="text-xl sm:text-2xl font-bold text-[#2E7D4F]">
                  {formatRupiah(
                    offer.beratTersediaKg *
                      (offer.hargaKesepakatanPerKg || offer.hargaTawarPerKg)
                  )}
                </p>
                <p className="text-xs text-[#6E6E73]">
                  {formatRupiah(offer.hargaKesepakatanPerKg || offer.hargaTawarPerKg)} / kg
                </p>
              </div>
            </div>

            {/* Foto Bahan SmartImage */}
            <div className="rounded-2xl overflow-hidden border border-[#E8E8ED] bg-[#F5F5F7] aspect-[16/9]">
              <SmartImage
                src={offer.foto}
                alt={offer.namaBahan}
                aspectRatio="16:9"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Chips Kondisi Datang */}
            <div>
              <h4 className="text-xs font-bold text-[#1D1D1F] mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#2E7D4F]" />
                Karakteristik Imperfect (Kondisi Panen):
              </h4>
              <div className="flex items-center gap-2 flex-wrap">
                {offer.kondisiDatang.map((k) => (
                  <span
                    key={k}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-[#EBF4EE] text-[#2E7D4F] border border-[#2E7D4F]/20"
                  >
                    {k}
                  </span>
                ))}
              </div>
            </div>

            {/* Grid Detail Panen & Spesifikasi */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-[#E8E8ED]">
              <div className="p-3 bg-[#FBFBFD] rounded-2xl border border-[#E8E8ED]">
                <p className="text-[11px] text-[#6E6E73]">Berat Pasokan</p>
                <p className="text-sm font-bold text-[#1D1D1F] mt-0.5">{offer.beratTersediaKg} kg</p>
              </div>

              <div className="p-3 bg-[#FBFBFD] rounded-2xl border border-[#E8E8ED]">
                <p className="text-[11px] text-[#6E6E73]">Harga Tawar Awal</p>
                <p className="text-sm font-bold text-[#1D1D1F] mt-0.5">{formatRupiah(offer.hargaTawarPerKg)}/kg</p>
              </div>

              <div className="p-3 bg-[#FBFBFD] rounded-2xl border border-[#E8E8ED]">
                <p className="text-[11px] text-[#6E6E73]">Tanggal Panen</p>
                <p className="text-sm font-bold text-[#1D1D1F] mt-0.5">13 Okt 2026</p>
              </div>

              <div className="p-3 bg-[#FBFBFD] rounded-2xl border border-[#E8E8ED]">
                <p className="text-[11px] text-[#6E6E73]">Batas Pakai</p>
                <p className="text-sm font-bold text-amber-700 mt-0.5">19 Okt 2026</p>
              </div>
            </div>

            {/* Catatan / Pesan dari Supplier */}
            {offer.catatanSupplier && (
              <div className="p-4 rounded-2xl bg-[#F5F5F7] border border-[#E8E8ED]">
                <h4 className="text-xs font-bold text-[#1D1D1F] mb-1 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-[#6E6E73]" />
                  Pesan dari Petani Supplier:
                </h4>
                <p className="text-xs text-[#6E6E73] leading-relaxed">
                  "{offer.catatanSupplier}"
                </p>
              </div>
            )}
          </div>

          {/* 2. Kartu Supplier Mitra */}
          <div className="bg-white rounded-3xl border border-[#E8E8ED] p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2E7D4F]" />
                <h3 className="text-base font-bold text-[#1D1D1F]">
                  Informasi Petani Mitra
                </h3>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#EBF4EE] text-[#2E7D4F]">
                Mitra Terverifikasi
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#FBFBFD] border border-[#E8E8ED]">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#2E7D4F] text-white font-bold flex items-center justify-center text-base shrink-0 shadow-xs">
                  {offer.supplierNama
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#1D1D1F]">{offer.supplierNama}</h4>
                  <p className="text-xs text-[#6E6E73]">{offer.kelompokTani}</p>
                  <p className="text-[11px] text-[#8E8E93] mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {supplierInfo?.kota || offer.kota}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <a
                  href={`https://wa.me/${cleanPhone(offer.noHp)}?text=Halo%20${encodeURIComponent(
                    offer.supplierNama
                  )},%20kami%20dari%20tim%20kurasi%20Ugly2Yummy%20mengenai%20penawaran%20${encodeURIComponent(
                    offer.namaBahan
                  )}%20(ID:%20${offer.id}).`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 rounded-full bg-[#2E7D4F] text-white text-xs font-semibold hover:bg-[#256640] transition-colors inline-flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5" />
                  Hubungi WhatsApp
                </a>
              </div>
            </div>

            {/* Statistik Riwayat Supplier */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-2xl bg-[#F5F5F7] border border-[#E8E8ED]">
                <p className="text-[11px] text-[#6E6E73]">Total Disetor</p>
                <p className="text-sm font-bold text-[#1D1D1F] mt-0.5">
                  {supplierInfo?.totalKgDisetor?.toLocaleString('id-ID') || '2.400'} kg
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-[#F5F5F7] border border-[#E8E8ED]">
                <p className="text-[11px] text-[#6E6E73]">Rating Kualitas QC</p>
                <p className="text-sm font-bold text-[#2E7D4F] mt-0.5">
                  {supplierInfo?.ratingKualitas || 92}% Layak
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-[#F5F5F7] border border-[#E8E8ED]">
                <p className="text-[11px] text-[#6E6E73]">Rekening Pembayaran</p>
                <p className="text-[11px] font-bold text-[#1D1D1F] mt-0.5 truncate">
                  {supplierInfo?.rekening?.split(' a.n.')[0] || 'BCA 1390-4821-99'}
                </p>
              </div>
            </div>
          </div>

          {/* 3. Riwayat Negosiasi (Percakapan Bubble Chat) */}
          {(offer.riwayatNegosiasi.length > 0 || isNego) && (
            <div className="bg-white rounded-3xl border border-[#E8E8ED] p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <h3 className="text-base font-bold text-[#1D1D1F]">
                    Riwayat Negosiasi Harga
                  </h3>
                </div>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                  {offer.riwayatNegosiasi.length} Percakapan
                </span>
              </div>

              {/* Chat bubbles */}
              <div className="space-y-3 pt-2">
                {offer.riwayatNegosiasi.map((msg, i) => {
                  const isAdmin = msg.pihak === 'Admin';
                  return (
                    <div
                      key={i}
                      className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center gap-1.5 mb-1 px-1">
                        <span className="text-[10px] font-bold text-[#6E6E73]">
                          {isAdmin ? 'Tim Ugly2Yummy (Admin)' : offer.supplierNama}
                        </span>
                        <span className="text-[10px] text-[#8E8E93]">· {msg.tanggal}</span>
                      </div>

                      <div
                        className={`max-w-[85%] sm:max-w-[75%] p-3.5 rounded-2xl text-xs leading-relaxed shadow-xs ${
                          isAdmin
                            ? 'bg-[#EBF4EE] text-[#1D1D1F] border border-[#2E7D4F]/20 rounded-tr-xs'
                            : 'bg-[#F5F5F7] text-[#1D1D1F] border border-[#E8E8ED] rounded-tl-xs'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3 mb-1.5 pb-1 border-b border-black/5 font-semibold text-[11px]">
                          <span>Tawaran Harga:</span>
                          <span className={isAdmin ? 'text-[#2E7D4F] font-bold' : 'text-[#1D1D1F]'}>
                            {formatRupiah(msg.hargaTawar)} / kg
                          </span>
                        </div>
                        <p>{msg.pesan}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Demo button: Simulasikan Balasan Supplier */}
              {isNego && (
                <div className="pt-3 border-t border-[#E8E8ED] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-amber-50/50 p-4 rounded-2xl border border-amber-200/60">
                  <div>
                    <p className="text-xs font-bold text-amber-900">
                      Simulasi Demo Respon Supplier
                    </p>
                    <p className="text-[11px] text-amber-700">
                      Uji skenario ketika petani supplier menerima tawaran harga admin.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleSimulateSupplierReply}
                    className="px-3.5 py-2 text-xs font-semibold rounded-full bg-amber-700 text-white hover:bg-amber-800 transition-colors shadow-xs cursor-pointer self-start sm:self-auto shrink-0"
                  >
                    Simulasikan Balasan Supplier
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ================= KOLOM KANAN (Sticky Desktop Action Panel) ================= */}
        <div className="lg:col-span-4 sticky top-6 space-y-4">
          <div className="bg-white rounded-3xl border border-[#E8E8ED] p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#1D1D1F] border-b border-[#E8E8ED] pb-3">
              Keputusan Kurasi Pasokan
            </h3>

            {/* Informasi Harga Final */}
            <div className="p-3.5 rounded-2xl bg-[#FBFBFD] border border-[#E8E8ED]">
              <div className="flex items-center justify-between text-xs text-[#6E6E73] mb-1">
                <span>Harga Kesepakatan:</span>
                <span className="font-bold text-[#2E7D4F] text-sm">
                  {formatRupiah(offer.hargaKesepakatanPerKg || offer.hargaTawarPerKg)} / kg
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-[#6E6E73]">
                <span>Total Estimasi ({offer.beratTersediaKg} kg):</span>
                <span className="font-bold text-[#1D1D1F]">
                  {formatRupiah(offer.beratTersediaKg * (offer.hargaKesepakatanPerKg || offer.hargaTawarPerKg))}
                </span>
              </div>
            </div>

            {/* Panel Aksi Berdasarkan Status */}
            {offer.status === 'Menunggu Persetujuan' || offer.status === 'Negosiasi' ? (
              <div className="space-y-2.5">
                {/* 1. Tombol Setujui */}
                <button
                  type="button"
                  onClick={() => setShowApproveModal(true)}
                  className="w-full py-2.5 px-4 rounded-full bg-[#2E7D4F] text-white text-xs font-semibold hover:bg-[#256640] transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Setujui Pasokan Bahan
                </button>

                {/* 2. Tombol Negosiasi */}
                <button
                  type="button"
                  onClick={() => setShowNegotiateModal(true)}
                  className="w-full py-2.5 px-4 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold hover:bg-amber-100 transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4 text-amber-700" />
                  Ajukan Negosiasi Harga
                </button>

                {/* 3. Tombol Tolak */}
                <button
                  type="button"
                  onClick={() => setShowRejectModal(true)}
                  className="w-full py-2.5 px-4 rounded-full bg-[#FEF3F2] text-[#B42318] border border-[#FECDCA] text-xs font-semibold hover:bg-[#FEE4E2] transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  Tolak Penawaran
                </button>
              </div>
            ) : offer.status === 'Disetujui' ? (
              <div className="space-y-3">
                <div className="p-3 rounded-2xl bg-[#ECFDF3] border border-[#A6F4C5] text-xs text-[#027A48]">
                  Penawaran telah disetujui. Langkah berikutnya adalah mengatur tanggal dan armada penjemputan/pengantaran bahan.
                </div>

                <Link
                  to={`/internal/admin/jadwal?penawaranId=${offer.id}`}
                  className="w-full py-2.5 px-4 rounded-full bg-[#2E7D4F] text-white text-xs font-semibold hover:bg-[#256640] transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-2 text-center"
                >
                  <Calendar className="w-4 h-4" />
                  Buat Jadwal Sekarang
                </Link>
              </div>
            ) : offer.status === 'Dijadwalkan' ? (
              <div className="space-y-3">
                <div className="p-3 rounded-2xl bg-[#EFF8FF] border border-[#B2DDFF] text-xs text-[#175CD3]">
                  Pengiriman/penjemputan bahan sudah memiliki jadwal operasional resmi di kalender dapur.
                </div>

                <Link
                  to="/internal/admin/jadwal"
                  className="w-full py-2.5 px-4 rounded-full bg-[#175CD3] text-white text-xs font-semibold hover:bg-blue-700 transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-2 text-center"
                >
                  <Calendar className="w-4 h-4" />
                  Buka Jadwal Penerimaan
                </Link>
              </div>
            ) : offer.status === 'Dikirim/Dijemput' ? (
              <div className="p-3 rounded-2xl bg-[#FEFBE8] border border-[#FDE272] text-xs text-[#A15C07]">
                Bahan sedang dalam proses transportasi atau telah tiba di meja sortir QC dapur.
              </div>
            ) : offer.status === 'Selesai & Dibayar' ? (
              <div className="p-3 rounded-2xl bg-[#EBF4EE] border border-[#2E7D4F]/30 text-xs text-[#2E7D4F]">
                Pasokan telah berhasil diseleksi, diolah di dapur, dan pembayaran ke rekening mitra tani telah rampung.
              </div>
            ) : (
              <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700">
                Penawaran ditutup dengan status Ditolak.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ================= MODAL 1: SETUJUI PENAWARAN ================= */}
      {showApproveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-[#E8E8ED] animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#EBF4EE] text-[#2E7D4F] flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#1D1D1F]">Setujui Penawaran Bahan?</h3>
                <p className="text-xs text-[#6E6E73]">{offer.namaBahan} · {offer.beratTersediaKg} kg</p>
              </div>
            </div>

            <p className="text-xs text-[#6E6E73] leading-relaxed">
              Anda menyetujui pasokan seharga{' '}
              <strong className="text-[#1D1D1F]">
                {formatRupiah(offer.hargaKesepakatanPerKg || offer.hargaTawarPerKg)}/kg
              </strong>{' '}
              dengan total nilai{' '}
              <strong className="text-[#2E7D4F]">
                {formatRupiah(offer.beratTersediaKg * (offer.hargaKesepakatanPerKg || offer.hargaTawarPerKg))}
              </strong>
              . Petani akan menerima notifikasi bahwa pasokan diterima.
            </p>

            <div>
              <label className="block text-xs font-semibold text-[#1D1D1F] mb-1">
                Catatan Persetujuan (Opsional):
              </label>
              <textarea
                value={approveNote}
                onChange={(e) => setApproveNote(e.target.value)}
                placeholder="Contoh: Sangat cocok untuk batch saus sangrai dan sambal akhir pekan..."
                rows={3}
                className="w-full text-xs p-3 rounded-2xl bg-[#F5F5F7] border-0 focus:ring-2 focus:ring-[#2E7D4F]/30 text-[#1D1D1F]"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowApproveModal(false)}
                className="px-4 py-2 text-xs font-semibold rounded-full bg-[#F5F5F7] text-[#6E6E73] hover:text-[#1D1D1F] transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleApprove}
                className="px-5 py-2 text-xs font-semibold rounded-full bg-[#2E7D4F] text-white hover:bg-[#256640] transition-colors shadow-xs cursor-pointer"
              >
                Konfirmasi Setuju
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL PROMPT: BUAT JADWAL SEKARANG? ================= */}
      {showSchedulePrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-[#E8E8ED] animate-in zoom-in-95 duration-200">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>

            <h3 className="text-base font-bold text-[#1D1D1F]">
              Buat Jadwal Penerimaan Sekarang?
            </h3>

            <p className="text-xs text-[#6E6E73] leading-relaxed">
              Penawaran sudah disetujui. Apakah Anda ingin langsung membuat jadwal penjemputan armada atau penerimaan di dapur sekarang?
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowSchedulePrompt(false)}
                className="px-4 py-2 text-xs font-semibold rounded-full bg-[#F5F5F7] text-[#6E6E73] hover:text-[#1D1D1F] transition-colors cursor-pointer"
              >
                Nanti Saja
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowSchedulePrompt(false);
                  navigate(`/internal/admin/jadwal?penawaranId=${offer.id}`);
                }}
                className="px-5 py-2 text-xs font-semibold rounded-full bg-[#2E7D4F] text-white hover:bg-[#256640] transition-colors shadow-xs cursor-pointer inline-flex items-center gap-1.5"
              >
                <span>Buat Jadwal Sekarang</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: NEGOSIASI HARGA ================= */}
      {showNegotiateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-[#E8E8ED] animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-amber-700" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#1D1D1F]">Ajukan Negosiasi Harga</h3>
                <p className="text-xs text-[#6E6E73]">Harga awal supplier: {formatRupiah(offer.hargaTawarPerKg)}/kg</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#1D1D1F] mb-1">
                  Harga Tawar Baru per kg (Rp):
                </label>
                <input
                  type="number"
                  step="500"
                  value={negoPrice}
                  onChange={(e) => setNegoPrice(Number(e.target.value))}
                  className="w-full text-sm font-bold p-3 rounded-2xl bg-[#F5F5F7] border-0 focus:ring-2 focus:ring-amber-500/30 text-[#1D1D1F]"
                />
                <p className="text-[11px] text-[#6E6E73] mt-1">
                  Total nilai baru: {formatRupiah(negoPrice * offer.beratTersediaKg)}
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1D1D1F] mb-1">
                  Pesan Penjelasan ke Supplier:
                </label>
                <textarea
                  value={negoMessage}
                  onChange={(e) => setNegoMessage(e.target.value)}
                  placeholder="Contoh: Mengingat kondisi buah yang cukup matang dan butuh sortir cepat, kami tawarkan penjemputan langsung di kebun dengan harga ini..."
                  rows={3}
                  className="w-full text-xs p-3 rounded-2xl bg-[#F5F5F7] border-0 focus:ring-2 focus:ring-amber-500/30 text-[#1D1D1F]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowNegotiateModal(false)}
                className="px-4 py-2 text-xs font-semibold rounded-full bg-[#F5F5F7] text-[#6E6E73] hover:text-[#1D1D1F] transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleNegotiate}
                disabled={!negoPrice || !negoMessage.trim()}
                className="px-5 py-2 text-xs font-semibold rounded-full bg-amber-700 text-white hover:bg-amber-800 disabled:opacity-50 transition-colors shadow-xs cursor-pointer inline-flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                Kirim Penawaran
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 3: TOLAK PENAWARAN ================= */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-[#E8E8ED] animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
                <XCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#1D1D1F]">Tolak Penawaran Bahan</h3>
                <p className="text-xs text-[#6E6E73]">{offer.namaBahan} (ID: {offer.id})</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#1D1D1F] mb-1">
                  Pilih Alasan Utama:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    'Kualitas tidak sesuai',
                    'Stok sudah cukup',
                    'Harga terlalu tinggi',
                    'Lainnya',
                  ].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRejectReason(r)}
                      className={`p-2.5 rounded-xl text-xs font-semibold text-left transition-colors cursor-pointer border ${
                        rejectReason === r
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : 'bg-[#F5F5F7] text-[#6E6E73] border-transparent hover:text-[#1D1D1F]'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1D1D1F] mb-1">
                  Catatan Tambahan untuk Petani:
                </label>
                <textarea
                  value={rejectNote}
                  onChange={(e) => setRejectNote(e.target.value)}
                  placeholder="Beri masukan sopan agar petani mitra dapat mengajukan pasokan di masa mendatang..."
                  rows={3}
                  className="w-full text-xs p-3 rounded-2xl bg-[#F5F5F7] border-0 focus:ring-2 focus:ring-red-500/30 text-[#1D1D1F]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 text-xs font-semibold rounded-full bg-[#F5F5F7] text-[#6E6E73] hover:text-[#1D1D1F] transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleReject}
                className="px-5 py-2 text-xs font-semibold rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors shadow-xs cursor-pointer"
              >
                Konfirmasi Tolak
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
