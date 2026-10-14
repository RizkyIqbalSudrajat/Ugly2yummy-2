export type StaffRole = 'pekerja' | 'admin';

export interface StaffProfile {
  nama: string;
  email: string;
  role: StaffRole;
  jabatan: string;
  lokasi: string;
  inisial: string;
  avatarUrl?: string;
}

export interface StaffAuthContextType {
  isStaffLoggedIn: boolean;
  staff: StaffProfile | null;
  role: StaffRole | null;
  loginStaff: (role: StaffRole) => void;
  logoutStaff: () => void;
  pendingTasksCount: number;
}
