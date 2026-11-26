import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, CartItem, Product } from '../types';
import { DEMO_USER, PRODUCTS } from '../data/dummy';

export interface GuestInfo {
  namaLengkap: string;
  nomorWhatsapp: string;
  email: string;
  provinsi: string;
  kotaKabupaten: string;
  kecamatan: string;
  kelurahanDesa: string;
  kodePos: string;
  alamatLengkap: string;
  patokan?: string;
  catatanKurir?: string;
}

export interface BuyNowItem {
  product: Product;
  jumlah: number;
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: UserProfile | null;
  isGuest: boolean;
  startGuestMode: () => void;
  guestInfo: GuestInfo | null;
  setGuestInfo: (info: GuestInfo | null) => void;
  buyNowItem: BuyNowItem | null;
  setBuyNow: (product: Product, jumlah: number) => void;
  updateBuyNowQuantity: (delta: number) => void;
  clearBuyNow: () => void;
  cartCount: number;
  cartItems: CartItem[];
  loginDemo: () => void;
  logout: () => void;
  setCartCount: React.Dispatch<React.SetStateAction<number>>;
  addToCart: (product: Product, quantity?: number) => void;
  updateQuantity: (id: string, delta: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  resetDemoCart: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'ugly2yummy_auth_state';
const GUEST_STORAGE_KEY = 'ugly2yummy_is_guest';
const GUEST_INFO_KEY = 'ugly2yummy_guest_info';
const BUY_NOW_KEY = 'ugly2yummy_buy_now';
const GUEST_CART_KEY = 'ugly2yummy_guest_cart';

const INITIAL_CART_ITEMS: CartItem[] = [
  {
    id: 'selai-mangga-mungil',
    nama: 'Selai Mangga Mungil',
    kategori: 'Selai',
    harga: 38000,
    ukuran: '200 g',
    jumlah: 2,
    bahanUtama: 'Mangga Mungil',
    asalBahan: 'Dari Mangga Mungil · Indramayu',
    estimasiKgTerselamatkan: 0.5,
    gambar: PRODUCTS.find((p) => p.id === 'selai-mangga-mungil')?.gambar || '',
    gambarEmojiFallback: '🥭',
  },
  {
    id: 'keripik-wortel-panggang',
    nama: 'Keripik Wortel Panggang',
    kategori: 'Camilan',
    harga: 25000,
    ukuran: '100 g',
    jumlah: 1,
    bahanUtama: 'Wortel Bercabang',
    asalBahan: 'Dari Wortel Bercabang · Wonosobo',
    estimasiKgTerselamatkan: 0.3,
    gambar: PRODUCTS.find((p) => p.id === 'keripik-wortel-panggang')?.gambar || '',
    gambarEmojiFallback: '🥕',
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Login State
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      return saved === 'true';
    } catch {
      return false;
    }
  });

  // Guest Mode State (stored in sessionStorage)
  const [isGuest, setIsGuest] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(GUEST_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  // Guest Info State (stored in sessionStorage)
  const [guestInfo, setGuestInfoState] = useState<GuestInfo | null>(() => {
    try {
      const saved = sessionStorage.getItem(GUEST_INFO_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Buy Now Item State (stored in sessionStorage)
  const [buyNowItem, setBuyNowItem] = useState<BuyNowItem | null>(() => {
    try {
      const saved = sessionStorage.getItem(BUY_NOW_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Cart Items State
  // Initial cart items are only for demo account; guest starts with empty cart
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const savedLogin = localStorage.getItem(AUTH_STORAGE_KEY) === 'true';
      if (savedLogin) {
        return INITIAL_CART_ITEMS;
      }
      const savedGuestCart = sessionStorage.getItem(GUEST_CART_KEY);
      return savedGuestCart ? JSON.parse(savedGuestCart) : [];
    } catch {
      return [];
    }
  });

  // Derive cartCount dynamically from cartItems
  const cartCount = cartItems.reduce((acc, item) => acc + item.jumlah, 0);

  // Sync login to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, String(isLoggedIn));
    } catch {
      // storage failed
    }
  }, [isLoggedIn]);

  // Sync guest mode to sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem(GUEST_STORAGE_KEY, String(isGuest));
    } catch {
      // storage failed
    }
  }, [isGuest]);

  // Sync guest info to sessionStorage
  const setGuestInfo = (info: GuestInfo | null) => {
    setGuestInfoState(info);
    try {
      if (info) {
        sessionStorage.setItem(GUEST_INFO_KEY, JSON.stringify(info));
      } else {
        sessionStorage.removeItem(GUEST_INFO_KEY);
      }
    } catch {
      // storage failed
    }
  };

  // Sync buy now item to sessionStorage
  const setBuyNow = (product: Product, jumlah: number) => {
    const item: BuyNowItem = { product, jumlah: Math.max(1, Math.min(10, jumlah)) };
    setBuyNowItem(item);
    try {
      sessionStorage.setItem(BUY_NOW_KEY, JSON.stringify(item));
    } catch {
      // storage failed
    }
  };

  const updateBuyNowQuantity = (delta: number) => {
    setBuyNowItem((prev) => {
      if (!prev) return null;
      const nextQty = Math.max(1, Math.min(10, prev.jumlah + delta));
      const updated = { ...prev, jumlah: nextQty };
      try {
        sessionStorage.setItem(BUY_NOW_KEY, JSON.stringify(updated));
      } catch {
        // storage failed
      }
      return updated;
    });
  };

  const clearBuyNow = () => {
    setBuyNowItem(null);
    try {
      sessionStorage.removeItem(BUY_NOW_KEY);
    } catch {
      // storage failed
    }
  };

  // Sync guest cart to sessionStorage
  useEffect(() => {
    if (!isLoggedIn) {
      try {
        sessionStorage.setItem(GUEST_CART_KEY, JSON.stringify(cartItems));
      } catch {
        // storage failed
      }
    }
  }, [cartItems, isLoggedIn]);

  const startGuestMode = () => {
    setIsGuest(true);
    try {
      sessionStorage.setItem(GUEST_STORAGE_KEY, 'true');
    } catch {
      // storage failed
    }
  };

  const loginDemo = () => {
    setIsLoggedIn(true);
    setIsGuest(false);
    // If cart was empty, initialize demo items
    if (cartItems.length === 0) {
      setCartItems(INITIAL_CART_ITEMS);
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setIsGuest(false);
    setCartItems([]);
    try {
      sessionStorage.removeItem(GUEST_STORAGE_KEY);
      sessionStorage.removeItem(GUEST_CART_KEY);
    } catch {
      // storage failed
    }
  };

  const addToCart = (product: Product, quantity = 1) => {
    const qtyToAdd = Math.max(1, quantity);
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, jumlah: Math.min(10, item.jumlah + qtyToAdd) }
            : item
        );
      }
      const newItem: CartItem = {
        id: product.id,
        nama: product.nama,
        kategori: product.kategori,
        harga: product.harga,
        ukuran: product.ukuran,
        jumlah: Math.min(10, qtyToAdd),
        bahanUtama: product.bahanUtama,
        asalBahan: `Dari ${product.bahanUtama}`,
        estimasiKgTerselamatkan: product.estimasiKgTerselamatkan,
        gambar: product.gambar,
        gambarEmojiFallback: product.gambarEmojiFallback,
      };
      return [...prev, newItem];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.jumlah + delta;
            return newQty > 0 ? { ...item, jumlah: Math.min(10, newQty) } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const removeItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const resetDemoCart = () => {
    setCartItems(INITIAL_CART_ITEMS);
  };

  const user = isLoggedIn ? DEMO_USER : null;

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
        isGuest,
        startGuestMode,
        guestInfo,
        setGuestInfo,
        buyNowItem,
        setBuyNow,
        updateBuyNowQuantity,
        clearBuyNow,
        cartCount,
        cartItems,
        loginDemo,
        logout,
        setCartCount: () => {},
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        resetDemoCart,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
