import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../ui/Container';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#F5F5F7] border-t border-[#E8E8ED] mt-20 pt-16 pb-12 text-[#6E6E73]">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 pb-12 border-b border-[#E8E8ED]">
          {/* Brand Col */}
          <div className="md:col-span-5 space-y-4">
            <Link
              to="/"
              className="text-2xl font-bold tracking-tight text-[#1D1D1F] inline-flex items-center gap-0.5"
            >
              <span>Ugly</span>
              <span className="text-[#2E7D4F] font-extrabold">2</span>
              <span>Yummy</span>
            </Link>

            <p className="text-base text-[#1D1D1F] font-medium leading-relaxed max-w-sm">
              &ldquo;Tak sempurna di mata, sempurna di rasa.&rdquo;
            </p>

            <p className="text-xs leading-relaxed max-w-sm text-[#6E6E73]">
              Brand upcycled food yang menyelamatkan buah dan sayur berkualitas yang kerap
              disingkirkan hanya karena standar visual, menjadi sajian artisan lezat dan bernutrisi.
            </p>
          </div>

          {/* Nav links col 1 */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#1D1D1F]">
              Jelajahi
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/produk" className="hover:text-[#2E7D4F] transition-colors">
                  Semua Produk
                </Link>
              </li>
              <li>
                <Link to="/cerita-bahan" className="hover:text-[#2E7D4F] transition-colors">
                  Cerita Bahan & Petani
                </Link>
              </li>
              <li>
                <Link to="/beranda" className="hover:text-[#2E7D4F] transition-colors">
                  Area Pembeli
                </Link>
              </li>
              <li>
                <Link to="/dampak-saya" className="hover:text-[#2E7D4F] transition-colors">
                  Kalkulator Dampak
                </Link>
              </li>
            </ul>
          </div>

          {/* Social & Contact */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#1D1D1F]">
              Terhubung Dengan Kami
            </h4>
            <p className="text-xs text-[#6E6E73] leading-relaxed">
              Dukung gerakan penyelamatan pangan lokal di Indonesia dari dapur rumah Anda.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer noopener"
                className="w-9 h-9 rounded-full bg-white border border-[#E8E8ED] flex items-center justify-center text-[#1D1D1F] hover:text-[#2E7D4F] hover:border-[#2E7D4F]/30 transition-colors text-xs font-semibold"
                aria-label="Instagram"
              >
                IG
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noreferrer noopener"
                className="w-9 h-9 rounded-full bg-white border border-[#E8E8ED] flex items-center justify-center text-[#1D1D1F] hover:text-[#2E7D4F] hover:border-[#2E7D4F]/30 transition-colors text-xs font-semibold"
                aria-label="TikTok"
              >
                TT
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer noopener"
                className="w-9 h-9 rounded-full bg-white border border-[#E8E8ED] flex items-center justify-center text-[#1D1D1F] hover:text-[#2E7D4F] hover:border-[#2E7D4F]/30 transition-colors text-xs font-semibold"
                aria-label="YouTube"
              >
                YT
              </a>
              <a
                href="https://wa.me/6281234567890?text=Halo%20Ugly2Yummy%2C%20saya%20mau%20tanya%20tentang%20produknya."
                target="_blank"
                rel="noreferrer noopener"
                className="w-9 h-9 rounded-full bg-white border border-[#E8E8ED] flex items-center justify-center text-[#1D1D1F] hover:text-[#2E7D4F] hover:border-[#2E7D4F]/30 transition-colors text-xs font-semibold"
                aria-label="WhatsApp"
              >
                WA
              </a>
            </div>
            <div className="pt-2 text-xs text-[#6E6E73]">
              Layanan Pembeli: halo@ugly2yummy.id
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6E6E73]">
          <p>© 2026 Ugly2Yummy. Tak sempurna di mata, sempurna di rasa.</p>
          <div className="flex items-center gap-6">
            <span>Standar Pangan Bersih</span>
            <span>·</span>
            <span>Petani Lokal Berdaya</span>
            <span>·</span>
            <span>Bebas Sampah Pangan</span>
          </div>
        </div>
      </Container>
    </footer>
  );
};
