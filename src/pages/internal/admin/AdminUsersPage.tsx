import React, { useState, useMemo } from 'react';
import { useAdminData } from '../../../context/AdminDataContext';
import { AdminUser, AdminUserRole } from '../../../types/admin';
import {
  Users,
  Search,
  Plus,
  Edit2,
  Power,
  CheckCircle2,
  AlertCircle,
  X,
  Mail,
  UserCheck,
  Shield,
  Calendar,
} from 'lucide-react';

const ROLE_TABS: ('Semua' | AdminUserRole)[] = [
  'Semua',
  'Pembeli',
  'Supplier',
  'Pekerja',
  'Admin',
];

export const AdminUsersPage: React.FC = () => {
  const { users, addUser, updateUser, toggleUserStatus, addNotification } = useAdminData();

  const [activeRoleTab, setActiveRoleTab] = useState<'Semua' | AdminUserRole>('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal Tambah / Edit
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formRole, setFormRole] = useState<AdminUserRole>('Pekerja');

  // Modal Konfirmasi Toggle Status
  const [userToToggle, setUserToToggle] = useState<AdminUser | null>(null);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Tab Counts
  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = { Semua: users.length };
    ROLE_TABS.forEach((r) => {
      if (r !== 'Semua') {
        counts[r] = users.filter((u) => u.role === r).length;
      }
    });
    return counts;
  }, [users]);

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      if (activeRoleTab !== 'Semua' && u.role !== activeRoleTab) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return u.nama.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
      }
      return true;
    });
  }, [users, activeRoleTab, searchQuery]);

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingUser(null);
    setFormName('');
    setFormEmail('');
    setFormRole('Pekerja');
    setShowUserModal(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (user: AdminUser) => {
    setEditingUser(user);
    setFormName(user.nama);
    setFormEmail(user.email);
    setFormRole(user.role);
    setShowUserModal(true);
  };

  // Submit Modal
  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim()) {
      showToast('Harap isi nama dan email pengguna.');
      return;
    }

    if (editingUser) {
      updateUser(editingUser.id, {
        nama: formName.trim(),
        email: formEmail.trim(),
        role: formRole,
      });
      addNotification({
        tipe: 'Sistem',
        judul: `Data Pengguna Diperbarui: ${formName.trim()}`,
        isi: `Perubahan profil dan hak akses (${formRole}) telah disimpan.`,
        linkTujuan: '/internal/admin/pengguna',
      });
      showToast(`Data pengguna "${formName.trim()}" berhasil diperbarui!`);
    } else {
      addUser({
        nama: formName.trim(),
        email: formEmail.trim(),
        role: formRole,
        status: 'Aktif',
      });
      addNotification({
        tipe: 'Sistem',
        judul: `Pengguna Baru Didaftarkan: ${formName.trim()}`,
        isi: `Akun baru dengan role ${formRole} berhasil dibuat.`,
        linkTujuan: '/internal/admin/pengguna',
      });
      showToast(`Pengguna baru "${formName.trim()}" berhasil ditambahkan!`);
    }

    setShowUserModal(false);
  };

  // Confirm Status Toggle
  const handleConfirmToggle = () => {
    if (!userToToggle) return;
    toggleUserStatus(userToToggle.id);
    const nextStatus = userToToggle.status === 'Aktif' ? 'Nonaktif' : 'Aktif';

    addNotification({
      tipe: 'Sistem',
      judul: `Status Akun Diubah: ${userToToggle.nama}`,
      isi: `Akun telah di-${nextStatus.toLowerCase()}kan oleh admin.`,
      linkTujuan: '/internal/admin/pengguna',
    });

    showToast(`Akun "${userToToggle.nama}" berhasil diubah menjadi ${nextStatus}.`);
    setUserToToggle(null);
  };

  const getRoleBadgeStyle = (role: AdminUserRole) => {
    switch (role) {
      case 'Admin':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Pekerja':
        return 'bg-[#EBF4EE] text-[#2E7D4F] border-[#2E7D4F]/20';
      case 'Supplier':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Pembeli':
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
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
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60 inline-flex items-center gap-1">
              <Users className="w-3 h-3" />
              Akses & Keanggotaan
            </span>
            <span className="text-xs text-[#6E6E73]">
              {users.length} Akun Terdaftar
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1D1D1F]">
            Manajemen Pengguna & Staf
          </h1>
          <p className="text-xs sm:text-sm text-[#6E6E73] mt-1 max-w-xl">
            Kelola hak akses pengguna internal (staf admin operasional, staf pekerja dapur) serta direktori pelanggan dan akun mitra tani.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="px-4 py-2.5 rounded-full bg-[#2E7D4F] text-white text-xs font-semibold hover:bg-[#256640] transition-colors shadow-xs cursor-pointer inline-flex items-center gap-2 self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Pengguna</span>
        </button>
      </div>

      {/* Role Tab Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {ROLE_TABS.map((tab) => {
          const count = tabCounts[tab] || 0;
          const isActive = activeRoleTab === tab;

          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveRoleTab(tab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-[#1D1D1F] text-white shadow-xs'
                  : 'bg-white text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-[#F5F5F7] border border-[#E8E8ED]'
              }`}
            >
              <span>{tab}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-[#F5F5F7] text-[#6E6E73]'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search Toolbar */}
      <div className="bg-white rounded-3xl border border-[#E8E8ED] p-3.5 sm:p-4 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-[#8E8E93] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama pengguna atau alamat email..."
            className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm rounded-full bg-[#F5F5F7] border-0 focus:ring-2 focus:ring-[#2E7D4F]/30 text-[#1D1D1F] placeholder:text-[#8E8E93]"
          />
        </div>
      </div>

      {/* Users Table */}
      {filteredUsers.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#E8E8ED] p-12 text-center shadow-xs">
          <Users className="w-10 h-10 text-[#8E8E93] mx-auto mb-3" />
          <h3 className="text-sm font-bold text-[#1D1D1F]">Tidak ada pengguna ditemukan</h3>
          <p className="text-xs text-[#6E6E73] mt-1">
            {searchQuery
              ? `Tidak ada akun yang sesuai dengan pencarian "${searchQuery}".`
              : `Belum ada pengguna pada kategori role "${activeRoleTab}".`}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-[#E8E8ED] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#E8E8ED] bg-[#FBFBFD] text-[#6E6E73] font-semibold">
                  <th className="py-3.5 px-4">Pengguna</th>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4 text-center">Role Akses</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4">Tanggal Bergabung</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E8ED]/70">
                {filteredUsers.map((u) => {
                  const isDeactivated = u.status === 'Nonaktif';

                  return (
                    <tr
                      key={u.id}
                      className={`hover:bg-[#F5FBF7]/50 transition-colors ${
                        isDeactivated ? 'opacity-60 bg-gray-50/50' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#2E7D4F] text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-xs">
                            {u.nama
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .slice(0, 2)
                              .toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-[#1D1D1F]">{u.nama}</p>
                            <p className="text-[10px] text-[#8E8E93] font-mono">{u.id}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-[#6E6E73]">
                        <span className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-[#8E8E93]" />
                          {u.email}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getRoleBadgeStyle(
                            u.role
                          )}`}
                        >
                          {u.role}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            u.status === 'Aktif'
                              ? 'bg-[#EBF4EE] text-[#2E7D4F]'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {u.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-[#6E6E73]">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-[#8E8E93]" />
                          {u.tanggalBergabung}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(u)}
                            className="p-1.5 rounded-lg text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-[#F5F5F7] transition-colors cursor-pointer"
                            title="Edit Pengguna"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setUserToToggle(u)}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                              u.status === 'Aktif'
                                ? 'text-red-600 hover:bg-red-50'
                                : 'text-[#2E7D4F] hover:bg-[#EBF4EE]'
                            }`}
                            title={u.status === 'Aktif' ? 'Nonaktifkan Akun' : 'Aktifkan Akun'}
                          >
                            <Power className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= MODAL TAMBAH / EDIT PENGGUNA ================= */}
      {showUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-[#E8E8ED] animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-[#E8E8ED] pb-3">
              <h3 className="text-base font-bold text-[#1D1D1F]">
                {editingUser ? `Edit Pengguna: ${editingUser.nama}` : 'Tambah Pengguna Baru'}
              </h3>
              <button
                type="button"
                onClick={() => setShowUserModal(false)}
                className="p-1 rounded-full hover:bg-[#F5F5F7] text-[#8E8E93] hover:text-[#1D1D1F]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-[#1D1D1F] mb-1">
                  Nama Lengkap:
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Contoh: Siti Rahma"
                  required
                  className="w-full p-2.5 rounded-xl bg-[#F5F5F7] border-0 text-[#1D1D1F]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1D1D1F] mb-1">
                  Alamat Email:
                </label>
                <input
                  type="email"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="siti@ugly2yummy.id"
                  required
                  className="w-full p-2.5 rounded-xl bg-[#F5F5F7] border-0 text-[#1D1D1F]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1D1D1F] mb-1">
                  Peran & Hak Akses (Role):
                </label>
                <select
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value as AdminUserRole)}
                  className="w-full p-2.5 rounded-xl bg-[#F5F5F7] border-0 text-[#1D1D1F]"
                >
                  <option value="Admin">Admin (Akses Penuh Portal Admin)</option>
                  <option value="Pekerja">Pekerja (Portal Dapur & Sortir QC)</option>
                  <option value="Supplier">Supplier (Portal Mitra Tani)</option>
                  <option value="Pembeli">Pembeli (Katalog & Transaksi Pelanggan)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E8E8ED]">
                <button
                  type="button"
                  onClick={() => setShowUserModal(false)}
                  className="px-4 py-2 rounded-full bg-[#F5F5F7] text-[#6E6E73] hover:text-[#1D1D1F] cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#2E7D4F] text-white hover:bg-[#256640] transition-colors shadow-xs cursor-pointer font-semibold"
                >
                  Simpan Pengguna
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL KONFIRMASI AKTIFKAN / NONAKTIFKAN ================= */}
      {userToToggle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-[#E8E8ED] animate-in zoom-in-95 duration-200">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center mx-auto ${
                userToToggle.status === 'Aktif'
                  ? 'bg-red-100 text-red-600'
                  : 'bg-[#EBF4EE] text-[#2E7D4F]'
              }`}
            >
              <Power className="w-5 h-5" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-[#1D1D1F]">
                {userToToggle.status === 'Aktif'
                  ? 'Nonaktifkan Akun Pengguna?'
                  : 'Aktifkan Kembali Akun?'}
              </h3>
              <p className="text-xs text-[#6E6E73]">
                {userToToggle.status === 'Aktif'
                  ? `Pengguna "${userToToggle.nama}" tidak akan dapat masuk atau mengakses portal sistem sementara waktu.`
                  : `Pengguna "${userToToggle.nama}" akan dapat masuk dan menggunakan sistem kembali.`}
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setUserToToggle(null)}
                className="flex-1 py-2 rounded-full text-xs font-semibold bg-[#F5F5F7] text-[#6E6E73] hover:text-[#1D1D1F] cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmToggle}
                className={`flex-1 py-2 rounded-full text-xs font-semibold text-white shadow-xs cursor-pointer ${
                  userToToggle.status === 'Aktif'
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-[#2E7D4F] hover:bg-[#256640]'
                }`}
              >
                {userToToggle.status === 'Aktif' ? 'Ya, Nonaktifkan' : 'Ya, Aktifkan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
