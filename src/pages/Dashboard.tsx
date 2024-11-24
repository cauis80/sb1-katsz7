import React from 'react';
import { Users, BookOpen, Calendar, TrendingUp, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const stats = [
  {
    name: 'Participants actifs',
    value: '2,847',
    change: '+12.5%',
    icon: Users,
  },
  {
    name: 'Formations en cours',
    value: '24',
    change: '+4.3%',
    icon: BookOpen,
  },
  {
    name: 'Sessions planifiées',
    value: '89',
    change: '+28.4%',
    icon: Calendar,
  },
  {
    name: 'Taux de satisfaction',
    value: '94.8%',
    change: '+3.2%',
    icon: TrendingUp,
  },
];

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Tableau de bord</h1>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
            Exporter
          </button>
          <button 
            onClick={() => navigate('/dashboard/sessions')}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700"
          >
            Nouvelle session
          </button>
        </div>
      </div>

      {/* Rest of the dashboard code remains the same */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  {stat.name}
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  {stat.value}
                </dd>
              </div>
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-50">
                <stat.icon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm font-medium text-green-600">
                {stat.change}
              </span>
              <span className="text-sm text-gray-500"> vs mois dernier</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Sessions à venir
          </h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <h3 className="font-medium text-gray-900">
                    Formation React Avancé
                  </h3>
                  <p className="text-sm text-gray-500">12 participants</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    15 Mars 2024
                  </p>
                  <p className="text-sm text-gray-500">9:00 - 17:00</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Dernières évaluations
          </h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <h3 className="font-medium text-gray-900">
                    Formation TypeScript
                  </h3>
                  <p className="text-sm text-gray-500">Note moyenne: 4.8/5</p>
                </div>
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((j) => (
                    <div
                      key={j}
                      className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center"
                    >
                      <User className="w-4 h-4 text-gray-600" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}