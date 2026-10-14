import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';
import { LogOut, User, Mail, MapPin, Calendar, Sparkles } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="py-16 sm:py-24">
      <Container size="narrow">
        <div className="bg-white rounded-3xl border border-[#E8E8ED] p-8 sm:p-12 shadow-none">
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-8 border-b border-[#E8E8ED]">
            <div className="w-20 h-20 rounded-full bg-[#2E7D4F] text-white flex items-center justify-center font-bold text-2xl shadow-none">
              {user ? user.nama.charAt(0) : 'N'}
            </div>
            <div className="text-center sm:text-left flex-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#2E7D4F] block mb-1">
                Profil Pembeli
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1D1D1F]">
                {user ? user.nama : 'Nadia Putri'}
              </h1>
              <p className="text-xs sm:text-sm text-[#6E6E73] mt-1">
                {user ? user.email : 'nadia@example.com'}
              </p>
            </div>
          </div>

          <div className="py-8 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#1D1D1F]">
              Informasi Akun Demo
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-[#F5F5F7] border border-[#E8E8ED] flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#6E6E73]" />
                <div>
                  <span className="text-[11px] text-[#6E6E73] block">Email</span>
                  <span className="text-sm font-medium text-[#1D1D1F]">
                    {user ? user.email : 'nadia@example.com'}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#F5F5F7] border border-[#E8E8ED] flex items-center gap-3">
                <MapPin className="w-5 h-5 text-[#6E6E73]" />
                <div>
                  <span className="text-[11px] text-[#6E6E73] block">Kota Pengiriman</span>
                  <span className="text-sm font-medium text-[#1D1D1F]">
                    {user ? user.kota : 'Jakarta Selatan'}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#F5F5F7] border border-[#E8E8ED] flex items-center gap-3">
                <Calendar className="w-5 h-5 text-[#6E6E73]" />
                <div>
                  <span className="text-[11px] text-[#6E6E73] block">Bergabung Sejak</span>
                  <span className="text-sm font-medium text-[#1D1D1F]">
                    {user ? user.bergabungSejak : 'Mei 2025'}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#EBF4EE] border border-[#2E7D4F]/20 flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-[#2E7D4F]" />
                <div>
                  <span className="text-[11px] text-[#2E7D4F] font-semibold block">Dampak Anda</span>
                  <span className="text-sm font-bold text-[#2E7D4F]">
                    {user ? user.dampak.totalKgTerselamatkan : 3.2} kg Terselamatkan
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-[#E8E8ED] flex flex-wrap items-center justify-between gap-4">
            <Button to="/beranda" variant="secondary" size="md">
              Kembali ke Beranda
            </Button>
            <Button
              onClick={handleLogout}
              variant="text"
              size="md"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
              icon={<LogOut className="w-4 h-4" />}
            >
              Keluar dari Akun Demo
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
};
