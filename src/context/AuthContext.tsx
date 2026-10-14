import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, CartItem, Product } from '../types';
import { DEMO_USER, PRODUCTS } from '../data/dummy';

interface AuthContextType {
  isLoggedIn: boolean;
  user: UserProfile | null;
  cartCount: number;
  cartItems: CartItem[];
  loginDemo: () => void;
  logout: () => void;
  setCartCount: React.Dispatch<React.SetStateAction<number>>;
  addToCart: (product: Product) => void;
  updateQuantity: (id: string, delta: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  resetDemoCart: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'ugly2yummy_auth_state';

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
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      return saved === 'true';
    } catch {
      return false;
    }
  });

  const [cartItems, setCartItems] = useState<CartItem[]>(INITIAL_CART_ITEMS);

  // Derive cartCount dynamically from cartItems
  const cartCount = cartItems.reduce((acc, item) => acc + item.jumlah, 0);

  useEffect(() => {
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, String(isLoggedIn));
    } catch {
      // storage failed or disabled
    }
  }, [isLoggedIn]);

  const loginDemo = () => {
    setIsLoggedIn(true);
  };

  const logout = () => {
    setIsLoggedIn(false);
  };

  const addToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, jumlah: item.jumlah + 1 } : item
        );
      }
      const newItem: CartItem = {
        id: product.id,
        nama: product.nama,
        kategori: product.kategori,
        harga: product.harga,
        ukuran: product.ukuran,
        jumlah: 1,
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
            return newQty > 0 ? { ...item, jumlah: newQty } : null;
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

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
