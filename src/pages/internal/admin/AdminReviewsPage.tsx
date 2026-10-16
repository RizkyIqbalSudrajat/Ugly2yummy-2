import React, { useState, useMemo } from 'react';
import { useAdminData } from '../../../context/AdminDataContext';
import { AdminReview } from '../../../types/admin';
import {
  Star,
  MessageSquare,
  Eye,
  EyeOff,
  Filter,
  Search,
  CheckCircle2,
  Send,
  CornerDownRight,
  ShieldCheck,
  User,
} from 'lucide-react';

export const AdminReviewsPage: React.FC = () => {
  const { reviews, replyToReview, toggleReviewVisibility, addNotification } = useAdminData();

  const [ratingFilter, setRatingFilter] = useState<'Semua' | number>('Semua');
  const [productFilter, setProductFilter] = useState<string>('Semua');
  const [statusFilter, setStatusFilter] = useState<'Semua' | 'Tampil' | 'Disembunyikan'>('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  // Balas state
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Unique Products from reviews
  const productOptions = useMemo(() => {
    const setProds = new Set<string>();
    reviews.forEach((r) => setProds.add(r.namaProduk));
    return ['Semua', ...Array.from(setProds)];
  }, [reviews]);

  // Ringkasan Distribusi & Rata-rata
  const summary = useMemo(() => {
    const total = reviews.length;
    if (total === 0) return { avg: 5, total: 0, dist: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } };

    const sum = reviews.reduce((s, r) => s + r.rating, 0);
    const avg = Number((sum / total).toFixed(1));

    const dist: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      dist[r.rating] = (dist[r.rating] || 0) + 1;
    });

    return { avg, total, dist };
  }, [reviews]);

  // Filtered reviews
  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      if (ratingFilter !== 'Semua' && r.rating !== ratingFilter) {
        return false;
      }
      if (productFilter !== 'Semua' && r.namaProduk !== productFilter) {
        return false;
      }
      if (statusFilter !== 'Semua' && r.status !== statusFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchBuyer = r.pembeli.toLowerCase().includes(q);
        const matchText = r.isi.toLowerCase().includes(q);
        const matchProd = r.namaProduk.toLowerCase().includes(q);
        return matchBuyer || matchText || matchProd;
      }
      return true;
    });
  }, [reviews, ratingFilter, productFilter, statusFilter, searchQuery]);

  // Handle Kirim Balasan
  const handleSendReply = (reviewId: string) => {
    if (!replyText.trim()) return;
    replyToReview(reviewId, replyText.trim());

    addNotification({
      tipe: 'Ulasan',
      judul: 'Balasan Ulasan Dikirim',
      isi: `Admin menanggapi ulasan dari pembeli.`,
      linkTujuan: '/internal/admin/ulasan',
    });

    showToast('Balasan admin berhasil disimpan dan dipublikasikan!');
    setActiveReplyId(null);
    setReplyText('');
  };

  // Handle Toggle Status
  const handleToggle = (r: AdminReview) => {
    toggleReviewVisibility(r.id);
    const nextStatus = r.status === 'Tampil' ? 'Disembunyikan' : 'Tampil';
    showToast(`Ulasan dari ${r.pembeli} sekarang ${nextStatus}.`);
  };

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-200">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#1D1D1F] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in slide-in-from-top duration-300">
          <CheckCircle2 className="w-5 h-5 text-[#2E7D4F]" />
          <p className="text-xs sm:text-sm font-semibold">{toastMessage}</p>
        </div>
      )}

      {/* Header Info */}
      <div className="bg-white rounded-3xl border border-[#E8E8ED] p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 inline-flex items-center gap-1">
              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
              Kepuasan Pelanggan Toko
            </span>
            <span className="text-xs text-[#6E6E73]">
              {reviews.length} Ulasan Masuk
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1D1D1F]">
            Ulasan & Testimoni Pembeli
          </h1>
          <p className="text-xs sm:text-sm text-[#6E6E73] mt-1 max-w-xl">
            Tinjau feedback kepuasan cita rasa olahan pangan, kelola visibilitas ulasan di etalase pembeli, dan berikan respon resmi layanan pelanggan.
          </p>
        </div>
      </div>

      {/* Ringkasan Rating & Distribusi Bintang (Apple Minimalist) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-white rounded-3xl border border-[#E8E8ED] p-5 sm:p-6 shadow-xs items-center">
        {/* Kolom Kiri: Angka Rating Rata-rata */}
        <div className="md:col-span-4 text-center md:text-left border-b md:border-b-0 md:border-r border-[#E8E8ED] pb-4 md:pb-0 md:pr-6 space-y-2">
          <p className="text-xs text-[#6E6E73] font-semibold uppercase tracking-wider">
            Rating Keseluruhan
          </p>
          <div className="flex items-baseline justify-center md:justify-start gap-2">
            <span className="text-4xl sm:text-5xl font-black text-[#1D1D1F]">
              {summary.avg}
            </span>
            <span className="text-sm font-bold text-[#8E8E93]">/ 5.0</span>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-5 h-5 ${
                  star <= Math.round(summary.avg)
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-[#E8E8ED]'
                }`}
              />
            ))}
          </div>

          <p className="text-xs text-[#6E6E73]">
            Berdasarkan <strong>{summary.total} ulasan terverifikasi</strong> dari pembeli Ugly2Yummy.
          </p>
        </div>

        {/* Kolom Kanan: Distribusi Bar 1-5 */}
        <div className="md:col-span-8 space-y-2">
          {[5, 4, 3, 2, 1].map((starNum) => {
            const count = summary.dist[starNum] || 0;
            const pct = summary.total > 0 ? Math.round((count / summary.total) * 100) : 0;

            return (
              <div key={starNum} className="flex items-center gap-3 text-xs">
                <span className="w-14 font-semibold text-[#1D1D1F] flex items-center gap-1 shrink-0">
                  {starNum} Bintang
                </span>

                <div className="flex-1 h-2 rounded-full bg-[#F5F5F7] overflow-hidden">
                  <div
                    style={{ width: `${pct}%` }}
                    className="h-full bg-amber-400 rounded-full transition-all duration-500"
                  />
                </div>

                <span className="w-12 text-right text-[11px] text-[#6E6E73] font-medium shrink-0">
                  {count} ({pct}%)
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Toolbar Filter & Pencarian */}
      <div className="bg-white rounded-3xl border border-[#E8E8ED] p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          {/* Search */}
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 text-[#8E8E93] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama pembeli, teks review, atau produk..."
              className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-[#F5F5F7] border-0 text-[#1D1D1F]"
            />
          </div>

          {/* Filter Produk */}
          <div>
            <select
              value={productFilter}
              onChange={(e) => setProductFilter(e.target.value)}
              className="w-full p-2 rounded-xl bg-[#F5F5F7] border-0 text-[#1D1D1F]"
            >
              {productOptions.map((p) => (
                <option key={p} value={p}>
                  {p === 'Semua' ? 'Semua Produk' : p}
                </option>
              ))}
            </select>
          </div>

          {/* Filter Status */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full p-2 rounded-xl bg-[#F5F5F7] border-0 text-[#1D1D1F]"
            >
              <option value="Semua">Semua Status</option>
              <option value="Tampil">Tampil</option>
              <option value="Disembunyikan">Disembunyikan</option>
            </select>
          </div>
        </div>

        {/* Filter Bintang Quick Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
          <span className="text-[11px] font-semibold text-[#8E8E93] mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" />
            Rating:
          </span>
          {(['Semua', 5, 4, 3, 2, 1] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRatingFilter(r)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
                ratingFilter === r
                  ? 'bg-[#1D1D1F] text-white'
                  : 'bg-[#F5F5F7] text-[#6E6E73] hover:text-[#1D1D1F]'
              }`}
            >
              {r === 'Semua' ? 'Semua Bintang' : `${r} ★`}
            </button>
          ))}
        </div>
      </div>

      {/* Daftar Kartu Ulasan */}
      {filteredReviews.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#E8E8ED] p-12 text-center shadow-xs">
          <Star className="w-10 h-10 text-[#8E8E93] mx-auto mb-3" />
          <h3 className="text-sm font-bold text-[#1D1D1F]">Tidak ada ulasan ditemukan</h3>
          <p className="text-xs text-[#6E6E73] mt-1">
            Belum ada ulasan yang sesuai dengan kriteria penyaringan yang dipilih.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReviews.map((rev) => {
            const isReplying = activeReplyId === rev.id;

            return (
              <div
                key={rev.id}
                className={`bg-white rounded-3xl border p-5 sm:p-6 shadow-xs space-y-3.5 transition-all ${
                  rev.status === 'Disembunyikan'
                    ? 'border-dashed border-red-200 bg-red-50/20'
                    : 'border-[#E8E8ED]'
                }`}
              >
                {/* Header Ulasan */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E8E8ED]/70 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#EBF4EE] text-[#2E7D4F] font-bold flex items-center justify-center text-xs">
                      {rev.pembeli.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#1D1D1F]">{rev.pembeli}</h4>
                      <p className="text-[11px] text-[#6E6E73]">
                        Membeli: <strong className="text-[#1D1D1F]">{rev.namaProduk}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Bintang */}
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-4 h-4 ${
                            s <= rev.rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-[#E8E8ED]'
                          }`}
                        />
                      ))}
                    </div>

                    <span className="text-[11px] text-[#8E8E93]">· {rev.tanggal}</span>

                    {/* Status badge */}
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        rev.status === 'Tampil'
                          ? 'bg-[#EBF4EE] text-[#2E7D4F]'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {rev.status}
                    </span>
                  </div>
                </div>

                {/* Isi Komentar */}
                <p className="text-xs sm:text-sm text-[#1D1D1F] leading-relaxed">
                  "{rev.isi}"
                </p>

                {/* Balasan Admin yang sudah ada */}
                {rev.balasanAdmin && (
                  <div className="p-3.5 rounded-2xl bg-[#F5FBF7] border border-[#2E7D4F]/20 space-y-1 text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-[#2E7D4F]">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Tanggapan Resmi Tim Ugly2Yummy:</span>
                    </div>
                    <p className="text-[#1D1D1F] leading-relaxed pl-5">
                      {rev.balasanAdmin}
                    </p>
                  </div>
                )}

                {/* Form Input Balasan (Jika dibuka) */}
                {isReplying && (
                  <div className="p-3.5 rounded-2xl bg-[#F5F5F7] border border-[#E8E8ED] space-y-2 text-xs">
                    <label className="block font-semibold text-[#1D1D1F]">
                      Tulis Balasan Admin:
                    </label>
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Terima kasih atas ulasannya! Kami senang bahan olahan..."
                      rows={2}
                      className="w-full p-2.5 rounded-xl bg-white border border-[#E8E8ED] text-[#1D1D1F]"
                    />
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveReplyId(null);
                          setReplyText('');
                        }}
                        className="px-3 py-1.5 rounded-full bg-white border border-[#E8E8ED] text-[#6E6E73] hover:text-[#1D1D1F]"
                      >
                        Batal
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSendReply(rev.id)}
                        className="px-4 py-1.5 rounded-full bg-[#2E7D4F] text-white font-semibold hover:bg-[#256640] shadow-xs cursor-pointer inline-flex items-center gap-1.5"
                      >
                        <Send className="w-3 h-3" />
                        <span>Kirim Balasan</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="pt-2 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    {!isReplying && (
                      <button
                        type="button"
                        onClick={() => {
                          setActiveReplyId(rev.id);
                          setReplyText(rev.balasanAdmin || '');
                        }}
                        className="px-3 py-1.5 rounded-full bg-[#F5F5F7] text-[#1D1D1F] font-semibold hover:bg-[#E8E8ED] transition-colors cursor-pointer inline-flex items-center gap-1.5"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-[#6E6E73]" />
                        <span>{rev.balasanAdmin ? 'Edit Balasan' : 'Balas Ulasan'}</span>
                      </button>
                    )}
                  </div>

                  {/* Toggle Visibility */}
                  <button
                    type="button"
                    onClick={() => handleToggle(rev)}
                    className={`px-3 py-1.5 rounded-full font-semibold transition-colors cursor-pointer inline-flex items-center gap-1.5 ${
                      rev.status === 'Tampil'
                        ? 'text-[#6E6E73] hover:text-red-600 hover:bg-red-50'
                        : 'text-[#2E7D4F] hover:bg-[#EBF4EE]'
                    }`}
                  >
                    {rev.status === 'Tampil' ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>Sembunyikan</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        <span>Tampilkan ke Publik</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
