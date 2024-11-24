import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import AuthGuard from './components/auth/AuthGuard';
import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import Dashboard from './pages/Dashboard';
import CatalogPage from './pages/catalog/CatalogPage';
import SessionsPage from './pages/sessions/SessionsPage';
import RegistrationsPage from './pages/registrations/RegistrationsPage';
import CompaniesPage from './pages/companies/CompaniesPage';
import ParticipantsPage from './pages/participants/ParticipantsPage';
import TrainersPage from './pages/trainers/TrainersPage';
import ReportsPage from './pages/reports/ReportsPage';
import UsersPage from './pages/users/UsersPage';
import UserProfilePage from './pages/users/UserProfilePage';
import SettingsPage from './pages/settings/SettingsPage';
import SpecialtiesPage from './pages/settings/SpecialtiesPage';
import AdminGuard from './components/auth/AdminGuard';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <AuthGuard>
              <Layout />
            </AuthGuard>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="catalog" element={<CatalogPage />} />
          <Route path="sessions" element={<SessionsPage />} />
          <Route path="registrations" element={<RegistrationsPage />} />
          <Route path="companies" element={<CompaniesPage />} />
          <Route path="participants" element={<ParticipantsPage />} />
          <Route path="trainers" element={<TrainersPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route
            path="users"
            element={
              <AdminGuard>
                <UsersPage />
              </AdminGuard>
            }
          />
          <Route path="profile" element={<UserProfilePage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="settings/specialties" element={<SpecialtiesPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}