import React from 'react';
import { useLocation } from 'react-router-dom';

export const WhatsAppButton: React.FC = () => {
  const location = useLocation();

  // Bila di halaman keranjang di layar HP, ada sticky checkout bar di bawah (~h-20)
  const isCartPage = location.pathname === '/keranjang';

  const defaultMessage = 'Halo Ugly2Yummy, saya mau tanya tentang produknya.';
  const whatsappUrl = `https://wa.me/6281234567890?text=${encodeURIComponent(defaultMessage)}`;

  return (
    <aside aria-label="Bantuan Pelanggan">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Tanya via WhatsApp"
        className={`fixed z-40 right-4 sm:right-6 transition-all duration-300 ease-out flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20BD5A] text-white shadow-[0_8px_24px_rgba(37,211,102,0.35)] hover:shadow-[0_12px_28px_rgba(37,211,102,0.45)] hover:scale-105 active:scale-95 group rounded-full ${
          isCartPage ? 'bottom-24 lg:bottom-6 p-3 sm:px-4 sm:py-3' : 'bottom-6 p-3 sm:px-4 sm:py-3'
        }`}
      >
        {/* WhatsApp Icon */}
        <svg
          className="w-6 h-6 shrink-0 fill-current"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12.04 2c-5.52 0-10 4.48-10 10 0 1.77.46 3.48 1.34 5L2 22l5.18-1.36a9.98 9.98 0 0 0 4.86 1.25h.01c5.52 0 10-4.48 10-10 0-5.52-4.48-10-10-10zm5.83 14.28c-.24.68-1.4 1.34-1.94 1.42-.51.08-1.17.11-1.9-.12-.44-.14-1.01-.33-1.74-.65-3.08-1.34-5.09-4.44-5.24-4.65-.16-.21-1.25-1.66-1.25-3.17 0-1.51.79-2.25 1.07-2.56.28-.31.62-.39.83-.39.21 0 .42 0 .6.01.19.01.45-.07.7.54.26.62.88 2.14.96 2.3.08.16.13.35.03.56-.1.21-.16.33-.31.51-.16.18-.33.4-.47.54-.16.16-.33.33-.14.65.19.33.84 1.38 1.8 2.24 1.24 1.1 2.28 1.44 2.61 1.6.33.16.52.14.71-.08.2-.22.84-.98 1.07-1.32.22-.34.45-.28.75-.17.31.11 1.95.92 2.29 1.09.33.17.56.25.64.39.08.14.08.82-.16 1.5z" />
        </svg>

        {/* Label teks: di HP cukup ikon, di tablet & desktop muncul teks */}
        <span className="hidden sm:inline text-xs sm:text-sm font-semibold tracking-wide pr-1">
          Tanya via WhatsApp
        </span>
      </a>
    </aside>
  );
};
