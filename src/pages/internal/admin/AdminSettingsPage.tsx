import React, { useState } from 'react';
import { useAdminData } from '../../../context/AdminDataContext';
import { useStaffAuth } from '../../../context/StaffAuthContext';
import {
  Settings,
  Store,
  CreditCard,
  Truck,
  AlertTriangle,
  User,
  KeyRound,
  CheckCircle2,
  Save,
  HelpCircle,
  Building,
  Phone,
  Mail,
  MapPin,
} from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const { settings, updateSettings, addNotification } = useAdminData();
  const { staff } = useStaffAuth();

  // 1. Profil Toko
  const [namaToko, setNamaToko] = useState(settings.namaToko);
  const [alamatGudang, setAlamatGudang] = useState(settings.alamatGudang);
  const [emailToko, setEmailToko] = useState(settings.emailToko);
  const [noWhatsApp, setNoWhatsApp] = useState(settings.noWhatsApp);

  // 2. Rekening Pembayaran
  const [rekeningBank, setRekeningBank] = useState(settings.rekeningBank);
  const [nomorRekening, setNomorRekening] = useState(settings.nomorRekening);
  const [atasNamaRekening, setAtasNamaRekening] = useState(settings.atasNamaRekening);

  // 3. Kurir Aktif
  const [couriers, setCouriers] = useState(settings.activeCouriers);

  // 4. Ambang Batas Stok Menipis
  const [ambangBahan, setAmbangBahan] = useState(settings.ambangStokBahanKg);
  const [ambangProduk, setAmbangProduk] = useState(settings.ambangStokProdukUnit);

  // 5. Akun Admin (Tampilan interaktif)
  const [adminName, setAdminName] = useState(staff?.nama || 'Raka Pratama');
  const [adminEmail, setAdminEmail] = useState(staff?.email || 'admin@ugly2yummy.id');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const toggleCourier = (courierName: keyof typeof couriers) => {
    setCouriers((prev) => ({
      ...prev,
      [courierName]: !prev[courierName],
    }));
  };

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword && newPassword !== confirmPassword) {
      showToast('Konfirmasi kata sandi baru tidak cocok.');
      return;
    }

    updateSettings({
      namaToko,
      alamatGudang,
      emailToko,
      noWhatsApp,
      rekeningBank,
      nomorRekening,
      atasNamaRekening,
      activeCouriers: couriers,
      ambangStokBahanKg: Number(ambangBahan) || 10,
      ambangStokProdukUnit: Number(ambangProduk) || 25,
    });

    addNotification({
      tipe: 'Sistem',
      judul: 'Pengaturan Sistem Diperbarui',
      isi: 'Parameter profil operasional, ambang stok kritis, dan kurir logistik telah disimpan.',
      linkTujuan: '/internal/admin/pengaturan',
    });

    showToast('Seluruh pengaturan sistem berhasil disimpan!');
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-200">
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
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#EBF4EE] text-[#2E7D4F] border border-[#2E7D4F]/20 inline-flex items-center gap-1">
              <Settings className="w-3 h-3" />
              Konfigurasi Sistem
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1D1D1F]">
            Pengaturan Operasional & Toko
          </h1>
          <p className="text-xs sm:text-sm text-[#6E6E73] mt-1 max-w-xl">
            Atur identitas gerai dan alamat gudang, rekening pembayaran transaksi mitra, ekspedisi kurir yang aktif, serta ambang batas peringatan stok kritis.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSaveAll}
          className="px-5 py-2.5 rounded-full bg-[#2E7D4F] text-white hover:bg-[#256640] text-xs font-semibold transition-colors shadow-xs cursor-pointer inline-flex items-center gap-2 self-start sm:self-auto shrink-0"
        >
          <Save className="w-4 h-4" />
          <span>Simpan Perubahan</span>
        </button>
      </div>

      <form onSubmit={handleSaveAll} className="space-y-6">
        {/* KARTU 1: PROFIL TOKO & GUDANG */}
        <div className="bg-white rounded-3xl border border-[#E8E8ED] p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-[#E8E8ED] pb-3">
            <Store className="w-4 h-4 text-[#2E7D4F]" />
            <h3 className="text-base font-bold text-[#1D1D1F]">
              Profil Toko & Lokasi Gudang Olahan
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-[#1D1D1F] mb-1">
                Nama Gerai / Entitas Toko:
              </label>
              <input
                type="text"
                value={namaToko}
                onChange={(e) => setNamaToko(e.target.value)}
                required
                className="w-full p-2.5 rounded-xl bg-[#F5F5F7] border-0 text-[#1D1D1F]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#1D1D1F] mb-1">
                Nomor Layanan WhatsApp:
              </label>
              <input
                type="text"
                value={noWhatsApp}
                onChange={(e) => setNoWhatsApp(e.target.value)}
                required
                className="w-full p-2.5 rounded-xl bg-[#F5F5F7] border-0 text-[#1D1D1F]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-[#1D1D1F] mb-1">
                Email Operasional:
              </label>
              <input
                type="email"
                value={emailToko}
                onChange={(e) => setEmailToko(e.target.value)}
                required
                className="w-full p-2.5 rounded-xl bg-[#F5F5F7] border-0 text-[#1D1D1F]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-[#1D1D1F] mb-1">
                Alamat Lengkap Gudang Logistik & Titik Penjemputan Kurir:
              </label>
              <textarea
                value={alamatGudang}
                onChange={(e) => setAlamatGudang(e.target.value)}
                rows={2}
                required
                className="w-full p-2.5 rounded-xl bg-[#F5F5F7] border-0 text-[#1D1D1F] leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* KARTU 2: REKENING PEMBAYARAN */}
        <div className="bg-white rounded-3xl border border-[#E8E8ED] p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-[#E8E8ED] pb-3">
            <CreditCard className="w-4 h-4 text-[#2E7D4F]" />
            <h3 className="text-base font-bold text-[#1D1D1F]">
              Rekening Bank Pembayaran Toko
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-[#1D1D1F] mb-1">
                Nama Bank:
              </label>
              <input
                type="text"
                value={rekeningBank}
                onChange={(e) => setRekeningBank(e.target.value)}
                required
                className="w-full p-2.5 rounded-xl bg-[#F5F5F7] border-0 text-[#1D1D1F]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#1D1D1F] mb-1">
                Nomor Rekening:
              </label>
              <input
                type="text"
                value={nomorRekening}
                onChange={(e) => setNomorRekening(e.target.value)}
                required
                className="w-full p-2.5 rounded-xl bg-[#F5F5F7] border-0 font-mono text-[#1D1D1F]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#1D1D1F] mb-1">
                Atas Nama (A.n.):
              </label>
              <input
                type="text"
                value={atasNamaRekening}
                onChange={(e) => setAtasNamaRekening(e.target.value)}
                required
                className="w-full p-2.5 rounded-xl bg-[#F5F5F7] border-0 text-[#1D1D1F]"
              />
            </div>
          </div>
        </div>

        {/* KARTU 3: KURIR AKTIF */}
        <div className="bg-white rounded-3xl border border-[#E8E8ED] p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#E8E8ED] pb-3">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#2E7D4F]" />
              <h3 className="text-base font-bold text-[#1D1D1F]">
                Ekspedisi Kurir Aktif untuk Pelanggan
              </h3>
            </div>
            <span className="text-[11px] text-[#8E8E93]">Aktifkan pilihan jasa kirim</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {(['JNE', 'SiCepat', 'J&T', 'GoSend'] as const).map((cName) => {
              const isEnabled = couriers[cName];

              return (
                <div
                  key={cName}
                  onClick={() => toggleCourier(cName)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    isEnabled
                      ? 'bg-[#EBF4EE] border-[#2E7D4F]/30 text-[#1D1D1F]'
                      : 'bg-[#F5F5F7] border-transparent text-[#8E8E93]'
                  }`}
                >
                  <div className="space-y-0.5">
                    <p className="font-bold text-sm">{cName}</p>
                    <p className="text-[10px] text-[#6E6E73]">
                      {isEnabled ? 'Tersedia di Toko' : 'Dinonaktifkan'}
                    </p>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                      isEnabled ? 'bg-[#2E7D4F] text-white' : 'bg-[#E8E8ED]'
                    }`}
                  >
                    {isEnabled && <CheckCircle2 className="w-4 h-4" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* KARTU 4: AMBANG STOK MENIPIS */}
        <div className="bg-white rounded-3xl border border-[#E8E8ED] p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#E8E8ED] pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <h3 className="text-base font-bold text-[#1D1D1F]">
                Ambang Batas Peringatan "Stok Menipis"
              </h3>
            </div>
            <span className="text-[11px] text-[#8E8E93]">Parameter Kritis</span>
          </div>

          <p className="text-xs text-[#6E6E73] leading-relaxed">
            Nilai ini dipakai secara sistemik untuk memunculkan lencana peringatan <strong>"Stok menipis"</strong> di seluruh halaman katalog produk, manajemen bahan baku, dan ringkasan Dashboard.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-[#FBFBFD] border border-[#E8E8ED] space-y-2">
              <label className="block font-semibold text-[#1D1D1F]">
                Bahan Baku Mentah (kg):
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={ambangBahan}
                  onChange={(e) => setAmbangBahan(Number(e.target.value))}
                  min={1}
                  required
                  className="w-full p-2.5 rounded-xl bg-white border border-[#E8E8ED] font-bold text-base text-[#1D1D1F]"
                />
                <span className="font-semibold text-[#6E6E73]">kg sisa layak</span>
              </div>
              <p className="text-[11px] text-[#8E8E93]">
                Peringatan muncul jika bahan di gudang $\le$ batas ini.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FBFBFD] border border-[#E8E8ED] space-y-2">
              <label className="block font-semibold text-[#1D1D1F]">
                Produk Olahan Kemasan (Unit):
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={ambangProduk}
                  onChange={(e) => setAmbangProduk(Number(e.target.value))}
                  min={1}
                  required
                  className="w-full p-2.5 rounded-xl bg-white border border-[#E8E8ED] font-bold text-base text-[#1D1D1F]"
                />
                <span className="font-semibold text-[#6E6E73]">unit kemasan</span>
              </div>
              <p className="text-[11px] text-[#8E8E93]">
                Peringatan muncul jika stok produk di toko $\le$ batas ini.
              </p>
            </div>
          </div>
        </div>

        {/* KARTU 5: AKUN ADMIN & GANTI KATA SANDI */}
        <div className="bg-white rounded-3xl border border-[#E8E8ED] p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-[#E8E8ED] pb-3">
            <User className="w-4 h-4 text-[#2E7D4F]" />
            <h3 className="text-base font-bold text-[#1D1D1F]">
              Akun Administrator & Keamanan
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-[#1D1D1F] mb-1">
                Nama Lengkap Administrator:
              </label>
              <input
                type="text"
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                required
                className="w-full p-2.5 rounded-xl bg-[#F5F5F7] border-0 text-[#1D1D1F]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#1D1D1F] mb-1">
                Alamat Email Login Admin:
              </label>
              <input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                required
                className="w-full p-2.5 rounded-xl bg-[#F5F5F7] border-0 text-[#1D1D1F]"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-[#E8E8ED] space-y-3 text-xs">
            <h4 className="font-bold text-[#1D1D1F] flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-[#6E6E73]" />
              Ganti Kata Sandi (Opsional)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[#6E6E73] mb-1">Kata Sandi Lama:</label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-2.5 rounded-xl bg-[#F5F5F7] border-0 text-[#1D1D1F]"
                />
              </div>

              <div>
                <label className="block text-[#6E6E73] mb-1">Kata Sandi Baru:</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-2.5 rounded-xl bg-[#F5F5F7] border-0 text-[#1D1D1F]"
                />
              </div>

              <div>
                <label className="block text-[#6E6E73] mb-1">Konfirmasi Kata Sandi:</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-2.5 rounded-xl bg-[#F5F5F7] border-0 text-[#1D1D1F]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tombol Simpan Footer */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-full bg-[#2E7D4F] text-white hover:bg-[#256640] text-xs font-semibold transition-colors shadow-xs cursor-pointer inline-flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Semua Pengaturan</span>
          </button>
        </div>
      </form>
    </div>
  );
};
