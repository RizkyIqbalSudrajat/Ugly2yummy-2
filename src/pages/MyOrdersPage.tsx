import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../components/ui/Container';
import { SmartImage } from '../components/ui/SmartImage';
import { PRODUCTS } from '../data/dummy';
import {
  Truck,
  CheckCircle2,
  Package,
  Calendar,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Clock,
} from 'lucide-react';

interface OrderItem {
  id: string;
  orderNumber: string;
  date: string;
  status: 'Dikirim' | 'Selesai';
  products: {
    productId: string;
    name: string;
    quantity: number;
    size: string;
    price: number;
    savedKg: number;
  }[];
  totalPrice: number;
  totalSavedKg: number;
  shippingDetail: string;
}

const DUMMY_ORDERS: OrderItem[] = [
  {
    id: 'ord-1',
    orderNumber: '#UY-8241',
    date: 'Hari ini, 09:30 WIB',
    status: 'Dikirim',
    products: [
      {
        productId: 'saus-tomat-panggang',
        name: 'Saus Tomat Panggang',
        quantity: 2,
        size: '250 ml',
        price: 35000,
        savedKg: 0.5,
      },
      {
        productId: 'banana-bread-pisang-bintik',
        name: 'Banana Bread Pisang Bintik',
        quantity: 1,
        size: '500 g',
        price: 55000,
        savedKg: 0.6,
      },
    ],
    totalPrice: 125000,
    totalSavedKg: 1.6,
    shippingDetail: 'Sedang diantar oleh kurir ramah lingkungan ke Jakarta Selatan (Est. tiba 15:00 - 18:00 WIB)',
  },
  {
    id: 'ord-2',
    orderNumber: '#UY-7819',
    date: '24 Sep 2026',
    status: 'Selesai',
    products: [
      {
        productId: 'selai-stroberi-ciwidey',
        name: 'Selai Stroberi Ciwidey',
        quantity: 2,
        size: '200 g',
        price: 40000,
        savedKg: 0.5,
      },
    ],
    totalPrice: 80000,
    totalSavedKg: 1.0,
    shippingDetail: 'Diterima oleh Nadia Putri pada 25 Sep 2026',
  },
  {
    id: 'ord-3',
    orderNumber: '#UY-6540',
    date: '10 Sep 2026',
    status: 'Selesai',
    products: [
      {
        productId: 'keripik-wortel-panggang',
        name: 'Keripik Wortel Panggang',
        quantity: 2,
        size: '100 g',
        price: 25000,
        savedKg: 0.3,
      },
      {
        productId: 'selai-mangga-mungil',
        name: 'Selai Mangga Mungil',
        quantity: 1,
        size: '200 g',
        price: 38000,
        savedKg: 0.5,
      },
    ],
    totalPrice: 88000,
    totalSavedKg: 1.1,
    shippingDetail: 'Diterima oleh Nadia Putri pada 12 Sep 2026',
  },
  {
    id: 'ord-4',
    orderNumber: '#UY-5201',
    date: '18 Ags 2026',
    status: 'Selesai',
    products: [
      {
        productId: 'smoothie-mangga-pisang',
        name: 'Smoothie Mangga Pisang',
        quantity: 2,
        size: '250 ml',
        price: 30000,
        savedKg: 0.4,
      },
    ],
    totalPrice: 60000,
    totalSavedKg: 0.8,
    shippingDetail: 'Diterima oleh Nadia Putri pada 19 Ags 2026',
  },
];

export const MyOrdersPage: React.FC = () => {
  const [filter, setFilter] = useState<'Semua' | 'Dikirim' | 'Selesai'>('Semua');

  const filteredOrders = DUMMY_ORDERS.filter((order) => {
    if (filter === 'Semua') return true;
    return order.status === filter;
  });

  return (
    <div className="py-12 sm:py-20 md:py-24">
      <Container>
        {/* Header */}
        <div className="max-w-3xl mb-10 sm:mb-14">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#2E7D4F] block mb-2">
            Riwayat Pembelian
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#1D1D1F]">
            Pesanan Saya
          </h1>
          <p className="mt-3 text-base text-[#6E6E73] leading-relaxed">
            Pantau status pengiriman sajian upcycled Anda dan total pangan yang telah terselamatkan.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 no-scrollbar">
          {(['Semua', 'Dikirim', 'Selesai'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                filter === tab
                  ? 'bg-[#1D1D1F] text-white shadow-none'
                  : 'bg-white text-[#6E6E73] border border-[#E8E8ED] hover:text-[#1D1D1F] hover:bg-[#F5F5F7]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Order Cards List */}
        <div className="space-y-6">
          {filteredOrders.map((order) => {
            const isDelivering = order.status === 'Dikirim';

            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-[#E8E8ED] p-6 sm:p-8 shadow-none space-y-6"
              >
                {/* Header Pesanan */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#E8E8ED]/70">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-bold text-[#1D1D1F]">
                      {order.orderNumber}
                    </span>
                    <span className="text-xs text-[#6E6E73]">· {order.date}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                        isDelivering
                          ? 'bg-[#EBF4EE] text-[#2E7D4F]'
                          : 'bg-[#F5F5F7] text-[#1D1D1F]'
                      }`}
                    >
                      {isDelivering ? (
                        <>
                          <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D4F] animate-pulse" />
                          <span>Sedang Dikirim</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D4F]" />
                          <span>Selesai</span>
                        </>
                      )}
                    </span>
                  </div>
                </div>

                {/* Items in Order */}
                <div className="space-y-4">
                  {order.products.map((p, idx) => {
                    const prodData = PRODUCTS.find((item) => item.id === p.productId);

                    return (
                      <div key={idx} className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl overflow-hidden bg-[#F5F5F7] shrink-0 border border-[#E8E8ED]/50">
                          <SmartImage
                            src={prodData?.gambar}
                            alt={p.name}
                            fallbackEmoji={prodData?.gambarEmojiFallback || '🌿'}
                            aspectRatio="1:1"
                            containerClassName="w-full h-full"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-[#1D1D1F] truncate">
                            {p.name}
                          </h4>
                          <p className="text-xs text-[#6E6E73]">
                            {p.quantity}x {p.size} · Rp{p.price.toLocaleString('id-ID')}
                          </p>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-sm font-bold text-[#1D1D1F] tabular-nums">
                            Rp{(p.price * p.quantity).toLocaleString('id-ID')}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Delivery Note & Footer Summary */}
                <div className="pt-5 border-t border-[#E8E8ED]/70 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-2.5 text-xs text-[#6E6E73] max-w-lg">
                    {isDelivering ? (
                      <Truck className="w-4 h-4 text-[#2E7D4F] shrink-0 mt-0.5" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-[#2E7D4F] shrink-0 mt-0.5" />
                    )}
                    <span>{order.shippingDetail}</span>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-[#2E7D4F] bg-[#EBF4EE] px-3 py-1 rounded-full">
                      <Sparkles className="w-3 h-3" />
                      <span>{order.totalSavedKg} kg diselamatkan</span>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-[#6E6E73] block">Total Belanja</span>
                      <span className="text-base sm:text-lg font-extrabold text-[#1D1D1F] tabular-nums">
                        Rp{order.totalPrice.toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Belanja Lagi Link */}
        <div className="mt-12 text-center">
          <Link
            to="/produk"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1D1D1F] hover:bg-[#2E7D4F] text-white text-xs sm:text-sm font-semibold transition-colors duration-200"
          >
            <span>Jelajahi Produk Baru</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </Container>
    </div>
  );
};
