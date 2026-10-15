import React from 'react';
import { Star } from 'lucide-react';
import { AdminPlaceholderView } from '../../../components/internal/AdminPlaceholderView';

export const AdminReviewsPage: React.FC = () => {
  return (
    <AdminPlaceholderView
      title="Ulasan & Testimoni Pembeli"
      description="Kelola dan tanggapi ulasan produk dari para pembeli, pantau rating kepuasan rasa olahan makanan dan keutuhan paket saat diterima."
      icon={Star}
      features={[
        'Daftar rating bintang dan ulasan komentar pembeli',
        'Tanggapi ulasan secara publik dengan akun resmi Ugly2Yummy',
        'Filter ulasan berdasarkan varian produk olahan',
      ]}
    />
  );
};
