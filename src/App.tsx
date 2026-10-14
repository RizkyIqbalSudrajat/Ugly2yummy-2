/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SupplierAuthProvider } from './context/SupplierAuthContext';
import { StaffAuthProvider } from './context/StaffAuthContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ScrollToTop } from './components/layout/ScrollToTop';
import { WhatsAppButton } from './components/layout/WhatsAppButton';

// Pages Pembeli & Publik
import { LandingPage } from './pages/LandingPage';
import { AuthDemoPage } from './pages/AuthDemoPage';
import { CatalogPage } from './pages/CatalogPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { IngredientsPage } from './pages/IngredientsPage';
import { IngredientDetailPage } from './pages/IngredientDetailPage';
import { BuyerDashboardPage } from './pages/BuyerDashboardPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { MyOrdersPage } from './pages/MyOrdersPage';
import { MyImpactPage } from './pages/MyImpactPage';
import { ProfilePage } from './pages/ProfilePage';
import { NotFoundPage } from './pages/NotFoundPage';

// Portal Supplier Components & Pages
import { SupplierProtectedRoute } from './components/supplier/SupplierProtectedRoute';
import { SupplierLayout } from './components/supplier/SupplierLayout';
import { SupplierLoginPage } from './pages/supplier/SupplierLoginPage';
import { SupplierDashboardPage } from './pages/supplier/SupplierDashboardPage';
import { SupplierNewOfferPage } from './pages/supplier/SupplierNewOfferPage';
import { SupplierMyOffersPage } from './pages/supplier/SupplierMyOffersPage';
import { SupplierSchedulePage } from './pages/supplier/SupplierSchedulePage';
import { SupplierTransactionsPage } from './pages/supplier/SupplierTransactionsPage';
import { SupplierPayoutsPage } from './pages/supplier/SupplierPayoutsPage';
import { SupplierImpactPage } from './pages/supplier/SupplierImpactPage';
import { SupplierOfferDetailPage } from './pages/supplier/SupplierOfferDetailPage';

// Portal Internal Components & Pages
import { StaffProtectedRoute } from './components/internal/StaffProtectedRoute';
import { WorkerLayout } from './components/internal/WorkerLayout';
import { StaffLoginPage } from './pages/internal/StaffLoginPage';
import { AdminPlaceholderPage } from './pages/internal/AdminPlaceholderPage';
import { WorkerOverviewPage } from './pages/internal/worker/WorkerOverviewPage';
import { WorkerReceivingPage } from './pages/internal/worker/WorkerReceivingPage';
import { WorkerQCPage } from './pages/internal/worker/WorkerQCPage';
import { WorkerCalculationPage } from './pages/internal/worker/WorkerCalculationPage';
import { WorkerProductionPage } from './pages/internal/worker/WorkerProductionPage';
import { WorkerInventoryPage } from './pages/internal/worker/WorkerInventoryPage';
import { WorkerTasksPage } from './pages/internal/worker/WorkerTasksPage';

function AppRoutes() {
  const location = useLocation();
  const isSupplierArea = location.pathname.startsWith('/supplier');
  const isInternalArea = location.pathname.startsWith('/internal');

  // Rute Khusus Portal Supplier: Bersih TANPA Navbar, Footer, dan Tombol WhatsApp Pembeli
  if (isSupplierArea) {
    return (
      <Routes>
        {/* Halaman Masuk Supplier (Publik Portal) */}
        <Route path="/supplier/masuk" element={<SupplierLoginPage />} />

        {/* Protected Supplier Dashboard & Menu Pages */}
        <Route
          path="/supplier"
          element={
            <SupplierProtectedRoute>
              <SupplierLayout />
            </SupplierProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/supplier/dashboard" replace />} />
          <Route path="dashboard" element={<SupplierDashboardPage />} />
          <Route path="ringkasan" element={<Navigate to="/supplier/dashboard" replace />} />
          <Route path="ajukan-penawaran" element={<SupplierNewOfferPage />} />
          <Route path="penawaran-saya" element={<SupplierMyOffersPage />} />
          <Route path="penawaran/:id" element={<SupplierOfferDetailPage />} />
          <Route path="jadwal" element={<SupplierSchedulePage />} />
          <Route path="riwayat-transaksi" element={<SupplierTransactionsPage />} />
          <Route path="pembayaran" element={<SupplierPayoutsPage />} />
          <Route path="dampak-saya" element={<SupplierImpactPage />} />
          {/* Fallback internal supplier */}
          <Route path="*" element={<Navigate to="/supplier/dashboard" replace />} />
        </Route>
      </Routes>
    );
  }

  // Rute Khusus Portal Internal: Bersih TANPA Navbar, Footer, dan Tombol WhatsApp Pembeli
  if (isInternalArea) {
    return (
      <Routes>
        {/* Halaman Masuk Internal (Publik Portal Internal) */}
        <Route path="/internal/masuk" element={<StaffLoginPage />} />

        {/* Protected Worker Portal (Role Pekerja) */}
        <Route
          path="/internal/pekerja"
          element={
            <StaffProtectedRoute allowedRole="pekerja">
              <WorkerLayout />
            </StaffProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/internal/pekerja/ringkasan" replace />} />
          <Route path="ringkasan" element={<WorkerOverviewPage />} />
          <Route path="penerimaan" element={<WorkerReceivingPage />} />
          <Route path="seleksi" element={<WorkerQCPage />} />
          <Route path="kalkulasi" element={<WorkerCalculationPage />} />
          <Route path="produksi" element={<WorkerProductionPage />} />
          <Route path="stok" element={<WorkerInventoryPage />} />
          <Route path="tugas" element={<WorkerTasksPage />} />
          {/* Fallback internal worker */}
          <Route path="*" element={<Navigate to="/internal/pekerja/ringkasan" replace />} />
        </Route>

        {/* Protected Admin Portal (Role Admin) */}
        <Route
          path="/internal/admin"
          element={
            <StaffProtectedRoute allowedRole="admin">
              <AdminPlaceholderPage />
            </StaffProtectedRoute>
          }
        />

        {/* Fallback internal default */}
        <Route path="/internal" element={<Navigate to="/internal/masuk" replace />} />
        <Route path="/internal/*" element={<Navigate to="/internal/masuk" replace />} />
      </Routes>
    );
  }

  // Rute Pembeli & Publik
  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBFD] text-[#1D1D1F] selection:bg-[#2E7D4F]/20 selection:text-[#2E7D4F]">
      {/* Sticky Blur Navbar */}
      <Navbar />

      {/* Main App Content */}
      <main className="flex-1">
        <Routes>
          {/* Publik */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/masuk" element={<AuthDemoPage />} />
          <Route path="/daftar" element={<AuthDemoPage />} />
          <Route path="/produk" element={<CatalogPage />} />
          <Route path="/produk/:id" element={<ProductDetailPage />} />
          <Route path="/cerita-bahan" element={<IngredientsPage />} />
          <Route path="/cerita-bahan/:id" element={<IngredientDetailPage />} />

          {/* Area Pembeli */}
          <Route path="/beranda" element={<BuyerDashboardPage />} />
          <Route path="/keranjang" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/pesanan-berhasil" element={<OrderSuccessPage />} />
          <Route path="/pesanan-saya" element={<MyOrdersPage />} />
          <Route path="/dampak-saya" element={<MyImpactPage />} />
          <Route path="/profil" element={<ProfilePage />} />

          {/* 404 Senada */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      {/* Floating WhatsApp Action */}
      <WhatsAppButton />

      {/* Minimalist Brand Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SupplierAuthProvider>
        <StaffAuthProvider>
          <HashRouter>
            <ScrollToTop />
            <AppRoutes />
          </HashRouter>
        </StaffAuthProvider>
      </SupplierAuthProvider>
    </AuthProvider>
  );
}
