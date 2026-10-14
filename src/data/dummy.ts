import { Ingredient, Product, UserProfile, ImpactStats, SupplierProfile } from '../types';

// ============================================================================
// FOTO BAHAN "UGLY" (TIDAK SEMPURNA)
// Foto memperlihatkan bahan yang tidak sempurna (bengkok, bercabang, berbintik,
// kecil, penyok) dari kebun petani mitra:
// - Tomat Bengkok: [TEMPEL LINK]
// - Wortel Bercabang: [TEMPEL LINK]
// - Pisang Berbintik: [TEMPEL LINK]
// - Mangga Mungil: [TEMPEL LINK]
// - Apel Mungil: [TEMPEL LINK]
// - Stroberi Penyok: [TEMPEL LINK]
// ============================================================================
export const UGLY_INGREDIENT_LINKS: Record<string, string> = {
  'tomat-bengkok':
    'https://images.unsplash.com/photo-1566842600175-97dca489844f?auto=format&fit=crop&w=1200&q=80',
  'wortel-bercabang':
    'https://images.unsplash.com/photo-1447175008436-054170c2e979?auto=format&fit=crop&w=1200&q=80',
  'pisang-berbintik':
    'https://images.unsplash.com/photo-1603833665858-e61d17a86224?auto=format&fit=crop&w=1200&q=80',
  'mangga-mungil':
    'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?auto=format&fit=crop&w=1200&q=80',
  'apel-mungil':
    'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?auto=format&fit=crop&w=1200&q=80',
  'stroberi-penyok':
    'https://images.unsplash.com/photo-1587393855524-087f83d95bc9?auto=format&fit=crop&w=1200&q=80',
};

// ============================================================================
// FOTO PRODUK JADI (SESUDAH)
// Slot untuk menempel link foto produk dari pengguna:
// 1. Saus Tomat Panggang: [TEMPEL LINK] (sebelumnya broken 404 photo-1572441712711-2d0eb5fef7aa)
// 2. Sambal Tomat Roasted: [TEMPEL LINK] (sebelumnya salah foto jeruk photo-1546548970-71785318a17b)
// ============================================================================
export const PRODUCT_CUSTOM_LINKS: Record<string, string> = {
  'saus-tomat-panggang':
    'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?auto=format&fit=crop&w=800&q=80',
  'sambal-tomat-roasted':
    'https://images.unsplash.com/photo-1567337710282-00832b415979?auto=format&fit=crop&w=800&q=80',
};

export const INGREDIENTS: Ingredient[] = [
  {
    id: 'tomat-bengkok',
    nama: 'Tomat Bengkok',
    emoji: '🍅',
    asal: 'Lembang, Jawa Barat',
    petani: 'Pak Asep Sunarya',
    musimPanen: 'Sepanjang Tahun (Puncak Juni–September)',
    alasanUgly: 'Bentuk tidak bulat sempurna dan memiliki retakan mikro alami pada kulit luar akibat fluktuasi suhu pegunungan.',
    fakta: 'Rasa jauh lebih umami dan manis pekat alami, dengan kadar likopen serta vitamin C yang persis sama dengan tomat display supermarket.',
    ceritaSingkat: 'Pak Asep sering mendapati 30% panen tomatnya ditolak rantai ritel besar hanya karena bentuknya yang melengkung unik.',
    ceritaPanjang: [
      'Di hamparan perbukitan hijau Lembang dengan kabut pagi yang dingin, Pak Asep Sunarya telah merawat tanaman tomat selama lebih dari dua dekade. Tanah vulkanik yang subur menghasilkan buah-buah tomat yang ranum dan sarat sari buah murni. Namun, perubahan suhu drastis antara siang dan malam sering kali menyebabkan kulit tomat mengalami retakan halus atau bentuk melengkung alami saat mencari sinar matahari.',
      'Bagi tengkulak dan pasar swalayan konvensional, ketidaksempurnaan kosmetik ini adalah vonis mati. Tomat-tomat yang baru saja dipetik dengan susah payah sering kali disortir ke keranjang afkir — dihargai seperlima harga normal atau bahkan dibiarkan membusuk menjadi tumpukan sampah organik di sudut kebun.',
      'Padahal, jika Anda membelah tomat bengkok ini, Anda akan mencium aroma segar yang jauh lebih tajam dibanding tomat yang dipetik mentah demi estetika toko. Airnya kental, daging buahnya padat, dan tingkat kemanisan alaminya telah mencapai puncak karamelisasi.',
      'Melalui Ugly2Yummy, setiap kilogram tomat bengkok milik Pak Asep diselamatkan dan dihargai secara adil. Kami memanggangnya lambat dengan herba segar menjadi saus artisan dan sambal roasted yang kini menghiasi meja makan ribuan keluarga di perkotaan.'
    ],
    kutipanPetani: {
      teks: 'Dulu hati kami pedih melihat tomat-tomat manis harus dibuang hanya karena bentuknya bengkok. Bersama Ugly2Yummy, jerih payah keringat kami dihargai seutuhnya dan hasil panen menjadi berkah lezat bagi banyak orang.',
      nama: 'Pak Asep Sunarya',
      peran: 'Petani Mitra Tomat di Lembang, Jawa Barat'
    },
    profilPetani: {
      nama: 'Pak Asep Sunarya',
      daerah: 'Lembang, Jawa Barat',
      lamaBertani: 'Bertani sejak 2004',
      caraTanam: 'Sistem tumpang sari alami dengan pupuk kandang matang, bebas pestisida sintetis sistemik.',
      kutipan: 'Tanah vulkanik Lembang adalah titipan. Tomat yang bengkok tetap menyimpan sari pati tanah dan manisnya tetes embun pegunungan.',
      fotoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80',
    },
    totalKgTerselamatkan: 3420,
    altText: 'Tomat bengkok dengan kulit retak halus dari Lembang',
    gambar: UGLY_INGREDIENT_LINKS['tomat-bengkok'],
    produkOlahIds: ['saus-tomat-panggang', 'sambal-tomat-roasted'],
  },
  {
    id: 'wortel-bercabang',
    nama: 'Wortel Bercabang',
    emoji: '🥕',
    asal: 'Wonosobo, Jawa Tengah',
    petani: 'Bu Siti Rahayu',
    musimPanen: 'Mei – November',
    alasanUgly: 'Tumbuh bercabang membentuk dua atau tiga kaki karena terhalang bebatuan vulkanik di tanah lereng Dieng.',
    fakta: 'Memiliki kerenyahan luar biasa dan kadar beta-karoten maksimal karena tumbuh perlahan di dataran tinggi yang sejuk.',
    ceritaSingkat: 'Batu alami pegunungan membuat akar wortel Bu Siti mencari celah dan bercabang, menghasilkan wortel manis yang kerap dicap cacat.',
    ceritaPanjang: [
      'Lereng Dieng di Wonosobo terkenal dengan tanahnya yang gembur namun kaya bebatuan andesit alami peninggalan vulkanik purba. Saat benih wortel yang ditanam Bu Siti Rahayu mulai menghujam ke dalam tanah, ujung akarnya kerap bersentuhan dengan batu kecil sehingga membelah dan membentuk dua atau tiga percabangan menyerupai jemari.',
      'Di pasar tradisional dan distributor modern, bentuk unik ini dianggap merepotkan saat dikupas dengan mesin industri otomatis. Akibatnya, berton-ton wortel bercabang yang memiliki tekstur renyah dan kadar air seimbang terancam terbuang sia-sia.',
      'Kami merengkuh keunikan tersebut. Di dapur pengolahan Ugly2Yummy, wortel bercabang ini dicuci bersih dan diiris tipis dengan tangan, kemudian dipanggang perlahan menjadi keripik renyah bertabur sea salt yang sarat vitamin A alami tanpa jelantah minyak.'
    ],
    kutipanPetani: {
      teks: 'Wortel yang bercabang itu justru bukti tanah lereng kami masih alami dan berbatu. Rasanya renyah dan sangat manis. Kami bersyukur kini ada yang menghargainya sebagai camilan bernilai tinggi.',
      nama: 'Bu Siti Rahayu',
      peran: 'Ketua Kelompok Tani Sayur Dieng'
    },
    profilPetani: {
      nama: 'Bu Siti Rahayu',
      daerah: 'Wonosobo, Jawa Tengah',
      lamaBertani: 'Bertani sejak 2011',
      caraTanam: 'Budidaya lereng terasering alami tanpa pembajakan kimiawi, mengandalkan kompos jerami.',
      kutipan: 'Wortel bercabang ini bukti tanah Dieng kami kaya mineral batu alami. Kerenyahannya murni dari dinginnya hawa pegunungan.',
      fotoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    },
    totalKgTerselamatkan: 2150,
    altText: 'Wortel bercabang dua kaki akibat bebatuan lereng Dieng Wonosobo',
    gambar: UGLY_INGREDIENT_LINKS['wortel-bercabang'],
    produkOlahIds: ['keripik-wortel-panggang'],
  },
  {
    id: 'pisang-berbintik',
    nama: 'Pisang Berbintik',
    emoji: '🍌',
    asal: 'Lampung',
    petani: 'Pak Darto Wibowo',
    musimPanen: 'Sepanjang Tahun',
    alasanUgly: 'Kulit penuh bintik cokelat gelap (sugar freckles) tanda kematangan puncak yang sering disangka busuk oleh pembeli awam.',
    fakta: 'Tingkat kemanisan paling pekat dan kaya antioksidan TNF alami, sempurna untuk adonan kue tanpa perlu tambahan gula pasir berlebih.',
    ceritaSingkat: 'Bintik cokelat justru adalah mahakarya alam: pertanda pisang mencapai karamelisasi fruktosa alami terlezat.',
    ceritaPanjang: [
      'Bagi Pak Darto di Lampung, pisang adalah nafas kehidupan keluarganya. Di kebun tropisnya yang rimbun, tandan-tandan pisang dibiarkan matang sempurna di pohon agar menyerap nutrisi tanah dan kehangatan matahari khatulistiwa secara utuh.',
      'Ketika pisang mencapai fase kematangan terbaik, bintik-bintik cokelat gelap yang dikenal sebagai sugar freckles mulai bermunculan pada kulitnya. Ini adalah sinyal bahwa zat tepung telah berubah seutuhnya menjadi gula buah alami yang lembut dan harum.',
      'Sayangnya, supermarket modern menginginkan pisang yang mulus kuning kehijauan tanpa bercak agar tahan berminggu-minggu di rak pajang. Pisang matang berbintik Pak Darto kerap ditolak karena dianggap mendekati masa kedaluwarsa.',
      'Ugly2Yummy menyelamatkan tandan pisang manis ini dan mengolahnya menjadi Banana Bread kaya rempah dan smoothie dingin alami, menghasilkan kelezatan legit tanpa sirup gula buatan.'
    ],
    kutipanPetani: {
      teks: 'Orang tua dulu selalu bilang, pisang yang kulitnya bertitik cokelat itulah yang paling manis dan menyehatkan lambung. Senang sekali anak-anak muda sekarang kembali paham lewat roti lezat Ugly2Yummy.',
      nama: 'Pak Darto Wibowo',
      peran: 'Petani Pisang Organik Lampung'
    },
    profilPetani: {
      nama: 'Pak Darto Wibowo',
      daerah: 'Lampung',
      lamaBertani: 'Bertani sejak 1998',
      caraTanam: 'Perkebunan agroforestri ternaungi pepohonan lokal, panen matang pohon tanpa karbit.',
      kutipan: 'Bintik manis pada kulit pisang itu tandanya madu alam sudah tersebar sempurna ke setiap serat buah.',
      fotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    },
    totalKgTerselamatkan: 2890,
    altText: 'Pisang kematangan puncak dengan bintik cokelat sugar freckles dari Lampung',
    gambar: UGLY_INGREDIENT_LINKS['pisang-berbintik'],
    produkOlahIds: ['banana-bread-pisang-bintik', 'smoothie-mangga-pisang'],
  },
  {
    id: 'mangga-mungil',
    nama: 'Mangga Mungil',
    emoji: '🥭',
    asal: 'Indramayu, Jawa Barat',
    petani: 'Pak Karim Arifin',
    musimPanen: 'Agustus – November',
    alasanUgly: 'Ukuran buah mini di bawah standar etalase ritel dan kulit luar memiliki goresan alami dari gesekan ranting pohon.',
    fakta: 'Konsentrasi sari buah lebih kental dengan aroma mangga harum manis yang jauh lebih tajam dibanding buah berukuran raksasa.',
    ceritaSingkat: 'Ranting pohon mangga di pesisir Indramayu menggores kulit buah saat angin muson, namun daging di dalamnya tetap sempurna manis legit.',
    ceritaPanjang: [
      'Pesisir Indramayu terkenal sebagai sentra mangga harum manis terbaik. Angin laut yang berhembus kencang selama musim kemarau sering kali membuat dahan dan ranting pohon bergoyang, meninggalkan bekas goresan tipis pada kulit buah mangga muda.',
      'Selain itu, buah yang tumbuh di ujung dahan kadang berukuran mungil seukuran kepalan tangan anak kecil. Meski demikian, sari buah di dalamnya justru terkonsentrasi pekat dengan aroma harum semerbak.',
      'Sistem sortir ritel konvensional kerap menolak mangga kecil dan bergores ini. Namun bagi tim kuliner kami, daging mangga Pak Karim adalah bahan baku idaman untuk diolah perlahan menjadi selai buah kental dengan bulir serat utuh.'
    ],
    kutipanPetani: {
      teks: 'Kulitnya boleh tergores ranting pohon, tapi saat dikupas dagingnya kuning keemasan dan wangi sekali. Ugly2Yummy membuat panen kami tidak ada yang terbuang sia-sia.',
      nama: 'Pak Karim Arifin',
      peran: 'Petani Mangga Tradisional Indramayu'
    },
    profilPetani: {
      nama: 'Pak Karim Arifin',
      daerah: 'Indramayu, Jawa Barat',
      lamaBertani: 'Bertani sejak 2006',
      caraTanam: 'Metode tadah hujan pesisir organik dengan pemangkasan dahan berkala.',
      kutipan: 'Goresan angin laut di kulit mangga justru mengunci aroma harum manis yang pekat di bagian dalamnya.',
      fotoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    },
    totalKgTerselamatkan: 1640,
    altText: 'Mangga mungil dengan goresan alami ranting angin laut Indramayu',
    gambar: UGLY_INGREDIENT_LINKS['mangga-mungil'],
    produkOlahIds: ['selai-mangga-mungil', 'smoothie-mangga-pisang'],
  },
  {
    id: 'apel-mungil',
    nama: 'Apel Mungil',
    emoji: '🍎',
    asal: 'Batu, Jawa Timur',
    petani: 'Bu Lestari Handayani',
    musimPanen: 'Februari – Juli',
    alasanUgly: 'Diameter buah kecil dan bentuk sedikit asimetris akibat paparan sinar matahari yang miring di terasering lereng bukit.',
    fakta: 'Rasa asam-manis segar yang sangat intens dengan kadar pektin alami tinggi yang sangat renyah saat dikeringkan.',
    ceritaSingkat: 'Di kebun lereng pegunungan Batu, buah apel yang tumbuh di dahan bawah sering berukuran imut dan dipandang sebelah mata.',
    ceritaPanjang: [
      'Di lereng sejuk Kota Batu, kebun apel Bu Lestari tumbuh di kontur tanah bertingkat. Apel yang berada di bagian bawah kanopi daun rindang menerima sinar matahari secara tidak merata, sehingga menghasilkan buah berukuran mungil dan sedikit asimetris.',
      'Meski ukurannya tidak seragam dengan apel impor di supermarket, apel lokal mungil ini memiliki keunggulan rasa asam-manis yang khas dan menyegarkan tenggorokan.',
      'Kami mengolah apel mungil ini menjadi keripik kering renyah dengan taburan bubuk kayu manis alami, mengubah buah yang kerap diabaikan menjadi camilan primadona keluarga.'
    ],
    kutipanPetani: {
      teks: 'Apel Batu memang mungil, tapi kesegarannya tidak tertandingi. Kemitraan dengan Ugly2Yummy membuat kami semakin bangga merawat varietas apel nusantara.',
      nama: 'Bu Lestari Handayani',
      peran: 'Petani Apel Lereng Gunung Panderman'
    },
    profilPetani: {
      nama: 'Bu Lestari Handayani',
      daerah: 'Batu, Jawa Timur',
      lamaBertani: 'Bertani sejak 2009',
      caraTanam: 'Pertanian terasering organik pegunungan dengan penyiraman mata air alami.',
      kutipan: 'Apel Batu kami memang imut, tapi sari asam-manisnya sangat segar dan renyah di setiap gigitan.',
      fotoUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=400&q=80',
    },
    totalKgTerselamatkan: 1280,
    altText: 'Apel mungil asimetris hasil terasering lereng pegunungan Batu',
    gambar: UGLY_INGREDIENT_LINKS['apel-mungil'],
    produkOlahIds: ['keripik-apel-batu'],
  },
  {
    id: 'stroberi-penyok',
    nama: 'Stroberi Penyok',
    emoji: '🍓',
    asal: 'Ciwidey, Jawa Barat',
    petani: 'Bu Euis Kartini',
    musimPanen: 'Sepanjang Tahun (Puncak April–Oktober)',
    alasanUgly: 'Bentuk tidak simetris atau sedikit pipih tertekan daun pelindung saat tumbuh berdekatan di bedengan tinggi.',
    fakta: 'Kandungan air dan rasa manis asam segar sangat tinggi, menghasilkan warna merah delima murni tanpa perlu pewarna sintetik.',
    ceritaSingkat: 'Udara dingin Ciwidey membesarkan stroberi manis segar, namun buah yang tumbuh bersentuhan ranting kerap tidak lolos seleksi visual ritel.',
    ceritaPanjang: [
      'Udara sejuk berkabut di Ciwidey menyuguhkan lingkungan ideal bagi stroberi untuk bertumbuh lambat dan merona merah pekat. Bu Euis Kartini merawat bedengan stroberinya dengan teliti menggunakan mulsa jerami alami.',
      'Karena tumbuh dalam rumpun yang lebat, beberapa buah stroberi kerap tumbuh tertekan tangkai daun atau buah tetangganya, sehingga bentuknya agak pipih atau sedikit penyok secara alami.',
      'Standar toko menolak stroberi yang tidak berbentuk kerucut sempurna. Padahal untuk dijadikan selai artisan, stroberi dengan kematangan penuh dan bentuk unik inilah yang menghasilkan tekstur selai lembut berbuih wangi tanpa membutuhkan zat pengental sintetik.'
    ],
    kutipanPetani: {
      teks: 'Di kebun kami, rasa manis dan aroma segar selalu nomor satu. Dengan Ugly2Yummy, buah stroberi yang bentuknya tidak simetris tetap punya masa depan yang manis di toples selai.',
      nama: 'Bu Euis Kartini',
      peran: 'Pelopor Petani Stroberi Ciwidey'
    },
    profilPetani: {
      nama: 'Bu Euis Kartini',
      daerah: 'Ciwidey, Jawa Barat',
      lamaBertani: 'Bertani sejak 2013',
      caraTanam: 'Bedengan mulsa jerami alami di dataran tinggi berkabut tanpa semprotan pewarna.',
      kutipan: 'Bentuk boleh sedikit pipih karena berdesakan di bedengan, tapi merah merekah dan aromanya tiada tanding.',
      fotoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    },
    totalKgTerselamatkan: 1100,
    altText: 'Stroberi sedikit penyok dan pipih tertekan daun di bedengan Ciwidey',
    gambar: UGLY_INGREDIENT_LINKS['stroberi-penyok'],
    produkOlahIds: ['selai-stroberi-ciwidey'],
  },
];

export const PRODUCTS: Product[] = [
  {
    id: 'saus-tomat-panggang',
    nama: 'Saus Tomat Panggang',
    kategori: 'Saus & Sambal',
    kebutuhan: ['Masak Harian', 'Oleh-oleh'],
    harga: 35000,
    hargaPembanding: 45000,
    ukuran: '250 ml',
    deskripsiSingkat: 'Saus tomat artisan dari tomat bengkok Lembang yang dipanggang lambat dengan herba segar dan bawang putih.',
    deskripsiLengkap: 'Dibuat dari 100% tomat bengkok pilihan yang dipanggang pada suhu rendah untuk mengunci rasa manis dan karamelisasi alami. Tanpa pengental pati, tanpa sirup fruktosa, dan tanpa pewarna sintetik.',
    bahanUtama: 'Tomat Bengkok',
    komposisi: ['Tomat Bengkok Lembang', 'Bawang Putih Panggang', 'Minyak Zaitun', 'Garam Laut', 'Herba Oregano & Basil'],
    estimasiKgTerselamatkan: 0.5,
    rating: 4.9,
    jumlahUlasan: 148,
    gambar: PRODUCT_CUSTOM_LINKS['saus-tomat-panggang'],
    gambarEmojiFallback: '🍅',
    ingredientId: 'tomat-bengkok',
    tersedia: true,
  },
  {
    id: 'sambal-tomat-roasted',
    nama: 'Sambal Tomat Roasted',
    kategori: 'Saus & Sambal',
    kebutuhan: ['Masak Harian', 'Oleh-oleh'],
    harga: 32000,
    hargaPembanding: 42000,
    ukuran: '200 g',
    deskripsiSingkat: 'Sambal tomat gaya rumahan dengan aroma asap lembut, pedas gurih pas menemani hidangan harian.',
    deskripsiLengkap: 'Kombinasi tomat bengkok matang pohon dan cabai rawit lokal yang disangrai di atas wajan besi. Menghadirkan kedalaman rasa umami yang kaya.',
    bahanUtama: 'Tomat Bengkok',
    komposisi: ['Tomat Bengkok', 'Cabai Rawit Merah', 'Bawang Merah', 'Terasi Fermentasi Alami', 'Gula Kelapa', 'Garam'],
    estimasiKgTerselamatkan: 0.4,
    rating: 4.8,
    jumlahUlasan: 92,
    gambar: PRODUCT_CUSTOM_LINKS['sambal-tomat-roasted'],
    gambarEmojiFallback: '🍅',
    ingredientId: 'tomat-bengkok',
    tersedia: true,
  },
  {
    id: 'keripik-wortel-panggang',
    nama: 'Keripik Wortel Panggang',
    kategori: 'Camilan',
    kebutuhan: ['Camilan Sehat', 'Oleh-oleh', 'Hampers'],
    harga: 25000,
    hargaPembanding: 33000,
    ukuran: '100 g',
    deskripsiSingkat: 'Keripik wortel renyah tipis bebas minyak berlebih, ditaburi sedikit sea salt dan rosemary kering.',
    deskripsiLengkap: 'Irisan wortel bercabang Dieng dipanggang dengan teknologi vacuum frying suhu terkendali, mempertahankan warna cerah, beta-karoten, serta kerenyahan alami.',
    bahanUtama: 'Wortel Bercabang',
    komposisi: ['Wortel Bercabang Wonosobo', 'Minyak Kelapa Murni Rendah Lemak', 'Garam Laut Bali', 'Rosemary Kering'],
    estimasiKgTerselamatkan: 0.3,
    rating: 4.7,
    jumlahUlasan: 64,
    gambar: 'https://images.unsplash.com/photo-1582515073490-39981397c445?auto=format&fit=crop&w=800&q=80',
    gambarEmojiFallback: '🥕',
    ingredientId: 'wortel-bercabang',
    tersedia: true,
  },
  {
    id: 'banana-bread-pisang-bintik',
    nama: 'Banana Bread Pisang Bintik',
    kategori: 'Roti & Kue',
    kebutuhan: ['Sarapan', 'Camilan Sehat', 'Hampers'],
    harga: 55000,
    hargaPembanding: 72000,
    ukuran: '500 g',
    deskripsiSingkat: 'Roti pisang panggang wangi legit bertabur biji labu dan kenari, mengandalkan manis murni pisang matang.',
    deskripsiLengkap: 'Setiap loyang menggunakan lebih dari 3 buah pisang berbintik Lampung yang matang maksimal di pohon. Tekstur lembap alami tanpa pengembang kimiawi berlebih.',
    bahanUtama: 'Pisang Berbintik',
    komposisi: ['Pisang Berbintik Lampung', 'Tepung Terigu Utuh', 'Mentega Nabati', 'Telur Peternak Bebas Sangkar', 'Kenari', 'Kayu Manis'],
    estimasiKgTerselamatkan: 0.6,
    rating: 5.0,
    jumlahUlasan: 215,
    gambar: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?auto=format&fit=crop&w=800&q=80',
    gambarEmojiFallback: '🍌',
    ingredientId: 'pisang-berbintik',
    tersedia: true,
  },
  {
    id: 'selai-mangga-mungil',
    nama: 'Selai Mangga Mungil',
    kategori: 'Selai',
    kebutuhan: ['Sarapan', 'Oleh-oleh', 'Hampers'],
    harga: 38000,
    hargaPembanding: 49000,
    ukuran: '200 g',
    deskripsiSingkat: 'Selai mangga pekat wangi dengan bulir buah asli, diolah dengan sedikit perasan jeruk nipis segar.',
    deskripsiLengkap: 'Dibuat dari mangga mungil Indramayu yang diselamatkan. Tanpa gelatin hewani, hanya pektin buah alami yang dimasak perlahan di kuali tembaga tradisional.',
    bahanUtama: 'Mangga Mungil',
    komposisi: ['Daging Mangga Mungil Indramayu', 'Gula Tebu Alami Organik', 'Perasan Jeruk Nipis', 'Pektin Buah Apel'],
    estimasiKgTerselamatkan: 0.5,
    rating: 4.9,
    jumlahUlasan: 110,
    gambar: 'https://images.unsplash.com/photo-1584473457406-6240486418e9?auto=format&fit=crop&w=800&q=80',
    gambarEmojiFallback: '🥭',
    ingredientId: 'mangga-mungil',
    tersedia: true,
  },
  {
    id: 'keripik-apel-batu',
    nama: 'Keripik Apel Batu',
    kategori: 'Camilan',
    kebutuhan: ['Camilan Sehat', 'Oleh-oleh', 'Hampers'],
    harga: 28000,
    hargaPembanding: 37000,
    ukuran: '80 g',
    deskripsiSingkat: 'Camilan apel Malang renyah asam-manis menyegarkan tanpa pemanis buatan, ramah anak dan sehat.',
    deskripsiLengkap: 'Apel berukuran mini diiris tipis bersama kulitnya yang kaya serat, lalu dikeringkan bertahap hingga renyah sempurna.',
    bahanUtama: 'Apel Mungil',
    komposisi: ['Apel Mungil Batu Malang', 'Minyak Nabati Berkualitas', 'Bubuk Kayu Manis Alami'],
    estimasiKgTerselamatkan: 0.4,
    rating: 4.8,
    jumlahUlasan: 84,
    gambar: 'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?auto=format&fit=crop&w=800&q=80',
    gambarEmojiFallback: '🍎',
    ingredientId: 'apel-mungil',
    tersedia: true,
  },
  {
    id: 'selai-stroberi-ciwidey',
    nama: 'Selai Stroberi Ciwidey',
    kategori: 'Selai',
    kebutuhan: ['Sarapan', 'Oleh-oleh', 'Hampers'],
    harga: 40000,
    hargaPembanding: 52000,
    ukuran: '200 g',
    deskripsiSingkat: 'Selai stroberi merah delima dengan potongan utuh buah, rasa manis asam seimbang khas pegunungan.',
    deskripsiLengkap: 'Stroberi penyok Ciwidey dimasak bersama gula tebu tebal dalam waktu singkat untuk menjaga warna merah merona dan aroma stroberi segar.',
    bahanUtama: 'Stroberi Penyok',
    komposisi: ['Stroberi Penyok Ciwidey', 'Gula Tebu Alami', 'Perasan Lemon Segar'],
    estimasiKgTerselamatkan: 0.5,
    rating: 4.9,
    jumlahUlasan: 178,
    gambar: 'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?auto=format&fit=crop&w=800&q=80',
    gambarEmojiFallback: '🍓',
    ingredientId: 'stroberi-penyok',
    tersedia: true,
  },
  {
    id: 'smoothie-mangga-pisang',
    nama: 'Smoothie Mangga Pisang',
    kategori: 'Minuman',
    kebutuhan: ['Sarapan', 'Camilan Sehat'],
    harga: 30000,
    hargaPembanding: 39000,
    ukuran: '250 ml',
    deskripsiSingkat: 'Minuman dingin kental padat gizi dari perpaduan mangga mungil manis harum dan pisang berbintik legit.',
    deskripsiLengkap: 'Disiapkan harian dalam botol kaca higienis. Tanpa sirup gula, murni sari buah utuh dan air kelapa muda.',
    bahanUtama: 'Mangga + Pisang',
    komposisi: ['Mangga Mungil Indramayu', 'Pisang Berbintik Lampung', 'Air Kelapa Segar', 'Biji Chia'],
    estimasiKgTerselamatkan: 0.4,
    rating: 4.9,
    jumlahUlasan: 134,
    gambar: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=800&q=80',
    gambarEmojiFallback: '🥤',
    ingredientId: 'mangga-mungil',
    tersedia: true,
  },
];

export const DEMO_USER: UserProfile = {
  nama: 'Nadia Putri',
  email: 'nadia@example.com',
  kota: 'Jakarta Selatan',
  bergabungSejak: 'Mei 2025',
  dampak: {
    totalKgTerselamatkan: 3.2,
    pesananSelesai: 4,
    petaniDidukung: 5,
    emisiCo2eKg: 8.0,
  },
};

export const LANDING_IMPACT: ImpactStats = {
  totalKgPangan: 12480,
  petaniMitra: 86,
  totalPembeli: 9300,
  co2eKgTerselamatkan: 31200,
};

export const DEMO_SUPPLIER: SupplierProfile = {
  nama: 'Pak Asep',
  email: 'supplier@ugly2yummy.id',
  kelompokTani: 'Kelompok Tani Sukamaju',
  lokasi: 'Lembang, Jawa Barat',
  inisial: 'PA',
  komoditasUtama: 'Tomat Bengkok & Sayuran Segar',
  bergabungSejak: 'Januari 2024',
};

