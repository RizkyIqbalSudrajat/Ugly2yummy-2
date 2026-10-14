import React, { createContext, useContext, useState, useEffect } from 'react';
import { StaffProfile, StaffRole, StaffAuthContextType } from '../types/staff';

export const DEMO_PEKERJA: StaffProfile = {
  nama: 'Dewi Lestari',
  email: 'pekerja@ugly2yummy.id',
  role: 'pekerja',
  jabatan: 'Staf Produksi',
  lokasi: 'Dapur Produksi Ugly2Yummy, Bandung',
  inisial: 'DL',
};

export const DEMO_ADMIN: StaffProfile = {
  nama: 'Raka Pratama',
  email: 'admin@ugly2yummy.id',
  role: 'admin',
  jabatan: 'Admin Operasional',
  lokasi: 'Kantor Operasional Ugly2Yummy, Bandung',
  inisial: 'RP',
};

const StaffAuthContext = createContext<StaffAuthContextType | undefined>(undefined);

const STAFF_AUTH_ROLE_KEY = 'ugly2yummy_staff_auth_role';

export const StaffAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<StaffRole | null>(() => {
    try {
      const savedRole = localStorage.getItem(STAFF_AUTH_ROLE_KEY);
      if (savedRole === 'pekerja' || savedRole === 'admin') {
        return savedRole;
      }
      return null;
    } catch {
      return null;
    }
  });

  const [pendingTasksCount] = useState<number>(3);

  const isStaffLoggedIn = role !== null;
  const staff = role === 'pekerja' ? DEMO_PEKERJA : role === 'admin' ? DEMO_ADMIN : null;

  useEffect(() => {
    try {
      if (role) {
        localStorage.setItem(STAFF_AUTH_ROLE_KEY, role);
      } else {
        localStorage.removeItem(STAFF_AUTH_ROLE_KEY);
      }
    } catch {
      // ignore storage errors
    }
  }, [role]);

  const loginStaff = (newRole: StaffRole) => {
    setRole(newRole);
  };

  const logoutStaff = () => {
    setRole(null);
  };

  return (
    <StaffAuthContext.Provider
      value={{
        isStaffLoggedIn,
        staff,
        role,
        loginStaff,
        logoutStaff,
        pendingTasksCount,
      }}
    >
      {children}
    </StaffAuthContext.Provider>
  );
};

export const useStaffAuth = (): StaffAuthContextType => {
  const context = useContext(StaffAuthContext);
  if (!context) {
    throw new Error('useStaffAuth must be used within a StaffAuthProvider');
  }
  return context;
};
