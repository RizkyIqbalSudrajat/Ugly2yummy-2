import React, { createContext, useContext, useState, useEffect } from 'react';
import { SupplierProfile, SupplierOffer, NewOfferPayload } from '../types';
import { DEMO_SUPPLIER } from '../data/dummy';
import { INITIAL_SUPPLIER_OFFERS } from '../data/supplierDummy';

interface SupplierAuthContextType {
  isSupplierLoggedIn: boolean;
  supplier: SupplierProfile | null;
  offers: SupplierOffer[];
  loginSupplier: () => void;
  logoutSupplier: () => void;
  addOffer: (payload: NewOfferPayload) => SupplierOffer;
  resetOffers: () => void;
}

const SupplierAuthContext = createContext<SupplierAuthContextType | undefined>(undefined);

const SUPPLIER_AUTH_STORAGE_KEY = 'ugly2yummy_supplier_auth_state';
const SUPPLIER_OFFERS_STORAGE_KEY = 'ugly2yummy_supplier_offers_v1';

export const SupplierAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSupplierLoggedIn, setIsSupplierLoggedIn] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(SUPPLIER_AUTH_STORAGE_KEY);
      return saved === 'true';
    } catch {
      return false;
    }
  });

  const [offers, setOffers] = useState<SupplierOffer[]>(() => {
    try {
      const saved = localStorage.getItem(SUPPLIER_OFFERS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore parse errors
    }
    return INITIAL_SUPPLIER_OFFERS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(SUPPLIER_AUTH_STORAGE_KEY, String(isSupplierLoggedIn));
    } catch {
      // ignore storage errors
    }
  }, [isSupplierLoggedIn]);

  useEffect(() => {
    try {
      localStorage.setItem(SUPPLIER_OFFERS_STORAGE_KEY, JSON.stringify(offers));
    } catch {
      // ignore storage errors
    }
  }, [offers]);

  const loginSupplier = () => {
    setIsSupplierLoggedIn(true);
  };

  const logoutSupplier = () => {
    setIsSupplierLoggedIn(false);
  };

  const addOffer = (payload: NewOfferPayload): SupplierOffer => {
    const today = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const formattedDate = `${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear()}`;
    const hours = String(today.getHours()).padStart(2, '0');
    const minutes = String(today.getMinutes()).padStart(2, '0');
    const formattedTime = `${hours}:${minutes} WIB`;

    const nextIdNum = offers.length + 12;
    const newId = `PNW-2026-${String(nextIdNum).padStart(4, '0')}`;

    const newOffer: SupplierOffer = {
      id: newId,
      tanggalDiajukan: formattedDate,
      namaBahan: payload.namaBahan,
      jenisBahan: payload.jenisBahan,
      jumlahKg: payload.jumlahKg,
      kondisi: payload.kondisi,
      catatanKondisi: payload.catatanKondisi,
      hargaPerKg: payload.hargaPerKg,
      totalHarga: payload.jumlahKg * payload.hargaPerKg,
      tanggalPanen: payload.tanggalPanen,
      batasPenggunaan: payload.batasPenggunaan,
      lokasiPengambilan: payload.lokasiPengambilan,
      foto: payload.foto.length > 0 ? payload.foto : [
        'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80',
      ],
      pesanPenawaran: payload.pesanPenawaran,
      status: 'Menunggu Persetujuan',
      riwayatStatus: [
        {
          tahap: 'Menunggu Persetujuan',
          tanggal: `${formattedDate}, ${formattedTime}`,
          catatan: 'Penawaran baru berhasil diajukan oleh supplier dan sedang menunggu kurasi admin.',
        },
      ],
      catatanAdmin: 'Menunggu review dari tim kurasi pangan Ugly2Yummy.',
    };

    setOffers((prev) => [newOffer, ...prev]);
    return newOffer;
  };

  const resetOffers = () => {
    setOffers(INITIAL_SUPPLIER_OFFERS);
  };

  const supplier = isSupplierLoggedIn ? DEMO_SUPPLIER : null;

  return (
    <SupplierAuthContext.Provider
      value={{
        isSupplierLoggedIn,
        supplier,
        offers,
        loginSupplier,
        logoutSupplier,
        addOffer,
        resetOffers,
      }}
    >
      {children}
    </SupplierAuthContext.Provider>
  );
};

export const useSupplierAuth = (): SupplierAuthContextType => {
  const context = useContext(SupplierAuthContext);
  if (!context) {
    throw new Error('useSupplierAuth must be used within a SupplierAuthProvider');
  }
  return context;
};
