import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  Building2,
  GraduationCap,
  School,
  BarChart3,
  UserCog,
} from 'lucide-react';
import { useAuthStore } from '../../lib/store';
import type { MenuItem } from '../../types';

const getMenuItems = (isAdmin: boolean): MenuItem[] => {
  const baseItems: MenuItem[] = [
    { name: 'Tableau de bord', path: '/dashboard', icon: LayoutDashboard, exact: true },
    { name: 'Catalogue', path: '/dashboard/catalog', icon: BookOpen },
    { name: 'Sessions', path: '/dashboard/sessions', icon: Calendar },
    { name: 'Entreprises', path: '/dashboard/companies', icon: Building2 },
    { name: 'Participants', path: '/dashboard/participants', icon: GraduationCap },
    { name: 'Formateurs', path: '/dashboard/trainers', icon: School },
    { name: 'Rapports', path: '/dashboard/reports', icon: BarChart3 },
  ];

  if (isAdmin) {
    baseItems.push({ name: 'Gestion Utilisateurs', path: '/dashboard/users', icon: UserCog });
  }

  return baseItems;
};

export default function Sidebar() {
  const user = useAuthStore((state) => state.user);
  const location = useLocation();
  const menuItems = getMenuItems(user?.role === 'admin');

  return (
    <aside className="bg-gray-900 text-white w-64 min-h-screen p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-center">FormationPro</h1>
      </div>
      <nav>
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = item.exact 
              ? location.pathname === item.path
              : location.pathname.startsWith(item.path);

            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}