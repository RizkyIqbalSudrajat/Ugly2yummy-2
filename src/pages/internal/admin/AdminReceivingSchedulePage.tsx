import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAdminData } from '../../../context/AdminDataContext';
import { useWorkerData } from '../../../context/WorkerDataContext';
import { ReceivingSchedule, ReceivingScheduleStatus, ReceivingScheduleType } from '../../../types/admin';
import { ReceivingCondition } from '../../../types/worker';
import { AdminStatusBadge } from '../../../components/internal/AdminStatusBadge';
import {
  Calendar as CalendarIcon,
  Clock,
  Truck,
  Building,
  Plus,
  CheckCircle2,
  AlertCircle,
  MapPin,
  User,
  ChevronRight,
  Filter,
  Check,
  X,
  Package,
  Layers,
} from 'lucide-react';

const SEVEN_DAYS_STRIP = [
  { dayName: 'Kam', dateNum: '08', dateStr: '08 Okt 2026' },
  { dayName: 'Jum', dateNum: '09', dateStr: '09 Okt 2026' },
  { dayName: 'Sab', dateNum: '10', dateStr: '10 Okt 2026' },
  { dayName: 'Min', dateNum: '11', dateStr: '11 Okt 2026' },
  { dayName: 'Sen', dateNum: '12', dateStr: '12 Okt 2026' },
  { dayName: 'Sel', dateNum: '13', dateStr: '13 Okt 2026' },
  { dayName: 'Rab', dateNum: '14', dateStr: '14 Okt 2026', isToday: true },
  { dayName: 'Kam', dateNum: '15', dateStr: '15 Okt 2026' },
  { dayName: 'Jum', dateNum: '16', dateStr: '16 Okt 2026' },
];

const STATUS_TABS: ('Semua' | ReceivingScheduleStatus)[] = [
  'Semua',
  'Terjadwal',
  'Dalam Perjalanan',
  'Diterima',
  'Dibatalkan',
];

const PRESET_VEHICLES = [
  'Pick-up GrandMax B 1234 CD',
  'Blindvan GranMax D 5678 EF',
  'Pick-up L300 D 8821 UY',
];

const STAFF_OPTIONS = [
  { nama: 'Raka Pratama', peran: 'Admin Logistik' },
  { nama: 'Dewi Lestari', peran: 'Kepala Sortir QC' },
  { nama: 'Budi Santoso', peran: 'Staff Dapur' },
  { nama: 'Siti Rahma', peran: 'Staff Seleksi QC' },
];

export const AdminReceivingSchedulePage: React.FC = () => {
  const { schedules, addSchedule, updateScheduleStatus, offers, updateOfferStatus, addNotification } = useAdminData();
  const { addReceiving } = useWorkerData();
  const [searchParams] = useSearchParams();

  // Status Tabs: Semua, Terjadwal, Dalam Perjalanan, Diterima, Dibatalkan
  const [activeStatusTab, setActiveStatusTab] = useState<'Semua' | ReceivingScheduleStatus>('Semua');

  // Selected date from 7-day strip (or '' for all)
  const [selectedDate, setSelectedDate] = useState<string>('14 Okt 2026');
  const [typeFilter, setTypeFilter] = useState<'Semua' | ReceivingScheduleType>('Semua');

  // Modal create schedule
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedOfferId, setSelectedOfferId] = useState<string>('');
  const [schedType, setSchedType] = useState<ReceivingScheduleType>('Diantar Supplier');
  const [schedDate, setSchedDate] = useState('15 Okt 2026');
  const [schedTime, setSchedTime] = useState('09:00 WIB');
  const [schedStaff, setSchedStaff] = useState('Raka Pratama');
  const [schedVehicle, setSchedVehicle] = useState('Pick-up GrandMax B 1234 CD');
  const [schedNote, setSchedNote] = useState('');

  // Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Check URL query param for penawaranId
  useEffect(() => {
    const pId = searchParams.get('penawaranId');
    if (pId) {
      setSelectedOfferId(pId);
      setShowCreateModal(true);
    }
  }, [searchParams]);

  // Approved offers ready to schedule
  const approvedOffers = useMemo(() => {
    return offers.filter((o) => o.status === 'Disetujui' || o.id === selectedOfferId);
  }, [offers, selectedOfferId]);

  // Small summary metrics at the top
  const summaryMetrics = useMemo(() => {
    const todayCount = schedules.filter((s) => s.tanggal.includes('14 Okt')).length;
    const weekCount = schedules.length;
    const delayedCount = schedules.filter(
      (s) =>
        s.status === 'Terjadwal' &&
        (s.tanggal.includes('10 Okt') ||
          s.tanggal.includes('11 Okt') ||
          s.tanggal.includes('12 Okt') ||
          s.tanggal.includes('13 Okt'))
    ).length;

    return { todayCount, weekCount, delayedCount };
  }, [schedules]);

  // Status Tab counts
  const statusTabCounts = useMemo(() => {
    const counts: Record<string, number> = { Semua: schedules.length };
    STATUS_TABS.forEach((tab) => {
      if (tab !== 'Semua') {
        counts[tab] = schedules.filter((s) => s.status === tab).length;
      }
    });
    return counts;
  }, [schedules]);

  // Dates with schedules (for green dot in 7-day strip)
  const datesWithSchedule = useMemo(() => {
    const setDates = new Set<string>();
    schedules.forEach((s) => {
      setDates.add(s.tanggal);
    });
    return setDates;
  }, [schedules]);

  // Filtered schedules
  const filteredSchedules = useMemo(() => {
    return schedules.filter((item) => {
      // Status Tab filter
      if (activeStatusTab !== 'Semua' && item.status !== activeStatusTab) {
        return false;
      }
      // Date filter
      if (selectedDate && item.tanggal !== selectedDate) {
        return false;
      }
      // Logistics type filter
      if (typeFilter !== 'Semua' && item.tipe !== typeFilter) {
        return false;
      }
      return true;
    });
  }, [schedules, activeStatusTab, selectedDate, typeFilter]);

  // Handle Create Schedule
  const handleCreateScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOfferId) return;

    const targetOffer = offers.find((o) => o.id === selectedOfferId);
    if (!targetOffer) return;

    const newSched = addSchedule({
      penawaranId: targetOffer.id,
      namaBahan: targetOffer.namaBahan,
      supplierNama: targetOffer.supplierNama,
      kelompokTani: targetOffer.kelompokTani,
      beratKg: targetOffer.beratTersediaKg,
      tipe: schedType,
      tanggal: schedDate,
      jam: schedTime,
      petugas: schedStaff,
      kendaraan: schedType === 'Dijemput Tim' ? (schedVehicle || 'Pick-up GrandMax B 1234 CD') : (schedVehicle || 'Kendaraan Supplier'),
      status: 'Terjadwal',
      catatan: schedNote || `Jadwal penerimaan bahan baku ${targetOffer.namaBahan}.`,
    });

    // Update penawaran status to Dijadwalkan
    updateOfferStatus(targetOffer.id, 'Dijadwalkan', { jadwalId: newSched.id });

    addNotification({
      tipe: 'Penawaran',
      judul: `Jadwal Dibuat: ${targetOffer.namaBahan}`,
      isi: `${schedType} pada ${schedDate} pukul ${schedTime} bersama ${schedStaff}. Status penawaran kini Dijadwalkan.`,
      linkTujuan: '/internal/admin/jadwal',
    });

    setShowCreateModal(false);
    showToast(`Jadwal penerimaan ${targetOffer.namaBahan} berhasil dibuat! Penawaran otomatis berstatus Dijadwalkan.`);
  };

  // Handle Status Transition
  const handleUpdateStatus = (
    sched: ReceivingSchedule,
    newStatus: ReceivingScheduleStatus
  ) => {
    updateScheduleStatus(sched.id, newStatus);

    if (newStatus === 'Diterima') {
      // 1. Temukan penawaran untuk mendapatkan kategori jenis bahan
      const matchedOffer = offers.find((o) => o.id === sched.penawaranId);
      const jenisBahan = matchedOffer?.jenis || 'Sayur';

      // 2. Tentukan kondisi awal penerimaan
      const fallbackKondisi: ReceivingCondition[] = ['Bentuk tidak seragam', 'Kulit bercak/tergores'];
      const validKondisi: ReceivingCondition[] = (matchedOffer?.kondisiDatang || []).filter((k): k is ReceivingCondition =>
        ['Bentuk tidak seragam', 'Ukuran kecil', 'Kulit bercak/tergores', 'Terlalu matang', 'Sebagian busuk'].includes(k)
      );

      // 3. Otomatis buat data penerimaan bahan di WorkerDataContext (antrean Seleksi pekerja)
      addReceiving({
        supplierAsal: `${sched.supplierNama} - ${sched.kelompokTani}`,
        namaBahan: sched.namaBahan,
        jenis: jenisBahan,
        beratAwal: sched.beratKg,
        tanggalMasuk: '14 Okt 2026',
        kondisi: validKondisi.length > 0 ? validKondisi : fallbackKondisi,
        catatan: `Otomatis masuk dari jadwal ${sched.id} (${sched.tipe}). Dicatat oleh petugas ${sched.petugas}.`,
        foto: matchedOffer?.foto || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80',
        dicatatOleh: sched.petugas,
      });

      // 3. Status penawaran berubah jadi Dikirim/Dijemput
      if (sched.penawaranId) {
        updateOfferStatus(sched.penawaranId, 'Dikirim/Dijemput');
      }

      addNotification({
        tipe: 'Penawaran',
        judul: `Bahan Tiba di Dapur: ${sched.namaBahan}`,
        isi: `Pasokan ${sched.beratKg} kg telah diterima dan langsung masuk antrean Seleksi QC pekerja.`,
        linkTujuan: '/internal/pekerja/seleksi',
      });

      showToast(`Bahan ${sched.namaBahan} (${sched.beratKg} kg) telah Diterima! Draft penerimaan dibuat & penawaran berstatus Dikirim/Dijemput.`);
    } else {
      showToast(`Status jadwal ${sched.id} diubah menjadi ${newStatus}.`);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#1D1D1F] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in slide-in-from-top duration-300">
          <CheckCircle2 className="w-5 h-5 text-[#2E7D4F]" />
          <p className="text-xs sm:text-sm font-semibold">{toastMessage}</p>
        </div>
      )}

      {/* Header Info & Tombol Buat Jadwal */}
      <div className="bg-white rounded-3xl border border-[#E8E8ED] p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#EBF4EE] text-[#2E7D4F] border border-[#2E7D4F]/20 inline-flex items-center gap-1">
              <CalendarIcon className="w-3 h-3" />
              Logistik Pasokan Dapur
            </span>
            <span className="text-xs text-[#6E6E73]">
              {schedules.length} Agenda Terjadwal
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1D1D1F]">
            Jadwal Penerimaan & Penjemputan Bahan
          </h1>
          <p className="text-xs sm:text-sm text-[#6E6E73] mt-1 max-w-xl">
            Kelola agenda kedatangan pasokan dari mitra tani, koordinasi armada tim jemput, dan verifikasi bahan masuk langsung ke meja seleksi pekerja.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 rounded-full bg-[#2E7D4F] text-white text-xs font-semibold hover:bg-[#256640] transition-colors shadow-xs cursor-pointer inline-flex items-center gap-2 self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Jadwal Baru</span>
        </button>
      </div>

      {/* Ringkasan 3 Metrik di Atas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="p-4 rounded-2xl bg-white border border-[#E8E8ED] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-[#6E6E73]">Jadwal Hari Ini (14 Okt)</p>
            <p className="text-xl font-bold text-[#1D1D1F] mt-0.5">{summaryMetrics.todayCount} Kedatangan</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-[#EBF4EE] text-[#2E7D4F] flex items-center justify-center font-bold">
            <Clock className="w-4 h-4" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E8E8ED] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-[#6E6E73]">Total Jadwal Minggu Ini</p>
            <p className="text-xl font-bold text-[#1D1D1F] mt-0.5">{summaryMetrics.weekCount} Terdaftar</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <CalendarIcon className="w-4 h-4" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E8E8ED] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-[#6E6E73]">Perlu Perhatian / Terlambat</p>
            <p className="text-xl font-bold text-amber-700 mt-0.5">{summaryMetrics.delayedCount} Armada</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
            <AlertCircle className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Tab Status Bar: Semua, Terjadwal, Dalam Perjalanan, Diterima, Dibatalkan */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {STATUS_TABS.map((tab) => {
          const count = statusTabCounts[tab] || 0;
          const isActive = activeStatusTab === tab;

          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveStatusTab(tab)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-[#1D1D1F] text-white shadow-xs'
                  : 'bg-white text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-[#F5F5F7] border border-[#E8E8ED]'
              }`}
            >
              <span>{tab}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-[#F5F5F7] text-[#6E6E73]'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 7-Day Strip Selector (Weekly Calendar) */}
      <div className="bg-white rounded-3xl border border-[#E8E8ED] p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-[#1D1D1F] flex items-center gap-1.5">
            <CalendarIcon className="w-3.5 h-3.5 text-[#2E7D4F]" />
            Pilih Tanggal Kalender Mingguan
          </h3>
          {selectedDate && (
            <button
              type="button"
              onClick={() => setSelectedDate('')}
              className="text-[11px] font-semibold text-[#2E7D4F] hover:underline cursor-pointer"
            >
              Tampilkan Semua Tanggal
            </button>
          )}
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-9 gap-2">
          {SEVEN_DAYS_STRIP.map((day) => {
            const isSelected = selectedDate === day.dateStr;
            const hasSchedule = datesWithSchedule.has(day.dateStr);

            return (
              <button
                key={day.dateStr}
                type="button"
                onClick={() => setSelectedDate(day.dateStr)}
                className={`p-2.5 rounded-2xl text-center transition-all cursor-pointer border relative flex flex-col items-center justify-center ${
                  isSelected
                    ? 'bg-[#1D1D1F] text-white border-[#1D1D1F] shadow-xs'
                    : 'bg-[#FBFBFD] text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-[#F5F5F7] border-[#E8E8ED]'
                }`}
              >
                {/* Dot hijau penanda ada jadwal */}
                {hasSchedule && (
                  <span
                    className={`absolute top-1.5 right-1.5 w-2 h-2 rounded-full ${
                      isSelected ? 'bg-[#2E7D4F] ring-2 ring-white' : 'bg-[#2E7D4F]'
                    }`}
                  />
                )}

                <span className="text-[10px] font-semibold uppercase">{day.dayName}</span>
                <span className={`text-base font-bold my-0.5 ${isSelected ? 'text-white' : 'text-[#1D1D1F]'}`}>
                  {day.dateNum}
                </span>
                {day.isToday && (
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-[#2E7D4F] text-white font-bold">
                    Hari Ini
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter Tipe Pengantaran */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-[#8E8E93] flex items-center gap-1 mr-1">
          <Filter className="w-3 h-3" />
          Tipe:
        </span>
        {(['Semua', 'Diantar Supplier', 'Dijemput Tim'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTypeFilter(t)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              typeFilter === t
                ? 'bg-[#EBF4EE] text-[#2E7D4F] border border-[#2E7D4F]/30'
                : 'bg-white text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-[#F5F5F7] border border-[#E8E8ED]'
            }`}
          >
            {t === 'Semua' ? 'Semua Tipe' : t}
          </button>
        ))}
      </div>

      {/* List Kartu Jadwal */}
      {filteredSchedules.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#E8E8ED] p-12 text-center shadow-xs">
          <CalendarIcon className="w-10 h-10 text-[#8E8E93] mx-auto mb-3" />
          <h3 className="text-sm font-bold text-[#1D1D1F]">Tidak ada jadwal penerimaan</h3>
          <p className="text-xs text-[#6E6E73] mt-1">
            {selectedDate
              ? `Belum ada agenda pasokan untuk tanggal ${selectedDate} dengan status "${activeStatusTab}".`
              : `Belum ada jadwal yang sesuai dengan filter "${activeStatusTab}".`}
          </p>
          <button
            type="button"
            onClick={() => {
              setActiveStatusTab('Semua');
              setSelectedDate('');
              setTypeFilter('Semua');
            }}
            className="mt-4 px-4 py-2 text-xs font-semibold rounded-full bg-[#1D1D1F] text-white hover:bg-[#2E7D4F] transition-colors cursor-pointer"
          >
            Reset Semua Filter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSchedules.map((sched) => (
            <div
              key={sched.id}
              className="bg-white rounded-3xl border border-[#E8E8ED] p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#2E7D4F]/40 transition-all"
            >
              <div>
                {/* Header Card */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                        sched.tipe === 'Dijemput Tim'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {sched.tipe === 'Dijemput Tim' ? (
                        <Truck className="w-4 h-4" />
                      ) : (
                        <Building className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <span className="font-mono text-[10px] font-bold text-[#8E8E93]">
                        {sched.id}
                      </span>
                      <p className="text-xs font-bold text-[#1D1D1F]">{sched.tipe}</p>
                    </div>
                  </div>

                  <AdminStatusBadge status={sched.status} size="sm" />
                </div>

                {/* Bahan & Supplier Info */}
                <div className="space-y-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="text-base font-bold text-[#1D1D1F]">
                      {sched.namaBahan}
                    </h3>
                    <span className="text-sm font-bold text-[#2E7D4F]">
                      {sched.beratKg} kg
                    </span>
                  </div>
                  <p className="text-xs text-[#6E6E73]">
                    {sched.supplierNama} ({sched.kelompokTani})
                  </p>
                </div>

                {/* Detail Waktu & Armada */}
                <div className="mt-3.5 p-3 rounded-2xl bg-[#FBFBFD] border border-[#E8E8ED] space-y-2 text-xs">
                  <div className="flex items-center justify-between text-[#6E6E73]">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#8E8E93]" />
                      Waktu Kedatangan:
                    </span>
                    <span className="font-bold text-[#1D1D1F]">
                      {sched.tanggal}, {sched.jam}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[#6E6E73]">
                    <span className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#8E8E93]" />
                      Petugas:
                    </span>
                    <span className="font-semibold text-[#1D1D1F]">{sched.petugas}</span>
                  </div>

                  <div className="flex items-center justify-between text-[#6E6E73]">
                    <span className="flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-[#8E8E93]" />
                      Kendaraan:
                    </span>
                    <span className="text-[#1D1D1F] font-medium">{sched.kendaraan}</span>
                  </div>

                  {sched.catatan && (
                    <p className="pt-1.5 border-t border-[#E8E8ED] text-[11px] text-[#6E6E73] italic">
                      "{sched.catatan}"
                    </p>
                  )}
                </div>
              </div>

              {/* Status Update Actions */}
              <div className="pt-3 border-t border-[#E8E8ED] flex items-center justify-between gap-2">
                <span className="text-[11px] text-[#8E8E93]">Ubah status:</span>

                <div className="flex items-center gap-1.5 flex-wrap justify-end">
                  {sched.status === 'Terjadwal' && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(sched, 'Dalam Perjalanan')}
                        className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 hover:bg-amber-100 transition-colors cursor-pointer"
                      >
                        Mulai Jalan
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(sched, 'Dibatalkan')}
                        className="px-2.5 py-1 rounded-full text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        Batal
                      </button>
                    </>
                  )}

                  {sched.status === 'Dalam Perjalanan' && (
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(sched, 'Diterima')}
                      className="px-3.5 py-1 rounded-full text-xs font-semibold bg-[#2E7D4F] text-white hover:bg-[#256640] transition-colors shadow-xs cursor-pointer inline-flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Konfirmasi Tiba (Diterima)
                    </button>
                  )}

                  {sched.status === 'Diterima' && (
                    <span className="text-xs text-[#2E7D4F] font-semibold inline-flex items-center gap-1 bg-[#EBF4EE] px-2.5 py-1 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Masuk Antrean Seleksi QC
                    </span>
                  )}

                  {sched.status === 'Dibatalkan' && (
                    <span className="text-xs text-red-600 font-semibold inline-flex items-center gap-1 bg-red-50 px-2.5 py-1 rounded-full">
                      Jadwal Dibatalkan
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= MODAL BUAT JADWAL ================= */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-[#E8E8ED] animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E8E8ED] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#EBF4EE] text-[#2E7D4F] flex items-center justify-center">
                  <CalendarIcon className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-[#1D1D1F]">
                  Buat Jadwal Penerimaan Bahan
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-full hover:bg-[#F5F5F7] text-[#8E8E93] hover:text-[#1D1D1F]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateScheduleSubmit} className="space-y-3.5 text-xs">
              {/* 1. Pilih Penawaran Disetujui */}
              <div>
                <label className="block font-semibold text-[#1D1D1F] mb-1">
                  Pilih Penawaran yang Sudah Disetujui:
                </label>
                <select
                  value={selectedOfferId}
                  onChange={(e) => setSelectedOfferId(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl bg-[#F5F5F7] border-0 text-[#1D1D1F] focus:ring-2 focus:ring-[#2E7D4F]/30"
                >
                  <option value="">-- Pilih dari penawaran mitra yang telah disetujui --</option>
                  {approvedOffers.map((off) => (
                    <option key={off.id} value={off.id}>
                      {off.id} - {off.namaBahan} ({off.beratTersediaKg} kg) - {off.supplierNama}
                    </option>
                  ))}
                </select>
                {approvedOffers.length === 0 && (
                  <p className="text-[11px] text-amber-700 mt-1">
                    Belum ada penawaran baru yang disetujui. Setujui penawaran terlebih dahulu di menu Penawaran.
                  </p>
                )}
              </div>

              {/* 2. Tipe Pengantaran */}
              <div>
                <label className="block font-semibold text-[#1D1D1F] mb-1">
                  Tipe Logistik:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['Diantar Supplier', 'Dijemput Tim'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => {
                        setSchedType(t);
                        if (t === 'Dijemput Tim' && !schedVehicle.includes('GrandMax')) {
                          setSchedVehicle('Pick-up GrandMax B 1234 CD');
                        }
                      }}
                      className={`p-2.5 rounded-xl font-semibold border transition-all cursor-pointer text-center ${
                        schedType === t
                          ? 'bg-[#EBF4EE] text-[#2E7D4F] border-[#2E7D4F]/30'
                          : 'bg-[#F5F5F7] text-[#6E6E73] border-transparent'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Tanggal & Jam */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#1D1D1F] mb-1">
                    Tanggal Kedatangan:
                  </label>
                  <input
                    type="text"
                    value={schedDate}
                    onChange={(e) => setSchedDate(e.target.value)}
                    placeholder="Contoh: 15 Okt 2026"
                    required
                    className="w-full p-2.5 rounded-xl bg-[#F5F5F7] border-0 text-[#1D1D1F]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#1D1D1F] mb-1">
                    Jam Kedatangan / Jemput:
                  </label>
                  <input
                    type="text"
                    value={schedTime}
                    onChange={(e) => setSchedTime(e.target.value)}
                    placeholder="Contoh: 09:00 WIB"
                    required
                    className="w-full p-2.5 rounded-xl bg-[#F5F5F7] border-0 text-[#1D1D1F]"
                  />
                </div>
              </div>

              {/* 4. Petugas (Raka Pratama / Dewi Lestari / etc) */}
              <div>
                <label className="block font-semibold text-[#1D1D1F] mb-1">
                  Petugas Penanggung Jawab:
                </label>
                <select
                  value={schedStaff}
                  onChange={(e) => setSchedStaff(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#F5F5F7] border-0 text-[#1D1D1F]"
                >
                  {STAFF_OPTIONS.map((st) => (
                    <option key={st.nama} value={st.nama}>
                      {st.nama} ({st.peran})
                    </option>
                  ))}
                </select>
              </div>

              {/* 5. Kendaraan (opsional jika dijemput / preset) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-semibold text-[#1D1D1F]">
                    Kendaraan Armada {schedType === 'Dijemput Tim' ? '(Wajib Dijemput)' : '(Opsional)'}:
                  </label>
                  <span className="text-[10px] text-[#8E8E93]">Pilih cepat:</span>
                </div>

                {/* Preset Kendaraan Chips */}
                <div className="flex items-center gap-1.5 flex-wrap mb-2">
                  {PRESET_VEHICLES.map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setSchedVehicle(v)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer border ${
                        schedVehicle === v
                          ? 'bg-[#EBF4EE] text-[#2E7D4F] border-[#2E7D4F]/30'
                          : 'bg-[#F5F5F7] text-[#6E6E73] border-transparent hover:bg-[#E8E8ED]'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>

                <input
                  type="text"
                  value={schedVehicle}
                  onChange={(e) => setSchedVehicle(e.target.value)}
                  placeholder="Contoh: Pick-up GrandMax B 1234 CD / Blindvan GranMax D 5678 EF"
                  className="w-full p-2.5 rounded-xl bg-[#F5F5F7] border-0 text-[#1D1D1F]"
                />
              </div>

              {/* 6. Catatan */}
              <div>
                <label className="block font-semibold text-[#1D1D1F] mb-1">
                  Catatan Tambahan (Opsional):
                </label>
                <textarea
                  value={schedNote}
                  onChange={(e) => setSchedNote(e.target.value)}
                  placeholder="Lokasi bongkar muat, instruksi peti khusus, rute jemput..."
                  rows={2}
                  className="w-full p-2.5 rounded-xl bg-[#F5F5F7] border-0 text-[#1D1D1F]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E8E8ED]">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-full bg-[#F5F5F7] text-[#6E6E73] hover:text-[#1D1D1F] cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={!selectedOfferId}
                  className="px-5 py-2 rounded-full bg-[#2E7D4F] text-white hover:bg-[#256640] disabled:opacity-50 transition-colors shadow-xs cursor-pointer font-semibold"
                >
                  Simpan Jadwal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
