import React from 'react';
import { Link } from 'react-router-dom';
import { Tag, Users, Bell, Shield, Palette } from 'lucide-react';

const settingsSections = [
  {
    id: 'specialties',
    name: 'Spécialités',
    description: 'Gérer les spécialités et leurs groupes',
    icon: Tag,
    path: '/dashboard/settings/specialties',
  },
  {
    id: 'users',
    name: 'Utilisateurs',
    description: 'Gérer les utilisateurs et leurs rôles',
    icon: Users,
    path: '/dashboard/users',
  },
  {
    id: 'notifications',
    name: 'Notifications',
    description: 'Configurer les notifications',
    icon: Bell,
    path: '/dashboard/settings/notifications',
  },
  {
    id: 'security',
    name: 'Sécurité',
    description: 'Paramètres de sécurité',
    icon: Shield,
    path: '/dashboard/settings/security',
  },
  {
    id: 'appearance',
    name: 'Apparence',
    description: 'Personnaliser l\'interface',
    icon: Palette,
    path: '/dashboard/settings/appearance',
  },
];

export default function SettingsPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Paramètres</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {settingsSections.map((section) => (
          <Link
            key={section.id}
            to={section.path}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:border-primary-500 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary-50 rounded-lg">
                <section.icon className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h2 className="text-lg font-medium text-gray-900">
                  {section.name}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {section.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}