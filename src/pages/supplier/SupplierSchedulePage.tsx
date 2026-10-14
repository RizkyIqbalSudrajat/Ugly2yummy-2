import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useSupplierAuth } from '../../context/SupplierAuthContext';
import { SupplierOffer } from '../../types/supplier';
import {
  Calendar,
  Clock,
  Truck,
  Building2,
  MapPin,
  Phone,
  ArrowRight,
  CheckCircle2,
  CalendarDays,
  ExternalLink,
  ChevronRight,
  Filter,
} from 'lucide-react';

interface DayItem {
  dateStr: string; // "YYYY-MM-DD"
  dayName: string; // "Sen", "Sel", etc
  dayNumber: number; // 12, 13, 14...
  fullFormatted: string; // "14 Okt 2026"
  hasSchedule: boolean;
  isToday: boolean;
}

export const SupplierSchedulePage: React.FC = () => {
  const { offers } = useSupplierAuth();
  const [activeSection, setActiveSection] = useState<'mendatang' | 'lewat'>('mendatang');
  const [selectedDayFilter, setSelectedDayFilter] = useState<string | null>(null);

  // Filter penawaran yang memiliki jadwal
  const scheduledOffers = useMemo(() => {
    return offers.filter((o) => o.jadwal !== undefined);
  }, [offers]);

  // Kelompokkan menjadi Mendatang vs Sudah Lewat
  // Mendatang: status 'Dijadwalkan' atau 'Dikirim/Dijemput'
  // Sudah Lewat: status 'Selesai & Dibayar' atau riwayat lampau
  const upcomingOffers = useMemo(() => {
    return scheduledOffers.filter(
      (o) => o.status === 'Dijadwalkan' || o.status === 'Dikirim/Dijemput'
    );
  }, [scheduledOffers]);

  const pastOffers = useMemo(() => {
    return scheduledOffers.filter(
      (o) => o.status === 'Selesai & Dibayar' || o.status === 'Ditolak'
    );
  }, [scheduledOffers]);

  // Strip 7 Hari Minggu Ini (Senin 12 Okt - Minggu 18 Okt 2026)
  const currentWeekDays: DayItem[] = useMemo(() => {
    // Patokan referensi Oktober 2026
    const baseDate = new Date(2026, 9, 14); // 14 Okt 2026 (Rabu)
    const dayOfWeek = baseDate.getDay(); // 0 is Sun, 3 is Wed
    const startOfWeek = new Date(baseDate);
    // Set to Monday (12 Okt)
    const distanceToMonday = (dayOfWeek + 6) % 7;
    startOfWeek.setDate(baseDate.getDate() - distanceToMonday);

    const dayNames = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
    const days: DayItem[] = [];

    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);

      const dNum = d.getDate();
      const monthStr = 'Okt';
      const yearStr = d.getFullYear();
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(dNum).padStart(2, '0')}`;
      const fullFormatted = `${dNum} ${monthStr} ${yearStr}`;

      // Periksa apakah ada penawaran dengan jadwal di tanggal ini (misal "16 Oktober 2026" atau "14 Oktober 2026")
      const hasSched = scheduledOffers.some((o) => {
        if (!o.jadwal) return false;
        const jTgl = o.jadwal.tanggal.toLowerCase();
        return jTgl.includes(String(dNum)) && jTgl.includes('okt');
      });

      days.push({
        dateStr,
        dayName: dayNames[i],
        dayNumber: dNum,
        fullFormatted,
        hasSchedule: hasSched,
        isToday: dNum === 14,
      });
    }

    return days;
  }, [scheduledOffers]);

  // Penawaran aktif berdasarkan tab yang dipilih
  const displayOffers = useMemo(() => {
    const list = activeSection === 'mendatang' ? upcomingOffers : pastOffers;
    if (!selectedDayFilter) return list;

    // Filter berdasarkan hari strip
    return list.filter((o) => {
      if (!o.jadwal) return false;
      const targetDayNum = selectedDayFilter.split('-')[2];
      const jTgl = o.jadwal.tanggal.toLowerCase();
      return jTgl.includes(targetDayNum) && jTgl.includes('okt');
    });
  }, [activeSection, upcomingOffers, pastOffers, selectedDayFilter]);

  // Kelompokkan per tanggal
  const groupedByDate = useMemo(() => {
    const groups: Record<string, SupplierOffer[]> = {};
    displayOffers.forEach((offer) => {
      if (!offer.jadwal) return;
      const dateKey = offer.jadwal.tanggal;
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(offer);
    });
    return groups;
  }, [displayOffers]);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* =====================================================================
          HEADER HALAMAN JADWAL
          ===================================================================== */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1D1D1F]">
          Jadwal Logistik
        </h1>
        <p className="mt-1 text-sm text-[#6E6E73]">
          Agenda penjemputan armada Ugly2Yummy dan serah terima hasil panen di sentra kelompok tani.
        </p>
      </div>

      {/* =====================================================================
          STRIP 7 HARI MINGGU INI (INTERAKTIF & TITIK HIJAU JADWAL)
          ===================================================================== */}
      <div className="bg-white rounded-3xl border border-[#E8E8ED] p-5 shadow-none space-y-3">
        <div className="flex items-center justify-between pb-2">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-[#2E7D4F]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#1D1D1F]">
              Minggu Ini · Oktober 2026
            </h2>
          </div>
          {selectedDayFilter && (
            <button
              type="button"
              onClick={() => setSelectedDayFilter(null)}
              className="text-xs font-semibold text-[#2E7D4F] hover:underline cursor-pointer"
            >
              Tampilkan Semua Hari
            </button>
          )}
        </div>

        {/* 7 Day Strip */}
        <div className="grid grid-cols-7 gap-2">
          {currentWeekDays.map((day) => {
            const isSelected = selectedDayFilter === day.dateStr;
            return (
              <button
                key={day.dateStr}
                type="button"
                onClick={() => {
                  setSelectedDayFilter(isSelected ? null : day.dateStr);
                }}
                className={`py-3 px-1 rounded-2xl flex flex-col items-center justify-between min-h-[78px] transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-[#2E7D4F] text-white border-[#2E7D4F] shadow-sm'
                    : day.isToday
                    ? 'bg-[#F5F5F7] text-[#1D1D1F] border-[#2E7D4F]/40 ring-1 ring-[#2E7D4F]/20'
                    : 'bg-[#FBFBFD] text-[#1D1D1F] border-[#E8E8ED] hover:bg-[#F5F5F7]'
                }`}
              >
                <span
                  className={`text-[10px] font-semibold uppercase ${
                    isSelected ? 'text-white/80' : 'text-[#6E6E73]'
                  }`}
                >
                  {day.dayName}
                </span>

                <span
                  className={`text-base font-bold ${
                    isSelected ? 'text-white' : 'text-[#1D1D1F]'
                  }`}
                >
                  {day.dayNumber}
                </span>

                {/* Titik Hijau Indikator Jadwal */}
                <div className="h-2 flex items-center justify-center">
                  {day.hasSchedule && (
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isSelected ? 'bg-white' : 'bg-[#2E7D4F]'
                      }`}
                    />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* =====================================================================
          TAB SEGMENTED: MENDATANG vs SUDAH LEWAT
          ===================================================================== */}
      <div className="flex items-center gap-3">
        <div className="p-1 bg-[#F5F5F7] rounded-full flex items-center border border-[#E8E8ED]">
          <button
            type="button"
            onClick={() => {
              setActiveSection('mendatang');
            }}
            className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeSection === 'mendatang'
                ? 'bg-white text-[#1D1D1F] shadow-xs'
                : 'text-[#6E6E73] hover:text-[#1D1D1F]'
            }`}
          >
            Mendatang ({upcomingOffers.length})
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveSection('lewat');
            }}
            className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeSection === 'lewat'
                ? 'bg-white text-[#1D1D1F] shadow-xs'
                : 'text-[#6E6E73] hover:text-[#1D1D1F]'
            }`}
          >
            Sudah Lewat ({pastOffers.length})
          </button>
        </div>
      </div>

      {/* =====================================================================
          DAFTAR KARTU JADWAL DIKELOMPOKKAN PER TANGGAL
          ===================================================================== */}
      {Object.keys(groupedByDate).length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#E8E8ED] p-12 text-center shadow-none">
          <div className="max-w-sm mx-auto space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#F5F5F7] border border-[#E8E8ED] flex items-center justify-center mx-auto text-[#6E6E73]">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#1D1D1F]">
              Tidak Ada Jadwal {activeSection === 'mendatang' ? 'Mendatang' : 'Riwayat'}
            </h3>
            <p className="text-xs text-[#6E6E73]">
              {selectedDayFilter
                ? 'Tidak ada agenda serah terima pada hari yang Anda pilih di kalender.'
                : 'Semua jadwal baru akan muncul otomatis ketika penawaran Anda disetujui kurator.'}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedByDate).map(([dateLabel, items]) => (
            <div key={dateLabel} className="space-y-3">
              {/* Header Tanggal Kelompok */}
              <div className="flex items-center gap-2 px-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2E7D4F]" />
                <h3 className="text-sm font-bold text-[#1D1D1F]">
                  {dateLabel}
                </h3>
                <span className="text-xs text-[#6E6E73]">
                  ({items.length} agenda)
                </span>
              </div>

              {/* Kartu-Kartu Jadwal */}
              <div className="space-y-3">
                {items.map((offer) => {
                  const schedule = offer.jadwal!;
                  const isPickup = schedule.metode === 'Dijemput tim Ugly2Yummy';
                  const waNumber = schedule.petugas.noHp
                    .replace(/\D/g, '')
                    .replace(/^0/, '62');

                  return (
                    <div
                      key={offer.id}
                      className="bg-white rounded-3xl border border-[#E8E8ED] p-5 sm:p-6 shadow-none hover:border-[#2E7D4F]/30 transition-all space-y-4"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        {/* Kolom Kiri: Ikon Metode & Bahan + Jam */}
                        <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                          {/* Ikon Metode Logistik */}
                          <div
                            className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${
                              isPickup
                                ? 'bg-[#EBF4EE] text-[#2E7D4F] border-[#2E7D4F]/25'
                                : 'bg-[#EFF8FF] text-[#175CD3] border-[#B2DDFF]'
                            }`}
                          >
                            {isPickup ? (
                              <Truck className="w-6 h-6" />
                            ) : (
                              <Building2 className="w-6 h-6" />
                            )}
                          </div>

                          {/* Info Pokok */}
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#F5F5F7] text-[#1D1D1F] border border-[#E8E8ED]">
                                {schedule.jam}
                              </span>
                              <span
                                className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                                  isPickup
                                    ? 'bg-[#EBF4EE] text-[#2E7D4F] border-[#2E7D4F]/25'
                                    : 'bg-[#EFF8FF] text-[#175CD3] border-[#B2DDFF]'
                                }`}
                              >
                                {schedule.metode}
                              </span>
                            </div>

                            <h4 className="text-base font-bold text-[#1D1D1F] mt-1 truncate">
                              {offer.namaBahan}{' '}
                              <span className="text-[#2E7D4F] font-semibold">
                                · {offer.jumlahKg} kg
                              </span>
                            </h4>

                            <p className="text-xs text-[#6E6E73] flex items-center gap-1.5 mt-0.5">
                              <MapPin className="w-3.5 h-3.5 shrink-0 text-[#6E6E73]" />
                              <span className="truncate">
                                {offer.lokasiPengambilan.alamat},{' '}
                                {offer.lokasiPengambilan.kota}
                              </span>
                            </p>
                          </div>
                        </div>

                        {/* Kolom Kanan: Petugas + Aksi */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-[#E8E8ED]/70 shrink-0">
                          {/* Info Petugas */}
                          <div className="text-left sm:text-right pr-2">
                            <p className="text-[11px] text-[#6E6E73]">Petugas Lapangan:</p>
                            <p className="text-xs font-bold text-[#1D1D1F]">
                              {schedule.petugas.nama}
                            </p>
                            <p className="text-[11px] font-mono text-[#6E6E73]">
                              {schedule.petugas.noHp}
                            </p>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-2">
                            {/* Tombol Hubungi Petugas WhatsApp */}
                            <a
                              href={`https://wa.me/${waNumber}?text=Halo%20${encodeURIComponent(
                                schedule.petugas.nama
                              )},%20saya%20Pak%20Asep%20(Kelompok%20Tani%20Sukamaju)%20terkait%20penjemputan%20${encodeURIComponent(
                                offer.namaBahan
                              )}%20(${offer.id}).`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-[#EBF4EE] hover:bg-[#2E7D4F] text-[#2E7D4F] hover:text-white transition-colors text-xs font-semibold border border-[#2E7D4F]/30 cursor-pointer shadow-xs"
                            >
                              <Phone className="w-3.5 h-3.5" />
                              <span>Hubungi Petugas</span>
                            </a>

                            {/* Link Lihat Penawaran */}
                            <Link
                              to={`/supplier/penawaran/${offer.id}`}
                              className="inline-flex items-center gap-1 px-3.5 py-2 rounded-full bg-[#F5F5F7] hover:bg-[#E8E8ED] text-[#1D1D1F] transition-colors text-xs font-semibold border border-[#E8E8ED] cursor-pointer"
                            >
                              <span>Lihat Penawaran</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
