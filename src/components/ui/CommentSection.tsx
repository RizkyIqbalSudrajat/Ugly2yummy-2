import React, { useState } from 'react';
import { Star, MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import { Button } from './Button';

export interface CommentItem {
  id: string;
  nama: string;
  inisial: string;
  tanggal: string;
  rating?: number;
  isi: string;
  badge?: string;
}

export interface CommentSectionProps {
  title?: string;
  subtitle?: string;
  initialComments: CommentItem[];
  allowRating?: boolean;
  ratingSummary?: {
    rating: number;
    totalCount: number;
  };
  placeholderText?: string;
  className?: string;
}

export const CommentSection: React.FC<CommentSectionProps> = ({
  title = 'Ulasan & Diskusi',
  subtitle,
  initialComments,
  allowRating = false,
  ratingSummary,
  placeholderText = 'Tulis ulasan atau tanggapan Anda di sini...',
  className = '',
}) => {
  const [comments, setComments] = useState<CommentItem[]>(initialComments);
  const [nama, setNama] = useState('');
  const [isi, setIsi] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [submitted, setSubmitted] = useState(false);

  const getInitials = (fullName: string) => {
    if (!fullName) return 'U';
    const parts = fullName.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return fullName.slice(0, 2).toUpperCase();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim() || !isi.trim()) return;

    const newComment: CommentItem = {
      id: `comment-${Date.now()}`,
      nama: nama.trim(),
      inisial: getInitials(nama),
      tanggal: 'Baru saja',
      rating: allowRating ? rating : undefined,
      isi: isi.trim(),
      badge: 'Ulasan Baru',
    };

    setComments([newComment, ...comments]);
    setNama('');
    setIsi('');
    if (allowRating) setRating(5);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3500);
  };

  return (
    <section className={`space-y-8 ${className}`}>
      {/* Header & Rating Summary */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#E8E8ED]">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#2E7D4F] block mb-1">
            Ulasan Komunitas
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1D1D1F]">
            {title}
          </h2>
          {subtitle && <p className="mt-1 text-sm text-[#6E6E73]">{subtitle}</p>}
        </div>

        {ratingSummary && (
          <div className="flex items-center gap-3 bg-white border border-[#E8E8ED] px-4 py-2.5 rounded-2xl shadow-none">
            <div className="flex items-center gap-1 text-[#F59E0B]">
              <Star className="w-5 h-5 fill-current" />
              <span className="text-lg font-bold text-[#1D1D1F] tabular-nums">
                {ratingSummary.rating.toFixed(1)}
              </span>
            </div>
            <div className="h-4 w-px bg-[#E8E8ED]" />
            <span className="text-xs font-medium text-[#6E6E73]">
              {ratingSummary.totalCount} ulasan terverifikasi
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Kolom Kiri: Form Tambah Komentar / Ulasan */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-[#E8E8ED] p-6 sm:p-7 shadow-none">
          <h3 className="text-base font-bold text-[#1D1D1F] mb-1 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#2E7D4F]" />
            <span>{allowRating ? 'Tulis Ulasan Produk' : 'Tinggalkan Komentar'}</span>
          </h3>
          <p className="text-xs text-[#6E6E73] mb-5">
            {allowRating
              ? 'Bagikan kesan rasa dan pengalaman belanja Anda kepada calon pembeli lain.'
              : 'Berikan apresiasi atau pertanyaan seputar bahan dan para petani mitra kami.'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {allowRating && (
              <div>
                <label className="block text-xs font-semibold text-[#1D1D1F] mb-1.5">
                  Beri Bintang:
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 text-[#F59E0B] transition-transform hover:scale-110 cursor-pointer focus:outline-hidden"
                      aria-label={`${star} bintang`}
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= (hoverRating || rating)
                            ? 'fill-[#F59E0B] text-[#F59E0B]'
                            : 'text-[#D1D1D6]'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-medium text-[#6E6E73] ml-2">
                    {hoverRating || rating} / 5
                  </span>
                </div>
              </div>
            )}

            <div>
              <label
                htmlFor="comment-author-name"
                className="block text-xs font-semibold text-[#1D1D1F] mb-1.5"
              >
                Nama Anda
              </label>
              <input
                id="comment-author-name"
                type="text"
                required
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Contoh: Sarah Aulia"
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-[#F5F5F7] border border-transparent rounded-xl focus:border-[#2E7D4F] focus:bg-white focus:outline-hidden transition-all text-[#1D1D1F]"
              />
            </div>

            <div>
              <label
                htmlFor="comment-body-text"
                className="block text-xs font-semibold text-[#1D1D1F] mb-1.5"
              >
                {allowRating ? 'Isi Ulasan' : 'Pesan / Komentar'}
              </label>
              <textarea
                id="comment-body-text"
                required
                rows={4}
                value={isi}
                onChange={(e) => setIsi(e.target.value)}
                placeholder={placeholderText}
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-[#F5F5F7] border border-transparent rounded-xl focus:border-[#2E7D4F] focus:bg-white focus:outline-hidden transition-all text-[#1D1D1F] resize-none"
              />
            </div>

            {submitted && (
              <div className="flex items-center gap-2 text-xs font-medium text-[#2E7D4F] bg-[#EBF4EE] p-2.5 rounded-xl">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Terima kasih! Tanggapan Anda telah ditambahkan.</span>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full justify-center text-xs sm:text-sm"
              icon={<Send className="w-3.5 h-3.5" />}
            >
              {allowRating ? 'Kirim Ulasan' : 'Kirim Komentar'}
            </Button>
          </form>
        </div>

        {/* Kolom Kanan: Daftar Komentar / Ulasan */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between text-xs text-[#6E6E73] px-1">
            <span className="font-semibold text-[#1D1D1F]">
              Semua Ulasan ({comments.length})
            </span>
            <span>Diurutkan berdasarkan terbaru</span>
          </div>

          <div className="space-y-3.5">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="bg-white rounded-2xl border border-[#E8E8ED] p-5 shadow-none space-y-2.5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#EBF4EE] text-[#2E7D4F] font-bold text-xs flex items-center justify-center shrink-0 border border-[#2E7D4F]/20">
                      {comment.inisial}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-[#1D1D1F]">
                          {comment.nama}
                        </span>
                        {comment.badge && (
                          <span className="text-[10px] font-semibold text-[#2E7D4F] bg-[#EBF4EE] px-2 py-0.5 rounded-full">
                            {comment.badge}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-[#8E8E93] block">
                        {comment.tanggal}
                      </span>
                    </div>
                  </div>

                  {comment.rating !== undefined && (
                    <div className="flex items-center gap-0.5 text-[#F59E0B]">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3.5 h-3.5 ${
                            star <= (comment.rating || 0)
                              ? 'fill-current'
                              : 'text-[#D1D1D6]'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-[#3A3A3C] leading-relaxed pl-12">
                  {comment.isi}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
