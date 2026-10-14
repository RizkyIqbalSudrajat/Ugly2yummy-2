import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { INGREDIENTS, PRODUCTS } from '../data/dummy';
import { Container } from '../components/ui/Container';
import { SmartImage } from '../components/ui/SmartImage';
import {
  ArrowLeft,
  MapPin,
  User,
  Calendar,
  Sparkles,
  Quote,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sprout,
  Sun,
  XCircle,
  HeartHandshake,
  ChefHat,
} from 'lucide-react';
import { CommentSection, CommentItem } from '../components/ui/CommentSection';

export const IngredientDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const ingredient =
    INGREDIENTS.find((i) => i.id === id) || INGREDIENTS[0];

  // Find products made with this ingredient
  const relatedProducts = PRODUCTS.filter((p) =>
    ingredient.produkOlahIds.includes(p.id)
  );

  const formattedSaved = ingredient.totalKgTerselamatkan.toLocaleString('id-ID');

  const timelineSteps = [
    {
      no: '1',
      title: 'Ditanam',
      icon: Sprout,
      desc: `Dirawat dengan dedikasi oleh ${ingredient.petani} di tanah alami tanpa rekayasa bentuk.`,
    },
    {
      no: '2',
      title: 'Dipanen',
      icon: Sun,
      desc: 'Dipetik saat kematangan nutrisi dan aroma alami berada di puncak rasa terbaiknya.',
    },
    {
      no: '3',
      title: 'Ditolak Pasar',
      icon: XCircle,
      desc: 'Ditolak distributor ritel konvensional hanya karena ukuran atau lekukan tidak simetris.',
    },
    {
      no: '4',
      title: 'Diselamatkan',
      icon: HeartHandshake,
      desc: 'Ugly2Yummy membeli hasil panen ini dengan harga adil langsung dari tangan petani.',
    },
    {
      no: '5',
      title: 'Diolah',
      icon: ChefHat,
      desc: 'Diolah bersih di dapur artisan menjadi hidangan bergizi tinggi untuk keluarga Anda.',
    },
  ];

  const ingredientComments: CommentItem[] = [
    {
      id: 'ing-c1',
      nama: 'Rizka Handayani',
      inisial: 'RH',
      tanggal: '4 hari lalu',
      isi: `Sangat menginspirasi membaca kisah ${ingredient.petani}. Selama ini sering mendengar istilah food waste, baru sadar dampaknya nyata sekali bagi petani lokal kita.`,
      badge: 'Sahabat Petani',
    },
    {
      id: 'ing-c2',
      nama: 'Hendra Wijaya',
      inisial: 'HW',
      tanggal: '1 minggu lalu',
      isi: `Tanah di daerah ${ingredient.asal.split(',')[0]} memang istimewa. Senang sekali ada brand yang menghargai cita rasa buah apa adanya tanpa diskriminasi visual.`,
      badge: 'Warga Komunitas',
    },
    {
      id: 'ing-c3',
      nama: 'Dewi Lestari',
      inisial: 'DL',
      tanggal: '2 minggu lalu',
      isi: `Rasa produk olahannya terbukti jauh lebih manis dan beraroma. Sukses terus untuk para petani mitra di ${ingredient.asal.split(',')[0]}!`,
    },
  ];

  return (
    <article className="py-10 sm:py-16 md:py-20 space-y-16 sm:space-y-24">
      {/* =========================================================================
          1. HERO FOTO LEBAR DENGAN JUDUL
          ========================================================================= */}
      <section>
        <Container>
          {/* Back Navigation Link */}
          <div className="mb-6 sm:mb-8">
            <Link
              to="/cerita-bahan"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6E6E73] hover:text-[#2E7D4F] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Semua Cerita Bahan</span>
            </Link>
          </div>

          {/* Hero Banner Container */}
          <div className="relative rounded-3xl sm:rounded-[36px] overflow-hidden bg-[#1D1D1F] border border-white/10 shadow-xs min-h-[380px] sm:min-h-[480px] lg:min-h-[540px] flex flex-col justify-end p-6 sm:p-12 lg:p-16">
            {/* Background Image with Scrim */}
            <div className="absolute inset-0 z-0">
              <SmartImage
                src={ingredient.gambar}
                alt={ingredient.altText || ingredient.nama}
                fallbackEmoji={ingredient.emoji}
                aspectRatio="16:9"
                containerClassName="w-full h-full"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/25" />
            </div>

            {/* Hero Title & Location */}
            <div className="relative z-10 max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-semibold border border-white/25">
                <span className="text-sm">{ingredient.emoji}</span>
                <span>Kisah Bahan Asli Nusantara</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1] text-balance">
                {ingredient.nama} dari {ingredient.asal.split(',')[0]}
              </h1>

              <p className="text-base sm:text-lg text-white/80 max-w-xl leading-relaxed">
                Di balik bentuk yang dianggap tidak sempurna, ada dedikasi petani lokal dan cita
                rasa alami terbaik.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* =========================================================================
          2. BARIS FAKTA SINGKAT
          Asal, Petani, Musim Panen, Total Terselamatkan
          ========================================================================= */}
      <section>
        <Container>
          <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-[#E8E8ED] p-6 sm:p-8 shadow-none">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-5 md:divide-x md:divide-[#E8E8ED]">
              {/* Asal */}
              <div className="md:first:pl-0 md:px-4 space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#6E6E73] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#2E7D4F]" />
                  Asal Daerah
                </span>
                <p className="text-sm sm:text-base font-bold text-[#1D1D1F]">
                  {ingredient.asal}
                </p>
              </div>

              {/* Petani */}
              <div className="md:px-4 space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#6E6E73] flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#2E7D4F]" />
                  Petani Mitra
                </span>
                <p className="text-sm sm:text-base font-bold text-[#1D1D1F]">
                  {ingredient.petani}
                </p>
              </div>

              {/* Musim Panen */}
              <div className="md:px-4 space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#6E6E73] flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#2E7D4F]" />
                  Musim Panen
                </span>
                <p className="text-sm sm:text-base font-bold text-[#1D1D1F]">
                  {ingredient.musimPanen || 'Sepanjang Tahun'}
                </p>
              </div>

              {/* Total Terselamatkan */}
              <div className="md:px-4 space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#6E6E73] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#2E7D4F]" />
                  Terselamatkan
                </span>
                <p className="text-sm sm:text-base font-bold text-[#2E7D4F] tabular-nums">
                  {formattedSaved} kg
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* =========================================================================
          3. TIMELINE 5 TAHAP PROSES: Ditanam -> Dipanen -> Ditolak -> Diselamatkan -> Diolah
          (Desktop Horizontal, Mobile Vertikal)
          ========================================================================= */}
      <section>
        <Container>
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#2E7D4F] block">
                Perjalanan Dari Ladang Ke Meja
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1D1D1F]">
                Asal Bahan & Proses Bertani
              </h2>
              <p className="text-xs sm:text-sm text-[#6E6E73]">
                Setiap kilogram bahan melewati 5 tahap transparan sebelum tiba di dapur rumah Anda.
              </p>
            </div>

            {/* Desktop Horizontal (md:grid-cols-5) & Mobile Vertical (flex-col) */}
            <div className="hidden md:grid md:grid-cols-5 gap-4 relative">
              {/* Garis penghubung horizontal desktop */}
              <div className="absolute top-8 left-8 right-8 h-0.5 bg-[#E8E8ED] -z-0" />

              {timelineSteps.map((step, idx) => {
                const IconComponent = step.icon;
                return (
                  <div
                    key={idx}
                    className="relative z-10 flex flex-col items-center text-center p-4 bg-white rounded-2xl border border-[#E8E8ED] shadow-none hover:border-[#2E7D4F]/30 transition-all duration-300"
                  >
                    <div className="w-12 h-12 rounded-full bg-[#EBF4EE] text-[#2E7D4F] flex items-center justify-center mb-3.5 border-2 border-white shadow-xs">
                      <IconComponent className="w-5 h-5 stroke-[1.8]" />
                    </div>
                    <span className="text-[10px] font-bold text-[#2E7D4F] uppercase tracking-wider mb-1">
                      Tahap {step.no}
                    </span>
                    <h4 className="text-sm font-bold text-[#1D1D1F] mb-1.5">
                      {step.title}
                    </h4>
                    <p className="text-xs text-[#6E6E73] leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Mobile Vertical Timeline */}
            <div className="md:hidden space-y-4 relative pl-4 border-l-2 border-[#2E7D4F]/30 ml-3">
              {timelineSteps.map((step, idx) => {
                const IconComponent = step.icon;
                return (
                  <div
                    key={idx}
                    className="relative bg-white rounded-2xl border border-[#E8E8ED] p-4 shadow-none flex items-start gap-3.5"
                  >
                    {/* Dot on line */}
                    <div className="absolute -left-[23px] top-5 w-3 h-3 rounded-full bg-[#2E7D4F] border-2 border-white" />

                    <div className="w-10 h-10 rounded-xl bg-[#EBF4EE] text-[#2E7D4F] flex items-center justify-center shrink-0">
                      <IconComponent className="w-5 h-5 stroke-[1.8]" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] font-bold text-[#2E7D4F] uppercase tracking-wider">
                          Tahap {step.no}
                        </span>
                        <span className="text-xs font-bold text-[#1D1D1F]">
                          {step.title}
                        </span>
                      </div>
                      <p className="text-xs text-[#6E6E73] leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Container>
      </section>

      {/* =========================================================================
          4. KARTU PROFIL PETANI MITRA
          Foto, Nama, Daerah, Lama Bertani, Cara Tanam Singkat, & Kutipan
          ========================================================================= */}
      {ingredient.profilPetani && (
        <section>
          <Container size="narrow">
            <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-[#E8E8ED] p-7 sm:p-10 shadow-none">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-[#F5F5F7] shrink-0 border-2 border-[#2E7D4F]/20 shadow-xs">
                  <img
                    src={ingredient.profilPetani.fotoUrl}
                    alt={ingredient.profilPetani.nama}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-4 flex-1 text-center sm:text-left">
                  <div>
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1.5">
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#2E7D4F]">
                        Profil Petani Mitra
                      </span>
                      <span className="text-xs text-[#6E6E73]">·</span>
                      <span className="text-xs font-semibold text-[#2E7D4F] bg-[#EBF4EE] px-2.5 py-0.5 rounded-full">
                        {ingredient.profilPetani.lamaBertani}
                      </span>
                    </div>

                    <h3 className="text-2xl font-bold text-[#1D1D1F]">
                      {ingredient.profilPetani.nama}
                    </h3>
                    <p className="text-xs text-[#6E6E73] flex items-center justify-center sm:justify-start gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-[#2E7D4F]" />
                      <span>{ingredient.profilPetani.daerah}</span>
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#F5F5F7] border border-[#E8E8ED] text-xs text-[#1D1D1F] text-left">
                    <span className="font-semibold block text-[#2E7D4F] mb-1">
                      Cara Tanam & Perawatan:
                    </span>
                    <p className="text-[#6E6E73] leading-relaxed">
                      {ingredient.profilPetani.caraTanam}
                    </p>
                  </div>

                  <blockquote className="font-['Instrument_Serif'] italic text-base sm:text-lg text-[#1D1D1F] leading-snug pt-1 border-l-2 border-[#2E7D4F]/40 pl-3.5 text-left">
                    &ldquo;{ingredient.profilPetani.kutipan}&rdquo;
                  </blockquote>
                </div>
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* =========================================================================
          5. CERITA 3–4 PARAGRAF DENGAN LEBAR TEKS YANG NYAMAN DIBACA
          ========================================================================= */}
      <section>
        <Container size="narrow">
          <div className="max-w-2xl mx-auto space-y-6 text-[#1D1D1F] text-base sm:text-lg leading-[1.8] font-normal">
            {ingredient.ceritaPanjang && ingredient.ceritaPanjang.length > 0 ? (
              ingredient.ceritaPanjang.map((paragraf, index) => (
                <p key={index} className="text-balance">
                  {paragraf}
                </p>
              ))
            ) : (
              <>
                <p className="text-balance">{ingredient.ceritaSingkat}</p>
                <p className="text-balance">
                  Di tangan para petani yang tekun, buah dan sayur ini dirawat dengan sepenuh hati
                  tanpa memaksakan bentuk seragam pabrikan. Alam memiliki keindahannya sendiri yang
                  selalu mengejutkan indra pengecap kita.
                </p>
                <p className="text-balance">
                  Ketika pasar konvensional menutup pintu, Ugly2Yummy hadir merayakan setiap
                  lekukan unik dan bercak kematangan, mengubahnya menjadi produk artisan yang bernilai
                  tinggi.
                </p>
              </>
            )}
          </div>
        </Container>
      </section>

      {/* =========================================================================
          6. KUTIPAN BESAR DARI PETANI
          ========================================================================= */}
      <section className="bg-[#F5F5F7] py-16 sm:py-20">
        <Container size="narrow">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <Quote className="w-12 h-12 text-[#2E7D4F]/30 mx-auto stroke-[1.2]" />
            <blockquote className="font-['Instrument_Serif'] italic text-2xl sm:text-3xl md:text-4xl text-[#1D1D1F] leading-snug">
              &ldquo;
              {ingredient.kutipanPetani?.teks ||
                'Kami merawat hasil bumi dengan rasa cinta. Rasa manis dan aromanya tidak pernah berkurang hanya karena bentuknya tak biasa.'}
              &rdquo;
            </blockquote>
            <div className="pt-2">
              <p className="text-sm font-bold text-[#1D1D1F]">
                {ingredient.kutipanPetani?.nama || ingredient.petani}
              </p>
              <p className="text-xs text-[#6E6E73] mt-0.5">
                {ingredient.kutipanPetani?.peran || `Petani Mitra di ${ingredient.asal}`}
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* =========================================================================
          7. DUA KARTU BERDAMPINGAN: "Kenapa dianggap ugly?" & "Faktanya"
          ========================================================================= */}
      <section>
        <Container size="narrow">
          <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Kartu 1: Kenapa dianggap ugly? */}
            <div className="bg-white rounded-3xl border border-[#E8E8ED] p-7 sm:p-8 flex flex-col justify-between shadow-none">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-[#FEF3E8] text-[#C86218] flex items-center justify-center mb-5">
                  <AlertCircle className="w-5 h-5 stroke-[1.7]" />
                </div>
                <h3 className="text-lg font-bold text-[#1D1D1F] mb-3">
                  Kenapa dianggap &quot;ugly&quot;?
                </h3>
                <p className="text-sm text-[#6E6E73] leading-relaxed">
                  {ingredient.alasanUgly}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#E8E8ED]/70 text-xs text-[#C86218] font-semibold">
                Standar Estetika Ritel Modern
              </div>
            </div>

            {/* Kartu 2: Faktanya */}
            <div className="bg-[#EBF4EE] rounded-3xl border border-[#2E7D4F]/20 p-7 sm:p-8 flex flex-col justify-between shadow-none">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-white text-[#2E7D4F] flex items-center justify-center mb-5 shadow-xs">
                  <CheckCircle2 className="w-5 h-5 stroke-[1.7]" />
                </div>
                <h3 className="text-lg font-bold text-[#1D1D1F] mb-3">
                  Faktanya
                </h3>
                <p className="text-sm text-[#1D1D1F]/80 leading-relaxed font-medium">
                  {ingredient.fakta}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#2E7D4F]/20 text-xs text-[#2E7D4F] font-bold">
                100% Nutrisi & Rasa Murni
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* =========================================================================
          6. "DIOLAH MENJADI": KARTU PRODUK YANG MEMAKAI BAHAN INI
          ========================================================================= */}
      <section className="bg-[#F5F5F7] py-16 sm:py-24">
        <Container>
          <div className="max-w-4xl mx-auto mb-10 text-center sm:text-left sm:flex sm:items-end sm:justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#2E7D4F] block mb-1">
                Karya Kuliner Upcycled
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1D1D1F]">
                Diolah Menjadi
              </h2>
              <p className="mt-1.5 text-sm text-[#6E6E73]">
                Produk artisan lezat yang dibuat langsung dari {ingredient.nama}.
              </p>
            </div>

            <Link
              to="/produk"
              className="mt-4 sm:mt-0 inline-flex items-center gap-1 text-xs font-semibold text-[#2E7D4F] hover:underline"
            >
              <span>Semua Produk</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
            {relatedProducts.map((product) => {
              const formattedPrice = new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                maximumFractionDigits: 0,
              }).format(product.harga);

              return (
                <div
                  key={product.id}
                  onClick={() => navigate(`/produk/${product.id}`)}
                  className="group bg-white rounded-3xl border border-[#E8E8ED] overflow-hidden flex flex-col justify-between shadow-none hover:shadow-xs hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
                >
                  <div className="relative w-full overflow-hidden bg-[#F5F5F7]">
                    <SmartImage
                      src={product.gambar}
                      alt={product.nama}
                      fallbackEmoji={product.gambarEmojiFallback}
                      aspectRatio="16:9"
                      hoverZoom={true}
                      containerClassName="w-full"
                    />
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-[#2E7D4F] shadow-none">
                      {product.estimasiKgTerselamatkan} kg diselamatkan
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-xs text-[#6E6E73] uppercase tracking-wider font-medium">
                        {product.kategori} · {product.ukuran}
                      </span>
                      <h3 className="text-lg sm:text-xl font-bold text-[#1D1D1F] group-hover:text-[#2E7D4F] transition-colors mt-1">
                        {product.nama}
                      </h3>
                      <p className="mt-2 text-xs sm:text-sm text-[#6E6E73] line-clamp-2 leading-relaxed">
                        {product.deskripsiSingkat}
                      </p>
                    </div>

                    <div className="mt-5 pt-4 border-t border-[#E8E8ED]/70 flex items-center justify-between">
                      <span className="text-base sm:text-lg font-bold text-[#1D1D1F] tabular-nums">
                        {formattedPrice}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#2E7D4F] group-hover:translate-x-0.5 transition-transform">
                        <span>Lihat Produk</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* =========================================================================
          8. KOLOM KOMENTAR DI BAGIAN BAWAH HALAMAN
          ========================================================================= */}
      <section className="border-t border-[#E8E8ED] pt-16 sm:pt-20">
        <Container>
          <div className="max-w-4xl mx-auto">
            <CommentSection
              title={`Diskusi & Komentar: ${ingredient.nama}`}
              subtitle={`Bagikan apresiasi, tanggapan, atau cerita Anda untuk ${ingredient.petani} dan pelestarian pangan lokal.`}
              initialComments={ingredientComments}
              allowRating={false}
              placeholderText={`Tulis pesan apresiasi untuk ${ingredient.petani}...`}
            />
          </div>
        </Container>
      </section>
    </article>
  );
};
