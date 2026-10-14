import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';
import {
  Sparkles,
  Leaf,
  HeartHandshake,
  Package,
  ArrowRight,
  ShieldCheck,
  Award,
} from 'lucide-react';

export const MyImpactPage: React.FC = () => {
  const { user } = useAuth();
  const userName = user ? user.nama : 'Nadia Putri';
  const totalSaved = user ? user.dampak.totalKgTerselamatkan : 3.2;

  const impactBreakdown = [
    { name: 'Tomat Bengkok', emoji: '🍅', origin: 'Lembang', saved: 1.0 },
    { name: 'Stroberi Penyok', emoji: '🍓', origin: 'Ciwidey', saved: 0.8 },
    { name: 'Pisang Berbintik', emoji: '🍌', origin: 'Lampung', saved: 0.6 },
    { name: 'Mangga Mungil', emoji: '🥭', origin: 'Indramayu', saved: 0.5 },
    { name: 'Wortel Bercabang', emoji: '🥕', origin: 'Wonosobo', saved: 0.3 },
  ];

  return (
    <div className="py-12 sm:py-20 md:py-24 space-y-16">
      <Container>
        {/* Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#2E7D4F] block mb-2">
            Transparansi Dampak Pribadi
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#1D1D1F]">
            Dampak Saya
          </h1>
          <p className="mt-3 text-base sm:text-lg text-[#6E6E73] leading-relaxed">
            Terima kasih, {userName}. Setiap sajian lezat yang Anda nikmati merupakan suara nyata
            untuk mengurangi limbah pangan dan mendukung kemakmuran petani lokal.
          </p>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {/* Stat 1 */}
          <div className="bg-[#EBF4EE] rounded-3xl border border-[#2E7D4F]/20 p-7 sm:p-8 flex flex-col justify-between shadow-none">
            <div className="w-12 h-12 rounded-2xl bg-white text-[#2E7D4F] flex items-center justify-center mb-6 shadow-none">
              <Sparkles className="w-6 h-6 stroke-[1.7]" />
            </div>
            <div>
              <div className="text-4xl sm:text-5xl font-extrabold text-[#2E7D4F] tabular-nums tracking-tight">
                {totalSaved.toLocaleString('id-ID')}
                <span className="text-xl sm:text-2xl font-bold ml-1 text-[#2E7D4F]">kg</span>
              </div>
              <h3 className="text-base font-bold text-[#1D1D1F] mt-2">
                Pangan Terselamatkan
              </h3>
              <p className="text-xs text-[#6E6E73] mt-1">
                Buah & sayur unik yang diolah lezat
              </p>
            </div>
          </div>

          {/* Stat 2 */}
          <div className="bg-white rounded-3xl border border-[#E8E8ED] p-7 sm:p-8 flex flex-col justify-between shadow-none">
            <div className="w-12 h-12 rounded-2xl bg-[#FBFBFD] text-[#1D1D1F] flex items-center justify-center mb-6 border border-[#E8E8ED]">
              <HeartHandshake className="w-6 h-6 stroke-[1.7]" />
            </div>
            <div>
              <div className="text-4xl sm:text-5xl font-extrabold text-[#1D1D1F] tabular-nums tracking-tight">
                5
              </div>
              <h3 className="text-base font-bold text-[#1D1D1F] mt-2">
                Petani Didukung
              </h3>
              <p className="text-xs text-[#6E6E73] mt-1">
                Keluarga tani di Lembang, Ciwidey, Wonosobo, dll.
              </p>
            </div>
          </div>

          {/* Stat 3 */}
          <div className="bg-white rounded-3xl border border-[#E8E8ED] p-7 sm:p-8 flex flex-col justify-between shadow-none">
            <div className="w-12 h-12 rounded-2xl bg-[#FBFBFD] text-[#1D1D1F] flex items-center justify-center mb-6 border border-[#E8E8ED]">
              <Leaf className="w-6 h-6 stroke-[1.7]" />
            </div>
            <div>
              <div className="text-4xl sm:text-5xl font-extrabold text-[#1D1D1F] tabular-nums tracking-tight">
                ±8,0
                <span className="text-xl sm:text-2xl font-bold ml-1 text-[#6E6E73]">kg</span>
              </div>
              <h3 className="text-base font-bold text-[#1D1D1F] mt-2">
                CO₂e Dicegah
              </h3>
              <p className="text-xs text-[#6E6E73] mt-1">
                Mencegah pembusukan gas metana di lahan
              </p>
            </div>
          </div>

          {/* Stat 4 */}
          <div className="bg-white rounded-3xl border border-[#E8E8ED] p-7 sm:p-8 flex flex-col justify-between shadow-none">
            <div className="w-12 h-12 rounded-2xl bg-[#FBFBFD] text-[#1D1D1F] flex items-center justify-center mb-6 border border-[#E8E8ED]">
              <Package className="w-6 h-6 stroke-[1.7]" />
            </div>
            <div>
              <div className="text-4xl sm:text-5xl font-extrabold text-[#1D1D1F] tabular-nums tracking-tight">
                4
              </div>
              <h3 className="text-base font-bold text-[#1D1D1F] mt-2">
                Pesanan Berkelanjutan
              </h3>
              <p className="text-xs text-[#6E6E73] mt-1">
                Kemasan ramah lingkungan zero-plastic
              </p>
            </div>
          </div>
        </div>

        {/* Rincian Komoditas yang Diselamatkan */}
        <div className="bg-white rounded-3xl border border-[#E8E8ED] p-8 sm:p-10 shadow-none mb-16">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#2E7D4F] block mb-1">
              Rincian Bahan
            </span>
            <h2 className="text-2xl font-bold text-[#1D1D1F] tracking-tight">
              Komoditas yang Telah Anda Selamatkan
            </h2>
            <p className="text-xs sm:text-sm text-[#6E6E73] mt-1">
              Setiap gram pangan tercatat secara transparan langsung dari riwayat pesanan Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {impactBreakdown.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-[#FBFBFD] border border-[#E8E8ED] flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{item.emoji}</span>
                  <div>
                    <span className="text-xs font-bold text-[#1D1D1F] block">{item.name}</span>
                    <span className="text-[11px] text-[#6E6E73]">{item.origin}</span>
                  </div>
                </div>

                <span className="text-sm font-extrabold text-[#2E7D4F] tabular-nums">
                  {item.saved.toLocaleString('id-ID')} kg
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Eco Statement & Action */}
        <div className="bg-[#F5F5F7] rounded-3xl border border-[#E8E8ED] p-8 sm:p-12 text-center max-w-2xl mx-auto space-y-6">
          <div className="w-14 h-14 rounded-full bg-[#EBF4EE] text-[#2E7D4F] flex items-center justify-center mx-auto">
            <Award className="w-7 h-7" />
          </div>

          <h3 className="font-['Instrument_Serif'] italic text-2xl sm:text-3xl text-[#1D1D1F]">
            &ldquo;Makanan tidak dinilai dari rupa luarnya, melainkan dari kebaikan rasa dan
            manfaat yang dihadirkannya bagi bumi.&rdquo;
          </h3>

          <p className="text-xs sm:text-sm text-[#6E6E73] max-w-md mx-auto">
            Bersama Ugly2Yummy, mari terus selamatkan lebih banyak buah dan sayur di panen
            mendatang.
          </p>

          <div className="pt-2">
            <Button
              to="/produk"
              variant="primary"
              size="lg"
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
            >
              Belanja Produk Baru
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
};
