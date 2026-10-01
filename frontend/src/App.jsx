import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import { PublicLayout } from './components/layout/PublicLayout';
import { AdminLayout } from './components/layout/AdminLayout';

// Public Pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { MenuPage } from './pages/MenuPage';
import { GalleryPage } from './pages/GalleryPage';
import { OurSpacePage } from './pages/OurSpacePage';
import { ReservationsPage } from './pages/ReservationsPage';
import { ContactPage } from './pages/ContactPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminHomepageCMS } from './pages/admin/AdminHomepageCMS';
import { AdminAboutCMS } from './pages/admin/AdminAboutCMS';
import { AdminMenuCMS } from './pages/admin/AdminMenuCMS';
import { AdminCategoriesCMS } from './pages/admin/AdminCategoriesCMS';
import { AdminGalleryCMS } from './pages/admin/AdminGalleryCMS';
import { AdminReservationsPage } from './pages/admin/AdminReservationsPage';
import { AdminContactCMS } from './pages/admin/AdminContactCMS';
import { AdminOpeningHoursCMS } from './pages/admin/AdminOpeningHoursCMS';
import { AdminSettingsCMS } from './pages/admin/AdminSettingsCMS';
import { AdminProfilePage } from './pages/admin/AdminProfilePage';
import { AdminInquiriesPage } from './pages/admin/AdminInquiriesPage';

export const App = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/our-space" element={<OurSpacePage />} />
        <Route path="/reservations" element={<ReservationsPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Route>

      {/* Admin Login */}
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* Protected Admin Console */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="homepage" element={<AdminHomepageCMS />} />
        <Route path="about" element={<AdminAboutCMS />} />
        <Route path="menu" element={<AdminMenuCMS />} />
        <Route path="categories" element={<AdminCategoriesCMS />} />
        <Route path="gallery" element={<AdminGalleryCMS />} />
        <Route path="reservations" element={<AdminReservationsPage />} />
        <Route path="inquiries" element={<AdminInquiriesPage />} />
        <Route path="contact" element={<AdminContactCMS />} />
        <Route path="hours" element={<AdminOpeningHoursCMS />} />
        <Route path="settings" element={<AdminSettingsCMS />} />
        <Route path="profile" element={<AdminProfilePage />} />
      </Route>

      {/* 404 Catch-All */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;
