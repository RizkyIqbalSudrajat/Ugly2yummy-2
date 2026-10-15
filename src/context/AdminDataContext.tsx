import React, { createContext, useContext, useState, useMemo } from 'react';
import {
  SupplierOffer,
  SupplierOfferStatus,
  SupplierDirectoryItem,
  ReceivingSchedule,
  ReceivingScheduleStatus,
  AdminOrder,
  OrderStatus,
  AdminShipping,
  ShippingStatus,
  AdminProduct,
  AdminReview,
  AdminUser,
  AdminNotification,
  MonthlyRevenueData,
  ProductSalesStat,
  NegotiationHistory,
} from '../types/admin';
import {
  INITIAL_SUPPLIERS,
  INITIAL_SUPPLIER_OFFERS,
  INITIAL_RECEIVING_SCHEDULES,
  INITIAL_ADMIN_ORDERS,
  INITIAL_ADMIN_SHIPPINGS,
  INITIAL_ADMIN_PRODUCTS,
  INITIAL_ADMIN_REVIEWS,
  INITIAL_ADMIN_USERS,
  INITIAL_ADMIN_NOTIFICATIONS,
  MONTHLY_REVENUE_DATA,
  PRODUCT_SALES_STATS,
} from '../data/adminDummy';

export interface AdminDataContextType {
  // Penawaran Supplier
  offers: SupplierOffer[];
  updateOfferStatus: (
    id: string,
    status: SupplierOfferStatus,
    extra?: { jadwalId?: string; hargaKesepakatanPerKg?: number }
  ) => void;
  addNegotiationMessage: (
    offerId: string,
    msg: Omit<NegotiationHistory, 'tanggal'>
  ) => void;

  // Supplier
  suppliers: SupplierDirectoryItem[];

  // Jadwal Penerimaan
  schedules: ReceivingSchedule[];
  addSchedule: (
    newSchedule: Omit<ReceivingSchedule, 'id'>
  ) => ReceivingSchedule;
  updateScheduleStatus: (
    id: string,
    status: ReceivingScheduleStatus
  ) => void;

  // Pesanan Pembeli
  orders: AdminOrder[];
  updateOrderStatus: (
    id: string,
    status: OrderStatus,
    resiPengiriman?: string
  ) => void;

  // Pengiriman
  shippings: AdminShipping[];
  addShipping: (
    shipping: Omit<AdminShipping, 'id' | 'riwayatStatus'>
  ) => AdminShipping;
  updateShippingStatus: (
    id: string,
    status: ShippingStatus,
    catatan?: string
  ) => void;

  // Produk Admin
  products: AdminProduct[];
  addProduct: (
    newProduct: Omit<AdminProduct, 'id'>
  ) => AdminProduct;
  updateProduct: (
    id: string,
    patch: Partial<AdminProduct>
  ) => void;

  // Ulasan
  reviews: AdminReview[];
  toggleReviewVisibility: (id: string) => void;
  replyToReview: (id: string, balasan: string) => void;

  // Pengguna
  users: AdminUser[];
  toggleUserStatus: (id: string) => void;

  // Notifikasi
  notifications: AdminNotification[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;

  // Data Finansial & Grafik
  monthlyRevenue: MonthlyRevenueData[];
  productSales: ProductSalesStat[];

  // Badges & Hitungan Dinamis
  unreadNotificationsCount: number;
  pendingOffersCount: number;
  newOrdersCount: number;
  inTransitShippingCount: number;
  activeOrdersCount: number;
  totalRevenueAmount: number;
}

const AdminDataContext = createContext<AdminDataContextType | undefined>(undefined);

export const AdminDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [offers, setOffers] = useState<SupplierOffer[]>(INITIAL_SUPPLIER_OFFERS);
  const [suppliers] = useState<SupplierDirectoryItem[]>(INITIAL_SUPPLIERS);
  const [schedules, setSchedules] = useState<ReceivingSchedule[]>(INITIAL_RECEIVING_SCHEDULES);
  const [orders, setOrders] = useState<AdminOrder[]>(INITIAL_ADMIN_ORDERS);
  const [shippings, setShippings] = useState<AdminShipping[]>(INITIAL_ADMIN_SHIPPINGS);
  const [products, setProducts] = useState<AdminProduct[]>(INITIAL_ADMIN_PRODUCTS);
  const [reviews, setReviews] = useState<AdminReview[]>(INITIAL_ADMIN_REVIEWS);
  const [users, setUsers] = useState<AdminUser[]>(INITIAL_ADMIN_USERS);
  const [notifications, setNotifications] = useState<AdminNotification[]>(INITIAL_ADMIN_NOTIFICATIONS);
  const [monthlyRevenue] = useState<MonthlyRevenueData[]>(MONTHLY_REVENUE_DATA);
  const [productSales] = useState<ProductSalesStat[]>(PRODUCT_SALES_STATS);

  // Penawaran Supplier
  const updateOfferStatus: AdminDataContextType['updateOfferStatus'] = (id, status, extra) => {
    setOffers((prev) =>
      prev.map((off) => {
        if (off.id === id) {
          return {
            ...off,
            status,
            jadwalId: extra?.jadwalId !== undefined ? extra.jadwalId : off.jadwalId,
            hargaKesepakatanPerKg:
              extra?.hargaKesepakatanPerKg !== undefined
                ? extra.hargaKesepakatanPerKg
                : off.hargaKesepakatanPerKg,
          };
        }
        return off;
      })
    );
  };

  const addNegotiationMessage: AdminDataContextType['addNegotiationMessage'] = (offerId, msg) => {
    const tanggalStr = '14 Okt 2026, baru saja';
    setOffers((prev) =>
      prev.map((off) => {
        if (off.id === offerId) {
          return {
            ...off,
            status: 'Negosiasi',
            riwayatNegosiasi: [
              ...off.riwayatNegosiasi,
              {
                ...msg,
                tanggal: tanggalStr,
              },
            ],
          };
        }
        return off;
      })
    );
  };

  // Jadwal Penerimaan
  const addSchedule: AdminDataContextType['addSchedule'] = (input) => {
    const nextId = `JDW-2026-00${schedules.length + 1}`;
    const created: ReceivingSchedule = {
      ...input,
      id: nextId,
    };
    setSchedules((prev) => [created, ...prev]);
    return created;
  };

  const updateScheduleStatus: AdminDataContextType['updateScheduleStatus'] = (id, status) => {
    setSchedules((prev) =>
      prev.map((sch) => (sch.id === id ? { ...sch, status } : sch))
    );
  };

  // Pesanan
  const updateOrderStatus: AdminDataContextType['updateOrderStatus'] = (id, status, resiPengiriman) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === id) {
          return {
            ...ord,
            status,
            resiPengiriman: resiPengiriman || ord.resiPengiriman,
          };
        }
        return ord;
      })
    );
  };

  // Pengiriman
  const addShipping: AdminDataContextType['addShipping'] = (input) => {
    const nextId = `SHP-2026-00${shippings.length + 1}`;
    const created: AdminShipping = {
      ...input,
      id: nextId,
      riwayatStatus: [
        {
          status: input.status,
          waktu: '14 Okt 2026, baru saja',
          catatan: 'Pengiriman baru dibuat oleh Admin.',
        },
      ],
    };
    setShippings((prev) => [created, ...prev]);
    return created;
  };

  const updateShippingStatus: AdminDataContextType['updateShippingStatus'] = (id, status, catatan) => {
    setShippings((prev) =>
      prev.map((shp) => {
        if (shp.id === id) {
          return {
            ...shp,
            status,
            riwayatStatus: [
              ...shp.riwayatStatus,
              {
                status,
                waktu: '14 Okt 2026, baru saja',
                catatan: catatan || `Status pengiriman diperbarui menjadi ${status}.`,
              },
            ],
          };
        }
        return shp;
      })
    );
  };

  // Produk Admin
  const addProduct: AdminDataContextType['addProduct'] = (input) => {
    const nextId = input.nama.toLowerCase().replace(/\s+/g, '-');
    const created: AdminProduct = {
      ...input,
      id: nextId,
    };
    setProducts((prev) => [created, ...prev]);
    return created;
  };

  const updateProduct: AdminDataContextType['updateProduct'] = (id, patch) => {
    setProducts((prev) =>
      prev.map((prod) => (prod.id === id ? { ...prod, ...patch } : prod))
    );
  };

  // Ulasan
  const toggleReviewVisibility: AdminDataContextType['toggleReviewVisibility'] = (id) => {
    setReviews((prev) =>
      prev.map((rev) =>
        rev.id === id
          ? {
              ...rev,
              status: rev.status === 'Tampil' ? 'Disembunyikan' : 'Tampil',
            }
          : rev
      )
    );
  };

  const replyToReview: AdminDataContextType['replyToReview'] = (id, balasan) => {
    setReviews((prev) =>
      prev.map((rev) => (rev.id === id ? { ...rev, balasanAdmin: balasan } : rev))
    );
  };

  // Pengguna
  const toggleUserStatus: AdminDataContextType['toggleUserStatus'] = (id) => {
    setUsers((prev) =>
      prev.map((usr) =>
        usr.id === id
          ? {
              ...usr,
              status: usr.status === 'Aktif' ? 'Nonaktif' : 'Aktif',
            }
          : usr
      )
    );
  };

  // Notifikasi
  const markNotificationAsRead: AdminDataContextType['markNotificationAsRead'] = (id) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, sudahDibaca: true } : notif))
    );
  };

  const markAllNotificationsAsRead: AdminDataContextType['markAllNotificationsAsRead'] = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, sudahDibaca: true })));
  };

  // Derived counts
  const unreadNotificationsCount = useMemo(
    () => notifications.filter((n) => !n.sudahDibaca).length,
    [notifications]
  );

  const pendingOffersCount = useMemo(
    () => offers.filter((o) => o.status === 'Menunggu Persetujuan').length,
    [offers]
  );

  const newOrdersCount = useMemo(
    () => orders.filter((o) => o.status === 'Pesanan Baru').length,
    [orders]
  );

  const inTransitShippingCount = useMemo(
    () => shippings.filter((s) => s.status === 'Dalam Perjalanan').length,
    [shippings]
  );

  const activeOrdersCount = useMemo(
    () => orders.filter((o) => o.status !== 'Selesai').length,
    [orders]
  );

  const totalRevenueAmount = useMemo(() => {
    return orders.reduce((sum, ord) => sum + ord.total, 0);
  }, [orders]);

  const value: AdminDataContextType = {
    offers,
    updateOfferStatus,
    addNegotiationMessage,
    suppliers,
    schedules,
    addSchedule,
    updateScheduleStatus,
    orders,
    updateOrderStatus,
    shippings,
    addShipping,
    updateShippingStatus,
    products,
    addProduct,
    updateProduct,
    reviews,
    toggleReviewVisibility,
    replyToReview,
    users,
    toggleUserStatus,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    monthlyRevenue,
    productSales,
    unreadNotificationsCount,
    pendingOffersCount,
    newOrdersCount,
    inTransitShippingCount,
    activeOrdersCount,
    totalRevenueAmount,
  };

  return (
    <AdminDataContext.Provider value={value}>
      {children}
    </AdminDataContext.Provider>
  );
};

export const useAdminData = (): AdminDataContextType => {
  const context = useContext(AdminDataContext);
  if (!context) {
    throw new Error('useAdminData must be used within an AdminDataProvider');
  }
  return context;
};
